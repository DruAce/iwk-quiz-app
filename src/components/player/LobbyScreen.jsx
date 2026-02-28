import { useEffect } from 'react'
import { supabase } from '../../supabase'

function LobbyScreen({ quiz, player, onStart }) {
  const capacity = Math.round((1 / quiz.max_players) * 100)

  useEffect(() => {
    const channel = supabase
      .channel('quiz-status-' + quiz.id)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'quizzes',
        filter: `id=eq.${quiz.id}`
      }, (payload) => {
        if (payload.new.status === 'playing') {
          onStart()
        }
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [quiz.id])

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4 py-8">

      {/* Icon + Titel */}
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">🦴</div>
        <h1 className="text-2xl font-bold text-white mb-1">{quiz.title}</h1>
        <p className="text-[#7070a0] text-sm">
          {quiz.timer_seconds}s pro Frage · Max. {quiz.max_players} Spieler
        </p>
      </div>

      {/* Kapazität */}
      <div className="w-full max-w-sm bg-[#13131a] border border-[#2a2a3d] rounded-2xl p-4 mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium text-white">Spieler-Kapazität</span>
          <span className="text-[#43e97b] font-bold">1 / {quiz.max_players}</span>
        </div>
        <div className="h-2 bg-[#1c1c28] rounded-full">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-[#43e97b] to-[#6c63ff] transition-all"
            style={{ width: capacity + '%' }}
          />
        </div>
      </div>

      {/* Spieler */}
      <div className="w-full max-w-sm bg-[#13131a] border border-[#2a2a3d] rounded-2xl p-5 mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-[#7070a0] mb-4">
          Im Raum
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6c63ff]/20 flex items-center justify-center text-xl flex-shrink-0">
            😊
          </div>
          <div>
            <p className="font-medium text-white">{player.name}</p>
            <p className="text-xs text-[#6c63ff]">● Du bist das</p>
          </div>
        </div>
      </div>

      {/* Warten Animation */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-1.5">
          {[0,1,2].map(i => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-[#6c63ff] animate-bounce"
              style={{ animationDelay: i * 0.2 + 's' }}
            />
          ))}
        </div>
        <p className="text-[#7070a0] text-sm">Warte auf Moderator...</p>
      </div>
    </div>
  )
}

export default LobbyScreen