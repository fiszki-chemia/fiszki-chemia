import React, { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import Login from './components/Login.jsx'
import FlashcardList from './components/FlashcardList.jsx'

function App() {
  const [user, setUser] = useState(null)
  const [category, setCategory] = useState(null) // nowa zmienna

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user || null))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null))
    return () => listener.subscription.unsubscribe()
  }, [])

  const categories = ['chemia ogólna', 'gazy szlachetne', 'organika'] // przykładowe działy

  return (
    <div style={{ padding: '20px' }}>
      <h1>Fiszki Chemia</h1>
      {!user ? <Login /> : (
        <>
          <div style={{ marginBottom: '20px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{ marginRight: '10px' }}
              >
                {cat}
              </button>
            ))}
            <button onClick={() => setCategory(null)}>Wszystkie</button>
          </div>
          <FlashcardList category={category} />
        </>
      )}
    </div>
  )
}

export default App
