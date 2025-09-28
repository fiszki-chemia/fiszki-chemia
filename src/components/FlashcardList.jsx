import React, { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import FlashcardNavigator from './FlashcardNavigator.jsx'
import Progress from './Progress.jsx'

export default function FlashcardList({ selectedTopic, darkMode }) {
  const [flashcards, setFlashcards] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [refreshProgress, setRefreshProgress] = useState(0)
  const [userId, setUserId] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)

  // Pobranie zalogowanego użytkownika
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUserId(data?.user?.id || null)
      setLoadingUser(false)
    }
    getUser()
  }, [])

  // Wczytywanie fiszek
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

  const handleViewed = () => setRefreshProgress(r => r + 1)

  if (loadingUser) return <div>Ładowanie użytkownika...</div>
  if (loading) return <div>Ładowanie fiszek...</div>
  if (error) return <div>{error}</div>
  if (!flashcards.length) return <div>Brak fiszek w tej kategorii</div>

  return (
    <div>
      <FlashcardNavigator
        flashcards={flashcards}
        darkMode={darkMode}
        userId={userId}
        onViewed={handleViewed}
      />
      <Progress
        topic={selectedTopic}
        darkMode={darkMode}
        userId={userId}
        refreshKey={refreshProgress}
      />
    </div>
  )
}
