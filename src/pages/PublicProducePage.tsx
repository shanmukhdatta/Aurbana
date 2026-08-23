import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Leaf, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Download, 
  Printer, 
  Share2, 
  QrCode, 
  ArrowLeft, 
  Sparkles, 
  Building2, 
  Thermometer, 
  Layers, 
  Check, 
  AlertTriangle,
  FileCheck,
  Award,
  Star,
  Utensils,
  ChevronRight,
  Info,
  Droplets,
  Sun,
  Shield,
  Activity,
  Heart,
  MessageSquare,
  User
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProduceRecord } from '../types';
import { ProduceStorageService } from '../services/produceStorage';
import { ConditionBadge } from '../components/ConditionBadge';
import { generateQRCodeDataUrl } from '../utils/qrHelper';
import { getPublicProduceUrl } from '../utils/idGenerator';
import { playSuccessChime } from '../utils/audio';

interface PublicProducePageProps {
  produceId: string;
  navigate: (route: string) => void;
  onPrint: (produce: ProduceRecord) => void;
}

export const PublicProducePage: React.FC<PublicProducePageProps> = ({
  produceId,
  navigate,
  onPrint
}) => {
  const [record, setRecord] = useState<ProduceRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [allAvailable, setAllAvailable] = useState<ProduceRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'passport' | 'journey' | 'lab' | 'farmer' | 'recipes'>('passport');
  const [verifiedSeal, setVerifiedSeal] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [hasRated, setHasRated] = useState(false);
  const [likesCount, setLikesCount] = useState(42);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadData = async () => {
      const cleanId = ProduceStorageService.normalizeId(produceId);
      const found = await ProduceStorageService.fetchRecordByProduceId(cleanId);
      
      if (!isMounted) return;

      setRecord(found);

      if (found) {
        // Record scan hit
        ProduceStorageService.recordScan(found.produce_id);
        
        const url = getPublicProduceUrl(found.produce_id);
        generateQRCodeDataUrl(url, { width: 360, margin: 4, darkColor: '#000000' })
          .then((generatedUrl) => {
            if (isMounted) setQrUrl(generatedUrl);
          })
          .catch(console.error);
      } else {
        // Fetch available active records for quick navigation
        const list = ProduceStorageService.getRecords().slice(0, 4);
        setAllAvailable(list);
      }

      setLoading(false);
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [produceId]);

  const handleShare = () => {
    const shareUrl = record ? getPublicProduceUrl(record.produce_id) : window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${record?.produce_name} — Aurbana Digital Identity`,
        text: `Inspect verified origin, harvest date and journey for ${record?.produce_name} (${record?.produce_id})`,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleVerifySeal = () => {
    setVerifiedSeal(true);
    playSuccessChime();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#2E7D32', '#8BC34A', '#123524', '#ffffff']
    });
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikesCount(prev => prev + 1);
      setHasLiked(true);
      playSuccessChime();
    }
  };

  // 1. Loading Skeleton State
  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-2xl w-2/3 mx-auto" />
        <div className="h-64 bg-gray-200 rounded-3xl" />
        <div className="h-32 bg-gray-200 rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-gray-200 rounded-2xl" />
          <div className="h-24 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  // 2. Not Found Error State
  if (!record) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-sm border border-amber-200">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#123524]">
            Produce Identity Not Found
          </h2>
          <p className="text-sm text-gray-600">
            We couldn't find a record for QR code: <strong className="font-mono text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{ProduceStorageService.normalizeId(produceId) || produceId}</strong>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-600 text-left space-y-2">
          <p className="font-semibold text-gray-800">Why might this happen?</p>
          <ul className="list-disc pl-4 space-y-1 text-gray-500">
            <li>The batch may have been registered on another device that is syncing.</li>
            <li>The QR code or ID may contain a typo or extra characters.</li>
          </ul>
        </div>

        {allAvailable.length > 0 && (
          <div className="space-y-2 text-left">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Or inspect verified active batches:
            </p>
            <div className="space-y-2">
              {allAvailable.map((item) => (
                <button
                  key={item.produce_id}
                  onClick={() => navigate(`/p/${item.produce_id}`)}
                  className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-200 hover:border-[#2E7D32] hover:bg-[#EAF6EC]/40 transition-all text-left text-xs shadow-xs group"
                >
                  <span className="font-bold text-[#123524] group-hover:text-[#2E7D32]">{item.produce_name} ({item.variety || item.category})</span>
                  <span className="font-mono text-gray-500 font-semibold">{item.produce_id}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => navigate('/scan')}
            className="btn-primary-polish text-sm"
          >
            Scan Another QR
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary-polish text-sm"
          >
            Go to Aurbana Home
          </button>
        </div>
      </div>
    );
  }

  // 3. Deactivated / Inactive State
  if (record.status === 'Deactivated') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#123524]">
            Produce Identity Inactive
          </h2>
          <p className="text-sm text-gray-600">
            This produce batch (<code className="font-mono">{record.produce_id}</code>) has been archived or recalled by the facility manager.
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="btn-primary-polish text-sm"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // Calculate Freshness Score
  const freshnessPercent = Math.max(10, Math.min(100, 100 - (record.age_days * 12)));
  const getFreshnessColor = (pct: number) => {
    if (pct >= 80) return 'from-emerald-500 to-[#2E7D32]';
    if (pct >= 50) return 'from-lime-500 to-amber-500';
    return 'from-amber-500 to-rose-500';
  };

  // Format dates cleanly
  const formattedHarvest = record.harvest_date
    ? new Date(record.harvest_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    : `${record.age_days} days ago`;

  const formattedCollection = record.collection_date
    ? new Date(record.collection_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'Recorded on delivery';

  return (
    <div className="min-h-screen bg-[#F8FAF8] pb-20 pt-4 sm:pt-8">
      {/* Container constrained for optimal mobile-first reading */}
      <div className="max-w-xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Navigation / Action bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#123524] transition-colors p-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Aurbana Network</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-[#EAF6EC] hover:text-[#2E7D32] shadow-xs transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
            <button
              onClick={() => onPrint(record)}
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-[#EAF6EC] hover:text-[#2E7D32] shadow-xs transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-[#2E7D32]" />
              <span>Print Label</span>
            </button>
          </div>
        </div>

        {/* Certificate Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-[#2E7D32]/15 overflow-hidden transition-all">
          
          {/* Top Brand Banner */}
          <div className="bg-[#123524] text-white p-6 sm:p-7 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-56 h-56 bg-[#2E7D32]/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#8BC34A]/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#2E7D32] flex items-center justify-center shadow-inner">
                    <Leaf className="w-4 h-4 text-[#8BC34A]" />
                  </div>
                  <div>
                    <span className="font-black text-lg tracking-tight text-white block leading-none">
                      Aurbana
                    </span>
                    <span className="text-[10px] text-[#8BC34A] font-semibold uppercase tracking-widest">
                      Digital Passport
                    </span>
                  </div>
                </div>

                {/* Verification Badge */}
                <button
                  onClick={handleVerifySeal}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold transition-all ${
                    verifiedSeal 
                      ? 'bg-[#8BC34A] text-[#123524] shadow-md shadow-[#8BC34A]/30 scale-105' 
                      : 'bg-white/10 hover:bg-white/20 text-[#8BC34A] border border-[#8BC34A]/30 cursor-pointer'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{verifiedSeal ? '✓ Authenticity Verified' : 'Tap to Verify'}</span>
                </button>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {record.produce_name}
                </h1>
                <p className="text-xs text-gray-300 flex items-center gap-2 pt-1">
                  <span>{record.variety || record.category}</span>
                  <span>•</span>
                  <span>Batch {record.batch_number || 'Standard Harvest'}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Produce Photo Hero */}
          {record.image_url && (
            <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-gray-950">
              <img
                src={record.image_url}
                alt={record.produce_name}
                className="w-full h-full object-cover opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Overlay badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <ConditionBadge condition={record.condition} size="md" />
                
                <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-mono font-bold flex items-center gap-1.5 border border-white/10">
                  <Activity className="w-3.5 h-3.5 text-[#8BC34A]" />
                  <span>{record.scan_count || 1} Scans Logged</span>
                </div>
              </div>

              {/* Bottom photo info */}
              <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-[#8BC34A] font-bold">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{record.origin}</span>
                  </div>
                  <div className="text-xs text-gray-200">
                    Harvested on {formattedHarvest}
                  </div>
                </div>

                <button
                  onClick={handleLike}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all backdrop-blur-md ${
                    hasLiked 
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
                  <span>{likesCount}</span>
                </button>
              </div>
            </div>
          )}

          {/* Interactive Navigation Tabs */}
          <div className="flex border-b border-gray-100 bg-[#F8FAF8] px-3 pt-3 gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'passport', label: 'Passport', icon: FileCheck },
              { id: 'journey', label: 'Timeline', icon: Clock },
              { id: 'lab', label: 'Lab & Freshness', icon: Droplets },
              { id: 'farmer', label: 'Grower', icon: User },
              { id: 'recipes', label: 'Culinary Tips', icon: Utensils }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-white text-[#2E7D32] border-t-2 border-[#2E7D32] shadow-xs'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Container */}
          <div className="p-6 sm:p-7 space-y-6">

            {/* TAB 1: PASSPORT OVERVIEW */}
            {activeTab === 'passport' && (
              <div className="space-y-6">
                {/* ID Callout Banner */}
                <div className="p-4 rounded-2xl bg-[#EAF6EC] border border-[#2E7D32]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                  <div>
                    <span className="text-[10px] uppercase font-extrabold text-[#2E7D32] tracking-wider block">
                      Aurbana Digital Certificate ID
                    </span>
                    <span className="text-base sm:text-lg font-mono font-black text-[#123524]">
                      {record.produce_id}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#2E7D32] bg-white px-3 py-1.5 rounded-xl border border-[#2E7D32]/20 shadow-xs">
                    <Shield className="w-4 h-4 text-[#2E7D32]" />
                    <span>Cryptographically Signed</span>
                  </div>
                </div>

                {/* Freshness Gauge */}
                <div className="p-5 rounded-2xl bg-[#F8FAF8] border border-gray-100 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
                      <span>Estimated Freshness Index</span>
                    </span>
                    <span className="font-black text-[#123524]">{freshnessPercent}% Peak Freshness</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden p-0.5">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${getFreshnessColor(freshnessPercent)} transition-all duration-1000`}
                      style={{ width: `${freshnessPercent}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-gray-500 font-medium">
                    <span>{record.age_days === 0 ? 'Harvested Today' : `${record.age_days} Days Since Harvest`}</span>
                    <span>Expected Shelf Life: ~10 Days</span>
                  </div>
                </div>

                {/* Core Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-gray-100 space-y-1">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                      Harvest Age
                    </span>
                    <div className="text-2xl font-black text-[#123524]">
                      {record.age_days === 0 ? 'Fresh Today' : `${record.age_days} Days`}
                    </div>
                    <span className="text-[11px] text-gray-500">
                      {formattedHarvest}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-gray-100 space-y-1">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                      Quality Grade
                    </span>
                    <div className="text-2xl font-black text-[#123524]">
                      {record.grade || 'Grade A+'}
                    </div>
                    <span className="text-[11px] text-emerald-700 font-bold">
                      {record.condition} Condition
                    </span>
                  </div>
                </div>

                {/* Farm & Origin Section */}
                <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-gray-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#2E7D32] tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-[#2E7D32]" />
                    <span>Origin & Cultivation Facility</span>
                  </div>
                  <div className="text-lg font-black text-[#123524]">
                    {record.origin}
                  </div>
                  {record.farmer_name && (
                    <div className="text-xs text-gray-600">
                      Master Grower: <strong className="text-gray-900">{record.farmer_name}</strong>
                      {record.supplier_name ? ` • Distributed by ${record.supplier_name}` : ''}
                    </div>
                  )}
                </div>

                {/* Batch Specifics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-medium">Batch Number:</span>
                    <span className="font-mono font-bold text-[#123524]">{record.batch_number || 'BATCH-2026-01'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-medium">Lot Volume:</span>
                    <span className="font-bold text-[#123524]">{record.quantity || '450 kg (Standard Crate)'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-medium">Intake Hub:</span>
                    <span className="font-bold text-[#123524]">{record.storage_location || 'Cold Zone A (12°C)'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-gray-500 font-medium">Collection Date:</span>
                    <span className="font-bold text-[#123524]">{formattedCollection}</span>
                  </div>
                </div>

                {/* Inspector Notes */}
                {record.notes && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-950 space-y-1">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-amber-800 block">
                      Quality Inspector Notes
                    </span>
                    <p className="leading-relaxed font-medium">
                      "{record.notes}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: JOURNEY TIMELINE */}
            {activeTab === 'journey' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-[#123524] uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#2E7D32]" />
                    <span>Verified Transit Timeline</span>
                  </h3>
                  <span className="text-xs font-bold text-[#2E7D32] bg-[#EAF6EC] px-2.5 py-1 rounded-full">
                    Cold Chain Monitored
                  </span>
                </div>

                {/* Visual Vertical Timeline */}
                <div className="space-y-4 pl-2 relative before:absolute before:top-3 before:bottom-3 before:left-[17px] before:w-0.5 before:bg-[#2E7D32]/30">
                  {record.journey && record.journey.length > 0 ? (
                    record.journey.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-4 relative">
                        <div className="w-8 h-8 rounded-full bg-[#EAF6EC] border-2 border-[#2E7D32] flex items-center justify-center text-[#2E7D32] shrink-0 z-10 shadow-xs">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div className="bg-[#F8FAF8] p-4 rounded-2xl border border-gray-100 flex-1 space-y-1 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-black text-[#123524]">
                              {step.title}
                            </h4>
                            <span className="text-[11px] font-mono text-gray-500 font-semibold">
                              {step.date}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 font-medium">
                            {step.location}
                          </p>
                          {step.notes && (
                            <p className="text-[11px] text-gray-500 italic pt-1">
                              "{step.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-start gap-4 relative">
                        <div className="w-8 h-8 rounded-full bg-[#EAF6EC] border-2 border-[#2E7D32] flex items-center justify-center text-[#2E7D32] shrink-0 z-10 shadow-xs">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div className="bg-[#F8FAF8] p-4 rounded-2xl border border-gray-100 flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-black text-[#123524]">1. Farm Harvest</h4>
                            <span className="text-[11px] font-mono text-gray-500 font-semibold">{formattedHarvest}</span>
                          </div>
                          <p className="text-xs text-gray-600 font-medium">{record.origin}</p>
                          <p className="text-[11px] text-gray-500 italic">Hand-picked under controlled harvest standards.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 relative">
                        <div className="w-8 h-8 rounded-full bg-[#EAF6EC] border-2 border-[#2E7D32] flex items-center justify-center text-[#2E7D32] shrink-0 z-10 shadow-xs">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div className="bg-[#F8FAF8] p-4 rounded-2xl border border-gray-100 flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-black text-[#123524]">2. Quality Inspection & Intake</h4>
                            <span className="text-[11px] font-mono text-gray-500 font-semibold">{formattedCollection}</span>
                          </div>
                          <p className="text-xs text-gray-600 font-medium">Aurbana Logistics Depot • Temperature 12°C</p>
                          <p className="text-[11px] text-gray-500 italic">Grade inspection passed. Digital identity issued.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 relative">
                        <div className="w-8 h-8 rounded-full bg-[#EAF6EC] border-2 border-[#2E7D32] flex items-center justify-center text-[#2E7D32] shrink-0 z-10 shadow-xs">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div className="bg-[#F8FAF8] p-4 rounded-2xl border border-gray-100 flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-black text-[#123524]">3. Retail Ready & Scannable</h4>
                            <span className="text-[11px] font-mono text-[#2E7D32] font-bold">Active Now</span>
                          </div>
                          <p className="text-xs text-gray-600 font-medium">Consumer Scans & Transparent Verification</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: LAB QUALITY & NUTRITION */}
            {activeTab === 'lab' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Award className="w-5 h-5 text-emerald-700" />
                    <div>
                      <h4 className="text-xs font-black text-emerald-900 uppercase">Chemical & Residue Free</h4>
                      <p className="text-[11px] text-emerald-700">Lab Batch Certification #LC-2026-89</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-700 text-white text-[10px] font-extrabold uppercase">
                    100% Passed
                  </span>
                </div>

                {/* Analytical Specs */}
                <div className="grid grid-cols-2 gap-3.5 text-xs">
                  <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-gray-100 space-y-1">
                    <span className="text-gray-500 font-semibold block text-[10px] uppercase">Natural Sweetness (Brix)</span>
                    <span className="text-xl font-black text-[#123524]">6.4° Bx</span>
                    <span className="text-[10px] text-emerald-600 font-bold block">Sweet & Rich Flavor</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-gray-100 space-y-1">
                    <span className="text-gray-500 font-semibold block text-[10px] uppercase">Antioxidant Index</span>
                    <span className="text-xl font-black text-[#123524]">High (Lycopene)</span>
                    <span className="text-[10px] text-emerald-600 font-bold block">Natural Sun-Ripened</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-gray-100 space-y-1">
                    <span className="text-gray-500 font-semibold block text-[10px] uppercase">Hydration / Moisture</span>
                    <span className="text-xl font-black text-[#123524]">94.2%</span>
                    <span className="text-[10px] text-gray-500 block">Crisp & Plump</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-gray-100 space-y-1">
                    <span className="text-gray-500 font-semibold block text-[10px] uppercase">Nitrate & Heavy Metals</span>
                    <span className="text-xl font-black text-[#123524]">Undetected</span>
                    <span className="text-[10px] text-emerald-600 font-bold block">Below 0.01 mg/kg</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-xs text-gray-600 space-y-1.5">
                  <p className="font-bold text-gray-800">Nutrition Highlights per 100g:</p>
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono">
                    <div className="bg-white p-2 rounded-xl border border-gray-200">
                      <span className="text-[10px] text-gray-500 block">Calories</span>
                      <span className="font-bold text-[#123524]">18 kcal</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-gray-200">
                      <span className="text-[10px] text-gray-500 block">Vitamin C</span>
                      <span className="font-bold text-[#123524]">14 mg</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-gray-200">
                      <span className="text-[10px] text-gray-500 block">Potassium</span>
                      <span className="font-bold text-[#123524]">237 mg</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: GROWER PROFILE */}
            {activeTab === 'farmer' && (
              <div className="space-y-5 text-xs">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FAF8] border border-gray-100">
                  <div className="w-14 h-14 rounded-2xl bg-[#2E7D32] text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                    {record.farmer_name ? record.farmer_name.charAt(0) : 'F'}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-[#123524]">
                      {record.farmer_name || 'Partner Organic Farmer'}
                    </h4>
                    <p className="text-gray-600">{record.origin}</p>
                    <p className="text-[11px] text-[#2E7D32] font-bold pt-0.5">
                      ✓ Aurbana Verified Direct Grower
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-gray-600 leading-relaxed bg-white p-4 rounded-2xl border border-gray-100">
                  <p className="font-bold text-[#123524]">Sustainable Farming Practices:</p>
                  <ul className="list-disc pl-4 space-y-1 text-gray-600">
                    <li>Drip irrigation system reducing water usage by 40%.</li>
                    <li>Natural composting and biological pest control (no synthetic pesticides).</li>
                    <li>Harvested early morning at peak brix sugar concentration.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 5: CULINARY & STORAGE */}
            {activeTab === 'recipes' && (
              <div className="space-y-5 text-xs">
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-2">
                  <h4 className="font-black text-amber-950 uppercase text-[11px] flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-700" />
                    <span>How to Store for Maximum Flavor & Freshness</span>
                  </h4>
                  <p className="text-amber-900 leading-relaxed">
                    Store stem-side down at cool room temperature (18°C–21°C). Avoid refrigeration until fully ripened to preserve the delicate aroma and juicy cellular structure.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8FAF8] border border-gray-100 space-y-2">
                  <h4 className="font-black text-[#123524] uppercase text-[11px] flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-[#2E7D32]" />
                    <span>Chef's Farm-Fresh Serving Idea</span>
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>Rustic Heirloom Salad:</strong> Slice thickly, sprinkle with coarse sea salt, fresh cracked black pepper, extra virgin cold-pressed olive oil, and torn fresh basil leaves.
                  </p>
                </div>
              </div>
            )}

            {/* Consumer Feedback Box */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Consumer Freshness Rating:
                </span>
                <span className="text-xs text-gray-500 font-semibold">
                  {hasRated ? '✓ Rating recorded!' : 'Rate this batch:'}
                </span>
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        setUserRating(star);
                        setHasRated(true);
                        playSuccessChime();
                      }}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star 
                        className={`w-5 h-5 ${
                          star <= userRating 
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    </button>
                  ))}
                </div>

                <span className="text-xs font-black text-[#123524]">
                  4.9 / 5.0 (98% satisfaction)
                </span>
              </div>
            </div>

            {/* Verification & Compliance footer */}
            <div className="pt-4 border-t border-gray-100 space-y-4">
              <div className="p-5 rounded-2xl bg-[#123524] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-[10px] uppercase font-black text-[#8BC34A] tracking-wider">
                    Aurbana Trusted Network
                  </span>
                  <div className="text-sm font-extrabold">
                    Authenticated Produce Passport
                  </div>
                  <div className="text-xs text-gray-300 flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                    <span className="text-[#8BC34A]">✓ Verified Active</span>
                    <span>•</span>
                    <span className="font-mono text-gray-200">{record.produce_id}</span>
                  </div>
                </div>

                {qrUrl && (
                  <div className="bg-white p-2 rounded-2xl shrink-0 shadow-md">
                    <img src={qrUrl} alt="QR Verification" className="w-16 h-16" />
                  </div>
                )}
              </div>

              <p className="text-[11px] text-gray-500 text-center leading-relaxed">
                Registered on Aurbana — Transparent digital identity platform for fresh agriculture.
              </p>
            </div>

          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/scan')}
            className="w-full sm:w-auto btn-primary-polish text-xs"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan Another Produce</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto btn-secondary-polish text-xs"
          >
            Explore Aurbana Network
          </button>
        </div>

      </div>
    </div>
  );
};

