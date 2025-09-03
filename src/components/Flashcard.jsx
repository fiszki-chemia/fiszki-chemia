import React from 'react'

function Flashcard({ question, answer }) {
  return (
    <div style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
      <p><b>Pytanie:</b> {question}</p>
      <p><b>Odpowiedź:</b> {answer}</p>
    </div>
  )
}

export default Flashcard
