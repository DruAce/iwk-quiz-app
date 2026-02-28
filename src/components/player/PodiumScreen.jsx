import { useState, useEffect } from 'react'
import { supabase } from '../../supabase'

function PodiumScreen({ quiz, player, onReplay }) {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadResults()
  }, [])

  async function loadResults() {
    const { data } = await supabase
      .from('players')
      .select('*')
      .eq('quiz_id', quiz.id)
      .order('score', { ascending: false })
    if (data) setPlayers(data)
    setLoading(false)
  }

  const medals = ['🥇', '🥈', '🥉']
  const rankColors = {
    0: { bg: 'bg-[#ffd700]/10', border: 'border-[#ffd700]/30', text: 'text-[#ffd700]' },
    1: { bg: 'bg-[#c0c0c0]/10', border: 'border-[#c0c0c0]/30', text: 'text-[#c0c0c0]' },
    2: { bg: 'bg-[#cd7f32]/10', border: 'border-[#cd7f32]/30', text: 'text-[#cd7f32]' },
  }

  const myRank = players.findIndex(p => p.id === player.id) + 1
  const myEmoji = myRank === 1 ? '🏆' : myRank === 2 ? '🥈' : myRank === 3 ? '🥉' : '🎯'

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🏆</div>
          <p className="text-[#7070a0]">Lade Ergebnisse...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🎉</div>
          <h1 className="text-3xl font-bold mb-1">Quiz beendet!</h1>
          <p className="text-[#7070a0]">{quiz.title}</p>
        </div>

        {/* Dein Ergebnis */}
        <div className="bg-gradient-to-br from-[#6c63ff]/20 to-[#ff6584]/10 border border-[#6c63ff]/30 rounded-2xl p-5 mb-6 text-center">
          <div className="text-4xl mb-2">{myEmoji}</div>
          <p className="text-[#7070a0] text-sm mb-1">Dein Ergebnis</p>
          <p className="text-4xl font-bold text-[#6c63ff] mb-1">
            {players.find(p => p.id === player.id)?.score || 0} Pkt
          </p>
          <p className="text-sm text-[#7070a0]">
            Platz <span className="text-white font-bold">{myRank}</span> von {players.length}
          </p>
        </div>

        {/* Podium Top 3 */}
        {players.length >= 2 && (
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-[#7070a0] mb-4 text-center">
              🏅 Podium
            </p>
            <div className="flex items-end justify-center gap-3 mb-4">
              {/* Platz 2 */}
              {players[1] && (
                <div className="flex flex-col items-center flex-1">
                  <div className="text-2xl mb-1">🥈</div>
                  <div className="bg-[#c0c0c0]/10 border border-[#c0c0c0]/30 rounded-xl p-3 w-full text-center">
                    <p className="font-bold text-sm truncate">{players[1].name}</p>
                    <p className="text-[#c0c0c0] font-bold text-sm">{players[1].score} Pkt</p>
                  </div>
                  <div className="h-12 w-full bg-[#c0c0c0]/20 rounded-b-xl mt-1"></div>
                </div>
              )}
              {/* Platz 1 */}
              {players[0] && (
                <div className="flex flex-col items-center flex-1">
                  <div className="text-3xl mb-1">🥇</div>
                  <div className="bg-[#ffd700]/10 border border-[#ffd700]/30 rounded-xl p-3 w-full text-center">
                    <p className="font-bold text-sm truncate">{players[0].name}</p>
                    <p className="text-[#ffd700] font-bold text-sm">{players[0].score} Pkt</p>
                  </div>
                  <div className="h-20 w-full bg-[#ffd700]/20 rounded-b-xl mt-1"></div>
                </div>
              )}
              {/* Platz 3 */}
              {players[2] && (
                <div className="flex flex-col items-center flex-1">
                  <div className="text-2xl mb-1">🥉</div>
                  <div className="bg-[#cd7f32]/10 border border-[#cd7f32]/30 rounded-xl p-3 w-full text-center">
                    <p className="font-bold text-sm truncate">{players[2].name}</p>
                    <p className="text-[#cd7f32] font-bold text-sm">{players[2].score} Pkt</p>
                  </div>
                  <div className="h-8 w-full bg-[#cd7f32]/20 rounded-b-xl mt-1"></div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Komplette Rangliste */}
        <div className="bg-[#13131a] border border-[#2a2a3d] rounded-2xl overflow-hidden mb-6">
          <div className="bg-[#1c1c28] px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#7070a0]">
            Alle Ergebnisse
          </div>
          {players.map((p, i) => (
            <div
              key={p.id}
              className={`flex items-center gap-3 px-5 py-4 border-b border-[#2a2a3d] last:border-0 transition-all ${
                p.id === player.id ? 'bg-[#6c63ff]/10' : ''
              }`}
            >
              <div className="w-8 text-center flex-shrink-0">
                {i < 3 ? (
                  <span className="text-xl">{medals[i]}</span>
                ) : (
                  <span className="text-[#7070a0] font-bold text-sm">{i + 1}</span>
                )}
              </div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${
                rankColors[i] ? rankColors[i].bg : 'bg-[#1c1c28]'
              }`}>
                {p.id === player.id ? '😊' : '👤'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {p.name}
                  {p.id === player.id && (
                    <span className="text-xs text-[#6c63ff] ml-2">● Du</span>
                  )}
                </p>
              </div>
              <span className={`font-bold text-sm flex-shrink-0 ${
                i === 0 ? 'text-[#ffd700]' :
                i === 1 ? 'text-[#c0c0c0]' :
                i === 2 ? 'text-[#cd7f32]' :
                'text-[#6c63ff]'
              }`}>
                {p.score} Pkt
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="px-4 pb-8 pt-4 flex gap-3 bg-[#0a0a0f] border-t border-[#2a2a3d]">
        <button
          onClick={onReplay}
          className="flex-1 bg-[#6c63ff] hover:bg-[#7c74ff] active:scale-95 text-white font-bold py-4 rounded-xl transition-all touch-manipulation"
        >
          Nochmal spielen 🔄
        </button>
      </div>
    </div>
  )
}

export default PodiumScreen