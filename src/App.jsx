import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Login from './components/Login'
import FlashcardList from './components/FlashcardList'

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => setUser(data.session?.user))
    supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user))
  }, [])

  if (!user) return <Login />
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Fiszki z chemii</h1>
      <FlashcardList />
    </div>
  )
}
