export type QuizAnswer = {
  risk: 'low' | 'medium' | 'high'
  horizon: 'short' | 'medium' | 'long'
  vibe: 'serious' | 'balanced' | 'degen'
}

export type TokenProfile = {
  symbol: string
  name: string
  bio: string
  liquidity: 'High' | 'Medium' | 'Low'
  feeBps: number
  vector: number[]
}

// Simple trait encoding: [risk, volatility, memeScore, stability, yieldBias]
export const TOKENS: TokenProfile[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    bio: 'The steady date — I like stability and long nights hodling.',
    liquidity: 'High',
    feeBps: 5,
    vector: [0.4, 0.4, 0.2, 0.8, 0.5],
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    bio: 'The sensible one — Perfect for short date nights. No surprises.',
    liquidity: 'High',
    feeBps: 1,
    vector: [0.1, 0.1, 0.0, 1.0, 0.3],
  },
  {
    symbol: 'PEPE',
    name: 'PEPE',
    bio: 'The crazy one — Loud, meme-y and might moon. Bring snacks.',
    liquidity: 'Medium',
    feeBps: 30,
    vector: [0.9, 0.95, 1.0, 0.1, 0.4],
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    bio: 'The practical date — dependable and everywhere.',
    liquidity: 'High',
    feeBps: 1,
    vector: [0.1, 0.1, 0.0, 1.0, 0.3],
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    bio: 'The OG — slow and steady, big energy.',
    liquidity: 'Medium',
    feeBps: 5,
    vector: [0.5, 0.5, 0.1, 0.7, 0.4],
  },
  {
    symbol: 'WSOL',
    name: 'Wrapped SOL',
    bio: 'The sprinter — fast moves and sunny vibes.',
    liquidity: 'Medium',
    feeBps: 5,
    vector: [0.6, 0.6, 0.2, 0.6, 0.5],
  },
]

export function userVectorFromAnswers(a: QuizAnswer): number[] {
  const risk = a.risk === 'low' ? 0.2 : a.risk === 'medium' ? 0.5 : 0.9
  const volatility = risk
  const meme = a.vibe === 'serious' ? 0.1 : a.vibe === 'balanced' ? 0.5 : 0.95
  const stability = 1 - volatility * 0.8
  const yieldBias = a.horizon === 'short' ? 0.3 : a.horizon === 'medium' ? 0.6 : 0.8
  return [risk, volatility, meme, stability, yieldBias]
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0)
  const magA = Math.hypot(...a)
  const magB = Math.hypot(...b)
  return magA && magB ? dot / (magA * magB) : 0
}

export function scoreTokens(userVec: number[]): { token: TokenProfile; score: number }[] {
  return TOKENS.map((t) => ({ token: t, score: cosineSimilarity(userVec, t.vector) }))
    .sort((x, y) => y.score - x.score)
}

// -----------------------------
// Discrete survey weighting model (custom token list from user)
// -----------------------------

type Percent = number // 0-100
export type DiscreteToken = {
  symbol: string
  name: string
  weights: {
    risk: { low: Percent; medium: Percent; high: Percent }
    horizon: { short: Percent; medium: Percent; long: Percent }
    vibe: { serious: Percent; balanced: Percent; degen: Percent }
  }
}

