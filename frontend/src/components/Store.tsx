import React from 'react';
import { ShoppingBag, Plus, Check } from 'lucide-react';
import { Product } from '../types';

interface StoreProps {
  products: Product[];
  addToCart: (product: Product) => void;
  openCart: () => void;
}

export const Store: React.FC<StoreProps> = ({ products, addToCart, openCart }) => {
  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div>
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">
            100% de las ganancias para rescates
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Tienda Solidaria
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Alimentos, juguetes y accesorios de alta calidad para cuidar a tu mascota y ayudar a los que aún no tienen hogar.
          </p>
        </div>

        <button
          onClick={openCart}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow transition"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Ver Carrito</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="h-48 bg-slate-100 overflow-hidden relative">
                <img
                  src={p.imageUrl || 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd'}
                  alt={p.title}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-0.5 rounded-lg text-[10px] font-bold text-slate-700">
                  {p.category}
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-slate-900 text-base line-clamp-1">{p.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
              <div>
                <span className="text-xs text-slate-400 block font-semibold">Precio</span>
                <span className="text-xl font-extrabold text-slate-900">
                  ${p.price.toLocaleString('es-AR')}
                </span>
              </div>

              <button
                onClick={() => addToCart(p)}
                className="p-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white shadow-sm transition group"
                title="Agregar al carrito"
              >
                <Plus className="w-5 h-5 group-hover:scale-110 transition" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
