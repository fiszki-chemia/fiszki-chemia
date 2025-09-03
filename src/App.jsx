import React, { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import Login from './components/Login.jsx'
import FlashcardList from './components/FlashcardList.jsx'

function App() {
  const [user, setUser] = useState(null)
  const [topic, setTopic] = useState(null)       // zmienione
  const [topics, setTopics] = useState([])       // lista tematów

  // Sprawdzenie sesji
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user || null))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null))
    return () => listener.subscription.unsubscribe()
  }, [])

  // Pobieranie unikalnych tematów
  useEffect(() => {
    async function fetchTopics() {
      const { data, error } = await supabase
        .from('flashcards')
        .select('topic')
        .neq('topic', null)
      if (error) console.log(error)
      else {
        const uniqueTopics = [...new Set(data.map(fc => fc.topic))]
        setTopics(uniqueTopics)
      }
    }
    fetchTopics()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Fiszki Chemia</h1>
      {!user ? (
        <Login />
      ) : (
        <>
          <div style={{ marginBottom: '20px' }}>
            {topics.map(t => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                style={{ marginRight: '10px' }}
              >
                {t}
              </button>
            ))}
            <button onClick={() => setTopic(null)}>Wszystkie</button>
          </div>
          <FlashcardList topic={topic} />  {/* <-- zmienione */}
        </>
      )}
    </div>
  )
}

export default App
