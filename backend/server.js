import express from 'express'
import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'

// Database SQLite disimpan di file todos.db (dibuat otomatis kalau belum ada).
// Lokasinya bisa diganti lewat DB_PATH, dipakai di Docker agar data masuk volume.
const db = new DatabaseSync(process.env.DB_PATH || path.join(import.meta.dirname, 'todos.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`)

// SQLite menyimpan boolean sebagai 0/1, kita ubah ke true/false untuk frontend
const toTodo = (row) => ({ ...row, done: Boolean(row.done) })

const app = express()
app.use(express.json())

// Di Docker, hasil build frontend ada di folder public dan disajikan langsung dari sini
app.use(express.static(path.join(import.meta.dirname, 'public')))

// Ambil semua todo, yang terbaru di atas
app.get('/api/todos', (req, res) => {
  const rows = db.prepare('SELECT * FROM todos ORDER BY id DESC').all()
  res.json(rows.map(toTodo))
})

// Tambah todo baru
app.post('/api/todos', (req, res) => {
  const title = String(req.body?.title ?? '').trim()
  if (!title) return res.status(400).json({ error: 'Judul todo tidak boleh kosong' })

  const row = db.prepare('INSERT INTO todos (title) VALUES (?) RETURNING *').get(title)
  res.status(201).json(toTodo(row))
})

// Ubah judul dan/atau status selesai
app.patch('/api/todos/:id', (req, res) => {
  const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(Number(req.params.id))
  if (!todo) return res.status(404).json({ error: 'Todo tidak ditemukan' })

  const { title, done } = req.body ?? {}
  const newTitle = title === undefined ? todo.title : String(title).trim()
  if (!newTitle) return res.status(400).json({ error: 'Judul todo tidak boleh kosong' })
  const newDone = done === undefined ? todo.done : done ? 1 : 0

  const row = db
    .prepare('UPDATE todos SET title = ?, done = ? WHERE id = ? RETURNING *')
    .get(newTitle, newDone, todo.id)
  res.json(toTodo(row))
})

// Hapus todo
app.delete('/api/todos/:id', (req, res) => {
  const { changes } = db.prepare('DELETE FROM todos WHERE id = ?').run(Number(req.params.id))
  if (!changes) return res.status(404).json({ error: 'Todo tidak ditemukan' })
  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Backend jalan di http://localhost:${PORT}`))
