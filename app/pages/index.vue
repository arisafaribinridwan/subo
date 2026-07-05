<script setup lang="ts">
const todayLabel = ref('')
const welcomeImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwIZAr5Jb-bCXoluYMzvZLKN-P8GDA7iGoyvZl3AslTXRMbTMzTUPma3EVnMD3QUtYXrERO3V4FPZWbn7lPGQTVcp9ZDjTXAjBQOeq0v7EUfiJm42K8LBuWmQoLhc6ssTaUclYJ1k7plenOcNLv2o20NgoainDiOy8lRqFbYndscpcWxAzB3WEVP4-3wnr-cQaMF04XCQ66PUTsKD-K9246Vo5L28siwwdlBAYhYn-CeWxOlYvvY8N1Fn3PH2sF0rSEy0ZTpeh61lq'

onMounted(() => {
  todayLabel.value = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date())
})
</script>

<template>
  <main class="relative isolate min-h-svh text-white">
    <div
      class="absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div
        class="absolute -inset-2.5 scale-[1.04] bg-cover bg-center brightness-90 saturate-105"
        :style="{ backgroundImage: `url(${welcomeImage})` }"
      />
      <div class="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.46)_0%,rgb(0_0_0/0.14)_40%,rgb(0_0_0/0.84)_100%),linear-gradient(90deg,rgb(0_0_0/0.18),transparent_22%,transparent_78%,rgb(0_0_0/0.18))]" />
    </div>

    <section class="flex min-h-svh flex-col justify-between px-5 pt-[calc(env(safe-area-inset-top)+48px)] pb-[calc(env(safe-area-inset-bottom)+48px)]">
      <header class="animate-welcome-fade-in [animation-delay:120ms]">
        <p class="m-0 min-h-4 text-xs leading-4 font-bold tracking-normal text-white/90 uppercase">
          {{ todayLabel || '\u00A0' }}
        </p>
      </header>

      <div class="flex animate-welcome-fade-in flex-col items-center text-center [animation-delay:260ms]">
        <div class="mb-4 grid size-17 place-items-center rounded-full border border-white/20 bg-[#f59e0b]/20 text-[#ffddb8] shadow-[0_18px_48px_rgb(0_0_0/0.26)] backdrop-blur-[14px]">
          <UIcon
            name="i-lucide-utensils"
            class="size-9"
          />
        </div>

        <h1 class="m-0 text-[2.5rem] leading-12 font-extrabold tracking-normal [text-shadow:0_8px_28px_rgb(0_0_0/0.42)]">
          Sobat Bubur
        </h1>
        <p class="mt-2 mb-0 text-xl leading-7 font-semibold tracking-normal text-[#ffb694] italic [text-shadow:0_8px_24px_rgb(0_0_0/0.38)]">
          "Sobat sarapan, kerja semangat"
        </p>
      </div>

      <div class="animate-welcome-fade-in -translate-y-12 [animation-delay:400ms]">
        <UButton
          to="/pesanan"
          color="primary"
          size="xl"
          block
          class="relative min-h-18 justify-center overflow-hidden rounded-xl bg-[#f59e0b] text-2xl leading-8 font-extrabold tracking-normal text-[#351a00] shadow-[0_22px_44px_rgb(0_0_0/0.35)] transition-[transform,filter,box-shadow] duration-200 ease-in-out after:absolute after:inset-0 after:pointer-events-none after:bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.28),transparent)] after:bg-size-[220%_100%] after:content-[''] after:animate-welcome-shimmer hover:brightness-[1.03] active:scale-[0.98] active:brightness-[1.08] active:shadow-[0_16px_32px_rgb(0_0_0/0.32)]"
        >
          <span class="inline-flex items-center justify-center gap-3">
            <span>Mulai Pesan</span>
            <UIcon
              name="i-lucide-arrow-right"
              class="size-6 shrink-0"
            />
          </span>
        </UButton>
      </div>
    </section>
  </main>
</template>
