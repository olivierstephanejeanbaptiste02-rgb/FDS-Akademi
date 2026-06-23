import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { ArrowLeft, Lock, AlertCircle } from 'lucide-react';



// Importation de ton image de fond



import bgFaculte from '../assets/faculTe des sciences - UEH.jpg';



export default function Login() {

const navigate = useNavigate();



  // États pour stocker les champs et la gestion des erreurs

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {

    e.preventDefault();

    setErrorMsg('');

    setLoading(true);

    try {

      const response = await fetch('http://localhost:5000/api/auth/login', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ email, password })

      });



      const data = await response.json();

      if (response.ok && data.success) {

        // 1. Stocker le Token JWT et les infos de l'utilisateur

        localStorage.setItem('token', data.token);

        localStorage.setItem('user', JSON.stringify(data.user));



        // 2. Aiguillage dynamique selon le rôle enregistré en BDD

        const userRole = data.user.role;

        if (userRole === 'admin') {

          navigate('/admin');

        } else if (userRole === 'etudiant') {

          navigate('/student');

        } else if (userRole === 'professeur') {

          navigate('/professor');

        } else {

          setErrorMsg("Rôle utilisateur inconnu.");

        }

      } else {

        // Affiche l'erreur renvoyée par le authController du backend

        setErrorMsg(data.message || 'Échec de l\'authentification.');

      }





    } catch (err) { console.error(err)

      setErrorMsg('Impossible de joindre le service d\'authentification. Vérifie que le serveur Node est lancé.');

    } finally {

      setLoading(false)

    }

  };



  return (

    <div

      className="min-h-screen flex flex-col justify-center items-center p-4 bg-cover bg-center bg-no-repeat relative"

      style={{ backgroundImage: `url(${bgFaculte})` }}

    >

      {/* Superposition d'une couche sombre (Overlay + Flou) */}

      <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-sm z-0"></div>



      {/* Bouton Retour Accueil */}

      <button

        onClick={() => navigate('/')}

        className="absolute top-6 left-6 z-20 text-slate-300 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors"

      >

        <ArrowLeft size={20} /> Retour à l'accueil

      </button>

      {/* Boîtier de Connexion (au-dessus de l'overlay grâce au z-10) */}

      <div className="relative z-10 bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">

        <div className="text-center mb-6">

          <div className="bg-blue-600 w-12 h-12 rounded-xl text-white font-bold text-2xl flex items-center justify-center mx-auto mb-4 select-none">FA</div>

          <h2 className="text-2xl font-bold text-slate-900">Portail FDS Akademi</h2>

          <p className="text-sm text-slate-500 mt-1">Connectez-vous à votre espace sécurisé</p>

        </div>

        {/* Affichage dynamique des alertes d'erreurs d'authentification */}

        {errorMsg && (

          <div className="mb-4 p-3 bg-rose-50 border-l-4 border-rose-500 text-rose-800 rounded-lg flex items-center gap-2 text-xs font-semibold">

            <AlertCircle size={16} className="shrink-0" />

            <p>{errorMsg}</p>

          </div>

        )}



        <form onSubmit={handleLoginSubmit} className="space-y-4">

          <div>

            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Adresse Email</label>

            <input

              type="email"

              required

              value={email}

              onChange={(e) => setEmail(e.target.value)}

              placeholder="votre.nom@fds.edu.ht"



              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"

            />

          </div>

          <div>

            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Mot de passe</label>

            <input

              type="password"

              required

              value={password}

              onChange={(e) => setPassword(e.target.value)}

              placeholder="••••••••"

              className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"

            />

          </div>

          <button

            type="submit"

            disabled={loading}

            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors mt-2 shadow-sm disabled:bg-blue-400 disabled:cursor-not-allowed"

          >

            {loading ? 'Connexion en cours...' : 'Se connecter'}

          </button>

        </form>

        {/* Message d'avertissement Admin */}

        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">

          <Lock size={18} className="text-slate-400 shrink-0 mt-0.5" />

          <p className="text-xs text-slate-500 leading-relaxed">

            <span className="font-semibold text-slate-700">Note d'inscription :</span> Aucun compte ne peut être créé publiquement. Les accès étudiants et enseignants sont générés exclusivement par le <span className="font-semibold text-slate-800">Super Administrateur</span> de la faculté.

          </p>

        </div>

      </div>

    </div>

  );

} 