'use client';

import { useState } from 'react';
import Footer from './Footer';

interface Product {
  id: number;
  title: string;
  price: number;
  priceText: string;
  category: string;
  image: string;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'ხელნაკეთი ყელსაბამი',
    price: 50,
    priceText: '50 ₾',
    category: 'სამკაულები',
    image: '/necklace1.jpg',
    description: 'ექსკლუზიური ხელნაკეთი ყელსაბამი Lika\'s Workshop-ისგან.',
  },
  {
    id: 2,
    title: 'ძველი ქალაქის პეიზაჟი',
    price: 70,
    priceText: '70 ₾',
    category: 'ნახატები',
    image: '/painting.jpg',
    description: 'ხელით შესრულებული ექსკლუზიური ფერწერული ტილო.',
  },
  {
    id: 3,
    title: 'ხელნაკეთი ყელსაბამი (დიზაინი 2)',
    price: 55,
    priceText: '55 ₾',
    category: 'სამკაულები',
    image: '/necklace2.jpg',
    description: 'უნიკალური დიზაინის ხელნაკეთი აქსესუარი.',
  },
  {
    id: 4,
    title: 'თაბაშირის დეკორატიული ნაკეთობა',
    price: 25,
    priceText: '25 ₾',
    category: 'თაბაშირი',
    image: '/plaster.jpg',
    description: 'ხელით ჩამოსხმული და დამუშავებული თაბაშირის ექსკლუზიური დეკორი.',
  },
];

