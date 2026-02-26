import { useState, useEffect } from 'react'
import { supabase } from '../../supabase'

function QuestionEditor({ quiz }) {
  const [questions, setQuestions] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    question_text: '', option_a: '', option_b: '',
    option_c: '', option_d: '', correct_answer: 'A'
  })

  useEffect(() => {
    loadQuestions()
  }, [quiz.id])

  async function loadQuestions() {
    setLoading(true)
    const { data } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', quiz.id)
      .order('order_index')
    if (data) setQuestions(data)
    setLoading(false)
  }

  async function addQuestion() {
    if (!form.question_text.trim()) return
    const { data, error } = await supabase
      .from('questions')
      .insert([{ ...form, quiz_id: quiz.id, order_index: questions.length + 1 }])
      .select()
    if (!error) {
      setQuestions([...questions, data[0]])
      setForm({ question_text: '', option_a: '', option_b: '',
        option_c: '', option_d: '', correct_answer: 'A' })
      setShowForm(false)
    }
  }

  async function deleteQuestion(id) {
    await supabase.from('questions').delete().eq('id', id)
    setQuestions(questions.filter(q => q.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold">{quiz.title}</h2>
          <p className="text-[#7070a0] mt-1">
            Code: <span className="text-[#6c63ff] font-bold">{quiz.code}</span>
            {' · '}{questions.length} Fragen
            {' · '}{quiz.timer_seconds}s pro Frage
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#6c63ff] hover:bg-[#7c74ff] text-white font-bold py-2 px-6 rounded-xl transition-all"
        >
          + Frage hinzufügen
        </button>
      </div>

      {/* Neues Fragen Formular */}
      {showForm && (
        <div className="bg-[#1c1c28] border-2 border-dashed border-[#6c63ff]/40 rounded-xl p-6 mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#6c63ff] mb-4">
            Neue Frage
          </p>
          <input
            placeholder="Frage eingeben..."
            value={form.question_text}
            onChange={e => setForm({ ...form, question_text: e.target.value })}
            className="w-full bg-[#0a0a0f] border border-[#2a2a3d] focus:border-[#6c63ff] outline-none rounded-xl py-3 px-4 text-white mb-4 transition-all"
          />
          <div className="grid grid-cols-2 gap-3 mb-4">
            {['a','b','c','d'].map(opt => (
              <input
                key={opt}
                placeholder={`Antwort ${opt.toUpperCase()}`}
                value={form[`option_${opt}`]}
                onChange={e => setForm({ ...form, [`option_${opt}`]: e.target.value })}
                className="bg-[#0a0a0f] border border-[#2a2a3d] focus:border-[#6c63ff] outline-none rounded-xl py-3 px-4 text-white transition-all"
              />
            ))}
          </div>
          <div className="mb-4">
            <p className="text-xs text-[#7070a0] mb-2">Richtige Antwort:</p>
            <div className="flex gap-2">
              {['A','B','C','D'].map(opt => (
                <button
                  key={opt}
                  onClick={() => setForm({ ...form, correct_answer: opt })}
                  className={`px-5 py-2 rounded-xl font-bold transition-all ${
                    form.correct_answer === opt
                      ? 'bg-[#43e97b]/20 border border-[#43e97b] text-[#43e97b]'
                      : 'bg-[#0a0a0f] border border-[#2a2a3d] text-[#7070a0]'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={addQuestion}
              className="bg-[#6c63ff] hover:bg-[#7c74ff] text-white font-bold py-2 px-6 rounded-xl transition-all"
            >
              Speichern
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

      {/* Fragen Liste */}
      {loading ? (
        <p className="text-[#7070a0] text-center py-10">Lade Fragen...</p>
      ) : questions.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">📝</div>
          <p className="text-[#7070a0]">Noch keine Fragen – füge die erste hinzu!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q, i) => (
            <div key={q.id} className="bg-[#1c1c28] border border-[#2a2a3d] hover:border-[#6c63ff] rounded-xl p-5 transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-7 h-7 rounded-lg bg-[#6c63ff] flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 font-medium">{q.question_text}</div>
                <button
                  onClick={() => deleteQuestion(q.id)}
                  className="text-[#7070a0] hover:text-[#ff6584] transition-all text-lg"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['a','b','c','d'].map(opt => (
                  <div
                    key={opt}
                    className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
                      q.correct_answer === opt.toUpperCase()
                        ? 'border border-[#43e97b] bg-[#43e97b]/10 text-[#43e97b]'
                        : 'border border-[#2a2a3d] text-[#7070a0]'
                    }`}
                  >
                    <span className="font-bold">{opt.toUpperCase()}</span>
                    {q[`option_${opt}`]}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default QuestionEditor