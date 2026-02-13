import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

class Recommender:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None

    async def get_recommendations(self, patient_info: dict, stage: str, risk_score: float, top_factors: list):
        if not self.model:
            return ["API Key manquante pour les recommandations IA.", "Veuillez configurer GEMINI_API_KEY."]

        prompt = f"""
        En tant qu'expert néphrologue hospitalier, rédige 10 recommandations précises pour un patient atteint d'Insuffisance Rénale Chronique (IRC).
        
        PROFIL CLINIQUE ACTUEL:
        - Diagnostic: {stage}
        - Âge/Sexe: {patient_info.get('Age')} ans, {patient_info.get('Sexe')}
        - Score de Risque: {risk_score:.2f} (Probabilité d'évolution rapide vers un stade sévère)
        
        VALEURS BIOLOGIQUES ET PHYSIQUES CLÉS:
        - Créatinine: {patient_info.get('Créatinine (mg/L)')} mg/L
        - Urée: {patient_info.get('Urée (g/L)')} g/L
        - Tension Artérielle: {patient_info.get('Pression Artérielle Systolique (mmHg)')}/{patient_info.get('Pression Artérielle Diastolique (mmHg)')} mmHg
        - Hémoglobine: {patient_info.get('Hb (g/dL)')} g/dL
        
        FACTEURS DÉTERMINANTS (Analyse SHAP):
        Le modèle IA a identifié que les facteurs suivants pèsent le plus dans cette prédiction : 
        {', '.join([f['feature'] for f in top_factors])}.
        
        CONSIGNES DE RÉDACTION:
        1. Base tes conseils sur les standards KDIGO.
        2. Sois très concret (ex: citer des limites de sel, d'eau ou des types d'examens).
        3. Adresse-toi au patient avec professionnalisme et clarté.
        4. Fournis exactement 10 points concis, sans introduction ni conclusion.
        5. Langue: Français.
        """
        
        try:
            response = self.model.generate_content(prompt)
            # Nettoyage simple de la réponse pour obtenir une liste
            recommendations = response.text.strip().split('\n')
            # On ne garde que les lignes qui ressemblent à des items de liste
            clean_recs = [r.strip('* ').strip('- ').strip('1234567890. ') for r in recommendations if len(r) > 10]
            return clean_recs[:10]
        except Exception as e:
            return [f"Erreur lors de la génération des recommandations: {str(e)}"]

recommender = Recommender()
