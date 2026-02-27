import { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { supabase } from '../../supabase'

function QRPanel({ quiz }) {
  const [playerCount, setPlayerCount] = useState(0)
  const joinUrl = `${window.location.origin}/player?code=${quiz.code}`

  useEffect(() => {
    loadPlayerCount()

    // Echtzeit: Spieler beitreten/verlassen
    const channel = supabase
      .channel('qrpanel-players-' + quiz.id)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'players',
        filter: `quiz_id=eq.${quiz.id}`
      }, () => loadPlayerCount())
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [quiz.id])

  async function loadPlayerCount() {
    const { count } = await supabase
      .from('players')
      .select('*', { count: 'exact' })
      .eq('quiz_id', quiz.id)
    if (count !== null) setPlayerCount(count)
  }

  const capacityPct = Math.round((playerCount / quiz.max_players) * 100)
  const isFull = playerCount >= quiz.max_players

  return (
    <div className="bg-gradient-to-br from-[#6c63ff]/15 to-[#ff6584]/10 border border-[#6c63ff]/30 rounded-2xl p-6 mt-6">

      {/* Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#43e97b] animate-pulse"></div>
          <span className="text-sm font-bold text-[#43e97b]">Quiz bereit</span>
        </div>
        <div className={`text-xs font-bold px-3 py-1 rounded-full ${
          isFull
            ? 'bg-[#ff6584]/20 text-[#ff6584] border border-[#ff6584]/30'
            : 'bg-[#43e97b]/20 text-[#43e97b] border border-[#43e97b]/30'
        }`}>
          {isFull ? '🔴 Voll' : '🟢 Offen'}
        </div>
      </div>

      {/* QR + Code */}
      <div className="flex items-center gap-6 bg-[#13131a] rounded-xl p-4 mb-4">
        <div className="bg-white p-3 rounded-xl flex-shrink-0">
          <QRCodeSVG
            value={joinUrl}
            size={100}
            bgColor="#ffffff"
            fgColor="#1a1a2e"
            level="M"
          />
        </div>
        <div>
          <p className="text-xs text-[#7070a0] uppercase tracking-widest mb-1">
            Beitrittscode
          </p>
          <p className="text-5xl font-bold tracking-widest text-[#6c63ff]">
            {quiz.code}
          </p>
          <p className="text-xs text-[#7070a0] mt-2 break-all">{joinUrl}</p>
        </div>
      </div>

      {/* Kapazität – live */}
      <div>
        <div className="flex justify-between text-xs mb-2">
          <span className="text-[#7070a0]">Spieler-Kapazität</span>
          <span className={`font-bold ${isFull ? 'text-[#ff6584]' : 'text-[#43e97b]'}`}>
            {playerCount} / {quiz.max_players} max.
          </span>
        </div>
        <div className="h-2 bg-[#1c1c28] rounded-full overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              isFull
                ? 'bg-[#ff6584]'
                : 'bg-gradient-to-r from-[#43e97b] to-[#6c63ff]'
            }`}
            style={{ width: capacityPct + '%' }}
          />
        </div>
        {playerCount > 0 && (
          <p className="text-xs text-[#7070a0] mt-2 text-center animate-pulse">
            {playerCount} Spieler {playerCount === 1 ? 'wartet' : 'warten'} auf den Start
          </p>
        )}
      </div>
    </div>
  )
}

export default QRPanel