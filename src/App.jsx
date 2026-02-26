import { Routes, Route, useNavigate } from 'react-router-dom'
import AdminPage from './pages/AdminPage'
import PlayerPage from './pages/PlayerPage'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center">
        <img 
          src="https://www.iwk.eu/images/IWK/page/logo_iwk.svg" 
          alt="IWK Logo" 
          className="h-16 mx-auto mb-8 brightness-0 invert"
        />
        <h1 className="text-5xl font-bold text-[#6c63ff] mb-2">Quiz App</h1>
        <p className="text-[#7070a0] text-lg mb-10">Wähle deine Rolle</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/admin')}
            className="bg-[#6c63ff] hover:bg-[#7c74ff] text-white font-bold py-4 px-10 rounded-xl transition-all text-lg"
          >
            🎛️ Admin
          </button>
          <button
            onClick={() => navigate('/player')}
            className="bg-[#1c1c28] hover:border-[#6c63ff] border border-[#2a2a3d] text-white font-bold py-4 px-10 rounded-xl transition-all text-lg"
          >
            🎮 Spieler
          </button>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/player" element={<PlayerPage />} />
    </Routes>
  )
}

export default App