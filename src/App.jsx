import React, { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import { getTopics } from './supabaseQueries.js'
import Login from './components/Login.jsx'
import FlashcardList from './components/FlashcardList.jsx'
import CategoryPanel from './components/CategoryPanel.jsx'
import './index.css'

function App() {
  const [user, setUser] = useState(null)
  const [topics, setTopics] = useState([])
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [logoutMessage, setLogoutMessage] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user || null))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null))
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
  async function fetchTopics() {
    const data = await getTopics()
    console.log('📘 Pobrane tematy:', data)
    if (data.length > 0) {
      setTopics(data)
      setSelectedTopic(data[0].topic)
    }
  }
  fetchTopics()
}, [])


  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light'
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(d => !d)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setLogoutMessage('Pomyślnie wylogowano!')
  }

  if (!user) return <Login initialMessage={logoutMessage} />

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <CategoryPanel
        topics={topics}
        onSelect={setSelectedTopic}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        handleLogout={handleLogout}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        {selectedTopic && (
          <FlashcardList
            selectedTopic={selectedTopic}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  )
}

export default App
