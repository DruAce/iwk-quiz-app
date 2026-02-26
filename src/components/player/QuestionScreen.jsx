import { useState, useEffect } from 'react'

function QuestionScreen({ questions, timerSeconds, onFinish }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [timeLeft, setTimeLeft] = useState(timerSeconds)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])

  const question = questions[currentQ]
  const options = ['a','b','c','d']

  useEffect(() => {
    setTimeLeft(timerSeconds)
    setSelected(null)
  }, [currentQ])

  useEffect(() => {
    if (selected !== null) return
    if (timeLeft <= 0) {
      handleNext(null)
      return
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft, selected])

  function handleSelect(opt) {
    if (selected !== null) return
    setSelected(opt)
    const isCorrect = opt === question.correct_answer.toLowerCase()
    const pts = isCorrect ? Math.max(50, 50 + timeLeft * 50) : 0
    if (isCorrect) setScore(s => s + pts)
    setAnswers(a => [...a, { correct: isCorrect, pts }])
    setTimeout(() => handleNext(opt), 1800)
  }

  function handleNext(opt) {
    if (currentQ + 1 >= questions.length) {
      const finalScore = answers.reduce((s, a) => s + a.pts, 0) +
        (opt && opt === question.correct_answer.toLowerCase()
          ? Math.max(50, 50 + timeLeft * 50) : 0)
      onFinish(finalScore)
    } else {
      setCurrentQ(q => q + 1)
    }
  }

  const pct = (timeLeft / timerSeconds) * 100
  const timerColor = timeLeft <= 3 ? '#ff6584' : timeLeft <= 5 ? '#ffd700' : '#6c63ff'

  return (
    <div className="max-w-md mx-auto px-6 py-8">
      {/* Progress */}
      <div className="mb-6">
        <div className="h-1.5 bg-[#1c1c28] rounded-full mb-2">
          <div
            className="h-1.5 rounded-full bg-gradient-to-r from-[#6c63ff] to-[#ff6584] transition-all duration-500"
            style={{ width: ((currentQ + 1) / questions.length * 100) + '%' }}
          />
        </div>
        <div className="flex justify-between text-xs text-[#7070a0]">
          <span>Frage {currentQ + 1} von {questions.length}</span>
          <span>Punkte: {score}</span>
        </div>
      </div>

      {/* Timer */}
      <div className="flex justify-center mb-6">
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="#1c1c28" strokeWidth="6"/>
            <circle
              cx="40" cy="40" r="34" fill="none"
              stroke={timerColor} strokeWidth="6"
              strokeDasharray={`${2 * Math.PI * 34}`}
              strokeDashoffset={`${2 * Math.PI * 34 * (1 - pct / 100)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-2xl font-bold"
              style={{ color: timerColor }}
            >
              {timeLeft}
            </span>
          </div>
        </div>
      </div>

      {/* Frage */}
      <h2 className="text-xl font-bold text-center mb-8 leading-snug">
        {question.question_text}
      </h2>

      {/* Antworten */}
      <div className="grid grid-cols-2 gap-3">
        {options.map(opt => {
          const value = question[`option_${opt}`]
          if (!value) return null
          const isCorrect = opt === question.correct_answer.toLowerCase()
          let style = 'bg-[#13131a] border-[#2a2a3d] text-white hover:border-[#6c63ff] hover:bg-[#6c63ff]/10'
          if (selected !== null) {
            if (opt === selected && isCorrect) style = 'bg-[#43e97b]/15 border-[#43e97b] text-[#43e97b]'
            else if (opt === selected && !isCorrect) style = 'bg-[#ff6584]/10 border-[#ff6584] text-[#ff6584]'
            else if (isCorrect) style = 'bg-[#43e97b]/15 border-[#43e97b] text-[#43e97b]'
            else style = 'bg-[#13131a] border-[#2a2a3d] text-[#7070a0] opacity-50'
          }
          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              disabled={selected !== null}
              className={`border-2 rounded-xl p-4 text-left transition-all ${style}`}
            >
              <div className="text-xs font-bold opacity-60 mb-1">
                {opt.toUpperCase()}
              </div>
              <div className="text-sm font-medium">{value}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default QuestionScreen