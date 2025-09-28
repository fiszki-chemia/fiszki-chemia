import React, { useState, useEffect } from 'react'
import Flashcard from './Flashcard.jsx'
import { supabase } from '../supabase.js'

// Funkcja zapisująca obejrzenie fiszki
async function markAsViewed(userId, flashcardId, topic) {
  if (!userId || !flashcardId) return { marked: false }

  // sprawdzamy, czy już obejrzano
  const { data: existing } = await supabase
    .from('user_flashcards')
    .select('*')
    .eq('user_id', userId)
    .eq('flashcard_id', flashcardId)
    .single()

  if (existing?.viewed) return { marked: false }

  const { error } = await supabase
    .from('user_flashcards')
    .upsert({
      user_id: userId,
      flashcard_id: flashcardId,
      topic: topic,
      viewed: true,
    })

  if (error) {
    console.error('Błąd przy zapisie obejrzenia fiszki:', error)
    return { marked: false }
  }

  return { marked: true }
}

export default function FlashcardNavigator({ flashcards: initialFlashcards, darkMode, userId, onViewed }) {
  const [flashcards, setFlashcards] = useState([])
  const [currentIndex, setCurrentIndex] = useState(null)
  const [history, setHistory] = useState([])
  const [flipped, setFlipped] = useState(false)

  // Inicjalizacja lokalnego stanu fiszek
  useEffect(() => {
    if (!initialFlashcards || initialFlashcards.length === 0) {
      setFlashcards([])
      setCurrentIndex(null)
      setHistory([])
      setFlipped(false)
      return
    }

    // kopiujemy fiszki i dodajemy pole viewed jeśli go nie ma
    const copied = initialFlashcards.map(f => ({ ...f, viewed: !!f.viewed }))
    setFlashcards(copied)

    const firstIndex = Math.floor(Math.random() * copied.length)
    setCurrentIndex(firstIndex)
    setHistory([firstIndex])
    setFlipped(false)
  }, [initialFlashcards])

  if (!flashcards.length || currentIndex === null) return <div>Ładowanie fiszek...</div>

  const card = flashcards[currentIndex]

  // Funkcja do flipowania fiszki
  const handleFlip = () => {
    setFlipped(f => {
      const newFlipped = !f
      if (!f && userId && card?.id) {
        markAsViewed(userId, card.id, card.topic).then(({ marked }) => {
          if (marked) {
            onViewed && onViewed()
            // aktualizujemy lokalnie viewed w tablicy fiszek
            setFlashcards(prev => {
              const copy = [...prev]
              copy[currentIndex] = { ...copy[currentIndex], viewed: true }
              return copy
            })
          }
        })
      }
      return newFlipped
    })
  }

  // Funkcja losująca następną fiszkę z zasadą 5% dla obejrzanych
  const showNext = () => {
    if (!flashcards.length) return

    let nextIndex
    let attempts = 0
    while (true) {
      attempts++
      if (attempts > 100) break // awaryjnie

      nextIndex = Math.floor(Math.random() * flashcards.length)
      const nextCard = flashcards[nextIndex]

      if (!nextCard.viewed) break // nowe fiszki mają 100% szansy
      if (Math.random() * 100 < 5) break // obejrzane ~5%
    }

    setCurrentIndex(nextIndex)
    setHistory(prev => [...prev, nextIndex])
    setFlipped(false)
  }

  // Funkcja do cofania do poprzedniej fiszki
  const showPrev = () => {
    if (history.length <= 1) return
    setHistory(prev => {
      const copy = prev.slice(0, -1)
      setCurrentIndex(copy[copy.length - 1])
      setFlipped(false)
      return copy
    })
  }

  const arrowColWidth = 60
  const arrowColor = darkMode ? '#5AA1BD' : '#A67B5B'
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
        <div onClick={handleFlip} style={{ width: '280px', height: '100%' }}>
          <Flashcard
            question={card?.question}
            answer={card?.answer}
            flipped={flipped}
            darkMode={darkMode}
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
