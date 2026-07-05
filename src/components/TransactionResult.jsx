import React, { useState } from "react";
import { CheckCircle2, XCircle, ExternalLink, Copy, Check, Clock, Radio, KeyRound, ArrowUpRight } from "lucide-react";
import { LoadingSpinner } from "./Loader";

/**
 * TransactionResult Card.
 * Renders step-by-step transaction state tracking, final receipt, and explorer link.
 */
export default function TransactionResult({ txState }) {
  const [copied, setCopied] = useState(false);
  
  // States:
  // - null / idle: No transaction yet
  // - { status: 'preparing', message: '...' }
  // - { status: 'signing', message: '...' }
  // - { status: 'submitting', message: '...' }
  // - { status: 'success', hash: '...' }
  // - { status: 'error', message: '...' }

  if (!txState) {
    return (
      <div className="w-full p-6 rounded-2xl bg-stellar-card border border-white/5 backdrop-blur-md flex flex-col items-center justify-center text-center py-10">
        <Clock className="w-8 h-8 text-slate-500 mb-3" />
        <h4 className="text-sm font-semibold text-slate-300">Transaction Status</h4>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          Initiate a payment above to see transaction execution logs in real-time.
        </p>
      </div>
    );
  }

  const { status, message, hash } = txState;

  const handleCopyHash = async () => {
    if (!hash) return;
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy hash:", err);
    }
  };

  // Render Step-by-Step progress tracker during loading states
  const renderProgressSteps = (activeStatus) => {
    const steps = [
      { id: "preparing", label: "Prepare Transaction", icon: Radio },
      { id: "signing", label: "Await Freighter Signature", icon: KeyRound },
      { id: "submitting", label: "Submit to Horizon Testnet", icon: ArrowUpRight },
    ];

    const getStepState = (stepId) => {
      const activeIdx = steps.findIndex((s) => s.id === activeStatus);
      const stepIdx = steps.findIndex((s) => s.id === stepId);

      if (stepIdx < activeIdx) return "completed";
      if (stepIdx === activeIdx) return "active";
      return "pending";
    };

    return (
      <div className="w-full space-y-4 py-2">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <h4 className="text-sm font-semibold text-slate-200">Processing Transaction</h4>
          <LoadingSpinner size="sm" />
        </div>
        
        <div className="space-y-4">
          {steps.map((step) => {
            const StepIcon = step.icon;
            const state = getStepState(step.id);

            return (
              <div key={step.id} className="flex items-center gap-3">
                <div className={`p-2 rounded-lg border transition-all duration-300 ${
                  state === "completed" 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : state === "active"
                    ? "bg-stellar-accent/10 border-stellar-accent/30 text-stellar-accent animate-pulse"
                    : "bg-white/5 border-white/10 text-slate-500"
                }`}>
                  <StepIcon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className={`text-xs font-semibold block transition-colors ${
                    state === "completed" ? "text-emerald-400" : state === "active" ? "text-white" : "text-slate-500"
                  }`}>
                    {step.label}
                  </span>
                  {state === "active" && (
                    <span className="text-[10px] text-slate-400 block mt-0.5 animate-fadeIn">
                      {message}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full p-6 rounded-2xl bg-stellar-card border border-white/5 backdrop-blur-md relative overflow-hidden group">
      {/* Background glow */}
      {status === "success" && (
        <div className="absolute -right-20 -top-20 w-45 h-45 bg-emerald-500/10 rounded-full blur-3xl" />
      )}
      {status === "error" && (
        <div className="absolute -right-20 -top-20 w-45 h-45 bg-rose-500/10 rounded-full blur-3xl" />
      )}

      {/* Progressing Steps */}
      {["preparing", "signing", "submitting"].includes(status) && renderProgressSteps(status)}

      {/* Success Receipt */}
      {status === "success" && (
        <div className="text-center py-2 space-y-4">
          <div className="inline-flex p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-white">Payment Sent Successfully!</h4>
            <p className="text-xs text-slate-400">
              The transaction has been confirmed on the Stellar Testnet.
            </p>
          </div>

          {/* Hash Box */}
          <div className="space-y-1.5 text-left pt-2">
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Transaction Hash
            </label>
            <div className="flex items-center gap-2 p-2.5 bg-white/5 border border-white/10 rounded-xl">
              <span className="font-mono text-xs text-slate-300 break-all select-all flex-1">
                {hash}
              </span>
              <button
                onClick={handleCopyHash}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400 hover:text-white transition-all"
                title="Copy Hash"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Explorer Button */}
          <div className="pt-2">
            <a
              href={`https://stellar.expert/explorer/testnet/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 text-xs font-semibold transition-all"
            >
              <span>View on Stellar Expert Explorer</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Error Output */}
      {status === "error" && (
        <div className="text-center py-2 space-y-4">
          <div className="inline-flex p-3 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 shadow-lg shadow-rose-500/10">
            <XCircle className="w-10 h-10" />
          </div>
          
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-white font-sans">Transaction Failed</h4>
            <p className="text-xs text-slate-400">
              There was an issue processing or submitting your payment.
            </p>
          </div>

          {/* Error Message Details */}
          <div className="p-3 bg-rose-500/5 border border-rose-500/15 rounded-xl text-left">
            <span className="text-xs font-semibold text-rose-400 block mb-1">
              Error Details:
            </span>
            <p className="text-xs text-slate-300 font-mono leading-relaxed max-h-36 overflow-y-auto break-words">
              {message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
