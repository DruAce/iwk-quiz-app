function LobbyScreen({ quiz, player, onStart }) {
  const capacity = Math.round((1 / quiz.max_players) * 100)

  return (
    <div className="max-w-md mx-auto px-6 py-12 text-center">
      <div className="text-5xl mb-4">🦴</div>
      <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
      <p className="text-[#7070a0] mb-6">
        {quiz.timer_seconds} Sekunden pro Frage · Max. {quiz.max_players} Spieler
      </p>

      {/* Kapazität */}
      <div className="bg-[#13131a] border border-[#2a2a3d] rounded-xl p-4 mb-6 text-left">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">Spieler-Kapazität</span>
          <span className="text-[#43e97b]">1 / {quiz.max_players}</span>
        </div>
        <div className="h-2 bg-[#1c1c28] rounded-full">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-[#43e97b] to-[#6c63ff] transition-all"
            style={{ width: capacity + '%' }}
          />
        </div>
      </div>

      {/* Spieler */}
      <div className="bg-[#13131a] border border-[#2a2a3d] rounded-xl p-6 mb-6 text-left">
        <p className="text-xs font-bold uppercase tracking-widest text-[#7070a0] mb-4">
          Im Raum
        </p>
        <div className="flex items-center gap-3 py-2">
          <div className="w-9 h-9 rounded-xl bg-[#6c63ff]/20 flex items-center justify-center text-lg">
            😊
          </div>
          <div>
            <p className="font-medium">{player.name}</p>
            <p className="text-xs text-[#6c63ff]">● Du bist das</p>
          </div>
        </div>
      </div>

      {/* Warten */}
      <div className="flex items-center justify-center gap-2 text-[#7070a0] text-sm mb-8">
        Warte auf Moderator
        <span className="flex gap-1">
          {[0,1,2].map(i => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#7070a0] animate-bounce"
              style={{ animationDelay: i * 0.2 + 's' }}
            />
          ))}
        </span>
      </div>

      {/* Demo Button */}
      <button
        onClick={onStart}
        className="w-full bg-[#6c63ff] hover:bg-[#7c74ff] text-white font-bold py-4 rounded-xl transition-all"
      >
        Demo: Quiz starten →
      </button>
    </div>
  )
}

export default LobbyScreen