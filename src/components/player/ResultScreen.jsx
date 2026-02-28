import { useState, useEffect } from 'react'
import { supabase } from '../../supabase'

function QuestionScreen({ questions, timerSeconds, quizId, onFinish }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [timeLeft, setTimeLeft] = useState(timerSeconds)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)

  const question = questions[currentQ]
  const options = ['a','b','c','d']

  useEffect(() => {
    const channel = supabase
      .channel('quiz-question-' + quizId)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'quizzes',
        filter: `id=eq.${quizId}`
      }, (payload) => {
        if (payload.new.status === 'finished') {
          onFinish(score)
        } else if (payload.new.current_question !== currentQ) {
          setCurrentQ(payload.new.current_question)
          setSelected(null)
          setTimeLeft(timerSeconds)
        }
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [quizId, currentQ, score])

  useEffect(() => {
    setTimeLeft(timerSeconds)
    setSelected(null)
  }, [currentQ])

  useEffect(() => {
    if (selected !== null) return
    if (timeLeft <= 0) return
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, selected])

  function handleSelect(opt) {
    if (selected !== null) return
    setSelected(opt)
    const isCorrect = opt === question.correct_answer.toLowerCase()
    if (isCorrect) {
      const pts = Math.max(50, 50 + timeLeft * 50)
      setScore(s => s + pts)
    }
  }

  if (!question) return null

  const pct = (timeLeft / timerSeconds) * 100
  const timerColor = timeLeft <= 3 ? '#ff6584' : timeLeft <= 5 ? '#ffd700' : '#6c63ff'

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Top Bar */}
      <div className="px-4 pt-4 pb-2">
        {/* Progress Bar */}
        <div className="h-1.5 bg-[#1c1c28] rounded-full mb-2">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-[#6c63ff] to-[#ff6584] transition-all duration-500"
            style={{ width: ((currentQ + 1) / questions.length * 100) + '%' }}
          />
        </div>
        <div className="flex justify-between text-xs text-[#7070a0]">
          <span>Frage {currentQ + 1} / {questions.length}</span>
          <span className="font-bold" style={{ color: '#6c63ff' }}>{score} Pkt</span>
        </div>
      </div>

      {/* Timer */}
      <div className="flex justify-center py-4">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="26" fill="none" stroke="#1c1c28" strokeWidth="5"/>
            <circle
              cx="32" cy="32" r="26" fill="none"
              stroke={timerColor} strokeWidth="5"
              strokeDasharray={`${2 * Math.PI * 26}`}
              strokeDashoffset={`${2 * Math.PI * 26 * (1 - pct / 100)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold" style={{ color: timerColor }}>
              {timeLeft}
            </span>
          </div>
        </div>
      </div>

      {/* Frage */}
      <div className="px-4 mb-4">
        <div className="bg-[#13131a] border border-[#2a2a3d] rounded-2xl p-5">
          <h2 className="text-base font-bold text-center leading-snug text-white">
            {question.question_text}
          </h2>
        </div>
      </div>

      {/* Antworten */}
      <div className="px-4 grid grid-cols-2 gap-3 flex-1">
        {options.map(opt => {
          const value = question[`option_${opt}`]
          if (!value) return null
          const isCorrect = opt === question.correct_answer.toLowerCase()
          let style = 'bg-[#13131a] border-[#2a2a3d] text-white active:scale-95'
          if (selected !== null) {
            if (opt === selected && isCorrect) style = 'bg-[#43e97b]/15 border-[#43e97b] text-[#43e97b]'
            else if (opt === selected && !isCorrect) style = 'bg-[#ff6584]/10 border-[#ff6584] text-[#ff6584]'
            else if (isCorrect) style = 'bg-[#43e97b]/15 border-[#43e97b] text-[#43e97b]'
            else style = 'bg-[#13131a] border-[#2a2a3d] text-[#7070a0] opacity-40'
          }
          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              disabled={selected !== null}
              className={`border-2 rounded-2xl p-4 text-left transition-all touch-manipulation ${style}`}
            >
              <div className="text-xs font-bold opacity-60 mb-1">{opt.toUpperCase()}</div>
              <div className="text-sm font-medium leading-tight">{value}</div>
            </button>
          )
        })}
      </div>

      {/* Warten */}
      {selected && (
        <div className="text-center py-6">
          <p className="text-[#7070a0] text-sm animate-pulse">
            Warte auf nächste Frage...
          </p>
        </div>
      )}
    </div>
  )
}

export default QuestionScreen