# Product Requirements Document (PRD)
**Project Name:** Mini App Pesanan Bubur Ayam
**Version:** 1.0.0
**Target Phase:** MVP (Minimum Viable Product) untuk Internal/Single-Outlet

## 1. Product Overview
Sebuah aplikasi web interaktif *Single Page Application* (SPA) untuk menangani pemesanan bubur ayam. Aplikasi ini memiliki dua antarmuka (Tab): "View Pembeli" untuk input pesanan dan "View Penjual" untuk memantau antrean pesanan secara *real-time*. Desain harus berfokus pada operasional yang *low-cost*, cepat, dan andal untuk volume tinggi.

## 2. Technical Stack & Architecture
*   **Framework Utama:** Nuxt 4 (dengan ekosistem Vue 3 Composition API) + PWA.
*   **Styling:** NUXT UI + Tailwind CSS.
*   **Server Engine:** Nitro (untuk *server-side routing* dan *API endpoints*).
*   **Data Validation:** Zod (untuk skema validasi *payload* pesanan di sisi klien dan server).
*   **State Management:** Reaktivitas bawaan Vue (`ref`, `reactive`) atau Pinia (opsional jika *state* semakin kompleks).
*   **Layout:** Tampilan Mobile web app only, bahkan untuk desktop.

## 3. Core Features & Requirements

### 3.1. Customer View (Formulir Pemesanan)
*   **Input Nama Pemesan:** Teks (Wajib).
*   **Pilihan Porsi:** *Radio button* (1 Porsi / 1/2 Porsi). Default: 1 Porsi.
*   **Pilihan Kustomisasi Isi:**
    *   *Radio button* (Lengkap / Kostum). Default: Lengkap.
    *   Jika "Kostum" dipilih, tampilkan *checkbox* pengecualian: Tidak pakai (Kecap, Krupuk, Kacang, Bawang Goreng, Daun Bawang).
*   **Opsi Krupuk:** *Checkbox* (Krupuk Dipisah).
*   **Kuantitas Sambal:** *Stepper* (Min: 0, Max: 3). Default: 1.
*   **Tambahan Sate:** *Dropdown/Stepper* individual untuk Usus, Ati, Ampela, Puyuh (Min: 0, Max: 5). Default: 0.
*   **Pesan Lagi:** ada tombol "Tambah Pesanan" untuk menambahkan pesanan baru ke antrean.
*   **ada summary pesanan sebelum submit**: menampilkan ringkasan pesanan yang telah diisi sebelum dikirim ke antrean.
*   **Submit Pesanan:** Tombol "Kirim Pesanan" untuk menambahkan pesanan ke antrean *state*.

### 3.2. Seller View (Dashboard Manajemen Pesanan)
*   **Daftar Antrean:** Menampilkan daftar pesanan masuk secara urut dari yang terbaru.
*   **Format Tampilan:** Paragraf teks berurutan (contoh: `1. Budi : 1P(⛔Kecap) + usus 2 + ati + krupuk pisah + sambel 2`).
*   **Logika Kondisional Teks:** Sembunyikan *item* yang bernilai 0. Sembunyikan angka kuantitas jika bernilai 1. Teks "sambel" hanya muncul jika kuantitas > 1.
*   **Tindakan:** tekan list untuk menandakan bahwa pembeli sudah bayar.
*   **Fitur Utilitas:** Tombol "Copy Rekap" untuk menyalin seluruh daftar antrean aktif ke *clipboard*.
*   **Notifikasi UI:** *Badge counter* berwarna merah pada Tab Penjual yang menunjukkan jumlah antrean pesanan aktif.

## 4. Data Structures & Validation (Zod Schema Target)
AI harus mengimplementasikan skema Zod dengan struktur dasar berikut untuk memvalidasi *payload* sebelum memproses *state* atau API:

```typescript
const OrderSchema = z.object({
  id: z.string().uuid().or(z.number()),
  nama: z.string().min(1, "Nama wajib diisi"),
  porsi: z.enum(["1P", "1/2P"]),
  isi: z.enum(["Lengkap", "Kostum"]),
  tanpa: z.array(z.string()),
  krupukPisah: z.boolean(),
  sambal: z.number().min(0).max(3),
  sate: z.object({
    usus: z.number().min(0).max(5),
    ati: z.number().min(0).max(5),
    ampela: z.number().min(0).max(5),
    puyuh: z.number().min(0).max(5),
  })
});