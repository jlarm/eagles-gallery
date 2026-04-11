<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Filler,
    Title,
    Tooltip as ChartTooltip,
    Legend as ChartLegend,
} from 'chart.js';
import { Line, Bar as BarChart2 } from 'vue-chartjs';
import { computed } from 'vue';
import { retryFailed, clearFailed, retryStuckPhoto } from '@/actions/App/Http/Controllers/QueueController';
import { dashboard } from '@/routes';
import { AlertTriangle, Images, FolderOpen, Download, Eye, RefreshCw, Trash2 } from 'lucide-vue-next';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Filler,
    Title,
    ChartTooltip,
    ChartLegend,
);

type StatBlock = {
    total_photos: number;
    total_albums: number;
    total_tournaments: number;
    downloads_30d: number;
    photo_views_30d: number;
    game_views_30d: number;
};

type ChartDay = {
    date: string;
    tournament_view: number;
    game_view: number;
    photo_view: number;
    download: number;
};

type TopItem = { id: number; label: string; count: number };

type StuckPhoto = { id: number; filename: string; age_minutes: number };
type FailedJob = { id: number; name: string; failed_at: string; error: string };
type QueueHealth = { stuck_photos: StuckPhoto[]; failed_jobs: FailedJob[] };

const props = defineProps<{
    stats: StatBlock;
    activityChart: ChartDay[];
    topTournaments: TopItem[];
    topGames: TopItem[];
    topDownloads: TopItem[];
    queueHealth: QueueHealth;
}>();

const hasQueueIssues = computed(() =>
    props.queueHealth.stuck_photos.length > 0 || props.queueHealth.failed_jobs.length > 0,
);

defineOptions({
    layout: {
        breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
    },
});

const activityLabels = computed(() =>
    props.activityChart.map((d) =>
        new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    ),
);

const lineChartData = computed(() => ({
    labels: activityLabels.value,
    datasets: [
        {
            label: 'Tournament Views',
            data: props.activityChart.map((d) => d.tournament_view),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.08)',
            fill: true,
            tension: 0.4,
            pointRadius: 2,
        },
        {
            label: 'Game Views',
            data: props.activityChart.map((d) => d.game_view),
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139,92,246,0.08)',
            fill: true,
            tension: 0.4,
            pointRadius: 2,
        },
        {
            label: 'Photo Views',
            data: props.activityChart.map((d) => d.photo_view),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.08)',
            fill: true,
            tension: 0.4,
            pointRadius: 2,
        },
        {
            label: 'Downloads',
            data: props.activityChart.map((d) => d.download),
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245,158,11,0.08)',
            fill: true,
            tension: 0.4,
            pointRadius: 2,
        },
    ],
}));

const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'bottom' as const, labels: { boxWidth: 12, padding: 16, font: { size: 12 } } },
        tooltip: { mode: 'index' as const, intersect: false },
    },
    scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: { beginAtZero: true, grid: { color: '#f3f4f6' }, ticks: { precision: 0, font: { size: 11 } } },
    },
};

function barChartData(items: TopItem[], color: string) {
    return {
        labels: items.map((i) => i.label),
        datasets: [{
            label: 'Count',
            data: items.map((i) => i.count),
            backgroundColor: color,
            borderRadius: 4,
            barThickness: 20,
        }],
    };
}

