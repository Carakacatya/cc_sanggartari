# 🎭 SanggarTari Surabaya

Direktori budaya mobile untuk menemukan sanggar tari, studio seni, dan akademi budaya di Kota Surabaya — lengkap dengan peta interaktif, rute navigasi, dan info pagelaran/acara seni terkini.

> **Mata Kuliah:** Cloud Computing
> **Nama:** _(isi nama lengkap)_
> **NIM:** _(isi NIM)_
> **Program Studi:** D-IV Teknik Informatika — Fakultas Vokasi, Universitas Airlangga

---

## 📖 Tentang Aplikasi

SanggarTari Surabaya adalah aplikasi direktori resmi yang membantu masyarakat menemukan sanggar tari, studio seni, dan akademi budaya terdekat di Surabaya. Aplikasi ini menyediakan informasi lengkap (alamat, jam operasional, kontak, foto), peta interaktif dengan rute mengikuti jalan, serta info terkini seputar pagelaran, festival, dan workshop kesenian di kota Surabaya.

## ✨ Fitur Utama

- **Direktori Sanggar** — daftar sanggar tari/studio/akademi dengan pencarian dan filter kategori
- **Peta Interaktif** — lokasi semua sanggar di peta Surabaya, lengkap dengan marker dan popup detail
- **Rute Navigasi Real-time** — garis rute mengikuti jalan (bukan garis lurus) menggunakan OpenRouteService, lengkap estimasi jarak & waktu tempuh
- **Detail Sanggar** — galeri foto, jam operasional, alamat, nomor telepon, koordinat, dan tombol navigasi langsung ke Google Maps
- **Info & Pagelaran** — info acara seni budaya Surabaya (pagelaran, festival, workshop, pameran, berita) dengan halaman detail dan tautan ke sumber asli
- **Splash Screen** — tampilan pembuka dengan logo dan identitas aplikasi
- **Tentang Aplikasi** — profil aplikasi, statistik, dan daftar teknologi yang digunakan

## 🛠️ Teknologi yang Digunakan

| Komponen | Teknologi |
|---|---|
| Mobile App | React Native (Expo) |
| Navigasi | React Navigation (Bottom Tabs + Native Stack) |
| Peta | react-native-maps |
| Rute Jalan | OpenRouteService API |
| Lokasi/GPS | expo-location |
| Backend API | Google Apps Script (GAS) |
| Database | Google Sheets |
| Platform | Android & iOS |

## 🗂️ Struktur Navigasi

