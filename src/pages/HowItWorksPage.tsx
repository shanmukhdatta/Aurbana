import React from 'react';
import { 
  Truck, 
  ShieldCheck, 
  QrCode, 
  Store, 
  PlusCircle, 
  ScanLine, 
  ArrowRight, 
  Leaf, 
  CheckCircle2, 
  Sparkles,
  Smartphone,
  Layers,
  Database
} from 'lucide-react';

interface HowItWorksPageProps {
  navigate: (route: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ navigate }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF6EC] text-[#2E7D32] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transparent Produce Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#123524] tracking-tight">
          How Aurbana Digital Identity Works
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          From farm gate harvest to consumer dinner tables, discover how every fruit and vegetable batch is registered, tagged with a scannable dynamic QR code, and made universally verifiable.
        </p>
      </div>

      {/* High-level workflow summary bar */}
      <div className="p-6 rounded-3xl bg-[#123524] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-xs uppercase font-bold text-[#8BC34A] tracking-wider">
            Standard Operating Procedure
          </span>
          <h3 className="text-xl font-extrabold">
            Farm → Aurbana → QR Identity → Customer
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/create')}
            className="px-6 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#8BC34A] hover:text-[#123524] text-white text-xs font-extrabold transition-all"
          >
            Create Produce Batch
          </button>
          <button
            onClick={() => navigate('/scan')}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
          >
            Test Scanner
          </button>
        </div>
      </div>

      {/* Detailed 4-Step Breakdown */}
      <div className="space-y-12">
        
        {/* Step 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="lg:col-span-2 flex justify-center">
            <div className="w-20 h-20 rounded-3xl bg-[#EAF6EC] text-[#2E7D32] flex items-center justify-center font-black text-3xl shadow-inner">
              1
            </div>
          </div>
          <div className="lg:col-span-6 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#2E7D32] uppercase tracking-wider">
              <Truck className="w-4 h-4" />
              <span>Step 1 — Farm Collection</span>
            </div>
            <h2 className="text-2xl font-black text-[#123524]">
              Harvest & Regional Collection
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Aurbana collects fresh produce directly from partner farmers and grower cooperatives. The exact harvest hour, farm sector coordinates, and lead grower details are recorded on intake.
            </p>
          </div>
          <div className="lg:col-span-4 bg-[#F8FAF8] p-5 rounded-2xl border border-gray-100 text-xs space-y-2">
            <span className="font-bold uppercase text-gray-500 block">Logged Data:</span>
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
              <span>Farmer Name & Geographic Region</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
              <span>Harvest Time & Ambient Temperature</span>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="lg:col-span-2 flex justify-center">
            <div className="w-20 h-20 rounded-3xl bg-[#EAF6EC] text-[#2E7D32] flex items-center justify-center font-black text-3xl shadow-inner">
              2
            </div>
          </div>
          <div className="lg:col-span-6 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#2E7D32] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Step 2 — Quality Inspection & Registration</span>
            </div>
            <h2 className="text-2xl font-black text-[#123524]">
              Standardized Produce Registration
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Certified quality officers inspect the produce batch, measuring age since harvest, visual condition (Excellent, Good, Average, Poor), variety, and storage conditions.
            </p>
          </div>
          <div className="lg:col-span-4 bg-[#F8FAF8] p-5 rounded-2xl border border-gray-100 text-xs space-y-2">
            <span className="font-bold uppercase text-gray-500 block">Standardized Criteria:</span>
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
              <span>Validated Days Since Harvest</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
              <span>Visual Grade & Brix Sweetness Index</span>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="lg:col-span-2 flex justify-center">
            <div className="w-20 h-20 rounded-3xl bg-[#EAF6EC] text-[#2E7D32] flex items-center justify-center font-black text-3xl shadow-inner">
              3
            </div>
          </div>
          <div className="lg:col-span-6 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#2E7D32] uppercase tracking-wider">
              <QrCode className="w-4 h-4" />
              <span>Step 3 — Unique ID & Dynamic QR Generation</span>
            </div>
            <h2 className="text-2xl font-black text-[#123524]">
              Generate Digital Passport & QR Tags
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Aurbana generates a unique alphanumeric code (e.g. <code>AUR-2026-TOM-8F42K</code>) and a dynamic QR code pointing to <code>aurbana.com/p/AUR-...</code>. Thermal tags are printed and affixed to crates and packaging.
            </p>
          </div>
          <div className="lg:col-span-4 bg-[#F8FAF8] p-5 rounded-2xl border border-gray-100 text-xs space-y-2">
            <span className="font-bold uppercase text-gray-500 block">Architecture Highlights:</span>
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
              <span>No private supplier credentials exposed in QR</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
              <span>Crate stickers printable on standard thermal units</span>
            </div>
          </div>
        </div>

        {/* Step 4 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="lg:col-span-2 flex justify-center">
            <div className="w-20 h-20 rounded-3xl bg-[#EAF6EC] text-[#2E7D32] flex items-center justify-center font-black text-3xl shadow-inner">
              4
            </div>
          </div>
          <div className="lg:col-span-6 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#2E7D32] uppercase tracking-wider">
              <Smartphone className="w-4 h-4" />
              <span>Step 4 — Scan & Public Verification</span>
            </div>
            <h2 className="text-2xl font-black text-[#123524]">
              Instant Public Digital Identity Access
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Retailers, supermarket shoppers, or chefs scan the QR code with any standard smartphone camera. A mobile-optimized digital certificate opens instantly without requiring any login or app download.
            </p>
          </div>
          <div className="lg:col-span-4 bg-[#F8FAF8] p-5 rounded-2xl border border-gray-100 text-xs space-y-2">
            <span className="font-bold uppercase text-gray-500 block">Consumer Experience:</span>
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
              <span>Zero-install instant browser certificate</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
              <span>Full harvest-to-shelf journey timeline</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
