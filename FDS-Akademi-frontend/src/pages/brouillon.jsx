import { useState, useEffect } from 'react';
import { 
  CheckCircle, AlertCircle, Clock, XCircle, 
  Award, BarChart3, ChevronDown 
} from 'lucide-react';

export default function StudentDashboard({ viewMode }) {
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [compView, setCompView] = useState('list'); // 'list' ou 'add'
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // État pour ouvrir/fermer le menu déroulant

  // États des données
  const [courses] = useState([
    { id: 1, code: 'FR', name: 'Français Appliqué', prof: 'Prof. Rémy', color: 'bg-amber-500' },
    { id: 2, code: 'MA', name: 'Mathématiques I', prof: 'Prof. Pierre', color: 'bg-blue-500' },
    { id: 3, code: 'GC', name: 'Résistance des Matériaux', prof: 'Prof. Jean', color: 'bg-emerald-500' }
  ]);
  
  const [competences, setCompetences] = useState([]);
  const [allProfessors, setAllProfessors] = useState([]);
  const [selectedProfs, setSelectedProfs] = useState([]);

  const initialCompState = { projet: '', description: '', github: '', file: null };
  const [newComp, setNewComp] = useState(initialCompState);

  const getCleanStatus = (stat) => {
    if (!stat) return 'en attente';
    return stat.toLowerCase().trim();
  };

  // Calculs des compteurs
  const totalComp = competences.length;
  const valides = competences.filter(c => getCleanStatus(c.status) === 'valide' || getCleanStatus(c.status) === 'validé').length;
  const enAttente = competences.filter(c => getCleanStatus(c.status) === 'en attente' || getCleanStatus(c.status) === 'en_attente').length;
  const rejetes = competences.filter(c => getCleanStatus(c.status) === 'rejete' || getCleanStatus(c.status) === 'rejeté').length;
  const progression = totalComp > 0 ? Math.round((valides / totalComp) * 100) : 0;

  useEffect(() => {
    const fetchMyCompetences = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/competences/my', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCompetences(data);
        }
      } catch (err) {
        console.error("Erreur compétences:", err);
      }
    };

    const fetchProfessorsForSelect = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/professors', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Filtrage rendu plus tolérant aux majuscules/minuscules et espaces
          const filtered = data.filter(p => {
            const axeClean = p.axe ? p.axe.toLowerCase().trim() : '';
            return axeClean === 'civil' || axeClean === 'tous les axes' || axeClean === 'tous les niveaux';
          });
          setAllProfessors(filtered);
        }
      } catch (err) { 
        console.error("Erreur chargement professeurs, bascule sur données fictives:", err);
        setAllProfessors([
          { id: 10, nom: 'Marc', prenom: 'Jean', axe: 'Civil' },
          { id: 11, nom: 'Marie', prenom: 'Pierre', axe: 'Tous les axes' }
        ]);
      }
    };

    fetchProfessorsForSelect();
    fetchMyCompetences();
  }, [viewMode]);

  const handleProfCheckboxChange = (profName) => {
    if (selectedProfs.includes(profName)) {
      setSelectedProfs(selectedProfs.filter(p => p !== profName));
    } else {
      if (selectedProfs.length >= 3) {
        setStatus({ type: 'error', msg: '3 professeurs au maximum !' });
        return;
      }
      setSelectedProfs([...selectedProfs, profName]);
    }
  };

  const handleCompSubmit = async (e) => {
    e.preventDefault();
    if (selectedProfs.length === 0) {
      setStatus({ type: 'error', msg: 'Veuillez sélectionner au moins un professeur.' });
      return;
    }

    const payload = {
      projet: newComp.projet,
      description: newComp.description,
      github: newComp.github || null,
      fichier: newComp.file ? newComp.file.name : null,
      professeurs: selectedProfs.join(', ')
    };

    try {
      const response = await fetch('http://localhost:5000/api/competences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setStatus({ type: 'success', msg: 'Compétence soumise avec succès !' });
        setNewComp(initialCompState);
        setSelectedProfs([]);
        setCompView('list');
        
        // Rafraîchir la liste après soumission
        const res = await fetch('http://localhost:5000/api/competences/my', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) setCompetences(await res.json());
      }
    } catch (err) { 
      console.error(err);
      setStatus({ type: 'error', msg: 'Erreur de connexion avec le serveur.' });
    }
  };

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto">
      {status.msg && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border-l-4 shadow-sm ${status.type === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-rose-50 border-rose-500 text-rose-800'}`}>
          {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <p className="text-xs font-bold">{status.msg}</p>
        </div>
      )}

      {/* VIEW 1 : DASHBOARD */}
      {viewMode === 'dashboard' && (
        <div className="space-y-8">
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
            <div className="bg-white border p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center text-center">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-6">Progression Générale</h3>
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                  <circle cx="50" cy="50" r="40" stroke="#10b981" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * progression) / 100} strokeLinecap="round" />
                </svg>
                <div className="absolute text-center">
                  <p className="text-2xl font-black text-slate-800">{progression}%</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Validé</p>
                </div>
              </div>
            </div>

            <div className="bg-white border p-6 rounded-2xl shadow-sm md:col-span-2">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b pb-3 mb-4 flex items-center gap-2">Flux d'activités récent</h3>
              <div className="space-y-3 text-xs max-h-48 overflow-y-auto pr-1">
                {competences.slice(0, 4).map((c, i) => (
                  <div key={c.id || i} className="flex justify-between items-center py-1.5 border-b">
                    <p className="font-semibold text-slate-700">Soumission : <span className="text-blue-600">"{c.projet}"</span></p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-slate-100 text-slate-700">{c.status || 'En attente'}</span>
                  </div>
                ))}
                {competences.length === 0 && <p className="text-slate-400 text-center py-4">Aucune activité.</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2 : LES COURS */}
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

      {/* VIEW 3 : COMPÉTENCES & FORMULAIRE */}
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
                    <th className="p-4">Référents</th>
                    <th className="p-4 text-center">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {competences.map(c => (
                    <tr key={c.id || c._id}>
                      <td className="p-4 font-bold text-slate-800">{c.projet}</td>
                      <td className="p-4 text-slate-500 max-w-xs truncate">{c.description}</td>
                      <td className="p-4 text-slate-600">{c.professeurs}</td>
                      <td className="p-4 text-center"><span className="px-2 py-0.5 rounded font-bold uppercase bg-amber-50 text-amber-700">{c.status || 'En attente'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white border rounded-2xl p-6 shadow-sm max-w-2xl mx-auto">
              <form onSubmit={handleCompSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Nom du Projet</label>
                  <input type="text" required value={newComp.projet} onChange={e => setNewComp({...newComp, projet: e.target.value})} className="w-full border p-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Description</label>
                  <textarea rows="3" required value={newComp.description} onChange={e => setNewComp({...newComp, description: e.target.value})} className="w-full border p-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="url" placeholder="Lien GitHub" value={newComp.github || ''} onChange={e => setNewComp({...newComp, github: e.target.value})} className="border p-2 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                  <input type="file" onChange={e => setNewComp({...newComp, file: e.target.files[0]})} className="border p-2 rounded-xl text-xs file:border-0 file:bg-blue-50 file:text-blue-700 file:px-2 file:rounded file:text-[10px] file:font-bold" />
                </div>
                
                {/* INTERFACE DE SÉLECTION DÉROULANTE INTERACTIVE AVEC FLÈCHE */}
                <div className="bg-slate-50 p-4 rounded-xl border relative">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Assigner à des Professeurs (Max 3)</label>
                  
                  {/* Boîte d'en-tête du Dropdown */}
                  <div 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full bg-white border p-2.5 rounded-xl text-xs flex justify-between items-center cursor-pointer shadow-sm select-none hover:border-slate-400 transition-colors"
                  >
                    <span className="text-slate-600 truncate">
                      {selectedProfs.length === 0 
                        ? "Choisir un ou plusieurs professeurs..." 
                        : `${selectedProfs.length} sélectionné(s) : ${selectedProfs.join(', ')}`}
                    </span>
                    <ChevronDown size={14} className={`text-slate-400 transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                  </div>

                  {/* Le panneau déroulant absolu */}
                  {isDropdownOpen && (
                    <div className="absolute left-4 right-4 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 max-h-36 overflow-y-auto space-y-1">
                      {allProfessors.length === 0 ? (
                        <p className="text-[10px] text-slate-400 text-center py-3 font-medium">Aucun professeur trouvé pour votre axe.</p>
                      ) : (
                        allProfessors.map(prof => {
                          const nameStr = `Prof. ${prof.prenom} ${prof.nom}`;
                          const isChecked = selectedProfs.includes(nameStr);
                          return (
                            <label key={prof.id} className="flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer hover:bg-slate-50 transition-colors">
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  checked={isChecked} 
                                  onChange={() => handleProfCheckboxChange(nameStr)} 
                                  disabled={!isChecked && selectedProfs.length >= 3}
                                  className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5" 
                                />
                                <span className="font-medium text-slate-700">{nameStr}</span>
                              </div>
                              <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded">
                                {prof.axe}
                              </span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-xl text-xs shadow-md hover:bg-blue-700 transition-colors">Soumettre le projet</button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* VIEW 4 : ANALYTICS */}
      {viewMode === 'analytics' && (
        <div className="bg-white border p-12 rounded-2xl shadow-sm text-center">
          <BarChart3 size={32} className="text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-400">Analyses de notes bientôt synchronisées.</p>
        </div>
      )}
    </div>
  );
}











// prof
import { useState, useEffect } from 'react';
import { 
  CheckCircle, AlertCircle, Clock, XCircle, 
  Award, BarChart3, Eye, FileText, Link, Plus, FolderPlus
} from 'lucide-react';

export default function ProfessorDashboard({ viewMode }) {
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [courseView, setCourseView] = useState('list'); // 'list' ou 'create'
  
  // Données utilisateur Prof (Simulé ou extrait du token)
  const [profInfo] = useState({ nom: "Jean", prenom: "Rémy" });

  // États des compétences reçues des étudiants
  const [submissions, setSubmissions] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null); // Pour la vue détaillée / modale
  const [comment, setComment] = useState("");

  // États des Cours créés par le professeur
  const [myCourses, setMyCourses] = useState([
    { id: 1, code: 'FR', name: 'Français Appliqué', docs: 2, links: 1, color: 'bg-amber-500' },
    { id: 2, code: 'GC', name: 'Résistance des Matériaux', docs: 5, links: 3, color: 'bg-emerald-500' }
  ]);
  const [newCourse, setNewCourse] = useState({ code: '', name: '', link: '', docName: '' });

  // 1. Déclaration de la fonction de récupération des données en premier
  const fetchSubmissions = async () => {
    try {
      // Endpoint imaginé pour récupérer les compétences où ce prof est assigné
      const res = await fetch('http://localhost:5000/api/competences/professor', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setSubmissions(await res.json());
      }
    } catch (err) {
      console.error("Erreur chargement projets étudiants:", err);
    }
  };

  // 2. Le useEffect vient après la déclaration de sa fonction
  useEffect(() => {
    fetchSubmissions();
  }, [viewMode]);

  // 3. Calculs des statistiques (Correction totalComp -> totalSub effectuée)
  const totalSub = submissions.length;
  const valides = submissions.filter(s => s.status?.toLowerCase().includes('valide')).length;
  const enAttente = submissions.filter(s => !s.status || s.status?.toLowerCase().includes('attente')).length;
  const rejetes = submissions.filter(s => s.status?.toLowerCase().includes('rejet')).length;
  const repartitionValide = totalSub > 0 ? Math.round((valides / totalSub) * 100) : 0;

  // Calculs géométriques pour le cercle SVG
  const circumference = 2 * Math.PI * 40;
  const dashValide = totalSub > 0 ? (valides / totalSub) * circumference : 0;
  const dashEnAttente = totalSub > 0 ? (enAttente / totalSub) * circumference : 0;
  const dashRejete = totalSub > 0 ? (rejetes / totalSub) * circumference : 0;

  // Traitement de l'évaluation (Validation / Rejet)
  const handleEvaluate = async (id, finalStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/competences/${id}/evaluate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: finalStatus, commentaire: comment })
      });

      if (res.ok) {
        setStatus({ type: 'success', msg: `Dépôt mis à jour avec succès : ${finalStatus}` });
        setSelectedSub(null);
        setComment("");
        fetchSubmissions(); // Rechargement à chaud de la liste
      }
    } catch (err) { console.error(err)
      setStatus({ type: 'error', msg: "Erreur lors de la mise à jour." });
    }
  };

  // Création d'un nouveau cours
  const handleCreateCourse = (e) => {
    e.preventDefault();
    const courseObj = {
      id: Date.now(),
      code: newCourse.code.toUpperCase(),
      name: newCourse.name,
      docs: newCourse.docName ? 1 : 0,
      links: newCourse.link ? 1 : 0,
      color: 'bg-blue-500'
    };
    setMyCourses([...myCourses, courseObj]);
    setNewCourse({ code: '', name: '', link: '', docName: '' });
    setCourseView('list');
    setStatus({ type: 'success', msg: 'Cours créé et publié avec succès !' });
  };

  return (
    <div className="space-y-6 w-full max-w-6xl mx-auto">
      
      {status.msg && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border-l-4 shadow-sm ${status.type === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-rose-50 border-rose-500 text-rose-800'}`}>
          {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <p className="text-xs font-bold">{status.msg}</p>
        </div>
      )}

      {/* RENDER VIEW 1 : DASHBOARD */}
      {viewMode === 'dashboard' && (
        <div className="space-y-8">
          
          {/* Les compteurs d'activité */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Reçus</p>
                <p className="text-2xl font-black text-slate-800">{totalSub}</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Award size={20} /></div>
            </div>
            <div className="bg-white border p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Validés</p>
                <p className="text-2xl font-black text-emerald-600">{valides}</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle size={20} /></div>
            </div>
            <div className="bg-white border p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">À Évaluer</p>
                <p className="text-2xl font-black text-amber-500">{enAttente}</p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-500 rounded-xl"><Clock size={20} /></div>
            </div>
            <div className="bg-white border p-5 rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rejetés</p>
                <p className="text-2xl font-black text-rose-600">{rejetes}</p>
              </div>
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl"><XCircle size={20} /></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Graphique de répartition circulaire */}
            <div className="bg-white border p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-5">Statistiques Projets</h3>
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                  {totalSub > 0 && (
                    <>
                      <circle cx="50" cy="50" r="40" stroke="#10b981" strokeWidth="8" fill="transparent" strokeDasharray={`${dashValide} ${circumference}`} strokeDashoffset={0} />
                      <circle cx="50" cy="50" r="40" stroke="#f59e0b" strokeWidth="8" fill="transparent" strokeDasharray={`${dashEnAttente} ${circumference}`} strokeDashoffset={-dashValide} />
                      <circle cx="50" cy="50" r="40" stroke="#f43f5e" strokeWidth="8" fill="transparent" strokeDasharray={`${dashRejete} ${circumference}`} strokeDashoffset={-(dashValide + dashEnAttente)} />
                    </>
                  )}
                </svg>
                <div className="absolute text-center">
                  <p className="text-2xl font-black text-slate-800">{repartitionValide}%</p>
                  <p className="text-[9px] text-emerald-500 font-bold uppercase">Taux Validé</p>
                </div>
              </div>
            </div>

            {/* Flux des activités récentes (Dépôts reçus) */}
            <div className="bg-white border p-6 rounded-2xl shadow-sm md:col-span-2 space-y-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider border-b pb-2">Projets Étudiants Assignés</h3>
              
              <div className="overflow-y-auto max-h-64 space-y-2 pr-1">
                {submissions.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8">Aucun dépôt étudiant pour le moment.</p>
                ) : (
                  submissions.map((sub) => (
                    <div key={sub.id} className="border p-3 rounded-xl flex items-center justify-between bg-slate-50 hover:bg-white transition-all shadow-sm">
                      <div>
                        <h4 className="text-xs font-black text-slate-800">Projet: {sub.projet || 'Sans titre'}</h4>
                        <p className="text-[11px] text-slate-400 truncate max-w-xs">{sub.description}</p>
                      </div>
                      
                      {/* BOUTONS D'ACTIONS EXIGÉS (Gris, Vert, Rouge) */}
                      <div className="flex gap-1.5">
                        <button onClick={() => setSelectedSub(sub)} className="p-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors flex items-center gap-1 text-[10px] font-bold">
                          <Eye size={12} /> Voir
                        </button>
                        <button onClick={() => handleEvaluate(sub.id, 'Valide')} className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-[10px] font-bold">
                          Valider
                        </button>
                        <button onClick={() => handleEvaluate(sub.id, 'Rejete')} className="p-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors text-[10px] font-bold">
                          Rejeter
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* SECTION TIROIR/MODALE D'ÉVALUATION (S'affiche au clic sur "Voir") */}
          {selectedSub && (
            <div className="bg-white border-2 border-blue-500 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Détails du dépôt : {selectedSub.projet}</h3>
                <button onClick={() => setSelectedSub(null)} className="text-xs font-bold text-rose-500 hover:underline">Fermer</button>
              </div>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border">{selectedSub.description}</p>
              
              {/* Pièces jointes et liens */}
              <div className="flex flex-wrap gap-4 text-xs font-medium text-blue-600">
                {selectedSub.github && (
                  <a href={selectedSub.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline">
                    <Link size={14} /> Repository GitHub
                  </a>
                )}
                {selectedSub.fichier && (
                  <span className="flex items-center gap-1 text-slate-600">
                    <FileText size={14} /> Document joint : <b>{selectedSub.fichier}</b>
                  </span>
                )}
              </div>

              {/* Formulaire de commentaire exigé */}
              <div className="pt-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Ajouter un commentaire pédagogique</label>
                <textarea 
                  rows="2" 
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)} 
                  placeholder="Écrivez vos remarques ici avant de valider ou rejeter..." 
                  className="w-full border p-2 rounded-xl text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* RENDER VIEW 2 : MES COURS */}
      {viewMode === 'cours' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Gestion des cours</span>
            <button onClick={() => setCourseView(courseView === 'list' ? 'create' : 'list')} className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1">
              {courseView === 'list' ? <><Plus size={14} /> Créer un cours</> : 'Voir la liste'}
            </button>
          </div>

          {courseView === 'list' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCourses.map(c => (
                <div key={c.id} className="bg-white border rounded-2xl p-5 shadow-sm h-36 flex flex-col justify-between hover:shadow-md transition-all">
                  <div className={`w-10 h-10 ${c.color} rounded-xl flex items-center justify-center text-white font-black text-xs`}>{c.code}</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{c.name}</h4>
                    <div className="flex gap-3 text-[10px] text-slate-400 font-bold uppercase mt-1">
                      <span className="flex items-center gap-0.5"><FileText size={10} /> {c.docs} Docs</span>
                      <span className="flex items-center gap-0.5"><Link size={10} /> {c.links} Liens</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border rounded-2xl p-6 shadow-sm max-w-xl mx-auto">
              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Code</label>
                    <input type="text" placeholder="Ex: FR" required value={newCourse.code} onChange={e => setNewCourse({...newCourse, code: e.target.value})} className="w-full border p-2 rounded-xl text-xs" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Nom du cours</label>
                    <input type="text" required placeholder="Ex: Français appliqué" value={newCourse.name} onChange={e => setNewCourse({...newCourse, name: e.target.value})} className="w-full border p-2 rounded-xl text-xs" />
                  </div>
                </div>

                {/* Partage de ressources */}
                <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Partager des documents et liens</span>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 mb-0.5">Nom du fichier joint (PDF, TD)</label>
                    <input type="text" placeholder="Ex: Support_De_Cours.pdf" value={newCourse.docName} onChange={e => setNewCourse({...newCourse, docName: e.target.value})} className="w-full border bg-white p-2 rounded-xl text-xs" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 mb-0.5">Lien externe</label>
                    <input type="url" placeholder="https://..." value={newCourse.link} onChange={e => setNewCourse({...newCourse, link: e.target.value})} className="w-full border bg-white p-2 rounded-xl text-xs" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-xl text-xs shadow-md hover:bg-blue-700 flex items-center justify-center gap-1.5">
                  <FolderPlus size={14} /> Publier le cours
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* RENDER VIEW 3 : ANALYTICS */}
      {viewMode === 'analytics' && (
        <div className="bg-white border p-12 rounded-2xl shadow-sm text-center">
          <BarChart3 size={32} className="text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-400">Analyses globales de performance bientôt prêtes.</p>
        </div>
      )}
    </div>
  );
}