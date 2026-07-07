<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const heroImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGxsyevZ0Vj_q2Cm_qK4hf78-g2WLpG3nusQXxGb7RzlRXLalIoElppzvVlQNrs7-31hmyu6S_jtXOG11KKIoji9GE8PZkaugOJKFsW5-l_4s3lBwK7ta678ipGyMMUSgF6lSg5eIn4y3UhEdiyYMUvWGYais55GpvBqFT7xrq-3QH006fWGTNN0KBNqJxsjf_uRk11UrHA_ouAww1iFyTppizvCkXWjbYwkrUg6BaU9BkKCrGapSURExISM-xLZZAf6wvB3OOBrrV'

const portionValues = ['1 Porsi', '1/2 Porsi'] as const
const fillingValues = ['Lengkap', 'Kostum'] as const
const toppingValues = ['Kecap', 'Kacang', 'Bawang Goreng', 'Daun Bawang'] as const

const orderSchema = z.object({
  customerName: z.string().trim().min(1, 'Nama pemesan wajib diisi.'),
  portion: z.enum(portionValues),
  filling: z.enum(fillingValues),
  omittedToppings: z.array(z.enum(toppingValues)),
  crackersSeparated: z.boolean(),
  sambalLevel: z.number().int().min(0).max(3),
  sate: z.object({
    usus: z.number().int().min(0).max(5),
    ati: z.number().int().min(0).max(5),
    ampela: z.number().int().min(0).max(5),
    puyuh: z.number().int().min(0).max(5)
  })
})

type OrderSchema = z.output<typeof orderSchema>
type SateKey = keyof OrderSchema['sate']

const toast = useToast()
const form = useTemplateRef('orderForm')
const submitIntent = ref<'add' | 'send'>('add')
const extraMenuOpen = ref(false)
const cart = ref<OrderSchema[]>([])
const orderSummary = useOrderSummary()

const state = reactive<OrderSchema>({
  customerName: '',
  portion: '1 Porsi',
  filling: 'Lengkap',
  omittedToppings: [],
  crackersSeparated: false,
  sambalLevel: 1,
  sate: {
    usus: 0,
    ati: 0,
    ampela: 0,
    puyuh: 0
  }
})

const portionOptions = [
  { label: '1 Porsi', value: '1 Porsi' as const, icon: 'i-lucide-utensils' },
  { label: '1/2 Porsi', value: '1/2 Porsi' as const, icon: 'i-lucide-soup' }
]

const fillingOptions = [
  { label: 'Lengkap', value: 'Lengkap' as const, icon: 'i-lucide-badge-check' },
  { label: 'Kostum', value: 'Kostum' as const, icon: 'i-lucide-settings-2' }
]

const sateItems: Array<{
  key: SateKey
  label: string
  image: string
}> = [
  {
    key: 'usus',
    label: 'Sate Usus',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCt8wWlT3urs24BaBjuRx5MxvHZ3AVdSE5k_-SZtHi23_GxFCTF40jFoeuuo7Wl9ufAkry9NVEvve4AP1e3NXmiUgjQrvxBRaCMtckGHXZvi5-FxqdnKYB1CRVPnqqHZL3sWi-e3Ys8vhxFFwPHgiy87TcI5aulwY7vpgZkZyZzMnZXkOV4TAX0UkN_dBRa7q-3cTLbt4nUWv4uCzgcCbs2VhLhIU2rtrmlGVM7sYOn2Sa5SIaEqcLaTbADKJynBHXKMR7qvP_iJIz9'
  },
  {
    key: 'ati',
    label: 'Sate Ati',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOjAtvsz4nuTadwNhDhjd8798QpNFj1qbtMoCFdLF_kVv0zVhixyfif2OhZXTXRRptynghT9m4NA8fjcYIEin657pyqi3bqPuuHmH6QOFyEWvUZIKzcfL-DyYH664SoVHoOUlq1bshKqn9BNVgguleOw04zvGvT4zYDIuM-m_bqwPORjjswx1-8_72-sgebZB2BzljO_8KJldkDZclolKVXN4vAhwD-3SY027AKHjtLgOF2eeQ0LBlE4HKH1Liz4J4ettsniPgNE3z'
  },
  {
    key: 'ampela',
    label: 'Sate Ampela',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXmwrzISAHtCvlqvY6XiuzgEt9CE7-z1Ynz6F5r8bv3OWupQTnpSkfg0LQIc-LwRO-ihxkcIJxkK2KJdqW6q1X3n0XbOvEyMOZqVZI8f5Rs7fMGJFgxPIBJPQ35KjctB1WqkaKyxsnyc7II84a2x6Pdng38Bok6iy6c1aR_Crp-lrsRd2Q0mvQLhTwNRkS4OtxZPSe2n4gwg9neVec5PTEtW8izJp-8CVowmXs1oB9oNgNA8ydYKrFh2_AYMGI4iZ8bXuUY0tsa0su'
  },
  {
    key: 'puyuh',
    label: 'Sate Puyuh',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDD7S51EQQPbUQC53r4AoJYVMDuNnUH7MI5NlHUxYdWXiwqUNaKF28VF4KE6o5ju1UytG5AK11yo-Cm53AJjBMU_ppwTYDP8osNLvGcM4Drif0RhiUugwSv39m0m1H3iBBvpwzG4FGuVJz72N0fdU2Z2FC6BXpV7oVuWvbBYxhiRbLKIi9ia0JhWVWoPCjCwqJurZdxsuz0eHKzosiwUdUR3phGxV8IDV76whmpi4QlsJYCOclTFcZrjk8zY9TMudDg-J_DGzdYoruB'
  }
]

