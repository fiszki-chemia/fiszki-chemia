import React from 'react'

export default function Flashcard({ question, answer, flipped }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        perspective: '1000px', // dodaj perspektywę
      }}
    >
      <div
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
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#fff',
          }}
        >
          <p><b>Pytanie:</b></p>
          <p>{question ?? '—'}</p>
        </div>

        {/* Tył */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#fff',
          }}
        >
          <p><b>Odpowiedź:</b></p>
          <p>{answer ?? '—'}</p>
        </div>
      </div>
    </div>
  )
}
