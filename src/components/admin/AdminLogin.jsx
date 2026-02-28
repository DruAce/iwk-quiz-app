import { useState } from 'react'

const ADMIN_PASSWORD = 'iwk2024'

function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('iwk-admin', 'true')
      onLogin()
    } else {
      setError('❌ Falsches Passwort!')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="max-w-sm w-full mx-4">
        <div className="text-center mb-8">
          <img
            src="https://www.iwk.eu/images/IWK/page/logo_iwk.svg"
            alt="IWK"
            className="h-12 mx-auto mb-6 brightness-0 invert"
          />
          <h1 className="text-3xl font-bold text-white mb-2">Admin-Bereich</h1>
          <p className="text-[#7070a0]">Bitte Passwort eingeben</p>
        </div>

        <div className="bg-[#13131a] border border-[#2a2a3d] rounded-2xl p-8">
          <div className="text-center text-5xl mb-6">🔒</div>

          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full bg-[#0a0a0f] border-2 border-[#2a2a3d] focus:border-[#6c63ff] outline-none rounded-xl py-4 px-5 text-white text-center text-lg mb-4 transition-all"
          />

          {error && (
            <p className="text-[#ff6584] text-sm text-center mb-4">{error}</p>
          )}

          <button
            onClick={handleLogin}
            className="w-full bg-[#6c63ff] hover:bg-[#7c74ff] text-white font-bold py-4 rounded-xl transition-all text-lg"
          >
            Einloggen →
          </button>

          <p className="text-center text-xs text-[#7070a0] mt-4">
            Nur für autorisierte Moderatoren
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin