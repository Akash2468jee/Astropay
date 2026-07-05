# StellarPay

StellarPay is a beginner-friendly Stellar Testnet decentralized application (dApp) that allows users to connect their Freighter wallet, view their XLM balance, and send XLM transactions securely on the Stellar Testnet.

The project is built with **React**, **Vite**, and **Tailwind CSS**, styled using a sleek, premium dark-themed glassmorphism interface.

## Features

- **Freighter Wallet Integration**: Connects seamlessly with Freighter extension. Handles auto-reconnects and disconnects.
- **Dynamic Balance Checking**: Instantly fetches native XLM balances from the Stellar Horizon Testnet.
- **SDF Friendbot Funding**: Allows new or unfunded testnet accounts to request a 10,000 XLM airdrop with a single click.
- **Payment Operations**: Build, sign, and submit payments on the Testnet with instant state tracking:
  - *Preparing transaction*
  - *Awaiting signature*
  - *Submitting to Testnet*
  - *Success* (includes transaction hash and direct Stellar Expert Explorer links)
  - *Failure* (with rich error logs)
- **Defensive Error Handling**: Alerts users if Freighter is missing, on the wrong network (e.g., Public instead of Testnet), or if they reject signature prompts.
- **Tailored CSS Styling**: A responsive, mobile-first design with smooth animation triggers, micro-interactions, and custom loaders.

## Tech Stack

- **Framework**: React + Vite (JavaScript ESM)
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Stellar Connection**: `@stellar/stellar-sdk`
- **Wallet Link**: `@stellar/freighter-api`
- **Globals Resolving**: `vite-plugin-node-polyfills`
- **Notifications**: `react-toastify`
- **Icons**: `lucide-react`

---

## Getting Started

### 1. Prerequisites (Installing Freighter Wallet)

To interact with StellarPay, you need the official Freighter browser extension:
1. Visit [freighter.app](https://www.freighter.app/) to download and install the extension for your browser (Chrome, Firefox, Edge, Brave).
2. Set up your wallet, create a password, and write down your recovery recovery phrase.
3. **Important**: Configure Freighter for the Stellar Testnet:
   - Open the Freighter extension.
   - Click the gear icon (**Settings**) in the top right.
   - Go to **Preferences**.
   - Under **Network**, select **Testnet**.

---

### 2. Run Locally

Follow these steps to run the application on your computer:

```bash
# Clone the repository (or navigate to the project folder)
cd stellar

# Install dependencies
npm install

# Run the local development server
npm run dev
```

The app will start at `http://localhost:5173`. Open this URL in your web browser.

---

### 3. Funding Your Account

Stellar accounts must be initialized on-chain by funding them with a minimum reserve (usually 1 XLM or more). Since this dApp uses the **Testnet**, you can fund your account for free:
- **Option A (In-App)**: Simply connect your Freighter wallet to StellarPay. If your account is unfunded, a banner will appear with a **"Fund with Friendbot (10k XLM)"** button. Click it to fund your account instantly.
- **Option B (Manual)**: Copy your public key, go to the [Stellar Laboratory Friendbot](https://laboratory.stellar.org/#account-creator?network=testnet), paste your public address, and submit the form to receive 10,000 Testnet XLM.

---

## Folder Structure

```text
src/
├── components/
│   ├── Navbar.jsx              # App brand, connection state, toggle buttons
│   ├── WalletCard.jsx          # Extension checker, address copy, preferences
│   ├── BalanceCard.jsx         # XLM balance, manual refresh, Friendbot handler
│   ├── SendPayment.jsx         # Payment form with inputs and validation checks
│   ├── TransactionResult.jsx   # Interactive step trackers, success/failure screens
│   └── Loader.jsx              # Reusable spinners and balance load skeletons
├── services/
│   └── stellar.js              # Stellar SDK and Freighter API client logic
├── utils/
│   └── validators.js           # Public key pattern and balance amount validators
├── App.jsx                     # Central React state coordinator
├── main.jsx                    # React index DOM mount
└── index.css                   # Tailwind imports and glass theme overrides
```

---

## Deployment to Vercel

Prepare the project for production deployment on Vercel:

1. **Production Build Check**:
   Before deploying, verify that the project builds without errors:
   ```bash
   npm run build
   ```
   This will output a production bundle in the `dist/` directory.

2. **Deploy via Vercel CLI**:
   Ensure you have the Vercel CLI installed:
   ```bash
   npm install -g vercel
   vercel
   ```
   Follow the CLI prompts to deploy.

3. **Deploy via Vercel Dashboard (Recommended)**:
   - Push your code to a GitHub repository.
   - Import your repository on the [Vercel Dashboard](https://vercel.com).
   - Vercel will auto-detect **Vite** as the framework.
   - Set the Build Command to `npm run build` and Output Directory to `dist`.
   - Click **Deploy**.

---

## Screenshot Placeholders

*Include screenshots or GIFs here once live:*
- `[Screenshot - Connect Wallet Dashboard]`
- `[Screenshot - Transaction Progress Tracking]`
- `[Screenshot - Success Screen and Explorer link]`

---

## Submission Checklist

- [x] Freighter wallet connection configured
- [x] Horizon Server connected to `https://horizon-testnet.stellar.org`
- [x] LocalStorage session persistence implemented
- [x] Validation checks for recipient addresses and available funds
- [x] Real-time transaction stage logger
- [x] Responsive layout with custom dark glassmorphic styling
