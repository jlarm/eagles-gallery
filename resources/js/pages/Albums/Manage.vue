<script setup lang="ts">
import { Head, router, setLayoutProps, usePoll } from '@inertiajs/vue3';
import { CalendarDays, Eye, FolderX, ImagePlus, Loader2, Star, Trash2, Upload } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';
import { manage as manageAlbum } from '@/actions/App/Http/Controllers/AlbumController';
import { manage as manageTournament } from '@/actions/App/Http/Controllers/TournamentController';
import { index as galleryIndex } from '@/actions/App/Http/Controllers/GalleryController';
import { presign, store as storePhotos, setCover, destroy as destroyPhoto } from '@/actions/App/Http/Controllers/PhotoController';
import { destroy as destroyAlbum } from '@/actions/App/Http/Controllers/AlbumController';
import { Button } from '@/components/ui/button';

type Photo = {
    id: number;
    filename: string;
    thumbnail_url: string | null;
    web_url: string | null;
    is_cover: boolean;
    sort_order: number;
    view_count: number;
};

type Tournament = { id: number; name: string; slug: string } | null;

type Album = {
    id: number;
    opponent: string;
    date: string;
    tournament: Tournament;
    photos: Photo[];
    cover_photo: Photo | null;
};

type QueueItem = {
    file: File;
    status: 'pending' | 'uploading' | 'done' | 'error';
    progress: number;
};

const props = defineProps<{ album: Album }>();

const breadcrumbs = [
    { title: 'Gallery', href: galleryIndex() },
    ...(props.album.tournament
        ? [{ title: props.album.tournament.name, href: manageTournament(props.album.tournament) }]
        : []),
    { title: `vs ${props.album.opponent}`, href: manageAlbum(props.album) },
];

setLayoutProps({ breadcrumbs });

const hasUnprocessed = computed(() => props.album.photos.some((p) => !p.thumbnail_url));

const { start: startPolling, stop: stopPolling } = usePoll(
    3000,
    { only: ['album'] },
    { autoStart: false },
);

watch(
    hasUnprocessed,
    (unprocessed) => {
        if (unprocessed) startPolling();
        else stopPolling();
    },
    { immediate: true },
);

// Upload queue
const queue = ref<QueueItem[]>([]);
const uploading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

function onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    for (const file of input.files) {
        queue.value.push({ file, status: 'pending', progress: 0 });
    }

    input.value = '';
    processQueue();
}

async function processQueue() {
    if (uploading.value) return;
    uploading.value = true;

    const confirmedPhotos: { filename: string; path: string }[] = [];

    for (const item of queue.value) {
        if (item.status !== 'pending') continue;
        item.status = 'uploading';

        try {
            // Get presigned URL
            const presignRes = await fetch(presign.url({ album: props.album.id }), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getXsrfToken() },
                body: JSON.stringify({ filename: item.file.name, content_type: item.file.type }),
            });

            if (!presignRes.ok) throw new Error('Presign failed');
            const { url, headers, path } = await presignRes.json();

            // Upload to S3
            await uploadToS3(item, url, headers);

            confirmedPhotos.push({ filename: item.file.name, path });
            item.status = 'done';
            item.progress = 100;
        } catch {
            item.status = 'error';
        }
    }

    uploading.value = false;

    if (confirmedPhotos.length) {
        router.post(
            storePhotos.url({ album: props.album.id }),
            { photos: confirmedPhotos },
            {
                onSuccess: () => {
                    queue.value = queue.value.filter((i) => i.status !== 'done');
                },
            },
        );
    }
}

function uploadToS3(item: QueueItem, url: string, headers: Record<string, string>): Promise<void> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', url);

        for (const [key, value] of Object.entries(headers)) {
            xhr.setRequestHeader(key, value);
        }

        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                item.progress = Math.round((e.loaded / e.total) * 100);
            }
        });

        xhr.addEventListener('load', () => (xhr.status < 300 ? resolve() : reject()));
        xhr.addEventListener('error', reject);
        xhr.send(item.file);
    });
}

function getXsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

function setAsCover(photo: Photo) {
    router.post(setCover.url({ album: props.album.id, photo: photo.id }));
}

function deletePhoto(photo: Photo) {
    if (!confirm(`Delete this photo?`)) return;
    router.delete(destroyPhoto.url({ album: props.album.id, photo: photo.id }));
}

function deleteAlbum() {
    if (!confirm(`Delete "vs ${props.album.opponent}" and all its photos? This cannot be undone.`)) return;
    router.delete(destroyAlbum.url(props.album));
}

const pendingCount = computed(() => queue.value.filter((i) => i.status === 'pending' || i.status === 'uploading').length);
</script>

