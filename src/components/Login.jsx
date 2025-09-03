import { useState } from 'react'
import { supabase } from '../supabase'

export default function Login() {
  const [email, setEmail] = useState('')

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) alert(error.message)
    else alert('Sprawdź maila z linkiem logowania!')
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Zaloguj się</h2>
      <input
        type="email"
        placeholder="Twój email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mr-2 rounded"
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
        Zaloguj
      </button>
    </div>
  )
}
