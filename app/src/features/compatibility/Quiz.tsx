import { useState } from 'react'
import type { QuizAnswer } from './data'

export function Quiz({ onDone }: { onDone: (answers: QuizAnswer) => void }) {
  const [answers, setAnswers] = useState<QuizAnswer>({ risk: 'medium', horizon: 'medium', vibe: 'balanced' })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-2 text-sm font-medium">Risk appetite</div>
        <div className="flex gap-2">
          {(['low', 'medium', 'high'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setAnswers((a) => ({ ...a, risk: v }))}
              className={`rounded-md px-3 py-2 text-sm ${answers.risk === v ? 'bg-indigo-600' : 'bg-neutral-800 hover:bg-neutral-700'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-sm font-medium">Holding period</div>
        <div className="flex gap-2">
          {(['short', 'medium', 'long'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setAnswers((a) => ({ ...a, horizon: v }))}
              className={`rounded-md px-3 py-2 text-sm ${answers.horizon === v ? 'bg-indigo-600' : 'bg-neutral-800 hover:bg-neutral-700'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-sm font-medium">Vibe</div>
        <div className="flex gap-2">
          {(['serious', 'balanced', 'degen'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setAnswers((a) => ({ ...a, vibe: v }))}
              className={`rounded-md px-3 py-2 text-sm ${answers.vibe === v ? 'bg-indigo-600' : 'bg-neutral-800 hover:bg-neutral-700'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div>
        <button onClick={() => onDone(answers)} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500">
          See Matches
        </button>
      </div>
    </div>
  )
}


