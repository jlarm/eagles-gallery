<script setup lang="ts">
import { Head, Link, usePage } from '@inertiajs/vue3';
import { LogIn } from 'lucide-vue-next';
import { home, dashboard, login } from '@/routes';

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
            <Link
                v-else
                :href="login()"
                class="flex items-center gap-1.5 text-xs tracking-wider text-eagle-muted transition-colors hover:text-eagle-text"
            >
                <LogIn class="size-3.5" />
                Admin
            </Link>
        </nav>

        <main class="flex flex-1 flex-col bg-eagle-bg">
            <slot />
        </main>

        <footer class="border-t border-eagle-border px-8 py-6 text-center">
            <p class="text-[10px] uppercase tracking-[0.2em] text-eagle-muted/50">
                Eagles Game Gallery &mdash; All Rights Reserved &mdash; <a href="https://joelohr.com" target="_blank">Joe Lohr</a>
            </p>
        </footer>
    </div>
</template>
