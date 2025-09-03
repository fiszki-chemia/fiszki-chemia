import { useState } from 'react'
import { supabase } from '../supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false) // false = logowanie, true = rejestracja

  const handleSubmit = async () => {
    if (isRegister) {
      // Rejestracja
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      if (error) alert('Błąd: ' + error.message)
      else alert('Konto utworzone! Możesz się teraz zalogować.')
    } else {
      // Logowanie
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) alert('Błąd: ' + error.message)
      else alert('Zalogowano!')
    }
  }

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-4">{isRegister ? 'Rejestracja' : 'Logowanie'}</h2>

      <input
        type="email"
        placeholder="Twój e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      />

      <input
        type="password"
        placeholder="Hasło"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-4 w-full rounded"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        {isRegister ? 'Zarejestruj się' : 'Zaloguj się'}
      </button>

      <p className="mt-2 text-center">
        {isRegister ? 'Masz konto?' : 'Nie masz konta?'}{' '}
        <span
          onClick={() => setIsRegister(!isRegister)}
          className="text-blue-500 cursor-pointer underline"
        >
          {isRegister ? 'Zaloguj się' : 'Zarejestruj się'}
        </span>
      </p>
    </div>
  )
}
