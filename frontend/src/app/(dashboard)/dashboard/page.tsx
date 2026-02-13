import React from 'react';
import {
    Users,
    Zap,
    TrendingUp,
    Database,
    Activity as ActivityIcon,
    ChevronRight,
} from 'lucide-react';
import Link from 'next/link';

async function getStats() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/stats`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (e) {
        return null;
    }
}

export default async function DashboardPage() {
    const stats = await getStats();

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black font-outfit text-slate-900">Tableau de Bord</h1>
                    <p className="text-muted font-medium">Surveillance en temps réel de l'insuffisance rénale au Bénin</p>
                </div>
                <div className="bg-blue-50 text-primary px-4 py-2 rounded-xl text-sm font-bold border border-blue-100">
                    Données du CNHU/HKM
                </div>
            </div>

            {/* Stats Dashboard */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<Users className="text-primary" />}
                    label="Patients Étudiés"
                    value={stats?.total_patients?.toString() || "308"}
                    subLabel="+12% ce mois"
                />
                <StatCard
                    icon={<Zap className="text-amber-500" />}
                    label="Âge Moyen"
                    value={stats?.avg_age ? `${stats.avg_age} ans` : "..."}
                    subLabel="Répartition Démographique"
                />
                <StatCard
                    icon={<TrendingUp className="text-success" />}
                    label="Fonction Rénale Moy."
                    value={stats?.avg_egfr ? `${Math.round(stats.avg_egfr)}` : "..."}
                    subLabel="ml/min/1.73m² (eGFR)"
                />
                <StatCard
                    icon={<Database className="text-indigo-500" />}
                    label="Prévalence HTA"
                    value={stats?.major_risk_factors?.[0]?.match(/\((\d+)%\)/)?.[1] + "%" || "..."}
                    subLabel="Facteur de Risque #1"
                />
            </section>

            {/* Public Health Section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                <div className="lg:col-span-2 medical-card rounded-[2rem] p-8 space-y-6">
                    <h2 className="text-2xl font-black font-outfit">Insights de Santé Publique</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <h4 className="text-xs font-black text-muted mb-6 uppercase tracking-widest">Répartition par Sexe</h4>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-slate-700">
                                        <span>Hommes</span>
                                        <span>{stats?.gender_distribution?.['Masculin'] || 0} ({Math.round((stats?.gender_distribution?.['Masculin'] || 0) / (stats?.total_patients || 1) * 100)}%)</span>
                                    </div>
                                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: `${(stats?.gender_distribution?.['Masculin'] || 0) / (stats?.total_patients || 1) * 100}%` }} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-slate-700">
                                        <span>Femmes</span>
                                        <span>{stats?.gender_distribution?.['Féminin'] || 0} ({Math.round((stats?.gender_distribution?.['Féminin'] || 0) / (stats?.total_patients || 1) * 100)}%)</span>
                                    </div>
                                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-pink-500" style={{ width: `${(stats?.gender_distribution?.['Féminin'] || 0) / (stats?.total_patients || 1) * 100}%` }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-between">
                            <h4 className="text-xs font-black text-muted mb-2 uppercase tracking-widest">Facteurs de Risque Principaux</h4>
                            <div className="space-y-3 mt-2">
                                {stats?.major_risk_factors?.slice(0, 3).map((factor: string, i: number) => (
                                    <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700 p-2 bg-white rounded-lg border border-slate-100 shadow-sm">
                                        <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-error' : i === 1 ? 'bg-warning' : 'bg-slate-300'}`} />
                                        {factor}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="medical-card rounded-[2.25rem] p-8 bg-slate-900 text-white flex flex-col justify-center text-center space-y-5 shadow-2xl">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-md border border-white/10">
                        <ActivityIcon className="text-primary w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-black font-outfit">Analyse Individuelle</h3>
                    <p className="text-sm font-medium text-slate-400 leading-relaxed">
                        Utilisez notre modèle IA pour évaluer le risque d'un patient spécifique.
                    </p>
                    <Link href="/predict" className="bg-primary text-white px-6 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 group hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 active:scale-95">
                        Nouveau Diagnostic
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>
        </div>
    );
}

function StatCard({ icon, label, value, subLabel }: { icon: React.ReactNode, label: string, value: string, subLabel: string }) {
    return (
        <div className="medical-card p-6 rounded-3xl hover:border-primary/50 transition-all duration-300 group bg-white">
            <div className="bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/5 transition-colors">
                <div className="transform scale-110">{icon}</div>
            </div>
            <p className="text-[10px] font-black text-muted mb-1.5 uppercase tracking-widest">{label}</p>
            <div className="text-3xl font-black mb-1 font-outfit text-slate-900 tracking-tighter">{value}</div>
            <p className="text-[9px] font-bold text-muted/60 bg-slate-100 py-0.5 px-2.5 rounded-full inline-block mt-1">{subLabel}</p>
        </div>
    );
}