```
App
├── Home (Stack)
│   ├── HomeList      → daftar & pencarian sanggar
│   └── Detail         → detail sanggar
├── Map (Stack)
│   ├── MapMain        → peta interaktif + rute
│   └── Detail          → detail sanggar
├── Info (Stack)
│   ├── InfoMain        → daftar info & pagelaran
│   └── InfoDetail      → detail info/pagelaran
└── About                → tentang aplikasi


## 🔗 Backend & Sumber Data

Aplikasi ini menggunakan **Google Apps Script** sebagai REST API sederhana yang membaca/menulis data dari **Google Sheets** sebagai database.

| Resource | Link |
|---|---|
| Google Apps Script (Web App URL) | `PLACEHOLDER_GAS_URL` |
| Google Apps Script (Source Code) | `PLACEHOLDER_GAS_SCRIPT_EDITOR_URL` |
| Google Sheets (Spreadsheet) | `PLACEHOLDER_GOOGLE_SHEETS_URL` |

> Ganti ketiga link di atas dengan link aktual setelah deployment.

### Struktur Sheet

**Tab `sanggar`** — data utama sanggar tari/studio/akademi

| Kolom | Keterangan |
|---|---|
| `id` | ID unik (otomatis dari baris) |
| `nama` | Nama sanggar/studio/akademi |
| `alamat` | Alamat lengkap |
| `telepon` | Nomor kontak |
| `latitude`, `longitude` | Koordinat lokasi |
| `jam_buka` | Jam operasional per hari |
| `foto` | URL foto (pisahkan dengan `\|` untuk multi-foto) |
| `link_maps` | Tautan Google Maps |
| `deskripsi` | Deskripsi singkat |

**Tab `InfoBudaya`** — data info, pagelaran, dan acara seni budaya

| Kolom | Keterangan |
|---|---|
| `id` | ID unik |
| `judul` | Nama acara/info |
| `kategori` | `Pagelaran` / `Event` / `Festival` / `Workshop` / `Pameran` / `Berita` |
| `tanggal` | Tanggal pelaksanaan (teks bebas, contoh: "10 Mei 2026") |
| `lokasi` | Nama venue/lokasi acara |
| `deskripsi` | Ringkasan singkat acara |
| `penyelenggara` | Pihak penyelenggara |
| `kontak` | Nomor/email kontak (opsional) |
| `foto` | URL foto acara |
| `link` | Tautan ke sumber/website asli |

### Endpoint API (GAS)

| Endpoint | Keterangan |
|---|---|
| `?action=getAll` | Ambil semua data sanggar |
| `?action=getAll&q=keyword` | Cari sanggar berdasarkan nama/alamat/deskripsi |
| `?action=getAll&category=Sanggar%20Tari` | Filter berdasarkan kategori |
| `?action=getById&id=1` | Ambil detail 1 sanggar |
| `?action=getCategories` | Ambil daftar kategori unik |
| `?action=getInfo` | Ambil semua data info & pagelaran |
| `?action=getInfo&q=keyword` | Cari info berdasarkan judul/lokasi/deskripsi/penyelenggara |
| `?action=getInfo&category=Pagelaran` | Filter info berdasarkan kategori |

## 🚀 Cara Menjalankan

### 1. Clone & Install

```bash
git clone PLACEHOLDER_REPO_URL
cd SanggarTariApp
npm install
```

### 2. Konfigurasi

Buka `src/config/api.js`, lalu set:

```javascript
export const GAS_URL = "PLACEHOLDER_GAS_URL"; // Web App URL dari Google Apps Script
```

Untuk fitur rute mengikuti jalan di Peta, daftar API key gratis di [openrouteservice.org](https://openrouteservice.org/dev/#/signup), lalu set di `MapScreen.js`:

```javascript
const ORS_API_KEY = "PLACEHOLDER_ORS_API_KEY";
```

### 3. Jalankan

```bash
npx expo start
```

Scan QR code dengan aplikasi **Expo Go** (Android/iOS), atau jalankan di emulator.

## 📁 Struktur Folder

```
SanggarTariApp/
├── App.js                       # entry point, navigasi utama (Tab + Stack)
├── app.json                     # konfigurasi Expo
├── eas.json                     # konfigurasi build EAS
├── assets/
│   └── images/                  # icon, splash-icon, favicon, adaptive-icon
└── src/
    ├── components/               # komponen reusable (jika ada)
    ├── config/
    │   └── api.js                 # konfigurasi GAS_URL, COLORS, CATEGORIES, getCat()
    └── screens/
        ├── SplashScreen.js         # splash/landing page saat app dibuka
        ├── HomeScreen.js           # daftar & pencarian sanggar
        ├── MapScreen.js            # peta interaktif + rute navigasi
        ├── DetailScreen.js         # detail sanggar
        ├── InfoScreen.js           # daftar info & pagelaran budaya
        ├── InfoDetailScreen.js     # detail info/pagelaran
        └── AboutScreen.js          # tentang aplikasi
```

## 📊 Statistik Data (saat ini)

- **98+** sanggar terdaftar
- **10+** kecamatan tercakup
- **5** kategori sanggar (Sanggar Tari, Studio, Akademi, Sekolah, Lainnya)
- **18+** info pagelaran/acara seni budaya

## 📌 Catatan Pengembangan

- Backend menggunakan Google Apps Script sebagai serverless API, sehingga tidak memerlukan server terpisah.
- Update data dilakukan langsung melalui Google Sheets tanpa perlu redeploy aplikasi.
- Setiap perubahan pada kode GAS memerlukan **Deploy → Manage Deployments → New Version** agar perubahan aktif di endpoint yang sama.
- Rute navigasi menggunakan OpenRouteService (gratis, 2.000 request/hari) dengan fallback garis lurus jika API gagal/kuota habis.

---

<p align="center">
  Dibuat untuk tugas Mata Kuliah Cloud Computing<br/>
  Program Studi D-IV Teknik Informatika · Fakultas Vokasi · Universitas Airlangga
</p>
