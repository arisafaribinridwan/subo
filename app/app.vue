<script setup lang="ts">
const title = 'Sobat Bubur'
const description = 'Aplikasi pemesanan bubur ayam untuk sarapan yang cepat dan praktis.'

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
    { name: 'theme-color', content: '#24170d' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'id'
  },
  bodyAttrs: {
    class: 'm-0 overflow-hidden bg-[#1f150d] font-sans'
  }
})

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary'
})
</script>

<template>
  <UApp>
    <div class="flex min-h-svh w-full justify-center bg-[#1f150d] bg-[linear-gradient(90deg,rgb(0_0_0_/_0.2),transparent_34%,transparent_66%,rgb(0_0_0_/_0.2))]">
      <div class="relative min-h-svh w-full max-w-[430px] overflow-hidden bg-[#f8f9fa] shadow-[0_0_80px_rgb(0_0_0_/_0.36)]">
        <NuxtPage />
      </div>
    </div>
  </UApp>
</template>
