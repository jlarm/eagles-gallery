<script setup lang="ts">
import { Head, Link, router, usePage } from '@inertiajs/vue3';
import { CalendarDays, CheckCircle2, ImagePlus, Loader2, Star, Trash2, Upload, X, XCircle } from 'lucide-vue-next';
import { ref, watch } from 'vue';
import { destroy as destroyPhoto, presign as presignAction, reorder as reorderAction, setCover, store as storeAction } from '@/actions/App/Http/Controllers/PhotoController';
import { show as showTournament } from '@/actions/App/Http/Controllers/TournamentController';
import { index as galleryIndex } from '@/actions/App/Http/Controllers/GalleryController';
import { Button } from '@/components/ui/button';

type Photo = {
    id: number;
    filename: string;
    thumbnail_url: string | null;
    web_url: string | null;
    is_cover: boolean;
    sort_order: number;
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

type UploadItem = {
    file: File;
    preview: string;
    status: 'pending' | 'presigning' | 'uploading' | 'done' | 'error';
    progress: number;
    path: string | null;
    errorMessage: string | null;
};

const props = defineProps<{ album: Album }>();

defineOptions({
    layout: {
        breadcrumbs: [{ title: 'Gallery', href: galleryIndex() }],
    },
});

const page = usePage();
const isAuthenticated = !!page.props.auth?.user;

// Upload state
const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const uploadItems = ref<UploadItem[]>([]);
const isUploading = ref(false);

function onFileSelect(event: Event) {
    addFiles(Array.from((event.target as HTMLInputElement).files ?? []));
    if (fileInput.value) fileInput.value.value = '';
}

function onDrop(event: DragEvent) {
    isDragging.value = false;
    addFiles(
        Array.from(event.dataTransfer?.files ?? []).filter((f) => f.type.startsWith('image/')),
    );
}

function addFiles(files: File[]) {
    files.forEach((file) => {
        uploadItems.value.push({
            file,
            preview: URL.createObjectURL(file),
            status: 'pending',
            progress: 0,
            path: null,
            errorMessage: null,
        });
    });
}

function removeItem(index: number) {
    URL.revokeObjectURL(uploadItems.value[index].preview);
    uploadItems.value.splice(index, 1);
}

function getXsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

async function getPresignedUrl(item: UploadItem): Promise<{ url: string; headers: Record<string, string>; path: string }> {
    const res = await fetch(presignAction.url(props.album), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-XSRF-TOKEN': getXsrfToken(),
        },
        body: JSON.stringify({
            filename: item.file.name,
            content_type: item.file.type || 'image/jpeg',
        }),
    });

    if (!res.ok) {
        throw new Error(`Presign failed: ${res.statusText}`);
    }

    return res.json();
}

function putToSpaces(
    file: File,
    url: string,
    headers: Record<string, string>,
    onProgress: (pct: number) => void,
): Promise<void> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                onProgress(Math.round((e.loaded / e.total) * 100));
            }
        });

        xhr.addEventListener('load', () => {
            xhr.status < 400 ? resolve() : reject(new Error(`Upload failed: ${xhr.status}`));
        });

        xhr.addEventListener('error', () => reject(new Error('Network error during upload')));

        xhr.open('PUT', url);
        Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value));
        xhr.send(file);
    });
}

async function startUpload() {
    if (isUploading.value || !uploadItems.value.length) return;

    isUploading.value = true;

    // Process all files concurrently
    await Promise.all(
        uploadItems.value.map(async (item) => {
            try {
                item.status = 'presigning';
                const { url, headers, path } = await getPresignedUrl(item);
                item.path = path;

                item.status = 'uploading';
                await putToSpaces(item.file, url, headers, (pct) => {
                    item.progress = pct;
                });

                item.status = 'done';
            } catch (err) {
                item.status = 'error';
                item.errorMessage = err instanceof Error ? err.message : 'Upload failed';
            }
        }),
    );

    const confirmed = uploadItems.value
        .filter((item) => item.status === 'done' && item.path)
        .map((item) => ({ filename: item.file.name, path: item.path as string }));

    if (confirmed.length) {
        router.post(
            storeAction.url(props.album),
            { photos: confirmed },
            {
                onSuccess() {
                    uploadItems.value.forEach((item) => URL.revokeObjectURL(item.preview));
                    uploadItems.value = [];
                    isUploading.value = false;
                },
                onError() {
                    isUploading.value = false;
                },
            },
        );
    } else {
        isUploading.value = false;
    }
}

