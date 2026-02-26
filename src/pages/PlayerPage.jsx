import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import JoinScreen from '../components/player/JoinScreen'
import LobbyScreen from '../components/player/LobbyScreen'
import QuestionScreen from '../components/player/QuestionScreen'
import ResultScreen from '../components/player/ResultScreen'

function PlayerPage() {
  const navigate = useNavigate()
  const [screen, setScreen] = useState('join')
  const [quiz, setQuiz] = useState(null)
  const [player, setPlayer] = useState(null)
  const [questions, setQuestions] = useState([])
  const [finalScore, setFinalScore] = useState(0)

  async function handleJoin({ quiz, player }) {
    setQuiz(quiz)
    setPlayer(player)
    setScreen('lobby')
  }

  async function handleStart() {
    // Fragen laden
    const { data } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', quiz.id)
      .order('order_index')

    if (!data || data.length === 0) {
      alert('Dieses Quiz hat noch keine Fragen!')
      return
    }

    setQuestions(data)
    setScreen('question')
  }

  async function handleFinish(score) {
    setFinalScore(score)
    // Score in Datenbank speichern
    await supabase
      .from('players')
      .update({ score })
      .eq('id', player.id)
    setScreen('result')
  }

  function handleReplay() {
    setScreen('join')
    setQuiz(null)
    setPlayer(null)
    setQuestions([])
    setFinalScore(0)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0f]/85 backdrop-blur border-b border-[#2a2a3d] px-8 py-4 flex items-center justify-between">
        <img
          src="https://www.iwk.eu/images/IWK/page/logo_iwk.svg"
          alt="IWK"
          className="h-9 brightness-0 invert"
        />
        <button
          onClick={() => navigate('/')}
          className="text-[#7070a0] hover:text-white text-sm transition-all"
        >
          ← Zurück
        </button>
      </nav>

      {/* Screens */}
      {screen === 'join' && (
        <JoinScreen onJoin={handleJoin} />
      )}
      {screen === 'lobby' && (
        <LobbyScreen
          quiz={quiz}
          player={player}
          onStart={handleStart}
        />
      )}
      {screen === 'question' && (
        <QuestionScreen
          questions={questions}
          timerSeconds={quiz.timer_seconds}
          onFinish={handleFinish}
        />
      )}
      {screen === 'result' && (
        <ResultScreen
          score={finalScore}
          playerName={player.name}
          onReplay={handleReplay}
        />
      )}
    </div>
  )
}

export default PlayerPage