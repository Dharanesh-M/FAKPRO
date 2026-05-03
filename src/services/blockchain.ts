/**
 * Blockchain interaction service
 * Handles MetaMask connection and smart contract calls
 * Falls back to local simulation when no contract is deployed
 */
import { ethers } from "ethers";

// Contract ABI - generated from ProductAuthentication.sol
const CONTRACT_ABI = [
  "function createProduct(string,string,string,string,string,string,string,int256,int256,string) external",
  "function addEvent(string,string,string,int256,int256,string) external",
  "function scanProduct(string,int256,int256) external",
  "function getProduct(string) external view returns (tuple(string,string,string,string,string,string,string,address,uint256,bool,uint256))",
  "function getEventCount(string) external view returns (uint256)",
  "function getEvent(string,uint256) external view returns (tuple(address,string,string,tuple(int256,int256,uint256),string))",
  "function getTotalProducts() external view returns (uint256)",
  "event ProductCreated(string productId, address creator, uint256 timestamp)",
  "event ProductUpdated(string productId, address updater, string action, uint256 timestamp)",
  "event ProductScanned(string productId, address scanner, int256 lat, int256 lng, uint256 timestamp)",
];

// Set this after deploying the contract to a testnet
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";

export interface MetaMaskState {
  isInstalled: boolean;
  isConnected: boolean;
  address: string | null;
  chainId: string | null;
  balance: string | null;
}

export const genTxHash = () =>
  "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");

class BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private contract: ethers.Contract | null = null;

  get isContractDeployed(): boolean {
    return !!CONTRACT_ADDRESS;
  }

  get hasMetaMask(): boolean {
    return typeof window !== "undefined" && !!(window as any).ethereum;
  }

  async connectWallet(): Promise<MetaMaskState> {
    if (!this.hasMetaMask) {
      throw new Error("MetaMask is not installed. Please install MetaMask browser extension.");
    }

    const ethereum = (window as any).ethereum;
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    this.provider = new ethers.BrowserProvider(ethereum);
    this.signer = await this.provider.getSigner();

    const address = accounts[0];
    const chainId = await ethereum.request({ method: "eth_chainId" });
    const balanceWei = await this.provider.getBalance(address);
    const balance = ethers.formatEther(balanceWei);

    if (CONTRACT_ADDRESS) {
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
    }

    return {
      isInstalled: true,
      isConnected: true,
      address,
      chainId,
      balance: parseFloat(balance).toFixed(4),
    };
  }

  async getAccounts(): Promise<string[]> {
    if (!this.hasMetaMask) return [];
    const ethereum = (window as any).ethereum;
    try {
      return await ethereum.request({ method: "eth_accounts" });
    } catch {
      return [];
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.signer) throw new Error("Wallet not connected");
    return this.signer.signMessage(message);
  }

  // Smart contract interactions (or simulation)
  async createProductOnChain(
    productId: string,
    name: string,
    batch: string,
    origin: string,
    manufacturer: string,
    manufacturerDate: string,
    description: string,
    lat: number,
    lng: number,
    locationName: string
  ): Promise<{ txHash: string; simulated: boolean }> {
    if (this.contract && this.signer) {
      try {
        const tx = await this.contract.createProduct(
          productId, name, batch, origin, manufacturer, manufacturerDate, description,
          Math.round(lat * 1e6), Math.round(lng * 1e6), locationName
        );
        const receipt = await tx.wait();
        return { txHash: receipt.hash, simulated: false };
      } catch (err: any) {
        console.warn("Contract call failed, using simulation:", err.message);
      }
    }
    // Simulation fallback
    return { txHash: genTxHash(), simulated: true };
  }

  async addEventOnChain(
    productId: string,
    role: string,
    action: string,
    lat: number,
    lng: number,
    locationName: string
  ): Promise<{ txHash: string; simulated: boolean }> {
    if (this.contract && this.signer) {
      try {
        const tx = await this.contract.addEvent(
          productId, role, action,
          Math.round(lat * 1e6), Math.round(lng * 1e6), locationName
        );
        const receipt = await tx.wait();
        return { txHash: receipt.hash, simulated: false };
      } catch (err: any) {
        console.warn("Contract call failed, using simulation:", err.message);
      }
    }
    return { txHash: genTxHash(), simulated: true };
  }

  async scanProductOnChain(
    productId: string,
    lat: number,
    lng: number
  ): Promise<{ txHash: string; simulated: boolean }> {
    if (this.contract && this.signer) {
      try {
        const tx = await this.contract.scanProduct(
          productId, Math.round(lat * 1e6), Math.round(lng * 1e6)
        );
        const receipt = await tx.wait();
        return { txHash: receipt.hash, simulated: false };
      } catch (err: any) {
        console.warn("Contract call failed, using simulation:", err.message);
      }
    }
    return { txHash: genTxHash(), simulated: true };
  }

  onAccountsChanged(callback: (accounts: string[]) => void) {
    if (this.hasMetaMask) {
      (window as any).ethereum.on("accountsChanged", callback);
    }
  }

  onChainChanged(callback: (chainId: string) => void) {
    if (this.hasMetaMask) {
      (window as any).ethereum.on("chainChanged", callback);
    }
  }
}

export const blockchainService = new BlockchainService();
