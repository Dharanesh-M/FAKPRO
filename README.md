# FAKPRO 🛡️
**Fake Product Identification & Supply Chain Tracking Using Blockchain**

![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)
![Ethereum](https://img.shields.io/badge/Ethereum-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

---

## 📖 Overview

Counterfeit products cost the global economy billions of dollars annually while endangering consumer safety and damaging brand reputation. **FAKPRO** is a state-of-the-art decentralized web application designed to eliminate counterfeit goods by providing complete, tamper-proof supply chain transparency.

By leveraging the **Ethereum Blockchain** and smart contracts, FAKPRO establishes an immutable ledger of product provenance. From the moment a product is manufactured to the moment it reaches the consumer's hands, every lifecycle event, geographic transit point, and verification scan is cryptographically secured and publicly verifiable.

---

## ✨ Key Features

- **🔐 Blockchain Verification**: Direct integration with Ethereum smart contracts ensures that product data, manufacturing details, and supply chain logs cannot be altered, spoofed, or deleted.
- **📱 Instant QR Code Scanning & Generation**: Built-in dynamic QR code generation for manufacturers and real-time camera scanning (`html5-qrcode`) for instant consumer verification.
- **🗺️ Interactive Geo-Tracking**: Live geographical mapping (`Leaflet` & `react-leaflet`) visualizing the exact physical journey of products across global supply chains.
- **📊 Real-Time Analytics & Threat Detection**: Advanced dashboard analytics (`recharts`) tracking scan frequencies, geographic distributions, and automated flagging of potential counterfeit anomalies.
- **🔄 Built-In Simulation Mode**: Seamless fallback simulation mode allowing developers and users to test the full application workflow without requiring immediate testnet deployment or gas fees.
- **👥 Multi-Stakeholder Workflows**: Tailored role-based dashboards for Manufacturers, Suppliers, Retailers, and Customers.

---

## 🏗️ Stakeholder Workflows

```
┌────────────────┐      ┌───────────────┐      ┌───────────────┐      ┌────────────────┐
│  Manufacturer  ├─────►│   Supplier    ├─────►│   Retailer    ├─────►│    Customer    │
└────────────────┘      └───────────────┘      └───────────────┘      └────────────────┘
 • Creates Product       • Logs Transit         • Logs Arrival         • Scans QR Code
 • Generates QR          • Updates GPS          • Verifies Stock       • Checks Map
 • Commits to Chain      • Commits to Chain     • Commits to Chain     • Confirms Legitimacy
```

1. **🏭 Manufacturer**: Connects MetaMask wallet, registers new product batches, defines origin/manufacturing metadata, and generates secure cryptographic QR codes.
2. **🚚 Supplier / Logistics**: Scans batches during transit, logging real-time GPS coordinates and handling milestones (e.g., Customs Clearance, Warehouse Departure).
3. **🏪 Retailer**: Scans shipments upon arrival at retail outlets, verifying authenticity before placing items on shelves.
4. **👤 Customer**: Uses any smartphone or web device to scan the product's QR code, instantly viewing its complete history, map trajectory, and authenticating its legitimacy.

---

## 🛠️ Technology Stack

### **Frontend & UI**
- **Framework**: [React 18](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### **Web3 & Smart Contracts**
- **Smart Contracts**: [Solidity](https://soliditylang.org/) (`^0.8.19`)
- **Blockchain Interaction**: [Ethers.js (v6)](https://docs.ethers.org/v6/)
- **Wallet Integration**: [MetaMask API](https://metamask.io/)

### **Data Visualization & Utilities**
- **Mapping**: [Leaflet](https://leafletjs.com/) & [React Leaflet](https://react-leaflet.js.org/)
- **Charts & Analytics**: [Recharts](https://recharts.org/)
- **QR Code Scanning**: [HTML5-QRCode](https://github.com/mebjas/html5-qrcode)
- **QR Code Generation**: [qrcode.react](https://github.com/zpao/qrcode.react)
- **State Management**: [TanStack React Query](https://tanstack.com/query/latest)

---

## 📂 Project Structure

```
FAKPRO/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI & layout components (Shadcn UI, Navbar, Sidebar)
│   ├── contexts/           # Global state providers (AuthContext, ProductContext, NotificationContext)
│   ├── contracts/          # Solidity smart contracts (ProductAuth.sol)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and helpers (clsx, tailwind merge)
│   ├── pages/              # Application pages (Dashboard, Scan, Verify, Track, Analytics, etc.)
│   ├── services/           # Blockchain Web3 service layer (blockchain.ts)
│   ├── App.tsx             # Main routing and provider hierarchy
│   └── main.tsx            # Application entry point
├── package.json            # Project dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
└── vite.config.ts          # Vite bundler configuration
```

---

## 🚀 Getting Started

### **1. Prerequisites**
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MetaMask Browser Extension](https://metamask.io/) installed and configured
- Package manager ([Bun](https://bun.sh/), [NPM](https://www.npmjs.com/), or [Yarn](https://yarnpkg.com/))

### **2. Installation**

Clone the repository and install dependencies:

```bash
# Clone the repository
git clone https://github.com/your-username/FAKPRO.git
cd FAKPRO

# Install dependencies using Bun (recommended)
bun install

# OR using NPM
npm install
```

### **3. Running the Development Server**

Start the Vite development server:

```bash
# Using Bun
bun run dev

# OR using NPM
npm run dev
```

Open your browser and navigate to `http://localhost:8080` (or the port provided in your terminal).

---

## 🔗 Smart Contract Deployment & Configuration

FAKPRO includes a fully functional Solidity smart contract located at `src/contracts/ProductAuth.sol`. 

### **Simulation Mode (Default)**
If no smart contract address is provided, `blockchain.ts` automatically operates in **Simulation Mode**. This allows you to test the complete UI, generate mock transaction hashes, and simulate blockchain state changes without needing testnet ETH.

### **Deploying to Ethereum Testnet (Sepolia)**

1. Install Hardhat and required dependencies if setting up a standalone deployment environment.
2. Compile and deploy the smart contract using Hardhat to the Sepolia testnet:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```
3. Copy the deployed contract address from your terminal output.
4. Create a `.env` file in the root directory and add your contract address:
   ```env
   VITE_CONTRACT_ADDRESS="0xYourDeployedContractAddressHere"
   ```
5. Restart your Vite development server. FAKPRO will now route all product registrations, tracking events, and scans directly through the Sepolia testnet!

---

## 💻 Usage Guide

1. **Connect Wallet**: Click the **Connect Wallet / Connect MetaMask** button in the top navigation bar to authenticate your session.
2. **Register a Product (Manufacturer)**: Navigate to the **Add Product** page, fill in product specifications, initial GPS coordinates, and submit the transaction to generate a unique QR code.
3. **Update Supply Chain (Supplier/Retailer)**: Use the **Track** or **Product Details** page to add new lifecycle events (e.g., "In Transit", "Customs Check") with updated geo-locations.
4. **Verify Authenticity (Consumer)**: Go to the **Verify** or **Scan** page, allow camera permissions or upload a QR image, and instantly view the verification status, scan count, and complete supply chain map.
5. **Monitor Analytics**: Access the **Analytics** and **Alerts** dashboards to track system-wide scan volumes and identify potential counterfeiting hotspots.

---

## 🤝 Contributing

Contributions are welcome! Follow these steps to contribute:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

---
<div align="center">
<b>Built with ❤️ for a Counterfeit-Free Future</b>
</div>
