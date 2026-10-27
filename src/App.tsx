import { useEffect, useState } from 'react';

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

const STORAGE_KEY = 'todo-list-items';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Todo[];
        if (Array.isArray(parsed)) setTodos(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text: trimmed, completed: false },
    ]);
    setInput('');
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <div style={{
      maxWidth: 520,
      margin: '40px auto',
      padding: '24px',
      fontFamily: 'Arial, sans-serif',
      background: '#f7f7f7',
      borderRadius: 16,
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    }}>
      <h2 style={{ marginBottom: 20 }}>To-Do List</h2>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task"
          style={{
            flex: 1,
            padding: '12px 14px',
            borderRadius: 10,
            border: '1px solid #ddd',
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addTodo();
          }}
        />
        <button
          onClick={addTodo}
          style={{
            padding: '12px 18px',
            border: 'none',
            borderRadius: 10,
            background: '#2563eb',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Add
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {todos.length === 0 ? (
          <li style={{ color: '#666', textAlign: 'center', padding: 16 }}>
            No tasks yet.
          </li>
        ) : (
          todos.map((todo) => (
            <li
              key={todo.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '12px 10px',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span
                  style={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#888' : '#111',
                  }}
                >
                  {todo.text}
                </span>
              </label>

              <button
                onClick={() => deleteTodo(todo.id)}
                style={{
                  border: 'none',
                  background: '#ef4444',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '8px 10px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
