import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PetList } from './components/PetList';
import { AiMatchModal } from './components/AiMatchModal';
import { Store } from './components/Store';
import { Donations } from './components/Donations';
import { AppointmentsModal } from './components/AppointmentsModal';
import { LiveChat } from './components/LiveChat';
import { AuthModal } from './components/AuthModal';
import { Pet, Product, DonationCampaign, User } from './types';
import { api } from './services/api';
import { ShoppingBag, X, Trash2, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

const INITIAL_PETS: Pet[] = [
  {
    id: 'mosquetero-1',
    name: 'D’Artagnan',
    species: 'DOG',
    breed: 'Mestizo de Labrador',
    ageMonths: 18,
    size: 'MEDIUM',
    gender: 'MALE',
    description: 'Valiente, leal y súper sociable. Rescatado en zona oeste, disfruta de los paseos al aire libre y jugar a la pelota.',
    photos: ['https://images.unsplash.com/photo-1543466835-00a7907e9de1'],
    status: 'AVAILABLE',
    isVaccinated: true,
    isNeutered: true,
    energyLevel: 'HIGH',
  },
  {
    id: 'mosquetero-2',
    name: 'Athos',
    species: 'CAT',
    breed: 'Siamés Mix',
    ageMonths: 24,
    size: 'SMALL',
    gender: 'MALE',
    description: 'Tranquilo, noble y observador. Disfruta de tardes de sol, caricias suaves y la compañía calma.',
    photos: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba'],
    status: 'AVAILABLE',
    isVaccinated: true,
    isNeutered: true,
    energyLevel: 'LOW',
  },
  {
    id: 'mosquetero-3',
    name: 'Porthos',
    species: 'DOG',
    breed: 'Golden Retriever Mix',
    ageMonths: 36,
    size: 'LARGE',
    gender: 'MALE',
    description: 'El bonachón del refugio. Gran apetito, corazón enorme y excelente paciencia para convivir con niños.',
    photos: ['https://images.unsplash.com/photo-1552053831-71594a27632d'],
    status: 'AVAILABLE',
    isVaccinated: true,
    isNeutered: true,
    energyLevel: 'MEDIUM',
  },
  {
    id: 'mosquetero-4',
    name: 'Aramis',
    species: 'CAT',
    breed: 'Europeo Común Atigrado',
    ageMonths: 12,
    size: 'SMALL',
    gender: 'MALE',
    description: 'Curioso y elegante. Le apasionan los rascadores altos y perseguir plumeros con gran agilidad.',
    photos: ['https://images.unsplash.com/photo-1573865526739-10659fec78a5'],
    status: 'AVAILABLE',
    isVaccinated: true,
    isNeutered: true,
    energyLevel: 'MEDIUM',
  },
  {
    id: 'mosquetero-5',
    name: 'Milady',
    species: 'DOG',
    breed: 'Border Collie Mix',
    ageMonths: 20,
    size: 'MEDIUM',
    gender: 'FEMALE',
    description: 'Súper inteligente y atenta. Aprende trucos rápidamente y necesita una familia activa dispuesta a entrenar.',
    photos: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb'],
    status: 'AVAILABLE',
    isVaccinated: true,
    isNeutered: true,
    energyLevel: 'HIGH',
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Alimento Super Premium Adultos 15kg',
    description: 'Nutrición con 28% de proteína real para perros enérgicos.',
    price: 36500,
    stock: 20,
    category: 'Alimentos',
    imageUrl: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd',
  },
  {
    id: 'prod-2',
    title: 'Cama Ortopédica Antiestrés',
    description: 'Relleno de memory foam lavable con tela impermeable.',
    price: 24900,
    stock: 15,
    category: 'Accesorios',
    imageUrl: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0',
  },
  {
    id: 'prod-3',
    title: 'Arnés Ergonómico Reflectivo de Seguridad',
    description: 'Distribuye la presión en el pecho evitando lesiones traqueales.',
    price: 14200,
    stock: 35,
    category: 'Paseo',
    imageUrl: 'https://images.unsplash.com/photo-1535294435445-d7249524ef2e',
  },
  {
    id: 'prod-4',
    title: 'Rascador Castillo Multinivel para Gatos',
    description: 'Con postes de sisal natural y cuevas acolchadas.',
    price: 42000,
    stock: 8,
    category: 'Gatos',
    imageUrl: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f',
  },
];

const INITIAL_CAMPAIGNS: DonationCampaign[] = [
  {
    id: 'camp-1',
    title: 'Cirugía Traumatológica de D’Artagnan',
    description: 'Tratamiento de fractura femoral tras ser rescatado. Incluye clavos ortopédicos y rehabilitación.',
    targetAmount: 380000,
    raisedAmount: 260000,
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee',
  },
  {
    id: 'camp-2',
    title: 'Campaña Masiva de Castración Solidaria',
    description: 'Meta de 100 esterilizaciones gratuitas en barrios populares para control ético de sobrepoblación.',
    targetAmount: 500000,
    raisedAmount: 345000,
    imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c',
  },
];

export function App() {
  const [activeTab, setActiveTab] = useState('adoptions');
  const [pets, setPets] = useState<Pet[]>(INITIAL_PETS);
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [campaigns, setCampaigns] = useState<DonationCampaign[]>(INITIAL_CAMPAIGNS);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  // Cart
  const [cart, setCart] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // User & Modals
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isVetOpen, setIsVetOpen] = useState(false);

  useEffect(() => {
    // Intentar traer mascotas de la API
    api.get('/pets')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setPets(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.product.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartTotal = cart.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);

  const handleDonateToCampaign = (campaignId: string, amount: number) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, raisedAmount: c.raisedAmount + amount } : c))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'vet') {
            setIsVetOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        openCart={() => setIsCartOpen(true)}
        user={user}
        openAuth={() => setIsAuthOpen(true)}
        logout={() => setUser(null)}
      />

      <main className="flex-1">
        {activeTab === 'adoptions' && (
          <>
            <Hero
              onExplore={() => {
                const el = document.getElementById('adoptions-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onDonate={() => setActiveTab('donations')}
            />
            <div id="adoptions-section">
              <PetList
                pets={pets}
                onSelectPetForMatch={(pet) => setSelectedPet(pet)}
              />
            </div>
          </>
        )}

        {activeTab === 'store' && (
          <Store
            products={products}
            addToCart={addToCart}
            openCart={() => setIsCartOpen(true)}
          />
        )}

        {activeTab === 'donations' && (
          <Donations
            campaigns={campaigns}
            onDonateToCampaign={handleDonateToCampaign}
          />
        )}
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-orange-600" />
                  <h3 className="font-extrabold text-lg text-slate-900">Carrito Solidario</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-sm">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  Tu carrito está vacío.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-[60vh] overflow-y-auto mt-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-900 line-clamp-1">{item.product.title}</p>
                        <p className="text-[11px] text-slate-500">
                          {item.quantity} x ${item.product.price.toLocaleString('es-AR')}
                        </p>
                      </div>
                      <span className="font-bold text-xs text-slate-900">
                        ${(item.quantity * item.product.price).toLocaleString('es-AR')}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-slate-100 pt-4">
                <div className="flex justify-between items-center text-sm font-bold mb-4">
                  <span>Total Donación / Compra:</span>
                  <span className="text-xl font-extrabold text-orange-600">
                    ${cartTotal.toLocaleString('es-AR')}
                  </span>
                </div>
                <button
                  onClick={() => {
                    alert('Redirigiendo a checkout seguro de Mercado Pago Checkout Pro...');
                    setCart([]);
                    setIsCartOpen(false);
                  }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition"
                >
                  <span>Pagar con Mercado Pago</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedPet && (
        <AiMatchModal
          pet={selectedPet}
          onClose={() => setSelectedPet(null)}
        />
      )}

      {isVetOpen && (
        <AppointmentsModal
          onClose={() => setIsVetOpen(false)}
        />
      )}

      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          setUser={(u) => setUser(u)}
        />
      )}

      {/* Floating Live Chat */}
      <LiveChat />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 text-center">
        <p className="font-semibold text-slate-300">
          🐾 Los 5 Mosqueteros — Plataforma Integral de Rescate y Bienestar Animal
        </p>
        <p className="mt-1 text-slate-500">
          Desarrollado con NestJS, React, Prisma, Tailwind CSS y Google Gemini AI.
        </p>
      </footer>
    </div>
  );
}
