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
          <p class="noselect"><b>PYTANIE</b></p>
          <p class="noselect">{question ?? '—'}</p>
        </div>

        {/* Tył */}
        <div className="flashcard-back">
          <p class="noselect"><b>ODPOWIEDŹ</b></p>
          <p class="noselect">{answer ?? '—'}</p>
        </div>
      </div>
    </div>
  )
}
