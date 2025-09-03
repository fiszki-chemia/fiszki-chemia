import React, { useState } from 'react'

function Flashcard({ question, answer }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      style={{
        perspective: '1000px',
        width: '250px',
        height: '150px',
        margin: '10px',
      }}
    >
      <div
        style={{
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.6s',
          transformStyle: 'preserve-3d',
          border: '1px solid black',
          padding: '20px',
          cursor: 'pointer',
          position: 'relative',
          backgroundColor: '#fff',
          height: '100%',
        }}
      >
        <div style={{ backfaceVisibility: 'hidden' }}>
          <p><b>Pytanie:</b></p>
          <p>{question}</p>
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
          <p>{answer}</p>
        </div>
      </div>
    </div>
  )
}

export default Flashcard
