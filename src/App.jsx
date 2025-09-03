import React, { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import Login from './components/Login.jsx'
import FlashcardList from './components/FlashcardList.jsx'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => setUser(data.session?.user || null))
    supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null))
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Fiszki Chemia</h1>
      {!user ? <Login /> : <FlashcardList />}
    </div>
  )
}

export default App
