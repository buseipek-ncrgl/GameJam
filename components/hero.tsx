"use client";

import Link from "next/link";
import Button from "@/components/ui/button";
import Countdown from "./countdown";
import { useMemo } from "react";

export default function Hero() {
  // Etkinlik başlangıcı
  const target = useMemo(() => new Date("2025-10-24T06:00:00Z"), []);

  const fullDateTR = useMemo(() => {
    try {
      return (
        new Intl.DateTimeFormat("tr-TR", {
          dateStyle: "full",
          timeStyle: "short",
          timeZone: "Europe/Istanbul",
        }).format(target) + " (TSİ)"
      );
    } catch {
      return "";
    }
  }, [target]);

  return (
    <section
      className="
        relative z-0 isolate w-full overflow-hidden
        py-20 md:py-24
        text-white
        bg-cover bg-center bg-no-repeat
      "
      style={{ backgroundImage: "url('/hero.png')" }}
    >
      {/* SOL tarafı butonlar için karartan overlay */}
      <div
        aria-hidden
        className="
          absolute inset-0 -z-10
          bg-gradient-to-r from-black/70 via-black/50 to-transparent
        "
      />


      {/* İçerik */}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Üst logolar kaldırıldı */}
        
        {/* Ana İçerik */}
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
          {/* SOL */}
          <div className="drop-shadow-[0_3px_14px_rgba(0,0,0,0.55)]">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-white">
              Oyna ve Kazan!
            </h1>
            <p className="mt-4 max-w-xl opacity-95 text-white/90">
              Oyununu geliştir, puan topla, ödülleri kap. Sen de katıl ve 
              yaratıcılığını göster!
            </p>

            {/* CTA'lar — Neon Tema Uyumlu */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/kayit" aria-label="Başvuru Yap sayfasına git">
                <div className="group relative">
                  {/* Neon Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur-md group-hover:blur-lg transition-all duration-300 opacity-60 group-hover:opacity-80"></div>
                  
                  {/* Button */}
                  <div className="relative bg-gradient-to-r from-cyan-500/90 to-blue-600/90 hover:from-cyan-400 hover:to-blue-500 rounded-xl px-6 py-3 text-white font-semibold text-base shadow-lg hover:shadow-cyan-400/30 transition-all duration-300 hover:scale-[1.02] border border-cyan-400/50 hover:border-cyan-300/70">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                      <span>Başvuru Yap</span>
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/takvim" aria-label="Etkinlik takvimini gör">
                <div className="group relative">
                  {/* Neon Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl blur-md group-hover:blur-lg transition-all duration-300 opacity-60 group-hover:opacity-80"></div>
                  
                  {/* Button */}
                  <div className="relative bg-gradient-to-r from-purple-500/90 to-pink-600/90 hover:from-purple-400 hover:to-pink-500 rounded-xl px-6 py-3 text-white font-semibold text-base shadow-lg hover:shadow-purple-400/30 transition-all duration-300 hover:scale-[1.02] border border-purple-400/50 hover:border-purple-300/70">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      <span>Takvimi Gör</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
