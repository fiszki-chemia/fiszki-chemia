import React, { useState, useEffect } from 'react'
import { supabase } from './supabase.js'
import Login from './components/Login.jsx'
import FlashcardList from './components/FlashcardList.jsx'

function App() {
  const [user, setUser] = useState(null)
  const [category, setCategory] = useState(null)
  const [categories, setCategories] = useState([])

  // Sprawdzenie sesji i subskrypcja zmian
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user || null))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  // Pobieranie unikalnych kategorii z bazy
  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from('flashcards')
        .select('category')
        .neq('category', null)
      if (error) console.log(error)
      else {
        const uniqueCats = [...new Set(data.map(fc => fc.category))]
        setCategories(uniqueCats)
      }
    }
    fetchCategories()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>Fiszki Chemia</h1>
      {!user ? (
        <Login />
      ) : (
        <>
          <div style={{ marginBottom: '20px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{ marginRight: '10
