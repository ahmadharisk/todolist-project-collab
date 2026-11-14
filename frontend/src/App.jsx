import { useEffect, useState } from 'react'

const FILTERS = {
  Semua: () => true,
  Aktif: (todo) => !todo.done,
  Selesai: (todo) => todo.done,
}

const today = new Date().toLocaleDateString('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

// Panggil backend. Kalau gagal, lempar error berisi pesan dari server.
async function api(path, method = 'GET', body) {
  const res = await fetch(`/api/todos${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body && JSON.stringify(body),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || 'Gagal terhubung ke server')
  }
  return res.status === 204 ? null : res.json()
}

export default function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [filter, setFilter] = useState('Semua')
  const [error, setError] = useState('')

  // Jalankan aksi ke server; kalau gagal, tampilkan pesannya di layar
  async function handle(action) {
    try {
      await action()
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    handle(async () => setTodos(await api('')))
  }, [])

  function addTodo(e) {
    e.preventDefault()
    const newTitle = title.trim()
    if (!newTitle) return
    setTitle('') // kosongkan langsung supaya bisa lanjut mengetik todo berikutnya
    handle(async () => {
      const todo = await api('', 'POST', { title: newTitle })
      setTodos((prev) => [todo, ...prev])
    })
  }

  function updateTodo(id, changes) {
    handle(async () => {
      const updated = await api(`/${id}`, 'PATCH', changes)
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)))
    })
  }

  function deleteTodo(id) {
    handle(async () => {
      await api(`/${id}`, 'DELETE')
      setTodos((prev) => prev.filter((t) => t.id !== id))
    })
  }

  const visibleTodos = todos.filter(FILTERS[filter])
  const activeCount = todos.filter((t) => !t.done).length

  return (
    <main className="app">
      <header>
        <h1>Todo</h1>
        <p>{today}</p>
      </header>

      {error && <p className="error">{error}</p>}

      <section className="card">
        <form className="add-form" onSubmit={addTodo}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Mau mengerjakan apa hari ini?"
            aria-label="Todo baru"
          />
          <button type="submit" disabled={!title.trim()}>
            Tambah
          </button>
        </form>

        {visibleTodos.length > 0 ? (
          <ul className="todo-list">
            {visibleTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} onUpdate={updateTodo} onDelete={deleteTodo} />
            ))}
          </ul>
        ) : (
          <p className="empty">
            {todos.length === 0 ? 'Belum ada todo. Tambahkan satu di atas!' : 'Tidak ada todo di sini.'}
          </p>
        )}

        {todos.length > 0 && (
          <footer>
            <span>{activeCount} belum selesai</span>
            <div className="filters">
              {Object.keys(FILTERS).map((name) => (
                <button
                  key={name}
                  className={filter === name ? 'active' : ''}
                  onClick={() => setFilter(name)}
                >
                  {name}
                </button>
              ))}
            </div>
          </footer>
        )}
      </section>

      {todos.length > 0 && <p className="hint">Klik dua kali pada todo untuk mengedit</p>}
    </main>
  )
}

function TodoItem({ todo, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(todo.title)

  function save() {
    setEditing(false)
    const newTitle = text.trim()
    if (newTitle && newTitle !== todo.title) onUpdate(todo.id, { title: newTitle })
    else setText(todo.title)
  }

  return (
    <li className={todo.done ? 'todo done' : 'todo'}>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onUpdate(todo.id, { done: !todo.done })}
        aria-label="Tandai selesai"
      />

      {editing ? (
        <input
          className="edit"
          value={text}
          autoFocus
          onChange={(e) => setText(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
          aria-label="Edit todo"
        />
      ) : (
        <span onDoubleClick={() => setEditing(true)}>{todo.title}</span>
      )}

      <button className="delete" onClick={() => onDelete(todo.id)} aria-label="Hapus todo">
        ×
      </button>
    </li>
  )
}
