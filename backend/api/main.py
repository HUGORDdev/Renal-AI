from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .schemas import PatientData, PredictionResponse, GlobalStats
from .services.predictor import predictor
from .services.recommender import recommender
from .services.analyzer import analyzer
from .utils.explanations import Explainer
import pandas as pd
import os

app = FastAPI(title="CKD Prediction API", description="API de détection et d'aide à la décision pour l'IRC au Bénin")

# Configuration CORS pour le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialisation de l'explainer SHAP (une fois le modèle chargé)
explainer = Explainer(predictor.model, predictor.selected_features)

from .services.model_loader import load_models_from_hf

@app.on_event("startup")
async def startup_event():
    # Téléchargement des modèles au démarrage si nécessaire
    load_models_from_hf()

@app.get("/health")
def health():
    return {"status": "online", "model_loaded": predictor.model is not None}

@app.post("/predict", response_model=PredictionResponse)
async def predict(patient: PatientData):
    try:
        # 1. Préparation des données (on utilise le dict avec les alias pour coller aux colonnes attendues)
        patient_dict = patient.dict(by_alias=True)
        
        # 2. Prédiction & Scoring
        result = predictor.predict(patient_dict)
        
        # 3. Interprétabilité SHAP
        processed_data = predictor.preprocess(patient_dict)
        top_factors = explainer.explain_prediction(processed_data)
        
        # 4. Recommandations IA (LLM)
        ai_recs = await recommender.get_recommendations(
            patient_info=patient_dict,
            stage=result["stage_label"],
            risk_score=result["risk_score"],
            top_factors=top_factors
        )
        
        return {
            "ckd_stage": result["ckd_stage"],
            "stage_label": result["stage_label"],
            "risk_score": result["risk_score"],
            "top_factors": top_factors,
            "ai_recommendations": ai_recs
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats")
def get_stats():
    try:
        stats = analyzer.get_global_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
