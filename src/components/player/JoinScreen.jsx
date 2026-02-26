import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../../supabase'

function JoinScreen({ onJoin }) {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const urlCode = searchParams.get('code')
    if (urlCode) setCode(urlCode)
  }, [])

  async function handleJoin() {
    if (!code || !name.trim()) {
      setError('Bitte Code und Name eingeben!')
      return
    }
    setLoading(true)
    setError('')

    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('code', code)
      .single()

    if (quizError || !quiz) {
      setError('❌ Ungültiger Code! Bitte nochmal prüfen.')
      setLoading(false)
      return
    }

    const { count } = await supabase
      .from('players')
      .select('*', { count: 'exact' })
      .eq('quiz_id', quiz.id)

    if (count >= quiz.max_players) {
      setError('❌ Quiz ist voll! Max. ' + quiz.max_players + ' Spieler.')
      setLoading(false)
      return
    }

    const { data: player, error: playerError } = await supabase
      .from('players')
      .insert([{ quiz_id: quiz.id, name: name.trim(), score: 0 }])
      .select()
      .single()

    if (playerError) {
      setError('❌ Fehler beim Beitreten. Bitte nochmal versuchen.')
      setLoading(false)
      return
    }

    onJoin({ quiz, player })
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16 text-center">
      <div className="text-6xl mb-6">🎮</div>
      <h1 className="text-4xl font-bold text-[#6c63ff] mb-2">Quiz beitreten</h1>
      <p className="text-[#7070a0] mb-10">Gib den Code ein, den dein Moderator anzeigt</p>

      <div className="flex items-center gap-3 bg-[#6c63ff]/10 border border-[#6c63ff]/20 rounded-xl p-4 mb-6 text-left">
        <div className="text-3xl">📱</div>
        <div>
          <p className="font-semibold text-sm">QR-Code scannen</p>
          <p className="text-[#7070a0] text-xs mt-1">
            Halte deine Kamera auf den QR-Code – du wirst automatisch weitergeleitet
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6 text-[#7070a0] text-xs">
        <div className="flex-1 h-px bg-[#2a2a3d]"></div>
        oder manuell eingeben
        <div className="flex-1 h-px bg-[#2a2a3d]"></div>
      </div>

      <input
        type="text"
        maxLength={4}
        placeholder="0000"
        value={code}
        onChange={e => setCode(e.target.value.replace(/[^0-9]/g, ''))}
        className="w-full bg-[#13131a] border-2 border-[#2a2a3d] focus:border-[#6c63ff] outline-none rounded-2xl py-5 text-center text-4xl font-bold tracking-[1rem] text-white mb-4 transition-all"
      />

      <input
        type="text"
        placeholder="Dein Name oder Teamname"
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleJoin()}
        className="w-full bg-[#13131a] border-2 border-[#2a2a3d] focus:border-[#6c63ff] outline-none rounded-2xl py-4 text-center text-lg text-white mb-4 transition-all"
      />

      {error && <p className="text-[#ff6584] text-sm mb-4">{error}</p>}

      <button
        onClick={handleJoin}
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#6c63ff] to-[#9c95ff] hover:opacity-90 disabled:opacity-50 text-white font-bold py-5 rounded-2xl text-xl transition-all"
      >
        {loading ? 'Bitte warten...' : "Los geht's →"}
      </button>
    </div>
  )
}

export default JoinScreen