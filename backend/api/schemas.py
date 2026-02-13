from pydantic import BaseModel, Field, Extra
from typing import Optional, List

class PatientData(BaseModel):
    # Démographiques & Géo
    Age: float = Field(..., ge=0, le=120)
    Sexe: str
    Nationalite: Optional[str] = Field(None, alias="Nationalité")
    Profession: Optional[str] = None
    Situation_Matrimoniale: Optional[str] = Field(None, alias="Situation Matrimoniale")
    Departement: Optional[str] = Field(None, alias="Adresse (Département)")
    
    # Antécédents & Mode de Vie
    HTA: str = Field(..., alias="Hypertension Artérielle")
    Diabete: str = Field(..., alias="Diabète")
    Tabac: Optional[str] = Field(None, alias="Consommation de Tabac")
    Alcool: Optional[str] = Field(None, alias="Consommation d'Alcool")
    Alimentation: Optional[str] = Field(None, alias="Alimentation") # Pimenté, Salé etc
    
    # Paramètres Physiques
    Temp: Optional[float] = Field(None, alias="Température (C°)")
    Pouls: Optional[int] = Field(None, alias="Pouls (bpm)")
    PAS: Optional[float] = Field(None, alias="Pression Artérielle Systolique (mmHg)")
    PAD: Optional[float] = Field(None, alias="Pression Artérielle Diastolique (mmHg)")
    Poids: Optional[float] = Field(None, alias="Poids (Kg)")
    Taille: Optional[float] = Field(None, alias="Taille (m)")
    Etat_General: Optional[str] = Field(None, alias="Etat Général (EG) à l'Admission")
    Conscience: Optional[str] = Field(None, alias="Conscience")
    Glasgow: Optional[float] = Field(None, alias="Score de Glasgow (/15)")
    
    # Signes Cliniques (Exemples majeurs)
    Oedemes: Optional[str] = Field(None, alias="Oedèmes")
    Pales_Muq: Optional[str] = Field(None, alias="Pâleur conjonctivale et muqueuse")
    
    # Biologie Sanguine
    Creatinine: float = Field(..., alias="Créatinine (mg/L)")
    Uree: float = Field(..., alias="Urée (g/L)")
    Hb: Optional[float] = Field(None, alias="Hb (g/dL)")
    GB: Optional[float] = Field(None, alias="GB (/mm3)")
    Plaquettes: Optional[float] = Field(None, alias="Plaquettes (/mm3)")
    Glycemie: Optional[float] = Field(None, alias="Glycémie à jeun (g/L)")
    Calcium: Optional[float] = Field(None, alias="Ca^2+ (meq/L)")
    Acide_Urique: Optional[float] = Field(None, alias="Acide Urique (mg/L)")
    
    # Biologie Urinaire
    Proteinurie: Optional[float] = Field(None, alias="Protéinurie (g/24h)")
    Albumine: Optional[float] = Field(None, alias="Albumine (g/L)")

    class Config:
        extra = Extra.allow # Permet d'envoyer d'autres champs sans erreur
        allow_population_by_field_name = True

class PredictionResponse(BaseModel):
    ckd_stage: int
    stage_label: str
    risk_score: float
    top_factors: List[dict]
    ai_recommendations: List[str]

class GlobalStats(BaseModel):
    total_patients: int
    stage_distribution: dict
    avg_egfr: float
    major_risk_factors: List[str]
