import React from 'react'

export default function Flashcard({ question, answer, flipped }) {
  return (
    <div style={{ width: '100%', height: '100%', perspective: '1000px' }}>
      <div
        className="flashcard-inner"
        style={{
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Przód */}
        <div className="flashcard-front">
          <p><b>Pytanie:</b></p>
          <p>{question ?? '—'}</p>
        </div>

        {/* Tył */}
        <div className="flashcard-back">
          <p><b>Odpowiedź:</b></p>
          <p>{answer ?? '—'}</p>
        </div>
      </div>
    </div>
  )
}
