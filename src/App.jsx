import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState('all')

  // Save to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (e) => {
    e.preventDefault()
    if (inputValue.trim() === '') return

    const newTodo = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    }

    setTodos([newTodo, ...todos])
    setInputValue('')
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const totalTodos = todos.length
  const completedTodos = todos.filter(todo => todo.completed).length
  const pendingTodos = totalTodos - completedTodos

  return (
    <div className="todo-app">
      <header className="app-header">
        <h1 className="app-title">✨ Todo App</h1>
        <p className="app-subtitle">Organize your day, one task at a time</p>
      </header>

      <form className="input-section" onSubmit={addTodo}>
        <input
          type="text"
          className="todo-input"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className="add-btn">
          Add Task
        </button>
      </form>

      <div className="stats-section">
        <div className="stat-card total">
          <div className="stat-number">{totalTodos}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card completed">
          <div className="stat-number">{completedTodos}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card pending">
          <div className="stat-number">{pendingTodos}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>

      <div className="filter-section">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <div className="todo-list">
        {filteredTodos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <p className="empty-text">
              {filter === 'all' 
                ? 'No tasks yet!' 
                : filter === 'active' 
                  ? 'No active tasks!' 
                  : 'No completed tasks!'}
            </p>
            <p className="empty-subtext">
              {filter === 'all' && 'Add your first task above to get started'}
            </p>
          </div>
        ) : (
          filteredTodos.map(todo => (
            <div 
              key={todo.id} 
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
            >
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span className="checkmark"></span>
              </label>
              <span className="todo-text">{todo.text}</span>
              <button 
                className="delete-btn"
                onClick={() => deleteTodo(todo.id)}
                title="Delete task"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {completedTodos > 0 && (
        <div className="clear-section">
          <button className="clear-btn" onClick={clearCompleted}>
            Clear Completed ({completedTodos})
          </button>
        </div>
      )}
    </div>
  )
}

export default App
