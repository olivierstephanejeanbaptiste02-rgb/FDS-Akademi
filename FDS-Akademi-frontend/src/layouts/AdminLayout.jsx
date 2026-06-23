import  { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import AdminDashboard from '../pages/admin/AdminDashboard';

export default function AdminLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Barre de navigation fixe latérale */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Conteneur principal de droite */}
      <div className="flex-1 flex flex-col pl-0 md:pl-64">
        <Header />
        
        {/* Zone de contenu dynamique */}
        <main className="flex-1 pt-24 px-6 pb-12">
          <AdminDashboard activeTab={activeTab} />
        </main>

        {/* Footer simple et élégant */}
        <footer className="h-12 border-t border-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-400 bg-white">
          &copy; 2026 Faculté des Sciences (FDS Akademi) — Tous droits réservés.
        </footer>
      </div>
    </div>
  );
}