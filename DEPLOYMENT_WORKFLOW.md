# Architecture & Workflow de Déploiement Automatisé 🚀

Ce document décrit comment nous allons automatiser la mise à jour des modèles en production dès qu'un changement est détecté dans le code d'entraînement sur GitHub.

## 🎯 L'Objectif
**Push code sur GitHub** (modifications dans `models/`) ➡ **Entraînement Auto** ➡ **Upload HF** ➡ **Redéploiement Backend**

---

## 🏗️ Architecture Technique

### 1. Composants
- **GitHub Actions** : Orchestrateur CI/CD (gratuit pour projets publics/privés limités).
- **Hugging Face Hub** : Stockage des modèles `.joblib` (gratuit).
- **Railway** : Hébergement Backend (gratuit/trial).
- **Vercel** : Hébergement Frontend (gratuit).

---

## 🔄 Le Workflow Détaillé

### Étape 1 : Push sur GitHub 💻
Vous modifiez votre script d'entraînement (`models/train.py`) ou vos données, puis vous pushez sur la branche `main`.
```bash
git add models/train.py
git commit -m "feat: improve model hyperparameters"
git push origin main
```

### Étape 2 : GitHub Action "Train & Deploy" ⚙️
Un workflow `.github/workflows/model_pipline.yml` se déclenche automatiquement.

**Jobs exécutés par GitHub :**
1.  **Checkout** : Récupère votre code.
2.  **Setup Python** : Installe Python et les dépendances (`requirements.txt`).
3.  **Entraînement** : Exécute `python models/train.py`.
    *   *Résultat* : Génère les nouveaux `.joblib` dans `backend/model_assets/`.
4.  **Upload Hugging Face** : Exécute `python scripts/upload_models.py`.
    *   *Résultat* : Les nouveaux modèles sont envoyés sur votre repo Hugging Face.
5.  **Trigger Vercel Hook** : Déclenche le redéploiement du backend sur Vercel.
    *   *Résultat* : Le backend redémarre et télécharge les nouveaux modèles.

### Étape 3 : Vérification ⚡
Une fois le déploiement Vercel terminé (quelques secondes), le backend utilise la nouvelle version de vos modèles !
2.  Au démarrage (`main.py`), le script `model_loader.py` s'exécute.
3.  Il télécharge les **derniers modèles** depuis Hugging Face Hub.
4.  L'API est prête avec la nouvelle version du modèle !

---

## 🛠️ Configuration Requise

### 1. Secrets GitHub (à configurer dans le repo)
- `HF_TOKEN`: Token d'écriture Hugging Face.
- `RENDER_DEPLOY_HOOK`: URL du webhook de déploiement Render.

### 2. Scripts à Créer
- `scripts/upload_models.py`: Pour l'upload vers HF.
- `.github/workflows/model_pipeline.yml`: Le fichier YAML du workflow.
- `backend/app/services/model_loader.py`: Pour le téléchargement au démarrage.

---

## ✅ Avantages
- **100% Automatisé** : Pas d'intervention manuelle.
- **Reproductible** : L'entraînement se fait toujours dans un environnement propre.
- **Versionné** : Hugging Face garde l'historique de tous vos modèles.
- **Gratuit** : Utilise les quotas gratuits de GitHub Actions et HF.
