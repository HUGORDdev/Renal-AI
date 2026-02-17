import streamlit as st
import requests
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from streamlit_folium import st_folium
import folium

# Configuration de la page
st.set_page_config(
    page_title="CKD-Predict Expert",
    page_icon="🩺",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Style CSS personnalisé pour une UI "Premium"
st.markdown("""
<style>
    .main {
        background-color: #0e1117;
    }
    [data-testid="stMetricValue"] {
        font-size: 2.5rem;
        color: #00ffcc;
        font-weight: 700;
    }
    [data-testid="stMetricLabel"] {
        color: #ffffff;
        font-size: 1.2rem;
    }
    .result-card {
        background-color: #1e2130;
        padding: 2rem;
        border-radius: 15px;
        border-left: 5px solid #00ffcc;
        margin-bottom: 2rem;
    }
    .stInfo {
        background-color: #1e2130;
        border: 1px solid #3e4150;
    }
</style>
""", unsafe_allow_html=True)

# Mapping des noms techniques vers noms lisibles
FEATURE_MAP = {
    'Creat_mg_dL': 'Créatinine (mg/dL)',
    'Urea_mg_dL': 'Urée (mg/dL)',
    'Ratio_Urea_Creat': 'Ratio Urée/Créatinine',
    'eGFR_MDRD': 'DFG (eGFR MDRD)',
    'Hte (%)': 'Hématocrite (%)',
    'Hb (g/dL)': 'Hémoglobine (g/dL)',
    'Ca^2+ (meq/L)': 'Calcium Ionisé',
    'Score de Glasgow (/15)': 'Score de Glasgow (État de conscience)',
    'PAS': 'Pression Artérielle Systolique (mmHg)',
    'PAD': 'Pression Artérielle Diastolique (mmHg)',
    'Hte_val': 'Hématocrite (%)',
    'Age': 'Âge du Patient'
}

def get_readable_name(name):
    # Gérer les colonnes One-Hot (ex: Sexe_Masculin)
    for tech, readable in FEATURE_MAP.items():
        if name.startswith(tech):
            return readable
    return name.replace('_', ' ')

# URL du Backend
try:
    BACKEND_URL = st.secrets["general"]["backend_url"]
except:
    BACKEND_URL = "http://localhost:8000"  # Fallback local

# Sidebar
st.sidebar.title("🩺 CKD-Predict Expert")
st.sidebar.markdown("---")
menu = st.sidebar.radio(
    "Navigation",
    ["Diagnostic Patient", "Insights Santé Publique", "Cartographie", "Configuration"]
)

st.sidebar.markdown("---")
st.sidebar.info("Outil d'aide à la décision pour la Maladie Rénale Chronique.")

# --- PAGE 1: Diagnostic Patient ---
if menu == "Diagnostic Patient":
    st.header("🔍 Formulaire de Diagnostic Exhaustif (Expert)")
    st.info("Remplissez toutes les sections pour une précision maximale. L'IA ne fera aucune supposition.")
    
    with st.form("patient_form_exhaustive"):
        tab1, tab2, tab3, tab4, tab5 = st.tabs([
            "👤 Général", 
            "🥗 Mode de Vie", 
            "🏥 Antécédents", 
            "🩺 Examen Physique", 
            "🔬 Biologie"
        ])
        
        with tab1:
            col1, col2 = st.columns(2)
            with col1:
                age = st.number_input("Âge du patient", min_value=0, max_value=120, value=45)
                sexe = st.selectbox("Sexe", ["Masculin", "Féminin"])
                nationalite = st.text_input("Nationalité", value="Béninoise")
            with col2:
                dept = st.selectbox("Adresse (Département)", ["Littoral", "Atlantique", "Ouémé", "Zou", "Borgou", "Mono", "Couffo", "Alibori", "Atacora", "Donga", "Collines", "Plateau"])
                profession = st.text_input("Profession", value="Employé")
                matrimoniale = st.selectbox("Situation Matrimoniale", ["Marié(e)", "Célibataire", "Veuf(ve)", "Divorcé(e)"])
        
        with tab2:
            st.subheader("Habitudes & Environnement")
            c1, c2, c3 = st.columns(3)
            with c1:
                tabac = st.selectbox("Consommation de Tabac", ["Non", "Oui"])
                alcool = st.selectbox("Consommation d'Alcool", ["Non", "Oui"])
            with c2:
                sel = st.selectbox("Habitude : Salé", ["Non", "Oui"])
                piment = st.selectbox("Habitude : Pimenté", ["Non", "Oui"])
            with c3:
                viande = st.selectbox("Habitude : Viande Rouge", ["Non", "Oui"])
        
        with tab3:
            st.subheader("Profil de Risque Médical")
            h1, h2 = st.columns(2)
            with h1:
                hta = st.selectbox("Hypertension Artérielle (HTA)", ["Oui", "Non"])
                diabete = st.selectbox("Diabète", ["Oui", "Non"])
            with h2:
                cardio = st.selectbox("Maladie Cardiovasculaire", ["Non", "Oui"])
        
        with tab4:
            st.subheader("Paramètres Vitaux & Signes")
            p1, p2, p3 = st.columns(3)
            with p1:
                pas = st.number_input("PAS (mmHg)", min_value=0.0, value=120.0)
                pad = st.number_input("PAD (mmHg)", min_value=0.0, value=80.0)
                pouls = st.number_input("Pouls (bpm)", min_value=0, value=75)
            with p2:
                poids = st.number_input("Poids (Kg)", min_value=0.0, value=70.0)
                taille = st.number_input("Taille (m)", min_value=0.0, value=1.70)
                temp = st.number_input("Température (°C)", min_value=30.0, value=37.0)
            with p3:
                eg = st.selectbox("Etat Général (EG)", ["Bon", "Acceptable", "Altéré", "Urémique"])
                oedemes = st.selectbox("Oedèmes", ["Non", "Oui"])
                conscience = st.selectbox("Conscience", ["Claire", "Somnolence", "Obnubilé", "Coma"])

            # Calculateur de Glasgow
            with st.expander("🩺 Aide au calcul du Score de Glasgow"):
                g1, g2, g3 = st.columns(3)
                yeux = g1.radio("Yeux", [4, 3, 2, 1], format_func=lambda x: {4: "Spontanée", 3: "Au bruit", 2: "À la douleur", 1: "Aucune"}[x])
                verbal = g2.radio("Verbal", [5, 4, 3, 2, 1], format_func=lambda x: {5: "Orienté", 4: "Confus", 3: "Inapproprié", 2: "Incompréhensible", 1: "Aucun"}[x])
                moteur = g3.radio("Moteur", [6, 5, 4, 3, 2, 1], format_func=lambda x: {6: "Obéit", 5: "Localise", 4: "Évitement", 3: "Flexion", 2: "Extension", 1: "Aucun"}[x])
                glasgow_total = yeux + verbal + moteur
                st.write(f"**Score de Glasgow calculé : {glasgow_total}/15**")
        
        with tab5:
            st.subheader("Examens Biologiques")
            b1, b2, b3 = st.columns(3)
            with b1:
                st.write("**Sang**")
                creatinine = st.number_input("Créatinine (mg/L)", min_value=0.0, value=12.0)
                uree = st.number_input("Urée (g/L)", min_value=0.0, value=0.45)
                hb = st.number_input("Hémoglobine (g/dL)", min_value=0.0, value=13.5)
            with b2:
                st.write("**Ions & Autres**")
                glycemie = st.number_input("Glycémie (g/L)", min_value=0.0, value=1.0)
                calcium = st.number_input("Calcium Ionisé (meq/L)", min_value=0.0, value=4.5)
                acide_urique = st.number_input("Acide Urique (mg/L)", min_value=0.0, value=50.0)
            with b3:
                st.write("**Urines**")
                proteinurie = st.number_input("Protéinurie (g/24h)", min_value=0.0, value=0.0)
                albumine_u = st.number_input("Albumine (g/L)", min_value=0.0, value=0.0)

        submitted = st.form_submit_button("Lancer l'Analyse Diagnostique Complète 🚀")

    if submitted:
        # Construction du payload exhaustif
        payload = {
            "Age": age,
            "Sexe": sexe,
            "Nationalité": nationalite,
            "Profession": profession,
            "Situation Matrimoniale": matrimoniale,
            "Adresse (Département)": dept,
            "Consommation de Tabac": tabac,
            "Consommation d'Alcool": alcool,
            "Habitudes Alimentaires/Sel": sel,
            "Habitudes Alimentaires/Piment": piment,
            "Habitudes Alimentaires/Viande Rouge": viande,
            "Hypertension Artérielle": hta,
            "Diabète": diabete,
            "Maladie Cardiovasculaire": cardio,
            "Pression Artérielle Systolique (mmHg)": pas,
            "Pression Artérielle Diastolique (mmHg)": pad,
            "Pouls (bpm)": pouls,
            "Poids (Kg)": poids,
            "Taille (m)": taille,
            "Température (C°)": temp,
            "Etat Général (EG) à l'Admission": eg,
            "Oedèmes": oedemes,
            "Conscience": conscience,
            "Score de Glasgow (/15)": glasgow_total,
            "Créatinine (mg/L)": creatinine,
            "Urée (g/L)": uree,
            "Hb (g/dL)": hb,
            "Glycémie à jeun (g/L)": glycemie,
            "Ca^2+ (meq/L)": calcium,
            "Acide Urique (mg/L)": acide_urique,
            "Protéinurie (g/24h)": proteinurie,
            "Albumine (g/L)": albumine_u
        }
        
        try:
            with st.spinner("Analyse Clinique en cours par l'IA..."):
                response = requests.post(f"{BACKEND_URL}/predict", json=payload)
                
                if response.status_code == 200:
                    res = response.json()
                    st.success("Verdict Médical Généré")
                    
                    # --- AFFICHAGE RESULTATS ---
                    st.markdown(f"""
                    <div class="result-card">
                        <h2 style='color: white; margin-bottom: 0;'>Verdict : <span style='color: #00ffcc;'>{res["stage_label"]}</span></h2>
                        <p style='color: #a0a0a0;'>Score de risque calculé sur l'ensemble du profil : <b>{res["risk_score"]*100:.1f}%</b>.</p>
                    </div>
                    """, unsafe_allow_html=True)
                    
                    c1, c2 = st.columns([1, 2])
                    with c1:
                        st.metric("Risque Global", f"{res['risk_score']*100:.1f}%")
                        fig_risk = go.Figure(go.Indicator(
                            mode = "gauge+number",
                            value = res["risk_score"] * 100,
                            gauge = {
                                'axis': {'range': [None, 100], 'tickcolor': "white"},
                                'bar': {'color': "#00ffcc"},
                                'bgcolor': "#1e2130",
                                'steps' : [
                                    {'range': [0, 30], 'color': "rgba(0, 255, 0, 0.2)"},
                                    {'range': [30, 70], 'color': "rgba(255, 165, 0, 0.2)"},
                                    {'range': [70, 100], 'color': "rgba(255, 0, 0, 0.2)"}
                                ]
                            }
                        ))
                        fig_risk.update_layout(paper_bgcolor='rgba(0,0,0,0)', font={'color': "white"}, height=300)
                        st.plotly_chart(fig_risk, use_container_width=True)

                    with c2:
                        st.subheader("🧠 Facteurs Prédominants")
                        factors_df = pd.DataFrame(res["top_factors"])
                        factors_df['readable_feature'] = factors_df['feature'].apply(get_readable_name)
                        fig_shap = px.bar(
                            factors_df, x='impact', y='readable_feature', orientation='h',
                            color='impact', color_continuous_scale='RdYlGn_r'
                        )
                        fig_shap.update_layout(paper_bgcolor='rgba(0,0,0,0)', font={'color': "white"}, xaxis_title="← Protege | Aggrave →")
                        st.plotly_chart(fig_shap, use_container_width=True)

                    # Synthèse et RECS
                    st.markdown("#### 📝 Synthèse de l'Interprétation")
                    top_aggravant = factors_df[factors_df['impact'] > 0].sort_values(by='impact', ascending=False).iloc[0] if not factors_df[factors_df['impact'] > 0].empty else None
                    if top_aggravant is not None:
                        st.warning(f"**Alerte :** Le paramètre **{top_aggravant['readable_feature']}** est l'aggravateur principal.")
                    
                    st.divider()
                    st.subheader("🩺 Recommandations de l'IA (Basées sur le profil complet)")
                    for i, rec in enumerate(res["ai_recommendations"]):
                        st.info(f"**{i+1}.** {rec}")
                else:
                    st.error(f"Erreur : {response.text}")
        except Exception as e:
            st.error(f"Erreur de communication : {str(e)}")

# --- PAGE 2: Insights ---
elif menu == "Insights Santé Publique":
    st.header("📊 Dashboard de Santé Publique")
    try:
        with st.spinner("Chargement des statistiques hospitalières..."):
            response = requests.get(f"{BACKEND_URL}/stats")
            if response.status_code == 200:
                stats = response.json()
                
                # Métriques Clés
                m1, m2, m3 = st.columns(3)
                m1.metric("Total Patients Étudiés", stats.get("total_patients", 0))
                
                risk_factors = stats.get("major_risk_factors", [])
                top_risk = risk_factors[0] if risk_factors else "N/A"
                m2.metric("Facteur de Risque n°1", top_risk)
                
                m3.metric("Genre Dominant", "Masculin") # Exemple
                
                # Graphiques
                g1, g2 = st.columns(2)
                
                with g1:
                    st.subheader("Répartition des Stades IRC")
                    dist = stats.get("stage_distribution", {})
                    if dist:
                        fig_dist = px.pie(names=list(dist.keys()), values=list(dist.values()), hole=0.4)
                        fig_dist.update_layout(paper_bgcolor='rgba(0,0,0,0)', font={'color': "white"})
                        st.plotly_chart(fig_dist, use_container_width=True)
                    else:
                        st.info("Données de répartition non disponibles.")
                
                with g2:
                    st.subheader("Facteurs Comorbides")
                    # Exemple de données simulées pour le graphique
                    data = {"Facteur": ["HTA", "Diabète", "Tabac", "Alcool"], "Fréquence": [72, 45, 12, 8]}
                    fig_bar = px.bar(data, x="Facteur", y="Fréquence", color="Facteur")
                    fig_bar.update_layout(paper_bgcolor='rgba(0,0,0,0)', font={'color': "white"})
                    st.plotly_chart(fig_bar, use_container_width=True)
            else:
                st.error(f"Erreur Backend ({response.status_code}) : {response.text}")
                
    except Exception as e:
        st.error(f"Erreur de connexion : {str(e)}")
        st.warning("Assurez-vous que le serveur Backend (FastAPI) est bien lancé sur le port 8000.")

# --- PAGE 3: Cartographie ---
elif menu == "Cartographie":
    st.header("🗺️ Cartographie des Zones à Risque")
    st.info("Données géographiques basées sur les patients suspects de CKD.")
    
    # Simuler une carte du Bénin
    m = folium.Map(location=[9.3077, 2.3158], zoom_start=7)
    
    # Ajouter des points de test (Cotonou, Parakou, Porto-Novo)
    points = [
        {"name": "Cotonou", "coords": [6.3654, 2.4183], "patients": 150, "risk": "Élevé"},
        {"name": "Parakou", "coords": [9.3372, 2.6303], "patients": 45, "risk": "Moyen"},
        {"name": "Abomey", "coords": [7.1855, 1.9912], "patients": 30, "risk": "Faible"}
    ]
    
    for p in points:
        color = "red" if p["risk"] == "Élevé" else "orange" if p["risk"] == "Moyen" else "green"
        folium.CircleMarker(
            location=p["coords"],
            radius=p["patients"]/5,
            popup=f"{p['name']} : {p['patients']} patients (Risque {p['risk']})",
            color=color,
            fill=True,
            fill_color=color
        ).add_to(m)
    
    st_folium(m, width=1000, height=500)

elif menu == "Configuration":
    st.header("⚙️ Paramètres")
    st.write("URL du Backend :", BACKEND_URL)
    if st.button("Vérifier Connexion"):
        try:
            resp = requests.get(f"{BACKEND_URL}/health")
            st.json(resp.json())
        except:
            st.error("Backend non joignable")
