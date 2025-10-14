import React, { useState, useEffect } from 'react'
import Flashcard from './Flashcard.jsx'
import { supabase } from '../supabase.js'

// Funkcja zapisująca obejrzenie fiszki
async function markAsViewed(userId, flashcardId, topic) {
  if (!userId || !flashcardId) return { marked: false }

  const { data: existing } = await supabase
    .from('user_flashcards')
    .select('id, viewed')
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

    const copied = initialFlashcards.map(f => ({ ...f, viewed: !!f.viewed }))
    setFlashcards(copied)

    const firstIndex = Math.floor(Math.random() * copied.length)
    setCurrentIndex(firstIndex)
    setHistory([firstIndex])
    setFlipped(false)
  }, [initialFlashcards])

  if (!flashcards?.length || currentIndex === null) return <div>Ładowanie fiszek...</div>

  const card = flashcards[currentIndex]

  // Flip i oznaczanie jako obejrzane
  const handleFlip = () => {
    setFlipped(prevFlipped => {
      const newFlipped = !prevFlipped
      if (!prevFlipped && userId && card?.id) {
        markAsViewed(userId, card.id, card.topic).then(({ marked }) => {
          if (!marked) return
          onViewed?.()
          setFlashcards(prev => {
            const copy = [...prev]
            copy[currentIndex] = { ...copy[currentIndex], viewed: true }
            return copy
          })
        })
      }
      return newFlipped
    })
  }

  // pomocnicza: wybiera losowy index z tablicy indeksów, z ograniczeniem excludeIndex i maxAttempts
  const pickRandomIndexFrom = (indexes, excludeIndex = null, maxAttempts = 20) => {
    if (!indexes.length) return null
    if (indexes.length === 1) {
      return indexes[0] === excludeIndex ? null : indexes[0]
    }

    let attempts = 0
    while (attempts < maxAttempts) {
      attempts++
      const candidate = indexes[Math.floor(Math.random() * indexes.length)]
      if (candidate !== excludeIndex) return candidate
    }
    // fallback: pick first different
    for (let i = 0; i < indexes.length; i++) {
      if (indexes[i] !== excludeIndex) return indexes[i]
    }
    return null
  }

  // showNext: preferuje nowe, ale 5% powtórek
  const showNext = () => {
    if (!flashcards.length) return

    const unviewedIndexes = flashcards.map((f, i) => (!f.viewed ? i : -1)).filter(i => i !== -1)
    const viewedIndexes = flashcards.map((f, i) => (f.viewed ? i : -1)).filter(i => i !== -1)

    let pool = []
    // jeśli nie ma nieobejrzanych -> pool = wszystkie
    if (unviewedIndexes.length === 0) {
      pool = flashcards.map((_, i) => i)
    } else {
      // są nieobejrzane -> 95% z nieobejrzanych, 5% z obejrzanych (jeśli istnieją)
      const pickViewed = viewedIndexes.length > 0 && Math.random() * 100 < 5
      pool = pickViewed ? viewedIndexes : unviewedIndexes
    }

    // spróbuj wybrać z pool index różny od currentIndex
    let nextIndex = pickRandomIndexFrom(pool, currentIndex, 20)

    // jeśli nie udało się (np. pool zawiera tylko currentIndex) -> wybierz z całej tablicy bez currentIndex
    if (nextIndex === null) {
      const allExceptCurrent = flashcards.map((_, i) => i).filter(i => i !== currentIndex)
      nextIndex = pickRandomIndexFrom(allExceptCurrent, null, 20)
      // jeżeli dalej null (np. tylko jedna fiszka), pozwól na currentIndex
      if (nextIndex === null) nextIndex = currentIndex
    }

    setCurrentIndex(nextIndex)
    setHistory(prev => [...prev, nextIndex])
    setFlipped(false)
  }

  // Cofanie
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
