import { useNavigate } from 'react-router-dom'
import { SwipeCard } from '../components/SwipeCard'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { useAppState } from '../state/appState'

export default function SwipePage() {
  const { matches, setSelectedSymbol } = useAppState()
  const navigate = useNavigate()

  if (!matches || matches.length === 0) {
    return <div className="text-sm text-neutral-400">Take the quiz first to see compatible pools.</div>
  }

  return (
    <div className="relative mx-auto h-[calc(100vh-220px)] max-w-3xl">
      {[...matches].reverse().map((m, idx) => (
        <div key={m.symbol} style={{ zIndex: idx + 1 }} className="absolute inset-0">
          <SwipeCard
            onSwipe={(dir) => {
              if (dir === 'right') {
                setSelectedSymbol(m.symbol)
                navigate('/swap')
              }
              // left swipe: reject/no-op for now
            }}
          >
            <div className="flex h-full flex-col">
              <div className="mb-6">
                <div className="mb-1 text-2xl font-semibold">{m.symbol} · {m.scorePct}% match</div>
                <div className="text-sm text-neutral-300">Liquidity: {m.liquidity} · Fee: {(m.feeBps / 100).toFixed(2)}%</div>
              </div>
              <Card className="flex-1">
                <CardHeader>
                  <div className="text-neutral-300">About</div>
                </CardHeader>
                <CardContent>{m.bio}</CardContent>
              </Card>
            </div>
          </SwipeCard>
        </div>
      ))}
    </div>
  )
}


