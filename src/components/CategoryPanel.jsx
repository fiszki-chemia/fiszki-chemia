import React, { useEffect, useState } from 'react'
import { getTopics } from '../supabaseQueries.js'
import '../index.css'

export default function CategoryPanel({ onSelect, darkMode, toggleDarkMode, handleLogout }) {
  const [topics, setTopics] = useState([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fetchTopics = async () => {
      const data = await getTopics()
      setTopics(data)
    }
    fetchTopics()
  }, [])

  const panelBg = darkMode ? '#25282C' : '#D8C8B4'
  const categoryBtnBg = darkMode ? '#5AA1BD' : '#A67B5B'
  const categoryBtnColor = darkMode ? '#0E0E0F' : '#ECEBDF'

  return (
    <>
      {open && <div className="panel-backdrop" onClick={() => setOpen(false)} />}

      <div
        className="category-panel"
        style={{
          backgroundColor: panelBg,
          transform: open ? 'translateX(0)' : 'translateX(-250px)',
        }}
      >
        <ul>
          {topics.map(t => (
            <li key={t.id}>
              <button
                className="category-btn"
                style={{
                  backgroundColor: categoryBtnBg,
                  color: categoryBtnColor,
                }}
                onClick={() => {
                  onSelect(t.topic)
                  setOpen(false)
                }}
              >
                {t.topic_name}
              </button>
            </li>
          ))}
        </ul>

        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <button
            className="footer-btn"
            style={{ backgroundColor: categoryBtnBg, color: categoryBtnColor }}
            onClick={toggleDarkMode}
          >
            {darkMode ? 'Tryb jasny' : 'Tryb ciemny'}
          </button>
          <button
            className="footer-btn"
            style={{ backgroundColor: categoryBtnBg, color: categoryBtnColor }}
            onClick={handleLogout}
          >
            Wyloguj
          </button>
        </div>
      </div>

      {!open && (
        <button
          className="panel-toggle-btn"
          style={{
            backgroundColor: panelBg,
            color: darkMode ? '#4277B5' : '#3B6B48',
          }}
          onClick={() => setOpen(true)}
        >
          ☰
        </button>
      )}
    </>
  )
}


