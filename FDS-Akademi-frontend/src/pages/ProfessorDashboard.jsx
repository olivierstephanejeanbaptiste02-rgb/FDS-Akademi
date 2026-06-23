import { useState, useEffect } from 'react';
import { 
  CheckCircle, AlertCircle, Clock, XCircle, 
  Award, Eye, FileText 
} from 'lucide-react';

export default function ProfessorDashboard({ viewMode }) {
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [submissions, setSubmissions] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);
  const [comment, setComment] = useState("");

  // Récupération instantanée du prof connecté depuis le localStorage
  const [profInfo] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser); 
      } catch (e) {
        console.error("Erreur de lecture du profil utilisateur", e);
      }
    }
    return { id: null, nom: '', prenom: '' };
  });

  // Disparition automatique des messages flash
  useEffect(() => {
    if (status.msg) {
      const timer = setTimeout(() => setStatus({ type: '', msg: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [status.msg]);

  // Fonction pour charger les données du tableau de bord
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const resSub = await fetch('http://localhost:5000/api/competences/professor', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (resSub.ok) {
        const filteredData = await resSub.json();
        setSubmissions(filteredData);
      } else {
        setStatus({ type: 'error', msg: 'Erreur lors de la récupération des données.' });
      }
    } catch (err) {
      console.error("Erreur de chargement des compétences:", err);
      setStatus({ type: 'error', msg: 'Impossible de joindre le serveur backend.' });
    }
  };

  // Appel de la route filtrée par le token du professeur
  useEffect(() => {
    fetchDashboardData();
  }, [viewMode]);

  // Fonction utilitaire pour normaliser le statut reçu du backend
  const getCleanStatus = (stat) => {
    if (!stat) return 'en_attente';
    return stat.toLowerCase().trim();
  };

  // --- CALCULS DES MÉTRIQUES & DU CERCLE MULTI-COULEURS ---
  const totalSub = submissions.length;
  const valides = submissions.filter(s => getCleanStatus(s.status) === 'valide').length;
  const enAttente = submissions.filter(s => getCleanStatus(s.status) === 'en_attente').length;
  const rejetes = submissions.filter(s => getCleanStatus(s.status) === 'rejete').length;
  
  // Taux central (toujours basé sur les dossiers validés)
  const progression = totalSub > 0 ? Math.round((valides / totalSub) * 100) : 0;

  const perimeter = 251.2; // 2 * Math.PI * r (r=40)

  // Ratios individuels
  const pctValide = totalSub > 0 ? valides / totalSub : 0;
  const pctEnAttente = totalSub > 0 ? enAttente / totalSub : 0;
  const pctRejete = totalSub > 0 ? rejetes / totalSub : 0;

  // Tailles de segments (Dasharray)
  const dashValide = pctValide * perimeter;
  const dashEnAttente = pctEnAttente * perimeter;
  const dashRejete = pctRejete * perimeter;

  // Décalages cumulés
  const offsetValide = 0;
  const offsetEnAttente = -dashValide;
  const offsetRejete = -(dashValide + dashEnAttente);

  // Soumission de la décision d'évaluation
  const handleEvaluate = async (subId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/competences/${subId}/evaluate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus, commentaire: comment })
      });

      if (response.ok) {
        setStatus({ type: 'success', msg: `Projet mis à jour avec le statut : ${newStatus}` });
        setComment("");
        setSelectedSub(null);
        
        // Rafraîchissement dynamique global et recalcul des compteurs
        await fetchDashboardData();
      } else {
        const errData = await response.json();
        setStatus({ type: 'error', msg: errData.message || "Erreur de traitement." });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', msg: "Erreur de connexion réseau." });
    }
  };

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto p-2">
      {status.msg && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border-l-4 shadow-sm ${status.type === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-rose-50 border-rose-500 text-rose-800'}`}>
          {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <p className="text-xs font-bold">{status.msg}</p>
        </div>
      )}

      {viewMode === 'dashboard' && (
        <>
          {/* Compteurs de cartes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Reçus</p><p className="text-2xl font-black text-slate-800">{totalSub}</p></div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Award size={20} /></div>
            </div>
            <div className="bg-white border p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Validés</p><p className="text-2xl font-black text-emerald-600">{valides}</p></div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle size={20} /></div>
            </div>
            <div className="bg-white border p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">À Évaluer</p><p className="text-2xl font-black text-amber-500">{enAttente}</p></div>
              <div className="p-3 bg-amber-50 text-amber-500 rounded-xl"><Clock size={20} /></div>
            </div>
            <div className="bg-white border p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rejetés</p><p className="text-2xl font-black text-rose-600">{rejetes}</p></div>
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><XCircle size={20} /></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cercle Multi-segments dynamique */}
            <div className="bg-white border p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center h-fit">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-6">Statistiques Projets</h3>
              
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                  
                  {dashRejete > 0 && (
                    <circle cx="50" cy="50" r="40" stroke="#f43f5e" strokeWidth="8" fill="transparent"
                      strokeDasharray={`${dashRejete} ${perimeter}`}
                      strokeDashoffset={offsetRejete}
                    />
                  )}

                  {dashEnAttente > 0 && (
                    <circle cx="50" cy="50" r="40" stroke="#f59e0b" strokeWidth="8" fill="transparent"
                      strokeDasharray={`${dashEnAttente} ${perimeter}`}
                      strokeDashoffset={offsetEnAttente}
                    />
                  )}

                  {dashValide > 0 && (
                    <circle cx="50" cy="50" r="40" stroke="#10b981" strokeWidth="8" fill="transparent"
                      strokeDasharray={`${dashValide} ${perimeter}`}
                      strokeDashoffset={offsetValide}
                    />
                  )}
                </svg>

                <div className="absolute text-center">
                  <p className="text-2xl font-black text-slate-800">{progression}%</p>
                  <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-wider">Taux Validé</p>
                </div>
              </div>

              <div className="flex gap-3 justify-center mt-4 text-[10px] font-semibold text-slate-500">
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"/>Validé</div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"/>Attente</div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"/>Rejeté</div>
              </div>
            </div>

            {/* Liste principale des dépôts */}
            <div className="bg-white border p-6 rounded-2xl shadow-sm md:col-span-2 space-y-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b pb-3 flex justify-between items-center">
                <span>Dépôts d'Étudiants Assignés</span>
                {profInfo.nom && <span className="text-[10px] text-blue-600 font-bold">Prof. {profInfo.prenom} {profInfo.nom}</span>}
              </h3>
              
              <div className="space-y-3 text-xs max-h-72 overflow-y-auto pr-1">
                {submissions.length === 0 ? (
                  <p className="text-slate-400 text-center py-12 font-medium">Aucun projet étudiant en attente pour vous.</p>
                ) : (
                  submissions.map((sub) => (
                    <div key={sub.id} className="p-3 border rounded-xl flex justify-between items-center bg-slate-50 hover:bg-slate-100/70 transition-colors">
                      <div className="space-y-1">
                        <p className="font-bold text-slate-800 text-sm">"{sub.projet}"</p>
                        <p className="text-slate-500 max-w-md truncate">{sub.description}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Étudiant ID : {sub.student_id} • Reçu le : {new Date(sub.created_at).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getCleanStatus(sub.status) === 'valide' ? 'bg-emerald-50 text-emerald-700' : getCleanStatus(sub.status) === 'rejete' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>
                          {sub.status || 'en_attente'}
                        </span>
                        <button onClick={() => setSelectedSub(sub)} className="p-1.5 bg-white border rounded-lg text-slate-600 hover:text-blue-600 shadow-sm transition-colors">
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal d'évaluation */}
      {selectedSub && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 border shadow-2xl max-w-lg w-full space-y-4">
            <div className="flex justify-between items-start border-b pb-2">
              <div>
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">Évaluation du Projet</h4>
                <p className="text-xs text-blue-600 font-bold">"{selectedSub.projet}"</p>
              </div>
              <button onClick={() => setSelectedSub(null)} className="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
            </div>

            <div className="text-xs space-y-2 text-slate-600 bg-slate-50 p-3 rounded-xl border">
              <p><strong>Description :</strong> {selectedSub.description}</p>
              {selectedSub.github && <p><strong>GitHub :</strong> <a href={selectedSub.github} target="_blank" rel="noreferrer" className="text-blue-600 underline">{selectedSub.github}</a></p>}
              
              {selectedSub.fichier && (
                <p className="flex items-center gap-1.5 mt-1.5">
                  <strong>Fichier Joint :</strong>{" "}
                  <a 
                    href={`http://localhost:5000/uploads/${selectedSub.fichier}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-bold border border-blue-200 shadow-xs hover:bg-blue-100 hover:text-blue-800 transition-all text-[11px]"
                  >
                    <FileText size={12} />
                    Ouvrir le document joint
                  </a>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Commentaire d'évaluation</label>
              <textarea rows="2" value={comment} onChange={e => setComment(e.target.value)} placeholder="Ajoutez un motif en cas de refus ou de validation..." className="w-full border p-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button onClick={() => handleEvaluate(selectedSub.id, 'rejete')} className="bg-rose-50 border border-rose-200 text-rose-700 font-bold py-2 rounded-xl text-xs hover:bg-rose-100 transition-colors">Refuser / Rejeter</button>
              <button onClick={() => handleEvaluate(selectedSub.id, 'valide')} className="bg-emerald-600 text-white font-bold py-2 rounded-xl text-xs shadow-md hover:bg-emerald-700 transition-colors">Valider le projet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}