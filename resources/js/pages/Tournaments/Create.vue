<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import TournamentController from '@/actions/App/Http/Controllers/TournamentController';
import { index as galleryIndex } from '@/actions/App/Http/Controllers/GalleryController';
import Heading from '@/components/Heading.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

defineOptions({
    layout: {
        breadcrumbs: [
            { title: 'Gallery', href: galleryIndex() },
            { title: 'New Tournament', href: TournamentController.create() },
        ],
    },
});
</script>

<template>
    <Head title="New Tournament" />

    <div class="flex flex-col gap-6 p-4">
        <Heading title="New Tournament" description="Create a tournament to group related games together." />

        <Form
            v-bind="TournamentController.store.form()"
            class="max-w-md space-y-4"
            v-slot="{ errors, processing }"
        >
            <div class="grid gap-2">
                <Label for="name">Tournament name</Label>
                <Input
                    id="name"
                    name="name"
                    placeholder="e.g. Spring Invitational 2025"
                    required
                    autofocus
                />
                <InputError :message="errors.name" />
            </div>

            <Button type="submit" :disabled="processing">
                {{ processing ? 'Creating...' : 'Create Tournament' }}
            </Button>
        </Form>
    </div>
</template>
