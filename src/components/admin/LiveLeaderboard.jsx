import { useState, useEffect } from 'react'
import { supabase } from '../../supabase'

function LiveLeaderboard({ quiz }) {
  const [players, setPlayers] = useState([])

  useEffect(() => {
    loadPlayers()

    const channel = supabase
      .channel('leaderboard-' + quiz.id)
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

  const medals = ['🥇', '🥈', '🥉']
  const maxScore = players.length > 0 ? players[0].score : 1

  return (
    <div className="bg-[#13131a] border border-[#2a2a3d] rounded-2xl p-6 mt-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <p className="font-bold text-lg">Live Rangliste</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#43e97b] animate-pulse"></div>
          <span className="text-xs text-[#43e97b] font-bold">Live</span>
        </div>
      </div>

      {/* Leer */}
      {players.length === 0 ? (
        <div className="text-center py-10">
          <div className="text-4xl mb-3">👥</div>
          <p className="text-[#7070a0] text-sm">Noch keine Spieler beigetreten</p>
        </div>
      ) : (
        <div className="space-y-3">
          {players.map((player, i) => {
            const pct = maxScore > 0 ? Math.round((player.score / maxScore) * 100) : 0
            const isTop3 = i < 3
            return (
              <div
                key={player.id}
                className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                  i === 0 ? 'bg-[#ffd700]/10 border border-[#ffd700]/20' :
                  i === 1 ? 'bg-[#c0c0c0]/10 border border-[#c0c0c0]/20' :
                  i === 2 ? 'bg-[#cd7f32]/10 border border-[#cd7f32]/20' :
                  'bg-[#1c1c28] border border-[#2a2a3d]'
                }`}
              >
                {/* Rang */}
                <div className="w-8 text-center flex-shrink-0">
                  {isTop3 ? (
                    <span className="text-xl">{medals[i]}</span>
                  ) : (
                    <span className="text-[#7070a0] font-bold">{i + 1}</span>
                  )}
                </div>

                {/* Name + Balken */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-sm truncate">{player.name}</span>
                    <span className={`font-bold text-sm ml-2 flex-shrink-0 ${
                      i === 0 ? 'text-[#ffd700]' :
                      i === 1 ? 'text-[#c0c0c0]' :
                      i === 2 ? 'text-[#cd7f32]' :
                      'text-[#6c63ff]'
                    }`}>
                      {player.score} Pkt
                    </span>
                  </div>
                  {/* Score Balken */}
                  <div className="h-1.5 bg-[#0a0a0f] rounded-full overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-700 ${
                        i === 0 ? 'bg-[#ffd700]' :
                        i === 1 ? 'bg-[#c0c0c0]' :
                        i === 2 ? 'bg-[#cd7f32]' :
                        'bg-[#6c63ff]'
                      }`}
                      style={{ width: pct + '%' }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default LiveLeaderboard