import { DollarSign, Zap, Check } from "lucide-react";

export default function PricingPage() {
    return (
        <div className="container mx-auto px-4 py-12 sm:py-24 max-w-5xl">
            <div className="flex flex-col items-center text-center mb-16">
                <div className="h-16 w-16 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6 border border-amber-500/20">
                    <DollarSign size={32} />
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-balance break-words">Simple, transparent pricing.</h1>
                <p className="text-lg sm:text-xl text-[var(--muted)] max-w-2xl text-balance">
                    Choose the plan that's right for you or your team. No hidden fees.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Plan */}
                <div className="bg-[var(--card)] p-8 rounded-[40px] border border-[var(--card-border)] shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold mb-6">
                        PERSONAL
                    </div>
                    <div className="mb-8">
                        <span className="text-5xl font-black">$0</span>
                        <span className="text-[var(--muted)] ml-2">/forever</span>
                    </div>
                    <ul className="space-y-4 mb-10">
                        {["Unlimited messages", "Real-time presence", "Basic profiles", "1:1 DMs", "Standard support"].map((feat) => (
                            <li key={feat} className="flex items-center gap-3 text-sm text-[var(--muted)]">
                                <Check size={18} className="text-emerald-500 shrink-0" />
                                {feat}
                            </li>
                        ))}
                    </ul>
                    <button className="w-full py-4 rounded-full font-bold bg-slate-100 text-slate-800 hover:bg-slate-200 transition">
                        Get Started
                    </button>
                </div>

                {/* Pro Plan */}
                <div className="bg-slate-900 p-8 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden group text-white">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                        <Zap size={120} />
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] text-xs font-bold mb-6 border border-[var(--primary)]/30">
                        ENTERPRISE
                    </div>
                    <div className="mb-8">
                        <span className="text-5xl font-black">$12</span>
                        <span className="text-slate-400 ml-2">/user/mo</span>
                    </div>
                    <ul className="space-y-4 mb-10">
                        {["Everything in Free", "Custom domains", "Advanced analytics", "Priority support", "Early access features", "API access"].map((feat) => (
                            <li key={feat} className="flex items-center gap-3 text-sm text-slate-300">
                                <Check size={18} className="text-[var(--primary)] shrink-0" />
                                {feat}
                            </li>
                        ))}
                    </ul>
                    <button className="w-full py-4 rounded-full font-bold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-lg shadow-[var(--primary)]/20 transition">
                        Upgrade Now
                    </button>
                </div>
            </div>
        </div>
    );
}
