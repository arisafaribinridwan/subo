# 📌 Project Context: Aplikasi Pemesanan "Sobu" (SobatBubur)

## 1. Identitas Produk

### Nama Aplikasi: Sobu (SobatBubur)

**Fase Proyek:** MVP (Minimum Viable Product) untuk penggunaan internal/satu outlet.

Skala Saat Ini: Maksimal 18 porsi per hari (skala UMKM kecil), namun dirancang dengan arsitektur yang siap di-scale menjadi SaaS multi-tenant.

**Panduan Visual:** Mengikuti prinsip desain minimalis, modern, dan bersih. Fokus pada pengalaman pengguna yang sederhana dan intuitif.

**"Warm Comfort" (Pendekatan Rasa Lokal & Ramah)**

Gaya ini berfokus pada psikologi makanan. Warna-warna hangat merangsang nafsu makan dan memberikan kesan "comfort food" (bubur yang hangat). Sangat cocok untuk branding UMKM yang ingin terasa dekat dengan pelanggan, namun tetap rapi saat di-scale.

#### 1. Color Palette (Tailwind Tiers)

Primary (Brand): amber-500 (#f59e0b) hingga amber-600.

Filosofi: Warna kaldu, cakwe, dan bawang goreng. Menggugah selera dan ramah.

Secondary (Text/Headings): stone-800 (#292524)

Filosofi: Cokelat gelap alami, tidak sekeras hitam pekat.

Background: stone-50 (#fafaf9)

Filosofi: Off-white yang hangat, nyaman di mata.

Accent/Action (Success): emerald-500 (#10b981) - Untuk tombol "Selesai ✔".

Danger/Warning: rose-500 (#f43f5e) - Untuk checkbox pengecualian (⛔ Kecap, Kacang).

#### 2. Typography

Font Family: font-sans -> Nunito atau Quicksand (Google Fonts).

Karakter: Memiliki ujung yang agak membulat (rounded), memberikan kesan ramah, casual, dan modern.

Hierarchy:

Heading (Nama Aplikasi/Menu): text-2xl font-bold text-stone-800 tracking-tight

Body (Label form): text-base font-medium text-stone-700

Micro-copy (Rekap teks penjual): text-sm font-mono text-stone-600 leading-relaxed

1. Tech Stack & Arsitektur

Frontend & Server Engine: Nuxt (Vue 3 Composition API) ditenagai oleh Nitro.

Styling: Tailwind CSS.

Skema & Validasi: Zod (untuk validasi payload sisi client dan server).

Database & Autentikasi: Supabase (PostgreSQL untuk database relasional gratis, serta fitur Auth bawaan dengan Row Level Security untuk mengamankan halaman admin).

3. Fungsionalitas Inti

Aplikasi ini memiliki dua antarmuka utama (Tab):

A. Form Pembeli (Customer View)

Nama Pemesan: Teks (Required).

Porsi: 1 Porsi atau 1/2 Porsi (Default: 1 Porsi).

Isi:

Lengkap (Default).

Kostum (Memunculkan checkbox pengecualian: Tidak pakai Kecap, Krupuk, Kacang, Bawang Goreng, Daun Bawang).

Krupuk Pisah: Checkbox.

Extra Sambal(muncul menu jika dipilih): Stepper angka (Min: 0, Max: 3, Default: 1).

Sate Tambahan(muncul menu jika dipilih): Dropdown individual untuk Usus, Ati, Ampela, Puyuh (Min: 0, Max: 5, Default: 0).

B. Dashboard Penjual (Seller View)

Antrean Real-time: Menampilkan pesanan masuk berdasarkan urutan terbaru.

Format Rekap Teks Cerdas: Menampilkan pesanan dalam bentuk paragraf dan ada checklist (contoh: 1. Ari : 1P(⛔Kecap, kacang) + 2 usus + ati + krupuk pisah + sambel 2).

Logic: Jika kuantitas sate = 1, sembunyikan angkanya (tulis "usus" saja). Jika > 1, tulis angkanya (tulis "usus 2").

Logic: Teks "sambel" hanya muncul jika kuantitas > 1.

Aksi: Tombol "Selesai ✔" untuk menghapus pesanan dari daftar antrean aktif.

Utilitas: Tombol "Copy Rekap" untuk menyalin seluruh teks antrean ke clipboard perangkat.


Panduan Visual (Branding): Simpel, modern, dan minimalis. Warna utama menggunakan Amber/Orange dan abu-abu gelap. Aturan Mutlak Desain: Seluruh aset visual dan logo murni menggunakan siluet benda mati atau tipografi. Dilarang keras menggunakan elemen makhluk hidup (tanpa wajah, mata, hidung, atau mulut).