import { Outlet } from 'react-router-dom';
import StudentSidebar from '../components/StudentSidebar';
import StudentHeader from '../components/StudentHeader';

export default function StudentLayout() {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* 1. Sidebar fixe à gauche */}
      <StudentSidebar />

      {/* 2. Zone de droite (Header + Contenu dynamique) */}
      <div className="flex-1 flex flex-col pl-64 overflow-hidden">
        <StudentHeader />
        
        {/* Zone où s'injectent le Dashboard, les Compétences, etc. */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
         {/* Footer simple et élégant */}
        <footer className="h-12 border-t border-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-400 bg-white">
          &copy; 2026 Faculté des Sciences (FDS Akademi) — Tous droits réservés.
        </footer>
      </div>
    </div>
  );
}