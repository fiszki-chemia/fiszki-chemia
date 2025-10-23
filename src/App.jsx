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

  // Ta flaga blokuje automatyczne ustawianie usera podczas zmiany hasła
  const [isRecovery, setIsRecovery] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  useEffect(() => {
    // Pobierz sesję przy starcie
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user || null))

    // Słuchaj zmian auth state
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event)

      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true)
        setIsChangingPassword(true)
        setUser(null)
      } else if (!isChangingPassword) {
        // Nie ustawiaj usera, jeśli w trakcie zmiany hasła
        setIsRecovery(false)
        setUser(session?.user || null)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [isChangingPassword])

  // Callback przekazywany do Login, żeby zresetować flagę po zmianie hasła
  const onPasswordChangeSuccess = () => {
    setIsChangingPassword(false)
  }

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

  // Jeśli brak usera lub jesteśmy w trybie recovery - pokaż logowanie
  if (!user || isRecovery) {
    return (
      <Login
        initialMessage={logoutMessage}
        isRecoveryStart={isRecovery}
        onPasswordChangeSuccess={onPasswordChangeSuccess}
      />
    )
  }

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
