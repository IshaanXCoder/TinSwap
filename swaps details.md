<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# whicih all swaps are available from monad testnet using 0x swap api

[https://0x.org/docs/0x-swap-api](https://0x.org/docs/0x-swap-api)

The 0x Swap API on Monad testnet supports token swaps with deep liquidity aggregated from over 150 exchanges. This means it provides access to a large number of token pairs for swapping through a single API on Monad, which is a high-performance EVM-compatible chain. The Swap API on Monad testnet allows embedding swaps in on-chain apps with optimal trade execution and best prices from this extensive liquidity aggregation.

To summarize:

- 0x Swap API works on Monad testnet with access to liquidity from 150+ exchanges.
- This allows swapping a wide range of tokens supported by those exchanges.
- The Swap API offers best prices and smooth trading experience on Monad testnet.
- Developers can integrate swaps on Monad testnet today using the 0x Swap API.

So effectively, all swaps available through the 0x Swap API on other supported networks (covering 150+ exchanges) are available on Monad testnet, given it uses the same API infrastructure and aggregated liquidity sources.[^1_1][^1_2][^1_3][^1_4]
<span style="display:none">[^1_5][^1_6][^1_7][^1_8][^1_9]</span>

```
<div style="text-align: center">⁂</div>
```

[^1_1]: https://0x.org/post/0x-101-introduction-to-monad

[^1_2]: https://www.monad.xyz/ecosystem

[^1_3]: https://x.com/0xProject/status/1925220064695103782

[^1_4]: https://www.monad.xyz/ecosystem?page=4

[^1_5]: https://0x.org/products/swap

[^1_6]: https://blog.uniswap.org/monad-testnet

[^1_7]: https://www.youtube.com/watch?v=tVvZ1ivp4X0

[^1_8]: https://github.com/0xProject/0x-settler

[^1_9]: https://www.scribd.com/document/889957347/Monad-Testnet-Bot


---

# list the tokens which are available to swap from monad testnet. and provide steps to swap using the swap api.

explain with code

Here is the list of tokens available on the Monad testnet and the steps with code to swap tokens using the 0x Swap API.

## Tokens Available to Swap on Monad Testnet

Monad testnet has a variety of ERC20 tokens deployed with contracts available for swapping such as:


| Token Name | Symbol | Contract Address |
| :-- | :-- | :-- |
| CatToken | CAT | 0xed4cf89cc5c1007e2ed3782be9177873abdd39aa |
| Test Token | TEST | 0x883b653721125dbb6f239ef8a687dcde493c81a5 |
| Honey | HONEY | 0xb7c13b13a7efc4a5aa917f8d8f580cce045b95a4 |
| Deez Tokens | DEEZ | 0x85ed7111bb4a26cd8307bb36ab05f93d2c5e11f6 |
| Beastcoin | BEAST | 0xa11f77bb3ea24b38ea9ec5f9daa2ba24af7ad7a6 |
| Dragon | DGN | 0x256c1cb6565b4c206a556faf56b9c14efb20c2a0 |
| Others (Custom) | Various | Multiple other ERC20 tokens with deployed addresses |

You can find the full list on Monad Explorer or OKLink Monad Testnet explorer. These tokens are supported for swaps using the 0x Swap API on Monad testnet.[^2_1][^2_2]

## Steps to Swap Tokens Using 0x Swap API on Monad Testnet

### Step 1: Set Token Allowance

Approve the 0x Exchange Proxy to spend your ERC20 tokens on your behalf.

Example using ethers.js:

```javascript
const { ethers } = require("ethers");
const provider = new ethers.providers.JsonRpcProvider("https://rpc.monad.xyz/testnet");
const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);

const tokenAddress = "TOKEN_CONTRACT_ADDRESS";  // Token like CAT or DGN
const spender = "0xdef1c0ded9bec7f1a1670819833240f027b25eff"; // 0x Exchange Proxy contract
const amount = ethers.utils.parseUnits("10.0", 18); // Approve 10 tokens with 18 decimals

const erc20ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)"
];
const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, wallet);

async function approveToken() {
  const tx = await tokenContract.approve(spender, amount);
  await tx.wait();
  console.log("Token allowance set.");
}

approveToken();
```


### Step 2: Fetch Swap Quote

Request a swap quote from the 0x Swap API on Monad testnet by specifying the sellToken, buyToken, sellAmount, and chainId (Monad testnet chain ID).

Example API call URL:

```bash
https://swap-api.monad.xyz/swap/v1/quote?sellToken=TOKEN_A&buyToken=TOKEN_B&sellAmount=1000000000000000000&chainId=1234
```

Example in code using Axios:

```javascript
const axios = require('axios');

async function fetchQuote() {
  const sellToken = "TOKEN_A_CONTRACT";
  const buyToken = "TOKEN_B_CONTRACT";
  const sellAmount = "1000000000000000000"; // 1 token in base units
  const chainId = "1234"; // Monad testnet chainId (example)

  const url = `https://swap-api.monad.xyz/swap/v1/quote?sellToken=${sellToken}&buyToken=${buyToken}&sellAmount=${sellAmount}&chainId=${chainId}`;

  const response = await axios.get(url);
  return response.data;
}
```


### Step 3: Sign and Send Transaction

Use the transaction data returned by the quote to send a signed transaction via ethers.js or web3.

Example with ethers.js:

```javascript
async function executeSwap() {
  const quote = await fetchQuote();

  const tx = {
    to: quote.to,
    data: quote.data,
    value: ethers.BigNumber.from(quote.value),
    gasPrice: ethers.BigNumber.from(quote.gasPrice),
    gasLimit: ethers.BigNumber.from(quote.gas),
    nonce: await wallet.getTransactionCount()
  };

  const sentTx = await wallet.sendTransaction(tx);
  await sentTx.wait();
  console.log("Swap executed successfully.");
}

