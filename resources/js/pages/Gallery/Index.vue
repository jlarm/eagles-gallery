<script setup lang="ts">
import { Head, Link, usePage } from '@inertiajs/vue3';
import { CalendarDays, Eye, FolderOpen, Images, Plus } from 'lucide-vue-next';
import { create as createAlbum, manage as manageAlbum } from '@/actions/App/Http/Controllers/AlbumController';
import { create as createTournament, manage as manageTournament } from '@/actions/App/Http/Controllers/TournamentController';
import { index as galleryIndex } from '@/actions/App/Http/Controllers/GalleryController';
import { Button } from '@/components/ui/button';

type Album = {
    id: number;
    opponent: string;
    date: string;
    slug: string;
    view_count: number;
    cover_photo: { thumbnail_url: string | null } | null;
};

type Tournament = {
    id: number;
    name: string;
    slug: string;
    albums_count: number;
    view_count: number;
};

defineProps<{
    tournaments: Tournament[];
    standaloneAlbums: Album[];
}>();

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Gallery', href: galleryIndex() },
        ],
    },
});

const page = usePage();
const isAuthenticated = !!page.props.auth?.user;
</script>

<template>
    <Head title="Gallery" />

    <div class="flex flex-col gap-6 p-4">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-semibold tracking-tight">Gallery</h1>
                <p class="text-sm text-muted-foreground">Browse games and tournaments</p>
            </div>
            <div v-if="isAuthenticated" class="flex gap-2">
                <Button as-child variant="outline" size="sm">
                    <Link :href="createTournament()">
                        <Plus class="mr-1 h-4 w-4" />
                        Tournament
                    </Link>
                </Button>
                <Button as-child size="sm">
                    <Link :href="createAlbum()">
                        <Plus class="mr-1 h-4 w-4" />
                        Game
                    </Link>
                </Button>
            </div>
        </div>

        <!-- Tournaments -->
        <section v-if="tournaments.length">
            <h2 class="mb-3 text-lg font-medium">Tournaments</h2>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                    v-for="tournament in tournaments"
                    :key="tournament.id"
                    :href="manageTournament(tournament)"
                    class="group flex items-center gap-4 rounded-xl border border-sidebar-border/70 p-4 transition-colors hover:bg-muted/50 dark:border-sidebar-border"
                >
                    <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <FolderOpen class="h-6 w-6" />
                    </div>
                    <div class="min-w-0 flex-1">
                        <p class="truncate font-medium">{{ tournament.name }}</p>
                        <p class="text-sm text-muted-foreground">
                            {{ tournament.albums_count }} {{ tournament.albums_count === 1 ? 'game' : 'games' }}
                        </p>
                    </div>
                    <div class="flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
                        <Eye class="h-3.5 w-3.5" />
                        {{ tournament.view_count }}
                    </div>
                </Link>
            </div>
        </section>

        <!-- Standalone Games -->
        <section v-if="standaloneAlbums.length">
            <h2 class="mb-3 text-lg font-medium">Games</h2>
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Link
                    v-for="album in standaloneAlbums"
                    :key="album.id"
                    :href="manageAlbum(album)"
                    class="group relative overflow-hidden rounded-xl border border-sidebar-border/70 transition-colors hover:bg-muted/50 dark:border-sidebar-border"
                >
                    <!-- Cover photo or placeholder -->
                    <div class="relative aspect-video w-full overflow-hidden bg-muted">
                        <img
                            v-if="album.cover_photo?.thumbnail_url"
                            :src="album.cover_photo.thumbnail_url"
                            :alt="album.opponent"
                            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div v-else class="flex h-full items-center justify-center">
                            <Images class="h-10 w-10 text-muted-foreground/40" />
                        </div>
                    </div>
                    <div class="p-3">
                        <p class="font-medium">vs {{ album.opponent }}</p>
                        <div class="flex items-center justify-between">
                            <p class="flex items-center gap-1 text-sm text-muted-foreground">
                                <CalendarDays class="h-3.5 w-3.5" />
                                {{ new Date(album.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
                            </p>
                            <p class="flex items-center gap-1 text-sm text-muted-foreground">
                                <Eye class="h-3.5 w-3.5" />
                                {{ album.view_count }}
                            </p>
                        </div>
                    </div>
                </Link>
            </div>
        </section>

        <div
            v-if="!tournaments.length && !standaloneAlbums.length"
            class="flex flex-col items-center justify-center py-20 text-center"
        >
            <Images class="mb-4 h-12 w-12 text-muted-foreground/40" />
            <p class="text-lg font-medium">No photos yet</p>
            <p class="mt-1 text-sm text-muted-foreground">Add a tournament or game to get started.</p>
        </div>
    </div>
</template>
