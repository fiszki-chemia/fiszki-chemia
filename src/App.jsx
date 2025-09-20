import React, { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import Login from './components/Login.jsx'
import FlashcardList from './components/FlashcardList.jsx'
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
      const { data, error } = await supabase
        .from('flashcards')
        .select('topic, topic_name')
        .neq('topic', null)
      if (!error) {
        const uniqueTopics = Array.from(
          new Map(data.map(fc => [fc.topic, fc])).values()
        )
        setTopics(uniqueTopics)
      }
    }
    fetchTopics()
  }, [])

    useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light'
  }, [darkMode])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setLogoutMessage('Pomyślnie wylogowano!') // przekaż do Login
  }


const themeButtonStyle = {
  backgroundColor: darkMode ? '#5AA1BD' : '#A67B5B',
  color: darkMode ? '#0E0E0F' : '#ECEBDF',
  margin: '10px',
  padding: '5px 10px',
  cursor: 'pointer',
  borderRadius: '6px',
  border: 'none'
}

const buttonStyle = {
  backgroundColor: darkMode ? '#5AA1BD' : '#A67B5B',
  color: darkMode ? '#0E0E0F' : '#ECEBDF',
  marginBottom: '10px',
  padding: '10px',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'center',
  borderRadius: '6px',
  border: 'none',
}

  const logoutButtonStyle = {
    position: 'fixed',
    top: '10px',
    right: '10px',
    backgroundColor: darkMode ? '#5AA1BD' : '#A67B5B',
    color: darkMode ? '#0E0E0F' : '#ECEBDF',
    padding: '5px 10px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    zIndex: 1000,
  }
  
  if (!user) return <Login initialMessage={logoutMessage} />

  return (
    <div>
      <button
        onClick={() => setDarkMode(d => !d)}
        style={themeButtonStyle}
      >
        {darkMode ? 'Tryb jasny' : 'Tryb ciemny'}
      </button>
      
      <button
        onClick={handleLogout}
        style={logoutButtonStyle}
      >
        Wyloguj
      </button>

      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <div style={{ width: '200px', borderRight: '1px solid #ccc', padding: '20px' }}>
          {topics.map(t => (
            <button
              key={t.topic}
              onClick={() => setSelectedTopic(t.topic)}
              style={buttonStyle}
            >
              {t.topic_name}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {selectedTopic && <FlashcardList selectedTopic={selectedTopic} darkMode={darkMode} />}
        </div>
      </div>
  )}
  </div>
  )
}


export default App
