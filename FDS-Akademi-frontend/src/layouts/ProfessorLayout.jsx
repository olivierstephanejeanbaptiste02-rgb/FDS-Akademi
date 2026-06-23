import { useParams, useNavigate } from 'react-router-dom';
import ProfessorSidebar from '../components/ProfessorSidebar';
import ProfessorHeader from '../components/ProfessorHeader';
import ProfessorDashboard from '../pages/ProfessorDashboard';

export default function LayoutProfessor() {
  // On récupère le mode d'affichage directement depuis l'URL (/professor/:viewMode)
  const { viewMode } = useParams();
  const navigate = useNavigate();

  // Profil simulé du professeur
  const profData = { nom: "Jean", prenom: "Rémy" };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Au clic sur la sidebar, on pousse le nouvel onglet dans l'URL */}
      <ProfessorSidebar 
        activeTab={viewMode || 'dashboard'} 
        setActiveTab={(tab) => navigate(`/professor/${tab}`)} 
        userProf={profData} 
      />

      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <ProfessorHeader userProf={profData} onLogout={handleLogout} />
        <main className="p-8 flex-1 overflow-y-auto">
          <ProfessorDashboard viewMode={viewMode || 'dashboard'} />
        </main>
      </div>
    </div>
  );
}