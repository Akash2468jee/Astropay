import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import WalletCard from "./components/WalletCard";
import BalanceCard from "./components/BalanceCard";
import SendPayment from "./components/SendPayment";
import TransactionResult from "./components/TransactionResult";
import ConnectModal from "./components/ConnectModal";

import {
  checkFreighterInstalled,
  connectFreighter,
  connectAlbedo,
  fetchXlmBalance,
  sendTransactionFlow,
  fetchTipJarTotal,
  sendTipTransaction,
} from "./services/stellar";

/**
 * Main App Container.
 * Orchestrates global React states and renders the AstroTip dashboard.
 */
export default function App() {
  // Connection states
  const [publicKey, setPublicKey] = useState(() => localStorage.getItem("stellar_pk") || "");
  const [walletType, setWalletType] = useState(() => localStorage.getItem("stellar_wallet_type") || "");
  const [freighterInstalled, setFreighterInstalled] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  // Balance states
  const [balanceData, setBalanceData] = useState(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);

  // Tip Jar contract states
  const [tipJarTotal, setTipJarTotal] = useState("0.0000");
  const [isTipJarLoading, setIsTipJarLoading] = useState(false);

  // Transaction states
  const [txState, setTxState] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [txSuccess, setTxSuccess] = useState(false);

  /**
   * Loads the current balance of the active public key.
   */
  const loadAccountBalance = async (keyToLoad) => {
    if (!keyToLoad) return;
    setIsBalanceLoading(true);
    try {
      const data = await fetchXlmBalance(keyToLoad);
      setBalanceData(data);
    } catch (error) {
      toast.error(error.message || "Failed to retrieve account balance.");
    } finally {
      setIsBalanceLoading(false);
    }
  };

  /**
   * Loads the current total tips in the smart contract.
   */
  const loadTipJarTotal = async () => {
    setIsTipJarLoading(true);
    try {
      const total = await fetchTipJarTotal();
      setTipJarTotal(total);
    } catch (error) {
      console.error("Failed to load tip jar total:", error);
    } finally {
      setIsTipJarLoading(false);
    }
  };

  // Phase 1: Verify Freighter installation on mount and preload contract state
  useEffect(() => {
    const checkInstallation = async () => {
      const installed = await checkFreighterInstalled();
      setFreighterInstalled(installed);
      
      // Load public smart contract total tips
      loadTipJarTotal();

      // If public key is saved in localStorage, fetch user balance
      if (publicKey) {
        loadAccountBalance(publicKey);
      }
    };
    checkInstallation();
  }, []);

  // Sync balance and tip jar total when public key changes
  useEffect(() => {
    if (publicKey) {
      loadAccountBalance(publicKey);
    } else {
      setBalanceData(null);
    }
    loadTipJarTotal();
  }, [publicKey]);

  /**
   * Unified connection handler for both Freighter and Albedo.
   */
  const handleConnectWallet = async (type) => {
    setIsConnecting(true);
    const toastId = toast.loading(`Connecting to ${type === "albedo" ? "Albedo" : "Freighter"} wallet...`);
    try {
      let pk = "";
      if (type === "albedo") {
        pk = await connectAlbedo();
      } else {
        pk = await connectFreighter();
      }
      setPublicKey(pk);
      setWalletType(type);
      localStorage.setItem("stellar_pk", pk);
      localStorage.setItem("stellar_wallet_type", type);
      
      toast.update(toastId, {
        render: `${type === "albedo" ? "Albedo" : "Freighter"} wallet connected successfully!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Connection error:", error);
      toast.update(toastId, {
        render: error.message || "Connection rejected.",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  /**
   * Action handler: disconnects the session.
   */
  const handleDisconnect = () => {
    setPublicKey("");
    setWalletType("");
    localStorage.removeItem("stellar_pk");
    localStorage.removeItem("stellar_wallet_type");
    setBalanceData(null);
    setTxState(null);
    toast.info("Wallet disconnected.");
  };

  /**
   * Action handler: manual balance reload.
   */
  const handleRefreshBalance = () => {
    loadTipJarTotal();
    if (!publicKey) return;
    loadAccountBalance(publicKey);
    toast.success("Balances updated!");
  };

  /**
   * Action handler: executes the transaction send sequence.
   */
  const handleSendPayment = async (recipient, amount) => {
    if (!publicKey) return;
    
    setIsProcessing(true);
    setTxSuccess(false);
    setTxState({ status: "preparing", message: "Starting payment preparation..." });

    try {
      const hash = await sendTransactionFlow(publicKey, recipient, amount, walletType, (prog) => {
        setTxState(prog);
      });

      // Complete Success
      setTxState({ status: "success", hash });
      setTxSuccess(true);
      toast.success("Payment sent successfully!");
      
      // Auto refresh balance after transaction settles
      await loadAccountBalance(publicKey);
    } catch (error) {
      console.error("Transaction flow error:", error);
      setTxState({ status: "error", message: error.message || "Unknown error occurred." });
      toast.error("Payment failed. Check the status card for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Action handler: deposits a tip into the AstroTip smart contract.
   */
  const handleSendTip = async (amount) => {
    if (!publicKey) return;

    setIsProcessing(true);
    setTxSuccess(false);
    setTxState({ status: "preparing", message: "Starting smart contract tip deposit..." });

    try {
      const hash = await sendTipTransaction(publicKey, amount, walletType, (prog) => {
        setTxState(prog);
      });

      // Complete Success
      setTxState({ status: "success", hash });
      setTxSuccess(true);
      toast.success("Tip deposited into smart contract successfully!");

      // Auto refresh user balance and contract total
      await loadAccountBalance(publicKey);
      await loadTipJarTotal();
    } catch (error) {
      console.error("Tip deposit flow error:", error);
      setTxState({ status: "error", message: error.message || "Unknown error occurred during contract call." });
      toast.error("Contract deposit failed. Check the status card for details.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex flex-col selection:bg-stellar-accent/30 selection:text-white pb-16">
      {/* Navbar */}
      <Navbar
        publicKey={publicKey}
        walletType={walletType}
        onConnectClick={() => setIsConnectModalOpen(true)}
        onDisconnect={handleDisconnect}
        isConnecting={isConnecting}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 flex-1 w-full">
        {/* Hero Section */}
        <section className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
            AstroTip
          </h1>
          <p className="text-md sm:text-lg text-slate-400 max-w-xl mx-auto">
            Decentralized tipping and payments powered by Stellar Soroban Smart Contracts.
          </p>
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start animate-fadeIn" style={{ animationDelay: "0.1s" }}>
          {/* Left Column (Wallet & Balance info) */}
          <div className="space-y-8">
            <WalletCard
              publicKey={publicKey}
              walletType={walletType}
              freighterInstalled={freighterInstalled}
              isConnecting={isConnecting}
              onConnectClick={() => setIsConnectModalOpen(true)}
              onDisconnect={handleDisconnect}
            />

            <BalanceCard
              publicKey={publicKey}
              balanceData={balanceData}
              isLoading={isBalanceLoading}
              onRefresh={handleRefreshBalance}
              tipJarTotal={tipJarTotal}
              isTipJarLoading={isTipJarLoading}
            />
          </div>

          {/* Right Column (Forms & Results) */}
          <div className="space-y-8">
            <SendPayment
              publicKey={publicKey}
              balanceData={balanceData}
              onSubmit={handleSendPayment}
              onTipContract={handleSendTip}
              isProcessing={isProcessing}
              txSuccess={txSuccess}
            />

            <TransactionResult txState={txState} />
          </div>
        </div>
      </main>

      {/* Connection Modal Overlay */}
      <ConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onConnect={handleConnectWallet}
        freighterInstalled={freighterInstalled}
      />

      {/* Toast Notification Provider */}
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
