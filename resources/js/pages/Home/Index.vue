<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { CalendarDays, FolderOpen, Images } from 'lucide-vue-next';
import { show as showAlbum } from '@/actions/App/Http/Controllers/AlbumController';
import { show as showTournament } from '@/actions/App/Http/Controllers/TournamentController';
import PublicLayout from '@/layouts/PublicLayout.vue';

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
    albums_count: number;
};

defineProps<{
    tournaments: Tournament[];
    standaloneAlbums: Album[];
}>();

defineOptions({ layout: PublicLayout });

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
</script>

<template>
    <Head title="Eagles Game Gallery" />

    <!-- Hero -->
    <div class="relative overflow-hidden px-6 pt-16 pb-14 text-center">
        <!-- Diagonal stripe texture -->
        <div
            class="absolute inset-0 bg-[repeating-linear-gradient(-55deg,#7CBDD8_0px,#7CBDD8_1px,transparent_1px,transparent_28px)] opacity-[0.025]"
        ></div>
        <!-- Radial glow -->
        <div
            class="absolute inset-0 [background:radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(124,189,216,0.1)_0%,transparent_65%)]"
        ></div>
        <div class="relative flex flex-col items-center">
            <img
                src="/eagles-logo.png"
                alt="Eagles"
                class="mb-5 h-28 w-auto drop-shadow-[0_0_40px_rgba(124,189,216,0.25)] sm:h-36"
            />
            <h1
                class="font-display text-[clamp(3rem,14vw,8rem)] leading-none tracking-wide text-white"
            >
                EAGLES ELITE 13U
            </h1>
            <p
                class="mt-3 text-[11px] tracking-[0.45em] text-eagle-muted uppercase"
            >
                Game Photo Gallery
            </p>
            <div class="mt-6 flex items-center gap-3">
                <div
                    class="h-px w-16 bg-linear-to-r from-transparent to-eagle-blue/30"
                ></div>
                <div class="size-1.5 rounded-full bg-eagle-blue/50"></div>
                <div
                    class="h-px w-16 bg-linear-to-l from-transparent to-eagle-blue/30"
                ></div>
            </div>
            <p
                class="mt-4 max-w-sm text-sm font-light text-muted-foreground"
            >
                Browse game photos. Click any photo to view full size and
                download.
            </p>
        </div>
    </div>

    <!-- Content -->
    <div class="flex-1 px-6 pb-20">
        <!-- Tournaments -->
        <section v-if="tournaments.length" class="mx-auto mb-14 max-w-6xl">
            <div class="mb-5 flex items-center gap-4">
                <h2
                    class="shrink-0 font-display text-2xl tracking-[0.15em] text-eagle-text"
                >
                    TOURNAMENTS
                </h2>
                <div class="h-px flex-1 bg-eagle-border"></div>
                <span
                    class="shrink-0 text-[10px] tracking-widest text-eagle-muted uppercase"
                >
                    {{ tournaments.length }}
                    {{
                        tournaments.length === 1
                            ? 'Tournament'
                            : 'Tournaments'
                    }}
                </span>
            </div>

            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                    v-for="tournament in tournaments"
                    :key="tournament.id"
                    :href="showTournament(tournament)"
                    class="group relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-xl border border-eagle-border bg-eagle-card p-5 transition-all duration-300 hover:border-eagle-blue/30 hover:bg-eagle-card-hover"
                >
                    <!-- Left accent bar -->
                    <div
                        class="absolute top-0 left-0 h-full w-0.5 bg-eagle-blue opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    ></div>

                    <div
                        class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-eagle-blue/10 transition-colors group-hover:bg-eagle-blue/15"
                    >
                        <FolderOpen class="size-5 text-eagle-blue" />
                    </div>

                    <div class="min-w-0">
                        <p class="truncate font-medium text-eagle-text">
                            {{ tournament.name }}
                        </p>
                        <p class="mt-0.5 text-sm text-eagle-muted">
                            {{ tournament.albums_count }}
                            {{
                                tournament.albums_count === 1
                                    ? 'game'
                                    : 'games'
                            }}
                        </p>
                    </div>
                </Link>
            </div>
        </section>

        <!-- Standalone Games -->
        <section v-if="standaloneAlbums.length" class="mx-auto max-w-6xl">
            <div class="mb-5 flex items-center gap-4">
                <h2
                    class="shrink-0 font-display text-2xl tracking-[0.15em] text-eagle-text"
                >
                    GAMES
                </h2>
                <div class="h-px flex-1 bg-eagle-border"></div>
                <span
                    class="shrink-0 text-[10px] tracking-widest text-eagle-muted uppercase"
                >
                    {{ standaloneAlbums.length }}
                    {{ standaloneAlbums.length === 1 ? 'Game' : 'Games' }}
                </span>
            </div>

            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                    v-for="album in standaloneAlbums"
                    :key="album.id"
                    :href="showAlbum(album)"
                    class="group relative cursor-pointer overflow-hidden rounded-xl border border-eagle-border bg-eagle-card transition-all duration-300 hover:border-eagle-blue/30"
                >
                    <div
                        class="relative aspect-video w-full overflow-hidden bg-eagle-card"
                    >
                        <img
                            v-if="album.cover_photo?.thumbnail_url"
                            :src="album.cover_photo.thumbnail_url"
                            :alt="album.opponent"
                            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div
                            v-else
                            class="flex h-full items-center justify-center"
                        >
                            <Images class="size-10 text-eagle-border" />
                        </div>
                        <div
                            class="absolute inset-0 bg-linear-to-t from-eagle-card/80 to-transparent"
                        ></div>
                    </div>
                    <div class="p-4">
                        <p class="font-medium text-eagle-text">
                            vs {{ album.opponent }}
                        </p>
                        <p
                            class="mt-1 flex items-center gap-1 text-sm text-eagle-muted"
                        >
                            <CalendarDays class="size-3.5" />
                            {{ formatDate(album.date) }}
                        </p>
                    </div>
                </Link>
            </div>
        </section>

        <!-- Empty state -->
        <div
            v-if="!tournaments.length && !standaloneAlbums.length"
            class="mx-auto flex max-w-6xl flex-col items-center justify-center py-24 text-center"
        >
            <Images class="mb-4 size-14 text-eagle-border" />
            <p class="text-lg font-medium text-eagle-text">No photos yet</p>
            <p class="mt-1 text-sm text-eagle-muted">
                Check back soon for game photos.
            </p>
        </div>
    </div>
</template>
