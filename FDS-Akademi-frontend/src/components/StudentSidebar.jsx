import { LayoutDashboard, BookOpen, BarChart3, Award, Globe } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import logoFaculte from '../assets/fdsLogo.jpg'

export default function StudentSidebar() {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { id: 'cours', name: 'Mes Cours', path: '/student/cours', icon: BookOpen },
    { id: 'analytics', name: 'Analyses', path: '/student/analytics', icon: BarChart3 },
    { id: 'competences', name: 'Compétences', path: '/student/competences', icon: Award },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 h-screen fixed top-0 left-0 flex flex-col z-30 border-r border-slate-800">
      {/* Logo de la faculté */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
        {/* 2. Utiliser la variable importée dans le src */}
        <img 
          src={logoFaculte} 
          alt="Logo Faculté" 
          className="w-15 h-15 object-contain"
          onError={(e) => {
            // Sécurité : si l'image ne charge pas, on la cache pour éviter une icône brisée
            e.target.style.display = 'none';
          }}
        />
        <div>
          <span className="text-white font-black text-sm tracking-wide">FDS</span>
          <span className="text-blue-500 font-black text-sm tracking-wide"> AKADEMI</span>
           <p className="text-[10px] text-blue-400 font-medium">Espace  Étudiant</p>
        </div>
      </div>

      {/* Liens de navigation basés sur les URLs */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                  {item.name}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Pied de page du Sidebar */}
      <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-950/40">
        <button className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold hover:bg-slate-800 text-slate-400 transition-colors">
          <span className="flex items-center gap-2"><Globe size={14} /> Français</span>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">FR</span>
        </button>
        <div className="px-3 py-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider text-center">
          Espace Étudiant
        </div>
      </div>
    </aside>
  );
}