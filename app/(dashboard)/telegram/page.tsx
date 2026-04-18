"use client";

import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { QRCode } from "react-qrcode-logo";
import { Copy, RefreshCw, Check, QrCode, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

import { telegramApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TelegramPage() {
  const [qrLink, setQrLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const connect = useMutation({
    mutationFn: telegramApi.connect,
    onSuccess: (data) => {
      if (data?.link) {
        setQrLink(data.link);
        toast.success("QR Code ready");
      }
    },
    onError: () => toast.error("Failed to generate QR code"),
  });

  const handleCopy = () => {
    if (!qrLink) return;
    navigator.clipboard.writeText(qrLink);
    setCopied(true);
    toast.success("Link copied");
    setTimeout(() => setCopied(false), 1800);
  };

  const regenerate = () => {
    setQrLink(null);
    connect.mutate();
  };

  // Auto generate on mount
  useEffect(() => {
    connect.mutate();
  }, []);

  return (
    <div className=" bg-gradient-to-br  flex items-center justify-center ">
      <div className="w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-purple-600 shadow-2xl">
            <QrCode className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Connect Telegram
          </h1>
          <p className="mt-3 text-base text-zinc-400">
            Scan with Telegram to link your account
          </p>
        </div>

        {/* Main Card */}
        <Card className="bg-[#1a0026]/90 border border-[#3a0048] backdrop-blur-2xl shadow-2xl">
          <CardContent className="p-5 flex flex-col items-center">
            {qrLink ? (
              <>
                {/* Sexy QR Code */}
                <div className="relative mb-8 p-6 bg-white rounded-3xl shadow-2xl">
                  <QRCode
                    value={qrLink}
                    size={220}
                    fgColor="#1a0026"
                    bgColor="#ffffff"
                    logoImage="https://res.cloudinary.com/dgj2rhqd0/image/upload/v1776495405/Luliops_icon_rsgl21.png" // ← Put your logo here
                    logoWidth={70}
                    logoHeight={72}
                    logoOpacity={1}
                    qrStyle="dots"
                    eyeRadius={16}
                    style={{
                      borderRadius: "20px",
                    }}
                  />

                  {/* Premium glow effect */}
                  <div className="absolute -inset-3 rounded-[26px] bg-gradient-to-br from-primary/20 to-purple-600/20 -z-10 blur-xl" />
                </div>

                {/* Instructions */}
                <div className="text-center mb-8">
                  <p className="text-emerald-400 font-medium text-lg">
                    Ready to scan
                  </p>
                  <p className="text-zinc-400 mt-1">
                    Open Telegram → Settings → Devices → Scan QR
                  </p>
                </div>

                {/* Link Box */}
                <div className="w-full bg-[#2a0038] border border-[#3a0048] rounded-2xl p-4 flex items-center gap-3 mb-8">
                  <LinkIcon className="h-5 w-5 text-zinc-500 flex-shrink-0" />
                  <code className="flex-1 text-sm font-mono text-zinc-300 break-all select-all">
                    {qrLink}
                  </code>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleCopy}
                    className="h-9 w-9"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 w-full">
                  <Button
                    onClick={regenerate}
                    variant="outline"
                    className="flex-1 border-[#3a0048] hover:bg-[#2a0038] h-12"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    New Code
                  </Button>

                  <Button
                    onClick={() => window.open(qrLink, "_blank")}
                    className="flex-1 h-12 bg-primary hover:bg-primary/90"
                  >
                    Open Link
                  </Button>
                </div>
              </>
            ) : (
              /* Loading State */
              <div className="flex flex-col items-center justify-center py-20">
                <div className="h-16 w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
                <p className="mt-6 text-zinc-400">
                  Generating secure QR code...
                </p>
                <p className="text-xs text-zinc-500 mt-2">
                  This usually takes less than 2 seconds
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Note */}
        <p className="text-center text-xs text-zinc-500 mt-8">
          The QR code expires in 10 minutes for your security
        </p>
      </div>
    </div>
  );
}
