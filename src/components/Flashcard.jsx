import React from 'react'

export default function Flashcard({ question, answer, flipped }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        transition: 'transform 0.6s',
        transformStyle: 'preserve-3d',
        border: '1px solid black',
        borderRadius: '8px',
        padding: '20px',
        backgroundColor: '#fff',
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      <div style={{ backfaceVisibility: 'hidden' }}>
        <p><b>Pytanie:</b></p>
        <p>{question ?? '—'}</p>
      </div>
      <div
        style={{
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <p><b>Odpowiedź:</b></p>
        <p>{answer ?? '—'}</p>
      </div>
    </div>
  )
}