export default function Home() {
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('ყველა');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // ეტაპების მართვა: 'cart' | 'checkout' | 'success'
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');

  // შეკვეთის ველები
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' ან 'card'

  const categories = ['ყველა', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts =
    selectedCategory === 'ყველა'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
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
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !city) return;
    
    setStep('success');
    setCart([]); // კალათის გასუფთავება
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      if (step === 'success') setStep('cart');
    }, 300);
  };

  return (
    <main className="min-h-screen bg-[#F9F6F0] text-[#334135] font-sans relative pb-20">
      
      {/* Top Bar with Cart Button */}
      <div className="sticky top-0 z-40 bg-[#3F4E3F]/95 backdrop-blur-md border-b border-[#D8A7B1]/30 px-6 py-4 flex justify-between items-center shadow-sm">
        <span className="font-serif text-[#F9F6F0] font-bold text-lg tracking-wide">
          Lika's Workshop
        </span>
        <button
          onClick={() => { setIsCartOpen(true); }}
          className="relative bg-[#C98B9B] hover:bg-[#B87D8B] text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H19m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>კალათა</span>
          {totalItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#F9F6F0] text-[#3F4E3F] font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#3F4E3F] shadow-sm animate-pulse">
              {totalItemsCount}
            </span>
          )}
        </button>
      </div>

      {/* Hero Header */}
      <section className="relative bg-[#3F4E3F] text-[#F9F6F0] py-16 px-4 text-center overflow-hidden border-b-4 border-[#D8A7B1]">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-block text-xs uppercase tracking-widest text-[#F9F6F0] font-semibold bg-[#D8A7B1]/30 border border-[#D8A7B1] px-4 py-1.5 rounded-full shadow-sm">
            ხელნაკეთი ნივთების სახელოსნო
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold mt-4 text-[#F9F6F0] leading-tight">
            ლიკას სახელოსნო
          </h1>
          <p className="mt-3 text-[#E2E8E2] text-base sm:text-lg font-light max-w-xl mx-auto">
            სიყვარულითა და ზრუნვით შექმნილი ექსკლუზიური ხელნაკეთი ნივთები
          </p>
        </div>
      </section>

      {/* Product Showroom Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-[#D8A7B1]/40 pb-6 gap-6">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A342B]">
              ნამუშევრების კოლექცია
            </h2>
            <p className="text-sm text-[#627263] mt-1">
              აირჩიეთ სასურველი კატეგორია ან დაამატეთ ნივთი კალათაში
            </p>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-xs sm:text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-[#3F4E3F] text-[#F9F6F0] shadow-md scale-105'
                    : 'bg-white text-[#526253] hover:bg-[#E5DEC9]/50 border border-[#E5DEC9]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col border border-[#E5DEC9]"
            >
              <div className="relative aspect-square overflow-hidden bg-[#F2EFE9]">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 bg-[#3F4E3F]/90 backdrop-blur-sm text-[#F9F6F0] text-[11px] font-medium px-3 py-1 rounded-md shadow-sm">
                  {product.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#2A342B] group-hover:text-[#B87D8B] transition-colors">
                    {product.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#526253] line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-[#F2EFE9] pt-4">
                  <span className="text-xl font-bold text-[#3F4E3F]">
                    {product.priceText}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-[#C98B9B] hover:bg-[#B87D8B] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>კალათაში</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-4xl mx-auto px-6 py-12 text-center border-t border-[#E5DEC9] my-6">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3F4E3F]">
          სახელოსნოს შესახებ
        </h2>
        <p className="mt-4 text-[#526253] text-base sm:text-lg font-light leading-relaxed">
          „ლიკას სახელოსნო“ არის სივრცე, სადაც თითოეული ნივთი ინდივიდუალური სითბოთი და შთაგონებით იქმნება. ჩვენი მიზანია თქვენს გარემოსა და სტილს განსაკუთრებული, უნიკალური ხიბლი შევმატოთ.
        </p>
      </section>

      {/* Multi-step Slide-over Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[99999] overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={handleCloseCart}
          ></div>

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-[#F9F6F0] shadow-2xl flex flex-col z-10 border-l border-[#E5DEC9]">
              
              {/* Sidebar Header */}
              <div className="bg-[#3F4E3F] text-white px-6 py-5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H19m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="font-serif text-lg font-bold">
                    {step === 'cart' && 'თქვენი კალათა'}
                    {step === 'checkout' && 'შეკვეთის გაფორმება'}
                    {step === 'success' && 'დასრულება'}
                  </h3>
                </div>
                <button
                  onClick={handleCloseCart}
                  className="text-white/80 hover:text-white w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/25 transition-colors cursor-pointer text-lg"
                >
                  ✕
                </button>
              </div>

              {/* Sidebar Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                
                {/* STAGE 1: SUCCESS MESSAGE */}
                {step === 'success' ? (
                  <div className="text-center py-24 text-[#3F4E3F]">
                    <div className="w-16 h-16 bg-[#C98B9B]/20 rounded-full flex items-center justify-center mx-auto mb-4 text-[#C98B9B]">
                      ✓
                    </div>
                    <h4 className="font-serif text-xl font-bold">მადლობა შეკვეთისთვის!</h4>
                    <p className="text-xs mt-2 text-[#627263]">თქვენი შეკვეთა წარმატებით მივიღეთ. მალე დაგიკავშირდებით ნომერზე.</p>
                    <button
                      onClick={() => { setStep('cart'); setIsCartOpen(false); }}
                      className="mt-6 bg-[#3F4E3F] text-white text-xs font-semibold px-6 py-2.5 rounded-xl cursor-pointer hover:bg-[#2A342B] transition-colors"
                    >
                      მთავარ გვერდზე დაბრუნება
                    </button>
                  </div>
                ) : step === 'checkout' ? (
                  
                  /* STAGE 2: CHECKOUT & PAYMENT FORM */
                  <form onSubmit={handleFinalSubmit} className="space-y-4">
                    <button
                      type="button"
                      onClick={() => setStep('cart')}
                      className="text-xs text-[#3F4E3F] font-semibold flex items-center gap-1 mb-2 hover:underline cursor-pointer"
                    >
                      ← უკან კალათაში
                    </button>

                    <div className="bg-white p-5 rounded-2xl border border-[#E5DEC9] shadow-sm space-y-3">
                      <h4 className="font-serif font-bold text-sm text-[#3F4E3F]">მიტანის მისამართი</h4>
                      
                      <div>
                        <label className="block text-[11px] font-medium text-[#627263] mb-1">სახელი და გვარი *</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#E5DEC9] focus:outline-none focus:border-[#3F4E3F] bg-[#F9F6F0]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-[#627263] mb-1">ტელეფონის ნომერი *</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#E5DEC9] focus:outline-none focus:border-[#3F4E3F] bg-[#F9F6F0]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-[#627263] mb-1">ქალაქი / სოფელი *</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#E5DEC9] focus:outline-none focus:border-[#3F4E3F] bg-[#F9F6F0]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-[#627263] mb-1">ქუჩა, სახლის / ბინის ნომერი</label>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full text-xs px-3 py-2.5 rounded-xl border border-[#E5DEC9] focus:outline-none focus:border-[#3F4E3F] bg-[#F9F6F0]"
                        />
                      </div>
                    </div>

                    {/* Payment Methods Section */}
                    <div className="bg-white p-5 rounded-2xl border border-[#E5DEC9] shadow-sm space-y-3">
                      <h4 className="font-serif font-bold text-sm text-[#3F4E3F]">გადახდის მეთოდი</h4>
                      
                      <div className="space-y-2">
                        <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-[#3F4E3F] bg-[#3F4E3F]/5' : 'border-[#E5DEC9]'}`}>
                          <input
                            type="radio"
                            name="payment"
                            value="cash"
                            checked={paymentMethod === 'cash'}
                            onChange={() => setPaymentMethod('cash')}
                            className="accent-[#3F4E3F]"
                          />
                          <div>
                            <p className="text-xs font-bold text-[#2A342B]">ნაღდი ანგარიშსწორება</p>
                            <p className="text-[10px] text-[#627263]">თანხის გადახდა კურიერთან მიტანისას</p>
                          </div>
                        </label>

                        <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#3F4E3F] bg-[#3F4E3F]/5' : 'border-[#E5DEC9]'}`}>
                          <input
                            type="radio"
                            name="payment"
                            value="card"
                            checked={paymentMethod === 'card'}
                            onChange={() => setPaymentMethod('card')}
                            className="accent-[#3F4E3F]"
                          />
                          <div>
                            <p className="text-xs font-bold text-[#2A342B]">საბანკო გადარიცხვა</p>
                            <p className="text-[10px] text-[#627263]">თანხის გადმორიცხვა ბარათზე</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Summary & Submit */}
                    <div className="bg-white p-5 rounded-2xl border border-[#E5DEC9] shadow-sm space-y-3">
                      <div className="flex justify-between items-center text-sm font-medium text-[#627263]">
                        <span>სულ გადასახდელი:</span>
                        <span className="text-xl font-bold text-[#3F4E3F]">{totalPrice} ₾</span>
                      </div>

                      <button
                        type="submit"
                        className="w-full text-center bg-[#C98B9B] hover:bg-[#B87D8B] text-white font-semibold py-3.5 rounded-xl transition-all shadow-md text-xs cursor-pointer"
                      >
                        შეკვეთის დადასტურება
                      </button>
                    </div>

                  </form>
                ) : (
                  
                  /* STAGE 1: CART ITEMS LIST */
                  cart.length === 0 ? (
                    <div className="text-center py-24 text-[#627263]">
                      <div className="w-16 h-16 bg-[#E5DEC9]/40 rounded-full flex items-center justify-center mx-auto mb-4 text-[#3F4E3F]">
                        <svg className="w-8 h-8 fill-none stroke-current stroke-1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H19m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <p className="text-base font-serif font-bold text-[#3F4E3F]">კალათა ცარიელია</p>
                      <p className="text-xs mt-1 text-[#7A8A7C]">აირჩიეთ სასურველი ნივთები კოლექციიდან</p>
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

            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}