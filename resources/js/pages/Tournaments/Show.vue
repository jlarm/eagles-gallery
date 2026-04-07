<script setup lang="ts">
import { Head, Link, usePage } from '@inertiajs/vue3';
import { CalendarDays, Images, Plus } from 'lucide-vue-next';
import { show as showAlbum, create as createAlbum } from '@/actions/App/Http/Controllers/AlbumController';
import { show as showTournament } from '@/actions/App/Http/Controllers/TournamentController';
import { index as galleryIndex } from '@/actions/App/Http/Controllers/GalleryController';
import { Button } from '@/components/ui/button';

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

const props = defineProps<{ tournament: Tournament }>();

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
    <Head :title="tournament.name" />

    <div class="flex flex-col gap-6 p-4">
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-semibold tracking-tight">{{ tournament.name }}</h1>
                <p class="text-sm text-muted-foreground">
                    {{ tournament.albums.length }} {{ tournament.albums.length === 1 ? 'game' : 'games' }}
                </p>
            </div>
            <Button v-if="isAuthenticated" as-child size="sm">
                <Link :href="createAlbum({ tournament_id: tournament.id })">
                    <Plus class="mr-1 h-4 w-4" />
                    Add Game
                </Link>
            </Button>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
                v-for="album in tournament.albums"
                :key="album.id"
                :href="showAlbum(album)"
                class="group relative overflow-hidden rounded-xl border border-sidebar-border/70 transition-colors hover:bg-muted/50 dark:border-sidebar-border"
            >
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
                    <p class="flex items-center gap-1 text-sm text-muted-foreground">
                        <CalendarDays class="h-3.5 w-3.5" />
                        {{ new Date(album.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
                    </p>
                </div>
            </Link>
        </div>

        <div
            v-if="!tournament.albums.length"
            class="flex flex-col items-center justify-center py-20 text-center"
        >
            <Images class="mb-4 h-12 w-12 text-muted-foreground/40" />
            <p class="text-lg font-medium">No games yet</p>
            <p class="mt-1 text-sm text-muted-foreground">Add a game to this tournament to start uploading photos.</p>
        </div>
    </div>
</template>
