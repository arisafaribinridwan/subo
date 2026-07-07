<script setup lang="ts">
import type { OrderSummary, SateKey } from '~/composables/useOrderSummary'

const orderSummary = useOrderSummary()
const toast = useToast()

const productImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGxsyevZ0Vj_q2Cm_qK4hf78-g2WLpG3nusQXxGb7RzlRXLalIoElppzvVlQNrs7-31hmyu6S_jtXOG11KKIoji9GE8PZkaugOJKFsW5-l_4s3lBwK7ta678ipGyMMUSgF6lSg5eIn4y3UhEdiyYMUvWGYais55GpvBqFT7xrq-3QH006fWGTNN0KBNqJxsjf_uRk11UrHA_ouAww1iFyTppizvCkXWjbYwkrUg6BaU9BkKCrGapSURExISM-xLZZAf6wvB3OOBrrV'
const avatarImage = 'https://i.pravatar.cc/96?img=12'

const fallbackOrder: OrderSummary = {
  customerName: 'Pelanggan',
  portion: '1 Porsi',
  filling: 'Kostum',
  omittedToppings: ['Kacang'],
  crackersSeparated: true,
  sambalLevel: 3,
  sate: {
    usus: 2,
    ati: 0,
    ampela: 0,
    puyuh: 0
  }
}

const sateLabels: Record<SateKey, string> = {
  usus: 'Sate Usus',
  ati: 'Sate Ati',
  ampela: 'Sate Ampela',
  puyuh: 'Sate Puyuh'
}

interface SummaryItem {
  label: string
  icon: string
  color?: 'primary' | 'error'
}

const order = computed(() => orderSummary.value ?? fallbackOrder)
const portionLabel = computed(() => order.value.portion === '1 Porsi' ? '1 Porsi Besar' : '1/2 Porsi')

const summaryItems = computed<SummaryItem[]>(() => {
  const items: SummaryItem[] = []

  for (const [key, quantity] of Object.entries(order.value.sate) as Array<[SateKey, number]>) {
    if (quantity > 0) {
      items.push({
        label: `${sateLabels[key]} x${quantity}`,
        icon: 'i-lucide-utensils'
      })
    }
  }

  if (order.value.sambalLevel > 0) {
    items.push({
      label: `Sambal Level ${order.value.sambalLevel}`,
      icon: 'i-lucide-flame'
    })
  }

  if (order.value.crackersSeparated) {
    items.push({
      label: 'Krupuk Dipisah',
      icon: 'i-lucide-croissant'
    })
  }

  for (const topping of order.value.omittedToppings) {
    items.push({
      label: `Tanpa ${topping}`,
      icon: 'i-lucide-circle-slash',
      color: 'error'
    })
  }

  return items
})

const totalPrice = computed(() => {
  const basePrice = order.value.portion === '1 Porsi' ? 30000 : 22000
  const sateTotal = Object.values(order.value.sate).reduce((total, quantity) => total + quantity, 0)

  return basePrice + (sateTotal * 5000)
})

const formattedTotal = computed(() => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
}).format(totalPrice.value))

useSeoMeta({
  title: 'Ringkasan Pesanan | Sobat Bubur',
  description: 'Cek ringkasan pesanan bubur ayam sebelum dikirim.'
})

function confirmOrder() {
  toast.add({
    title: 'Pesanan dikonfirmasi',
    description: `${order.value.customerName} masuk antrean bubur.`,
    color: 'success',
    icon: 'i-lucide-check-circle'
  })
}
</script>

<template>
  <main class="min-h-svh overflow-y-auto bg-default text-default">
    <header class="border-b border-muted bg-default px-5 py-5">
      <div class="flex items-center justify-between gap-4">
        <NuxtLink
          to="/"
          class="flex min-w-0 items-center gap-3 text-primary"
          aria-label="Kembali ke welcome screen"
        >
          <UIcon
            name="i-lucide-utensils"
            class="size-7 shrink-0"
          />
          <span class="truncate text-2xl leading-8 font-extrabold tracking-normal">
            Sobat Bubur
          </span>
        </NuxtLink>

        <UAvatar
          :src="avatarImage"
          alt="Profil pelanggan"
          size="lg"
          class="ring-2 ring-primary/25"
        />
      </div>
    </header>

    <section class="space-y-6 px-5 py-9">
      <div>
        <h1 class="m-0 text-2xl leading-8 font-extrabold tracking-normal text-highlighted">
          Cek Pesanan Anda
        </h1>
        <p class="mt-2 max-w-80 text-base leading-6 font-medium text-muted">
          Pastikan semua detail bubur favorit Anda sudah sesuai sebelum kami memprosesnya.
        </p>
      </div>

      <UCard
        variant="outline"
        class="shadow-[0_18px_44px_rgb(0_0_0/0.06)]"
        :ui="{ body: 'p-6 sm:p-6' }"
      >
        <div class="flex items-center gap-4">
          <img
            :src="productImage"
            alt="Bubur ayam"
            class="size-20 shrink-0 rounded-lg object-cover"
          >
          <div class="min-w-0">
            <h2 class="m-0 text-xl leading-7 font-extrabold tracking-normal text-highlighted">
              {{ order.customerName }}
            </h2>
            <p class="m-0 text-base leading-6 font-medium text-muted">
              {{ portionLabel }}
            </p>
          </div>
        </div>

        <div class="mt-6 space-y-4">
          <div
            v-for="item in summaryItems"
            :key="item.label"
            class="flex items-center gap-4"
            :class="item.color === 'error' ? 'text-error' : 'text-primary'"
          >
            <UIcon
              :name="item.icon"
              class="size-6 shrink-0"
            />
            <span
              class="text-sm leading-5 font-extrabold tracking-normal text-default"
              :class="item.color === 'error' && 'text-error'"
            >
              {{ item.label }}
            </span>
          </div>

          <div
            v-if="summaryItems.length === 0"
            class="flex items-center gap-4 text-primary"
          >
            <UIcon
              name="i-lucide-notebook-tabs"
              class="size-6 shrink-0"
            />
            <span class="text-sm leading-5 font-extrabold tracking-normal text-default">
              Bubur lengkap
            </span>
          </div>
        </div>

        <USeparator class="my-6" />

        <div class="flex items-center justify-between gap-4">
          <span class="text-xl leading-7 font-extrabold tracking-normal text-highlighted">
            Total Harga
          </span>
          <span class="shrink-0 text-xl leading-7 font-extrabold tracking-normal text-error">
            {{ formattedTotal }}
          </span>
        </div>
      </UCard>

      <div class="space-y-4 pb-[calc(env(safe-area-inset-bottom)+24px)]">
        <UButton
          type="button"
          color="neutral"
          variant="soft"
          size="xl"
          block
          trailing-icon="i-lucide-send-horizontal"
          label="Konfirmasi & Kirim"
          class="min-h-15 rounded-lg text-lg leading-7 font-extrabold text-primary shadow-[0_14px_32px_rgb(0_0_0/0.04)]"
          @click="confirmOrder"
        />

        <UButton
          to="/pesanan"
          color="primary"
          variant="link"
          size="lg"
          block
          icon="i-lucide-pencil"
          label="Kembali Edit"
          class="font-extrabold"
        />
      </div>
    </section>
  </main>
</template>
