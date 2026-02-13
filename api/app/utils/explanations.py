import shap
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import io
import base64

class Explainer:
    def __init__(self, model, feature_names):
        self.model = model
        self.feature_names = feature_names
        # On utilise un TreeExplainer pour les Random Forest
        self.explainer = shap.TreeExplainer(model)

    def explain_prediction(self, processed_data):
        # Calcul des valeurs SHAP pour cette instance
        shap_values = self.explainer.shap_values(processed_data)
        
        # Pour une Random Forest multiclasse avec TreeExplainer, shap_values est souvent 
        # un array de forme (n_samples, n_features, n_classes)
        prediction = self.model.predict(processed_data)[0]
        
        # Détection du format (Array 3D vs Liste d'Arraies)
        if isinstance(shap_values, list):
            # Format liste (un array par classe)
            instance_shap = shap_values[prediction][0]
        else:
            # Format Array 3D (n_samples, n_features, n_classes)
            # On prend le premier sample [0], toutes les features [:], et la classe prédite [prediction]
            instance_shap = shap_values[0, :, prediction]
        
        # On récupère les facteurs
        factors = []
        for i, val in enumerate(instance_shap):
            factors.append({
                "feature": self.feature_names[i],
                "impact": float(val),
                "importance": abs(float(val))
            })
        
        # Tri par importance absolue
        sorted_factors = sorted(factors, key=lambda x: x["importance"], reverse=True)
        
        return sorted_factors[:5] # Top 5 facteurs

    def get_explanation_chart(self, processed_data):
        # Générer un graphique (optionnel pour le frontend)
        plt.figure(figsize=(10, 6))
        shap.plots.force(self.explainer.expected_value[0], self.explainer.shap_values(processed_data)[0], matplotlib=True)
        
        buf = io.BytesIO()
        plt.savefig(buf, format='png', bbox_inches='tight')
        plt.close()
        return base64.b64encode(buf.getvalue()).decode('utf-8')
