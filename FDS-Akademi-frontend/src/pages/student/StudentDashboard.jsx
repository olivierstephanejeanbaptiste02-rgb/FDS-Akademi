import { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, AlertCircle, Clock, XCircle, 
  Award, ChevronDown, Link // Import de l'icône Link pour le partage
} from 'lucide-react';

export default function StudentDashboard({ viewMode }) {
  // 1. Déclaration de tous les États (States)
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [compView, setCompView] = useState('list'); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const dropdownRef = useRef(null);

  const [courses] = useState([
    { id: 1, code: 'FR', name: 'Français Appliqué', prof: 'Prof. Rémy', color: 'bg-amber-500' },
    { id: 2, code: 'MA', name: 'Mathématiques I', prof: 'Prof. Pierre', color: 'bg-blue-500' },
    { id: 3, code: 'GC', name: 'Résistance des Matériaux', prof: 'Prof. Jean', color: 'bg-emerald-500' }
  ]);
  
  const [competences, setCompetences] = useState([]);
  const [allProfessors, setAllProfessors] = useState([]);
  
  // Gestion de la sélection du professeur unique (ID + Nom)
  const [selectedProfId, setSelectedProfId] = useState('');
  const [selectedProfName, setSelectedProfName] = useState('');

  // CORRECTION CLÉ : initialisé avec la clé 'fichier' pour correspondre parfaitement au backend
  const initialCompState = { projet: '', description: '', github: '', fichier: null };
  const [newComp, setNewComp] = useState(initialCompState);

  // 2. Fonctions Utilitaires & Nettoyage
  const getCleanStatus = (stat) => {
    if (!stat) return 'en_attente';
    return stat.toLowerCase().trim();
  };

  // 3. Calculs des Métriques Éléments
  const totalComp = competences.length;
  const valides = competences.filter(c => getCleanStatus(c.status) === 'valide').length;
  const enAttente = competences.filter(c => getCleanStatus(c.status) === 'en_attente').length;
  const rejetes = competences.filter(c => getCleanStatus(c.status) === 'rejete').length;
  
  // Pourcentage central
  const progression = totalComp > 0 ? Math.round((valides / totalComp) * 100) : 0;

  // --- CALCULS POUR LE CERCLE MULTI-COULEURS ---
  const perimeter = 251.2;
  const pctValide = totalComp > 0 ? valides / totalComp : 0;
  const pctEnAttente = totalComp > 0 ? enAttente / totalComp : 0;
  const pctRejete = totalComp > 0 ? rejetes / totalComp : 0;

  const dashValide = pctValide * perimeter;
  const dashEnAttente = pctEnAttente * perimeter;
  const dashRejete = pctRejete * perimeter;

  const offsetValide = 0;
  const offsetEnAttente = -dashValide;
  const offsetRejete = -(dashValide + dashEnAttente);

  // Fonctions de récupération encapsulées pour pouvoir les ré-appeler après soumission
  const fetchMyCompetences = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/competences/my', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setCompetences(await res.json());
      }
    } catch (err) {
      console.error("Erreur récupération compétences:", err);
    }
  };

  // Gestion de la disparition automatique des alertes de statut
  useEffect(() => {
    if (status.msg) {
      const timer = setTimeout(() => setStatus({ type: '', msg: '' }), 4000);
      return () => clearTimeout(timer);
    }
  }, [status.msg]);

  // Fermer le menu déroulant si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 4. Chargement initial de l'API
  useEffect(() => {
    const fetchProfessorsForSelect = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/professors', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAllProfessors(data);
        }
      } catch (err) { 
        console.error("Erreur serveurs profs, bascule fictive:", err);
        setAllProfessors([
          { id: 5, nom: 'Jean', prenom: 'Rémy', axe: 'Civil' },
          { id: 7, nom: 'Toussaint', prenom: 'Paul', axe: 'Civil' }
        ]);
      }
    };

    fetchProfessorsForSelect();
    fetchMyCompetences();
  }, [viewMode, compView]);

  // Sélection d'un professeur
  const handleProfSelect = (id, fullName) => {
    setSelectedProfId(id);
    setSelectedProfName(fullName);
    setIsDropdownOpen(false);
  };

  // 5. Envoi via FormData (CORRIGÉ ET SYNCHRONISÉ AVEC LE BACKEND)
  const handleCompSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedProfId) {
      setStatus({ type: 'error', msg: 'Veuillez sélectionner un professeur évaluateur.' });
      return;
    }

    const formData = new FormData();
    formData.append('projet', newComp.projet);
    formData.append('description', newComp.description);
    formData.append('github', newComp.github || '');
    formData.append('professor_id', Number(selectedProfId));
    
    if (newComp.fichier) {
      formData.append('fichier', newComp.fichier); 
    }

    try {
      const response = await fetch('http://localhost:5000/api/competences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        setStatus({ type: 'success', msg: 'Compétence soumise avec succès !' });
        setNewComp(initialCompState);
        setSelectedProfId('');
        setSelectedProfName('');
        
        await fetchMyCompetences();
        setCompView('list');
      } else {
        const errData = await response.json();
        setStatus({ type: 'error', msg: errData.message || 'Erreur lors de la soumission.' });
      }
    } catch (err) { 
      console.error(err);
      setStatus({ type: 'error', msg: 'Erreur de connexion avec le serveur.' });
    }
  };

  // Fonction pour copier le lien généré pour le recruteur
  const copyShareLink = (token) => {
    const shareUrl = `${window.location.origin}/share/${token}`;
    navigator.clipboard.writeText(shareUrl);
    setStatus({ type: 'success', msg: 'Lien recruteur copié dans le presse-papiers ! 📋' });
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
        <div className="space-y-8">
          {/* Grille des compteurs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ajoutées</p><p className="text-2xl font-black text-slate-800">{totalComp}</p></div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Award size={20} /></div>
            </div>
            <div className="bg-white border p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Validées</p><p className="text-2xl font-black text-emerald-600">{valides}</p></div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle size={20} /></div>
            </div>
            <div className="bg-white border p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">En Attente</p><p className="text-2xl font-black text-amber-500">{enAttente}</p></div>
              <div className="p-3 bg-amber-50 text-amber-500 rounded-xl"><Clock size={20} /></div>
            </div>
            <div className="bg-white border p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div><p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rejetées</p><p className="text-2xl font-black text-rose-600">{rejetes}</p></div>
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><XCircle size={20} /></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Progression multi-segments */}
            <div className="bg-white border p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-6">Progression Générale</h3>
              
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
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Validé</p>
                </div>
              </div>

              <div className="flex gap-3 justify-center mt-4 text-[10px] font-semibold text-slate-500">
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"/>Valide</div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"/>Attente</div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"/>Rejeté</div>
              </div>
            </div>

            {/* Flux d'activité */}
            <div className="bg-white border p-6 rounded-2xl shadow-sm md:col-span-2">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b pb-3 mb-4">Flux d'activités récent</h3>
              <div className="space-y-3 text-xs max-h-48 overflow-y-auto pr-1">
                {competences.slice(0, 4).map((c, i) => (
                  <div key={c.id || i} className="flex justify-between items-center py-1.5 border-b">
                    <p className="font-semibold text-slate-700">Soumission : <span className="text-blue-600">"{c.projet}"</span></p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${getCleanStatus(c.status) === 'valide' ? 'bg-emerald-50 text-emerald-700' : getCleanStatus(c.status) === 'rejete' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>
                      {c.status || 'en_attente'}
                    </span>
                  </div>
                ))}
                {competences.length === 0 && <p className="text-slate-400 text-center py-4">Aucune activité pour le moment.</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'cours' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(c => (
            <div key={c.id} className="bg-white border rounded-2xl p-5 shadow-sm h-36 flex flex-col justify-between">
              <div className={`w-10 h-10 ${c.color} rounded-xl flex items-center justify-center text-white font-black text-xs`}>{c.code}</div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">{c.name}</h4>
                <p className="text-[11px] text-slate-400">{c.prof}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'competences' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Espace Portefeuille</span>
            <button onClick={() => setCompView(compView === 'list' ? 'add' : 'list')} className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm">
              {compView === 'list' ? '+ Déposer un projet' : 'Voir la liste'}
            </button>
          </div>

          {compView === 'list' ? (
            <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b font-bold text-slate-500">
                  <tr>
                    <th className="p-4">Projet</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Professeur Évaluateur</th>
                    <th className="p-4 text-center">Statut</th>
                    <th className="p-4 text-center">Partage</th> {/* Nouvelle colonne */}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {competences.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-bold text-slate-800">{c.projet}</td>
                      <td className="p-4 text-slate-500 max-w-xs truncate">{c.description}</td>
                      <td className="p-4 text-slate-600 font-medium">
                        {c.prof_nom ? `Prof. ${c.prof_prenom} ${c.prof_nom}` : (c.professeurs || 'Non assigné')}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${getCleanStatus(c.status) === 'valide' ? 'bg-emerald-50 text-emerald-700' : getCleanStatus(c.status) === 'rejete' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>
                          {c.status || 'en_attente'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {/* Condition : Afficher le bouton de lien recruteur uniquement si valide avec un token public */}
                        {getCleanStatus(c.status) === 'valide' && c.public_token ? (
                          <button 
                            onClick={() => copyShareLink(c.public_token)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl font-bold hover:bg-purple-100 transition-all text-[11px] shadow-xs"
                          >
                            <Link size={12} />
                            Lien Recruteur
                          </button>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Indisponible</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {competences.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-slate-400 font-medium">Aucun projet déposé pour le moment.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white border rounded-2xl p-6 shadow-sm max-w-2xl mx-auto">
              <form onSubmit={handleCompSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Nom du Projet / Objectif</label>
                  <input type="text" required value={newComp.projet} onChange={e => setNewComp({...newComp, projet: e.target.value})} className="w-full border p-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Description détaillée</label>
                  <textarea rows="3" required value={newComp.description} onChange={e => setNewComp({...newComp, description: e.target.value})} className="w-full border p-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Lien GitHub (Optionnel)</label>
                    <input type="url" placeholder="https://github.com/..." value={newComp.github || ''} onChange={e => setNewComp({...newComp, github: e.target.value})} className="w-full border p-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Fichier joint (Optionnel)</label>
                    <input type="file" onChange={e => setNewComp({...newComp, fichier: e.target.files[0]})} className="w-full border p-1.5 rounded-xl text-xs file:border-0 file:bg-blue-50 file:text-blue-700 file:px-2 file:rounded file:text-[10px] file:font-bold" />
                  </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-xl border relative" ref={dropdownRef}>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Assigner à un Professeur Évaluateur</label>
                  
                  <div 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-white border p-2.5 rounded-xl text-xs flex justify-between items-center cursor-pointer shadow-sm select-none hover:border-slate-400 transition-colors"
                  >
                    <span className="text-slate-600 truncate">
                      {selectedProfId ? `Sélectionné : ${selectedProfName}` : "Choisir un professeur référent..."}
                    </span>
                    <ChevronDown size={14} className={`text-slate-400 transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute left-4 right-4 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 max-h-40 overflow-y-auto space-y-1">
                      {allProfessors.length === 0 ? (
                        <p className="text-[10px] text-slate-400 text-center py-3 font-medium">Aucun professeur trouvé.</p>
                      ) : (
                        allProfessors.map(prof => {
                          const fullName = `Prof. ${prof.prenom} ${prof.nom}`;
                          return (
                            <div 
                              key={prof.id} 
                              onClick={() => handleProfSelect(prof.id, fullName)} 
                              className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors select-none ${selectedProfId === prof.id ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700'}`}
                            >
                              <span>{fullName}</span>
                              {prof.axe && (
                                <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded">
                                  {prof.axe}
                                </span>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-xl text-xs shadow-md hover:bg-blue-700 transition-colors">
                  Soumettre le projet
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}