"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Activity,
    FlaskConical,
    ClipboardCheck,
    Lightbulb,
    FileDown,
    BrainCircuit,
    ChevronDown,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Constantes pour les options de formulaire
const DEPARTEMENTS = ['Littoral', 'Atlantique', 'Ouémé', 'Zou', 'Borgou', 'Mono', 'Couffo', 'Alibori', 'Atacora', 'Donga', 'Collines', 'Plateau'];
const OUI_NON = ['Non', 'Oui'];

const steps = [
    { title: 'Identité', icon: BrainCircuit },
    { title: 'Antécédents', icon: ClipboardCheck },
    { title: 'Biologie I', icon: FlaskConical },
    { title: 'Biologie II', icon: Activity },
];

// Libellés français pour les variables techniques renvoyées par l'API (SHAP / feature_importances_)
const LIBELLES_VARIABLES: Record<string, string> = {
    'Creat_mg_dL': 'Créatinine (mg/dL)',
    'Créatinine (mg/L)': 'Créatinine (mg/L)',
    'eGFR_MDRD': 'Débit de filtration glomérulaire estimé (eGFR MDRD)',
    'EGFR_MDRD': 'Débit de filtration glomérulaire estimé (eGFR MDRD)',
    'Urea_mg_dL': 'Urée (mg/dL)',
    'Urée (g/L)': 'Urée (g/L)',
    'Ratio_Urea_Creat': 'Ratio urée / créatinine',
    'Hb (g/dL)': 'Hémoglobine (g/dL)',
    'Glycémie à jeun (g/L)': 'Glycémie à jeun (g/L)',
    'Pression Artérielle Systolique (mmHg)': 'Pression artérielle systolique (mmHg)',
    'Pression Artérielle Diastolique (mmHg)': 'Pression artérielle diastolique (mmHg)',
    'Hypertension Artérielle': 'Hypertension artérielle',
    'Diabète': 'Diabète',
    'Age': 'Âge',
    'Sexe': 'Genre',
    'Poids (Kg)': 'Poids (kg)',
    'Taille (m)': 'Taille (m)',
    'Protéinurie (g/24h)': 'Protéinurie (g/24h)',
    'Acide Urique (mg/L)': 'Acide urique (mg/L)',
    'Ca^2+ (meq/L)': 'Calcium (meq/L)',
    'Score de Glasgow (/15)': 'Score de Glasgow',
    'Etat Général (EG) à l\'Admission': 'État général à l\'admission',
    'Conscience': 'Conscience',
    'Oedèmes': 'Œdèmes',
};
function libelleVariable(cle: string): string {
    return LIBELLES_VARIABLES[cle] || cle.replace(/_/g, ' ');
}

