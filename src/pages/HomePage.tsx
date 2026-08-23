import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  ScanLine, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  Leaf, 
  Truck, 
  Store, 
  Sparkles, 
  Clock, 
  MapPin, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Layers,
  Award
} from 'lucide-react';
import { ProduceRecord } from '../types';
import { ProduceStorageService } from '../services/produceStorage';
import { ConditionBadge } from '../components/ConditionBadge';
import { generateQRCodeDataUrl } from '../utils/qrHelper';
import { getPublicProduceUrl } from '../utils/idGenerator';

interface HomePageProps {
  navigate: (route: string) => void;
  onOpenQR: (produce: ProduceRecord) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate, onOpenQR }) => {
  const [recentRecords, setRecentRecords] = useState<ProduceRecord[]>([]);
  const [heroQrUrl, setHeroQrUrl] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const records = ProduceStorageService.getRecords();
      setRecentRecords(records.slice(0, 4));

      // Generate QR for the hero tomato demo
      const demoTomato = records.find(r => r.produce_id === 'AUR-2026-TOM-8F42K') || records[0];
      if (demoTomato) {
        const url = getPublicProduceUrl(demoTomato.produce_id);
        generateQRCodeDataUrl(url, { width: 300, margin: 4 }).then(setHeroQrUrl);
      }
    };

    update();
    const unsubscribe = ProduceStorageService.subscribe(update);
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:py-16 lg:py-20 bg-gradient-to-b from-[#EAF6EC]/60 via-[#F8FAF8] to-white border-b border-[#EAF6EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Messaging & Actions */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF6EC] border border-[#2E7D32]/25 shadow-xs">
                <Leaf className="w-4 h-4 text-[#2E7D32]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#123524]">
                  Fresh Produce Digital Identity Platform
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#123524] tracking-tight leading-[1.1]">
                Create a digital identity for your fresh produce.
              </h1>

              {/* Subheadings */}
              <div className="space-y-2">
                <p className="text-lg sm:text-xl text-[#2E7D32] font-semibold leading-snug">
                  From farm to customer, give every batch a transparent digital identity with Aurbana.
                </p>
                <p className="text-base text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Enter the details, generate a QR code, and make your produce instantly identifiable.
                </p>
              </div>

              {/* Primary CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => navigate('/create')}
                  id="hero-create-btn"
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#2E7D32] text-white text-base font-extrabold hover:bg-[#123524] transition-all shadow-lg shadow-[#2E7D32]/25 hover:shadow-xl hover:-translate-y-0.5"
                >
                  <PlusCircle className="w-5 h-5 text-[#8BC34A]" />
                  <span>Create Produce Identity</span>
                </button>

                <button
                  onClick={() => navigate('/scan')}
                  id="hero-scan-btn"
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-white text-[#123524] border-2 border-[#2E7D32]/30 text-base font-bold hover:bg-[#EAF6EC] hover:border-[#2E7D32] transition-all shadow-xs"
                >
                  <ScanLine className="w-5 h-5 text-[#2E7D32]" />
                  <span>Scan a QR Code</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-gray-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                  <span>No login required for consumers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                  <span>Dynamic URL-backed QR codes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                  <span>Instant thermal label printing</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual - Fresh Crate + Attached Label + Floating UI Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md lg:max-w-none">
                
                {/* Background ambient glow */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#8BC34A]/20 via-[#2E7D32]/10 to-transparent rounded-3xl blur-2xl -z-10" />

                {/* Main Visual Card: Produce Crate Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&auto=format&fit=crop&q=80"
                    alt="Fresh organic produce harvest in wooden crates"
                    className="w-full h-80 sm:h-96 object-cover"
                  />

                  {/* Physical QR Label attached to produce packaging in image overlay */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-black/10 flex items-center gap-2">
                    <div className="w-8 h-8 bg-black text-white rounded-md flex items-center justify-center font-bold text-xs">
                      AU
                    </div>
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-900 leading-tight">
                        Aurbana Tagged
                      </div>
                      <div className="text-[9px] font-mono text-[#2E7D32] font-semibold">
                        AUR-2026-TOM-8F42K
                      </div>
                    </div>
                  </div>

                  {/* Overlay Gradient at bottom */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#8BC34A]">
                      Farm Harvest Batch #114
                    </div>
                    <div className="text-xl font-bold">
                      Green Valley Vine-Ripened Tomatoes
                    </div>
                  </div>
                </div>

                {/* Floating UI Card: "Aurbana Verified" as specified in Prompt */}
                <div className="sm:absolute sm:-bottom-8 sm:-left-8 mt-4 sm:mt-0 bg-white rounded-2xl p-5 shadow-2xl border border-[#2E7D32]/20 w-full sm:max-w-xs transition-transform hover:scale-[1.02]">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#2E7D32]">
                      <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                      <span>Aurbana Verified</span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      QR Active
                    </span>
                  </div>

                  <div className="py-3 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-medium">Produce:</span>
                      <span className="font-extrabold text-[#123524]">Tomatoes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-medium">Harvest:</span>
                      <span className="font-bold text-[#123524]">2 Days Ago</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-medium">Origin:</span>
                      <span className="font-bold text-[#123524]">Green Valley Farm</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 font-medium">Condition:</span>
                      <span className="font-bold text-emerald-700">Excellent</span>
                    </div>
                  </div>

                  {/* QR Snippet + Quick View */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-3">
                    {heroQrUrl && (
                      <img src={heroQrUrl} alt="Hero QR" className="w-12 h-12 rounded border p-0.5" />
                    )}
                    <button
                      onClick={() => navigate('/p/AUR-2026-TOM-8F42K')}
                      className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-[#EAF6EC] hover:bg-[#2E7D32] text-[#2E7D32] hover:text-white text-xs font-bold transition-colors"
                    >
                      <span>Inspect Identity</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS 4-STEP PROCESS (Prompt Requirement #4) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF6EC] text-[#2E7D32] text-xs font-bold uppercase tracking-wider">
            <span>Simple 4-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#123524] tracking-tight">
            How Aurbana Works
          </h2>
          <p className="text-base text-gray-600">
            From the moment fresh produce leaves the soil to when it reaches the customer's kitchen table.
          </p>
          <div className="pt-2">
            <span className="inline-block px-4 py-1.5 rounded-xl bg-gray-100 text-xs font-mono font-bold text-[#123524]">
              Farm → Aurbana → QR Identity → Customer
            </span>
          </div>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#2E7D32]/30 transition-all flex flex-col justify-between relative group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF6EC] text-[#2E7D32] flex items-center justify-center font-black text-xl group-hover:bg-[#2E7D32] group-hover:text-white transition-colors">
                1
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase font-extrabold text-[#2E7D32] tracking-wider">
                  Step 1
                </span>
                <h3 className="text-xl font-extrabold text-[#123524]">
                  Collect
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Aurbana receives fresh produce from a farmer or supplier at our regional collection hubs.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-[#2E7D32]">
              <Truck className="w-4 h-4" />
              <span>Farm Gate Collection</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#2E7D32]/30 transition-all flex flex-col justify-between relative group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF6EC] text-[#2E7D32] flex items-center justify-center font-black text-xl group-hover:bg-[#2E7D32] group-hover:text-white transition-colors">
                2
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase font-extrabold text-[#2E7D32] tracking-wider">
                  Step 2
                </span>
                <h3 className="text-xl font-extrabold text-[#123524]">
                  Register
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                An authorized Aurbana user enters produce information into the platform (produce name, age, condition, farm origin).
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-[#2E7D32]">
              <ShieldCheck className="w-4 h-4" />
              <span>Standardized Data Entry</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#2E7D32]/30 transition-all flex flex-col justify-between relative group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF6EC] text-[#2E7D32] flex items-center justify-center font-black text-xl group-hover:bg-[#2E7D32] group-hover:text-white transition-colors">
                3
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase font-extrabold text-[#2E7D32] tracking-wider">
                  Step 3
                </span>
                <h3 className="text-xl font-extrabold text-[#123524]">
                  Generate
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Aurbana creates a unique Produce ID (e.g. AUR-2026-TOM-8F42K) and prints dynamic scannable QR tags for crates.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-[#2E7D32]">
              <QrCode className="w-4 h-4" />
              <span>Unique Digital QR Code</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#2E7D32]/30 transition-all flex flex-col justify-between relative group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF6EC] text-[#2E7D32] flex items-center justify-center font-black text-xl group-hover:bg-[#2E7D32] group-hover:text-white transition-colors">
                4
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase font-extrabold text-[#2E7D32] tracking-wider">
                  Step 4
                </span>
                <h3 className="text-xl font-extrabold text-[#123524]">
                  Scan
                </h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Anyone handling or buying the produce scans the QR to instantly view its verified origin, age, and journey.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-[#2E7D32]">
              <Store className="w-4 h-4" />
              <span>Instant Public Transparency</span>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT PRODUCE IDENTITIES (LIVE EXPLORER) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF6EC] text-[#2E7D32] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Registry</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#123524] tracking-tight">
              Recently Registered Produce Batches
            </h2>
            <p className="text-sm text-gray-600">
              Each record possesses a public digital identity URL and verified traceability passport.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/records')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>View All Records</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#2E7D32]/30 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image Header */}
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  <img
                    src={record.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'}
                    alt={record.produce_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <ConditionBadge condition={record.condition} size="sm" />
                  </div>
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded-md">
                    {record.age_days === 0 ? 'Fresh Today' : `${record.age_days}d ago`}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase text-[#2E7D32] tracking-wider">
                      {record.category}
                    </span>
                    <h3 className="text-xl font-extrabold text-[#123524] truncate">
                      {record.produce_name}
                    </h3>
                    {record.variety && (
                      <p className="text-xs text-gray-500 truncate">
                        {record.variety}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{record.origin}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>Registered {new Date(record.registration_date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#F8FAF8] border border-[#EAF6EC] flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-500 uppercase">ID</span>
                    <code className="text-xs font-mono font-bold text-[#123524]">
                      {record.produce_id}
                    </code>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onOpenQR(record)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-[#EAF6EC] hover:text-[#123524] hover:border-[#2E7D32]/30 transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>View QR</span>
                </button>

                <button
                  onClick={() => navigate(`/p/${record.produce_id}`)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#2E7D32] text-white text-xs font-bold hover:bg-[#123524] transition-colors"
                >
                  <span>Certificate</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY AURBANA / TRUST PILLARS */}
      <section className="bg-[#123524] text-white py-16 sm:py-20 rounded-3xl max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2E7D32]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#8BC34A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-[#8BC34A] border border-[#8BC34A]/20">
              <Award className="w-3.5 h-3.5" />
              <span>Technology & Trust</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Know where your produce comes from.
            </h2>

            <p className="text-gray-300 text-base leading-relaxed">
              In modern supply chains, produce changes hands up to 6 times before reaching the kitchen. Aurbana replaces guesswork with verifiable digital identity.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#2E7D32] flex items-center justify-center shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5 text-[#8BC34A]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">One QR. One digital identity.</h4>
                  <p className="text-sm text-gray-300">
                    Each QR code points to a permanent cloud record rather than static encoded strings, ensuring updates and status changes propagate instantly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#2E7D32] flex items-center justify-center shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5 text-[#8BC34A]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Certified Harvest Age Tracking</h4>
                  <p className="text-sm text-gray-300">
                    Eliminate stale produce. Know the exact day and conditions under which the crop was harvested and graded.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-[#2E7D32] flex items-center justify-center shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5 text-[#8BC34A]" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Empowering Farmers & Transparent Retailers</h4>
                  <p className="text-sm text-gray-300">
                    Smallholders and organic growers get credit for quality, while consumers shop with confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md space-y-6">
            <div className="text-center space-y-2">
              <span className="text-xs uppercase font-extrabold text-[#8BC34A] tracking-wider">
                Instant Verification Sample
              </span>
              <h3 className="text-2xl font-black text-white">
                Test Scan on Any Device
              </h3>
              <p className="text-xs text-gray-300">
                Point your phone camera or click below to simulate an instant QR lookup
              </p>
            </div>

            {/* Quick action sample buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate('/p/AUR-2026-TOM-8F42K')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🍅</span>
                  <div>
                    <div className="font-bold text-white text-sm">Tomato — Punjab</div>
                    <div className="text-[11px] text-gray-300">AUR-2026-TOM-8F42K • 2 Days</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8BC34A]" />
              </button>

              <button
                onClick={() => navigate('/p/AUR-2026-MAN-4K21P')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🥭</span>
                  <div>
                    <div className="font-bold text-white text-sm">Alphonso Mango — Ratnagiri</div>
                    <div className="text-[11px] text-gray-300">AUR-2026-MAN-4K21P • 3 Days</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8BC34A]" />
              </button>

              <button
                onClick={() => navigate('/p/AUR-2026-CAR-7H31X')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🥕</span>
                  <div>
                    <div className="font-bold text-white text-sm">Organic Carrot — Ooty</div>
                    <div className="text-[11px] text-gray-300">AUR-2026-CAR-7H31X • 1 Day</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#8BC34A]" />
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => navigate('/scan')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8BC34A] text-[#123524] font-extrabold text-sm hover:bg-white transition-colors shadow-md"
              >
                <ScanLine className="w-4 h-4" />
                <span>Open Live Camera Scanner</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#EAF6EC] via-white to-[#EAF6EC] border border-[#2E7D32]/20 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="space-y-3 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-black text-[#123524] tracking-tight">
              Ready to give your produce a digital passport?
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Join dozens of forward-thinking farms, cooperatives, and supply hubs in creating full farm-to-table transparency.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/create')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#2E7D32] hover:bg-[#123524] text-white font-extrabold text-sm shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4 text-[#8BC34A]" />
              <span>Create Produce Identity</span>
            </button>

            <button
              onClick={() => navigate('/contact')}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
            >
              Farmer Partnership
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
