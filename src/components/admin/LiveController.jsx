import { useState, useEffect } from 'react'
import { supabase } from '../../supabase'

function LiveController({ quiz, questions }) {
  const [status, setStatus] = useState(quiz.status || 'waiting')
  const [currentQ, setCurrentQ] = useState(quiz.current_question || 0)
  const [players, setPlayers] = useState([])

  // Spieler in Echtzeit laden
  useEffect(() => {
    loadPlayers()

    const channel = supabase
      .channel('players-' + quiz.id)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'players',
        filter: `quiz_id=eq.${quiz.id}`
      }, () => loadPlayers())
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [quiz.id])

  async function loadPlayers() {
    const { data } = await supabase
      .from('players')
      .select('*')
      .eq('quiz_id', quiz.id)
      .order('score', { ascending: false })
    if (data) setPlayers(data)
  }

  async function startQuiz() {
    await supabase
      .from('quizzes')
      .update({ status: 'playing', current_question: 0 })
      .eq('id', quiz.id)
    setStatus('playing')
    setCurrentQ(0)
  }

  async function nextQuestion() {
    const next = currentQ + 1
    if (next >= questions.length) {
      await supabase
        .from('quizzes')
        .update({ status: 'finished' })
        .eq('id', quiz.id)
      setStatus('finished')
    } else {
      await supabase
        .from('quizzes')
        .update({ current_question: next })
        .eq('id', quiz.id)
      setCurrentQ(next)
    }
  }

  async function resetQuiz() {
    await supabase
      .from('quizzes')
      .update({ status: 'waiting', current_question: 0 })
      .eq('id', quiz.id)
    // Spieler löschen
    await supabase.from('players').delete().eq('quiz_id', quiz.id)
    setStatus('waiting')
    setCurrentQ(0)
    setPlayers([])
  }

  const capacityPct = Math.round((players.length / quiz.max_players) * 100)

  return (
    <div className="bg-gradient-to-br from-[#6c63ff]/15 to-[#ff6584]/10 border border-[#6c63ff]/30 rounded-2xl p-6 mt-6">

      {/* Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            status === 'playing' ? 'bg-[#43e97b]' :
            status === 'finished' ? 'bg-[#ff6584]' : 'bg-[#ffd700]'
          }`}></div>
          <span className="text-sm font-bold">
            {status === 'playing' ? `Frage ${currentQ + 1} von ${questions.length}` :
             status === 'finished' ? 'Quiz beendet' : 'Wartet auf Spieler'}
          </span>
        </div>
        <span className="text-xs text-[#7070a0]">
          {players.length} / {quiz.max_players} Spieler
        </span>
      </div>

      {/* Kapazitätsbalken */}
      <div className="h-2 bg-[#1c1c28] rounded-full mb-4">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-[#43e97b] to-[#6c63ff] transition-all"
          style={{ width: capacityPct + '%' }}
        />
      </div>

      {/* Spieler Liste */}
      {players.length > 0 && (
        <div className="bg-[#13131a] rounded-xl p-4 mb-4">
          <p className="text-xs text-[#7070a0] uppercase tracking-widest mb-3">
            Spieler online
          </p>
          <div className="flex flex-wrap gap-2">
            {players.map(p => (
              <div key={p.id} className="flex items-center gap-2 bg-[#1c1c28] border border-[#2a2a3d] rounded-full px-3 py-1 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-[#43e97b]"></div>
                <span>{p.name}</span>
                {status !== 'waiting' && (
                  <span className="text-[#6c63ff] font-bold">{p.score} Pkt</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Steuerung */}
      <div className="flex gap-3">
        {status === 'waiting' && (
          <button
            onClick={startQuiz}
            disabled={questions.length === 0}
            className="flex-1 bg-[#43e97b]/20 hover:bg-[#43e97b]/30 border border-[#43e97b] text-[#43e97b] font-bold py-3 rounded-xl transition-all disabled:opacity-50"
          >
            ▶ Quiz starten
          </button>
        )}
        {status === 'playing' && (
          <button
            onClick={nextQuestion}
            className="flex-1 bg-[#6c63ff] hover:bg-[#7c74ff] text-white font-bold py-3 rounded-xl transition-all"
          >
            {currentQ + 1 >= questions.length ? '🏁 Quiz beenden' : '⏭ Nächste Frage'}
          </button>
        )}
        {status === 'finished' && (
          <button
            onClick={resetQuiz}
            className="flex-1 bg-[#1c1c28] border border-[#2a2a3d] hover:border-[#6c63ff] text-white font-bold py-3 rounded-xl transition-all"
          >
            🔄 Neu starten
          </button>
        )}
        <button
          onClick={resetQuiz}
          className="bg-[#ff6584]/10 border border-[#ff6584]/30 text-[#ff6584] font-bold py-3 px-4 rounded-xl transition-all hover:bg-[#ff6584]/20"
        >
          ✕ Reset
        </button>
      </div>
    </div>
  )
}

export default LiveController