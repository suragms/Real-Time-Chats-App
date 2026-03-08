import { Download, Monitor, Smartphone, Globe, ArrowRight } from "lucide-react";

export default function DownloadPage() {
    return (
        <div className="container mx-auto px-4 py-12 sm:py-24 max-w-5xl">
            <div className="flex flex-col items-center text-center mb-16">
                <div className="h-16 w-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-6 border border-indigo-500/20">
                    <Download size={32} />
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-balance break-words">The Chat App for everywhere.</h1>
                <p className="text-lg sm:text-xl text-[var(--muted)] max-w-2xl text-balance">
                    Download RealChatsApp on all your devices to stay connected wherever you are.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Desktop PWA Install */}
                <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--card-border)] shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[var(--foreground)] mb-6">
                        <Monitor size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Desktop Install</h3>
                    <p className="text-sm text-[var(--muted)] mb-4 flex-1">Install the app directly to your desktop for a native windowed experience.</p>
                    <div className="bg-[var(--background)] border border-[var(--card-border)] rounded-2xl p-4 w-full text-left">
                        <ol className="text-xs text-[var(--muted)] space-y-2 list-decimal list-inside font-medium">
                            <li>Open RealChatsApp in Chrome/Edge.</li>
                            <li>Look for the <Monitor className="inline pb-0.5" size={14} /> install icon in the URL bar.</li>
                            <li>Click <strong>Install</strong> to add it.</li>
                        </ol>
                    </div>
                </div>

                {/* Android PWA Install */}
                <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--primary)]/30 ring-1 ring-[var(--primary)]/10 shadow-lg flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 px-3 py-1 bg-[var(--primary)] text-white text-[10px] font-bold rounded-bl-xl">POPULAR</div>
                    <div className="h-12 w-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] mb-6">
                        <Smartphone size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Android Install</h3>
                    <p className="text-sm text-[var(--muted)] mb-4 flex-1">Get the app instantly on your Android without an app store.</p>
                    <div className="bg-[var(--background)] border border-[var(--card-border)] rounded-2xl p-4 w-full text-left">
                        <ol className="text-xs text-[var(--muted)] space-y-2 list-decimal list-inside font-medium">
                            <li>Open the website in your browser.</li>
                            <li>A bottom banner may prompt you to install.</li>
                            <li>Or tap the <strong>Menu (⋮)</strong> and select <strong>"Add to Home screen"</strong>.</li>
                        </ol>
                    </div>
                </div>

                {/* iOS PWA Install */}
                <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--card-border)] shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[var(--foreground)] mb-6">
                        <Globe size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">iOS Install</h3>
                    <p className="text-sm text-[var(--muted)] mb-4 flex-1">Add RealChatsApp to your iPhone or iPad home screen.</p>
                    <div className="bg-[var(--background)] border border-[var(--card-border)] rounded-2xl p-4 w-full text-left">
                        <ol className="text-xs text-[var(--muted)] space-y-2 list-decimal list-inside font-medium">
                            <li>Open RealChatsApp in <strong>Safari</strong>.</li>
                            <li>Tap the <strong>Share</strong> button at the bottom.</li>
                            <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}
