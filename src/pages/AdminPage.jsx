import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import QuizList from '../components/admin/QuizList'
import QuestionEditor from '../components/admin/QuestionEditor'
import QRPanel from '../components/admin/QRPanel'
import LiveController from '../components/admin/LiveController'
import LiveLeaderboard from '../components/admin/LiveLeaderboard'
import AdminLogin from '../components/admin/AdminLogin'

function AdminPage() {
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState([])
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [newTitle, setNewTitle] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(
    sessionStorage.getItem('iwk-admin') === 'true'
  )

  useEffect(() => {
    loadQuizzes()
  }, [])

  useEffect(() => {
    if (selectedQuiz) loadQuestions()
  }, [selectedQuiz])

  async function loadQuizzes() {
    setLoading(true)
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setQuizzes(data)
    setLoading(false)
  }

  async function loadQuestions() {
    const { data } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', selectedQuiz.id)
      .order('order_index')
    if (data) setQuestions(data)
  }

  async function createQuiz() {
    if (!newTitle.trim()) return
    const code = Math.floor(1000 + Math.random() * 9000).toString()
    const { data, error } = await supabase
      .from('quizzes')
      .insert([{ title: newTitle, code, max_players: 20, timer_seconds: 10 }])
      .select()
    if (!error) {
      setQuizzes([data[0], ...quizzes])
      setSelectedQuiz(data[0])
      setNewTitle('')
      setShowForm(false)
    }
  }

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />
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
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              sessionStorage.removeItem('iwk-admin')
              setIsLoggedIn(false)
            }}
            className="text-[#7070a0] hover:text-[#ff6584] text-sm transition-all"
          >
            🔒 Ausloggen
          </button>
          <button
            onClick={() => navigate('/')}
            className="text-[#7070a0] hover:text-white text-sm transition-all"
          >
            ← Zurück
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10 grid grid-cols-[300px_1fr] gap-6">

        {/* Links: Quiz Liste */}
        <div>
          {loading ? (
            <div className="text-[#7070a0] text-sm text-center py-10">
              Lade Quizze...
            </div>
          ) : (
            <QuizList
              quizzes={quizzes}
              onSelect={setSelectedQuiz}
              onNew={() => setShowForm(true)}
              onUpdate={(updatedQuiz, deletedId) => {
                if (deletedId) {
                  setQuizzes(quizzes.filter(q => q.id !== deletedId))
                  if (selectedQuiz?.id === deletedId) setSelectedQuiz(null)
                } else {
                  setQuizzes(quizzes.map(q => q.id === updatedQuiz.id ? updatedQuiz : q))
                  if (selectedQuiz?.id === updatedQuiz.id) setSelectedQuiz(updatedQuiz)
                }
              }}
            />
          )}
        </div>

        {/* Rechts: Editor */}
        <div className="bg-[#13131a] border border-[#2a2a3d] rounded-2xl p-8">

          {/* Neues Quiz Formular */}
          {showForm && (
            <div className="mb-8 bg-[#1c1c28] border border-[#6c63ff]/30 rounded-xl p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-[#6c63ff] mb-4">
                Neues Quiz
              </p>
              <input
                type="text"
                placeholder="Quiz-Titel z.B. Anatomie Grundlagen"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createQuiz()}
                className="w-full bg-[#0a0a0f] border border-[#2a2a3d] focus:border-[#6c63ff] outline-none rounded-xl py-3 px-4 text-white mb-4 transition-all"
              />
              <div className="flex gap-3">
                <button
                  onClick={createQuiz}
                  className="bg-[#6c63ff] hover:bg-[#7c74ff] text-white font-bold py-2 px-6 rounded-xl transition-all"
                >
                  Erstellen
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="bg-[#0a0a0f] border border-[#2a2a3d] text-white font-bold py-2 px-6 rounded-xl transition-all"
                >
                  Abbrechen
                </button>
              </div>
            </div>
          )}

          {/* Editor + Live Controls */}
          {selectedQuiz ? (
            <div>
              <QuestionEditor
                quiz={selectedQuiz}
                onQuestionsChange={loadQuestions}
              />
              <QRPanel quiz={selectedQuiz} />
              <LiveController
                quiz={selectedQuiz}
                questions={questions}
              />
              <LiveLeaderboard quiz={selectedQuiz} />
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🦴</div>
              <h2 className="text-2xl font-bold mb-2">Kein Quiz ausgewählt</h2>
              <p className="text-[#7070a0]">
                Wähle ein Quiz aus der Liste oder erstelle ein neues
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPage