import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, UserCheck } from 'lucide-react';

export default function MobileNavbar() {
  const navItems = [
    { name: 'Étudiant', path: '/etudiant', icon: <LayoutDashboard size={20} /> },
    { name: 'Prof', path: '/professeur', icon: <UserCheck size={20} /> },
    { name: 'Cours', path: '/cours', icon: <BookOpen size={20} /> },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 text-white border-t border-slate-800 h-16 flex items-center justify-around z-50 px-4">
      {navItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center text-xs font-medium w-16 h-full transition-colors ${
              isActive ? 'text-blue-500' : 'text-slate-400 hover:text-white'
            }`
          }
        >
          {item.icon}
          <span className="mt-1">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
}