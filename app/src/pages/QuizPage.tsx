import { Quiz } from '../features/compatibility/Quiz'
import { scoreTokens, userVectorFromAnswers, type QuizAnswer, scoreDiscreteTokens } from '../features/compatibility/data'
import { useAppState } from '../state/appState'
import { useNavigate } from 'react-router-dom'

export default function QuizPage() {
  const { setMatches } = useAppState()
  const navigate = useNavigate()

  function handleQuizDone(a: QuizAnswer) {
    // Use discrete token list provided by user for ordering
    const discrete = scoreDiscreteTokens(a)
    const ranked = discrete.map((d) => ({ symbol: d.symbol, scorePct: d.scorePct, bio: `${d.name}`, liquidity: '—', feeBps: 0 }))
    setMatches(ranked)
    navigate('/swipe')
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-4 text-xl font-semibold">Quiz</h2>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <Quiz onDone={handleQuizDone} />
      </div>
    </div>
  )
}


