'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TELEGRAM_BOT_TOKEN = '8768369070:AAF_NvgR8wd6VfFB-8KwkJqRrGY5P8P19rc'; 
const TELEGRAM_CHAT_ID = '7820300588';
const SHIPPING_FEE = 10;

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
  badge?: string;
}

interface CartItem extends Product {
  quantity: number;
  customText?: string;
}

interface User {
  name: string;
  email: string;
  phone: string;
  address: string;
  avatar?: string;
  isAdmin?: boolean;
}

interface ChatMessage {
  sender: 'bot' | 'user';
  text: string;
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('ყველა');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalCustomText, setModalCustomText] = useState('');

  const [step, setStep] = useState<'catalog' | 'checkout' | 'success' | 'auth' | 'profile' | 'admin'>('catalog');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: 'გამარჯობა! 👋 მე ვარ Lika\'s Workshop-ის ასისტენტი. რით შემიძლია დაგეხმაროთ?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'cash'>('transfer');
  const [selectedAvatar, setSelectedAvatar] = useState('👩‍🎨');
  const avatarsList = ['👩‍🎨', '🌸', '💎', '🎨', '🧸', '🌿', '☕', '✨'];
  const [authError, setAuthError] = useState('');
  const [isSendingOrder, setIsSendingOrder] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('თაბაშირი');
  const [newImage, setNewImage] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const [products, setProducts] = useState<Product[]>([
    { id: 1, title: 'თაბაშირის ხელნაკეთი დეკორი', price: 35, category: 'თაბაშირი', image: '/plaster1.jpg', description: 'უნიკალური დიზაინის თაბაშირის დეკორატიული ფიგურა თქვენი სახლის ინტერიერისთვის. დამზადებულია ეკოლოგიურად სუფთა მასალებით, ხელით მოხატული. შესაძლებელია სასურველი წარწერის დატანა.', badge: 'ბესტსელერი' },
    { id: 2, title: 'ხელნაკეთი სამკაული #1', price: 45, category: 'სამკაული', image: '/necklace1.jpg', description: 'გამორჩეული და ელეგანტური ხელნაკეთი ყელსაბამი განსაკუთრებული დღეებისთვის.', badge: 'ახალი' },
    { id: 3, title: 'ხელნაკეთი სამკაული #2', price: 50, category: 'სამკაული', image: '/necklace2.jpg', description: 'დანაოჭებული მარგალიტისა და მძივების უნიკალური კომბინაცია. იდეალური საჩუქარი.' },
    { id: 4, title: 'საავტორო ნახატი', price: 120, category: 'ნახატები', image: '/painting1.jpg', description: 'ხელნაკეთი საავტორო ტილო, შესრულებული მაღალი ხარისხის საღებავებით.', badge: 'საავტორო' },
  ]);

  const reviews = [
    { id: 1, name: 'ნინო გ.', rating: 5, text: 'ძალიან დახვეწილი და ხარისხიანი თაბაშირის ნაკრები მოვიდა. წარწერა ზუსტად ისეთი იყო, როგორიც ვისურვე! ❤️', avatar: '🌸' },
    { id: 2, name: 'მარიამ ქ.', rating: 5, text: 'სამკაული საჩუქრად შევუკვეთე და გაოცებული დარჩა მიმღები. სწრაფი მიწოდება და ულამაზესი შეფუთვა.', avatar: '💎' },
    { id: 3, name: 'ანა ბ.', rating: 5, text: 'საავტორო ნახატმა ჩემი მისაღები ოთახი სრულად შეცვალა. დიდი მადლობა ასეთი სითბოსა და სიყვარულისთვის!', avatar: '🎨' },
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem('likas_current_user');
    if (savedUser) {
      try { 
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed); 
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.address) setAddress(parsed.address);
      } catch (e) {}
    }

    const savedProducts = localStorage.getItem('likas_products');
    if (savedProducts) {
      try { setProducts(JSON.parse(savedProducts)); } catch (e) {}
    }

    const savedWishlist = localStorage.getItem('likas_wishlist');
    if (savedWishlist) {
      try { setWishlist(JSON.parse(savedWishlist)); } catch (e) {}
    }
  }, []);

  const saveProductsToStorage = (updated: Product[]) => {
    setProducts(updated);
    localStorage.setItem('likas_products', JSON.stringify(updated));
  };

  const toggleWishlist = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setWishlist(prev => {
      const updated = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      localStorage.setItem('likas_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('likas_current_user');
    setCurrentUser(null);
    setStep('catalog');
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (email.trim().toLowerCase() === 'admin@lika.ge') {
      if (password.length > 0) {
        const adminUser: User = {
          name: 'ლიკა (ადმინი)',
          email: 'admin@lika.ge',
          phone: '',
          address: '',
          avatar: '👩‍🎨',
          isAdmin: true
        };
        setCurrentUser(adminUser);
        localStorage.setItem('likas_current_user', JSON.stringify(adminUser));
        setStep('admin');
        setEmail('');
        setPassword('');
        return;
      }
    }

    let users = JSON.parse(localStorage.getItem('likas_users') || '[]');

    if (authMode === 'register') {
      if (users.find((u: any) => u.email === email)) {
        setAuthError('მომხმარებელი ამ ელ-ფოსტით უკვე არსებობს!');
        return;
      }
      const newUser = { name, email, phone, address, avatar: selectedAvatar, password, isAdmin: false };
      users.push(newUser);
      localStorage.setItem('likas_users', JSON.stringify(users));
      localStorage.setItem('likas_current_user', JSON.stringify(newUser));
      setCurrentUser(newUser);
      setStep('catalog');
      alert('რეგისტრაცია წარმატებით დასრულდა! ✨');
    } else {
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      if (!foundUser) {
        setAuthError('არასწორი ელ-ფოსტა ან პაროლი!');
        return;
      }
      localStorage.setItem('likas_current_user', JSON.stringify(foundUser));
      setCurrentUser(foundUser);
      if (foundUser.email === 'admin@lika.ge') {
        setStep('admin');
      } else {
        setStep('catalog');
      }
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newImage) return;

    const newProd: Product = {
      id: Date.now(),
      title: newTitle,
      price: Number(newPrice),
      category: newCategory,
      image: newImage,
      description: newDescription || 'ხელნაკეთი უნიკალური ნივთი.'
    };

    saveProductsToStorage([newProd, ...products]);
    setNewTitle('');
    setNewPrice('');
    setNewImage('');
    setNewDescription('');
    alert('პროდუქტი წარმატებით დაემატა კატალოგს! ✨');
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('ნამდვილად გსურთ ამ პროდუქტის წაშლა?')) {
      const updated = products.filter(p => p.id !== id);
      saveProductsToStorage(updated);
    }
  };

  const categories = ['ყველა', 'სამკაული', 'თაბაშირი', 'ნახატები'];
  
  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'ყველა' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product: Product, customText?: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.customText === customText);
      if (existing) {
        return prev.map(item => (item.id === product.id && item.customText === customText) ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1, customText }];
    });
    setIsCartOpen(true);
    setSelectedProduct(null);
    setModalCustomText('');
  };

  const updateQuantity = (id: number, delta: number, customText?: string) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.customText === customText) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const itemsTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalAmount = itemsTotal > 0 ? itemsTotal + SHIPPING_FEE : 0;
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');

    setTimeout(() => {
      let botReply = 'გმადლობთ შეტყობინებისთვის! დეტალური კონსულტაციისთვის შეგიძლიათ მოგვწეროთ პირდაპირ Facebook Messenger-ში.';
      const lower = userText.toLowerCase();

      if (lower.includes('ფასი') || lower.includes('ღირს') || lower.includes('რა ჯდება')) {
        botReply = 'პროდუქციის ფასები მითითებულია კატალოგში. თაბაშირის ნაკრებები იწყება 35₾-დან, სამკაულები 45₾-დან, ხოლო ნახატები 120₾-დან.';
      } else if (lower.includes('წარწერა') || lower.includes('ტექსტი') || lower.includes('სახელი')) {
        botReply = 'დიახ! თაბაშირის ნივთებზე შეგიძლიათ ისურვოთ ნებისმიერი ტექსტი, სახელი ან კალიგრაფიული წარწერა ✨ პროდუქტის დეტალების ფანჯარაში შეგიძლიათ მიუთითოთ სასურველი ტექსტი.';
      } else if (lower.includes('შეკვეთა') || lower.includes('ინდივიდუალური') || lower.includes('დაკვეთა')) {
        botReply = 'ინდივიდუალური შეკვეთისთვის (ფერის, დიზაინისა თუ წარწერის შერჩევით) მოგვწერეთ პირდაპირ ჩვენს Facebook/Messenger გვერდზე!';
      } else if (lower.includes('მიწოდება') || lower.includes('ფოსტა') || lower.includes('ტრანსპორტირება') || lower.includes('კურიერი')) {
        botReply = 'მიწოდება ხორციელდება მთელი საქართველოს მასშტაბით კურიერით. საკურიერო მომსახურების საფასურია 10 ₾ 🚚';
      } else if (lower.includes('მისამართი') || lower.includes('სად ხართ')) {
        botReply = 'ჩვენ ვართ ონლაინ სახელოსნო და შეკვეთებს ვაგზავნით საქართველოს ნებისმიერ წერტილში!';
      } else if (lower.includes('გამარჯობა') || lower.includes('სალამი') || lower.includes('გამარჯობათ')) {
        botReply = 'გამარჯობა! 🌸 რით შემიძლია დაგეხმაროთ? შეგიძლიათ მკითხოთ ფასებზე, ინდივიდუალურ შეკვეთებსა თუ მიწოდებაზე.';
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 700);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSendingOrder(true);

    const itemsText = cart
      .map(item => {
        let line = `• *${item.title}* (x${item.quantity}) — ${item.price * item.quantity}₾`;
        if (item.customText) {
          line += `\n  ✍️ _წარწერა:_ "${item.customText}"`;
        }
        return line;
      })
      .join('\n');

    const paymentText = paymentMethod === 'transfer' ? '💳 საბანკო გადარიცხვა' : '💵 ნაღდი ანგარიშსწორება (კურიერთან)';

    const messageText = 
      `🛍 *ახალი შეკვეთა Lika's Workshop-იდან!*\n\n` +
      `👤 *მომხმარებელი:* ${name || currentUser?.name || 'არ არის მითითებული'}\n` +
      `📞 *ტელეფონი:* ${phone}\n` +
      `📍 *მისამართი:* ${address}\n` +
      `💳 *გადახდის მეთოდი:* ${paymentText}\n\n` +
      `📦 *პროდუქტები:*\n${itemsText}\n\n` +
      `🛵 *საკურიერო მომსახურება:* ${SHIPPING_FEE} ₾\n` +
      `💰 *სულ გადასახდელი:* *${totalAmount} ₾*`;

    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: messageText,
          parse_mode: 'Markdown'
        })
      });
    } catch (error) {
      console.error('Telegram-ში გაგზავნის შეცდომა:', error);
    } finally {
      setIsSendingOrder(false);
      setStep('success');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#3D3A38] font-sans relative overflow-x-hidden">
      
      {/* 🌟 ელეგანტური, თხელი ფონტი და მოძრავი ვარდისფერი ნეონის ანიმაცია */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fira+GO:wght@300;400;500&display=swap');

        .hero-custom-title {
          font-family: 'Fira GO', sans-serif;
          font-weight: 400;
          animation: pinkNeonPulse 3s infinite ease-in-out;
        }

        @keyframes pinkNeonPulse {
          0% {
            color: #FFF0F5;
            text-shadow: 0 0 10px rgba(255, 105, 180, 0.4), 
                         0 0 20px rgba(255, 182, 193, 0.3), 
                         0 0 30px rgba(219, 112, 147, 0.2);
          }
          50% {
            color: #FFFFFF;
            text-shadow: 0 0 20px rgba(255, 105, 180, 0.9), 
                         0 0 35px rgba(255, 182, 193, 0.8), 
                         0 0 50px rgba(219, 112, 147, 0.6),
                         0 0 70px rgba(255, 20, 147, 0.4);
          }
          100% {
            color: #FFF0F5;
            text-shadow: 0 0 10px rgba(255, 105, 180, 0.4), 
                         0 0 20px rgba(255, 182, 193, 0.3), 
                         0 0 30px rgba(219, 112, 147, 0.2);
          }
        }

        @keyframes swingLamp {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(3deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(-3deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes glowingLight {
          0% { filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8)) brightness(1.2); }
          50% { filter: drop-shadow(0 0 35px rgba(255, 200, 0, 1)) brightness(1.35); }
          100% { filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8)) brightness(1.2); }
        }
        .swinging-lamp {
          transform-origin: top center;
          animation: swingLamp 4s infinite ease-in-out, glowingLight 2.5s infinite ease-in-out;
        }
      `}</style>

      {/* ჰედერი */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#FFFDF9]/90 backdrop-blur-md border-b border-[#E8E0D5] sticky top-0 z-40 shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div 
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={() => { if(currentUser?.email === 'admin@lika.ge') { setStep('admin'); } else { setStep('catalog'); } setIsCartOpen(false); setSelectedProduct(null); }}
            >
              <img src="/Logo.jpg" alt="Lika's Workshop" className="w-12 h-12 rounded-full object-cover border-2 border-[#5E685C] shadow-xs group-hover:scale-105 transition" />
              <div>
                <h1 className="font-bold text-xl text-[#2D332C] tracking-wide">Lika's Workshop</h1>
                <p className="text-[10px] text-[#7A726D] font-bold tracking-widest uppercase">ხელნაკეთი ონლაინ ბუტიკი</p>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-[#554F4A] pl-6 border-l border-[#E8E0D5]">
              {currentUser?.email !== 'admin@lika.ge' && (
                <>
                  <button onClick={() => setStep('catalog')} className="hover:text-[#5E685C] transition cursor-pointer">კატალოგი</button>
                  <a href="#about" className="hover:text-[#5E685C] transition">ჩვენ შესახებ</a>
                  <a href="#reviews" className="hover:text-[#5E685C] transition">შეფასებები</a>
                  <a href="#contact" className="hover:text-[#5E685C] transition">კონტაქტი</a>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="https://www.facebook.com/profile.php?id=61578253351470" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white px-4 py-2 rounded-full text-xs font-bold transition shadow-xs"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <span>Facebook</span>
            </a>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setStep('profile')}
                  className="bg-[#F4ECE1] hover:bg-[#E8E0D5] text-[#2D332C] px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <span>{currentUser.avatar || '👤'}</span>
                  <span>{currentUser.name}</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-full text-xs font-bold transition cursor-pointer border border-red-200"
                  title="გასვლა"
                >
                  🚪
                </button>
              </div>
            ) : (
              <button 
                onClick={() => { setAuthMode('login'); setStep('auth'); }}
                className="bg-[#5E685C] hover:bg-[#4E564D] text-white px-5 py-2 rounded-full text-xs font-bold transition cursor-pointer shadow-xs"
              >
                შესვლა
              </button>
            )}

            {currentUser?.email !== 'admin@lika.ge' && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCartOpen(true)}
                className="bg-[#C29EA4] hover:bg-[#B38D93] text-white px-5 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>🛍️ კალათა</span>
                {totalItemsCount > 0 && (
                  <span className="bg-white text-[#C29EA4] w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold shadow-xs">
                    {totalItemsCount}
                  </span>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Hero სექცია */}
      {step === 'catalog' && (
        <>
          <section className="relative py-32 px-6 text-center overflow-hidden shadow-inner">
            <div className="absolute inset-0 z-0">
              <img 
                src="https://i.postimg.cc/KjdyMcSY/hero-bg-jpg.png" 
                alt="Museum Gallery Background" 
                className="w-full h-full object-cover scale-105 filter brightness-75"
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
            </div>

            <div className="absolute top-2 right-12 z-20 hidden md:block">
              <img src="https://i.postimg.cc/pTq7DW8M/Nice-Png-picsart-light-png-2475195.png" alt="Swinging Lamp" className="w-20 h-auto swinging-lamp" />
            </div>
            <div className="absolute top-2 left-12 z-20 hidden md:block">
              <img src="https://i.postimg.cc/pTq7DW8M/Nice-Png-picsart-light-png-2475195.png" alt="Swinging Lamp" className="w-20 h-auto swinging-lamp" />
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl mx-auto space-y-6 relative z-10"
            >
              <span className="inline-block bg-[#C29EA4] text-white px-4 py-1.5 rounded-full text-xs font-extrabold tracking-widest uppercase shadow-md">
                ✨ ექსკლუზიური ხელნაკეთი კოლექცია
              </span>
              
              {/* 🌟 სათაური თხელი, ელეგანტური ფონტითა და მოძრავი ვარდისფერი ნეონით */}
              <h2 className="text-3xl md:text-5xl leading-tight hero-custom-title">
                სითბო და ხელოვნება თითოეულ დეტალში
              </h2>

              <p className="text-sm md:text-base text-[#F0EAE1] max-w-xl mx-auto leading-relaxed font-medium drop-shadow-sm">
                აღმოაჩინეთ უნიკალური თაბაშირის დეკორები, დახვეწილი სამკაულები და საავტორო ნახატები, შექმნილი სპეციალურად თქვენთვის.
              </p>
              <div className="pt-2 flex justify-center gap-4">
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#catalog-section" 
                  className="bg-[#FFFDF9] text-[#3D3A38] px-7 py-3 rounded-full text-xs font-extrabold shadow-xl hover:bg-[#F4ECE1] transition"
                >
                  კოლექციის დათვალიერება ↓
                </motion.a>
              </div>
            </motion.div>
          </section>

          {/* შესახებ */}
          <section id="about" className="max-w-5xl mx-auto px-6 -mt-10 relative z-20">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] p-8 md:p-10 shadow-xl flex flex-col md:flex-row items-center gap-8"
            >
              <img src="/Logo.jpg" alt="Lika's Workshop" className="w-28 h-28 rounded-2xl object-cover border-2 border-[#5E685C] shadow-md flex-shrink-0" />
              <div className="space-y-3 text-center md:text-left">
                <span className="text-xs font-extrabold text-[#C29EA4] uppercase tracking-wider">ჩვენ შესახებ</span>
                <h3 className="text-xl font-bold text-[#2D332C]">
                  თქვენს გემოვნებაზე მორგებული ხელნაკეთი ნივთები
                </h3>
                <p className="text-xs md:text-sm text-[#6E6661] leading-relaxed">
                  ჩვენს სახელოსნოში იქმნება თაბაშირის დეკორატიული ფიგურები, ტილოები და ხელნაკეთი სამკაულები. შეგიძლიათ აირჩიოთ არსებული კოლექციიდან ან მოგვწეროთ და დაგიმზადოთ ინდივიდუალური შეკვეთა თქვენთვის სასურველი დიზაინითა და წარწერით.
                </p>
              </div>
            </motion.div>
          </section>
        </>
      )}

      {/* მთავარი კონტენტი */}
      <main id="catalog-section" className="max-w-7xl mx-auto px-6 pb-20 mt-12">
        {step === 'catalog' && (
          <div>
            {/* ფილტრაცია და ძიების ველი */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 bg-[#FFFDF9] p-4 rounded-3xl border border-[#E8E0D5] shadow-xs">
              <div className="flex flex-wrap justify-center gap-2 w-full md:w-auto">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                      activeCategory === cat 
                        ? 'bg-[#5E685C] text-white shadow-md' 
                        : 'bg-[#F9F6F0] text-[#4A4541] hover:bg-[#E8E0D5]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 ძიება კატალოგში..." 
                  className="w-full px-4 py-2.5 bg-[#F9F6F0] border border-[#E8E0D5] rounded-full text-xs outline-none focus:border-[#5E685C] transition"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#7A726D] font-bold hover:text-black"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5]">
                <p className="text-sm text-[#7A726D]">პროდუქტი ვერ მოიძებნა თქვენი მოთხოვნის შესაბამისად 🍃</p>
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <AnimatePresence>
                  {filteredProducts.map(product => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                      key={product.id} 
                      onClick={() => setSelectedProduct(product)}
                      className="bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] overflow-hidden shadow-xs hover:shadow-xl transition duration-300 flex flex-col group cursor-pointer relative"
                    >
                      <button 
                        onClick={(e) => toggleWishlist(product.id, e)}
                        className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md transition hover:scale-110"
                      >
                        <span className={`text-sm ${wishlist.includes(product.id) ? 'text-red-500' : 'text-[#7A726D]'}`}>
                          {wishlist.includes(product.id) ? '❤️' : '🤍'}
                        </span>
                      </button>

                      <div className="w-full h-72 bg-[#F4ECE1] relative overflow-hidden flex items-center justify-center">
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#4A4541] shadow-xs">
                          {product.category}
                        </span>
                      </div>

                      <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                        <div>
                          <h3 className="font-bold text-sm text-[#2D332C] mb-1 group-hover:text-[#5E685C] transition">
                            {product.title}
                          </h3>
                          <p className="text-xs text-[#7A726D] line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-[#F4ECE1]">
                          <span className="text-base font-bold text-[#2D332C]">{product.price} ₾</span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => addToCart(product, undefined, e)}
                            className="bg-[#C29EA4] hover:bg-[#B38D93] text-white px-4 py-2 rounded-full text-xs font-bold transition shadow-xs cursor-pointer"
                          >
                            კალათაში 🛍️
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* შეფასებები */}
            <section id="reviews" className="mt-20 pt-10 border-t border-[#E8E0D5]">
              <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
                <span className="text-xs font-extrabold text-[#C29EA4] uppercase tracking-wider">შეფასებები</span>
                <h3 className="text-xl font-bold text-[#2D332C]">რას ამბობენ ჩვენი მომხმარებლები</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reviews.map(rev => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    key={rev.id} 
                    className="bg-[#FFFDF9] p-6 rounded-3xl border border-[#E8E0D5] shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{rev.avatar}</span>
                        <h4 className="font-bold text-xs text-[#2D332C]">{rev.name}</h4>
                      </div>
                      <div className="text-amber-400 text-xs">{'★'.repeat(rev.rating)}</div>
                    </div>
                    <p className="text-xs text-[#6E6661] leading-relaxed font-medium">"{rev.text}"</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* პროფილი */}
        {step === 'profile' && currentUser && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto bg-[#FFFDF9] p-8 rounded-3xl border border-[#E8E0D5] shadow-xl space-y-8 my-6"
          >
            <div className="flex items-center justify-between border-b border-[#E8E0D5] pb-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl bg-[#F4ECE1] w-16 h-16 rounded-2xl flex items-center justify-center shadow-xs">
                  {currentUser.avatar || '👤'}
                </span>
                <div>
                  <h2 className="text-xl font-bold text-[#2D332C]">{currentUser.name}</h2>
                  <p className="text-xs text-[#7A726D]">{currentUser.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setStep('catalog')}
                className="bg-[#5E685C] hover:bg-[#4E564D] text-white px-5 py-2.5 rounded-full text-xs font-bold transition cursor-pointer"
              >
                ← კატალოგში დაბრუნება
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#2D332C] flex items-center gap-2">
                <span>❤️</span> თქვენი მოწონებული ნივთები ({wishlist.length})
              </h3>

              {wishlist.length === 0 ? (
                <div className="text-center py-12 bg-[#F9F6F0] rounded-2xl border border-[#E8E0D5] text-xs text-[#7A726D]">
                  თქვენ ჯერ არ მოგწონებიათ არცერთი ნივთი. დააჭირეთ ❤️ სიმბოლოს პროდუქტებზე!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.filter(p => wishlist.includes(p.id)).map(product => (
                    <div key={product.id} className="bg-[#F9F6F0] rounded-2xl border border-[#E8E0D5] p-4 flex gap-4 items-center relative">
                      <button 
                        onClick={(e) => toggleWishlist(product.id, e)}
                        className="absolute top-3 right-3 text-red-500 hover:scale-110 transition"
                      >
                        ❤️
                      </button>
                      <img src={product.image} alt={product.title} className="w-16 h-16 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-bold text-xs text-[#2D332C] mb-1">{product.title}</h4>
                        <p className="text-xs font-bold text-[#5E685C]">{product.price} ₾</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ავტორიზაცია */}
        {step === 'auth' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-[#FFFDF9] p-8 rounded-3xl border border-[#E8E0D5] shadow-xl space-y-6 my-10"
          >
            <div className="flex items-center justify-between border-b border-[#E8E0D5] pb-4">
              <h2 className="text-xl font-bold text-[#2D332C]">
                {authMode === 'login' ? '🔑 შესვლა' : '✨ რეგისტრაცია'}
              </h2>
              <button onClick={() => setStep('catalog')} className="text-xs text-[#7A726D] font-bold cursor-pointer">✕</button>
            </div>

            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-xs font-bold text-center">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-bold mb-1">სახელი *</label>
                    <input 
                      type="text" 
                      required 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      placeholder="თქვენი სახელი" 
                      className="w-full p-3 bg-[#F9F6F0] border border-[#E8E0D5] rounded-xl text-xs outline-none" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-2">აირჩიეთ ავატარი 🎨</label>
                    <div className="flex flex-wrap gap-2">
                      {avatarsList.map(av => (
                        <button
                          type="button"
                          key={av}
                          onClick={() => setSelectedAvatar(av)}
                          className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition cursor-pointer border ${
                            selectedAvatar === av ? 'border-[#5E685C] bg-[#5E685C]/10 scale-105' : 'border-[#E8E0D5] bg-[#F9F6F0]'
                          }`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold mb-1">ელ-ფოსტა *</label>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="name@example.com" 
                  className="w-full p-3 bg-[#F9F6F0] border border-[#E8E0D5] rounded-xl text-xs outline-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">პაროლი *</label>
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="w-full p-3 bg-[#F9F6F0] border border-[#E8E0D5] rounded-xl text-xs outline-none" 
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#5E685C] hover:bg-[#4E564D] text-white py-3.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
              >
                {authMode === 'login' ? 'შესვლა' : 'რეგისტრაცია'}
              </button>
            </form>

            <div className="text-center pt-2">
              <button 
                onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError(''); }}
                className="text-xs text-[#5E685C] font-bold hover:underline cursor-pointer"
              >
                {authMode === 'login' ? 'არ გაქვთ ანგარიში? რეგისტრაცია' : 'უკვე გაქვთ ანგარიში? შესვლა'}
              </button>
            </div>
          </motion.div>
        )}

        {/* ადმინი */}
        {step === 'admin' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto bg-[#FFFDF9] p-8 rounded-3xl border border-[#E8E0D5] shadow-xl space-y-8 my-6"
          >
            <div className="flex items-center justify-between bg-[#F4ECE1] p-4 rounded-2xl border border-[#E8E0D5]">
              <h2 className="text-lg font-bold text-[#2D332C]">⚙️ ადმინისტრატორის პანელი</h2>
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-full text-xs font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <span>🚪</span> გასვლა სისტემიდან
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 bg-[#F9F6F0] p-6 rounded-2xl border border-[#E8E0D5]">
              <h3 className="font-bold text-base text-[#2D332C]">➕ ახალი პროდუქტის დამატება</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">დასახელება *</label>
                  <input 
                    type="text" 
                    required 
                    value={newTitle} 
                    onChange={e => setNewTitle(e.target.value)} 
                    placeholder="მაგ: თაბაშირის ანგელოზი" 
                    className="w-full p-3 bg-white border border-[#E8E0D5] rounded-xl text-xs outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">ფასი (₾) *</label>
                  <input 
                    type="number" 
                    required 
                    value={newPrice} 
                    onChange={e => setNewPrice(e.target.value)} 
                    placeholder="40" 
                    className="w-full p-3 bg-white border border-[#E8E0D5] rounded-xl text-xs outline-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1">კატეგორია *</label>
                  <select 
                    value={newCategory} 
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full p-3 bg-white border border-[#E8E0D5] rounded-xl text-xs outline-none"
                  >
                    <option value="თაბაშირი">თაბაშირი</option>
                    <option value="სამკაული">სამკაული</option>
                    <option value="ნახატები">ნახატები</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">სურათის ლინკი (URL) *</label>
                  <input 
                    type="text" 
                    required 
                    value={newImage} 
                    onChange={e => setNewImage(e.target.value)} 
                    placeholder="https://i.postimg.cc/... ან /plaster1.jpg" 
                    className="w-full p-3 bg-white border border-[#E8E0D5] rounded-xl text-xs outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">აღწერა</label>
                <textarea 
                  value={newDescription} 
                  onChange={e => setNewDescription(e.target.value)} 
                  placeholder="პროდუქტის დეტალური აღწერა..." 
                  className="w-full p-3 bg-white border border-[#E8E0D5] rounded-xl text-xs outline-none h-20" 
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#5E685C] hover:bg-[#4E564D] text-white py-3.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
              >
                დამატება კატალოგში ✨
              </button>
            </form>

            <div className="space-y-4">
              <h3 className="font-bold text-base text-[#2D332C]">📦 არსებული პროდუქტები ({products.length})</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {products.map(prod => (
                  <div key={prod.id} className="flex items-center justify-between p-3 bg-[#F9F6F0] rounded-xl border border-[#E8E0D5]">
                    <div className="flex items-center gap-3">
                      <img src={prod.image} alt={prod.title} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <h4 className="font-bold text-xs text-[#2D332C]">{prod.title}</h4>
                        <p className="text-[10px] text-[#7A726D]">{prod.category} • {prod.price} ₾</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      წაშლა 🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* შეკვეთის გაფორმება */}
        {step === 'checkout' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto bg-[#FFFDF9] p-8 rounded-3xl border border-[#E8E0D5] shadow-xl space-y-6"
          >
            <h2 className="text-xl font-bold text-[#2D332C] border-b border-[#E8E0D5] pb-4">
              📝 შეკვეთის გაფორმება
            </h2>

            <div className="bg-[#F9F6F0] p-4 rounded-2xl border border-[#E8E0D5] space-y-2">
              <h4 className="font-bold text-xs text-[#5E685C]">შეკვეთის შინაარსი:</h4>
              {cart.map((item, idx) => (
                <div key={idx} className="text-xs text-[#554F4A] space-y-1 border-b border-[#E8E0D5]/50 pb-2">
                  <div className="flex justify-between">
                    <span>{item.title} (x{item.quantity})</span>
                    <span className="font-bold">{item.price * item.quantity} ₾</span>
                  </div>
                  {item.customText && (
                    <p className="text-[11px] text-[#C29EA4] font-medium">✍️ წარწერა: "{item.customText}"</p>
                  )}
                </div>
              ))}
              
              <div className="pt-2 flex justify-between text-xs text-[#554F4A]">
                <span>პროდუქციის ღირებულება:</span>
                <span className="font-bold">{itemsTotal} ₾</span>
              </div>
              <div className="flex justify-between text-xs text-[#554F4A]">
                <span>საკურიერო მომსახურება:</span>
                <span className="font-bold">{SHIPPING_FEE} ₾</span>
              </div>

              <div className="border-t border-[#E8E0D5] pt-2 flex justify-between font-bold text-sm text-[#2D332C]">
                <span>სულ გადასახდელი:</span>
                <span>{totalAmount} ₾</span>
              </div>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1">ტელეფონის ნომერი *</label>
                <input 
                  type="tel" 
                  required 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="599 00 00 00" 
                  className="w-full p-3 bg-[#F9F6F0] border border-[#E8E0D5] rounded-xl text-xs outline-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">მიწოდების მისამართი *</label>
                <textarea 
                  required 
                  value={address} 
                  onChange={e => setAddress(e.target.value)} 
                  placeholder="ქალაქი, ქუჩა, ბინის ნომერი..." 
                  className="w-full p-3 bg-[#F9F6F0] border border-[#E8E0D5] rounded-xl text-xs outline-none h-20" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-2">გადახდის მეთოდი *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label 
                    onClick={() => setPaymentMethod('transfer')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
                      paymentMethod === 'transfer' ? 'border-[#5E685C] bg-[#5E685C]/10 text-[#2D332C]' : 'border-[#E8E0D5] bg-[#F9F6F0]'
                    }`}
                  >
                    <input type="radio" name="payment" checked={paymentMethod === 'transfer'} onChange={() => {}} className="accent-[#5E685C]" />
                    <span>💳 საბანკო გადარიცხვა</span>
                  </label>

                  <label 
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition ${
                      paymentMethod === 'cash' ? 'border-[#5E685C] bg-[#5E685C]/10 text-[#2D332C]' : 'border-[#E8E0D5] bg-[#F9F6F0]'
                    }`}
                  >
                    <input type="radio" name="payment" checked={paymentMethod === 'cash'} onChange={() => {}} className="accent-[#5E685C]" />
                    <span>💵 ნაღდი ანგარიშსწორება</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setStep('catalog')} 
                  className="flex-1 bg-[#E8E0D5] text-[#3D3A38] py-3.5 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  უკან
                </button>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  type="submit" 
                  disabled={isSendingOrder}
                  className="flex-1 bg-[#C29EA4] hover:bg-[#B38D93] text-white py-3.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSendingOrder ? 'იგზავნება...' : 'შეკვეთის დადასტურება ✨'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* წარმატებული შეკვეთა */}
        {step === 'success' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-[#FFFDF9] p-8 rounded-3xl border border-[#E8E0D5] shadow-xl text-center space-y-4"
          >
            <span className="text-5xl inline-block">🎉</span>
            <h2 className="text-xl font-bold text-[#2D332C]">გმადლობთ შეკვეთისთვის!</h2>
            <p className="text-xs text-[#7A726D] leading-relaxed">
              თქვენი შეკვეთა მიღებულია. ჩვენ მალე დაგიკავშირდებით მითითებულ ნომერზე შეკვეთის დეტალების დასაზუსტებლად.
            </p>

            <button 
              onClick={() => { setCart([]); setStep('catalog'); }} 
              className="bg-[#5E685C] text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-[#4E564D] transition cursor-pointer"
            >
              მთავარ გვერდზე დაბრუნება
            </button>
          </motion.div>
        )}
      </main>

      {/* პროდუქტის დეტალური ფანჯარა */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] max-w-2xl w-full p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-6"
            >
              <button 
                onClick={() => { setSelectedProduct(null); setModalCustomText(''); }} 
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#F4ECE1] text-[#7A726D] font-bold hover:bg-[#E8E0D5] transition cursor-pointer flex items-center justify-center"
              >
                ✕
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="w-full h-64 md:h-80 bg-[#F4ECE1] rounded-2xl overflow-hidden">
                  <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-4">
                  <span className="bg-[#E8E0D5] text-[#5E685C] px-3 py-1 rounded-full text-[10px] font-bold">
                    {selectedProduct.category}
                  </span>
                  <h3 className="font-bold text-xl text-[#2D332C]">{selectedProduct.title}</h3>
                  <p className="text-xs text-[#7A726D] leading-relaxed">{selectedProduct.description}</p>
                  <div className="text-xl font-bold text-[#2D332C]">{selectedProduct.price} ₾</div>

                  <div>
                    <label className="block text-xs font-bold mb-1 text-[#5E685C]">
                      ✍️ ინდივიდუალური წარწერა (არასავალდებულო):
                    </label>
                    <input 
                      type="text" 
                      value={modalCustomText} 
                      onChange={e => setModalCustomText(e.target.value)} 
                      placeholder="მაგ: 'Lia & Gio', სახელი ან სურვილი..." 
                      className="w-full p-3 bg-[#F9F6F0] border border-[#E8E0D5] rounded-xl text-xs outline-none" 
                    />
                  </div>

                  <div className="flex gap-3">
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => toggleWishlist(selectedProduct.id, e)}
                      className={`px-4 py-3.5 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                        wishlist.includes(selectedProduct.id) 
                          ? 'border-red-500 bg-red-50 text-red-500' 
                          : 'border-[#E8E0D5] bg-[#F9F6F0] text-[#7A726D]'
                      }`}
                    >
                      <span>{wishlist.includes(selectedProduct.id) ? '❤️ მოწონებულია' : '🤍 მოწონება'}</span>
                    </motion.button>

                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => addToCart(selectedProduct, modalCustomText)}
                      className="flex-1 bg-[#C29EA4] hover:bg-[#B38D93] text-white py-3.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
                    >
                      კალათაში დამატება 🛍️
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ჩატბოტი */}
      <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end">
        {!isChatOpen ? (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsChatOpen(true)}
            className="bg-[#5E685C] hover:bg-[#4E564D] text-white px-5 py-3 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 transition cursor-pointer border-2 border-white"
          >
            <span className="text-base">🤖</span>
            <span>AI ასისტენტი</span>
          </motion.button>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-80 sm:w-96 bg-[#FFFDF9] rounded-3xl border border-[#E8E0D5] shadow-2xl overflow-hidden flex flex-col h-96"
          >
            <div className="bg-[#5E685C] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <div>
                  <h4 className="font-bold text-xs">Lika's AI ასისტენტი</h4>
                  <p className="text-[9px] text-[#E2D8CE]">ონლაინ რეჟიმშია</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-xs text-white/80 hover:text-white font-bold cursor-pointer">✕</button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F9F6F0]">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-[#5E685C] text-white rounded-br-none' 
                      : 'bg-white text-[#3D3A38] border border-[#E8E0D5] rounded-bl-none shadow-xs'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-[#E8E0D5] bg-white flex gap-2">
              <input 
                type="text" 
                value={inputMessage} 
                onChange={e => setInputMessage(e.target.value)}
                placeholder="მისწერეთ ჩატბოტს..." 
                className="flex-1 p-2.5 bg-[#F9F6F0] border border-[#E8E0D5] rounded-xl text-xs outline-none"
              />
              <button type="submit" className="bg-[#5E685C] text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-[#4E564D] transition cursor-pointer">
                ➔
              </button>
            </form>
          </motion.div>
        )}
      </div>

      {/* Messenger */}
      <motion.a 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        href="https://m.me/61578253351470" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full overflow-hidden shadow-2xl border-2 border-white bg-[#0084FF] flex items-center justify-center group"
        title="მოგვწერეთ Messenger-ში"
      >
        <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.304 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.559-6.96 3.125 3.26 5.893-3.26-6.559 6.96z"/>
        </svg>
      </motion.a>

      {/* ფუტერი */}
      <footer id="contact" className="bg-[#E8E0D5] border-t border-[#D5C8B8] py-12 text-center text-xs text-[#7A726D] space-y-4">
        <h3 className="font-bold text-base text-[#2D332C]">Lika's Workshop</h3>
        <p>შექმნილია განსაკუთრებული სითბოთი და სიყვარულით ❤️</p>
        <div className="flex justify-center gap-6 pt-2 font-bold text-[#5E685C]">
          <a href="https://www.facebook.com/profile.php?id=61578253351470" target="_blank" rel="noopener noreferrer" className="hover:underline">Facebook გვერდი ↗</a>
          <a href="https://m.me/61578253351470" target="_blank" rel="noopener noreferrer" className="hover:underline">Messenger ↗</a>
        </div>
        <p className="text-[10px] text-[#9E948D] pt-4">© 2026 Lika's Workshop. ყველა უფლება დაცულია.</p>
      </footer>

      {/* კალათა */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-[#FFFDF9] h-full shadow-2xl flex flex-col p-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E0D5]">
                <h3 className="font-bold text-base text-[#2D332C]">თქვენი კალათა</h3>
                <button onClick={() => setIsCartOpen(false)} className="w-8 h-8 rounded-full bg-[#F4ECE1] text-[#7A726D] font-bold cursor-pointer">✕</button>
              </div>
              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {cart.length === 0 ? <p className="text-center py-20 text-[#7A726D] text-xs">კალათა ცარიელია</p> : cart.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-[#F9F6F0] rounded-2xl border border-[#E8E0D5]">
                    <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h4 className="font-bold text-xs">{item.title}</h4>
                      {item.customText && (
                        <p className="text-[10px] text-[#C29EA4] font-medium">✍️ "{item.customText}"</p>
                      )}
                      <p className="text-xs font-bold text-[#5E685C]">{item.price} ₾</p>
                    </div>
                    <div className="flex items-center gap-2 bg-[#E8E0D5] px-2 py-1 rounded-full text-xs font-bold">
                      <button onClick={() => updateQuantity(item.id, -1, item.customText)} className="cursor-pointer">-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1, item.customText)} className="cursor-pointer">+</button>
                    </div>
                  </div>
                ))}
              </div>
              {cart.length > 0 && (
                <div className="pt-4 border-t border-[#E8E0D5] space-y-3">
                  <div className="flex justify-between items-center text-xs text-[#7A726D]">
                    <span>პროდუქცია:</span>
                    <span className="font-bold text-[#3D3A38]">{itemsTotal} ₾</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-[#7A726D]">
                    <span>საკურიერო:</span>
                    <span className="font-bold text-[#3D3A38]">{SHIPPING_FEE} ₾</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#E8E0D5]">
                    <span className="text-xs font-bold">სულ:</span>
                    <span className="text-xl font-bold">{totalAmount} ₾</span>
                  </div>
                  <button onClick={() => { setIsCartOpen(false); setStep('checkout'); }} className="w-full bg-[#C29EA4] text-[#FFFDF9] py-3.5 rounded-full text-xs font-bold hover:bg-[#B38D93] transition cursor-pointer">შეკვეთის გაფორმება</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}