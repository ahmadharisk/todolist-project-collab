# Todo List

Aplikasi todo list sederhana: React + Vite di frontend, Express + SQLite di backend.

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

## Struktur

```
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
