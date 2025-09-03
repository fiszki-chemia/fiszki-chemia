import React, { useEffect, useState } from 'react'
import Flashcard from './Flashcard.jsx'
import { supabase } from '../supabase.js'

function FlashcardList({ category }) {
  const [flashcards, setFlashcards] = useState([])

  useEffect(() => {
    fetchFlashcards()
  }, [category]) // <- zmienia się po wyborze działu

  async function fetchFlashcards() {
    let query = supabase.from('flashcards').select('*')
    if (category) query = query.eq('category', category)
    const { data, error } = await query
    if (error) console.log(error)
    else setFlashcards(data)
  }

  return (
    <div>
      {flashcards.map(fc => (
        <Flashcard key={fc.id} question={fc.question} answer={fc.answer} />
      ))}
    </div>
  )
}

export default FlashcardList