export default function PredictPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        Age: 45, Sexe: 'Masculin', Nationalité: 'Béninoise', Profession: 'Employé',
        "Situation Matrimoniale": 'Marié(e)', "Adresse (Département)": 'Littoral',
        "Consommation de Tabac": 'Non', "Consommation d'Alcool": 'Non',
        "Alimentation": 'Mixte', "Habitudes Alimentaires/Sel": 'Non',
        "Habitudes Alimentaires/Piment": 'Non', "Habitudes Alimentaires/Viande Rouge": 'Non',
        "Hypertension Artérielle": 'Non', "Diabète": 'Non', "Maladie Cardiovasculaire": 'Non',
        "Pression Artérielle Systolique (mmHg)": 120, "Pression Artérielle Diastolique (mmHg)": 80,
        "Pouls (bpm)": 75, "Poids (Kg)": 70, "Taille (m)": 1.70, "Température (C°)": 37,
        "Etat Général (EG) à l'Admission": 'Bon', "Oedèmes": 'Non', "Conscience": 'Claire',
        "Score de Glasgow (/15)": 15, "Créatinine (mg/L)": 12, "Urée (g/L)": 0.45,
        "Hb (g/dL)": 13.5, "Glycémie à jeun (g/L)": 1.0, "Ca^2+ (meq/L)": 4.5,
        "Acide Urique (mg/L)": 50, "Protéinurie (g/24h)": 0.0, "Albumine (g/L)": 0.0
    });

    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error("Erreur serveur");
            const data = await res.json();
            setResult(data);
            setCurrentStep(5);
        } catch (e) {
            console.error(e);
            alert("Erreur de connexion au serveur Rénal AI");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setResult(null);
        setCurrentStep(1);
    };

    return (
        <div className="space-y-4 max-w-7xl mx-auto pb-10">
            {currentStep <= 4 && (
                <div className="flex justify-between items-center px-4">
                    <div>
                        <h1 className="text-xl font-black font-outfit text-foreground tracking-tight">Analyse Rénal AI</h1>
                        <p className="text-muted text-[10px] font-bold uppercase tracking-widest">Assistant Diagnostic Expert</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 items-start justify-center max-w-4xl mx-auto w-full px-4">
                <AnimatePresence mode="wait">
                    {currentStep <= 4 && (
                        <motion.div
                            key="form-container"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="space-y-4"
                        >
                            <div className="flex justify-between px-4">
                                {steps.map((s, i) => (
                                    <div key={i} className="flex flex-col items-center gap-3 flex-1 relative">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 z-10 font-bold",
                                            currentStep > i + 1 ? "bg-success text-white shadow-lg" : currentStep === i + 1 ? "bg-primary text-white shadow-xl shadow-primary/20 scale-110" : "bg-slate-100 text-slate-400"
                                        )}>
                                            {currentStep > i + 1 ? <CheckCircle2 size={24} /> : <s.icon size={22} />}
                                        </div>
                                        <span className={cn(
                                            "text-[10px] font-black uppercase tracking-widest text-center",
                                            currentStep === i + 1 ? "text-primary" : "text-muted"
                                        )}>{s.title}</span>
                                        {i < steps.length - 1 && (
                                            <div className={cn("absolute h-[2px] w-full top-6 left-1/2 -z-0", currentStep > i + 1 ? "bg-success" : "bg-slate-100")} />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="medical-card rounded-[2rem] overflow-hidden shadow-xl">
                                <div className="p-6">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentStep}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-5"
                                        >
                                            {currentStep === 1 && (
                                                <div className="space-y-5">
                                                    <h2 className="text-lg font-black font-outfit inline-flex items-center gap-2">
                                                        <div className="w-1 h-4 bg-primary rounded-full" />
                                                        Démographie & Identité
                                                    </h2>
                                                    <div className="grid grid-cols-2 gap-6">
                                                        <FormInput label="Âge" type="number" value={formData.Age} onChange={(v) => updateField('Age', v)} />
                                                        <FormSelect label="Genre" options={['Masculin', 'Féminin']} value={formData.Sexe} onChange={(v) => updateField('Sexe', v)} />
                                                        <FormSelect label="Département" options={DEPARTEMENTS} value={formData["Adresse (Département)"]} onChange={(v) => updateField('Adresse (Département)', v)} />
                                                        <FormInput label="Profession" value={formData.Profession} onChange={(v) => updateField('Profession', v)} />
                                                    </div>
                                                </div>
                                            )}
                                            {currentStep === 2 && (
                                                <div className="space-y-5">
                                                    <h2 className="text-lg font-black font-outfit inline-flex items-center gap-2">
                                                        <div className="w-1 h-4 bg-primary rounded-full" />
                                                        Antécédents du Patient
                                                    </h2>
                                                    <div className="grid grid-cols-2 gap-6">
                                                        <FormSelect label="Hypertension Artérielle" options={OUI_NON} value={formData["Hypertension Artérielle"]} onChange={(v) => updateField('Hypertension Artérielle', v)} />
                                                        <FormSelect label="Diabète" options={OUI_NON} value={formData["Diabète"]} onChange={(v) => updateField('Diabète', v)} />
                                                        <FormSelect label="Maladie Cardiovasculaire" options={OUI_NON} value={formData["Maladie Cardiovasculaire"]} onChange={(v) => updateField('Maladie Cardiovasculaire', v)} />
                                                        <FormSelect label="Consommation de Tabac" options={OUI_NON} value={formData["Consommation de Tabac"]} onChange={(v) => updateField('Consommation de Tabac', v)} />
                                                    </div>
                                                </div>
                                            )}
                                            {currentStep === 3 && (
                                                <div className="space-y-5">
                                                    <h2 className="text-lg font-black font-outfit inline-flex items-center gap-2">
                                                        <div className="w-1 h-4 bg-primary rounded-full" />
                                                        Paramètres Biologiques I
                                                    </h2>
                                                    <div className="grid grid-cols-2 gap-6">
                                                        <FormInput label="Créatinine (mg/L)" type="number" value={formData["Créatinine (mg/L)"]} onChange={(v) => updateField('Créatinine (mg/L)', v)} />
                                                        <FormInput label="Urée (g/L)" type="number" value={formData["Urée (g/L)"]} onChange={(v) => updateField('Urée (g/L)', v)} />
                                                        <FormInput label="PAS (mmHg)" type="number" value={formData["Pression Artérielle Systolique (mmHg)"]} onChange={(v) => updateField('Pression Artérielle Systolique (mmHg)', v)} />
                                                        <FormInput label="PAD (mmHg)" type="number" value={formData["Pression Artérielle Diastolique (mmHg)"]} onChange={(v) => updateField('Pression Artérielle Diastolique (mmHg)', v)} />
                                                    </div>
                                                </div>
                                            )}
                                            {currentStep === 4 && (
                                                <div className="space-y-5">
                                                    <h2 className="text-lg font-black font-outfit inline-flex items-center gap-2">
                                                        <div className="w-1 h-4 bg-primary rounded-full" />
                                                        Analyses Complémentaires
                                                    </h2>
                                                    <div className="grid grid-cols-3 gap-4">
                                                        <FormInput label="Hb (g/dL)" type="number" value={formData["Hb (g/dL)"]} onChange={(v) => updateField('Hb (g/dL)', v)} />
                                                        <FormInput label="Glycémie (g/L)" type="number" value={formData["Glycémie à jeun (g/L)"]} onChange={(v) => updateField('Glycémie à jeun (g/L)', v)} />
                                                        <FormInput label="Protéinurie (g/24h)" type="number" value={formData["Protéinurie (g/24h)"]} onChange={(v) => updateField('Protéinurie (g/24h)', v)} />
                                                        <FormInput label="Albumine (g/L)" type="number" value={formData["Albumine (g/L)"]} onChange={(v) => updateField('Albumine (g/L)', v)} />
                                                        <FormInput label="Acide Urique" type="number" value={formData["Acide Urique (mg/L)"]} onChange={(v) => updateField('Acide Urique (mg/L)', v)} />
                                                        <FormInput label="Score Glasgow" type="number" value={formData["Score de Glasgow (/15)"]} onChange={(v) => updateField('Score de Glasgow (/15)', v)} />
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center px-6">
                                    <button
                                        onClick={prevStep}
                                        disabled={currentStep === 1}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-xs text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-all"
                                    >
                                        <ChevronLeft size={16} />
                                        Précédent
                                    </button>
                                    {currentStep < 4 ? (
                                        <button
                                            onClick={nextStep}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95"
                                        >
                                            Suivant
                                            <ChevronRight size={16} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="flex items-center gap-3 px-8 py-2.5 bg-success text-white rounded-xl font-bold text-xs shadow-lg shadow-success/20 hover:bg-success/90 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                                            ) : (
                                                <>
                                                    <BrainCircuit size={16} />
                                                    Lancer l'Analyse
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 5 && (
                        <motion.div
                            key="success-screen"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="max-w-2xl mx-auto w-full pt-10"
                        >
                            <div className="medical-card rounded-[3rem] p-16 text-center space-y-8 flex flex-col items-center shadow-2xl">
                                <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center text-success animate-bounce-slow">
                                    <CheckCircle2 size={64} />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-black font-outfit text-slate-900 leading-tight">Diagnostic Rénal Prêt</h2>
                                    <p className="text-slate-500 text-base font-medium leading-relaxed">
                                        Les algorithmes XGBoost ont fini de traiter les données cliniques. <br />
                                        Le rapport de risque est disponible.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setCurrentStep(6)}
                                    className="flex items-center gap-3 bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-slate-900/40 hover:scale-105 active:scale-95 transition-all group"
                                >
                                    <span>Voir le Diagnostic</span>
                                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 6 && result && (
                        <motion.div
                            key="result-view"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-10 w-full max-w-7xl mx-auto"
                        >
                            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-border shadow-sm">
                                <button onClick={handleReset} className="flex items-center gap-2 text-primary font-black hover:bg-primary/5 px-4 py-2 rounded-xl transition-all">
                                    <ChevronLeft size={20} />
                                    Nouvelle analyse
                                </button>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-muted uppercase tracking-widest">Référence patient</p>
                                        <p className="text-sm font-bold text-slate-900">REF-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                                    </div>
                                    <button className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95">
                                        <FileDown size={22} />
                                        Exporter en PDF
                                    </button>
                                </div>
                            </div>

                            <div className="medical-card rounded-2xl p-6 bg-slate-50 border border-slate-100">
                                <h2 className="text-lg font-black font-outfit text-slate-900 mb-2">Résumé du diagnostic</h2>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Le modèle a classé ce patient au <strong className="text-slate-900">{result.stage_label}</strong>.
                                    Le score de risque indique la probabilité d'évolution vers un stade sévère (stade 4 ou 5) ; plus il est bas, plus le pronostic à court terme est favorable.
                                    Ce résultat est une aide à la décision et doit être interprété par un médecin.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                                <div className="lg:col-span-4 medical-card rounded-[3rem] p-10 flex flex-col items-center justify-center text-center relative overflow-hidden bg-white">
                                    <span className={cn(
                                        "absolute top-8 right-8 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full",
                                        result.risk_score > 0.7 ? "bg-error/10 text-error" : result.risk_score > 0.4 ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                                    )}>
                                        {result.risk_score > 0.7 ? 'Risque élevé' : result.risk_score > 0.4 ? 'Risque modéré' : 'Risque faible'}
                                    </span>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Score de risque IA</p>
                                    <p className="text-[10px] text-slate-500 max-w-[200px] mb-8">
                                        Probabilité d'évolution vers un stade sévère (4 ou 5)
                                    </p>

                                    <div className="relative w-64 h-64 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90 scale-110">
                                            <circle cx="128" cy="128" r="110" stroke="#f1f5f9" strokeWidth="20" fill="transparent" />
                                            <circle
                                                cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="20" fill="transparent"
                                                className={cn(result.risk_score > 0.7 ? "text-error" : result.risk_score > 0.4 ? "text-amber-500" : "text-success")}
                                                strokeDasharray={2 * Math.PI * 110}
                                                strokeDashoffset={2 * Math.PI * 110 * (1 - result.risk_score)}
                                                strokeLinecap="round"
                                                style={{ transition: 'stroke-dashoffset 2.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
                                            />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                            <span className="text-5xl font-black font-outfit text-slate-900">{(result.risk_score * 100).toFixed(0)}%</span>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">score de risque</span>
                                        </div>
                                    </div>
                                    <div className="mt-10 bg-slate-50 px-8 py-4 rounded-3xl border border-slate-100 flex flex-col items-center gap-1">
                                        <p className="text-[10px] font-black text-muted uppercase select-none">Stade IRC prédit</p>
                                        <p className="text-xl font-black text-slate-800">{result.stage_label}</p>
                                    </div>
                                </div>

                                <div className="lg:col-span-8 space-y-8">
                                    <div className="medical-card rounded-[3rem] p-10 bg-white min-h-[400px]">
                                        <div className="mb-6 pb-6 border-b border-slate-100">
                                            <h3 className="text-xl font-black font-outfit flex items-center gap-3">
                                                <FlaskConical className="text-primary w-5 h-5" />
                                                Interprétation du modèle (SHAP)
                                            </h3>
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                                                Impact des variables sur la décision
                                            </p>
                                            <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                                                Les barres indiquent quelles variables ont le plus influencé la prédiction pour ce patient.
                                                Une valeur <span className="text-error font-semibold">positive</span> pousse vers un stade plus sévère, une valeur <span className="text-success font-semibold">négative</span> vers un stade moins sévère.
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                            {(result.top_factors || []).map((f: any, i: number) => (
                                                <div key={i} className="space-y-3 group">
                                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-wider items-baseline gap-2">
                                                        <span className="text-slate-700 group-hover:text-primary transition-colors flex-1 min-w-0 truncate" title={libelleVariable(f.feature)}>
                                                            {libelleVariable(f.feature)}
                                                        </span>
                                                        <span className={cn("shrink-0 font-bold", f.impact > 0 ? "text-error" : "text-success")}>
                                                            {f.impact > 0 ? "+" : ""}{(Number(f.impact) * 100).toFixed(1)}%
                                                        </span>
                                                    </div>
                                                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex justify-end shadow-inner">
                                                        <div
                                                            className={cn("h-full rounded-full transition-all duration-[1500ms] delay-500", f.impact > 0 ? "bg-error" : "bg-success")}
                                                            style={{ width: `${Math.min(100, Math.abs(Number(f.impact)) * 200)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {(result.top_factors || []).length === 0 && (
                                            <p className="text-sm text-slate-500 italic">Aucun détail d'interprétation disponible pour cette prédiction.</p>
                                        )}
                                    </div>

                                    <div className="medical-card rounded-[3rem] bg-slate-900 p-12 text-white relative overflow-hidden shadow-2xl">
                                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                                            <BrainCircuit size={300} />
                                        </div>
                                        <div className="relative z-10 space-y-10">
                                            <div className="flex justify-between items-center border-b border-white/10 pb-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-4 bg-primary/20 rounded-2xl backdrop-blur-xl border border-primary/20">
                                                        <Lightbulb className="w-8 h-8 text-primary shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-black font-outfit">Recommandations cliniques (IA)</h3>
                                                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] mt-1">Générées par Gemini, basées sur les standards KDIGO</p>
                                                    </div>
                                                </div>
                                                <div className="px-6 py-2.5 bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                                    Conforme KDIGO 2024
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 gap-6">
                                                {result.ai_recommendations.map((rec: string, i: number) => (
                                                    <div key={i} className="flex gap-4 items-start p-4 rounded-[1.5rem] bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-all group cursor-default">
                                                        <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0 text-white font-black text-sm group-hover:scale-110 group-hover:bg-primary/20 group-hover:text-primary transition-all duration-300">
                                                            {i + 1}
                                                        </div>
                                                        <p className="text-base leading-relaxed font-medium text-white/90">{rec}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function FormInput({ label, value, onChange, type = "text" }: { label: string, value: any, onChange: (v: any) => void, type?: string }) {
    const id = `input-${label.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}`;
    return (
        <div className="space-y-1 group">
            <label htmlFor={id} className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">{label}</label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(type === 'number' ? parseFloat(e.target.value) : e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-1.5 outline-none focus:border-primary focus:bg-white transition-all font-bold text-slate-800 shadow-sm text-sm"
                aria-label={label}
            />
        </div>
    );
}

function FormSelect({ label, options, value, onChange }: { label: string, options: string[], value: any, onChange: (v: any) => void }) {
    const id = `select-${label.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}`;
    return (
        <div className="space-y-1 group relative">
            <label htmlFor={id} className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">{label}</label>
            <div className="relative">
                <select
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-1.5 outline-none focus:border-primary focus:bg-white transition-all font-bold text-slate-800 appearance-none cursor-pointer shadow-sm text-sm"
                    aria-label={label}
                >
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-4 h-4" />
            </div>
        </div>
    );
}
