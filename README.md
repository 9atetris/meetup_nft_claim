# Starknet Meetup Japan — NFT Claim Page

## セットアップ

```bash
npm install
npm run dev
```

## Cartridge連携

`src/lib/providers.tsx` の `CartridgeConnector` にコントラクトのポリシーやRPC URLを追加。

`src/components/ClaimButton.tsx` の `TODO` 部分にコントラクト呼び出しを実装。

```ts
import { Contract } from "starknet";
import { useAccount } from "@starknet-react/core";

const { account } = useAccount();
const contract = new Contract(abi, CONTRACT_ADDRESS, account);
await contract.claim();
```

## デプロイ

Vercel推奨：

```bash
npx vercel
```