// Delete
function confirmDelete(photo: Photo) {
    if (!confirm('Delete this photo? This cannot be undone.')) return;
    router.delete(destroyPhoto.url({ album: props.album.id, photo: photo.id }));
}

// Reorder
const localPhotos = ref<Photo[]>([...props.album.photos]);
const draggedId = ref<number | null>(null);

watch(
    () => props.album.photos,
    (photos) => { localPhotos.value = [...photos]; },
);

function onDragStart(photoId: number) {
    draggedId.value = photoId;
}

function onDragOver(targetId: number) {
    if (draggedId.value === null || draggedId.value === targetId) return;

    const fromIndex = localPhotos.value.findIndex((p) => p.id === draggedId.value);
    const toIndex = localPhotos.value.findIndex((p) => p.id === targetId);

    if (fromIndex === -1 || toIndex === -1) return;

    const updated = [...localPhotos.value];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    localPhotos.value = updated;
}

function onDragEnd() {
    if (draggedId.value === null) return;
    draggedId.value = null;

    router.post(
        reorderAction.url(props.album),
        { ids: localPhotos.value.map((p) => p.id) },
        { preserveScroll: true, only: ['album'] },
    );
}

// Lightbox
const lightboxPhoto = ref<Photo | null>(null);
</script>

<template>
    <Head :title="`vs ${album.opponent}`" />

    <div class="flex flex-col gap-6 p-4">
        <!-- Header -->
        <div>
            <div class="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Link
                    v-if="album.tournament"
                    :href="showTournament(album.tournament)"
                    class="hover:text-foreground"
                >
                    {{ album.tournament.name }}
                </Link>
                <span v-if="album.tournament">/</span>
                <span class="flex items-center gap-1">
                    <CalendarDays class="h-3.5 w-3.5" />
                    {{ new Date(album.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
                </span>
            </div>
            <h1 class="mt-1 text-2xl font-semibold tracking-tight">vs {{ album.opponent }}</h1>
            <p class="text-sm text-muted-foreground">{{ album.photos.length }} photos</p>
        </div>

        <!-- Upload zone (auth only) -->
        <div
            v-if="isAuthenticated"
            class="rounded-xl border border-dashed border-sidebar-border/70 dark:border-sidebar-border"
        >
            <!-- Drop target -->
            <div
                class="flex cursor-pointer flex-col items-center gap-3 p-6 transition-colors"
                :class="isDragging ? 'bg-primary/5' : ''"
                @dragover.prevent="isDragging = true"
                @dragleave="isDragging = false"
                @drop.prevent="onDrop"
                @click="fileInput?.click()"
            >
                <Upload class="h-8 w-8 text-muted-foreground" />
                <div class="text-center">
                    <p class="text-sm font-medium">
                        Drag photos here or <span class="text-primary underline underline-offset-2">browse</span>
                    </p>
                    <p class="mt-0.5 text-xs text-muted-foreground">JPG, PNG, WEBP — uploaded directly to storage</p>
                </div>
                <input
                    ref="fileInput"
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    class="hidden"
                    @change="onFileSelect"
                />
            </div>

            <!-- Queue -->
            <div
                v-if="uploadItems.length"
                class="border-t border-sidebar-border/70 p-4 dark:border-sidebar-border"
            >
                <div class="mb-3 space-y-2">
                    <div
                        v-for="(item, index) in uploadItems"
                        :key="index"
                        class="flex items-center gap-3 rounded-lg border border-sidebar-border/50 p-2 dark:border-sidebar-border"
                    >
                        <!-- Preview -->
                        <div class="h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                            <img :src="item.preview" :alt="item.file.name" class="h-full w-full object-cover" />
                        </div>

                        <!-- Info + progress -->
                        <div class="min-w-0 flex-1">
                            <p class="truncate text-sm font-medium">{{ item.file.name }}</p>
                            <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                                <div
                                    class="h-full rounded-full transition-all duration-300"
                                    :class="{
                                        'bg-primary': item.status === 'uploading',
                                        'bg-green-500': item.status === 'done',
                                        'bg-destructive': item.status === 'error',
                                        'bg-muted-foreground/30': item.status === 'pending' || item.status === 'presigning',
                                    }"
                                    :style="{ width: item.status === 'done' ? '100%' : `${item.progress}%` }"
                                />
                            </div>
                            <p v-if="item.errorMessage" class="mt-0.5 truncate text-xs text-destructive">
                                {{ item.errorMessage }}
                            </p>
                        </div>

                        <!-- Status icon -->
                        <div class="shrink-0 text-muted-foreground">
                            <CheckCircle2 v-if="item.status === 'done'" class="h-4 w-4 text-green-500" />
                            <XCircle v-else-if="item.status === 'error'" class="h-4 w-4 text-destructive" />
                            <Loader2 v-else-if="item.status === 'presigning' || item.status === 'uploading'" class="h-4 w-4 animate-spin" />
                            <button
                                v-else
                                type="button"
                                class="rounded-full p-0.5 hover:bg-muted"
                                @click.stop="removeItem(index)"
                            >
                                <X class="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <p class="text-sm text-muted-foreground">
                        {{ uploadItems.length }} file{{ uploadItems.length === 1 ? '' : 's' }} queued
                    </p>
                    <Button size="sm" :disabled="isUploading" @click="startUpload">
                        <Loader2 v-if="isUploading" class="mr-2 h-4 w-4 animate-spin" />
                        <ImagePlus v-else class="mr-2 h-4 w-4" />
                        {{ isUploading ? 'Uploading...' : 'Upload' }}
                    </Button>
                </div>
            </div>
        </div>

        <!-- Photo grid -->
        <div v-if="localPhotos.length" class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <div
                v-for="photo in localPhotos"
                :key="photo.id"
                class="group relative aspect-square overflow-hidden rounded-lg bg-muted transition-opacity"
                :class="{ 'opacity-40': draggedId === photo.id, 'cursor-grab': isAuthenticated }"
                :draggable="isAuthenticated"
                @dragstart="onDragStart(photo.id)"
                @dragover.prevent="onDragOver(photo.id)"
                @dragend="onDragEnd"
            >
                <button
                    type="button"
                    class="h-full w-full"
                    @click="lightboxPhoto = photo"
                >
                    <img
                        v-if="photo.thumbnail_url"
                        :src="photo.thumbnail_url"
                        :alt="photo.filename"
                        class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    <div v-else class="flex h-full items-center justify-center">
                        <Loader2 class="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                </button>

                <!-- Cover star: filled + always visible if cover; hollow + hover-only if not -->
                <Link
                    v-if="isAuthenticated && photo.thumbnail_url"
                    :href="setCover.url({ album: album.id, photo: photo.id })"
                    method="post"
                    as="button"
                    class="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 group-hover:flex"
                    :class="photo.is_cover ? 'flex text-yellow-400' : 'hidden text-white/70 hover:text-yellow-400'"
                    :title="photo.is_cover ? 'Remove cover' : 'Set as cover'"
                >
                    <Star class="h-3 w-3" :class="photo.is_cover ? 'fill-current' : ''" />
                </Link>
                <div v-else-if="photo.is_cover" class="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-yellow-400">
                    <Star class="h-3 w-3 fill-current" />
                </div>

                <!-- Delete button (auth only, shown on hover) -->
                <button
                    v-if="isAuthenticated"
                    type="button"
                    class="absolute bottom-1.5 right-1.5 hidden rounded-full bg-black/60 p-1 text-white/70 hover:text-red-400 group-hover:flex"
                    title="Delete photo"
                    @click.stop="confirmDelete(photo)"
                >
                    <Trash2 class="h-3 w-3" />
                </button>
            </div>
        </div>

        <div
            v-else-if="!isAuthenticated"
            class="flex flex-col items-center justify-center py-20 text-center"
        >
            <ImagePlus class="mb-4 h-12 w-12 text-muted-foreground/40" />
            <p class="text-lg font-medium">No photos yet</p>
        </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
        <div
            v-if="lightboxPhoto"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            @click.self="lightboxPhoto = null"
        >
            <button
                type="button"
                class="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                @click="lightboxPhoto = null"
            >
                <X class="h-5 w-5" />
            </button>
            <img
                :src="lightboxPhoto.web_url ?? lightboxPhoto.thumbnail_url ?? ''"
                :alt="lightboxPhoto.filename"
                class="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            />
        </div>
    </Teleport>
</template>
