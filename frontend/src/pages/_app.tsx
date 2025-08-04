import "../globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster"; // ✅ Importado corretamente

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div
      className={cn(
        "min-h-screen font-inter antialiased bg-background text-foreground",
        inter.variable
      )}
    >
      <Component {...pageProps} />
      <Toaster /> {/* ✅ Agora todos os toasts funcionam globalmente */}
    </div>
  );
}
