'use client';

import { useState } from 'react';
import Image from 'next/image';

interface CartItem {
  id: string | number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export default function Home() {
  // მაგალითისთვის: საწყისი კალათა ან პროდუქტები (შეგიძლიათ შეცვალოთ თქვენი მდგომარეობით)
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 1,
      title: 'ხელნაკეთი ყელსაბამი',
      price: 45,
      quantity: 1,
      image: '/necklace1.jpg'
    }
  ]);

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');

  // შეკვეთის ფორმის ველები
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // რაოდენობის შეცვლა (+ / -)
  const updateQuantity = (id: string | number, delta: number) => {
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

  // შეკვეთის გაგზავნა მესენჯერში API-ის მეშვეობით
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
    <main className="min-h-screen bg-[#F9F6F0] p-6">
      {/* ჰედერი ლოგოთი და სათაურით */}
      <header className="max-w-2xl mx-auto bg-white shadow-sm rounded-2xl p-4 mb-6 flex items-center justify-between border border-[#E5DEC9]">
        <div className="flex items-center gap-4">
          <img 
            src="/Logo.jpg" 
            alt="Lika's Workshop Logo" 
            className="w-12 h-12 rounded-full object-cover border-2 border-[#D8A7B1] shadow-sm"
          />
          <div>
            <h1 className="text-xl font-bold font-serif text-[#2A342B]">Lika's Workshop</h1>
            <p className="text-xs text-[#627263]">ხელნაკეთი ნივთები & მენეჯერი</p>
          </div>
        </div>
        <div className="text-sm font-semibold text-[#3F4E3F] bg-[#E5DEC9]/40 px-3 py-1.5 rounded-xl">
          კალათა: {cart.reduce((acc, item) => acc + item.quantity, 0)}
        </div>
      </header>

      {/* ძირითადი კონტენტი */}
      <div className="max-w-2xl mx-auto">
        {step === 'checkout' ? (
          /* STAGE 2: CHECKOUT FORM */
          <div className="bg-white p-6 rounded-2xl border border-[#E5DEC9] shadow-sm space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-serif font-bold text-[#2A342B]">შეკვეთის გაფორმება</h2>
              <button 
                onClick={() => setStep('cart')}
                className="text-xs text-[#627263] underline cursor-pointer hover:text-[#3F4E3F]"
              >
                ← უკან კალათაში
              </button>
            </div>

            {message && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium">
                {message}
              </div>
            )}

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#627263] mb-1">სახელი და გვარი</label>
                <input 
                  type="text" 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)} 
                  required
                  className="w-full p-3 border border-[#E5DEC9] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D8A7B1]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#627263] mb-1">ტელეფონის ნომერი</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required
                  className="w-full p-3 border border-[#E5DEC9] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D8A7B1]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#627263] mb-1">მისამართი</label>
                <input 
                  type="text" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  required
                  className="w-full p-3 border border-[#E5DEC9] rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#D8A7B1]"
                />
              </div>

              <div className="p-4 bg-[#F9F6F0] rounded-xl space-y-1">
                <p className="text-xs text-[#627263]">სრული თანხა გადასახდელი:</p>
                <p className="text-xl font-bold text-[#3F4E3F]">{totalPrice} ₾</p>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#C98B9B] hover:bg-[#B87D8B] text-white font-semibold py-3.5 rounded-2xl transition-all shadow-md text-xs cursor-pointer"
              >
                {loading ? 'იგზავნება მესენჯერში...' : 'შეკვეთის დადასტურება'}
              </button>
            </form>
          </div>
        ) : (
          /* STAGE 1: CART ITEMS LIST */
          cart.length === 0 ? (
            <div className="text-center py-24 text-[#627263] bg-white rounded-2xl border border-[#E5DEC9] p-6 shadow-sm">
              <p className="text-base font-serif font-bold text-[#3F4E3F]">კალათა ცარიელია</p>
              <p className="text-xs mt-1 text-[#7A8A7C]">თქვენი ხელნაკეთი ნივთები აქ გამოჩნდება</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E5DEC9] shadow-sm">
                    <img src={item.image} alt={item.title} className="w-14 h-14 object-cover rounded-xl bg-[#F2EFE9] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-bold text-sm text-[#2A342B] truncate">{item.title}</h4>
                      <p className="text-xs text-[#3F4E3F] font-semibold mt-0.5">{item.price * item.quantity} ₾</p>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 bg-[#F9F6F0] border border-[#D8A7B1] rounded-lg text-xs font-bold text-[#3F4E3F] flex items-center justify-center hover:bg-[#D8A7B1]/20 transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="text-xs font-semibold text-[#334135] w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 bg-[#F9F6F0] border border-[#D8A7B1] rounded-lg text-xs font-bold text-[#3F4E3F] flex items-center justify-center hover:bg-[#D8A7B1]/20 transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Footer with Checkout Transition */}
              <div className="p-6 bg-white rounded-2xl border border-[#E5DEC9] shadow-sm space-y-4 mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-[#627263]">სულ თანხა:</span>
                  <span className="text-2xl font-bold text-[#3F4E3F]">{totalPrice} ₾</span>
                </div>
                <button
                  onClick={() => setStep('checkout')}
                  className="block w-full text-center bg-[#C98B9B] hover:bg-[#B87D8B] text-white font-semibold py-3.5 rounded-2xl transition-all shadow-md text-xs cursor-pointer"
                >
                  შეკვეთის გაფორმება
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </main>
  );
}