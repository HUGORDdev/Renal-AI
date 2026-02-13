# Deploy Guide: Railway (Backend) & Vercel (Frontend)

## 1️⃣ Backend (Vercel) ▲
Votre backend FastAPI sera hébergé sur Vercel (via Serverless Functions).

1.  Allez sur [Vercel.com](https://vercel.com) et connectez-vous.
2.  **Add New...** > **Project** > Importez `Bootcamp-AMA`.
3.  **Configuration du Projet** :
    *   **Framework Preset**: Other
    *   **Root Directory**: `backend` (Cliquez sur Edit à côté de Root Directory).
4.  **Environment Variables** :
    *   `HF_TOKEN`: Votre token Hugging Face (Write).
5.  **Deploy**.

### Automatisation (Deploy Hook) 🪝
Pour que le backend se redéploie automatiquement après un ré-entraînement du modèle :

1.  Allez dans **Settings** (du projet Backend) > **Git** > **Deploy Hooks**.
2.  Créez un hook nommé `GitHub Actions`.
3.  Copiez l'URL (ex: `https://api.vercel.com/v1/integrations/deploy/prj_.../hook_...`).
4.  Allez sur GitHub > Settings > Secrets > Actions.
5.  Ajoutez un secret `VERCEL_DEPLOY_HOOK` avec cette URL.

## 2️⃣ Frontend (Vercel) ▲
Votre frontend Next.js sera hébergé sur Vercel.

1.  Allez sur [Vercel.com](https://vercel.com) et connectez-vous avec GitHub.
2.  Cliquez sur **"Add New..."** > **"Project"**.
3.  Importez le repo `Bootcamp-AMA`.
4.  Dans **Framework Preset**, choisissez **Next.js**.
5.  Dans **Root Directory**, cliquez sur "Edit" et sélectionnez le dossier `frontend`.
6.  Dans **Environment Variables**, ajoutez :
    *   `NEXT_PUBLIC_API_URL`: Collez l'URL de votre backend Railway (ex: `https://bootcamp-ama-production.up.railway.app`).
        *   *Attention : pas de slash `/` à la fin.*
7.  Cliquez sur **Deploy**.

## 3️⃣ Streamlit (Streamlit Cloud) 🎈
Le plus simple pour Streamlit est d'utiliser leur cloud gratuit.

1.  Allez sur [share.streamlit.io](https://share.streamlit.io/).
2.  Connectez votre compte GitHub.
3.  Cliquez sur **"New app"**.
4.  Sélectionnez le repo, la branche `main`.
5.  **Main file path** : `frontend_streamlit/app.py`.
6.  Cliquez sur **"Advanced settings"** pour les secrets :
    ```toml
    [general]
    backend_url = "https://bootcamp-ama-production.up.railway.app"
    ```
7.  Cliquez sur **Deploy**.

## 🚀 Résumé des URLs
Une fois tout déployé, vous aurez :
- **API** : `https://...railway.app/docs` (Swagger)
- **Site Web** : `https://...vercel.app`
- **Outil Expert** : `https://...streamlit.app`
