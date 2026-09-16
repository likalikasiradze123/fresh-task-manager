'use client';

import { useState } from 'react';

interface Product {
  id: number;
  title: string;
  price: number;
  category: 'თაბაშირი' | 'სამკაული' | 'ნახატები';
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function Home() {
  // პროდუქტების კატალოგი (თაბაშირის ხელნაკეთობები, სამკაულები და ნახატები)
  const products: Product[] = [
    { id: 1, title: 'თაბაშირის დეკორატიული ფიგურა', price: 35, category: 'თაბაშირი', image: '/plaster1.jpg' },
    { id: 2, title: 'ხელნაკეთი სამკაული #1', price: 45, category: 'სამკაული', image: '/necklace1.jpg' },
    { id: 3, title: 'ხელნაკეთი სამკაული #2', price: 50, category: 'სამკაული', image: '/necklace2.jpg' },
    { id: 4, title: 'საავტორო ნახატი კანვასზე', price: 120, category: 'ნახატები', image: '/painting1.jpg' },
  ];

  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState<'catalog' | 'cart' | 'checkout'>('catalog');

  // შეკვეთის ფორმის ველები
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('ნაღდი ანგარიშსწორება ადგილზე');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // კალათაში დამატება
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

  // რაოდენობის შეცვლა
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

  // შეკვეთის გაგზავნა API-ზე / Messenger Webhook-ზე
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
    <main className="min-h-screen bg-[#F9F6F0] p-4 md:p-6 pb-20">
      {/* ჰედერი ლოგოთი და ნავიგაციით */}
      <header className="max-w-4xl mx-auto bg-white shadow-sm rounded-2xl p-4 mb-6 flex items-center justify-between border border-[#E5DEC9]">
        <div className="flex items-center gap-3">
          <img 
            src="/Logo.jpg" 
            alt="Lika's Workshop Logo" 
            className="w-12 h-12 rounded-full object-cover border-2 border-[#D8A7B1] shadow-sm"
          />
          <div>
            <h1 className="text-lg font-bold font-serif text-[#2A342B]">Lika's Workshop</h1>
            <p className="text-xs text-[#627263]">თაბაშირი, სამკაულები & ნახატები</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setStep('catalog')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
              step === 'catalog' ? 'bg-[#3F4E3F] text-white' : 'bg-[#F2EFE9] text-[#3F4E3F]'
            }`}
          >
            კატალოგი
          </button>
          <button 
            onClick={() => setStep('cart')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer relative ${
              step === 'cart' || step === 'checkout' ? 'bg-[#3F4E3F] text-white' : 'bg-[#F2EFE9] text-[#3F4E3F]'
            }`}
          >
            კალათა ({cart.reduce((acc, item) => acc + item.quantity, 0)})
          </button>
        </div>
      </header>

      {/* ძირითადი კონტენტი */}
      <div className="max-w-4xl mx-auto">
        {step === 'catalog' && (
          <div>
            <h2 className="text-xl font-serif font-bold text-[#2A342B] mb-6">ხელნაკეთი კოლექცია</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-2xl border border-[#E5DEC9] shadow-sm overflow-hidden flex flex-col">
                  <div className="h-48 bg-[#F2EFE9] relative">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-semibold text-[#3F4E3F]">
                      {product.category}
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-sm text-[#2A342B]">{product.title}</h3>
                      <p className="text-sm font-semibold text-[#3F4E3F] mt-1">{product.price} ₾</p>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="mt-4 w-full bg-[#C98B9B] hover:bg-[#B87D8B] text-white py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm"
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
          <div className="bg-white p-6 rounded-2xl border border-[#E5DEC9] shadow-sm">
            <h2 className="text-xl font-serif font-bold text-[#2A342B] mb-4">თქვენი კალათა</h2>
            {cart.length === 0 ? (
              <div className="text-center py-16 text-[#627263]">
                <p className="text-sm font-medium">კალათა ცარიელია</p>
                <button 
                  onClick={() => setStep('catalog')}
                  className="mt-3 text-xs text-[#C98B9B] underline font-semibold cursor-pointer"
                >
                  კატალოგში დაბრუნება
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-4 p-3 bg-[#F9F6F0] rounded-xl border border-[#E5DEC9]">
                    <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold font-serif text-[#2A342B] truncate">{item.title}</h4>
                      <p className="text-xs text-[#3F4E3F] font-semibold">{item.price * item.quantity} ₾</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 bg-white border border-[#D8A7B1] rounded-md text-xs font-bold cursor-pointer">-</button>
                      <span className="text-xs font-semibold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 bg-white border border-[#D8A7B1] rounded-md text-xs font-bold cursor-pointer">+</button>
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-[#E5DEC9] flex justify-between items-center">
                  <span className="text-sm font-medium text-[#627263]">სულ გადასახდელი:</span>
                  <span className="text-xl font-bold text-[#3F4E3F]">{totalPrice} ₾</span>
                </div>

                <button
                  onClick={() => setStep('checkout')}
                  className="w-full bg-[#C98B9B] hover:bg-[#B87D8B] text-white py-3 rounded-xl text-xs font-semibold transition cursor-pointer shadow-md"
                >
                  შეკვეთის გაფორმებაზე გადასვლა
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'checkout' && (
          <div className="bg-white p-6 rounded-2xl border border-[#E5DEC9] shadow-sm space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-serif font-bold text-[#2A342B]">შეკვეთის გაფორმება & გადახდა</h2>
              <button onClick={() => setStep('cart')} className="text-xs text-[#627263] underline cursor-pointer">← უკან</button>
            </div>

            {message && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium">
                {message}
              </div>
            )}

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#627263] mb-1">სახელი და გვარი</label>
                <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} required className="w-full p-3 border border-[#E5DEC9] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D8A7B1]" />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#627263] mb-1">ტელეფონის ნომერი</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} required className="w-full p-3 border border-[#E5DEC9] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D8A7B1]" />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#627263] mb-1">მისამართი</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} required className="w-full p-3 border border-[#E5DEC9] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D8A7B1]" />
              </div>

              {/* გადახდის მეთოდები */}
              <div>
                <label className="block text-xs font-medium text-[#627263] mb-1">გადახდის მეთოდი</label>
                <select 
                  value={paymentMethod} 
                  onChange={e => setPaymentMethod(e.target.value)}
                  className="w-full p-3 border border-[#E5DEC9] rounded-xl text-sm outline-none bg-white focus:ring-2 focus:ring-[#D8A7B1]"
                >
                  <option value="ნაღდი ანგარიშსწორება ადგილზე">ნაღდი ანგარიშსწორება ადგილზე</option>
                  <option value="საბანკო გადარიცხვა">საბანკო გადარიცხვა</option>
                </select>
              </div>

              <div className="p-4 bg-[#F9F6F0] rounded-xl flex justify-between items-center">
                <span className="text-xs text-[#627263]">სულ თანხა:</span>
                <span className="text-xl font-bold text-[#3F4E3F]">{totalPrice} ₾</span>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#C98B9B] hover:bg-[#B87D8B] text-white py-3.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-md"
              >
                {loading ? 'იგზავნება...' : 'შეკვეთის დადასტურება და გაგზავნა'}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}