<template>
    <Head :title="`Manage — vs ${album.opponent}`" />

    <div class="flex flex-col gap-6 p-4">
        <!-- Header -->
        <div class="flex items-center justify-between">
            <div>
                <p class="flex items-center gap-1 text-sm text-muted-foreground">
                    <CalendarDays class="h-3.5 w-3.5" />
                    {{ new Date(album.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
                </p>
                <h1 class="text-2xl font-semibold tracking-tight">vs {{ album.opponent }}</h1>
                <p class="text-sm text-muted-foreground">{{ album.photos.length }} photos</p>
            </div>
            <div class="flex items-center gap-2">
                <Button variant="destructive" @click="deleteAlbum">
                    <FolderX class="mr-1 h-4 w-4" />
                    Delete Game
                </Button>
                <Button @click="fileInput?.click()">
                    <Upload class="mr-1.5 h-4 w-4" />
                    Upload Photos
                </Button>
            </div>
        </div>

        <input
            ref="fileInput"
            type="file"
            accept="image/*"
            multiple
            class="hidden"
            @change="onFilesSelected"
        />

        <!-- Processing banner -->
        <div
            v-if="hasUnprocessed"
            class="flex items-center gap-2 rounded-lg border border-amber-200/20 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-600 dark:text-amber-300"
        >
            <Loader2 class="h-4 w-4 shrink-0 animate-spin" />
            Photos are being processed…
        </div>

        <!-- Upload queue -->
        <div v-if="queue.length" class="space-y-2 rounded-xl border border-border p-4">
            <p class="text-sm font-medium">
                Uploading
                <span v-if="pendingCount" class="text-muted-foreground">({{ pendingCount }} remaining)</span>
            </p>
            <div
                v-for="(item, i) in queue"
                :key="i"
                class="flex items-center gap-3"
            >
                <div class="flex-1 overflow-hidden">
                    <p class="truncate text-sm">{{ item.file.name }}</p>
                    <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                            class="h-full rounded-full transition-all duration-200"
                            :class="{
                                'bg-primary': item.status === 'uploading' || item.status === 'done',
                                'bg-destructive': item.status === 'error',
                                'bg-muted-foreground/30': item.status === 'pending',
                            }"
                            :style="{ width: `${item.progress}%` }"
                        />
                    </div>
                </div>
                <span class="shrink-0 text-xs text-muted-foreground">
                    <span v-if="item.status === 'uploading'">{{ item.progress }}%</span>
                    <span v-else-if="item.status === 'done'" class="text-green-600">Done</span>
                    <span v-else-if="item.status === 'error'" class="text-destructive">Error</span>
                    <span v-else>Pending</span>
                </span>
            </div>
        </div>

        <!-- Photo grid -->
        <div v-if="album.photos.length" class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <div
                v-for="photo in album.photos"
                :key="photo.id"
                class="group relative aspect-square overflow-hidden rounded-lg bg-muted"
            >
                <img
                    v-if="photo.thumbnail_url"
                    :src="photo.thumbnail_url"
                    :alt="photo.filename"
                    class="h-full w-full object-cover"
                />
                <div v-else class="flex h-full flex-col items-center justify-center gap-1.5">
                    <Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
                    <span class="text-xs text-muted-foreground">Processing…</span>
                </div>

                <!-- Cover badge -->
                <div
                    v-if="photo.is_cover"
                    class="absolute left-1.5 top-1.5 rounded-full bg-amber-500 px-1.5 py-0.5 text-xs font-medium text-white"
                >
                    Cover
                </div>

                <!-- View count -->
                <div class="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-full bg-black/60 px-1.5 py-0.5 text-xs text-white/80">
                    <Eye class="size-3" />
                    {{ photo.view_count }}
                </div>

                <!-- Hover actions -->
                <div class="absolute inset-0 flex items-end justify-end gap-1 bg-black/50 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                        v-if="!photo.is_cover"
                        type="button"
                        title="Set as cover"
                        class="rounded-md bg-white/10 p-1.5 text-white hover:bg-amber-500"
                        @click="setAsCover(photo)"
                    >
                        <Star class="h-3.5 w-3.5" />
                    </button>
                    <button
                        type="button"
                        title="Delete photo"
                        class="rounded-md bg-white/10 p-1.5 text-white hover:bg-destructive"
                        @click="deletePhoto(photo)"
                    >
                        <Trash2 class="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        </div>

        <div v-else-if="!queue.length" class="flex flex-col items-center justify-center py-20 text-center">
            <ImagePlus class="mb-4 h-12 w-12 text-muted-foreground/40" />
            <p class="text-lg font-medium">No photos yet</p>
            <p class="mt-1 text-sm text-muted-foreground">Upload photos to this game.</p>
            <Button class="mt-4" @click="fileInput?.click()">
                <Upload class="mr-1.5 h-4 w-4" />
                Upload Photos
            </Button>
        </div>
    </div>
</template>
