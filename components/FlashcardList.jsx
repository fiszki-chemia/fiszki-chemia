import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import Flashcard from './Flashcard'

export default function FlashcardList() {
  const [cards, setCards] = useState([])

  useEffect(() => {
    const fetchCards = async () => {
      let { data, error } = await supabase.from('flashcards').select('*')
      if (!error) setCards(data)
    }
    fetchCards()
  }, [])

  return (
    <div>
      {cards.map((card) => (
        <Flashcard key={card.id} card={card} />
      ))}
    </div>
  )
}
