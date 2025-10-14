import React, { useState, useEffect } from 'react'
import FlashcardNavigator from './FlashcardNavigator.jsx'
import Progress from './Progress.jsx'
import { getFlashcardsWithViewed } from '../supabaseQueries.js'
import { supabase } from '../supabase.js'

export default function FlashcardList({ selectedTopic, darkMode }) {
  const [flashcards, setFlashcards] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [refreshProgress, setRefreshProgress] = useState(0)
  const [userId, setUserId] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUserId(data?.user?.id || null)
      setLoadingUser(false)
    }
    fetchUser()
  }, [])

  useEffect(() => {
    if (!selectedTopic || !userId) return
    let active = true
    const fetchFlashcards = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getFlashcardsWithViewed(userId, selectedTopic)
        if (active) setFlashcards(data)
      } catch (err) {
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
  }, [selectedTopic, userId])

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
