import  { useState, useRef, useEffect } from 'react';
import { Bell, User, ChevronDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fonction pour se déconnecter
  const handleLogout = () => {
    localStorage.removeItem('token'); // Nettoie le jeton de sécurité
    navigate('/'); // Redirige vers la page de connexion
  };

  // Fermer le menu déroulant si on clique n'importe où en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-0 md:pl-64 flex items-center justify-between px-6 z-20 shadow-sm">
      <div className="text-sm ml-4 font-bold text-slate-400 uppercase tracking-wider">
        Faculté des Sciences
      </div>

      <div className="flex items-center gap-6">
        {/* Cloche Notifications */}
        <button className="relative text-slate-500 hover:text-slate-800 transition-colors">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>

        {/* Zone Profil cliquable avec Menu Déroulant */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 border-l pl-6 border-slate-200 hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 border flex items-center justify-center text-slate-600">
              <User size={16} />
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-800">Super Admin</p>
              <p className="text-[10px] text-slate-400 font-semibold">super_admin@fds.edu.ht</p>
            </div>
            <ChevronDown 
              size={14} 
              className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          {/* Le Menu Déroulant (Dropdown) */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 animate-fadeIn">
              <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                <p className="text-xs font-bold text-slate-800">Super Admin</p>
                <p className="text-[10px] text-slate-400">super_admin@fds.edu.ht</p>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}