const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.parsed.x}` } },
    },
    scales: {
        x: { beginAtZero: true, grid: { color: '#f3f4f6' }, ticks: { precision: 0, font: { size: 11 } } },
        y: { grid: { display: false }, ticks: { font: { size: 12 }, maxRotation: 0 } },
    },
};
</script>

<template>
    <Head title="Dashboard" />

    <div class="flex flex-col gap-6 p-6">

        <!-- Stat cards -->
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div class="rounded-xl border border-border bg-card p-5">
                <div class="flex items-center justify-between">
                    <p class="text-sm text-muted-foreground">Total Photos</p>
                    <Images class="size-4 text-muted-foreground" />
                </div>
                <p class="mt-2 text-3xl font-semibold tracking-tight">{{ stats.total_photos.toLocaleString() }}</p>
                <p class="mt-1 text-xs text-muted-foreground">Across {{ stats.total_albums }} games</p>
            </div>

            <div class="rounded-xl border border-border bg-card p-5">
                <div class="flex items-center justify-between">
                    <p class="text-sm text-muted-foreground">Tournaments</p>
                    <FolderOpen class="size-4 text-muted-foreground" />
                </div>
                <p class="mt-2 text-3xl font-semibold tracking-tight">{{ stats.total_tournaments.toLocaleString() }}</p>
                <p class="mt-1 text-xs text-muted-foreground">{{ stats.total_albums }} total games</p>
            </div>

            <div class="rounded-xl border border-border bg-card p-5">
                <div class="flex items-center justify-between">
                    <p class="text-sm text-muted-foreground">Photo Views</p>
                    <Eye class="size-4 text-muted-foreground" />
                </div>
                <p class="mt-2 text-3xl font-semibold tracking-tight">{{ stats.photo_views_30d.toLocaleString() }}</p>
                <p class="mt-1 text-xs text-muted-foreground">Last 30 days</p>
            </div>

            <div class="rounded-xl border border-border bg-card p-5">
                <div class="flex items-center justify-between">
                    <p class="text-sm text-muted-foreground">Downloads</p>
                    <Download class="size-4 text-muted-foreground" />
                </div>
                <p class="mt-2 text-3xl font-semibold tracking-tight">{{ stats.downloads_30d.toLocaleString() }}</p>
                <p class="mt-1 text-xs text-muted-foreground">Last 30 days</p>
            </div>
        </div>

        <!-- Activity chart -->
        <div class="rounded-xl border border-border bg-card p-6">
            <h2 class="font-semibold">Activity Overview</h2>
            <p class="mt-0.5 text-sm text-muted-foreground">Daily views and downloads over the last 14 days</p>
            <div class="mt-6 h-64">
                <Line :data="lineChartData" :options="lineChartOptions" />
            </div>
        </div>

        <!-- Queue Health -->
        <div v-if="hasQueueIssues" class="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
            <div class="mb-4 flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <AlertTriangle class="size-4 text-destructive" />
                    <h2 class="font-semibold text-destructive">Queue Issues</h2>
                </div>
                <div class="flex items-center gap-2">
                    <button
                        v-if="queueHealth.failed_jobs.length"
                        type="button"
                        class="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                        @click="router.post(retryFailed.url())"
                    >
                        <RefreshCw class="size-3" />
                        Retry All Failed
                    </button>
                    <button
                        v-if="queueHealth.failed_jobs.length"
                        type="button"
                        class="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                        @click="router.post(clearFailed.url())"
                    >
                        <Trash2 class="size-3" />
                        Clear Failed
                    </button>
                </div>
            </div>

            <!-- Stuck photos -->
            <div v-if="queueHealth.stuck_photos.length" class="mb-4">
                <p class="mb-2 text-sm font-medium">Stuck Photos ({{ queueHealth.stuck_photos.length }})</p>
                <div class="space-y-1.5">
                    <div
                        v-for="photo in queueHealth.stuck_photos"
                        :key="photo.id"
                        class="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm"
                    >
                        <div>
                            <span class="font-mono text-xs">{{ photo.filename }}</span>
                            <span class="ml-2 text-xs text-muted-foreground">stuck for {{ photo.age_minutes }}m</span>
                        </div>
                        <button
                            type="button"
                            class="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                            @click="router.post(retryStuckPhoto.url({ photo: photo.id }))"
                        >
                            <RefreshCw class="size-3" />
                            Re-queue
                        </button>
                    </div>
                </div>
            </div>

            <!-- Failed jobs -->
            <div v-if="queueHealth.failed_jobs.length">
                <p class="mb-2 text-sm font-medium">Failed Jobs ({{ queueHealth.failed_jobs.length }})</p>
                <div class="space-y-1.5">
                    <div
                        v-for="job in queueHealth.failed_jobs"
                        :key="job.id"
                        class="rounded-md border border-border bg-background px-3 py-2 text-sm"
                    >
                        <div class="flex items-center justify-between">
                            <span class="font-mono text-xs text-muted-foreground">{{ job.name }}</span>
                            <span class="text-xs text-muted-foreground">{{ new Date(job.failed_at).toLocaleString() }}</span>
                        </div>
                        <p class="mt-1 truncate text-xs text-destructive">{{ job.error }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bar charts -->
        <div class="grid gap-4 lg:grid-cols-3">

            <div class="rounded-xl border border-border bg-card p-6">
                <h2 class="font-semibold">Top Tournaments</h2>
                <p class="mt-0.5 text-sm text-muted-foreground">Most visited in the last 14 days</p>
                <div class="mt-4 h-48">
                    <BarChart2
                        v-if="topTournaments.length"
                        :data="barChartData(topTournaments, 'rgba(59,130,246,0.75)')"
                        :options="barChartOptions"
                    />
                    <p v-else class="mt-8 text-center text-sm text-muted-foreground">No data yet</p>
                </div>
            </div>

            <div class="rounded-xl border border-border bg-card p-6">
                <h2 class="font-semibold">Top Games</h2>
                <p class="mt-0.5 text-sm text-muted-foreground">Most visited in the last 14 days</p>
                <div class="mt-4 h-48">
                    <BarChart2
                        v-if="topGames.length"
                        :data="barChartData(topGames, 'rgba(139,92,246,0.75)')"
                        :options="barChartOptions"
                    />
                    <p v-else class="mt-8 text-center text-sm text-muted-foreground">No data yet</p>
                </div>
            </div>

            <div class="rounded-xl border border-border bg-card p-6">
                <h2 class="font-semibold">Most Downloaded Photos</h2>
                <p class="mt-0.5 text-sm text-muted-foreground">Most downloaded in the last 14 days</p>
                <div class="mt-4 h-48">
                    <BarChart2
                        v-if="topDownloads.length"
                        :data="barChartData(topDownloads, 'rgba(245,158,11,0.75)')"
                        :options="barChartOptions"
                    />
                    <p v-else class="mt-8 text-center text-sm text-muted-foreground">No data yet</p>
                </div>
            </div>

        </div>
    </div>
</template>
