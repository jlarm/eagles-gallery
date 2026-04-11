<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { ArrowLeft, CalendarDays, Check, Images, Link2 } from 'lucide-vue-next';
import { show as showAlbum } from '@/actions/App/Http/Controllers/AlbumController';
import { home } from '@/routes';
import PublicLayout from '@/layouts/PublicLayout.vue';
import { useCopyLink } from '@/composables/useCopyLink';

type Album = {
    id: number;
    opponent: string;
    date: string;
    slug: string;
    cover_photo: { thumbnail_url: string | null } | null;
};

type Tournament = {
    id: number;
    name: string;
    slug: string;
    albums: Album[];
};

defineProps<{ tournament: Tournament }>();

defineOptions({ layout: PublicLayout });

const { copied, copyLink } = useCopyLink();
</script>

<template>
    <Head :title="tournament.name" />

    <div class="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <Link
            :href="home()"
            class="mb-6 inline-flex items-center gap-1.5 text-sm text-eagle-blue transition-colors hover:text-eagle-text"
        >
            <ArrowLeft class="size-4" />
            Back
        </Link>

        <div class="mb-6 flex items-center gap-4">
            <h1 class="shrink-0 font-display text-[clamp(1.75rem,5vw,2.5rem)] tracking-[0.08em] text-eagle-text">
                {{ tournament.name }}
            </h1>
            <div class="h-px flex-1 bg-eagle-border"></div>
            <span class="shrink-0 text-sm text-eagle-muted">
                {{ tournament.albums.length }} {{ tournament.albums.length === 1 ? 'game' : 'games' }}
            </span>
            <button
                type="button"
                class="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-eagle-border bg-eagle-card px-3 py-1.5 text-sm text-eagle-blue transition-colors hover:border-eagle-blue/40 hover:text-eagle-text"
                @click="copyLink"
            >
                <Check v-if="copied" class="size-3.5 text-green-400" />
                <Link2 v-else class="size-3.5" />
                {{ copied ? 'Copied!' : 'Copy link' }}
            </button>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
                v-for="album in tournament.albums"
                :key="album.id"
                :href="showAlbum(album)"
                class="group relative cursor-pointer overflow-hidden rounded-xl border border-eagle-border bg-eagle-card transition-all duration-300 hover:border-eagle-blue/30"
            >
                <div class="relative aspect-video w-full overflow-hidden bg-eagle-card">
                    <img
                        v-if="album.cover_photo?.thumbnail_url"
                        :src="album.cover_photo.thumbnail_url"
                        :alt="album.opponent"
                        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div v-else class="flex h-full items-center justify-center">
                        <Images class="size-10 text-eagle-border" />
                    </div>
                    <div class="absolute inset-0 bg-gradient-to-t from-eagle-card/80 to-transparent"></div>
                </div>
                <div class="p-4">
                    <p class="font-medium text-eagle-text">vs {{ album.opponent }}</p>
                    <p class="mt-1 flex items-center gap-1 text-sm text-eagle-muted">
                        <CalendarDays class="size-3.5" />
                        {{ new Date(album.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
                    </p>
                </div>
            </Link>
        </div>

        <div
            v-if="!tournament.albums.length"
            class="flex flex-col items-center justify-center py-24 text-center"
        >
            <Images class="mb-4 size-12 text-eagle-border" />
            <p class="text-lg font-medium text-eagle-text">No games yet</p>
            <p class="mt-1 text-sm text-eagle-muted">Check back soon for game photos.</p>
        </div>
    </div>
</template>
