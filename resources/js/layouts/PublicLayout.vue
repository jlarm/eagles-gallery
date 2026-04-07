<script setup lang="ts">
import { Head, Link, usePage } from '@inertiajs/vue3';
import { home, dashboard } from '@/routes';

const page = usePage();
const isAuthenticated = !!page.props.auth?.user;
</script>

<template>
    <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
    </Head>

    <div class="dark flex min-h-screen flex-col bg-eagle-bg text-eagle-text">
        <nav class="flex items-center justify-between border-b border-eagle-border px-8 py-4">
            <Link :href="home()">
                <img src="/eagles-logo.png" alt="Eagles" class="h-10 w-auto" />
            </Link>

            <Link
                v-if="isAuthenticated"
                :href="dashboard()"
                class="text-xs tracking-wider text-eagle-blue hover:text-eagle-text transition-colors"
            >
                Dashboard →
            </Link>
        </nav>

        <main class="flex-1">
            <slot />
        </main>

        <footer class="border-t border-eagle-border px-8 py-6 text-center">
            <p class="text-[10px] uppercase tracking-[0.2em] text-eagle-muted/50">
                Eagles Game Gallery &mdash; All Rights Reserved
            </p>
        </footer>
    </div>
</template>
