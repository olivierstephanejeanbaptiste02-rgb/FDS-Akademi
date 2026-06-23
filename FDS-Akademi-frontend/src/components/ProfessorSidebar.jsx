
import { Home, BookOpen, BarChart3, Settings, Globe } from 'lucide-react';
import logoFds from '../assets/fdsLogo.jpg'; 

export default function ProfessorSidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={18} /> },
    { id: 'cours', label: 'Mes Cours', icon: <BookOpen size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 fixed h-full flex flex-col justify-between border-r border-slate-800 z-30">
      <div>
        {/* Entête avec Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <img src={logoFds} alt="Logo FDS" className="h-9 w-auto object-contain" />
          <div>
            <span className="text-white font-black text-sm tracking-wide">FDS</span>
          <span className="text-blue-500 font-black text-sm tracking-wide"> AKADEMI</span>
            <p className="text-[10px] text-blue-400 font-medium">Espace Professeur</p>
          </div>
        </div>

        {/* Navigation */}
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
               {/* Pied de page du Sidebar */}
                    <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-950/40">
                      <button className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold hover:bg-slate-800 text-slate-400 transition-colors">
                        <span className="flex items-center gap-2"><Globe size={14} /> Français</span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">FR</span>
                      </button>
                      <div className="px-3 py-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider text-center">
                        Espace Professeur
                      </div>
                    </div>
                  </aside>
     
  );
}