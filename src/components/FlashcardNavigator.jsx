import React, { useState, useEffect } from 'react'
import Flashcard from './Flashcard.jsx'

export default function FlashcardNavigator({ flashcards, darkMode }) {
  const [currentIndex, setCurrentIndex] = useState(null)
  const [history, setHistory] = useState([])
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    if (!Array.isArray(flashcards) || flashcards.length === 0) {
      setCurrentIndex(null)
      setHistory([])
      setFlipped(false)
      return
    }
    const first = Math.floor(Math.random() * flashcards.length)
    setCurrentIndex(first)
    setHistory([first])
    setFlipped(false)
  }, [flashcards])

  const ready = currentIndex !== null && Array.isArray(flashcards) && flashcards.length > 0
  if (!ready) return <div>Ładowanie fiszek...</div>

  function showNext() {
    if (!flashcards.length || flashcards.length <= 1) return
    let next = Math.floor(Math.random() * flashcards.length)
    while (next === currentIndex) next = Math.floor(Math.random() * flashcards.length)
    setCurrentIndex(next)
    setHistory(prev => [...prev, next])
    setFlipped(false)
  }

  function showPrev() {
    if (history.length <= 1) return
    setHistory(prev => {
      const copy = prev.slice(0, -1)
      setCurrentIndex(copy[copy.length - 1])
      setFlipped(false)
      return copy
    })
  }

  const card = flashcards[currentIndex]
  const arrowColWidth = 60
  const arrowColor = darkMode ? '#79DAFF' : '#A67B5B' // dostosuj kolory do motywu

  const arrowStyleBase = {
    cursor: 'pointer',
    fontSize: '1.5rem',
    border: 'none',
    background: 'none',
    width: 40,
    height: 40,
    lineHeight: '40px',
    padding: 0,
    color: arrowColor, 
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `${arrowColWidth}px 320px ${arrowColWidth}px`,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        margin: '20px auto',
        height: 220,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={showPrev}
          aria-label="Poprzednia fiszka"
          disabled={history.length <= 1}
          style={{
            ...arrowStyleBase,
            visibility: history.length > 1 ? 'visible' : 'hidden',
            zIndex: 2,
          }}
        >
          ◀
        </button>
      </div>

      <div
        style={{
          perspective: '1000px',
          width: '100%',
          height: 200,
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          onClick={() => setFlipped(f => !f)}
          style={{ width: '280px', height: '100%' }}
        >
          <Flashcard
            question={card?.question}
            answer={card?.answer}
            flipped={flipped}
            darkMode={darkMode} // przekazujemy darkMode do Flashcard.jsx
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={showNext}
          aria-label="Następna fiszka"
          style={{
            ...arrowStyleBase,
            visibility: flashcards.length > 1 ? 'visible' : 'hidden',
            zIndex: 2,
          }}
        >
          ▶
        </button>
      </div>
    </div>
  )
}
