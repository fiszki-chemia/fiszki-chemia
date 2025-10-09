import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'

export default function Progress({ topic, darkMode, userId, refreshKey }) {
  const [progress, setProgress] = useState({ viewed: 0, total: 0 })

  useEffect(() => {
    if (!topic || !userId) return

    let active = true

    async function fetchProgress() {
      try {
        const { data: flashcards, error: flashcardsError } = await supabase
          .from('flashcards')
          .select('id')
          .eq('topic', topic)
        if (flashcardsError) throw flashcardsError

        const { data: viewed, error: viewedError } = await supabase
          .from('user_flashcards')
          .select('flashcard_id')
          .eq('user_id', userId)
          .eq('topic', topic)
          .eq('viewed', true)
        if (viewedError) throw viewedError

        if (active) setProgress({ viewed: viewed.length, total: flashcards.length })
      } catch (err) {
        console.error('Błąd ładowania postępu:', err)
        if (active) setProgress({ viewed: 0, total: 0 })
      }
    }

    fetchProgress()
    return () => { active = false }
  }, [topic, userId, refreshKey])

  const percent = progress.total ? Math.round((progress.viewed / progress.total) * 100) : 0
  const barColor = darkMode ? '#5AA1BD' : '#A67B5B'
  const bgColor = darkMode ? '#333' : '#eee'

  return (
    <div style={{ margin: '20px auto', width: '80%' }}>
      {/* Tło paska */}
      <div
        style={{
          height: 16,
          background: bgColor,
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        {/* Wypełnienie paska */}
        <div
          style={{
            width: `${percent}%`,
            height: '100%',
            background: barColor,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  )
}
