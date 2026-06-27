import { useState, useEffect } from 'react';
import InputPassword from '../../components/InputPassword';
import { 
  CheckCircle, AlertCircle, UserPlus, List, 
  Users, GraduationCap, ShieldCheck, Clock, Megaphone
} from 'lucide-react';

export default function AdminDashboard({ activeTab }) {
  const [status, setStatus] = useState({ type: '', msg: '' });
  
  // Configuration dynamique de l'URL de l'API globale
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // États d'affichage initiaux
  const [studentView, setStudentView] = useState('list');
  const [professorView, setProfessorView] = useState('list');
  
  // Données de la base de données
  const [studentsList, setStudentsList] = useState([]);
  const [professorsList, setProfessorsList] = useState([]);
  
  // Historique des actions
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'system', title: 'Système initialisé', details: 'Connexion établie avec le serveur.', time: 'En ligne' }
  ]);

  // Modèles d'état initial pour la réinitialisation complète
  const initialStudentState = { nom: '', prenom: '', email: '', password: '', axe: 'Electronique', niveau: '1' };
  const initialProfessorState = { nom: '', prenom: '', email: '', password: '', axe: 'Tous les axes', niveau: 'Tous' };
  const initialAnnouncementState = { titre: '', message: '', axe: 'Tous les axes', niveau: 'Tous' };

  const [student, setStudent] = useState(initialStudentState);
  const [professor, setProfessor] = useState(initialProfessorState);
  const [announcement, setAnnouncement] = useState(initialAnnouncementState);

  // CHARGEMENT GLOBAL : S'exécute à chaque changement d'onglet majeur
  useEffect(() => {
    fetchStudents();
    fetchProfessors();

    if (activeTab === 'students') setStudentView('list');
    if (activeTab === 'professors') setProfessorView('list');
  }, [activeTab]);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/students`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStudentsList(data);
      }
    } catch (err) {
      console.error("Impossible de charger les étudiants:", err);
    }
  };

  const fetchProfessors = async () => {
    try {
      const response = await fetch(`${API_URL}/api/professors`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProfessorsList(data);
      }
    } catch (err) {
      console.error("Impossible de charger les professeurs:", err);
    }
  };

  const logActivity = (type, title, details) => {
    setRecentActivities(prev => [{ id: Date.now(), type, title, details, time: 'À l\'instant' }, ...prev]);
  };

  const handleFetchSubmit = async (endpoint, payload, modeType) => {
    setStatus({ type: '', msg: '' });
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      
      if (response.ok) {
        setStatus({ type: 'success', msg: data.message || 'Enregistrement réussi !' });
        
        if (modeType === 'student') {
          logActivity('student', 'Étudiant ajouté', `${payload.prenom} ${payload.nom}`);
          setStudent(initialStudentState); 
          setStudentView('list');          
          await fetchStudents();           
        } 
        else if (modeType === 'professor') {
          logActivity('professor', 'Professeur ajouté', `Prof. ${payload.prenom} ${payload.nom}`);
          setProfessor(initialProfessorState); 
          setProfessorView('list');            
          await fetchProfessors();             
        } 
        else if (modeType === 'announcement') {
          logActivity('announcement', 'Annonce publiée', payload.titre);
          setAnnouncement(initialAnnouncementState);
        }
      } else {
        setStatus({ type: 'error', msg: data.message || 'Erreur retournée par le serveur.' });
      }
    } catch (err) { 
      console.error(err);
      setStatus({ type: 'error', msg: 'Erreur fatale: Impossible de joindre le backend.' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Alertes de confirmation */}
      {status.msg && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border-l-4 shadow-sm ${status.type === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-800' : 'bg-rose-50 border-rose-500 text-rose-800'}`}>
          {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <p className="text-xs font-bold">{status.msg}</p>
        </div>
      )}

      {/* VUE : DASHBOARD PRINCIPAL */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center justify-between relative overflow-hidden group">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Étudiants</h4>
                <p className="text-4xl font-black text-slate-800">{studentsList.length}</p>
              </div>
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><GraduationCap size={28} /></div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"></div>
            </div>

            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center justify-between relative overflow-hidden group">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Professeurs</h4>
                <p className="text-4xl font-black text-slate-800">{professorsList.length}</p>
              </div>
              <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl"><Users size={28} /></div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500"></div>
            </div>

            <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex items-center justify-between relative overflow-hidden group">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Utilisateurs</h4>
                <p className="text-4xl font-black text-slate-800">{studentsList.length + professorsList.length}</p>
              </div>
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><ShieldCheck size={28} /></div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500"></div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 border-b pb-4 mb-4">
              <Clock size={18} className="text-slate-400" />
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Journal des actions récentes</h3>
            </div>
            <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
              {recentActivities.map((act) => (
                <div key={act.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-2 bg-slate-100 rounded-lg text-slate-600">
                      {act.type === 'student' ? <GraduationCap size={14} /> : act.type === 'professor' ? <Users size={14} /> : <Megaphone size={14} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{act.title}</h4>
                      <p className="text-xs text-slate-500">{act.details}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VUE : GESTION ÉTUDIANTS */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              {studentView === 'list' ? <List size={18} /> : <UserPlus size={18} />}
              {studentView === 'list' ? 'Liste étudiants' : 'Nouveau Étudiant'}
            </h3>
            <button onClick={() => setStudentView(studentView === 'list' ? 'add' : 'list')} className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-lg">
              {studentView === 'list' ? '+ Ajouter Étudiant' : 'Voir la Liste'}
            </button>
          </div>

          {studentView === 'list' ? (
            <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b text-xs font-bold text-slate-500">
                  <tr>
                    <th className="p-4">Nom</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Axe</th>
                    <th className="p-4">Niveau</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y">
                  {studentsList.map(s => (
                    <tr key={s.id}>
                      <td className="p-4 font-semibold">{s.nom} {s.prenom}</td>
                      <td className="p-4 text-slate-500">{s.email}</td>
                      <td className="p-4"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-bold">{s.axe}</span></td>
                      <td className="p-4 font-bold text-slate-600">Niveau {s.niveau}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <form onSubmit={(e) => { e.preventDefault(); handleFetchSubmit('/api/students', student, 'student'); }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Nom" required value={student.nom} onChange={e => setStudent({...student, nom: e.target.value})} className="border p-2.5 rounded-xl text-sm" />
                  <input type="text" placeholder="Prénom" required value={student.prenom} onChange={e => setStudent({...student, prenom: e.target.value})} className="border p-2.5 rounded-xl text-sm" />
                </div>
                <input type="email" placeholder="Email" required value={student.email} onChange={e => setStudent({...student, email: e.target.value})} className="w-full border p-2.5 rounded-xl text-sm" />
                <InputPassword value={student.password} onChange={e => setStudent({...student, password: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <select value={student.axe} onChange={e => setStudent({...student, axe: e.target.value})} className="border p-2.5 rounded-xl text-sm">
                    <option value="Electronique">Électronique</option>
                    <option value="Electromecanique">Électromécanique</option>
                    <option value="Civil">Civil</option>
                  </select>
                  <select value={student.niveau} onChange={e => setStudent({...student, niveau: e.target.value})} className="border p-2.5 rounded-xl text-sm">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl">Créer étudiant</button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* VUE : GESTION PROFESSEURS */}
      {activeTab === 'professors' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              {professorView === 'list' ? <List size={18} /> : <UserPlus size={18} />}
              {professorView === 'list' ? 'Liste professeurs' : 'Nouveau Professeur'}
            </h3>
            <button onClick={() => setProfessorView(professorView === 'list' ? 'add' : 'list')} className="bg-purple-600 text-white font-bold text-xs px-4 py-2 rounded-lg">
              {professorView === 'list' ? '+ Ajouter Professeur' : 'Voir la Liste'}
            </button>
          </div>

          {professorView === 'list' ? (
            <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b text-xs font-bold text-slate-500">
                  <tr>
                    <th className="p-4">Nom</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Axe</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y">
                  {professorsList.map(p => (
                    <tr key={p.id}>
                      <td className="p-4 font-semibold">Prof. {p.nom} {p.prenom}</td>
                      <td className="p-4 text-slate-500">{p.email}</td>
                      <td className="p-4"><span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs font-bold">{p.axe}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <form onSubmit={(e) => { e.preventDefault(); handleFetchSubmit('/api/professors', professor, 'professor'); }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Nom" required value={professor.nom} onChange={e => setProfessor({...professor, nom: e.target.value})} className="border p-2.5 rounded-xl text-sm" />
                  <input type="text" placeholder="Prénom" required value={professor.prenom} onChange={e => setProfessor({...professor, prenom: e.target.value})} className="border p-2.5 rounded-xl text-sm" />
                </div>
                <input type="email" placeholder="Email" required value={professor.email} onChange={e => setProfessor({...professor, email: e.target.value})} className="w-full border p-2.5 rounded-xl text-sm" />
                <InputPassword value={professor.password} onChange={e => setProfessor({...professor, password: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <select value={professor.axe} onChange={e => setProfessor({...professor, axe: e.target.value})} className="border p-2.5 rounded-xl text-sm">
                    <option value="Electronique">Électronique</option>
                    <option value="Electromecanique">Électromécanique</option>
                    <option value="Civil">Civil</option>
                    <option value="Tous les axes">Tous les axes</option>
                  </select>
                  <select value={professor.niveau} onChange={e => setProfessor({...professor, niveau: e.target.value})} className="border p-2.5 rounded-xl text-sm">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="Tous">Tous</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-purple-600 text-white font-bold py-2.5 rounded-xl">Créer professeur</button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* VUE : GESTION DES ANNONCES */}
      {activeTab === 'announcements' && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-2 border-b pb-3 mb-6">
            <Megaphone size={20} className="text-blue-600" />
            <h3 className="text-base font-bold text-slate-800">Diffuser une Annonce Officielle</h3>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); handleFetchSubmit('/api/announcements', announcement, 'announcement'); }} className="space-y-4">
            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1">Titre de l'annonce</label>
              <input type="text" placeholder="Ex: Report d'examen ou Avis général..." required value={announcement.titre} onChange={e => setAnnouncement({...announcement, titre: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-sm" />
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1">Message à passer</label>
              <textarea rows="4" placeholder="Tapez le contenu détaillé de votre message ici..." required value={announcement.message} onChange={e => setAnnouncement({...announcement, message: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-sm" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border">
              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1">Cibler un Axe d'étude</label>
                <select value={announcement.axe} onChange={e => setAnnouncement({...announcement, axe: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-sm font-semibold text-slate-700">
                  <option value="Tous les axes">Tous les axes (Général)</option>
                  <option value="Civil">Génie Civil</option>
                  <option value="Electronique">Électronique</option>
                  <option value="Electromecanique">Électromécanique</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1">Cibler un Niveau</label>
                <select value={announcement.niveau} onChange={e => setAnnouncement({...announcement, niveau: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 bg-white rounded-xl text-sm font-semibold text-slate-700">
                  <option value="Tous">Tous les niveaux</option>
                  <option value="1">Niveau 1</option>
                  <option value="2">Niveau 2</option>
                  <option value="3">Niveau 3</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md text-sm transition-all mt-2">
              Diffuser l'annonce
            </button>
          </form>
        </div>
      )}
    </div>
  );
}