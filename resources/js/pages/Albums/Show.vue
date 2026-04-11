<script setup lang="ts">
import { Head, Link, usePoll } from '@inertiajs/vue3';
import { ArrowLeft, CalendarDays, Check, Download, ImagePlus, Link2, Loader2, X } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';
import { useCopyLink } from '@/composables/useCopyLink';
import { download as downloadPhoto } from '@/actions/App/Http/Controllers/PhotoController';
import { track as trackAnalytics } from '@/actions/App/Http/Controllers/AnalyticsController';
import { show as showTournament } from '@/actions/App/Http/Controllers/TournamentController';
import { home } from '@/routes';
import PublicLayout from '@/layouts/PublicLayout.vue';

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

const props = defineProps<{ album: Album }>();

defineOptions({ layout: PublicLayout });

const hasUnprocessed = computed(() => props.album.photos.some((p) => !p.thumbnail_url));
const processedCount = computed(() => props.album.photos.filter((p) => p.thumbnail_url).length);
const totalCount = computed(() => props.album.photos.length);
const processingProgress = computed(() => (totalCount.value > 0 ? Math.round((processedCount.value / totalCount.value) * 100) : 0));

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

const lightboxPhoto = ref<Photo | null>(null);

function openLightbox(photo: Photo) {
    lightboxPhoto.value = photo;
    fetch(trackAnalytics.url(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getXsrfToken() },
        body: JSON.stringify({ event_type: 'photo_view', trackable_id: photo.id }),
    }).catch(() => {});
}

function getXsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

function openNext() {
    if (!lightboxPhoto.value) return;
    const idx = props.album.photos.indexOf(lightboxPhoto.value);
    const next = props.album.photos[idx + 1];
    if (next) lightboxPhoto.value = next;
}

function openPrev() {
    if (!lightboxPhoto.value) return;
    const idx = props.album.photos.indexOf(lightboxPhoto.value);
    const prev = props.album.photos[idx - 1];
    if (prev) lightboxPhoto.value = prev;
}

function onLightboxKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') openNext();
    else if (e.key === 'ArrowLeft') openPrev();
    else if (e.key === 'Escape') lightboxPhoto.value = null;
}

const { copied, copyLink } = useCopyLink();
</script>

<template>
    <Head :title="`vs ${album.opponent}`" />

    <div class="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-8">
        <!-- Back -->
        <Link
            :href="album.tournament ? showTournament(album.tournament) : home()"
            class="inline-flex items-center gap-1.5 text-sm text-eagle-blue transition-colors hover:text-eagle-text"
        >
            <ArrowLeft class="size-4" />
            {{ album.tournament ? album.tournament.name : 'Back' }}
        </Link>

        <!-- Header -->
        <div>
            <p class="flex items-center gap-1 text-sm text-eagle-muted">
                <CalendarDays class="size-3.5" />
                {{ new Date(album.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
            </p>
            <div class="mt-1 flex items-center gap-4">
                <h1 class="font-display text-[clamp(1.75rem,5vw,2.5rem)] tracking-[0.08em] text-eagle-text">
                    vs {{ album.opponent }}
                </h1>
                <button
                    type="button"
                    class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-eagle-border bg-eagle-card px-3 py-1.5 text-sm text-eagle-blue transition-colors hover:border-eagle-blue/40 hover:text-eagle-text"
                    @click="copyLink"
                >
                    <Check v-if="copied" class="size-3.5 text-green-400" />
                    <Link2 v-else class="size-3.5" />
                    {{ copied ? 'Copied!' : 'Copy link' }}
                </button>
            </div>
            <p class="text-sm text-eagle-muted">{{ album.photos.length }} photos — click to view &amp; download</p>
        </div>

        <!-- Processing banner -->
        <div
            v-if="hasUnprocessed"
            class="rounded-lg border border-amber-200/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300"
        >
            <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                    <Loader2 class="size-4 shrink-0 animate-spin" />
                    Photos are being processed, check back shortly…
                </div>
                <span class="shrink-0 text-xs font-medium">{{ processedCount }} / {{ totalCount }}</span>
            </div>
            <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-amber-200/20">
                <div
                    class="h-full rounded-full bg-amber-500 transition-all duration-500"
                    :style="{ width: `${processingProgress}%` }"
                />
            </div>
        </div>

        <!-- Photo grid -->
        <div v-if="album.photos.length" class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <button
                v-for="photo in album.photos"
                :key="photo.id"
                type="button"
                class="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-muted"
                @click="openLightbox(photo)"
            >
                <img
                    v-if="photo.thumbnail_url"
                    :src="photo.thumbnail_url"
                    :alt="photo.filename"
                    class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div v-else class="flex h-full flex-col items-center justify-center gap-1.5">
                    <Loader2 class="size-6 animate-spin text-muted-foreground" />
                    <span class="text-xs text-muted-foreground">Processing…</span>
                </div>
            </button>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-20 text-center">
            <ImagePlus class="mb-4 size-12 text-eagle-border" />
            <p class="text-lg font-medium text-eagle-text">No photos yet</p>
            <p class="mt-1 text-sm text-eagle-muted">Check back soon.</p>
        </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
        <div
            v-if="lightboxPhoto"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
            tabindex="-1"
            @click.self="lightboxPhoto = null"
            @keydown="onLightboxKeydown"
        >
            <!-- Top-right controls -->
            <div class="absolute right-4 top-4 flex items-center gap-2">
                <a
                    v-if="lightboxPhoto.web_url"
                    :href="downloadPhoto.url({ album: album.id, photo: lightboxPhoto.id })"
                    class="flex cursor-pointer items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
                >
                    <Download class="size-4" />
                    Download
                </a>
                <button
                    type="button"
                    class="cursor-pointer rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                    @click="lightboxPhoto = null"
                >
                    <X class="size-5" />
                </button>
            </div>

            <!-- Prev -->
            <button
                v-if="album.photos.indexOf(lightboxPhoto) > 0"
                type="button"
                class="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                @click="openPrev"
            >
                <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>

            <!-- Next -->
            <button
                v-if="album.photos.indexOf(lightboxPhoto) < album.photos.length - 1"
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
                @click="openNext"
            >
                <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>

            <img
                :src="lightboxPhoto.web_url ?? lightboxPhoto.thumbnail_url ?? ''"
                :alt="lightboxPhoto.filename"
                class="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
            />
        </div>
    </Teleport>
</template>
