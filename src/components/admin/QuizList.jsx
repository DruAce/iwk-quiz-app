import { useState } from 'react'
import { supabase } from '../../supabase'

function QuizList({ quizzes, onSelect, onNew, onUpdate }) {
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  function startEdit(e, quiz) {
    e.stopPropagation()
    setEditingId(quiz.id)
    setEditTitle(quiz.title)
  }

  async function saveEdit(quiz) {
    if (!editTitle.trim()) return
    await supabase
      .from('quizzes')
      .update({ title: editTitle })
      .eq('id', quiz.id)
    onUpdate({ ...quiz, title: editTitle })
    setEditingId(null)
  }

  async function deleteQuiz(e, quiz) {
    e.stopPropagation()
    if (!confirm(`Quiz "${quiz.title}" wirklich löschen?`)) return
    await supabase.from('questions').delete().eq('quiz_id', quiz.id)
    await supabase.from('players').delete().eq('quiz_id', quiz.id)
    await supabase.from('quizzes').delete().eq('id', quiz.id)
    onUpdate(null, quiz.id)
  }

  return (
    <div className="bg-[#13131a] border border-[#2a2a3d] rounded-2xl p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-[#7070a0] mb-4">
        Meine Quizze
      </p>

      {quizzes.length === 0 ? (
        <p className="text-[#7070a0] text-sm text-center py-6">
          Noch keine Quizze vorhanden
        </p>
      ) : (
        <div className="space-y-2 mb-4">
          {quizzes.map(q => (
            <div
              key={q.id}
              onClick={() => editingId !== q.id && onSelect(q)}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-[#1c1c28] border border-transparent hover:border-[#2a2a3d] transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#6c63ff]/20 flex items-center justify-center text-lg flex-shrink-0">
                🦴
              </div>

              <div className="flex-1 min-w-0">
                {editingId === q.id ? (
                  <input
                    autoFocus
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') saveEdit(q)
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                    onBlur={() => saveEdit(q)}
                    onClick={e => e.stopPropagation()}
                    className="w-full bg-[#0a0a0f] border border-[#6c63ff] rounded-lg px-2 py-1 text-sm text-white outline-none"
                  />
                ) : (
                  <div className="font-medium text-sm truncate">{q.title}</div>
                )}
                <div className="text-xs text-[#7070a0]">Code: {q.code}</div>
              </div>

              {/* Aktionen */}
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={e => startEdit(e, q)}
                  className="w-7 h-7 rounded-lg bg-[#6c63ff]/20 hover:bg-[#6c63ff]/40 flex items-center justify-center text-xs transition-all"
                  title="Umbenennen"
                >
                  ✏️
                </button>
                <button
                  onClick={e => deleteQuiz(e, q)}
                  className="w-7 h-7 rounded-lg bg-[#ff6584]/20 hover:bg-[#ff6584]/40 flex items-center justify-center text-xs transition-all"
                  title="Löschen"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onNew}
        className="w-full bg-[#1c1c28] hover:border-[#6c63ff] border border-[#2a2a3d] text-white font-semibold py-3 rounded-xl transition-all text-sm"
      >
        + Neues Quiz
      </button>
    </div>
  )
}

export default QuizList