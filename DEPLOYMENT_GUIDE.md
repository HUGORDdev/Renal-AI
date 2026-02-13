# Deploy Guide: Railway (Backend) & Vercel (Frontend)

## 1️⃣ Backend (Railway) 🚂
Votre backend FastAPI sera hébergé sur Railway.

1.  Allez sur [Railway.app](https://railway.app) et connectez-vous avec GitHub.
2.  Cliquez sur **"New Project"** > **"Deploy from GitHub repo"**.
3.  Sélectionnez votre repo `Bootcamp-AMA`.
4.  Une fois le projet créé, allez dans **Settings** > **Variables** et ajoutez :
    *   `HF_TOKEN`: Votre token Hugging Face (Write).
    *   `PORT`: `8000` (Railway le détecte souvent, mais bon à savoir).
5.  Allez dans **Settings** > **General** > **Root Directory** et mettez `/` (par défaut).
    *   *Note :* Railway utilisera le fichier `nixpacks.toml` à la racine pour savoir comment lancer l'app.
6.  Une fois déployé, Railway vous donnera une URL publique (ex: `https://bootcamp-ama-production.up.railway.app`).
    *   **Copiez cette URL.**

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
