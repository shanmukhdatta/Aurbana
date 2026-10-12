import React, { useState, useEffect, useRef } from 'react';
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
  Award,
  Camera,
  CameraOff,
  Upload,
  FileDown,
  Activity,
  Zap,
  RefreshCw,
  Scan,
  Key
} from 'lucide-react';
import { ProduceRecord, ProduceVisionAnalysis } from '../types';
import { ProduceStorageService } from '../services/produceStorage';
import { GeminiVisionService } from '../services/geminiVisionService';
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

  // Home Screen Gemini Vision State
  const [selectedHomeSample, setSelectedHomeSample] = useState<number>(0);
  const [homeCustomImage, setHomeCustomImage] = useState<string | null>(null);
  const [homeCustomTitle, setHomeCustomTitle] = useState<string>('Custom Harvest Sample');
  const [isHomeCameraActive, setIsHomeCameraActive] = useState<boolean>(false);
  const [homeCameraError, setHomeCameraError] = useState<string | null>(null);
  const [isHomeAnalyzing, setIsHomeAnalyzing] = useState(false);
  const [homeVisionAnalysis, setHomeVisionAnalysis] = useState<ProduceVisionAnalysis | null>(null);

  // Gemini API Key management
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);
  const [apiKeyInput, setApiKeyInput] = useState<string>('');
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);
  const [keySavedMessage, setKeySavedMessage] = useState<string | null>(null);

  useEffect(() => {
    GeminiVisionService.checkApiStatus().then((status) => {
      setIsLiveConnected(status.configured);
      if (status.configured) {
        setApiKeyInput(GeminiVisionService.getStoredApiKey());
      }
    });
  }, []);

  const handleSaveApiKey = () => {
    GeminiVisionService.setStoredApiKey(apiKeyInput.trim());
    setIsLiveConnected(Boolean(apiKeyInput.trim()));
    setKeySavedMessage('API Key saved! Live Gemini AI is now active.');
    setTimeout(() => {
      setKeySavedMessage(null);
      setIsKeyModalOpen(false);
    }, 1200);
  };

  const homeVideoRef = useRef<HTMLVideoElement | null>(null);
  const homeStreamRef = useRef<MediaStream | null>(null);
  const homeFileInputRef = useRef<HTMLInputElement | null>(null);

  const homeSamples = [
    {
      title: 'Vine-Ripened Roma Tomatoes',
      img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      analysis: {
        crop: 'Solanum lycopersicum (Roma Tomato)',
        produce_name: 'Tomato',
        variety: 'Roma Vine-Ripened',
        grade: 'Grade A+ (Premium Export Quality)',
        condition: 'Excellent',
        freshness_score: '96 / 100',
        freshness_percentage: 96,
        defect_percentage: 0.8,
        surface_defects: '0.8% (Minor natural calyx scar, zero pathogen damage)',
        color_uniformity: '94% Deep Lycopene Red',
        firmness: 'Firm (4.8 / 5.0 N)',
        sugar_brix_estimate: '5.2° Brix',
        estimated_shelf_life_days: 8,
        ocr_detected_text: 'AUR-QC-PASSED • CRATE-402',
        recommended_action: 'Approved for Premium Wholesale & Cold Packaging',
        agronomist_summary: 'Exceptional morphological uniformity and pericarp wall thickness. Turgor pressure optimal for cold-chain transit.',
      }
    },
    {
      title: 'Fresh Garden Strawberries',
      img: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80',
      analysis: {
        crop: 'Fragaria × ananassa (Garden Strawberry)',
        produce_name: 'Strawberry',
        variety: 'Chandler Sweet Harvest',
        grade: 'Grade A (Commercial Fresh)',
        condition: 'Excellent',
        freshness_score: '93 / 100',
        freshness_percentage: 93,
        defect_percentage: 1.8,
        surface_defects: '1.8% (Minor calyx drying, zero Botrytis mold or bruising)',
        color_uniformity: '94% Glossy Ruby Red',
        firmness: 'Optimal Ripeness (4.2 / 5.0 N)',
        sugar_brix_estimate: '8.8° Brix',
        estimated_shelf_life_days: 5,
        ocr_detected_text: 'BATCH-2026-STR-914 • GREEN VALLEY FARMS',
        recommended_action: 'Dispatch within 48h to Retail Shelf (Pre-Cooled at 2°C)',
        agronomist_summary: 'Surface pigmentation indicates peak sucrose maturity with intact achene structural integrity.',
      }
    },
    {
      title: 'Field Spinach & Leafy Greens',
      img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80',
      analysis: {
        crop: 'Spinacia oleracea (Savoy Spinach)',
        produce_name: 'Spinach',
        variety: 'Hydro-Cooled Savoy',
        grade: 'Grade A+ (Premium Export Quality)',
        condition: 'Excellent',
        freshness_score: '98 / 100',
        freshness_percentage: 98,
        defect_percentage: 0.3,
        surface_defects: '0.3% (Clean leaves, zero chlorosis or mechanical tearing)',
        color_uniformity: '97% Vibrant Chlorophyll Green',
        firmness: 'Crisp Turgid Leaves (Hydration 94.2%)',
        sugar_brix_estimate: '3.4° Brix',
        estimated_shelf_life_days: 6,
        ocr_detected_text: 'FIELD-NORTH-04 • CERTIFIED ORGANIC LOT #88',
        recommended_action: 'Immediate Vacuum-Sealed Crate Packing & Nitrogen Flush',
        agronomist_summary: 'Optical spectroscopy demonstrates high chlorophyll density and cellular turgidity.',
      }
    },
    {
      title: 'Ratnagiri Alphonso Mango',
      img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80',
      analysis: {
        crop: 'Mangifera indica (Alphonso Mango)',
        produce_name: 'Mango',
        variety: 'Ratnagiri Alphonso',
        grade: 'Grade A+ (Premium Export Quality)',
        condition: 'Excellent',
        freshness_score: '97 / 100',
        freshness_percentage: 97,
        defect_percentage: 0.5,
        surface_defects: '0.5% (Natural lenticel spotting, zero anthracnose or sap burn)',
        color_uniformity: '95% Golden Saffron Sunburst',
        firmness: 'Yields slightly to pressure (3.9 / 5.0 N)',
        sugar_brix_estimate: '16.4° Brix',
        estimated_shelf_life_days: 9,
        ocr_detected_text: 'GI-TAG-MH-RATNAGIRI-2026',
        recommended_action: 'Approved for Air-Freight Export & Controlled Atmosphere Container',
        agronomist_summary: 'Premium export maturity index reached. High carotene synthesis with intact wax cuticle barrier.',
      }
    }
  ];

  // Stop webcam
  const stopHomeWebcam = () => {
    if (homeStreamRef.current) {
      homeStreamRef.current.getTracks().forEach((track) => track.stop());
      homeStreamRef.current = null;
    }
    if (homeVideoRef.current) {
      homeVideoRef.current.srcObject = null;
    }
    setIsHomeCameraActive(false);
  };

  // Start webcam
  const startHomeWebcam = async () => {
    setHomeCameraError(null);
    setIsHomeCameraActive(true);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setHomeCameraError('Webcam not supported in this browser.');
        setIsHomeCameraActive(false);
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      homeStreamRef.current = stream;
      if (homeVideoRef.current) {
        homeVideoRef.current.srcObject = stream;
        homeVideoRef.current.setAttribute('playsinline', 'true');
        homeVideoRef.current.muted = true;
        await homeVideoRef.current.play();
      }
    } catch (err: any) {
      setHomeCameraError(err?.message || 'Unable to open camera.');
      setIsHomeCameraActive(false);
    }
  };

  // Snap photo from webcam
  const captureHomeWebcam = () => {
    const video = homeVideoRef.current;
    if (!video) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setHomeCustomImage(dataUrl);
        setHomeCustomTitle('Live Webcam Snapshot');
        stopHomeWebcam();
        runHomeVisionAnalysis(dataUrl, '');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Upload custom file
  const handleHomeCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setHomeCustomImage(result);
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setHomeCustomTitle(cleanName || 'Custom Harvest Sample');
        stopHomeWebcam();
        runHomeVisionAnalysis(result, '');
      }
    };
    reader.readAsDataURL(file);
  };

  // Run AI analysis
  const runHomeVisionAnalysis = async (imgUrl?: string, titleHint?: string) => {
    setIsHomeAnalyzing(true);
    const targetImg = imgUrl || (homeCustomImage ? homeCustomImage : homeSamples[selectedHomeSample].img);
    const targetTitle = titleHint !== undefined ? titleHint : (homeCustomImage ? '' : homeSamples[selectedHomeSample].title);

    try {
      const res = await GeminiVisionService.analyzeProduce(targetImg, targetTitle);
      if (res && res.analysis) {
        setHomeVisionAnalysis(res.analysis);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsHomeAnalyzing(false);
    }
  };

  // Create produce prefilled with AI result
  const handleCreateWithAIReport = () => {
    const activeAnalysis = homeVisionAnalysis || homeSamples[selectedHomeSample].analysis;
    const activeImg = homeCustomImage || homeSamples[selectedHomeSample].img;
    const activeTitle = homeCustomImage ? homeCustomTitle : homeSamples[selectedHomeSample].title;

    try {
      sessionStorage.setItem('aurbana_ai_prefill', JSON.stringify({
        image: activeImg,
        title: activeTitle,
        analysis: activeAnalysis,
      }));
    } catch (e) {
      console.warn(e);
    }

    navigate('/create');
  };

  // Download PDF certificate
  const handleDownloadHomeCertificate = () => {
    const activeAnalysis = homeVisionAnalysis || (homeSamples[selectedHomeSample].analysis as any);
    const crop = homeCustomImage ? homeCustomTitle : homeSamples[selectedHomeSample].title;
    GeminiVisionService.generateAgronomistCertificatePdf(
      activeAnalysis,
      crop,
      `AUR-BATCH-2026-QA-${Math.floor(100 + Math.random() * 900)}`,
      'Green Valley Agri-Cooperative'
    );
  };

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
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={() => navigate('/create')}
                  id="hero-create-btn"
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#2E7D32] text-white text-sm font-extrabold hover:bg-[#123524] transition-all shadow-lg shadow-[#2E7D32]/25 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
                >
                  <PlusCircle className="w-5 h-5 text-[#8BC34A]" />
                  <span>Create Produce Identity</span>
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('home-gemini-vision-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  id="hero-ai-vision-btn"
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#123524] via-[#1a442e] to-[#2E7D32] text-white text-sm font-extrabold hover:shadow-xl hover:-translate-y-0.5 transition-all shadow-lg shadow-emerald-950/20 border border-emerald-500/30 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#8BC34A] animate-pulse" />
                  <span>🤖 AI Vision Inspection</span>
                </button>

                <button
                  onClick={() => navigate('/scan')}
                  id="hero-scan-btn"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white text-[#123524] border-2 border-[#2E7D32]/30 text-sm font-bold hover:bg-[#EAF6EC] hover:border-[#2E7D32] transition-all shadow-xs cursor-pointer"
                >
                  <ScanLine className="w-4 h-4 text-[#2E7D32]" />
                  <span>Scan QR</span>
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

      {/* SECTION: 🤖 AI CAMERA INSPECTION (GEMINI VISION QUALITY GRADING) */}
      <section id="home-gemini-vision-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF6EC] text-[#2E7D32] text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
                <span>Instant AI Quality Assurance • Live on Home Screen</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#123524] tracking-tight">
                🤖 AI Camera Inspection (Gemini Vision Quality Grading)
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Objective quality grading powered by <strong>Google Gemini 2.5 Multi-Modal Vision</strong>. Test sample produce, upload any harvest photo, or snap with your webcam — evaluate freshness, surface defects, Brix sweetness, and extract OCR tags instantly.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#EAF6EC] border border-[#2E7D32]/25 text-[#123524] text-xs space-y-2 lg:w-72">
              <div className="font-bold flex items-center gap-1.5 text-[#2E7D32]">
                <Award className="w-4 h-4" />
                <span>Standardized Grading</span>
              </div>
              <div className="text-2xl font-black text-[#123524]">
                Objective QA
              </div>
              <p className="text-[11px] text-gray-600">
                Eliminates human bias or falsified quality grades between farms, wholesale intermediaries, and supermarkets.
              </p>
            </div>
          </div>

          {/* Interactive Vision Sandbox Card */}
          <div className="border border-gray-200 rounded-3xl p-6 bg-[#F8FAF8] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-black text-[#123524] flex items-center gap-2">
                  <span>Interactive Gemini Optical Inspection Sandbox</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#2E7D32]/10 text-[#2E7D32]">
                    Ready to Test
                  </span>
                </h4>
                <p className="text-xs text-gray-500">
                  Select a crop preset below, upload your own photo, or snap via live camera to inspect.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsKeyModalOpen(true)}
                  className={`self-start sm:self-auto text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer ${
                    isLiveConnected
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 shadow-sm'
                  }`}
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>{isLiveConnected ? '🟢 Live Gemini Connected' : '🔑 Enter Gemini API Key'}</span>
                </button>
              </div>
            </div>

            {/* Gemini API Key Configuration Modal */}
            {isKeyModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-[#2E7D32] flex items-center justify-center font-bold">
                        <Key className="w-4 h-4" />
                      </div>
                      <h3 className="font-extrabold text-gray-900 text-base">
                        Gemini Vision API Key
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsKeyModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600 text-sm font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    Enter your <strong>Google AI Studio API Key</strong> to enable live multi-modal optical analysis on any camera snapshot or uploaded produce.
                  </p>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 block">
                      Google Gemini API Key:
                    </label>
                    <input
                      type="password"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono focus:ring-2 focus:ring-[#2E7D32] outline-none"
                    />
                    <p className="text-[11px] text-gray-400">
                      Get a free key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-[#2E7D32] font-semibold underline">aistudio.google.com</a>
                    </p>
                  </div>

                  {keySavedMessage && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{keySavedMessage}</span>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsKeyModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveApiKey}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-[#2E7D32] hover:bg-[#123524] text-white shadow-md cursor-pointer"
                    >
                      Save & Activate
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Hidden file input for custom photo */}
            <input
              ref={homeFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleHomeCustomFileUpload}
            />

            {/* Image Selector Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              {homeSamples.map((sample, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedHomeSample(idx);
                    setHomeCustomImage(null);
                    stopHomeWebcam();
                    runHomeVisionAnalysis(sample.img, sample.title);
                  }}
                  className={`rounded-2xl p-2.5 bg-white border transition-all cursor-pointer flex items-center gap-2.5 ${
                    !homeCustomImage && selectedHomeSample === idx
                      ? 'border-[#2E7D32] ring-2 ring-[#2E7D32]/20 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={sample.img}
                    alt={sample.title}
                    className="w-11 h-11 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="font-extrabold text-xs text-[#123524] block truncate">
                      {sample.title}
                    </span>
                    <span className="text-[10px] text-[#2E7D32] font-semibold">
                      {!homeCustomImage && selectedHomeSample === idx ? '✓ Selected' : 'Inspect'}
                    </span>
                  </div>
                </div>
              ))}

              {/* Upload Custom Photo Card */}
              <div
                onClick={() => homeFileInputRef.current?.click()}
                className={`rounded-2xl p-2.5 bg-white border border-dashed transition-all cursor-pointer flex items-center gap-2.5 ${
                  homeCustomImage && !isHomeCameraActive
                    ? 'border-[#2E7D32] ring-2 ring-[#2E7D32]/20 shadow-md'
                    : 'border-gray-300 hover:border-[#2E7D32] hover:bg-emerald-50/30'
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-[#EAF6EC] flex items-center justify-center text-[#2E7D32] shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-extrabold text-xs text-[#123524] block truncate">
                    {homeCustomImage && !isHomeCameraActive ? homeCustomTitle : 'Upload Photo'}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">
                    {homeCustomImage && !isHomeCameraActive ? '✓ Loaded' : 'JPG / PNG'}
                  </span>
                </div>
              </div>

              {/* Live Webcam Snap Card */}
              <div
                onClick={() => (isHomeCameraActive ? stopHomeWebcam() : startHomeWebcam())}
                className={`rounded-2xl p-2.5 bg-white border transition-all cursor-pointer flex items-center gap-2.5 ${
                  isHomeCameraActive
                    ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/30 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isHomeCameraActive ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                  {isHomeCameraActive ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-extrabold text-xs text-[#123524] block truncate">
                    {isHomeCameraActive ? 'Active' : 'Live Camera'}
                  </span>
                  <span className="text-[10px] text-amber-700 font-semibold">
                    {isHomeCameraActive ? 'Close' : 'Webcam'}
                  </span>
                </div>
              </div>
            </div>

            {/* Camera Error Alert */}
            {homeCameraError && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                {homeCameraError}
              </div>
            )}

            {/* Analysis Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-5 sm:p-7 rounded-2xl border border-gray-200 shadow-sm">
              {/* Photo Display Card */}
              <div className="lg:col-span-5 space-y-3">
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-gray-900 shadow-inner">
                  {isHomeCameraActive ? (
                    <video
                      ref={homeVideoRef}
                      className="w-full h-full object-cover"
                      playsInline
                      muted
                      autoPlay
                    />
                  ) : (
                    <img
                      src={homeCustomImage || homeSamples[selectedHomeSample].img}
                      alt={homeCustomImage ? homeCustomTitle : homeSamples[selectedHomeSample].title}
                      className="w-full h-full object-cover"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/35 pointer-events-none" />

                  {/* Scanning Laser Animation Sweep */}
                  {isHomeAnalyzing && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div className="absolute w-full h-1 bg-linear-to-r from-transparent via-[#8BC34A] to-transparent shadow-[0_0_15px_#8BC34A] animate-pulse top-1/2 -translate-y-1/2" />
                      <div className="absolute inset-0 bg-[#2E7D32]/10 backdrop-contrast-125" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xs font-mono font-bold bg-black/70 px-3 py-1.5 rounded-full border border-[#8BC34A]/50 flex items-center gap-2">
                        <Scan className="w-4 h-4 text-[#8BC34A] animate-spin" />
                        <span>AI SPECTROMETRY SCANNING...</span>
                      </div>
                    </div>
                  )}

                  {/* HUD Labels */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white text-[10px] font-mono">
                    <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/20 flex items-center gap-1">
                      <Activity className="w-3 h-3 text-[#8BC34A]" />
                      <span>GEMINI_AI_SCANNER</span>
                    </span>
                    <span className="bg-[#2E7D32] px-2 py-0.5 rounded font-bold">
                      {isHomeAnalyzing ? 'ANALYZING...' : isHomeCameraActive ? 'LIVE WEBCAM' : '100% FOCUS'}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white text-xs space-y-0.5">
                    <div className="font-bold text-sm text-[#8BC34A]">
                      {homeCustomImage ? homeCustomTitle : homeSamples[selectedHomeSample].title}
                    </div>
                    <div className="text-[11px] text-gray-300 font-mono">
                      Target Area: 1080x720 • Macro Optical Inspection
                    </div>
                  </div>
                </div>

                {/* Primary Button Bar */}
                <div className="space-y-2">
                  {isHomeCameraActive ? (
                    <div className="flex gap-2">
                      <button
                        onClick={captureHomeWebcam}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#123524] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <Camera className="w-4 h-4 text-[#8BC34A]" />
                        <span>Capture & Analyze</span>
                      </button>
                      <button
                        onClick={stopHomeWebcam}
                        className="py-2.5 px-4 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => runHomeVisionAnalysis()}
                      disabled={isHomeAnalyzing}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#123524] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-[#2E7D32]/20"
                    >
                      {isHomeAnalyzing ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5 text-[#8BC34A]" />
                      )}
                      <span>{isHomeAnalyzing ? 'Analyzing Optical Metrics with Gemini...' : 'Trigger AI Vision Inspection'}</span>
                    </button>
                  )}

                  {/* HIGH VALUE CTAS: CREATE WITH AI OR DOWNLOAD CERTIFICATE */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={handleCreateWithAIReport}
                      className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#123524] to-[#2E7D32] hover:from-[#1b4832] hover:to-[#123524] text-white text-xs font-extrabold shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4 text-[#8BC34A]" />
                      <span>Create Batch With AI</span>
                    </button>

                    <button
                      onClick={handleDownloadHomeCertificate}
                      className="py-2.5 px-3 rounded-xl bg-white hover:bg-emerald-50 text-[#123524] hover:text-[#2E7D32] border border-gray-200 hover:border-[#2E7D32] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileDown className="w-4 h-4 text-[#2E7D32]" />
                      <span>Download PDF Seal</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Analysis Metrics */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                        Certified Agronomist Report
                      </span>
                      {homeVisionAnalysis?.is_live_gemini ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-[#2E7D32] bg-[#EAF6EC] px-2 py-0.5 rounded-full border border-[#2E7D32]/20">
                          <Zap className="w-2.5 h-2.5 fill-current" />
                          <span>Gemini 2.5 Live</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                          <span>Calibrated Optical Model</span>
                        </span>
                      )}
                    </div>
                    <h5 className="font-black text-lg text-[#123524]">
                      {homeVisionAnalysis?.crop || (homeSamples[selectedHomeSample].analysis as any).crop}
                    </h5>
                  </div>
                  <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-extrabold bg-[#EAF6EC] text-[#2E7D32] border border-[#2E7D32]/25">
                    {homeVisionAnalysis?.grade || (homeSamples[selectedHomeSample].analysis as any).grade}
                  </span>
                </div>

                {isHomeAnalyzing ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-8 h-8 border-3 border-[#2E7D32] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-gray-500 font-medium">
                      Gemini Vision is computing chlorophyll depth, surface defect ratio, and OCR tags...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Freshness</span>
                        <strong className="text-sm font-black text-[#123524]">
                          {homeVisionAnalysis?.freshness_score || (homeSamples[selectedHomeSample].analysis as any).freshness_score}
                        </strong>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Defect Ratio</span>
                        <strong className="text-sm font-black text-[#2E7D32]">
                          {homeVisionAnalysis ? `${homeVisionAnalysis.defect_percentage}%` : (homeSamples[selectedHomeSample].analysis as any).surface_defects.split('(')[0]}
                        </strong>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Sugar Brix</span>
                        <strong className="text-sm font-black text-[#123524]">
                          {homeVisionAnalysis?.sugar_brix_estimate || (homeSamples[selectedHomeSample].analysis as any).sugar_brix_estimate}
                        </strong>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Shelf Life</span>
                        <strong className="text-sm font-black text-[#2E7D32]">
                          {homeVisionAnalysis?.estimated_shelf_life_days ? `${homeVisionAnalysis.estimated_shelf_life_days} Days` : '8 Days'}
                        </strong>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                      <span className="text-[10px] text-gray-500 font-bold uppercase block">Defect Analysis Details</span>
                      <p className="text-gray-700 font-medium">
                        {homeVisionAnalysis?.surface_defects || (homeSamples[selectedHomeSample].analysis as any).surface_defects}
                      </p>
                    </div>

                    {/* OCR Character Recognition & Tag Output */}
                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 font-bold uppercase block">
                          OCR Optical Text & Label Detection
                        </span>
                        <span className="text-[9px] font-mono text-[#2E7D32] bg-[#EAF6EC] px-1.5 py-0.5 rounded">
                          OCR Extractor
                        </span>
                      </div>
                      <p className="text-gray-800 font-mono text-[11px] bg-white p-2 rounded-lg border border-gray-200">
                        {homeVisionAnalysis?.ocr_detected_text || (homeSamples[selectedHomeSample].analysis as any).ocr_detected_text || 'AUR-QC-PASSED • CRATE-402'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#EAF6EC] border border-[#2E7D32]/20 space-y-1">
                      <span className="text-[10px] text-[#2E7D32] font-bold uppercase block">Recommended Packaging Action</span>
                      <p className="text-[#123524] font-extrabold text-xs">
                        ✓ {homeVisionAnalysis?.recommended_action || (homeSamples[selectedHomeSample].analysis as any).recommended_action}
                      </p>
                    </div>
                  </div>
                )}
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
