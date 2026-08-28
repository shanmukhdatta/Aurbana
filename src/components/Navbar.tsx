import React, { useState } from 'react';
import { 
  QrCode, 
  Leaf, 
  PlusCircle, 
  LayoutDashboard, 
  ClipboardList, 
  Printer, 
  Menu, 
  X, 
  LogIn, 
  LogOut, 
  ShieldCheck, 
  Building2,
  ScanLine,
  Sparkles
} from 'lucide-react';
import { UserSession } from '../types';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
  activeUser: UserSession | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  navigate,
  activeUser,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-200/70 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo */}
          <div 
            onClick={() => handleNav('/')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            id="nav-logo-btn"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#123524] flex items-center justify-center text-white shadow-sm shadow-[#2E7D32]/20 group-hover:bg-[#2E7D32] transition-colors border border-emerald-800/40">
              <Leaf className="w-5 h-5 text-[#8BC34A]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-xl tracking-tight text-[#123524]">
                  Aurbana
                </span>
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-[#EAF6EC] text-[#2E7D32] border border-[#2E7D32]/20">
                  AgriTech
                </span>
              </div>
              <span className="text-[11px] text-gray-500 font-medium hidden sm:block pt-0.5 tracking-tight">
                Digital Produce Passport
              </span>
            </div>
          </div>

          {/* Desktop Segmented Island Navigation (Clean Core Links) */}
          <nav className="hidden lg:flex items-center p-1.5 rounded-full bg-gray-100/90 border border-gray-200/80 shadow-inner-sm">
            <button
              onClick={() => handleNav('/')}
              id="nav-home-btn"
              className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                currentRoute === '/' 
                  ? 'bg-white text-[#123524] shadow-xs font-black' 
                  : 'text-gray-600 hover:text-[#123524] hover:bg-white/50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('/how-it-works')}
              id="nav-howitworks-btn"
              className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                currentRoute === '/how-it-works' 
                  ? 'bg-white text-[#123524] shadow-xs font-black' 
                  : 'text-gray-600 hover:text-[#123524] hover:bg-white/50'
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => handleNav('/farms')}
              id="nav-farms-btn"
              className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                currentRoute === '/farms' 
                  ? 'bg-white text-[#123524] shadow-xs font-black' 
                  : 'text-gray-600 hover:text-[#123524] hover:bg-white/50'
              }`}
            >
              Farms
            </button>
            <button
              onClick={() => handleNav('/about')}
              id="nav-about-btn"
              className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                currentRoute === '/about' 
                  ? 'bg-white text-[#123524] shadow-xs font-black' 
                  : 'text-gray-600 hover:text-[#123524] hover:bg-white/50'
              }`}
            >
              About
            </button>
            <button
              onClick={() => handleNav('/future-updates')}
              id="nav-ai-btn"
              title="Future AI Architecture & Roadmap"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-black transition-all cursor-pointer ${
                currentRoute === '/future-updates' || currentRoute === '/roadmap'
                  ? 'bg-[#123524] text-[#8BC34A] shadow-xs' 
                  : 'text-gray-700 hover:text-[#123524] hover:bg-white/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#2E7D32]" />
              <span>AI</span>
            </button>
          </nav>

          {/* Desktop Right Action Hub (With Standalone Scan Button) */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* SEPARATE DISTINCT SCAN PRODUCE BUTTON */}
            <button
              onClick={() => handleNav('/scan')}
              id="nav-scan-btn"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-extrabold transition-all cursor-pointer ${
                currentRoute === '/scan'
                  ? 'bg-[#2E7D32] text-white shadow-xs ring-2 ring-[#2E7D32]/25' 
                  : 'bg-[#EAF6EC] hover:bg-[#2E7D32] text-[#2E7D32] hover:text-white border border-[#2E7D32]/25 shadow-2xs'
              }`}
            >
              <ScanLine className="w-4 h-4" />
              <span>Scan Produce</span>
            </button>

            {activeUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                <button
                  onClick={() => handleNav('/dashboard')}
                  id="nav-dashboard-btn"
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-bold transition-colors ${
                    currentRoute === '/dashboard' ? 'bg-[#123524] text-white shadow-xs' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title="Staff Dashboard"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => handleNav('/create')}
                  id="nav-create-btn"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-black bg-gradient-to-r from-[#123524] to-[#2E7D32] text-white hover:from-[#1b4832] hover:to-[#256629] shadow-xs hover:shadow transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-[#8BC34A]" />
                  <span>+ Create Identity</span>
                </button>

                <button
                  onClick={() => handleNav('/records')}
                  id="nav-records-btn"
                  className={`p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors ${
                    currentRoute === '/records' ? 'text-[#2E7D32] bg-[#EAF6EC]' : ''
                  }`}
                  title="Produce Records"
                >
                  <ClipboardList className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleNav('/qr-management')}
                  id="nav-qrmanage-btn"
                  className={`p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors ${
                    currentRoute === '/qr-management' ? 'text-[#2E7D32] bg-[#EAF6EC]' : ''
                  }`}
                  title="QR Labels & Print Studio"
                >
                  <Printer className="w-4 h-4" />
                </button>

                {/* User avatar & logout */}
                <div className="flex items-center gap-2 ml-1 pl-2 border-l border-gray-200">
                  <img
                    src={activeUser.avatar}
                    alt={activeUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#8BC34A]"
                    title={`${activeUser.name} (${activeUser.role})`}
                  />
                  <button
                    onClick={onLogout}
                    id="nav-logout-btn"
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('/login')}
                  id="nav-login-btn"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold text-gray-700 hover:text-[#123524] hover:bg-gray-100/80 transition-colors"
                >
                  <LogIn className="w-4 h-4 text-gray-500" />
                  <span>Staff Login</span>
                </button>
                <button
                  onClick={() => handleNav('/create')}
                  id="nav-quick-create-btn"
                  className="flex items-center gap-1.5 px-4.5 py-2 rounded-full text-sm font-black bg-gradient-to-r from-[#123524] to-[#2E7D32] hover:from-[#1b4832] hover:to-[#256629] text-white shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-[#8BC34A]" />
                  <span>Create Identity</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => handleNav('/scan')}
              className="p-2 rounded-lg bg-[#EAF6EC] text-[#2E7D32]"
              title="Scan QR"
            >
              <ScanLine className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="nav-mobile-toggle-btn"
              className="p-2 rounded-lg text-[#123524] hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNav('/')}
              className={`p-2.5 text-left rounded-lg text-sm font-semibold ${
                currentRoute === '/' ? 'bg-[#EAF6EC] text-[#123524]' : 'text-gray-700'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('/how-it-works')}
              className={`p-2.5 text-left rounded-lg text-sm font-semibold ${
                currentRoute === '/how-it-works' ? 'bg-[#EAF6EC] text-[#123524]' : 'text-gray-700'
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => handleNav('/scan')}
              className={`p-2.5 text-left rounded-lg text-sm font-semibold ${
                currentRoute === '/scan' ? 'bg-[#2E7D32] text-white' : 'text-[#2E7D32] bg-[#EAF6EC]'
              }`}
            >
              Scan Produce
            </button>
            <button
              onClick={() => handleNav('/farms')}
              className={`p-2.5 text-left rounded-lg text-sm font-semibold ${
                currentRoute === '/farms' ? 'bg-[#EAF6EC] text-[#123524]' : 'text-gray-700'
              }`}
            >
              Farms
            </button>
            <button
              onClick={() => handleNav('/about')}
              className={`p-2.5 text-left rounded-lg text-sm font-semibold ${
                currentRoute === '/about' ? 'bg-[#EAF6EC] text-[#123524]' : 'text-gray-700'
              }`}
            >
              About Aurbana
            </button>
            <button
              onClick={() => handleNav('/future-updates')}
              className={`p-2.5 text-left rounded-lg text-sm font-semibold flex items-center justify-between ${
                currentRoute === '/future-updates' || currentRoute === '/roadmap' ? 'bg-[#EAF6EC] text-[#123524]' : 'text-gray-700'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>AI Architecture</span>
              </span>
              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-[#EAF6EC] text-[#2E7D32]">
                New
              </span>
            </button>
            <button
              onClick={() => handleNav('/contact')}
              className={`p-2.5 text-left rounded-lg text-sm font-semibold col-span-2 ${
                currentRoute === '/contact' ? 'bg-[#EAF6EC] text-[#123524]' : 'text-gray-700'
              }`}
            >
              Contact
            </button>
          </div>

          <div className="pt-3 border-t border-gray-100">
            {activeUser ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                  <img
                    src={activeUser.avatar}
                    alt={activeUser.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#2E7D32]"
                  />
                  <div>
                    <div className="font-bold text-sm text-[#123524]">{activeUser.name}</div>
                    <div className="text-xs text-[#2E7D32] font-medium">{activeUser.role}</div>
                  </div>
                </div>

                <button
                  onClick={() => handleNav('/dashboard')}
                  className="w-full flex items-center gap-2 p-2.5 rounded-lg text-sm font-semibold bg-[#123524] text-white"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => handleNav('/create')}
                  className="w-full flex items-center gap-2 p-2.5 rounded-lg text-sm font-semibold bg-[#2E7D32] text-white"
                >
                  <PlusCircle className="w-4 h-4 text-[#8BC34A]" />
                  <span>Create Produce Identity</span>
                </button>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => handleNav('/records')}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700"
                  >
                    <ClipboardList className="w-4 h-4" />
                    <span>Records</span>
                  </button>
                  <button
                    onClick={() => handleNav('/qr-management')}
                    className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700"
                  >
                    <Printer className="w-4 h-4" />
                    <span>QR Labels</span>
                  </button>
                </div>

                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => handleNav('/login')}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg text-sm font-bold bg-[#EAF6EC] text-[#123524] border border-[#2E7D32]/20"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Staff Login</span>
                </button>
                <button
                  onClick={() => handleNav('/create')}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg text-sm font-bold bg-[#2E7D32] text-white shadow-sm"
                >
                  <PlusCircle className="w-4 h-4 text-[#8BC34A]" />
                  <span>Create Produce Identity</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
