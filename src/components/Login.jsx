import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import '../index.css'


export default function Login({ initialMessage }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false) // false = logowanie, true = rejestracja
  const [message, setMessage] = useState('') // Stan wiadomości do wyświetlenia
  const [showMessage, setShowMessage] = useState(false) // Stan widoczności wiadomości

const [showPassword, setShowPassword] = useState(false)
  
function mapAuthError(message): string {
  switch (message) {
    case 'Invalid login credentials':
      return 'Nieprawidłowy e-mail lub hasło.'
    case 'User already registered':
      return 'Ten e-mail jest już zarejestrowany.'
    case 'Email not confirmed':
      return 'Musisz najpierw potwierdzić swój adres e-mail.'
    default:
      return 'Wystąpił nieznany błąd. Spróbuj ponownie.'
  }
  
  useEffect(() => {
    if (initialMessage) {
      showNotification(initialMessage)
    }
  }, [initialMessage])
  
  const handleSubmit = async () => {
    let response;
    if (isRegister) {
      // Rejestracja
      response = await supabase.auth.signUp({
        email,
        password,
      })
      if (response.error) {
        showNotification('Błąd: ' + response.error.message)
      } else {
        showNotification('Konto utworzone! Możesz się teraz zalogować.')
      }
    } else {
      // Logowanie
      response = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (response.error) {
        showNotification('😢 Błąd : ' + mapAuthError(response.error.message))
      } else {
        showNotification('Zalogowano!')
        console.log('logged in!');
      }
    }
  }

  // Wyświetla się prostokąt UwU
  const showNotification = (message) => {
    console.log('showNotification called');
    setMessage(message)
    setShowMessage(true)
    console.log('wiadomosc wyswietlona');
    setTimeout(() => {
      setShowMessage(false)
      console.log('wiadomosc znika');
    }, 3000) // Znika TwT
  }

   return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f4ea',
      }}
    >
      <div
        style={{
          padding: '20px',
          maxWidth: '400px',
          width: '90%',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '20px',
            textAlign: 'center',
            color: 'green',
          }}
        >
          {isRegister ? 'Rejestracja' : 'Logowanie'}
        </h2>

        <input
          type="email"
          placeholder="Twój e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            border: '1px solid #ccc',
            padding: '10px',
            marginBottom: '12px',
            width: '100%',
            borderRadius: '4px',
            boxSizing: 'border-box',
          }}
        />

        <div style={{ position: 'relative', width: '100%', marginBottom: '16px' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              width: '100%',
              borderRadius: '4px',
              paddingRight: '40px',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#3b82f6',
              fontSize: '18px',
            }}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        <button
          onClick={handleSubmit}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '10px',
            width: '100%',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {isRegister ? 'Zarejestruj się' : 'Zaloguj się'}
        </button>

        <p style={{ marginTop: '16px', textAlign: 'center' }}>
          {isRegister ? 'Masz konto?' : 'Nie masz konta?'}{' '}
          <button
            onClick={() => setIsRegister(!isRegister)}
            style={{
              color: '#3b82f6',
              cursor: 'pointer',
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              padding: 0,
            }}
          >
            {isRegister ? 'Zaloguj się' : 'Zarejestruj się'}
          </button>
        </p>
      </div>

      {showMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '14px',
          }}
        >
          {message}
        </div>
      )}
    </div>
  )
}
