import { FileText, UserCheck, AlertCircle, Ban, ShieldAlert, Globe } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-12 sm:py-24 max-w-4xl">
            {/* Header section */}
            <div className="flex flex-col items-center text-center mb-16">
                <div className="h-16 w-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-6 border border-indigo-500/20">
                    <FileText size={32} />
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-balance break-words">Terms of Service</h1>
                <p className="text-lg sm:text-xl text-[var(--muted)] max-w-2xl text-balance">
                    Please read these terms carefully before using RealChatsApp to understand your rights and responsibilities.
                </p>
            </div>

            <div className="space-y-12">
                <section className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--card-border)] shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-500">
                            <UserCheck size={24} />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold">Acceptance of Terms</h2>
                    </div>
                    <p className="text-[var(--muted)] leading-relaxed mb-4">
                        By accessing or using **RealChatsApp**, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section className="p-6 rounded-3xl border border-[var(--card-border)] bg-slate-50/50">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                            <AlertCircle className="text-amber-500" size={20} />
                            Account Responsibility
                        </h3>
                        <p className="text-[var(--muted)] text-sm leading-relaxed">
                            You are responsible for maintaining the security of your account and password. RealChatsApp cannot and will not be liable for any loss or damage from your failure to comply with this security obligation. You must provide a valid email address and your real name or a consistently used alias.
                        </p>
                    </section>
                    <section className="p-6 rounded-3xl border border-[var(--card-border)] bg-slate-50/50">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                            <Ban className="text-red-500" size={20} />
                            Prohibited Conduct
                        </h3>
                        <p className="text-[var(--muted)] text-sm leading-relaxed">
                            You may not use the service for any illegal or unauthorized purpose. You must not, in the use of the service, violate any laws in your jurisdiction. This includes, but is not limited to, harassment, spamming, and the transmission of harmful or malicious code.
                        </p>
                    </section>
                </div>

                <section className="prose prose-slate max-w-none">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                        <ShieldAlert className="text-[var(--primary)]" size={20} />
                        User Content & Privacy
                    </h3>
                    <p className="text-[var(--muted)] text-sm leading-relaxed mb-4">
                        You retain all ownership rights to the content you post or transmit through RealChatsApp. However, by using the service, you grant us a license to transmit, store, and process your content solely to provide the services to you.
                    </p>
                    <p className="text-[var(--muted)] text-sm leading-relaxed">
                        Our use of your personal information is governed by our **Privacy Policy**, which is incorporated into these terms by reference.
                    </p>
                </section>

                <section className="prose prose-slate max-w-none pt-8 border-t border-[var(--card-border)]">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                        <Globe className="text-emerald-500" size={20} />
                        Service Modifications & Availability
                    </h3>
                    <p className="text-[var(--muted)] text-sm leading-relaxed mb-4">
                        We reserve the right to modify or terminate the service for any reason, without notice at any time. We do not guarantee that the service will be available at all times. Service may be interrupted for maintenance, updates, or technical reasons.
                    </p>
                </section>

                <section className="bg-slate-900 text-white p-8 rounded-3xl">
                    <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
                        <div className="max-w-md">
                            <h3 className="text-xl font-bold mb-2">Legal Disclaimer</h3>
                            <p className="text-slate-400 text-sm">
                                The service is provided "as is". We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <div className="mt-16 text-center text-[var(--muted)] text-xs border-t border-[var(--card-border)] pt-8">
                © {new Date().getFullYear()} RealChatsApp. Developed by Surag Dev Studio.
            </div>
        </div>
    );
}

