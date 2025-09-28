import React, { useState } from 'react'
import '../index.css'

export default function CategoryPanel({ topics, onSelect, darkMode, toggleDarkMode, handleLogout }) {
  const [open, setOpen] = useState(false)

  const panelBg = darkMode ? '#25282C' : '#D8C8B4'
  const categoryBtnBg = darkMode ? '#5AA1BD' : '#A67B5B'
  const categoryBtnColor = darkMode ? '#0E0E0F' : '#ECEBDF'

  return (
    <>
      {/* Półprzezroczyste tło */}
      {open && <div className="panel-backdrop" onClick={() => setOpen(false)} />}

      {/* Panel */}
      <div
        className="category-panel"
        style={{
          backgroundColor: panelBg,
          transform: open ? 'translateX(0)' : 'translateX(-250px)',
        }}
      >
        {/* Lista kategorii */}
        <ul>
          {topics.map(t => (
            <li key={t.topic}>
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

        {/* Przyciski na dole */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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

      {/* Przycisk wysuwania panelu – kwadratowy */}
      {!open && (
        <button
          className="panel-toggle-btn"
          style={{
            backgroundColor: panelBg,             // tło panelu
            color: darkMode ? '#4277B5' : '#3B6B48', // zawsze kontrastujący kolor ikony
          }}
          onClick={() => setOpen(true)}
        >
          ☰
        </button>

      )}
    </>
  )
}
