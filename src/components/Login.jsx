import { useState } from 'react'
import { supabase } from '../supabase.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false) // false = logowanie, true = rejestracja

  const handleSubmit = async () => {
    if (isRegister) {
      // Rejestracja
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) alert('Błąd: ' + error.message)
      else alert('Konto utworzone! Możesz się teraz zalogować.')
    } else {
      // Logowanie
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) alert('Błąd: ' + error.message)
      else alert('Zalogowano!')
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '40px auto', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
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
        }}
      />

      <input
        type="password"
        placeholder="Hasło"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          marginBottom: '16px',
          width: '100%',
          borderRadius: '4px',
        }}
      />

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
        <span
          onClick={() => setIsRegister(!isRegister)}
          style={{
            color: '#3b82f6',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          {isRegister ? 'Zaloguj się' : 'Zarejestruj się'}
        </span>
      </p>
    </div>
  )
}
