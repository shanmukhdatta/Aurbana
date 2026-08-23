import React, { useState } from 'react';
import { 
  LogIn, 
  ShieldCheck, 
  Leaf, 
  Lock, 
  Mail, 
  ArrowRight, 
  UserCheck, 
  Sparkles,
  Building2
} from 'lucide-react';
import { UserSession } from '../types';
import { ProduceStorageService } from '../services/produceStorage';

interface LoginPageProps {
  onLoginSuccess: (user: UserSession) => void;
  navigate: (route: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, navigate }) => {
  const [email, setEmail] = useState('kavita.sharma@aurbana.com');
  const [password, setPassword] = useState('••••••••');
  const availableUsers = ProduceStorageService.getAvailableUsers();

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Match user or fallback to first
    const matched = availableUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || availableUsers[0];
    ProduceStorageService.setActiveUser(matched);
    onLoginSuccess(matched);
  };

  const handleQuickLogin = (user: UserSession) => {
    ProduceStorageService.setActiveUser(user);
    onLoginSuccess(user);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16 space-y-8">
      
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#123524] text-white flex items-center justify-center mx-auto shadow-md">
          <Leaf className="w-6 h-6 text-[#8BC34A]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#123524] tracking-tight">
          Aurbana Staff Portal
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Authorized access for produce inspectors, logistics managers, and quality officers.
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
        
        {/* Quick Demo Selector */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            1-Click Demo Staff Accounts:
          </label>
          <div className="space-y-2">
            {availableUsers.map((u) => (
              <button
                key={u.id}
                type="button"
                onClick={() => handleQuickLogin(u)}
                className="w-full p-2.5 rounded-2xl bg-[#F8FAF8] hover:bg-[#EAF6EC] border border-gray-100 hover:border-[#2E7D32]/30 transition-all flex items-center gap-3 text-left group"
              >
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-9 h-9 rounded-full object-cover border border-[#2E7D32]"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-extrabold text-[#123524] group-hover:text-[#2E7D32] flex items-center justify-between">
                    <span>{u.name}</span>
                    <span className="text-[10px] font-semibold text-[#2E7D32] bg-white px-2 py-0.5 rounded-md border border-[#2E7D32]/20">
                      {u.role}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 truncate">
                    {u.facility}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* OR Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-extrabold uppercase text-gray-400 tracking-wider absolute">
            or sign in with email
          </span>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleManualLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase">Staff Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32] outline-none"
                required
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32] outline-none"
                required
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#123524] text-white text-sm font-extrabold shadow-md transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Dashboard</span>
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-gray-500">
          Public visitors do not need an account to verify produce QR codes.
        </div>
      </div>

    </div>
  );
};
