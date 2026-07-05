import React from "react";
import { X, ArrowRight, Wallet, Shield } from "lucide-react";

/**
 * Connect Wallet Modal.
 * Renders a glassmorphic overlay for selecting a wallet connection (Freighter or Albedo).
 */
export default function ConnectModal({
  isOpen,
  onClose,
  onConnect,
  freighterInstalled,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
      {/* Dark backdrop overlay */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md transition-all duration-300"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#0b0f19]/90 border border-white/10 rounded-2xl p-6 shadow-2xl z-10 overflow-hidden flex flex-col space-y-6">
        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 w-40 h-40 bg-stellar-accent/15 rounded-full blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-stellar-secondary/15 rounded-full blur-3xl" />

        {/* Header */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-stellar-accent/10 border border-stellar-accent/20 text-stellar-accent">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">Connect a Wallet</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options List */}
        <div className="flex flex-col gap-4 z-10">
          {/* Option 1: Freighter */}
          <button
            onClick={() => {
              if (freighterInstalled) {
                onConnect("freighter");
                onClose();
              } else {
                window.open("https://www.freighter.app/", "_blank", "noopener,noreferrer");
              }
            }}
            className="w-full text-left p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all group flex items-start gap-4"
          >
            <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-105 transition-transform shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors">
                  Freighter Wallet
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-200 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Official extension for Stellar web app builders.
              </p>
              <div className="pt-1 flex">
                {freighterInstalled ? (
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Installed & Ready
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    Not Detected (Click to Install)
                  </span>
                )}
              </div>
            </div>
          </button>

          {/* Option 2: Albedo */}
          <button
            onClick={() => {
              onConnect("albedo");
              onClose();
            }}
            className="w-full text-left p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all group flex items-start gap-4"
          >
            <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-extrabold font-mono group-hover:scale-105 transition-transform shrink-0 flex items-center justify-center w-10 h-10">
              A
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors">
                  Albedo Wallet
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-200 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Secure web-based Stellar signer. No extension needed.
              </p>
              <div className="pt-1 flex">
                <span className="text-[9px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  Available (Web Signer)
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-white/5 text-center z-10">
          <p className="text-[10px] text-slate-500">
            Your keys never leave your device. Connection is fully secure.
          </p>
        </div>
      </div>
    </div>
  );
}
