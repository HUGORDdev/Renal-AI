# 🏥 CKD-Predict : Intelligence Artificielle au Service de la Néphrologie

**CKD-Predict** est une plateforme web "premium" conçue pour la détection précoce, le scoring de risque et le suivi cartographique de la **Maladie Rénale Chronique (IRC)** au Bénin. Développé dans le cadre du **Bootcamp AMA**, cet outil exploite la puissance de l'IA pour transformer des données cliniques complexes en insights actionnables pour les médecins.

---

## ✨ Fonctionnalités Clés

### 🧠 Diagnostic IA & Interprétabilité (SHAP)
- **Modèle XGBoost v2** : Analyse de plus de 30 variables cliniques et biologiques pour prédire le stade de l'IRC avec une haute précision.
- **Explicabilité SHAP** : Visualisation en temps réel de l'impact de chaque facteur (âge, créatinine, HTA, etc.) sur le diagnostic individuel.
- **Scoring de Risque** : Calcul d'un score de risque d'évolution vers un stade terminal.

### 📋 Assistant Médical IA
- **Protocole Expert** : Intégration de Gemini AI pour générer des recommandations cliniques personnalisées basées sur les standards **KDIGO**.
- **Rapport de Diagnostic** : (En cours) Génération de rapports PDF complets pour l'intégration dans le dossier patient.

### 📊 Dashboard de Santé Publique
- **Visualisation des Datas** : Indicateurs clés (KPIs) basés sur le dataset réel du **CNHU/HKM**.
- **Tendances de Risque** : Analyse de la prévalence des facteurs de risque (Hypertension, Diabète) au sein de la cohorte.

### 🗺️ Cartographie Géo-Médicale
- **Suivi Spatial** : Visualisation interactive des zones à haute prévalence au Bénin par département.
- **Priorisation Sanitaire** : Outil d'aide à la décision pour les autorités de santé publique afin de cibler les interventions de prévention.

---

## 🛠️ Stack Technique

- **Frontend** : [Next.js 15](https://nextjs.org/) (App Router), TypeScript.
- **Design & UI** : [Tailwind CSS](https://tailwindcss.com/) pour une esthétique "Glassmorphism" premium.
- **Animations** : [Framer Motion](https://www.framer.com/motion/) pour des transitions fluides.
- **Cartographie** : [Leaflet](https://leafletjs.org/) / OpenStreetMap.
- **Backend API** : [FastAPI](https://fastapi.tiangolo.com/) (Python).
- **IA/ML** : XGBoost, SHAP, Scikit-learn, Google Gemini API.

---

## 🚀 Installation & Lancement

### Prérequis
- Node.js 18+
- Un backend FastAPI fonctionnel sur `localhost:8000`

### Étapes
1. Cloner le repository.
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Lancer le serveur de développement :
   ```bash
   npm run dev
   ```
4. Accéder à l'application sur [http://localhost:3000](http://localhost:3000).

---

## 📝 Contexte & Données
Ce projet utilise les données de santé anonymisées provenant du dataset du **Centre National Hospitalier et Universitaire Hubert Koutoukou Maga (CNHU-HKM)** de Cotonou.

> [!IMPORTANT]
> CKD-Predict est un outil d'aide à la décision et ne remplace en aucun cas l'expertise clinique d'un médecin néphrologue.

---
*Réalisé avec ❤️ pour le Hackathon IA - Cohorte 1 AMA .*
