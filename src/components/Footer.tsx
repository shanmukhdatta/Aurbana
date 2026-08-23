import React from 'react';
import { Leaf, ShieldCheck, QrCode, ArrowUpRight, CheckCircle2, Heart } from 'lucide-react';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-[#123524] text-white border-t border-[#2E7D32]/30 mt-auto">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => navigate('/')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2E7D32] flex items-center justify-center text-white shadow-md">
                <Leaf className="w-5 h-5 text-[#8BC34A]" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Aurbana
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              Aurbana collects fresh fruits and vegetables from farmers and suppliers, giving every produce batch an immutable digital identity and verifiable farm-to-table traceability.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs text-[#8BC34A] border border-[#8BC34A]/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Registered on Aurbana Platform</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#8BC34A]">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <button onClick={() => navigate('/')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/how-it-works')} className="hover:text-white transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/scan')} className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Scan Produce</span>
                  <ArrowUpRight className="w-3 h-3 text-[#8BC34A]" />
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/farms')} className="hover:text-white transition-colors">
                  Partner Farms
                </button>
              </li>
            </ul>
          </div>

          {/* Verification & Tech */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#8BC34A]">
              Traceability
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">
                  Digital Identity Standard
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/p/AUR-2026-TOM-8F42K')} className="hover:text-white transition-colors">
                  Sample Digital Certificate
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/qr-management')} className="hover:text-white transition-colors">
                  Crate Label Printing
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">
                  Farmer Onboarding
                </button>
              </li>
            </ul>
          </div>

          {/* Authorized Staff */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#8BC34A]">
              Authorized Staff
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">
                  Staff Portal Login
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/create')} className="hover:text-white transition-colors">
                  + Create Produce Identity
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors">
                  Operations Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/records')} className="hover:text-white transition-colors">
                  Produce Registry Database
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar & Trust Statement */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span>© 2026 Aurbana Technologies. All rights reserved.</span>
            <span>•</span>
            <span className="text-gray-300">One QR. One digital identity.</span>
          </div>

          <div className="text-center md:text-right max-w-md text-gray-400 text-[11px] leading-tight">
            Verification statement: Products are registered directly by suppliers and certified facility officers onto the Aurbana platform to provide transparent harvest and origin data.
          </div>
        </div>
      </div>
    </footer>
  );
};
