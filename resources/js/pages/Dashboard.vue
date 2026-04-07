<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
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
import { dashboard } from '@/routes';
import { Images, FolderOpen, Download, Eye } from 'lucide-vue-next';

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

const props = defineProps<{
    stats: StatBlock;
    activityChart: ChartDay[];
    topTournaments: TopItem[];
    topGames: TopItem[];
    topDownloads: TopItem[];
}>();

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
