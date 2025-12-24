# HushSwap

HushSwap is a privacy-preserving fixed-rate swap built on Zama FHEVM. It lets users swap encrypted wETH for encrypted wZama at a constant rate of 1 wETH = 1000 wZama, while keeping balances and transfer amounts confidential on-chain.

## Project Summary
This project demonstrates how Fully Homomorphic Encryption (FHE) can power a simple, predictable swap flow without exposing amounts. It includes confidential ERC7984 tokens, a swap contract that settles via confidential transfers, and a React front end that shows encrypted balances and can request decryption on demand.

## Key Features
- Fixed exchange rate: 1 wETH -> 1000 wZama
- Encrypted balances and transfer amounts using ERC7984
- Swap executed on confidential token transfer callback
- Frontend balance view with explicit decrypt action
- No mock data: UI reads live on-chain state

## Advantages
- Predictable pricing with zero slippage
- Strong privacy for balances and swap amounts
- Simple user flow and easy auditing of logic
- Clear separation of token logic and swap logic
- Extensible foundation for additional pairs and features

## Problems Solved
- Users can swap without revealing amounts publicly
- Teams can build a demo swap without price oracles
- Developers get a minimal example of FHEVM integration
- Frontend illustrates encrypted reads and user-triggered decrypts

## Technology Stack
- Smart contracts: Solidity, Hardhat, hardhat-deploy
- Confidential tokens: OpenZeppelin ERC7984
- FHEVM: Zama Solidity libraries and config
- Frontend: React, Vite, RainbowKit
- Data access: viem for reads, ethers for writes
- Tooling: TypeScript, npm

## Contracts
- `contracts/WrapETH.sol`: ERC7984 token for encrypted wETH balances.
- `contracts/WrapZama.sol`: ERC7984 token for encrypted wZama balances.
- `contracts/HushSwap.sol`: Receives confidential wETH transfers and sends wZama at `SWAP_RATE`.

Design notes:
- The swap rate is fixed in-contract (`SWAP_RATE = 1000`).
- The swap is triggered by `onConfidentialTransferReceived`.
- View functions avoid `msg.sender` to keep logic deterministic.
- Token `mint` is currently public for local testing; production should add access control.

## Frontend
- Located in `app/`.
- Uses ethers for write transactions and viem for read calls.
- Shows encrypted balances; users must explicitly request decryption.
- No local storage and no environment variables are used in the frontend.
- ABI is copied from `deployments/sepolia` (no JSON imports in the UI).

## Repository Structure
```
.
├── contracts/            Smart contracts
├── deploy/               Deployment scripts
├── deployments/          Deploy artifacts (including ABI)
├── tasks/                Hardhat tasks
├── test/                 Contract tests
├── app/                  React frontend (Vite)
└── hardhat.config.ts     Hardhat config
```

## Prerequisites
- Node.js 20+
- npm
- A private key for deployment (no mnemonic support)
- Infura API key for Sepolia

## Setup
1. Install root dependencies:
   ```bash
   npm install
   ```
2. Create or update `.env` in the repo root:
   ```bash
   PRIVATE_KEY=your_private_key_without_0x
   INFURA_API_KEY=your_infura_api_key
   ETHERSCAN_API_KEY=your_etherscan_api_key
   ```
   The deployment scripts use `process.env.PRIVATE_KEY` and `process.env.INFURA_API_KEY`.

## Local Development Workflow
1. Compile contracts:
   ```bash
   npm run compile
   ```
2. Run tests and tasks:
   ```bash
   npm run test
   ```
3. Start a local node and deploy:
   ```bash
   npx hardhat node
   npx hardhat deploy --network localhost --tags HushSwap
   ```

## Sepolia Deployment
1. Run tests and tasks locally first.
2. Deploy with your private key:
   ```bash
   npx hardhat deploy --network sepolia --tags HushSwap
   ```
3. Verify (optional):
   ```bash
   npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
   ```

## Frontend Usage
1. Install frontend dependencies:
   ```bash
   cd app
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Connect a wallet on Sepolia and use the swap and decrypt actions.

## Operational Notes
- Frontend reads are done with viem; writes are done with ethers.
- The UI does not use local storage or environment variables.
- Encrypted balance decryption requires the Zama relayer flow.

## Future Roadmap
- Add reverse swap (wZama -> wETH)
- Introduce access control for minting on production networks
- Add swap limits and rate governance
- Improve UI feedback for encrypted and decrypted states
- Expand to additional confidential tokens
- Formal security review and gas profiling

## License
BSD-3-Clause-Clear. See `LICENSE`.
