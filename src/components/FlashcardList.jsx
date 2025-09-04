import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import FlashcardNavigator from './FlashcardNavigator.jsx'

export default function FlashcardList({ selectedTopic }) {
  const [flashcards, setFlashcards] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!selectedTopic) return
    let active = true
    async function fetchFlashcards() {
      setLoading(true)
      setError(null)
      try {
        const { data, error } = await supabase
          .from('flashcards')
          .select('*')
          .eq('topic', selectedTopic)
        if (error) throw error
        if (active) setFlashcards(Array.isArray(data) ? data : [])
      } catch (e) {
        console.error(e)
        if (active) {
          setError('Błąd ładowania fiszek')
          setFlashcards([])
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchFlashcards()
    return () => { active = false }
  }, [selectedTopic])

  if (loading) return <div>Ładowanie fiszek...</div>
  if (error) return <div>{error}</div>
  if (!flashcards.length) return <div>Brak fiszek w tej kategorii</div>

  return <FlashcardNavigator flashcards={flashcards} />
}
