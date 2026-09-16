'use client';

import { useState } from 'react';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function Home() {
  const products: Product[] = [
    { id: 1, title: 'თაბაშირის ხელნაკეთი დეკორი', price: 35, category: 'თაბაშირი', image: '/plaster1.jpg' },
    { id: 2, title: 'ხელნაკეთი სამკაული #1', price: 45, category: 'სამკაული', image: '/necklace1.jpg' },
    { id: 3, title: 'ხელნაკეთი სამკაული #2', price: 50, category: 'სამკაული', image: '/necklace2.jpg' },
    { id: 4, title: 'საავტორო ნახატი', price: 120, category: 'ნახატები', image: '/painting1.jpg' },
  ];

  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState<'catalog' | 'cart' | 'checkout'>('catalog');

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('ნაღდი ანგარიშსწორება ადგილზე');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const itemsDescription = cart.map(i => `${i.title} (x${i.quantity})`).join(', ');

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          phone,
          address,
          items: itemsDescription,
          totalPrice,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage('შეკვეთა წარმატებით გაიგზავნა მესენჯერში!');
        setCart([]);
        setCustomerName('');
        setPhone('');
        setAddress('');
      } else {
        setMessage('შეცდომა: ' + data.error);
      }
    } catch (err) {
      setMessage('სერვერთან კავშირის შეცდომა');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#2F3E32] pb-20">
      {/* ჰედერი */}
      <header className="bg-white border-b border-[#E8E2D5] sticky top-0 z-50 shadow-xs">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/Logo.jpg" 
              alt="Lika's Workshop" 
              className="w-12 h-12 rounded-full object-cover border-2 border-[#D4A5B8] shadow-xs"
            />
            <div>
              <h1 className="font-serif font-bold text-lg text-[#2F3E32]">Lika's Workshop</h1>
              <p className="text-xs text-[#586F5D]">ხელნაკეთი ნივთები & სამკაულები</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setStep('catalog')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                step === 'catalog' ? 'bg-[#586F5D] text-white shadow-xs' : 'bg-[#F2ECE1] text-[#586F5D] hover:bg-[#E8E2D5]'
              }`}
            >
              კატალოგი
            </button>
            <button 
              onClick={() => setStep('cart')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer relative ${
                step === 'cart' || step === 'checkout' ? 'bg-[#586F5D] text-white shadow-xs' : 'bg-[#F2ECE1] text-[#586F5D] hover:bg-[#E8E2D5]'
              }`}
            >
              კალათა ({cart.reduce((acc, item) => acc + item.quantity, 0)})
            </button>
          </div>
        </div>
      </header>

      {/* ძირითადი კონტენტი */}
      <div className="max-w-6xl mx-auto px-6 mt-10">
        {step === 'catalog' && (
          <div>
            <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-3xl font-serif font-bold text-[#2F3E32]">ჩვენი კოლექცია</h2>
                <p className="text-xs text-[#586F5D] mt-1">აირჩიეთ სასურველი ხელნაკეთი ნივთი</p>
              </div>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs bg-[#D4A5B8] hover:bg-[#C293A6] text-white px-4 py-2.5 rounded-xl font-medium transition flex items-center gap-2 shadow-xs"
              >
                მოგვწერეთ მესენჯერში 💬
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-2xl border border-[#E8E2D5] shadow-xs overflow-hidden flex flex-col hover:shadow-md transition duration-300">
                  <div className="h-56 bg-[#F2ECE1] relative overflow-hidden">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-bold text-[#586F5D] shadow-xs">
                      {product.category}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-sm text-[#2F3E32] line-clamp-1">{product.title}</h3>
                      <p className="text-base font-bold text-[#586F5D] mt-2">{product.price} ₾</p>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="mt-5 w-full bg-[#D4A5B8] hover:bg-[#C293A6] text-white py-3 rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
                    >
                      კალათაში დამატება
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'cart' && (
          <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl border border-[#E8E2D5] shadow-sm">
            <h2 className="text-2xl font-serif font-bold text-[#2F3E32] mb-6">თქვენი კალათა</h2>
            {cart.length === 0 ? (
              <div className="text-center py-16 text-[#7A8A7C]">
                <p className="text-sm font-medium">კალათა ცარიელია</p>
                <button 
                  onClick={() => setStep('catalog')}
                  className="mt-4 text-xs bg-[#F2ECE1] text-[#586F5D] px-4 py-2 rounded-xl font-semibold hover:bg-[#E8E2D5] transition cursor-pointer"
                >
                  კატალოგში დაბრუნება
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-4 p-4 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D5]">
                    <img src={item.image} alt={item.title} className="w-14 h-14 object-cover rounded-xl shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold font-serif text-[#2F3E32] truncate">{item.title}</h4>
                      <p className="text-xs text-[#586F5D] font-semibold mt-0.5">{item.price * item.quantity} ₾</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-[#E8E2D5]">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 text-xs font-bold cursor-pointer text-[#2F3E32] hover:bg-[#FAF8F5] rounded-md">-</button>
                      <span className="text-xs font-semibold w-4 text-center text-[#2F3E32]">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 text-xs font-bold cursor-pointer text-[#2F3E32] hover:bg-[#FAF8F5] rounded-md">+</button>
                    </div>
                  </div>
                ))}

                <div className="pt-6 border-t border-[#E8E2D5] flex justify-between items-center">
                  <span className="text-sm font-medium text-[#7A8A7C]">სულ გადასახდელი:</span>
                  <span className="text-2xl font-bold text-[#586F5D]">{totalPrice} ₾</span>
                </div>

                <button
                  onClick={() => setStep('checkout')}
                  className="w-full bg-[#D4A5B8] hover:bg-[#C293A6] text-white py-3.5 rounded-2xl text-xs font-semibold transition cursor-pointer shadow-md mt-4"
                >
                  შეკვეთის გაფორმებაზე გადასვლა
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'checkout' && (
          <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl border border-[#E8E2D5] shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-[#2F3E32]">შეკვეთის გაფორმება & გადახდა</h2>
              <button onClick={() => setStep('cart')} className="text-xs text-[#7A8A7C] underline cursor-pointer">← უკან</button>
            </div>

            {message && (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-medium border border-emerald-200">
                {message}
              </div>
            )}

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#586F5D] mb-1.5">სახელი და გვარი</label>
                <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} required className="w-full p-3.5 border border-[#E8E2D5] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#D4A5B8] bg-[#FAF8F5]" placeholder="შეიყვანეთ სახელი..." />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#586F5D] mb-1.5">ტელეფონის ნომერი</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full p-3.5 border border-[#E8E2D5] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#D4A5B8] bg-[#FAF8F5]" placeholder="5XX XX XX XX" />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#586F5D] mb-1.5">მისამართი</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} required className="w-full p-3.5 border border-[#E8E2D5] rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#D4A5B8] bg-[#FAF8F5]" placeholder="ქალაქი, ქუჩა..." />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#586F5D] mb-1.5">გადახდის მეთოდი</label>
                <select 
                  value={paymentMethod} 
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full p-3.5 border border-[#E8E2D5] rounded-2xl text-sm outline-none bg-[#FAF8F5] focus:ring-2 focus:ring-[#D4A5B8]"
                >
                  <option value="ნაღდი ანგარიშსწორება ადგილზე">ნაღდი ანგარიშსწორება ადგილზე</option>
                  <option value="საბანკო გადარიცხვა">საბანკო გადარიცხვა</option>
                </select>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-2xl flex justify-between items-center border border-[#E8E2D5]">
                <span className="text-xs text-[#7A8A7C]">სულ თანხა:</span>
                <span className="text-2xl font-bold text-[#586F5D]">{totalPrice} ₾</span>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#586F5D] hover:bg-[#495B4D] text-white py-4 rounded-2xl text-xs font-semibold transition cursor-pointer shadow-md"
              >
                {loading ? 'იგზავნება მესენჯერში...' : 'შეკვეთის დადასტურება და გაგზავნა'}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}