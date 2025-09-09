import React from 'react'

export default function Flashcard({ question, answer, flipped }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        perspective: '1000px',
      }}
    >
      <div
        className = "flashcard-inner"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.6s',
          transformStyle: 'preserve-3d',
          border: '1px solid black',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        {/* Przód */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            padding: '20px',
            backfaceVisibility: 'hidden',
            borderRadius: '8px',
            backgroundColor: '#fff', // tło, żeby zakrywać tył
          }}
        >
          <p><b>Pytanie:</b></p>
          <p>{question ?? '—'}</p>
        </div>

        {/* Tył */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            padding: '20px',
            backfaceVisibility: 'hidden',
            borderRadius: '8px',
            backgroundColor: '#fff', // tło, żeby zakrywać przód
            transform: 'rotateY(180deg)',
          }}
        >
          <p><b>Odpowiedź:</b></p>
          <p>{answer ?? '—'}</p>
        </div>
      </div>
    </div>
  )
}
