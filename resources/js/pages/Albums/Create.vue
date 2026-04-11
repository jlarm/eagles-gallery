<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import { CalendarDate } from '@internationalized/date';
import { CalendarIcon } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import AlbumController from '@/actions/App/Http/Controllers/AlbumController';
import { index as galleryIndex } from '@/actions/App/Http/Controllers/GalleryController';
import Heading from '@/components/Heading.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

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

const selectedDate = ref<CalendarDate | undefined>(undefined);
const calendarOpen = ref(false);

const formattedDate = computed(() =>
    selectedDate.value
        ? new Date(selectedDate.value.year, selectedDate.value.month - 1, selectedDate.value.day)
              .toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Pick a date',
);

const dateValue = computed(() =>
    selectedDate.value
        ? `${selectedDate.value.year}-${String(selectedDate.value.month).padStart(2, '0')}-${String(selectedDate.value.day).padStart(2, '0')}`
        : '',
);

function onDateSelect(date: CalendarDate | undefined) {
    selectedDate.value = date;
    calendarOpen.value = false;
}
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
                <Label>Game date</Label>
                <Popover v-model:open="calendarOpen">
                    <PopoverTrigger as-child>
                        <button
                            type="button"
                            :class="[
                                'border-input flex h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-colors',
                                'hover:bg-accent hover:text-accent-foreground',
                                'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-[3px]',
                                !selectedDate && 'text-muted-foreground',
                            ]"
                        >
                            <span>{{ formattedDate }}</span>
                            <CalendarIcon class="size-4 opacity-50" />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent align="start">
                        <Calendar
                            :model-value="selectedDate"
                            :initial-focus="true"
                            @update:model-value="onDateSelect"
                        />
                    </PopoverContent>
                </Popover>
                <input type="hidden" name="date" :value="dateValue" />
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
