'use client';

import { useState } from 'react';
import { supabase } from './supabase';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(error.message);
      else setMessage('რეგისტრაცია წარმატებით გაიარა! შეამოწმეთ ელ-ფოსტა დასადასტურებლად.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black bg-gradient-to-r from-white to-violet-400 bg-clip-text text-transparent">
            {isSignUp ? 'ანგარიშის შექმნა' : 'სისტემაში შესვლა'}
          </h1>
          <p className="text-xs text-slate-400">
            {isSignUp ? 'შეიყვანეთ მონაცემები რეგისტრაციისთვის' : 'მართეთ თქვენი პროექტები და დავალებები'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">ელ-ფოსტა</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-violet-500 transition-all"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">პაროლი</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none focus:border-violet-500 transition-all"
            />
          </div>

          {message && (
            <div className="text-xs p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-lg shadow-violet-600/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'იტვირთება...' : isSignUp ? 'რეგისტრაცია' : 'შესვლა'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-slate-400 hover:text-violet-400 transition-colors cursor-pointer"
          >
            {isSignUp ? 'უკვე გაქვთ ანგარიში? შესვლა' : 'არ გაქვთ ანგარიში? დარეგისტრირდით'}
          </button>
        </div>
      </div>
    </div>
  );
}