export const DISCRETE_TOKENS: DiscreteToken[] = [
  { symbol: 'DUMP', name: "Anago's Dump", weights: { risk: { low: 5, medium: 20, high: 75 }, horizon: { short: 70, medium: 25, long: 5 }, vibe: { serious: 10, balanced: 15, degen: 75 } } },
  { symbol: 'AXO', name: 'Axolotl', weights: { risk: { low: 20, medium: 50, high: 30 }, horizon: { short: 25, medium: 55, long: 20 }, vibe: { serious: 25, balanced: 55, degen: 20 } } },
  { symbol: 'BEAN', name: 'BEANAKO', weights: { risk: { low: 15, medium: 40, high: 45 }, horizon: { short: 40, medium: 40, long: 20 }, vibe: { serious: 20, balanced: 40, degen: 40 } } },
  { symbol: 'BEANX', name: 'Bean Exchange', weights: { risk: { low: 30, medium: 50, high: 20 }, horizon: { short: 20, medium: 50, long: 30 }, vibe: { serious: 35, balanced: 45, degen: 20 } } },
  { symbol: 'BB', name: 'Blue Balls', weights: { risk: { low: 5, medium: 20, high: 75 }, horizon: { short: 80, medium: 15, long: 5 }, vibe: { serious: 5, balanced: 20, degen: 75 } } },
  { symbol: 'CHOG', name: 'CHOG', weights: { risk: { low: 10, medium: 40, high: 50 }, horizon: { short: 50, medium: 35, long: 15 }, vibe: { serious: 15, balanced: 35, degen: 50 } } },
  { symbol: 'Q', name: 'CLOB my quant', weights: { risk: { low: 40, medium: 45, high: 15 }, horizon: { short: 15, medium: 50, long: 35 }, vibe: { serious: 50, balanced: 40, degen: 10 } } },
  { symbol: 'CHAD', name: 'Clob Chad', weights: { risk: { low: 10, medium: 30, high: 60 }, horizon: { short: 60, medium: 30, long: 10 }, vibe: { serious: 10, balanced: 30, degen: 60 } } },
  { symbol: 'DAK', name: 'DAK', weights: { risk: { low: 20, medium: 50, high: 30 }, horizon: { short: 25, medium: 55, long: 20 }, vibe: { serious: 25, balanced: 55, degen: 20 } } },
  { symbol: 'MELO', name: 'DOG CARAMELO', weights: { risk: { low: 10, medium: 35, high: 55 }, horizon: { short: 55, medium: 35, long: 10 }, vibe: { serious: 15, balanced: 30, degen: 55 } } },
  { symbol: 'FLORIDA', name: 'FLORIDA', weights: { risk: { low: 15, medium: 35, high: 50 }, horizon: { short: 45, medium: 40, long: 15 }, vibe: { serious: 15, balanced: 35, degen: 50 } } },
  { symbol: 'FIABTC', name: 'Fiamma BTC', weights: { risk: { low: 35, medium: 45, high: 20 }, horizon: { short: 20, medium: 45, long: 35 }, vibe: { serious: 40, balanced: 45, degen: 15 } } },
  { symbol: 'JML', name: 'JUMAPEL', weights: { risk: { low: 15, medium: 45, high: 40 }, horizon: { short: 40, medium: 45, long: 15 }, vibe: { serious: 20, balanced: 45, degen: 35 } } },
  { symbol: 'JERRY', name: 'JERRY', weights: { risk: { low: 10, medium: 35, high: 55 }, horizon: { short: 55, medium: 35, long: 10 }, vibe: { serious: 15, balanced: 30, degen: 55 } } },
  { symbol: 'sMON', name: 'Kintsu Staked Monad', weights: { risk: { low: 50, medium: 40, high: 10 }, horizon: { short: 10, medium: 40, long: 50 }, vibe: { serious: 55, balanced: 35, degen: 10 } } },
  { symbol: 'KIWIF', name: 'Kiwi Wif Hat', weights: { risk: { low: 5, medium: 25, high: 70 }, horizon: { short: 70, medium: 25, long: 5 }, vibe: { serious: 5, balanced: 25, degen: 70 } } },
  { symbol: 'KB', name: 'Kryptobaby777', weights: { risk: { low: 15, medium: 40, high: 45 }, horizon: { short: 45, medium: 40, long: 15 }, vibe: { serious: 15, balanced: 40, degen: 45 } } },
  { symbol: 'KURT', name: 'Kurt Clobaine', weights: { risk: { low: 10, medium: 30, high: 60 }, horizon: { short: 60, medium: 30, long: 10 }, vibe: { serious: 10, balanced: 30, degen: 60 } } },
  { symbol: 'LBTC', name: 'LBTC', weights: { risk: { low: 35, medium: 45, high: 20 }, horizon: { short: 20, medium: 45, long: 35 }, vibe: { serious: 40, balanced: 45, degen: 15 } } },
  { symbol: 'MONKA', name: 'MONKA GIGA', weights: { risk: { low: 5, medium: 20, high: 75 }, horizon: { short: 75, medium: 20, long: 5 }, vibe: { serious: 5, balanced: 20, degen: 75 } } },
]

export function scoreDiscreteTokens(a: QuizAnswer): { symbol: string; name: string; scorePct: number }[] {
  // Simple average of the three category percentages based on user's chosen option
  return DISCRETE_TOKENS.map((t) => {
    const r = t.weights.risk[a.risk]
    const h = t.weights.horizon[a.horizon]
    const v = t.weights.vibe[a.vibe]
    const score = (r + h + v) / 3
    return { symbol: t.symbol, name: t.name, scorePct: Math.round(score) }
  }).sort((x, y) => y.scorePct - x.scorePct)
}


