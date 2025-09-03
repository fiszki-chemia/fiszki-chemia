import React, { useEffect, useState } from 'react'
import Flashcard from './Flashcard.jsx'
import { supabase } from '../supabase.js'

function FlashcardList({ topic }) {
  const [flashcards, setFlashcards] = useState([])

  useEffect(() => {
    async function fetchFlashcards() {
      let query = supabase.from('flashcards').select('*')
      if (topic) query = query.eq('topic', topic)
      const { data, error } = await query
      if (error) console.log(error)
      else setFlashcards(data)
    }
    fetchFlashcards()
  }, [topic])

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {flashcards?.map(fc => (
        <Flashcard key={fc.id} question={fc.question} answer={fc.answer} />
      ))}
    </div>
  )
}

export default FlashcardList
