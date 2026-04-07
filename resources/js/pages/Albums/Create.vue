<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import AlbumController from '@/actions/App/Http/Controllers/AlbumController';
import { index as galleryIndex } from '@/actions/App/Http/Controllers/GalleryController';
import Heading from '@/components/Heading.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Tournament = {
    id: number;
    name: string;
};

defineProps<{
    tournaments: Tournament[];
}>();

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Gallery', href: galleryIndex() },
            { title: 'New Game', href: AlbumController.create() },
        ],
    },
});
</script>

<template>
    <Head title="New Game" />

    <div class="flex flex-col gap-6 p-4">
        <Heading title="New Game" description="Add a game to the gallery." />

        <Form
            v-bind="AlbumController.store.form()"
            class="max-w-md space-y-4"
            v-slot="{ errors, processing }"
        >
            <div class="grid gap-2">
                <Label for="opponent">Opponent</Label>
                <Input
                    id="opponent"
                    name="opponent"
                    placeholder="e.g. Central High School"
                    required
                    autofocus
                />
                <InputError :message="errors.opponent" />
            </div>

            <div class="grid gap-2">
                <Label for="date">Game date</Label>
                <Input
                    id="date"
                    name="date"
                    type="date"
                    required
                />
                <InputError :message="errors.date" />
            </div>

            <div v-if="tournaments.length" class="grid gap-2">
                <Label for="tournament_id">Tournament <span class="text-muted-foreground">(optional)</span></Label>
                <Select name="tournament_id">
                    <SelectTrigger id="tournament_id">
                        <SelectValue placeholder="No tournament" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem
                            v-for="tournament in tournaments"
                            :key="tournament.id"
                            :value="String(tournament.id)"
                        >
                            {{ tournament.name }}
                        </SelectItem>
                    </SelectContent>
                </Select>
                <InputError :message="errors.tournament_id" />
            </div>

            <Button type="submit" :disabled="processing">
                {{ processing ? 'Creating...' : 'Create Game' }}
            </Button>
        </Form>
    </div>
</template>
