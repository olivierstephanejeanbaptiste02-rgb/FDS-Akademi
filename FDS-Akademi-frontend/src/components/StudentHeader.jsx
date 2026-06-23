import { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function StudentHeader() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [studentName, setStudentName] = useState('Étudiant');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Récupération sécurisée de l'objet utilisateur global
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // On cherche d'abord nom_complet, sinon prenom + nom
        const name = parsedUser.nom_complet || `${parsedUser.prenom || ''} ${parsedUser.nom || ''}`.trim();
        if (name) {
          setStudentName(name);
        }
      } catch (error) {
        console.error("Erreur lors de la lecture de l'utilisateur :", error);
      }
    }

    // Gestion du clic à l'extérieur pour fermer le menu
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 2. Génération ultra-robuste des initiales (gère les minuscules et espaces multiples)
  const getInitials = (name) => {
    if (!name || name === 'Étudiant') return "ST";
    
    // Sépare les mots en ignorant les espaces multiples
    const parts = name.trim().split(/\s+/);
    
    if (parts.length > 1 && parts[0]?.[0] && parts[1]?.[0]) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    } else if (parts[0]?.[0]) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return "ST";
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20 shadow-sm w-full">
      <div className="text-sm font-black text-slate-400 uppercase tracking-wider">
        Faculté des Sciences
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative text-slate-500 hover:text-slate-800 transition-colors">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>

        {/* Profil Cliquable */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 border-l pl-6 border-slate-200 hover:opacity-80 transition-opacity focus:outline-none"
          >
            {/* Le petit cercle affiche désormais parfaitement les initiales comme RN */}
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-xs uppercase select-none">
              {getInitials(studentName)}
            </div>
            
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-800">{studentName}</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                Étudiant - FDS
              </p>
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Menu Déroulant */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left"
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}