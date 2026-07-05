import React, { useState } from "react";
import { AlertCircle, Check, Copy, ShieldAlert, ShieldCheck } from "lucide-react";

/**
 * Wallet Connection Card.
 * Prompts connections for Freighter or Albedo, and shows active wallet details.
 */
export default function WalletCard({
  publicKey,
  walletType,
  freighterInstalled,
  isConnecting,
  onConnectClick,
  onDisconnect,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!publicKey) return;
    try {
      await navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  // Case 1: Connected wallet
  if (publicKey) {
    return (
      <div className="w-full p-6 rounded-2xl bg-stellar-card border border-white/5 backdrop-blur-md relative overflow-hidden group">
        {/* Glow backdrop */}
        <div className="absolute -right-20 -top-20 w-45 h-45 bg-stellar-accent/10 rounded-full blur-3xl transition-all duration-500 group-hover:bg-stellar-accent/15" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-semibold text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-400" />
              <span>Wallet Connected</span>
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold capitalize">
              {walletType === "albedo" ? "Albedo Active" : "Freighter Active"}
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
              Stellar Address
            </label>
            <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl">
              <span className="font-mono text-xs text-slate-300 break-all select-all flex-1">
                {publicKey}
              </span>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white transition-all"
                title="Copy Address"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <div className="flex items-start gap-2 text-xs text-slate-400 bg-stellar-accent/5 border border-stellar-accent/10 p-3 rounded-xl">
              <AlertCircle className="w-4 h-4 text-stellar-accent shrink-0 mt-0.5" />
              <span>
                {walletType === "albedo" ? (
                  "Transactions will open in the secure Albedo Web Signer popup window for authorization."
                ) : (
                  "Make sure your Freighter extension has the **Testnet** selected in Preferences so you don't encounter network mismatched errors."
                )}
              </span>
            </div>
            <button
              onClick={onDisconnect}
              className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-400 text-slate-300 font-medium text-xs transition-all duration-200"
            >
              Disconnect Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Disconnected
  return (
    <div className="w-full p-6 rounded-2xl bg-stellar-card border border-white/5 backdrop-blur-md relative overflow-hidden group">
      {/* Glow backdrop */}
      <div className="absolute -right-20 -top-20 w-45 h-45 bg-stellar-secondary/10 rounded-full blur-3xl transition-all duration-500 group-hover:bg-stellar-secondary/15" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-semibold text-slate-200 flex items-center gap-2">
            <ShieldCheck className="w-4.5 h-4.5 text-stellar-secondary" />
            <span>Connect Wallet</span>
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20 font-medium">
            Ready
          </span>
        </div>

        <p className="text-sm text-slate-400 leading-relaxed">
          Connect your wallet (Freighter Browser Extension or Albedo Web Signer) to view XLM balances, send payments, and tip the smart contract.
        </p>

        <button
          onClick={onConnectClick}
          disabled={isConnecting}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-stellar-accent to-stellar-secondary hover:from-stellar-accent/90 hover:to-stellar-secondary/90 text-white font-semibold text-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-stellar-accent/15"
        >
          {isConnecting ? "Awaiting connection..." : "Connect Wallet"}
        </button>
      </div>
    </div>
  );
}
