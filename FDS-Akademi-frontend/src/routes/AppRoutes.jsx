import { Routes, Route, Navigate, useParams } from 'react-router-dom';

// Importation de l'enveloppe structurelle (Layouts)
import AdminLayout from '../layouts/AdminLayout';
import StudentLayout from '../layouts/StudentLayout';
import ProfessorLayout from '../layouts/ProfessorLayout'; // Importation du nouveau layout prof

// Importation des composants pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import Accueil from '../pages/Accueil';
import Login from '../pages/Login';
import StudentDashboard from '../pages/student/StudentDashboard';
import ProfessorDashboard from '../pages/ProfessorDashboard';
import PublicProjectView from '../pages/PublicProjectView'; // 🌟 Import de la page publique pour les recruteurs

export default function AppRoutes() {
  return (
    <Routes>
      {/* 🔓 Routes Publiques */}
      <Route path="/" element={<Accueil />} />
      <Route path="/login" element={<Login />} />
      
      {/* 🌟 Lien magique pour le recruteur (accessible sans connexion) */}
      <Route path="/share/:token" element={<PublicProjectView />} />

      {/* 👑 Espace Super Admin (Layout + Pages imbriquées) */}
      <Route path="/admin" element={<AdminLayout />}>
        {/* Page par défaut sur /admin */}
        <Route index element={<AdminDashboard activeTab="dashboard" />} />
      </Route>

      {/* 👨‍🎓 Espace Étudiant (Layout + Pages imbriquées) */}
      <Route path="/student" element={<StudentLayout />}>
        {/* Si l'étudiant va sur /student, il est redirigé vers son dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
        
        {/* Cette ligne dynamique capte automatiquement : dashboard, cours, analytics, competences */}
        <Route path=":viewMode" element={<StudentDashboardWrapper />} />
      </Route>

      {/* 👨‍🏫 Espace Professeur (Layout + Pages imbriquées) */}
      <Route path="/professor" element={<ProfessorLayout />}>
        {/* Si le prof va sur /professor, redirection automatique vers le dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Captera dynamiquement : /professor/dashboard, /professor/cours, /professor/analytics */}
        <Route path=":viewMode" element={<ProfessorDashboardWrapper />} />
      </Route>

      {/* 🔄 Sécurité : Redirection automatique vers l'accueil si l'URL n'existe pas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// 🛠️ Petit composant Wrapper pour lier proprement l'URL de la Sidebar au StudentDashboard
function StudentDashboardWrapper() {
  const { viewMode } = useParams();
  return <StudentDashboard viewMode={viewMode} />;
}

// 🛠️ Nouveau composant Wrapper pour lier proprement l'URL au ProfessorDashboard
function ProfessorDashboardWrapper() {
  const { viewMode } = useParams();
  return <ProfessorDashboard viewMode={viewMode} />;
}