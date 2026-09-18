'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  password?: string;
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('ყველა');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [step, setStep] = useState<'catalog' | 'checkout' | 'success' | 'auth' | 'profile'>('catalog');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // ფორმების ველები
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // საიტის ჩატვირთვისას ვამოწმებთ, არის თუ არა მომხმარებელი უკვე შესული
  useEffect(() => {
    const savedUser = localStorage.getItem('likas_current_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const products: Product[] = [
    { id: 1, title: 'თაბაშირის ხელნაკეთი დეკორი', price: 35, category: 'თაბაშირი', image: '/plaster1.jpg', description: 'უნიკალური დიზაინის თაბაშირის დეკორატიული ფიგურა თქვენი სახლისთვის.' },
    { id: 2, title: 'ხელნაკეთი სამკაული #1', price: 45, category: 'სამკაული', image: '/necklace1.jpg', description: 'გამორჩეული და ელეგანტური ხელნაკეთი ყელსაბამი.' },
    { id: 3, title: 'ხელნაკეთი სამკაული #2', price: 50, category: 'სამკაული', image: '/necklace2.jpg', description: 'დანაოჭებული მარგალიტისა და მძივების კომბინაცია განსაკუთრებული საღამოებისთვის.' },
    { id: 4, title: 'საავტორო ნახატი', price: 120, category: 'ნახატები', image: '/painting1.jpg', description: 'ხელნაკეთი საავტორო ტილო, შესრულებული მაღალი ხარისხის საღებავებით.' },
  ];

  const categories = ['ყველა', 'სამკაული', 'თაბაშირი', 'ნახატები'];
  const filteredProducts = activeCategory === 'ყველა' ? products : products.filter(p => p.category === activeCategory);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // რეგისტრაციის და შესვლის რეალური ლოგიკა
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const users: User[] = JSON.parse(localStorage.getItem('likas_users') || '[]');

    if (authMode === 'register') {
      // ვამოწმებთ, არის თუ არა უკვე ეს ემაილი რეგისტრირებული
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        setAuthError('მომხმარებელი ამ ელ-ფოსტით უკვე არსებობს!');
        return;
      }

      const newUser: User = { name, email, phone, address, password };
      users.push(newUser);
      localStorage.setItem('likas_users', JSON.stringify(users));
      localStorage.setItem('likas_current_user', JSON.stringify(newUser));
      
      setCurrentUser(newUser);
      setStep('profile');
    } else {
      // შესვლის (Login) ლოგიკა
      const foundUser = users.find(u => u.email === email && u.password === password);
      if (!foundUser) {
        setAuthError('არასწორი ელ-ფოსტა ან პაროლი!');
        return;
      }

      localStorage.setItem('likas_current_user', JSON.stringify(foundUser));
      setCurrentUser(foundUser);
      setStep('profile');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('likas_current_user');
    setCurrentUser(null);
    setStep('catalog');
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const itemsList = cart.map(i => `${i.title} (რაოდენობა: ${i.quantity}, ფასი: ${i.price * i.quantity}₾)`).join(', ');
      
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: currentUser?.name || name,
          phone: currentUser?.phone || phone,
          address: currentUser?.address || address,
          comment,
          items: itemsList,
          totalPrice: totalAmount,
        })
      });

      const data = await res.json();
      if (data.success) {
        setStep('success');
        setCart([]);
      } else {
        alert('შეცდომა შეკვეთის გაგზავნისას: ' + data.error);
      }
    } catch (err) {
      alert('სერვერთან კავშირის შეცდომა.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#2F3E32] font-sans selection:bg-[#D4A5B8] selection:text-white">
      {/* ზედა ჰედერი */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#E8E2D5] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setStep('catalog'); setIsCartOpen(false); }}>
            <img src="/Logo.jpg" alt="Lika's Workshop" className="w-12 h-12 rounded-full object-cover border-2 border-[#D4A5B8] shadow-sm" />
            <div>
              <h1 className="font-serif font-bold text-lg text-[#2F3E32]">Lika's Workshop</h1>
              <p className="text-xs text-[#7A8A7C]">ხელნაკეთი ნივთები & სამკაულები</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <button 
                onClick={() => setStep('profile')}
                className="bg-[#F2ECE1] hover:bg-[#E8E2D5] text-[#586F5D] px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer"
              >
                👤 {currentUser.name}
              </button>
            ) : (
              <button 
                onClick={() => setStep('auth')}
                className="bg-[#F2ECE1] hover:bg-[#E8E2D5] text-[#586F5D] px-4 py-2.5 rounded-2xl text-xs font-bold transition cursor-pointer"
              >
                🔑 შესვლა / რეგისტრაცია
              </button>
            )}

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative bg-[#586F5D] text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs hover:bg-[#495B4D]"
            >
              <span>🛒 კალათა</span>
              {totalItemsCount > 0 && (
                <span className="bg-[#D4A5B8] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* მთავარი კონტენტი */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {step === 'catalog' && (
          <div>
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2F3E32]">ჩვენი კოლექცია</h2>
              <p className="text-xs text-[#7A8A7C]">აღმოაჩინეთ უნიკალური ხელნაკეთი ნივთები შექმნილი სიყვარულით.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    activeCategory === cat ? 'bg-[#586F5D] text-white shadow-md' : 'bg-white text-[#586F5D] border border-[#E8E2D5] hover:bg-[#F2ECE1]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-3xl border border-[#E8E2D5] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
                  <div className="w-full h-64 bg-[#F2ECE1] relative overflow-hidden">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-lg text-[11px] font-bold text-[#586F5D] shadow-xs">{product.category}</span>
                  </div>
                  <div className="p-6 flex flex-col justify-between flex-1">
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#2F3E32] mb-2">{product.title}</h3>
                      <p className="text-xs text-[#7A8A7C] line-clamp-2 mb-4">{product.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-[#FAF8F5]">
                      <span className="text-lg font-bold text-[#586F5D]">{product.price} ₾</span>
                      <button onClick={() => addToCart(product)} className="bg-[#D4A5B8] hover:bg-[#C293A6] text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer">
                        კალათაში 🛍️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* რეალური რეგისტრაციის / შესვლის ფორმა */}
        {step === 'auth' && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-[#E8E2D5] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif font-bold text-[#2F3E32]">{authMode === 'register' ? 'რეგისტრაცია' : 'შესვლა'}</h2>
              <button 
                onClick={() => { setAuthMode(authMode === 'register' ? 'login' : 'register'); setAuthError(''); }} 
                className="text-xs text-[#D4A5B8] font-bold underline cursor-pointer"
              >
                {authMode === 'register' ? 'უკვე გაქვთ ანგარიში? შესვლა' : 'არ გაქვთ ანგარიში? რეგისტრაცია'}
              </button>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-[#586F5D] mb-1">სახელი და გვარი</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="ნინო ბერიძე" className="w-full p-3.5 bg-[#FAF8F5] border border-[#E8E2D5] rounded-xl text-xs outline-none" />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-[#586F5D] mb-1">ელ-ფოსტა</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="example@mail.com" className="w-full p-3.5 bg-[#FAF8F5] border border-[#E8E2D5] rounded-xl text-xs outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#586F5D] mb-1">პაროლი</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full p-3.5 bg-[#FAF8F5] border border-[#E8E2D5] rounded-xl text-xs outline-none" />
              </div>

              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#586F5D] mb-1">ტელეფონი</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="5XX XX XX XX" className="w-full p-3.5 bg-[#FAF8F5] border border-[#E8E2D5] rounded-xl text-xs outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#586F5D] mb-1">მისამართი</label>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="ქალაქი, ქუჩა..." className="w-full p-3.5 bg-[#FAF8F5] border border-[#E8E2D5] rounded-xl text-xs outline-none" />
                  </div>
                </>
              )}

              <button type="submit" className="w-full bg-[#586F5D] hover:bg-[#495B4D] text-white py-3.5 rounded-xl text-xs font-bold transition cursor-pointer mt-4">
                {authMode === 'register' ? 'რეგისტრაცია' : 'შესვლა'}
              </button>
            </form>
          </div>
        )}

        {/* პირადი კაბინეტი */}
        {step === 'profile' && currentUser && (
          <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl border border-[#E8E2D5] shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-[#E8E2D5] pb-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#2F3E32]">მომხმარებლის კაბინეტი</h2>
                <p className="text-xs text-[#7A8A7C]">მოგესალმებით, {currentUser.name}!</p>
              </div>
              <button onClick={handleLogout} className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-xl font-bold cursor-pointer hover:bg-red-100 transition">
                გასვლა
              </button>
            </div>

            <div className="space-y-3 bg-[#FAF8F5] p-5 rounded-2xl border border-[#E8E2D5]">
              <h3 className="text-xs font-bold text-[#586F5D] uppercase tracking-wider mb-2">პირადი ინფორმაცია</h3>
              <p className="text-xs text-[#2F3E32]"><strong>სახელი:</strong> {currentUser.name}</p>
              <p className="text-xs text-[#2F3E32]"><strong>ელ-ფოსტა:</strong> {currentUser.email}</p>
              <p className="text-xs text-[#2F3E32]"><strong>ტელეფონი:</strong> {currentUser.phone || 'არ არის მითითებული'}</p>
              <p className="text-xs text-[#2F3E32]"><strong>მისამართი:</strong> {currentUser.address || 'არ არის მითითებული'}</p>
            </div>

            <button onClick={() => setStep('catalog')} className="w-full bg-[#586F5D] text-white py-3 rounded-xl text-xs font-bold cursor-pointer">
              კატალოგში დაბრუნება
            </button>
          </div>
        )}

        {/* შეკვეთის გაფორმება */}
        {step === 'checkout' && (
          <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl border border-[#E8E2D5] shadow-sm">
            <button onClick={() => setStep('catalog')} className="text-xs text-[#7A8A7C] mb-6 block cursor-pointer">← უკან</button>
            <h2 className="text-2xl font-serif font-bold text-[#2F3E32] mb-6">შეკვეთის გაფორმება</h2>
            
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#586F5D] mb-1">სახელი და გვარი</label>
                <input type="text" required defaultValue={currentUser?.name} onChange={e => name} placeholder="სახელი" className="w-full p-3.5 bg-[#FAF8F5] border border-[#E8E2D5] rounded-xl text-xs outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#586F5D] mb-1">ტელეფონის ნომერი</label>
                <input type="tel" required defaultValue={currentUser?.phone} placeholder="5XX XX XX XX" className="w-full p-3.5 bg-[#FAF8F5] border border-[#E8E2D5] rounded-xl text-xs outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#586F5D] mb-1">მისამართი</label>
                <input type="text" required defaultValue={currentUser?.address} placeholder="ქალაქი, ქუჩა..." className="w-full p-3.5 bg-[#FAF8F5] border border-[#E8E2D5] rounded-xl text-xs outline-none" />
              </div>

              <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E2D5] flex justify-between items-center">
                <span className="text-xs text-[#7A8A7C]">სულ თანხა:</span>
                <span className="text-xl font-bold text-[#586F5D]">{totalAmount} ₾</span>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[#586F5D] text-white py-4 rounded-xl text-xs font-bold cursor-pointer">
                {loading ? 'იგზავნება...' : 'შეკვეთის დადასტურება'}
              </button>
            </form>
          </div>
        )}

        {/* წარმატებული შეკვეთა */}
        {step === 'success' && (
          <div className="max-w-md mx-auto bg-white p-10 rounded-3xl border border-[#E8E2D5] text-center shadow-sm space-y-4">
            <div className="w-16 h-16 bg-[#586F5D]/10 text-[#586F5D] rounded-full flex items-center justify-center text-2xl mx-auto">✓</div>
            <h2 className="text-2xl font-serif font-bold text-[#2F3E32]">მადლობა შეკვეთისთვის!</h2>
            <p className="text-xs text-[#7A8A7C]">თქვენი შეკვეთა წარმატებით გაიგზავნა.</p>
            <button onClick={() => setStep('catalog')} className="bg-[#586F5D] text-white px-6 py-3 rounded-xl text-xs font-bold cursor-pointer">მთავარ გვერდზე დაბრუნება</button>
          </div>
        )}
      </main>

      {/* კალათის სლაიდერი */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D5]">
              <h3 className="font-serif font-bold text-lg text-[#2F3E32]">თქვენი კალათა</h3>
              <button onClick={() => setIsCartOpen(false)} className="w-8 h-8 rounded-full bg-[#FAF8F5] text-[#7A8A7C] flex items-center justify-center text-xs font-bold cursor-pointer">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-[#7A8A7C] text-xs">კალათა ცარიელია</div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D5]">
                    <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h4 className="font-serif font-bold text-xs text-[#2F3E32] mb-1">{item.title}</h4>
                      <p className="text-xs font-bold text-[#586F5D]">{item.price} ₾</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-[#E8E2D5]">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-5 h-5 text-xs font-bold cursor-pointer">-</button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-5 h-5 text-xs font-bold cursor-pointer">+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-[#E8E2D5] space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#7A8A7C]">სულ თანხა:</span>
                  <span className="text-xl font-bold text-[#586F5D]">{totalAmount} ₾</span>
                </div>
                <button
                  onClick={() => { setIsCartOpen(false); setStep('checkout'); }}
                  className="w-full bg-[#D4A5B8] hover:bg-[#C293A6] text-white py-3.5 rounded-2xl text-xs font-bold transition shadow-md cursor-pointer"
                >
                  შეკვეთის გაფორმება
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}