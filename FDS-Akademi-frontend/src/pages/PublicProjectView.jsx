import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  CheckCircle, AlertCircle, FileText, 
  Award, ExternalLink, Calendar 
} from 'lucide-react';

export default function PublicProjectView() {
  const { token } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicProject = async () => {
      try {
        // ✅ URL corrigée avec "/shared/" pour correspondre exactement à la route de ton backend
        const res = await fetch(`http://localhost:5000/api/competences/shared/${token}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data);
        } else {
          const errData = await res.json();
          setError(errData.message || "Ce lien de partage est invalide ou a expiré.");
        }
      } catch (err) {
        console.error(err);
        setError("Erreur de connexion avec le serveur.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPublicProject();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
        <p className="text-xs font-semibold text-slate-500">Chargement du projet certifié...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl border shadow-sm max-w-sm w-full text-center space-y-3">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">Accès Refusé / Introuvable</h2>
          <p className="text-xs text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="bg-white border rounded-3xl shadow-xl max-w-2xl w-full overflow-hidden">
        
        {/* Bandeau supérieur de certification */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white flex items-center justify-between">
          <div className="space-y-1">
            <span className="bg-white/20 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full backdrop-blur-xs">
              Portefeuille d'Axe Certifié
            </span>
            <h1 className="text-xl font-black tracking-tight mt-1">Vérification de Compétence</h1>
          </div>
          <div className="bg-white text-emerald-600 p-3 rounded-2xl shadow-md">
            <Award size={28} />
          </div>
        </div>

        {/* Corps principal */}
        <div className="p-8 space-y-6">
          
          {/* Bloc Titre & Statut */}
          <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Nom du projet</p>
              <h2 className="text-lg font-black text-slate-800">"{project.projet}"</h2>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-bold w-fit">
              <CheckCircle size={14} className="text-emerald-600" />
              Validé par l'Institution
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Description des livrables</p>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border">
              {project.description}
            </p>
          </div>

          {/* Détails de l'évaluation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-dashed">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Professeur Référent</p>
              <p className="text-xs font-bold text-slate-700 mt-0.5">
                Prof. {project.prof_prenom} {project.prof_nom}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Date de Validation</p>
              <p className="text-xs font-semibold text-slate-600 mt-0.5 flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-400" />
                {new Date(project.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Justification / Commentaire du professeur */}
          {project.commentaire && (
            <div className="space-y-1 bg-blue-50/30 border border-blue-100 p-4 rounded-2xl">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-wider">Visa de l'évaluateur</p>
              <p className="text-xs italic text-slate-600">"{project.commentaire}"</p>
            </div>
          )}

          {/* Liens et ressources attachées */}
          <div className="space-y-2 pt-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Pièces à conviction & Liens</p>
            <div className="flex flex-wrap gap-3">
              
              {/* Bouton GitHub - Version SVG Natif pour éviter l'erreur d'export Lucide */}
              {project.github && (
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-slate-800 transition-all"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Consulter le Code (GitHub)
                  <ExternalLink size={10} className="opacity-60" />
                </a>
              )}

              {/* Bouton Document Joint */}
              {project.fichier && (
                <a 
                  href={`http://localhost:5000/uploads/${project.fichier}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold rounded-xl shadow-xs hover:bg-blue-100 transition-all"
                >
                  <FileText size={14} />
                  Ouvrir le Rapport Documentaire
                  <ExternalLink size={10} className="opacity-60" />
                </a>
              )}

              {!project.github && !project.fichier && (
                <p className="text-xs text-slate-400 italic">Aucun lien externe ou fichier requis pour ce projet.</p>
              )}

            </div>
          </div>

        </div>

        {/* Pied de page */}
        <div className="bg-slate-50 border-t px-8 py-4 text-center">
          <p className="text-[10px] text-slate-400 font-medium">
            Document authentifié , ce lien fait foi de certification académique.
          </p>
        </div>

      </div>
    </div>
  );
}