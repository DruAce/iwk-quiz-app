import { QRCodeSVG } from 'qrcode.react'

function QRPanel({ quiz }) {
  const joinUrl = `${window.location.origin}/player?code=${quiz.code}`

  return (
    <div className="bg-gradient-to-br from-[#6c63ff]/15 to-[#ff6584]/10 border border-[#6c63ff]/30 rounded-2xl p-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-[#43e97b] animate-pulse"></div>
        <span className="text-sm font-bold text-[#43e97b]">Quiz bereit</span>
      </div>

      {/* QR + Code nebeneinander */}
      <div className="flex items-center gap-6 bg-[#13131a] rounded-xl p-4 mb-4">
        {/* QR Code */}
        <div className="bg-white p-3 rounded-xl flex-shrink-0">
          <QRCodeSVG
            value={joinUrl}
            size={100}
            bgColor="#ffffff"
            fgColor="#1a1a2e"
            level="M"
          />
        </div>
        {/* Code */}
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

      {/* Spieler Kapazität */}
      <div>
        <div className="flex justify-between text-xs text-[#7070a0] mb-1">
          <span>Spieler-Kapazität</span>
          <span className="text-[#43e97b]">0 / {quiz.max_players} max.</span>
        </div>
        <div className="h-2 bg-[#1c1c28] rounded-full">
          <div className="h-2 rounded-full bg-gradient-to-r from-[#43e97b] to-[#6c63ff]"
            style={{ width: '0%' }} />
        </div>
      </div>
    </div>
  )
}

export default QRPanel