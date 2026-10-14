import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { X, Lock, Mail, User, ShieldCheck, Key } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { setCurrentUser, users, switchUserRole } = useMarketplace();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('sarvesh_collector');
  const [password, setPassword] = useState('password123');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      const found = users.find(
        (u) =>
          (u.username.toLowerCase() === username.toLowerCase().trim() ||
            u.email.toLowerCase() === username.toLowerCase().trim()) &&
          u.status === 'ACTIVE'
      );
      if (found) {
        setCurrentUser(found);
        onClose();
      } else {
        setError('Invalid username or account suspended. (Default password: password123)');
      }
    } else {
      if (!username || !email || !firstName) {
        setError('Please fill in all required registration fields.');
        return;
      }
      const newUser = {
        id: Date.now(),
        username: username.trim(),
        email: email.trim().toLowerCase(),
        firstName: firstName.trim(),
        lastName: lastName.trim() || 'Collector',
        role: 'USER' as const,
        rating: 5.0,
        status: 'ACTIVE' as const,
      };
      setCurrentUser(newUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-[#11141c] border border-[#232938] rounded-2xl shadow-2xl overflow-hidden my-6">
        <div className="px-6 py-4 bg-[#141822] border-b border-[#232938] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <h3 className="font-serif-display text-base font-bold text-white">
              {isLogin ? 'CURIO Collector Authentication' : 'Create Collector Account'}
            </h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Quick Demo Persona Shortcuts */}
          <div className="p-3 bg-[#151923] border border-[#242b3a] rounded-xl text-xs space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">
              Quick Test Personas (Pre-seeded with BCrypt):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  switchUserRole('USER');
                  onClose();
                }}
                className="p-2 bg-[#1b212f] hover:bg-[#232a3b] border border-[#293245] rounded text-left text-neutral-200 transition-colors"
              >
                <span className="font-bold block text-amber-300">sarvesh_collector</span>
                <span className="text-[10px] text-neutral-400">Regular Collector (User)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  switchUserRole('ADMIN');
                  onClose();
                }}
                className="p-2 bg-[#1b212f] hover:bg-[#232a3b] border border-[#293245] rounded text-left text-neutral-200 transition-colors"
              >
                <span className="font-bold block text-amber-300">admin_curio</span>
                <span className="text-[10px] text-neutral-400">Administrator</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-2.5 bg-rose-950/40 border border-rose-800/40 rounded-lg text-rose-300 text-xs">
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-[#161a24] border border-[#262c3b] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-[#161a24] border border-[#262c3b] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-neutral-400 block mb-1">Username *</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#161a24] border border-[#262c3b] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="text-neutral-400 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#161a24] border border-[#262c3b] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            <div>
              <label className="text-neutral-400 block mb-1">Password *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#161a24] border border-[#262c3b] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-neutral-950 font-bold rounded-lg shadow-md transition-all cursor-pointer"
            >
              {isLogin ? 'Sign In to CURIO' : 'Create Account'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-[#1e2330]">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2 cursor-pointer"
            >
              {isLogin ? "Don't have an account? Register as a collector" : 'Already registered? Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
