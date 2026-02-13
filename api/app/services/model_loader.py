import os
from huggingface_hub import hf_hub_download
from pathlib import Path
import shutil

# Configuration
REPO_ID = "username/renal-ai-models" # À REMPLACER PAR LE MEME REPO QUE UPLOAD
MODEL_DIR = Path(__file__).parent.parent.parent / "model_assets"
FILES_TO_DOWNLOAD = ["model.joblib", "scaler.joblib", "target_encoder.joblib"]

def load_models_from_hf():
    """
    Télécharge les modèles depuis Hugging Face Hub.
    Supporte Vercel (read-only system) en utilisant /tmp.
    """
    # Détection de l'environnement Vercel ou Fallback si non inscriptible
    target_dir = MODEL_DIR
    
    # Si le dossier n'existe pas et qu'on ne peut pas le créer (read-only), on utilise /tmp
    if not os.path.exists(MODEL_DIR):
        try:
            os.makedirs(MODEL_DIR, exist_ok=True)
        except OSError:
            print("⚠️ Environnement Read-Only détecté (ex: Vercel). Utilisation de /tmp...")
            target_dir = Path("/tmp/model_assets")
            os.makedirs(target_dir, exist_ok=True)

    print(f"🔄 Vérification des modèles dans {target_dir}...")
    
    try:
        files_paths = {}
        for filename in FILES_TO_DOWNLOAD:
            local_path = target_dir / filename
            if not local_path.exists():
                print(f"⬇️ Téléchargement confidentiel de {filename} depuis HF...")
                # On utilise hf_hub_download qui gère le cache
                downloaded_path = hf_hub_download(
                    repo_id=REPO_ID,
                    filename=filename,
                    local_dir=target_dir,
                    local_dir_use_symlinks=False
                )
                print(f"✅ {filename} téléchargé.")
            else:
                print(f"✨ {filename} présent localement.")
            files_paths[filename] = local_path
            
        return target_dir # Retourne le chemin final utilisé
                
    except Exception as e:
        print(f"⚠️ Attention : Impossible de télécharger les modèles depuis HF ({str(e)})")
        # On retourne le dossier par défaut même si vide/incomplet, le Predictor gérera l'erreur
        return target_dir

if __name__ == "__main__":
    load_models_from_hf()
