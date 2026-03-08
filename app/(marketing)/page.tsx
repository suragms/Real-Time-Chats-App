import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Shield, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center pt-12 sm:pt-20 pb-16 px-4">
      {/* Hero Section */}
      <section className="w-full max-w-6xl text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--card)] text-[var(--foreground)] font-bold text-sm mb-8 border border-[var(--card-border)] shadow-sm animate-fade-in hover:border-[var(--primary)] transition-colors cursor-default">
          <div className="relative h-6 w-6 overflow-hidden rounded-md">
            <Image src="/logo.png" alt="Logo" fill className="object-cover" sizes="24px" />
          </div>
          RealChatsApp
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--foreground)] mb-4 sm:mb-6 max-w-4xl" style={{ lineHeight: 1.1 }}>
          Message with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-indigo-500">absolute confidence</span> and speed.
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-[var(--muted)] max-w-2xl mb-8 sm:mb-10 leading-relaxed text-balance">
          The most reliable, secure, and intuitive real-time messaging platform. Built for those who value privacy without sacrificing performance. Experience a premium workspace that feels like your own.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/auth"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 sm:px-8 sm:py-4 font-bold text-[var(--primary-foreground)] shadow-[var(--shadow-md)] transition hover:bg-[var(--primary-hover)] hover:scale-105 active:scale-95"
          >
            Get Started Now <ArrowRight size={20} />
          </Link>
          <Link
            href="/features"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 border-[var(--card-border)] bg-[var(--card)] px-6 py-3 sm:px-8 sm:py-4 font-bold text-[var(--foreground)] shadow-sm transition hover:bg-slate-50 hover:border-[var(--muted)] active:scale-95"
          >
            View Architecture
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="mt-16 sm:mt-24 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 py-8 sm:py-12">
        <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-[var(--card)] border border-[var(--card-border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all group">
          <div className="h-14 w-14 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] mb-6 group-hover:scale-110 transition-transform">
            <Zap size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3 text-[var(--foreground)]">Instant Precision</h3>
          <p className="text-[var(--muted)] leading-relaxed">Real-time WebSocket infrastructure ensures sub-millisecond delivery. Perfect for time-sensitive collaboration.</p>
        </div>

        <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-[var(--card)] border border-[var(--card-border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all group">
          <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-6 group-hover:scale-110 transition-transform">
            <Shield size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3 text-[var(--foreground)]">Privacy by Design</h3>
          <p className="text-[var(--muted)] leading-relaxed">Your data belongs to you. We implement robust Row-Level Security (RLS) to ensure your messages remain strictly private.</p>
        </div>

        <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-[var(--card)] border border-[var(--card-border)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all group">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
            <Globe size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3 text-[var(--foreground)]">Enterprise Stability</h3>
          <p className="text-[var(--muted)] leading-relaxed">Engineered for 99.9% uptime. Always-on presence and typing status keep your team in perfect sync.</p>
        </div>
      </section>

      {/* Mockup Section */}
      <section className="mt-16 w-full max-w-5xl rounded-t-3xl border border-[var(--card-border)] border-b-0 bg-[var(--card)] shadow-2xl overflow-hidden relative">
        <div className="h-12 border-b border-[var(--card-border)] flex items-center px-4 gap-2 bg-slate-50">
          <div className="h-3 w-3 rounded-full bg-red-400"></div>
          <div className="h-3 w-3 rounded-full bg-amber-400"></div>
          <div className="h-3 w-3 rounded-full bg-green-400"></div>
        </div>
        <div className="aspect-video w-full bg-gradient-to-tr from-sky-100 to-indigo-50 flex items-center justify-center">
          {/* Simple abstract UI representation */}
          <div className="flex w-3/4 h-3/4 rounded-2xl bg-white shadow-xl overflow-hidden border border-slate-200">
            <div className="w-1/3 border-r border-slate-100 bg-slate-50"></div>
            <div className="flex-1 bg-white relative">
              <div className="absolute right-2 sm:right-4 bottom-2 sm:bottom-4 w-28 sm:w-48 h-8 sm:h-12 bg-sky-100 rounded-xl rounded-br-sm border border-sky-200 shadow-sm"></div>
              <div className="absolute left-2 sm:left-4 bottom-12 sm:bottom-20 w-28 sm:w-48 h-8 sm:h-12 bg-slate-100 rounded-xl rounded-bl-sm border border-slate-200 shadow-sm"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
