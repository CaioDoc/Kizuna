"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, Copy, Check, QrCode } from "lucide-react";

export interface MobileQrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileQrModal({ isOpen, onClose }: MobileQrModalProps) {
  const [copied, setCopied] = useState(false);
  const appUrl = "https://caiodoc.github.io/Kizuna/";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    appUrl
  )}&color=8b5cf6&bgcolor=0a0a0f`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#12121a] border border-[#8b5cf6]/40 shadow-2xl space-y-6 text-center"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1f1f2e] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-[#8b5cf6]">
                  <QrCode className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-extrabold text-white">Mobile Web App Access</h2>
                  <p className="text-xs text-gray-400">Scan QR Code to open on your Smartphone</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-white bg-[#1f1f2e] hover:bg-[#2e2e42] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR Code Container */}
            <div className="p-4 rounded-2xl bg-[#0a0a0f] border border-[#8b5cf6]/40 inline-block glow-purple space-y-3">
              <div className="relative w-60 h-60 mx-auto rounded-xl overflow-hidden bg-[#0a0a0f]">
                <Image
                  src={qrCodeUrl}
                  alt="Kizuna Mobile Web App QR Code"
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
              </div>
              <span className="text-[10px] font-mono text-[#06b6d4] block uppercase font-bold">
                https://caiodoc.github.io/Kizuna/
              </span>
            </div>

            {/* PWA Smartphone Instructions */}
            <div className="p-4 rounded-2xl bg-[#0a0a0f] border border-[#1f1f2e] text-left text-xs space-y-2 font-mono">
              <div className="flex items-center gap-2 text-gray-200 font-bold">
                <Smartphone className="w-4 h-4 text-[#10b981]" />
                <span>How to Install as Mobile PWA App:</span>
              </div>
              <ul className="space-y-1 text-gray-400 list-disc list-inside text-[11px]">
                <li><strong className="text-white">iPhone (Safari)</strong>: Tap Share → Add to Home Screen</li>
                <li><strong className="text-white">Android (Chrome)</strong>: Tap ⋮ Menu → Install App</li>
              </ul>
            </div>

            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className="w-full py-3 rounded-xl bg-[#1f1f2e] hover:bg-[#2e2e42] text-gray-200 text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 border border-[#1f1f2e]"
            >
              {copied ? <Check className="w-4 h-4 text-[#10b981]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "URL Copied to Clipboard! ✓" : "Copy Web App Link"}</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
