import { useEffect, useMemo, useState } from 'react'
import { useAppState } from '../state/appState'
import { useWallet } from '../hooks/useWallet'
import { Contract, parseEther } from 'ethers'
import { MONAD_ADDRESSES, DEFAULT_RPC } from '../lib/monad'
import { UniswapV2FactoryABI, UniswapV2Router02ABI } from '../lib/abi'

export default function SwapPage() {
  const { selectedSymbol } = useAppState()
  const { isConnected, address, signer } = useWallet()
  const [sellAmount, setSellAmount] = useState('')
  const [quote, setQuote] = useState('')
  const [buyToken, setBuyToken] = useState<string>(MONAD_ADDRESSES.USDC)
  const routerAddress = MONAD_ADDRESSES.UniswapV2Router02
  const factoryAddress = MONAD_ADDRESSES.UniswapV2Factory

  async function resolveBestPath(): Promise<string[]> {
    const router = new Contract(routerAddress, UniswapV2Router02ABI, signer ?? undefined)
    const factory = new Contract(factoryAddress, UniswapV2FactoryABI, signer ?? undefined)
    const directPair = await factory.getPair(MONAD_ADDRESSES.WMON, buyToken)
    if (directPair && directPair !== '0x0000000000000000000000000000000000000000') return [MONAD_ADDRESSES.WMON, buyToken]
    // try via USDC
    const viaA = await factory.getPair(MONAD_ADDRESSES.WMON, MONAD_ADDRESSES.USDC)
    const viaB = await factory.getPair(MONAD_ADDRESSES.USDC, buyToken)
    if (viaA !== '0x0000000000000000000000000000000000000000' && viaB !== '0x0000000000000000000000000000000000000000') {
      return [MONAD_ADDRESSES.WMON, MONAD_ADDRESSES.USDC, buyToken]
    }
    return [MONAD_ADDRESSES.WMON, buyToken]
  }

  async function handleGetQuote() {
    // Monad-native quote via router getAmountsOut
    const amountIn = parseEther(sellAmount || '0')
    if (amountIn === 0n) { setQuote(''); return }
    const router = new Contract(routerAddress, UniswapV2Router02ABI, signer ?? undefined)
    const path = await resolveBestPath()
    const amounts: bigint[] = await router.getAmountsOut(amountIn, path)
    const out = amounts[amounts.length - 1]
    setQuote(`Estimated output: ${out.toString()} wei`)
  }

  return (
    <div>
      <h2 className="mb-2 text-xl font-semibold">Swap</h2>
      {selectedSymbol && <div className="mb-3 text-xs text-neutral-300">Selected from swipe: {selectedSymbol}</div>}
      <div className="flex flex-wrap items-center gap-3">
        <input value={sellAmount} onChange={(e) => setSellAmount(e.target.value)} className="w-40 rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm outline-none" placeholder="Amount (ETH)" />
        <select value={buyToken} onChange={(e) => setBuyToken(e.target.value)} className="rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm">
          <option value={MONAD_ADDRESSES.USDC}>USDC</option>
          <option value={MONAD_ADDRESSES.USDT}>USDT</option>
          <option value={MONAD_ADDRESSES.WETH}>WETH</option>
          <option value={MONAD_ADDRESSES.WBTC}>WBTC</option>
        </select>
        <button onClick={handleGetQuote} disabled={!isConnected} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500 disabled:opacity-50">Get Quote (Monad)</button>
        <button onClick={async () => {
          if (!address || !isConnected) return
          // Monad-native swap via UniswapV2Router02: WMON -> buyToken path
          if (!signer) return
          const router = new Contract(routerAddress, UniswapV2Router02ABI, signer)
          const deadline = Math.floor(Date.now() / 1000) + 60 * 10
          const path = await resolveBestPath()
          const value = parseEther(sellAmount || '0')
          const tx = await router.swapExactETHForTokens(0n, path, address, deadline, { value })
          await tx.wait()
          alert(`Swap confirmed: ${tx.hash}`)
        }} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50" disabled={!isConnected || !sellAmount}>Swap on Monad</button>
      </div>
      {quote && <div className="mt-3 text-xs text-neutral-300">{quote}</div>}
    </div>
  )
}


