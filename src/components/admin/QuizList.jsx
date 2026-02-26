function QuizList({ quizzes, onSelect, onNew }) {
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
              onClick={() => onSelect(q)}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-[#1c1c28] border border-transparent hover:border-[#2a2a3d] transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-[#6c63ff]/20 flex items-center justify-center text-lg">
                🦴
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{q.title}</div>
                <div className="text-xs text-[#7070a0]">Code: {q.code}</div>
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