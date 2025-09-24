export type ZeroExQuote = {
  price: string
  guaranteedPrice: string
  to: string
  data: string
  value: string
  buyTokenAddress: string
  sellTokenAddress: string
  buyAmount: string
  sellAmount: string
  allowanceTarget?: string
  sources?: Array<{ name: string; proportion: string }>
  estimatedGas?: string
}

export async function fetchZeroExQuote(params: {
  sellToken: string
  buyToken: string
  sellAmount: string
  takerAddress: string
  apiKey?: string
  chainId?: number
}): Promise<ZeroExQuote> {
  const { sellToken, buyToken, sellAmount, takerAddress, apiKey, chainId } = params
  const base = resolveZeroExBaseUrl(chainId ?? 1)
  const url = new URL(`${base}/swap/v1/quote`)
  url.searchParams.set('sellToken', sellToken)
  url.searchParams.set('buyToken', buyToken)
  url.searchParams.set('sellAmount', sellAmount)
  url.searchParams.set('takerAddress', takerAddress)

  const headers: Record<string, string> = { 'accept': 'application/json' }
  const key = apiKey || import.meta.env.VITE_ZEROEX_API_KEY
  if (key) headers['0x-api-key'] = key as string

  const res = await fetch(url.toString(), { headers })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`0x quote error ${res.status}: ${text}`)
  }
  return (await res.json()) as ZeroExQuote
}

function resolveZeroExBaseUrl(chainId: number): string {
  switch (chainId) {
    case 1:
      return 'https://api.0x.org'
    case 137:
      return 'https://polygon.api.0x.org'
    case 42161:
      return 'https://arbitrum.api.0x.org'
    case 10:
      return 'https://optimism.api.0x.org'
    case 8453:
      return 'https://base.api.0x.org'
    default:
      return 'https://api.0x.org'
  }
}


