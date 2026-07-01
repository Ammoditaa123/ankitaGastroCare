'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setErrorMsg(data.error || 'Invalid credentials.');
      }
    } catch (err) {
      console.error('Login submit error:', err);
      setErrorMsg('Network error connecting to auth server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-teal-deep flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute w-[400px] h-[400px] rounded-full border border-sand-light/5 top-[-100px] right-[-100px] pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] rounded-full border border-sand-light/5 bottom-[-50px] left-[-50px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full bg-white border border-ink/10 rounded-sm shadow-xl p-8 md:p-10 relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="font-serif text-2xl md:text-3xl text-teal-deep font-bold leading-tight">
            Ankita Gastro Care
          </h2>
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-copper-deep mt-1">
            Receptionist Dashboard Login
          </p>
        </div>

        {errorMsg && (
          <div className="bg-full/5 border border-full/20 text-full text-xs font-semibold p-4 mb-6 flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold uppercase tracking-wider text-ink/60 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full bg-transparent border-b border-ink/20 focus:border-copper-deep focus:outline-none py-2 text-sm text-ink font-medium"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold uppercase tracking-wider text-ink/60 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-transparent border-b border-ink/20 focus:border-copper-deep focus:outline-none py-2 text-sm text-ink font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 bg-teal-deep text-sand-light text-xs font-bold uppercase tracking-widest hover:bg-copper-deep shadow-md transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6">
          <a href="/" className="text-[10px] text-ink/40 font-bold uppercase hover:underline">
            Back to Homepage
          </a>
        </div>
      </motion.div>
    </div>
  );
}
