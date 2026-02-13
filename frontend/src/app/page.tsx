import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Search,
  Activity,
  BrainCircuit,
  Database,
  Globe,
  Lock
} from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-50/50 rounded-full blur-3xl -z-10" />

          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-bold animate-fade-in">
              <ShieldCheck size={16} />
              <span>L'IA au service de la Néphrologie au Bénin</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] font-outfit text-slate-900 max-w-4xl mx-auto">
              Prédire l'Insuffisance Rénale <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Avant qu'il ne soit trop tard.</span>
            </h1>

            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
              Une plateforme d'intelligence artificielle entraînée sur les données du CNHU/HKM pour assister les professionnels de santé dans le dépistage précoce.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-8">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-base shadow-xl hover:bg-slate-800 transition-all active:scale-95 hover:shadow-2xl hover:-translate-y-1"
              >
                Accéder au Dashboard
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/predict"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-base border-2 border-slate-100 bg-white text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
              >
                Mode Diagnostic
                <Activity size={18} />
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2 justify-center font-bold text-slate-400">
                <Database size={20} /> Dataset CNHU
              </div>
              <div className="flex items-center gap-2 justify-center font-bold text-slate-400">
                <BrainCircuit size={20} /> XGBoost v2
              </div>
              <div className="flex items-center gap-2 justify-center font-bold text-slate-400">
                <Globe size={20} /> 300+ Patients
              </div>
              <div className="flex items-center gap-2 justify-center font-bold text-slate-400">
                <Lock size={20} /> RGPD Compliant
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="bg-slate-50 py-24 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-black font-outfit text-slate-900 mb-4">Pourquoi Rénal AI ?</h2>
              <p className="text-slate-500 text-lg">Nous combinons l'expertise médicale locale avec la puissance de l'apprentissage automatique.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Activity className="text-primary" />}
                title="Dépistage Précoce"
                desc="Identifiez les patients à risque (Stade 1-2) avant l'apparition des symptômes cliniques majeurs."
              />
              <FeatureCard
                icon={<BrainCircuit className="text-accent" />}
                title="Explicabilité SHAP"
                desc="Ne faites pas confiance aveuglément. Comprenez quels facteurs (HTA, Urée...) influencent chaque décision."
              />
              <FeatureCard
                icon={<Database className="text-indigo-500" />}
                title="Données Locales"
                desc="Un modèle calibré spécifiquement sur la population béninoise pour une précision maximale."
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <BrainCircuit className="text-primary w-5 h-5" />
            </div>
            <span className="font-outfit font-black text-lg text-slate-900">Rénal AI</span>
          </div>
          <p className="text-slate-400 text-sm font-bold">© 2026 Hackathon AMA Project. Open Source.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3 font-outfit">{title}</h3>
      <p className="text-slate-500 leading-relaxed font-medium text-sm">{desc}</p>
    </div>
  )
}