executeSwap();
```

Replace `"TOKEN_A_CONTRACT"`, `"TOKEN_B_CONTRACT"`, `"YOUR_PRIVATE_KEY"`, and the `"chainId"` as applicable for Monad testnet.

***

This process enables swapping any supported tokens on Monad testnet using the 0x Swap API with live liquidity and optimal routes. The token list includes various ERC20 tokens deployed on Monad, accessible via Monad explorers. The above code examples demonstrate the full flow: allowance approval, fetching a quote, and executing the swap transaction programmatically.[^2_3][^2_2][^2_4][^2_5][^2_1]

If more details are needed on chainId or contract addresses, these can be obtained from official Monad documentation or explorer portals.
<span style="display:none">[^2_10][^2_11][^2_12][^2_13][^2_14][^2_15][^2_16][^2_17][^2_18][^2_19][^2_6][^2_7][^2_8][^2_9]</span>

```
<div style="text-align: center">⁂</div>
```

[^2_1]: https://testnet.monadexplorer.com/tokens

[^2_2]: https://www.oklink.com/monad-testnet/token-list

[^2_3]: https://0x.org/post/0x-101-getting-started-with-swap-api

[^2_4]: https://www.quicknode.com/guides/defi/dexs/interacting-with-0x-api-using-javascript

[^2_5]: https://0x.org/docs/0x-swap-api/guides/swap-tokens-with-0x-swap-api

[^2_6]: https://0x.org/products/swap

[^2_7]: https://www.monad.xyz/ecosystem

[^2_8]: https://0x.org/post/0x-101-introduction-to-monad

[^2_9]: https://blog.uniswap.org/monad-testnet

[^2_10]: https://www.scribd.com/document/889957347/Monad-Testnet-Bot

[^2_11]: https://www.youtube.com/watch?v=tVvZ1ivp4X0

[^2_12]: https://docs.blockvision.org/reference/retrieve-token-trades

[^2_13]: https://github.com/monad-developers

[^2_14]: https://0x.org/docs/0x-swap-api/guides/build-token-swap-dapp-nextjs

[^2_15]: https://www.monad.xyz/post/monad-testnet-onboarding-guide

[^2_16]: https://github.com/0xProject/swap-demo-tutorial

[^2_17]: https://0x.org/docs/0x-swap-api/advanced-topics/handling-native-tokens

[^2_18]: https://github.com/0xProject/0x-examples

[^2_19]: https://replit.com/@0xproject/0x-Swap-API-v2-Permit2-Headless-Example

