import joblib
import pandas as pd
import numpy as np
import os
from pathlib import Path

class Predictor:
    def __init__(self):
        # 1. Tenter le chargement depuis le dossier source (Dev / Prod classique)
        assets_path = Path(__file__).parent.parent.parent / "model_assets"
        
        # 2. Fallback pour Vercel / Read-only env (chargé dans /tmp par model_loader)
        if not (assets_path / "model.joblib").exists():
            print("⚠️ Modèles non trouvés dans source, vérification de /tmp/model_assets...")
            assets_path = Path("/tmp/model_assets")
        
        if not (assets_path / "model.joblib").exists():
             print("❌ CRITIQUE : Modèles introuvables. L'API ne pourra pas prédire.")
             self.model = None
             return

        self.model = joblib.load(assets_path / "model.joblib")
        self.scaler = joblib.load(assets_path / "scaler.joblib")
        self.target_encoder = joblib.load(assets_path / "target_encoder.joblib")
        
        # Source de vérité pour les colonnes attendues
        if hasattr(self.scaler, "feature_names_in_"):
            self.selected_features = list(self.scaler.feature_names_in_)
        else:
            # Fallback si l'attribut est absent (peu probable avec RobustScaler fit sur DataFrame)
            try:
                self.selected_features = joblib.load(assets_path / "selected_features.joblib")
            except:
                self.selected_features = []

    def preprocess(self, data: dict):
        # 1. Conversion en DataFrame
        df = pd.DataFrame([data])
        
        # 2. Nettoyage et Mappings Ordinal (Crucial pour la parité avec l'entraînement)
        # Gestion des typos (comme dans preprocess.py)
        if "Etat Général (EG) à l'Admission" in df.columns:
            df["Etat Général (EG) à l'Admission"] = df["Etat Général (EG) à l'Admission"].replace({'Aceptable': 'Acceptable'})
            
        ordinal_mappings = {
            'Hygiène buccodentaire': {'Mauvaise': 0, 'Insuffisante': 1, 'Acceptable': 2, 'Bonne': 3},
            'Conscience': {'Coma': 0, 'Obnubilé': 1, 'Somnolence': 2, 'Claire': 3},
            "Etat Général (EG) à l'Admission": {'Altéré': 0, 'Urémique': 1, 'Acceptable': 2, 'Bon': 3}
        }
        for col, mapping in ordinal_mappings.items():
            if col in df.columns:
                df[col] = df[col].map(mapping)

        # 3. Feature Engineering (eGFR, Ratio U/C)
        if 'Créatinine (mg/L)' in df.columns:
            df['Creat_mg_dL'] = df['Créatinine (mg/L)'] / 10.0
        if 'Urée (g/L)' in df.columns:
            df['Urea_mg_dL'] = df['Urée (g/L)'] * 100.0
        
        if 'Urea_mg_dL' in df.columns and 'Creat_mg_dL' in df.columns:
            df['Ratio_Urea_Creat'] = df['Urea_mg_dL'] / (df['Creat_mg_dL'].replace(0, np.nan))
            
        if 'Creat_mg_dL' in df.columns and 'Age' in df.columns and 'Sexe' in df.columns:
            gender_mult = 0.742 if 'f' in str(df['Sexe'][0]).lower() else 1.0
            safe_creat = max(0.1, df['Creat_mg_dL'][0])
            safe_age = max(1, df['Age'][0])
            df['eGFR_MDRD'] = 175 * (safe_creat**-1.154) * (safe_age**-0.203) * gender_mult

        # 4. One-Hot Encoding consistent avec l'entraînement
        encoded_data = pd.get_dummies(df)
        
        # 5. Réalignement strict sur les colonnes de l'entraînement
        final_df = pd.DataFrame(0, index=[0], columns=self.selected_features)
        
        for col in self.selected_features:
            if col in encoded_data.columns:
                final_df[col] = encoded_data[col]
            elif col in df.columns:
                # On ne prend ici que si c'est numérique (pour éviter les résidus string)
                val = df[col].iloc[0]
                if isinstance(val, (int, float, np.number)):
                    final_df[col] = val

        # 6. Scaling
        scaled_data = self.scaler.transform(final_df)
        return scaled_data

    def predict(self, data: dict):
        processed_data = self.preprocess(data)
        stage = self.model.predict(processed_data)[0]
        probs = self.model.predict_proba(processed_data)[0]
        
        # Risk Score (Probabilité cumulée des stades sévères 4 et 5)
        risk_score = float(np.sum(probs[4:]))
        
        labels_map = {0: "Stade 1", 1: "Stade 2", 2: "Stade 3a", 3: "Stade 3b", 4: "Stade 4", 5: "Stade 5"}
        
        return {
            "ckd_stage": int(stage),
            "stage_label": labels_map.get(int(stage), "Inconnu"),
            "risk_score": risk_score,
            "probabilities": probs.tolist()
        }

predictor = Predictor()
