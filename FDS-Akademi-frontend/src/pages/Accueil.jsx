
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Award, GraduationCap } from 'lucide-react';

// Importation des images locales
import logoFds from '../assets/fdsLogo.jpg';
import bgFaculte from '../assets/fdsueh.jpg';

export default function Accueil() {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen text-slate-800 flex flex-col justify-between bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bgFaculte})` }}
    >
      {/* Superposition d'une couche sombre (Overlay) pour rendre le texte très lisible par-dessus l'image */}
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm z-0"></div>

      {/* Contenu de la page (placé au-dessus de l'overlay grâce au z-10) */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen">
        
        {/* Barre supérieure de l'accueil */}
        <header className="max-w-7xl w-full mx-auto px-6 h-48 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Remplacement de FA par le Logo de la Faculté */}
            <img 
              src={logoFds} 
              alt="Logo Faculté des Sciences" 
              className="w-25 h-25 object-contain gap-6 bg-blue p-1 rounded-lg"
            />
            <span className="font-bold text-3xl tracking-tight text-white">FDS Akademi</span>
          </div>
          
        </header>

        {/* Section Héro (Présentation principale) */}
        <main className="max-w-5xl mx-auto px-6 text-center py-16 flex-1 flex flex-col justify-center items-center">
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            La plateforme officielle de certification des compétences académiques
          </h1>
          <p className="text-lg text-slate-200 max-w-2xl mb-10 leading-relaxed">
            FDS Akademi permet aux étudiants de soumettre leurs projets techniques et d'obtenir des certifications permanentes et authentifiées directement validées par leurs professeurs.
          </p>
          
          <button 
            onClick={() => navigate('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5"
          >
            Accéder à mon espace  →
          </button>

          {/* Grille des fonctionnalités clés */}
          <div className="grid md:grid-cols-3 gap-8 mt-16 text-left w-full max-w-5xl">
            <div className="bg-white/95 backdrop-blur p-6 rounded-2xl border border-slate-200 shadow-xl">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-600 w-fit mb-4"><GraduationCap size={24} /></div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Profil Étudiant</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Centralisez vos compétences en génie et associez-y des preuves réelles de vos réalisations.</p>
            </div>

            <div className="bg-white/95 backdrop-blur p-6 rounded-2xl border border-slate-200 shadow-xl">
              <div className="bg-green-50 p-3 rounded-xl text-green-600 w-fit mb-4"><ShieldCheck size={24} /></div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Validation Professeur</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Les enseignants examinent, testent et certifient les compétences pour garantir la crédibilité du profil.</p>
            </div>

            <div className="bg-white/95 backdrop-blur p-6 rounded-2xl border border-slate-200 shadow-xl">
              <div className="bg-purple-50 p-3 rounded-xl text-purple-600 w-fit mb-4"><Award size={24} /></div>
              <h3 className="font-bold text-slate-900 text-lg mb-2">Lien Permanent</h3>
              <p className="text-sm text-slate-500 leading-relaxed">Générez une URL unique et infalsifiable à intégrer sur votre CV ou votre profil LinkedIn.</p>
            </div>
          </div>
        </main>

        {/* Footer public */}
        <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-300">
          <p>© 2026 FDS Akademi — Faculté des Sciences, Université d'État d'Haïti.</p>
        </footer>
      </div>
    </div>
  );
}