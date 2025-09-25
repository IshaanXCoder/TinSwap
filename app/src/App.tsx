import './App.css'
import { useState } from 'react'
import { useWalletContext } from './context/WalletContext'
import { Link, Outlet } from 'react-router-dom'
import { Quiz } from './features/compatibility/Quiz'
import { scoreTokens, userVectorFromAnswers, type QuizAnswer } from './features/compatibility/data'
import { SwipeCard } from './components/SwipeCard'
import { fetchZeroExQuote, type ZeroExQuote } from './services/zeroEx'

function Section({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <section className="max-w-5xl mx-auto mb-8 rounded-xl border border-white/10 bg-white/5 p-6">
      <h2 className="mb-3 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  )
}

function Nav() {
  return (
    <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-lg font-semibold">Compatibility Swipe</Link>
        <div className="hidden gap-3 text-sm text-neutral-300 md:flex">
          <Link to="/" className="hover:text-white">Home</Link>
          <Link to="/pools" className="hover:text-white">Pools</Link>
        </div>
      </div>
    </nav>
  )
}

function App() {
  const { isConnected, address, isConnecting, connect, disconnect, signer, switchNetwork } = useWalletContext()
  const [matches, setMatches] = useState<{ symbol: string; scorePct: number; bio: string; liquidity: string; feeBps: number }[] | null>(null)

  function handleQuizDone(a: QuizAnswer) {
    const vec = userVectorFromAnswers(a)
    const ranked = scoreTokens(vec).map(({ token, score }) => ({
      symbol: token.symbol,
      scorePct: Math.round(score * 100),
      bio: token.bio,
      liquidity: token.liquidity,
      feeBps: token.feeBps,
    }))
    setMatches(ranked)
  }
  const [sellAmount, setSellAmount] = useState<string>('')
  const [quoteText, setQuoteText] = useState<string>('')
  const [lastQuote, setLastQuote] = useState<ZeroExQuote | null>(null)
  const [txStatus, setTxStatus] = useState<string>('')

  async function handleGetQuote() {
    if (!isConnected || !address) return
    try {
      setQuoteText('Fetching quote…')
      // default demo: sell ETH for USDC on mainnet, sellAmount in wei
      const amountWei = BigInt(Math.floor(Number(sellAmount || '0') * 1e18)).toString()
      const quote = await fetchZeroExQuote({ sellToken: 'ETH', buyToken: 'USDC', sellAmount: amountWei, takerAddress: address, chainId: 1 })
      setLastQuote(quote)
      setQuoteText(`Price ~ ${quote.price}, buyAmount ${quote.buyAmount}`)
    } catch (e) {
      setQuoteText(e instanceof Error ? e.message : 'Failed to fetch quote')
    }
  }

  async function handleSwap() {
    if (!isConnected || !address || !lastQuote) return
    try {
      setTxStatus('Sending transaction…')
      if (!signer) throw new Error('No signer available')
      const tx = await signer.sendTransaction({
        to: lastQuote.to,
        data: lastQuote.data as `0x${string}`,
        value: BigInt(lastQuote.value || '0'),
      })
      setTxStatus(`Submitted: ${tx.hash}`)
      const receipt = await tx.wait()
      if (receipt) {
        setTxStatus(`Confirmed in block ${receipt.blockNumber}. Tx: ${tx.hash}`)
      } else {
        setTxStatus(`Submitted: ${tx.hash}`)
      }
    } catch (e) {
      setTxStatus(e instanceof Error ? e.message : 'Swap failed')
    }
  }

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-neutral-950/70 backdrop-blur">
        <Nav />
        <div className="mx-auto flex max-w-5xl items-center justify-end p-4 pt-0">
          {isConnected ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-300">{address?.slice(0, 6)}…{address?.slice(-4)}</span>
              <button onClick={disconnect} className="rounded-lg bg-neutral-800 px-3 py-2 text-xs font-medium hover:bg-neutral-700">Disconnect</button>
            </div>
          ) : (
            <button disabled={isConnecting} onClick={connect} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-60">
              {isConnecting ? 'Connecting…' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl p-4">
        <Outlet />
      </main>
    </div>
  )
}

export default App
