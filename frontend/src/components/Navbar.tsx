import React from 'react';
import { Heart, ShoppingBag, MessageSquare, Calendar, ShieldCheck, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  openCart: () => void;
  user: User | null;
  openAuth: () => void;
  logout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  user,
  openAuth,
  logout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('adoptions')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:scale-105 transition">
            <span className="text-2xl">🐾</span>
          </div>
          <div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-slate-900 via-orange-950 to-orange-600 bg-clip-text text-transparent block tracking-tight">
              Los 5 Mosqueteros
            </span>
            <span className="text-xs font-semibold text-orange-600 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 inline" /> Rescate & Adopción con IA
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-50 p-1.5 rounded-full border border-slate-200/80">
          <button
            onClick={() => setActiveTab('adoptions')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              activeTab === 'adoptions'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mascotas & Adopción
          </button>
          <button
            onClick={() => setActiveTab('store')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              activeTab === 'store'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tienda Solidaria
          </button>
          <button
            onClick={() => setActiveTab('donations')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              activeTab === 'donations'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Campañas de Rescate
          </button>
          <button
            onClick={() => setActiveTab('vet')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              activeTab === 'vet'
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Turnos Veterinarios
          </button>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={openCart}
            className="relative p-2.5 rounded-full text-slate-700 hover:bg-slate-100 transition"
            title="Carrito de compras"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-none">{user.fullName}</p>
                <span className="text-[10px] text-orange-600 font-medium uppercase tracking-wider">{user.role}</span>
              </div>
              <button
                onClick={logout}
                className="text-xs text-slate-500 hover:text-red-600 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-red-200 transition"
              >
                Salir
              </button>
            </div>
          ) : (
            <button
              onClick={openAuth}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition"
            >
              <UserIcon className="w-4 h-4" />
              <span>Ingresar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
