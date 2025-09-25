# Environment Setup for TinSwap

## Required Environment Variables

Create a file `/Users/ishaan/Developer/TinSwap/app/.env.local` with the following content:

```bash
# 0x API Configuration
# Get your API key from https://dashboard.0x.org/create-account
VITE_ZEROEX_BASE=https://api.0x.org
VITE_ZEROEX_API_KEY=your_api_key_here

# Monad Testnet RPC (optional override)
VITE_MONAD_RPC=https://testnet-rpc.monad.xyz
```

## Quick Setup Commands

```bash
cd /Users/ishaan/Developer/TinSwap/app
echo "VITE_ZEROEX_BASE=https://api.0x.org" > .env.local
echo "VITE_ZEROEX_API_KEY=your_api_key_here" >> .env.local
echo "VITE_MONAD_RPC=https://testnet-rpc.monad.xyz" >> .env.local
```

Then restart your dev server:
```bash
npm run dev
```

## Testing the Swap

1. Connect your wallet to Monad Testnet (chainId: 10143)
2. Make sure you have some MON tokens for gas and swapping
3. Go through Quiz → Swipe → Swap flow
4. Enter an amount and click "Get Quote" or "Swap"
5. Check browser console for detailed logs

The swap will try:
1. 0x API with native MON
2. 0x API with WMON (wrapped MON)
3. Fallback to UniswapV2 router on Monad

## Troubleshooting

- If wallet shows as disconnected despite being connected, check console for errors
- If 0x API fails, it will automatically fall back to router swaps
- Make sure you're on Monad Testnet (not Ethereum mainnet)
- Ensure you have MON balance for gas fees

