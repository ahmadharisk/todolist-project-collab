# Todo List

Aplikasi todo list sederhana: React + Vite di frontend, Express + SQLite di backend.

Penjelasan interaktif cara kerjanya (teknologi, arsitektur, alur data, API): buka [`docs/cara-kerja.html`](docs/cara-kerja.html) langsung di browser.

## Kebutuhan

- Node.js 22.13 atau lebih baru (SQLite memakai modul bawaan Node `node:sqlite`, tanpa library tambahan)

## Cara menjalankan

Buka dua terminal.

Terminal 1, backend (http://localhost:3001):

```bash
cd backend
npm install
npm run dev
```

Terminal 2, frontend (http://localhost:5173):

```bash
cd frontend
npm install
npm run dev
```

Lalu buka http://localhost:5173 di browser. Data tersimpan di `backend/todos.db`, dibuat otomatis saat backend pertama kali jalan.

## Menjalankan dengan Docker

Cukup satu perintah dari folder utama (tidak perlu Node.js terpasang):

```bash
docker compose up --build
```

Lalu buka http://localhost:3001. Frontend di-build lalu disajikan langsung oleh Express, jadi hanya ada satu container. Data tersimpan di volume `todos-data`, jadi tetap ada walau container dihentikan atau di-build ulang.

Perintah lain yang berguna:

```bash
docker compose up -d --build   # jalan di background
docker compose down            # hentikan (data tetap aman)
docker compose down -v         # hentikan dan hapus data
```

Pakai Podman? Ganti `docker compose` dengan `podman compose`, perintah lainnya sama.

## Struktur

```
Dockerfile         # build frontend, lalu jalankan backend yang menyajikannya
docker-compose.yml # satu service + volume untuk database
docs/
  cara-kerja.html  # halaman penjelasan interaktif
backend/
  server.js        # Express + SQLite, semua endpoint API
frontend/
  vite.config.js   # proxy /api ke backend
  src/App.jsx      # tampilan dan logika todo
  src/App.css      # gaya tampilan (otomatis ikut mode gelap)
```

## API

| Method | Endpoint          | Body                  | Keterangan                 |
| ------ | ----------------- | --------------------- | -------------------------- |
| GET    | `/api/todos`      |                       | Ambil semua todo           |
| POST   | `/api/todos`      | `{ title }`           | Tambah todo                |
| PATCH  | `/api/todos/:id`  | `{ title?, done? }`   | Ubah judul / status selesai |
| DELETE | `/api/todos/:id`  |                       | Hapus todo                 |
