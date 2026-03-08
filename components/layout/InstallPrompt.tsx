"use client";

import { useEffect, useState } from "react";
import { X, Download } from "lucide-react";

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Register manual service worker for dev and production
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js');
        }

        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);

            // Only show if user hasn't dismissed it previously
            if (!localStorage.getItem("pwa_install_dismissed")) {
                setShowPrompt(true);
            }
        };

        window.addEventListener("beforeinstallprompt", handler);

        // Handle when app is successfully installed
        window.addEventListener("appinstalled", () => {
            setShowPrompt(false);
            setDeferredPrompt(null);
        });

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
            setShowPrompt(false);
        }
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem("pwa_install_dismissed", "true");
    };

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:bottom-8 md:right-8 md:left-auto md:w-96 rounded-2xl bg-[var(--card)] p-4 shadow-2xl border border-[var(--card-border)] animate-in slide-in-from-bottom-5">
            <div className="flex items-start justify-between">
                <div className="flex gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-sm overflow-hidden">
                        <Download size={24} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-[var(--foreground)]">Install RealChatsApp</h3>
                        <p className="text-xs text-[var(--muted)] mt-1 mb-3">Install our App for a better, full-screen native experience.</p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleInstall}
                                className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-[var(--primary-hover)] active:scale-95"
                            >
                                Install App
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="rounded-lg border border-[var(--card-border)] bg-[var(--background)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] transition hover:bg-[var(--card-border)]"
                            >
                                Not Now
                            </button>
                        </div>
                    </div>
                </div>
                <button onClick={handleDismiss} className="text-[var(--muted)] hover:text-[var(--foreground)]" aria-label="Close">
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