const hasDraftName = computed(() => state.customerName.trim().length > 0)

function cloneOrder(data: OrderSchema): OrderSchema {
  return {
    ...data,
    omittedToppings: [...data.omittedToppings],
    sate: { ...data.sate }
  }
}

if (orderSummary.value) {
  Object.assign(state, cloneOrder(orderSummary.value))
}

function resetForm() {
  state.customerName = ''
  state.portion = '1 Porsi'
  state.filling = 'Lengkap'
  state.omittedToppings = []
  state.crackersSeparated = false
  state.sambalLevel = 1
  state.sate = {
    usus: 0,
    ati: 0,
    ampela: 0,
    puyuh: 0
  }
  extraMenuOpen.value = false
}

function setFilling(value: OrderSchema['filling']) {
  state.filling = value

  if (value === 'Lengkap') {
    state.omittedToppings = []
    state.crackersSeparated = false
  }
}

function toggleOmittedTopping(topping: typeof toppingValues[number]) {
  if (state.omittedToppings.includes(topping)) {
    state.omittedToppings = state.omittedToppings.filter(item => item !== topping)
    return
  }

  state.omittedToppings = [...state.omittedToppings, topping]
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function changeSambal(delta: number) {
  state.sambalLevel = clamp(state.sambalLevel + delta, 0, 3)
}

function changeSate(key: SateKey, delta: number) {
  state.sate[key] = clamp(state.sate[key] + delta, 0, 5)
}

function addOrder(data: OrderSchema) {
  cart.value.push(cloneOrder(data))
  toast.add({
    title: 'Pesanan tersimpan',
    description: `${data.customerName} masuk ke keranjang pesanan.`,
    color: 'success',
    icon: 'i-lucide-check-circle'
  })
  resetForm()
}

function setAddIntent() {
  submitIntent.value = 'add'
}

async function openOrderSummary(data: OrderSchema) {
  orderSummary.value = cloneOrder(data)
  await navigateTo('/ringkasan-pesanan')
}

async function onSubmit(event: FormSubmitEvent<OrderSchema>) {
  if (submitIntent.value === 'add') {
    addOrder(event.data)
    return
  }

  await openOrderSummary(event.data)
}

async function handleSendOrder() {
  submitIntent.value = 'send'

  if (hasDraftName.value) {
    await form.value?.submit()
    return
  }

  if (!cart.value.length) {
    toast.add({
      title: 'Belum ada pesanan',
      description: 'Isi nama pemesan atau tambahkan pesanan terlebih dahulu.',
      color: 'warning',
      icon: 'i-lucide-info'
    })
    return
  }

  await openOrderSummary(cart.value.at(-1)!)
}
</script>

<template>
  <main class="relative h-svh overflow-hidden bg-default text-default">
    <div class="h-full overflow-y-auto pb-28">
      <header class="sticky top-0 z-40 border-b border-muted bg-default/95 px-5 py-4 shadow-sm backdrop-blur">
        <div class="flex items-center justify-between">
          <NuxtLink
            to="/"
            class="flex min-w-0 items-center gap-3"
            aria-label="Kembali ke welcome screen"
          >
            <span class="grid size-10 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
              <UIcon
                name="i-lucide-utensils"
                class="size-6"
              />
            </span>
            <h1 class="truncate text-2xl leading-8 font-extrabold tracking-normal text-primary">
              Sobat Bubur
            </h1>
          </NuxtLink>

          <UAvatar
            icon="i-lucide-user"
            size="lg"
            class="ring-2 ring-primary/25"
          />
        </div>
      </header>

      <section class="space-y-6 px-5 py-4">
        <div class="relative h-48 overflow-hidden rounded-3xl shadow-lg">
          <img
            :src="heroImage"
            alt="Bubur ayam spesial"
            class="absolute inset-0 size-full object-cover"
          >
          <div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
          <div class="absolute inset-x-4 bottom-4 text-white">
            <p class="mb-1 text-xs leading-4 font-bold tracking-normal uppercase text-white/80">
              Menu hari ini
            </p>
            <h2 class="text-2xl leading-8 font-extrabold tracking-normal">
              Bubur Ayam Spesial
            </h2>
          </div>
        </div>

        <UForm
          id="order-form"
          ref="orderForm"
          :schema="orderSchema"
          :state="state"
          class="space-y-5"
          @submit="onSubmit"
        >
          <UFormField
            name="customerName"
            label="Nama Pemesan"
            required
          >
            <UInput
              v-model="state.customerName"
              size="xl"
              icon="i-lucide-user"
              placeholder="Masukkan nama..."
              class="w-full"
              :ui="{ base: 'min-h-14 rounded-2xl bg-elevated text-base' }"
            />
          </UFormField>

          <UFormField
            name="portion"
            label="Pilih Porsi"
            required
          >
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="option in portionOptions"
                :key="option.value"
                type="button"
                class="flex flex-row items-center justify-center gap-2 rounded-2xl border-2 p-4 text-sm leading-5 font-bold transition"
                :class="state.portion === option.value ? 'border-primary bg-primary/20 text-primary' : 'border-muted bg-default hover:border-primary/50'"
                @click="state.portion = option.value"
              >
                <UIcon
                  :name="option.icon"
                  class="size-6"
                />
                <span>{{ option.label }}</span>
              </button>
            </div>
          </UFormField>

          <UFormField
            name="filling"
            label="Isian Bubur"
            required
          >
            <div class="grid grid-cols-2 gap-3">
              <button
                v-for="option in fillingOptions"
                :key="option.value"
                type="button"
                class="flex items-center justify-center gap-2 rounded-2xl border-2 p-4 text-sm leading-5 font-bold transition"
                :class="state.filling === option.value ? 'border-primary bg-primary/20 text-primary' : 'border-muted bg-default hover:border-primary/50'"
                @click="setFilling(option.value)"
              >
                <UIcon
                  :name="option.icon"
                  class="size-5"
                />
                <span>{{ option.label }}</span>
              </button>
            </div>
          </UFormField>

          <div
            v-if="state.filling === 'Kostum'"
            class="rounded-3xl border border-muted bg-elevated p-4"
          >
            <UFormField
              name="omittedToppings"
              label="Tanpa Topping Apa?"
            >
              <div class="flex flex-wrap gap-2">
                <UButton
                  v-for="topping in toppingValues"
                  :key="topping"
                  type="button"
                  :label="topping"
                  :icon="state.omittedToppings.includes(topping) ? 'i-lucide-circle-minus' : undefined"
                  :color="state.omittedToppings.includes(topping) ? 'error' : 'neutral'"
                  :variant="state.omittedToppings.includes(topping) ? 'solid' : 'outline'"
                  size="sm"
                  class="rounded-full"
                  @click="toggleOmittedTopping(topping)"
                />
              </div>
            </UFormField>

            <UFormField
              name="crackersSeparated"
              class="mt-4"
            >
              <div class="flex items-center justify-between rounded-2xl border border-muted bg-default p-4">
                <div class="flex min-w-0 items-center gap-3">
                  <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <UIcon
                      name="i-lucide-layers"
                      class="size-5"
                    />
                  </span>
                  <span class="text-base leading-6 font-semibold">Krupuk Dipisah</span>
                </div>
                <USwitch
                  v-model="state.crackersSeparated"
                  size="xl"
                  aria-label="Krupuk dipisah"
                />
              </div>
            </UFormField>
          </div>

          <UCollapsible
            v-model:open="extraMenuOpen"
            class="flex flex-col gap-3"
          >
            <UButton
              type="button"
              color="neutral"
              variant="soft"
              block
              trailing-icon="i-lucide-chevron-down"
              class="group min-h-20 justify-between rounded-2xl border border-muted p-4 text-left"
              :ui="{
                trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
              }"
            >
              <span class="flex flex-col">
                <span class="text-xl leading-7 font-extrabold text-primary">Extra menu</span>
                <span class="text-xs leading-4 font-semibold text-muted">Lengkapi hidangan Anda</span>
              </span>
            </UButton>

            <template #content>
              <div class="space-y-2">
                <UFormField name="sambalLevel">
                  <div class="flex items-center justify-between rounded-2xl border border-muted bg-default p-4 shadow-sm">
                    <div class="flex min-w-0 items-center gap-3">
                      <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-error/10 text-error">
                        <UIcon
                          name="i-lucide-flame"
                          class="size-5"
                        />
                      </span>
                      <div class="min-w-0">
                        <p class="m-0 text-base leading-6 font-semibold">
                          Extra Sambal
                        </p>
                        <p class="m-0 text-xs leading-4 font-semibold text-muted">
                          Max level 3
                        </p>
                      </div>
                    </div>

                    <div class="flex shrink-0 items-center gap-2">
                      <UButton
                        type="button"
                        icon="i-lucide-minus"
                        color="neutral"
                        variant="soft"
                        size="sm"
                        square
                        aria-label="Kurangi level sambal"
                        class="rounded-full"
                        @click="changeSambal(-1)"
                      />
                      <span class="w-5 text-center text-xl leading-7 font-bold">{{ state.sambalLevel }}</span>
                      <UButton
                        type="button"
                        icon="i-lucide-plus"
                        color="primary"
                        size="sm"
                        square
                        aria-label="Tambah level sambal"
                        class="rounded-full"
                        @click="changeSambal(1)"
                      />
                    </div>
                  </div>
                </UFormField>

                <div
                  v-for="item in sateItems"
                  :key="item.key"
                  class="flex items-center justify-between gap-3 rounded-2xl border border-muted bg-default p-4"
                >
                  <div class="flex min-w-0 items-center gap-3">
                    <img
                      :src="item.image"
                      :alt="item.label"
                      class="size-12 shrink-0 rounded-xl object-cover"
                    >
                    <span class="truncate text-base leading-6 font-semibold">{{ item.label }}</span>
                  </div>
                  <div class="flex shrink-0 items-center gap-2">
                    <UButton
                      type="button"
                      icon="i-lucide-minus"
                      color="neutral"
                      variant="soft"
                      size="sm"
                      square
                      :aria-label="`Kurangi ${item.label}`"
                      class="rounded-full"
                      @click="changeSate(item.key, -1)"
                    />
                    <span class="w-5 text-center text-base leading-6 font-bold">{{ state.sate[item.key] }}</span>
                    <UButton
                      type="button"
                      icon="i-lucide-plus"
                      color="primary"
                      size="sm"
                      square
                      :aria-label="`Tambah ${item.label}`"
                      class="rounded-full"
                      @click="changeSate(item.key, 1)"
                    />
                  </div>
                </div>
              </div>
            </template>
          </UCollapsible>
        </UForm>
      </section>
    </div>

    <div class="absolute inset-x-0 bottom-0 z-50 border-t border-muted bg-default/95 shadow-[0_-18px_45px_rgb(0_0_0/0.12)] backdrop-blur">
      <div class="grid grid-cols-[minmax(0,1fr)_96px] gap-3 px-5 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3">
        <UButton
          type="submit"
          form="order-form"
          color="neutral"
          variant="soft"
          size="xl"
          block
          icon="i-lucide-user-plus"
          label="Tambah Pesanan"
          class="min-h-14 rounded-2xl border border-muted font-bold"
          @click="setAddIntent"
        />
        <UButton
          type="button"
          color="primary"
          size="xl"
          block
          icon="i-lucide-shopping-basket"
          :label="String(cart.length)"
          class="min-h-14 rounded-2xl font-extrabold"
          @click="handleSendOrder"
        />
      </div>
    </div>
  </main>
</template>
