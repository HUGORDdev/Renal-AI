import React from 'react';
import { Settings, Server, Shield, Database } from 'lucide-react';

export default function ConfigPage() {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4">
                <div className="bg-accent/20 p-3 rounded-2xl">
                    <Settings className="text-accent w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-4xl font-black font-outfit">Configuration Système</h1>
                    <p className="text-muted">Gestion du Backend et des Services IA</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ConfigCard
                    icon={<Server className="text-primary" />}
                    title="Endpoint Backend"
                    value={process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}
                    status="Connecté"
                />
                <ConfigCard
                    icon={<Shield className="text-accent" />}
                    title="Clé API Gemini"
                    value="••••••••••••••••"
                    status="Active"
                />
                <ConfigCard
                    icon={<Database className="text-warning" />}
                    title="Dataset CSV"
                    value="ckd_dataset.csv"
                    status="Chargé"
                />
                <ConfigCard
                    icon={<Settings className="text-muted" />}
                    title="Version Application"
                    value="v2.0.0-gold"
                    status="Stable"
                />
            </div>
        </div>
    );
}

function ConfigCard({ icon, title, value, status }: { icon: React.ReactNode, title: string, value: string, status: string }) {
    return (
        <div className="glass-card p-8 rounded-3xl flex items-center justify-between group hover:border-accent/20 transition-all">
            <div className="flex items-center gap-6">
                <div className="bg-white/5 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    {icon}
                </div>
                <div>
                    <h3 className="text-sm font-bold text-muted uppercase tracking-wider">{title}</h3>
                    <p className="text-lg font-mono text-foreground mt-1">{value}</p>
                </div>
            </div>
            <div className="px-4 py-1 rounded-full bg-success/10 text-success text-xs font-bold border border-success/20">
                {status}
            </div>
        </div>
    );
}
