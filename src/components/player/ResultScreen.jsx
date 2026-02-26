import { useNavigate } from 'react-router-dom'

function ResultScreen({ score, playerName, onReplay }) {
  const navigate = useNavigate()

  const emoji = score >= 400 ? '🏆' : score >= 200 ? '🎯' : '📚'
  const title = score >= 400 ? 'Ausgezeichnet!' : score >= 200 ? 'Gut gemacht!' : 'Weiter üben!'

  const leaderboard = [
    { rank: 1, name: playerName, pts: score, you: true },
    { rank: 2, name: 'Anna K.', pts: Math.max(0, score - 120) },
    { rank: 3, name: 'Markus L.', pts: Math.max(0, score - 250) },
  ].sort((a, b) => b.pts - a.pts).map((p, i) => ({ ...p, rank: i + 1 }))

  const rankColors = { 1: '#ffd700', 2: '#c0c0c0', 3: '#cd7f32' }

  return (
    <div className="max-w-md mx-auto px-6 py-12 text-center">
      <div className="text-7xl mb-4">{emoji}</div>
      <h1 className="text-4xl font-bold mb-2">{title}</h1>
      <p className="text-[#7070a0] text-lg mb-2">Du hast</p>
      <p className="text-6xl font-bold text-[#6c63ff] mb-8">{score} <span className="text-2xl">Punkte</span></p>

      {/* Rangliste */}
      <div className="bg-[#13131a] border border-[#2a2a3d] rounded-2xl overflow-hidden mb-8">
        <div className="bg-[#1c1c28] px-6 py-3 text-xs font-bold uppercase tracking-widest text-[#7070a0]">
          🏅 Rangliste
        </div>
        {leaderboard.map(p => (
          <div
            key={p.rank}
            className={`flex items-center gap-4 px-6 py-4 border-b border-[#2a2a3d] last:border-0 ${p.you ? 'bg-[#6c63ff]/08' : ''}`}
          >
            <span
              className="text-xl font-bold w-8 text-center"
              style={{ color: rankColors[p.rank] || 'white' }}
            >
              {p.rank}
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#1c1c28] flex items-center justify-center text-sm">
              {p.you ? '😊' : p.rank === 2 ? '🎯' : '🚀'}
            </div>
            <div className="flex-1 text-left">
              <span className="font-medium">{p.name}</span>
              {p.you && <span className="text-xs text-[#6c63ff] ml-2">● Du</span>}
            </div>
            <span className="font-bold text-[#6c63ff]">{p.pts} Pkt</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex-1 bg-[#1c1c28] border border-[#2a2a3d] hover:border-[#6c63ff] text-white font-bold py-4 rounded-xl transition-all"
        >
          ← Startseite
        </button>
        <button
          onClick={onReplay}
          className="flex-1 bg-[#6c63ff] hover:bg-[#7c74ff] text-white font-bold py-4 rounded-xl transition-all"
        >
          Nochmal spielen
        </button>
      </div>
    </div>
  )
}

export default ResultScreen