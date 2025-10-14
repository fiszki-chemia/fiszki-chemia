import { useState, useEffect } from 'react'
import { supabase } from '../supabase.js'
import '../index.css'

export default function Login({ initialMessage }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [isReset, setIsReset] = useState(false)
  const [isRecovery, setIsRecovery] = useState(false)
  const [message, setMessage] = useState('')
  const [showMessage, setShowMessage] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function mapAuthError(message){
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
  }

  useEffect(() => {
    if (initialMessage) showNotification(initialMessage)

    // Sprawdzenie URL pod recovery token
    const urlParams = new URLSearchParams(window.location.search)
    const type = urlParams.get('type')
    if (type === 'recovery') {
      setIsRecovery(true)
    }
  }, [initialMessage])

  const showNotification = (msg) => {
    setMessage(msg)
    setShowMessage(true)
    setTimeout(() => setShowMessage(false), 3000)
  }

  const handleSubmit = async () => {
    if (isReset) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin
      })
      if (error) showNotification('😢 Błąd: ' + error.message)
      else {
        showNotification('Link do resetu hasła został wysłany na Twój e-mail.')
        setIsReset(false)
      }
      return
    }

    if (isRecovery) {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) showNotification('😢 Błąd: ' + error.message)
      else {
        showNotification('Hasło zostało zmienione! Możesz się teraz zalogować.')
        setIsRecovery(false)
        setPassword('')
      }
      return
    }

    let response
    if (isRegister) {
      response = await supabase.auth.signUp({ email, password })
      if (response.error) showNotification('😢 Błąd: ' + response.error.message)
      else showNotification('Konto utworzone! Możesz się teraz zalogować.')
    } else {
      response = await supabase.auth.signInWithPassword({ email, password })
      if (response.error) showNotification('😢 Błąd: ' + mapAuthError(response.error.message))
      else showNotification('Zalogowano!')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f4ea' }}>
      <div style={{ padding: '20px', maxWidth: '400px', width: '90%', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center', color: 'green' }}>
          {isRecovery ? 'Ustaw nowe hasło' : isReset ? 'Reset hasła' : isRegister ? 'Rejestracja' : 'Logowanie'}
        </h2>

        {/* Pole email */}
        {(isReset || !isRecovery) && (
          <input
            type="email"
            placeholder="Twój e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '12px', width: '100%', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        )}

        {/* Pole hasła */}
        {(!isReset) && (
          <div style={{ position: 'relative', width: '100%', marginBottom: '16px' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ border: '1px solid #ccc', padding: '10px', width: '100%', borderRadius: '4px', paddingRight: '40px', boxSizing: 'border-box' }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', fontSize: '18px' }}>
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        )}

        <button onClick={handleSubmit} style={{ backgroundColor: '#3b82f6', color: 'white', padding: '10px', width: '100%', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '12px' }}>
          {isRecovery ? 'Ustaw hasło' : isReset ? 'Wyślij link' : isRegister ? 'Zarejestruj się' : 'Zaloguj się'}
        </button>

        {!isRecovery && !isReset && (
          <>
            <p style={{ marginTop: '16px', textAlign: 'center' }}>
              {!isReset && (isRegister ? 'Masz konto?' : 'Nie masz konta?')}{' '}
              <button
                onClick={() => {
                  if (isReset) setIsReset(false)
                  else setIsRegister(!isRegister)
                  setIsRecovery(false)
                }}
                className="login-link"
              >
                {!isReset ? (isRegister ? 'Zaloguj się' : 'Zarejestruj się') : 'Powrót do logowania'}
              </button>
            </p>

            <p style={{ marginTop: '8px', textAlign: 'center' }}>
              <button
                onClick={() => {
                  setIsReset(true)
                  setIsRegister(false)
                  setIsRecovery(false)
                }}
                className="login-link"
              >
                Nie pamiętam hasła
              </button>
            </p>
          </>
        )}
      </div>

      {showMessage && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', backgroundColor: '#3b82f6', color: 'white', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px' }}>
          {message}
        </div>
      )}
    </div>
  )
}
