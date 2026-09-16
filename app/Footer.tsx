'use client';

import { useState } from 'react';

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Messenger-ის ბმული გაგზავნილი ტექსტით
    const messengerUrl = `https://m.me/61578253351470?text=${encodeURIComponent(
      message
    )}`;
    window.open(messengerUrl, '_blank');
    setMessage('');
    setIsOpen(false);
  };

  return (
    <>
      {/* მცურავი ჩატის ღილაკი */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Chat"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.302 2.252.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.559-6.96 3.127 3.26 5.89-3.26-6.558 6.96z"/>
        </svg>
        <span className="hidden sm:inline">მოგვწერეთ ჩატით</span>
      </button>

      {/* ჩაშენებული ჩატის ფანჯარა საიტზე */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* ჩატის ჰედერი */}
          <div className="bg-gradient-to-r from-amber-700 to-amber-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <h4 className="font-bold text-sm">Lika's Workshop</h4>
                <p className="text-xs text-amber-200">ონლაინ რეჟიმშია</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-amber-200 hover:text-white text-lg font-bold px-2"
            >
              ✕
            </button>
          </div>

          {/* ჩატის შიგთავსი */}
          <div className="p-4 bg-amber-50/30 dark:bg-slate-950/40 text-sm">
            <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 max-w-[85%]">
              გამარჯობა! 👋 რა კითხვა გაქვთ ნამუშევრებთან ან შეკვეთასთან დაკავშირებით?
            </div>
          </div>

          {/* შეტყობინების გაგზავნის ფორმა */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="ჩაწერეთ შეტყობინება..."
              className="flex-1 px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              გაგზავნა
            </button>
          </form>
        </div>
      )}

      {/* საიტის ქვედა ნაწილი */}
      <footer className="w-full border-t border-amber-100 dark:border-slate-800 py-8 mt-16 bg-amber-50/50 dark:bg-slate-900 text-center">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-amber-900 dark:text-amber-100">
              Lika's Workshop / ლიკას სახელოსნო
            </h3>
            <p className="text-xs text-amber-700/70 dark:text-slate-400 mt-1">
              ხელნაკეთი ნივთები სიყვარულითა და ზრუნვით
            </p>
          </div>

          <a
            href="https://facebook.com/profile.php?id=61578253351470"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-amber-900 hover:text-blue-600 dark:text-amber-200 font-medium text-sm transition-colors bg-white dark:bg-slate-800 px-4 py-2 rounded-full border border-amber-200 dark:border-slate-700 shadow-sm"
          >
            <svg className="w-5 h-5 fill-current text-blue-600" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook გვერდი
          </a>
        </div>

        <div className="mt-6 text-xs text-slate-500 border-t border-amber-100 dark:border-slate-800/60 pt-4">
          © {new Date().getFullYear()} Lika's Workshop. ყველა უფლება დაცულია.
        </div>
      </footer>
    </>
  );
}