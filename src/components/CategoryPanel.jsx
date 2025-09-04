import { useState } from 'react'

export default function CategoryPanel({ categories, onSelect }) {
  const [open, setOpen] = useState(true)

  return (
    <div
      style={{
        width: open ? 200 : 0,
        transition: 'width 0.3s',
        overflow: 'hidden',
        borderRight: '1px solid #ccc',
        backgroundColor: '#f0f0f0',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          margin: 10,
          padding: 5,
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          fontSize: '1.2rem',
        }}
      >
        {open ? '⏴' : '⏵'}
      </button>

      {open && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {categories.map(cat => (
            <li key={cat.id}>
              <button
                onClick={() => onSelect(cat.id)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                }}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
