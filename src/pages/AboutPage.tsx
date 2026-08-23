import React from 'react';
import { 
  Leaf, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  Users, 
  Globe2, 
  ArrowRight
} from 'lucide-react';

interface AboutPageProps {
  navigate: (route: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF6EC] text-[#2E7D32] text-xs font-bold uppercase tracking-wider">
          <Leaf className="w-3.5 h-3.5" />
          <span>Our AgriTech Mission</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#123524] tracking-tight">
          About Aurbana
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          Building the transparent digital identity layer for agriculture — connecting regional farms, quality inspectors, distributors, and consumers through verifiable passports.
        </p>
      </div>

      {/* Mission & Problem Statement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF6EC] text-[#2E7D32] flex items-center justify-center">
            <Globe2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-[#123524]">
            The Agriculture Information Gap
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Fresh produce is one of the most critical parts of the human diet, yet consumers rarely know where their vegetables were grown, when they were harvested, or how long they have been sitting in transit cold rooms.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Aurbana was founded to make food transparency universal, frictionless, and digitally verifiable through a single QR code scan.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF6EC] text-[#2E7D32] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-[#123524]">
            Traceability Without False Claims
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We adhere strictly to factual registration standards. Aurbana indicates <strong>"Registered on Aurbana"</strong> and presents timestamped farm intake logs rather than making unverified marketing claims.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Every Produce ID (e.g. <code>AUR-2026-TOM-8F42K</code>) corresponds to real batch intake data logged at our physical transit and grading depots.
          </p>
        </div>
      </div>

      {/* 3 Core Principles */}
      <div className="space-y-6">
        <h3 className="text-xl font-extrabold text-[#123524] text-center">
          Our Core Principles
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#F8FAF8] border border-gray-100 space-y-2 text-center">
            <div className="text-2xl">🌱</div>
            <h4 className="font-extrabold text-[#123524] text-base">Farm-First Empowerment</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Giving diligent growers and cooperatives verifiable proof of quality so they receive fair compensation for fresher harvests.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F8FAF8] border border-gray-100 space-y-2 text-center">
            <div className="text-2xl">⚡</div>
            <h4 className="font-extrabold text-[#123524] text-base">Frictionless Access</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              No apps to install, no passwords for consumers. Point any phone camera at the crate tag to open the digital passport immediately.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F8FAF8] border border-gray-100 space-y-2 text-center">
            <div className="text-2xl">🛡️</div>
            <h4 className="font-extrabold text-[#123524] text-base">Data Security & Integrity</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Dynamic cloud URL architecture keeps private business and pricing data strictly separated from public consumer certificates.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 rounded-3xl bg-[#123524] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center md:text-left">
          <h3 className="text-xl font-extrabold">
            Ready to explore verified produce?
          </h3>
          <p className="text-xs text-gray-300">
            View live batch certificates or test our real-time camera scanner.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/scan')}
            className="px-6 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#8BC34A] hover:text-[#123524] text-white text-xs font-extrabold transition-all"
          >
            Scan a Produce QR
          </button>
          <button
            onClick={() => navigate('/farms')}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
          >
            Explore Partner Farms
          </button>
        </div>
      </div>

    </div>
  );
};
