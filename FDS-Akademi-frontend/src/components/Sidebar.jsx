
import { Home, UserPlus, Users, Megaphone, Settings, Globe } from 'lucide-react';
// Importation du logo depuis tes assets
import logoFds from '../assets/fdsLogo.jpg'; 

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={18} /> },
    { id: 'students', label: 'Étudiants', icon: <UserPlus size={18} /> },
    { id: 'professors', label: 'Professeurs', icon: <Users size={18} /> },
    { id: 'announcements', label: 'Annonces', icon: <Megaphone size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 fixed h-full flex flex-col justify-between border-r border-slate-800 z-30">
      {/* Haut de la Sidebar */}
      <div>
        {/* Section Logo & Titre */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <img src={logoFds} alt="Logo FDS" className="h-15 w-auto object-contain" />
          <div>
            <h1 className="text-sm font-black text-white tracking-wider uppercase">FDS Akademi</h1>
            <p className="text-[10px] text-blue-400 font-medium">Fall Semester 2026</p>
          </div>
        </div>

        {/* Menu de Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'hover:bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Bas de la Sidebar (Option Unique Langue + Profil) */}
      <div className="p-4 border-t border-slate-800 space-y-4">
        {/* Option de langue fixe : Seulement Français */}
        <div className="w-full flex items-center px-4 py-2.5 bg-slate-800/50 text-slate-400 rounded-xl text-xs font-bold select-none">
          <span className="flex items-center gap-2">
            <Globe size={14} /> 
            🇫🇷 Français
          </span>
        </div>

        {/* Info Profil */}
        <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div>
            <p className="text-xs font-bold text-white">Super Admin</p>
            <p className="text-[10px] text-slate-500">Session active</p>
          </div>
        </div>
      </div>
    </aside>
  );
}