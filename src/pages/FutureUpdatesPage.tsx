import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Sparkles, 
  Languages, 
  Cpu, 
  Camera, 
  CameraOff,
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Zap, 
  Globe2, 
  Volume2, 
  FileJson, 
  Sliders, 
  RefreshCw, 
  AlertCircle,
  Database,
  Radio,
  Terminal,
  Activity,
  Award,
  Leaf,
  Upload,
  FileDown,
  Key,
  Check,
  X,
  ExternalLink,
  Scan
} from 'lucide-react';
import { GeminiVisionService } from '../services/geminiVisionService';
import { ProduceVisionAnalysis } from '../types';

interface FutureUpdatesPageProps {
  navigate: (route: string) => void;
}

export const FutureUpdatesPage: React.FC<FutureUpdatesPageProps> = ({ navigate }) => {
  // Voice Simulator State
  const [selectedVoiceSample, setSelectedVoiceSample] = useState<number>(0);
  const [isSimulatingVoice, setIsSimulatingVoice] = useState(false);
  const [voiceParsedData, setVoiceParsedData] = useState<any>(null);

  // Vision Simulator & Live AI Inspection State
  const [selectedImageSample, setSelectedImageSample] = useState<number>(0);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [customImageTitle, setCustomImageTitle] = useState<string>('Custom Produce Sample');
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isAnalyzingVision, setIsAnalyzingVision] = useState(false);
  const [visionAnalysis, setVisionAnalysis] = useState<ProduceVisionAnalysis | null>(null);
  const [apiStatus, setApiStatus] = useState<{ configured: boolean; model: string; engine: string }>({
    configured: false,
    model: 'gemini-2.5-flash',
    engine: 'Aurbana Certified Agronomist Optical Engine',
  });
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [userApiKeyInput, setUserApiKeyInput] = useState(() => GeminiVisionService.getStoredApiKey());
  const [apiKeySaveSuccess, setApiKeySaveSuccess] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Language Simulator State
  const [currentLang, setCurrentLang] = useState<'en' | 'hi' | 'pa' | 'te' | 'es'>('en');

  // Voice Sample Prompts
  const voiceSamples = [
    {
      lang: 'English (Indian Accent)',
      flag: '🇮🇳',
      audioText: '"Harvested 20 crates of Roma Tomatoes this morning at 6 AM from North Field, condition is excellent and ready for cold storage."',
      parsed: {
        produce_name: 'Tomato',
        variety: 'Roma Vine-Ripened',
        category: 'Vegetable',
        quantity: '20 Crates (~400 kg)',
        harvest_date: 'Today, 06:00 AM',
        origin: 'North Field Block B, Green Valley',
        condition: 'Optimal (Grade A+)',
        storage_location: 'Cold Hub A (10°C)',
        confidence: '98.4%'
      }
    },
    {
      lang: 'हिन्दी (Hindi)',
      flag: '🇮🇳',
      audioText: '"आज सुबह 7 बजे उत्तर खेत से 15 पेटी लाल टमाटर तोड़े हैं। क्वालिटी बहुत बढ़िया है और कोई दाग नहीं है।"',
      parsed: {
        produce_name: 'टमाटर (Tomato)',
        variety: 'देसी हाइब्रिड (Desi Hybrid)',
        category: 'सब्जी (Vegetable)',
        quantity: '15 पेटी (15 Crates / 300 kg)',
        harvest_date: 'आज, सुबह 07:00 (Today, 07:00 AM)',
        origin: 'उत्तर खेत (North Field)',
        condition: 'उत्कृष्ट (Grade A+ • Spotless)',
        storage_location: 'कोल्ड स्टोरेज 1 (Cold Storage 1)',
        confidence: '99.1%'
      }
    },
    {
      lang: 'ਪੰਜਾਬੀ (Punjabi)',
      flag: '🇮🇳',
      audioText: '"ਅੱਜ ਸਵੇਰੇ ਛੇ ਵਜੇ ਖੇਤ ਨੰਬਰ ਚਾਰ ਵਿੱਚੋਂ ਪੰਝੀ ਕ੍ਰੇਟ ਸ਼ਿਮਲਾ ਮਿਰਚਾਂ ਤੋੜੀਆਂ ਨੇ, ਬਿਲਕੁਲ ਤਾਜ਼ੀਆਂ ਨੇ।"',
      parsed: {
        produce_name: 'ਸ਼ਿਮਲਾ ਮਿਰਚ (Capsicum / Bell Pepper)',
        variety: 'ਹਰੀ ਸ਼ਿਮਲਾ (Green Bell Pepper)',
        category: 'ਸਬਜ਼ੀ (Vegetable)',
        quantity: '25 ਕ੍ਰੇਟ (25 Crates / 500 kg)',
        harvest_date: 'ਅੱਜ, ਸਵੇਰੇ 06:00 (Today, 06:00 AM)',
        origin: 'ਖੇਤ ਨੰਬਰ ੪, ਲੁਧਿਆਣਾ (Field #4, Ludhiana)',
        condition: 'ਬਹੁਤ ਵਧੀਆ (Grade A+ • Farm Fresh)',
        storage_location: 'ਸ਼ੀਤ ਭੰਡਾਰ (Cold Room B)',
        confidence: '97.8%'
      }
    },
    {
      lang: 'తెలుగు (Telugu)',
      flag: '🇮🇳',
      audioText: '"ఈరోజు ఉదయం 6:30 కి తూర్పు పొలం నుండి 30 క్రేట్ల తాజా టమోటాలు కోసాము, నాణ్యత చాలా బాగుంది."',
      parsed: {
        produce_name: 'టమోటా (Tomato)',
        variety: 'రైతు హైబ్రిడ్ (Farmer Hybrid)',
        category: 'కూరగాయ (Vegetable)',
        quantity: '30 క్రేట్లు (30 Crates / 600 kg)',
        harvest_date: 'నేడు, ఉదయం 06:30 (Today, 06:30 AM)',
        origin: 'తూర్పు పొలం (East Farm Plot 2)',
        condition: 'ఉత్తమ గ్రేడ్ (Grade A+ • Fresh)',
        storage_location: 'శీతల గిడ్డంగి (Cold Store Alpha)',
        confidence: '98.6%'
      }
    }
  ];

  // Vision Sample Images & Analyses
  const visionSamples = [
    {
      title: 'Vine-Ripened Roma Tomatoes',
      img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      analysis: {
        crop: 'Solanum lycopersicum (Roma Tomato)',
        grade: 'Grade A+ (Premium Export Quality)',
        freshness_score: '96 / 100',
        firmness: 'Firm (4.8 / 5.0 N)',
        surface_defects: '0.8% (Minor natural calyx scar, zero pathogen damage)',
        color_uniformity: '94% Deep Lycopene Red',
        sugar_brix_estimate: '5.2° Brix',
        recommended_action: 'Approved for Premium Wholesale & Cold Packaging'
      }
    },
    {
      title: 'Fresh Garden Strawberries',
      img: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&auto=format&fit=crop&q=80',
      analysis: {
        crop: 'Fragaria × ananassa (Garden Strawberry)',
        grade: 'Grade A (Commercial Fresh)',
        freshness_score: '92 / 100',
        firmness: 'Optimal Ripeness (4.2 / 5.0)',
        surface_defects: '2.4% (Minor seed abrasion, no mold or rot)',
        color_uniformity: '91% Glossy Ruby Red',
        sugar_brix_estimate: '8.6° Brix',
        recommended_action: 'Dispatch within 48h to Retail Shelf'
      }
    },
    {
      title: 'Field Spinach & Leafy Greens',
      img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80',
      analysis: {
        crop: 'Spinacia oleracea (Savoy Spinach)',
        grade: 'Grade A+ (Hydro-Cooled Organic)',
        freshness_score: '98 / 100',
        firmness: 'Crisp Turgid Leaves',
        surface_defects: '0.3% (Clean leaves, zero chlorosis or yellowing)',
        color_uniformity: '97% Vibrant Chlorophyll Green',
        moisture_retention: '94.2%',
        recommended_action: 'Immediate Vacuum-Sealed Crate Packing'
      }
    }
  ];

  // Multilingual UI translation dictionary for demo
  const langContent = {
    en: {
      badge: 'Architecture & Innovation Blueprint',
      title: 'Next-Gen AgriTech Capabilities',
      subtitle: 'Designing rural-accessible voice intelligence, multi-lingual farmer interfaces, and multimodal AI optical inspection for Aurbana.',
      cta: 'Create Produce Identity'
    },
    hi: {
      badge: 'भविष्य की तकनीक और आर्किटेक्चर',
      title: 'किसानों के लिए आधुनिक वॉइस और एआई तकनीक',
      subtitle: 'ग्रामीण क्षेत्रों के किसानों के लिए बोलकर एंट्री, बहुभाषी समर्थन और जेमिनी विज़न द्वारा ऑटोमैटिक क्वालिटी ग्रेडिंग।',
      cta: 'नई फसल आईडी बनाएं'
    },
    pa: {
      badge: 'ਭਵਿੱਖੀ ਤਕਨਾਲੋਜੀ ਅਤੇ ਆਰਕੀਟੈਕਚਰ',
      title: 'ਕਿਸਾਨਾਂ ਲਈ ਅਵਾਜ਼ ਅਤੇ ਏ.ਆਈ. ਆਪਟੀਕਲ ਇੰਸਪੈਕਸ਼ਨ',
      subtitle: 'ਬਿਨਾਂ ਟਾਈਪ ਕੀਤੇ ਸਿਰਫ਼ ਬੋਲ ਕੇ ਫ਼ਸਲ ਦਰਜ ਕਰੋ, ਪੰਜਾਬੀ ਵਿੱਚ ਪੂਰਾ ਇੰਟਰਫੇਸ ਅਤੇ ਕੈਮਰੇ ਨਾਲ ਆਟੋ ਗ੍ਰੇਡਿੰਗ।',
      cta: 'ਨਵੀਂ ਫ਼ਸਲ ਰਜਿਸਟਰ ਕਰੋ'
    },
    te: {
      badge: 'భవిష్యత్తు సాంకేతికత & ఆర్కిటెక్చర్',
      title: 'రైతు-స్నేహపూర్వక వాయిస్ మరియు AI సాంకేతికత',
      subtitle: 'రైతులు టైప్ చేయకుండా మాట్లాడి వివరాలు నమోదు చేసే వాయిస్ సిస్టమ్, బహుభాషా మద్దతు మరియు కెమెరా నాణ్యత పరీక్ష.',
      cta: 'నూతన పంట ఐడి సృష్టించండి'
    },
    es: {
      badge: 'Arquitectura y Próximas Innovaciones',
      title: 'Inteligencia de Voz y Visión Multimodal',
      subtitle: 'Registro por voz para agricultores, soporte multilingüe completo e inspección óptica automatizada con Gemini Vision.',
      cta: 'Crear Pasaporte Digital'
    }
  };

  const simulateVoiceProcess = (idx: number) => {
    setSelectedVoiceSample(idx);
    setIsSimulatingVoice(true);
    setVoiceParsedData(null);

    setTimeout(() => {
      setIsSimulatingVoice(false);
      setVoiceParsedData(voiceSamples[idx].parsed);
    }, 1200);
  };

  // Initialize API status & default analysis on mount
  useEffect(() => {
    GeminiVisionService.checkApiStatus().then(setApiStatus);
    setVisionAnalysis(visionSamples[0].analysis as any);
  }, []);

  // Stop webcam stream safely
  const stopWebcam = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Start webcam
  const startWebcam = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('Camera API is not supported in this browser environment.');
        setIsCameraActive(false);
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.muted = true;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Webcam start error:', err);
      setCameraError(err?.message || 'Camera permission denied or camera unavailable.');
      setIsCameraActive(false);
    }
  };

  // Snap photo from webcam and analyze
  const captureWebcamSnapshot = () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCustomImage(dataUrl);
        setCustomImageTitle('Live Camera Inspection');
        stopWebcam();
        triggerVisionAnalysis(dataUrl, 'Live Camera Produce');
      }
    } catch (e) {
      console.error('Snapshot failed', e);
      setCameraError('Failed to capture snapshot from camera.');
    }
  };

  // Handle custom image file upload
  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCustomImage(result);
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setCustomImageTitle(cleanName || 'Uploaded Produce');
        stopWebcam();
        triggerVisionAnalysis(result, cleanName);
      }
    };
    reader.readAsDataURL(file);
  };

  // Trigger Gemini Vision Analysis
  const triggerVisionAnalysis = async (imgToAnalyze?: string, cropHint?: string) => {
    setIsAnalyzingVision(true);
    const targetImage = imgToAnalyze || (customImage ? customImage : visionSamples[selectedImageSample].img);
    const targetTitle = cropHint || (customImage ? customImageTitle : visionSamples[selectedImageSample].title);

    try {
      const res = await GeminiVisionService.analyzeProduce(targetImage, targetTitle);
      if (res && res.analysis) {
        setVisionAnalysis(res.analysis);
      }
    } catch (err) {
      console.error('Vision analysis error:', err);
    } finally {
      setIsAnalyzingVision(false);
    }
  };

  // Select one of the preset samples
  const selectPresetSample = (idx: number) => {
    setSelectedImageSample(idx);
    setCustomImage(null);
    stopWebcam();
    triggerVisionAnalysis(visionSamples[idx].img, visionSamples[idx].title);
  };

  // Download PDF certificate
  const handleDownloadCertificate = () => {
    if (!visionAnalysis) return;
    const currentCropName = customImage ? customImageTitle : visionSamples[selectedImageSample].title;
    GeminiVisionService.generateAgronomistCertificatePdf(
      visionAnalysis,
      currentCropName,
      `AUR-BATCH-2026-QA-${Math.floor(100 + Math.random() * 900)}`,
      'Green Valley Certified Organic Cooperative'
    );
  };

  // Save API key
  const handleSaveApiKey = () => {
    GeminiVisionService.setStoredApiKey(userApiKeyInput);
    GeminiVisionService.checkApiStatus().then(setApiStatus);
    setApiKeySaveSuccess(true);
    setTimeout(() => {
      setApiKeySaveSuccess(false);
      setShowApiKeyModal(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-[#123524] pb-24">
      
      {/* Top Banner / Hero */}
      <section className="relative overflow-hidden bg-linear-to-b from-[#123524] via-[#1a442e] to-[#123524] text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#2E7D32]/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2E7D32]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#8BC34A]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#8BC34A]/30 text-[#8BC34A] text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
            <Sparkles className="w-4 h-4 text-[#8BC34A]" />
            <span>{langContent[currentLang].badge}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            {langContent[currentLang].title}
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-gray-200 leading-relaxed font-normal">
            {langContent[currentLang].subtitle}
          </p>

          {/* Quick Language Switcher Simulator Bar */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-[#8BC34A] font-bold uppercase tracking-wider flex items-center gap-1.5 mr-2">
              <Languages className="w-4 h-4" />
              <span>Simulate Language:</span>
            </span>
            {[
              { id: 'en', label: 'English', flag: '🇬🇧' },
              { id: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
              { id: 'pa', label: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
              { id: 'te', label: 'తెలుగు', flag: '🇮🇳' },
              { id: 'es', label: 'Español', flag: '🇪🇸' }
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => setCurrentLang(lang.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  currentLang === lang.id
                    ? 'bg-[#8BC34A] text-[#123524] shadow-md shadow-[#8BC34A]/30 scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-16 relative z-20">
        
        {/* ==================================================================== */}
        {/* SECTION 1: END-TO-END TECHNICAL ARCHITECTURE BLUEPRINT               */}
        {/* ==================================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#2E7D32] uppercase tracking-wider">
                <Cpu className="w-4 h-4" />
                <span>System Architecture & Pipeline</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#123524] tracking-tight mt-1">
                How It Works Under the Hood
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#EAF6EC] text-[#2E7D32] border border-[#2E7D32]/20 self-start md:self-auto">
              Pipeline v2.0 • Edge-to-Gemini
            </span>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            Aurbana is engineered specifically for rural agricultural field realities. Farmers operate in variable sunlight, dusty environments, and low-connectivity network conditions. Our architecture employs a <strong>4-Tier Multi-Modal Processing Pipeline</strong> that blends browser-side edge acceleration with Google Gemini 2.5 generative intelligence:
          </p>

          {/* Architecture Pipeline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-[#F8FAF8] border border-gray-200 space-y-3 relative group hover:border-[#2E7D32] transition-colors">
              <div className="w-8 h-8 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                01
              </div>
              <h3 className="font-extrabold text-sm text-[#123524] flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-[#2E7D32]" />
                <span>Edge Ingestion</span>
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Browser captures raw audio via Web Audio API and high-res camera frames. Local preprocessing normalizes noise and downsamples images for fast rural bandwidth uploads.
              </p>
              <div className="pt-2 text-[10px] font-mono text-[#2E7D32] font-semibold">
                Tech: MediaDevices • Opus/WebM • Canvas2D
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-[#F8FAF8] border border-gray-200 space-y-3 relative group hover:border-[#2E7D32] transition-colors">
              <div className="w-8 h-8 rounded-xl bg-[#123524] text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                02
              </div>
              <h3 className="font-extrabold text-sm text-[#123524] flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-[#8BC34A]" />
                <span>Vernacular ASR</span>
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Spoken farmer audio (Hindi, Punjabi, Telugu, English) is streamed to Whisper or Gemini Speech. Transliteration handles colloquial crop names like <em>Tamatar, Palak, Shimla Mirch</em>.
              </p>
              <div className="pt-2 text-[10px] font-mono text-[#2E7D32] font-semibold">
                Tech: Google GenAI Audio • IndicTrans
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-[#F8FAF8] border border-gray-200 space-y-3 relative group hover:border-[#2E7D32] transition-colors">
              <div className="w-8 h-8 rounded-xl bg-[#2E7D32] text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                03
              </div>
              <h3 className="font-extrabold text-sm text-[#123524] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#8BC34A]" />
                <span>Gemini Vision</span>
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Multi-modal Gemini 2.5 Flash inspects photo. Measures skin turgor, blemish percentage, and color maturity to compute objective Quality Grade (A+, A, B) and shelf life.
              </p>
              <div className="pt-2 text-[10px] font-mono text-[#2E7D32] font-semibold">
                Tech: @google/genai • JSON Schema Mode
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-[#F8FAF8] border border-gray-200 space-y-3 relative group hover:border-[#2E7D32] transition-colors">
              <div className="w-8 h-8 rounded-xl bg-[#123524] text-white flex items-center justify-center font-mono font-bold text-xs shadow-xs">
                04
              </div>
              <h3 className="font-extrabold text-sm text-[#123524] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#8BC34A]" />
                <span>Passport Minting</span>
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Generates canonical Digital ID (e.g. <code>TOM-20260829-1223</code>), ISO/IEC 18004 QR code, and publication-ready A4 PDF traceability certificate with inspector seal.
              </p>
              <div className="pt-2 text-[10px] font-mono text-[#2E7D32] font-semibold">
                Tech: jsPDF • ISO-18004 • Express API
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SECTION 2: 🗣️ VERNACULAR VOICE INPUT FOR FARMERS                     */}
        {/* ==================================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF6EC] text-[#2E7D32] text-xs font-extrabold uppercase tracking-wider">
                <Mic className="w-3.5 h-3.5" />
                <span>Feature 1: Rural Accessibility</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#123524] tracking-tight">
                🗣️ Vernacular Voice Input ("Speak, Don't Type")
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Real smallholder farmers rarely have the time or typing proficiency to manually fill 15 input fields on a touchscreen under blazing sun. With <strong>Voice-to-Record</strong>, the farmer taps one microphone button, speaks naturally in their native language or dialect, and Gemini parses the unstructured audio into a fully validated produce registration JSON.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#EAF6EC] border border-[#2E7D32]/25 text-[#123524] text-xs space-y-2 lg:w-72">
              <div className="font-bold flex items-center gap-1.5 text-[#2E7D32]">
                <Zap className="w-4 h-4" />
                <span>Farmer Impact Metric</span>
              </div>
              <div className="text-2xl font-black text-[#123524]">
                85% Faster
              </div>
              <p className="text-[11px] text-gray-600">
                Reduces registration time from 4 minutes of manual typing to an 8-second spoken voice note.
              </p>
            </div>
          </div>

          {/* Interactive Voice Simulator */}
          <div className="p-6 rounded-2xl bg-linear-to-br from-[#123524] via-[#1a442e] to-[#123524] text-white space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2E7D32] flex items-center justify-center text-white shrink-0 shadow-inner">
                  <Volume2 className="w-5 h-5 text-[#8BC34A]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">
                    Interactive Voice-to-JSON Simulator
                  </h4>
                  <p className="text-xs text-gray-300">
                    Select a farmer's voice sample below and watch the AI extract structured data in real-time.
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-mono text-[#8BC34A] bg-white/10 px-3 py-1 rounded-full border border-white/10">
                Gemini Multi-Modal Audio API
              </span>
            </div>

            {/* Voice Sample Selector Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {voiceSamples.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => simulateVoiceProcess(idx)}
                  className={`p-3 rounded-xl text-left text-xs transition-all cursor-pointer border ${
                    selectedVoiceSample === idx
                      ? 'bg-[#8BC34A] text-[#123524] font-black border-[#8BC34A] shadow-md'
                      : 'bg-white/10 hover:bg-white/15 text-white border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between pb-1">
                    <span className="font-bold flex items-center gap-1">
                      <span>{sample.flag}</span>
                      <span>{sample.lang}</span>
                    </span>
                    {selectedVoiceSample === idx && <CheckCircle2 className="w-3.5 h-3.5 text-[#123524]" />}
                  </div>
                  <div className="text-[11px] opacity-80 truncate">
                    Tap to run simulation
                  </div>
                </button>
              ))}
            </div>

            {/* Spoken Voice Note Preview */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs text-[#8BC34A] font-bold">
                <span className="flex items-center gap-2">
                  <Mic className={`w-4 h-4 ${isSimulatingVoice ? 'animate-pulse text-rose-400' : 'text-[#8BC34A]'}`} />
                  <span>Spoken Farmer Voice Input:</span>
                </span>
                <span className="font-mono text-gray-400 text-[11px]">
                  Sample #{selectedVoiceSample + 1}
                </span>
              </div>
              <p className="text-sm font-medium italic text-white/95 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                {voiceSamples[selectedVoiceSample].audioText}
              </p>

              <button
                onClick={() => simulateVoiceProcess(selectedVoiceSample)}
                disabled={isSimulatingVoice}
                className="px-4 py-2 rounded-lg bg-[#2E7D32] hover:bg-[#8BC34A] hover:text-[#123524] text-white text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSimulatingVoice ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Zap className="w-3.5 h-3.5 text-[#8BC34A]" />
                )}
                <span>{isSimulatingVoice ? 'Extracting Entities with Gemini...' : 'Re-Run Voice Parse Extraction'}</span>
              </button>
            </div>

            {/* Structured JSON Output Result */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-300">
                <span className="font-bold flex items-center gap-1.5">
                  <FileJson className="w-4 h-4 text-[#8BC34A]" />
                  <span>AI Extracted Form State (Zero Typing Required):</span>
                </span>
                {voiceParsedData && (
                  <span className="text-[11px] font-mono text-[#8BC34A] font-bold">
                    Confidence: {voiceParsedData.confidence}
                  </span>
                )}
              </div>

              {isSimulatingVoice ? (
                <div className="p-8 text-center bg-black/30 rounded-xl border border-white/10 space-y-2">
                  <div className="w-6 h-6 border-2 border-[#8BC34A] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-gray-300">Transcribing speech and extracting produce attributes with Gemini Schema Mode...</p>
                </div>
              ) : voiceParsedData ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 rounded-xl bg-black/40 border border-white/10 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase block">Crop Identified</span>
                    <strong className="text-white font-extrabold text-sm">{voiceParsedData.produce_name}</strong>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase block">Variety & Type</span>
                    <span className="text-gray-200">{voiceParsedData.variety}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase block">Harvest Quantity</span>
                    <span className="text-[#8BC34A] font-bold">{voiceParsedData.quantity}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase block">Harvest Time</span>
                    <span className="text-gray-200">{voiceParsedData.harvest_date}</span>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase block">Farm Origin Block</span>
                    <span className="text-gray-200 font-medium">{voiceParsedData.origin}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase block">Initial Condition</span>
                    <span className="text-emerald-400 font-bold">{voiceParsedData.condition}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase block">Destination Hub</span>
                    <span className="text-gray-200">{voiceParsedData.storage_location}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center bg-black/30 rounded-xl border border-white/10 text-xs text-gray-400">
                  Tap any sample above to simulate real-time audio parsing.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SECTION 3: 🤖 AI CAMERA INSPECTION (GEMINI VISION)                   */}
        {/* ==================================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF6EC] text-[#2E7D32] text-xs font-extrabold uppercase tracking-wider">
                <Camera className="w-3.5 h-3.5" />
                <span>Feature 2: Computer Vision Quality Assurance</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#123524] tracking-tight">
                🤖 AI Camera Inspection (Gemini Vision Quality Grading)
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Because every produce batch on Aurbana now requires a mandatory photo from the live camera, we feed this image stream directly to <strong>Google Gemini 2.5 Multi-Modal Vision</strong>. The model acts as an automated, certified agronomist inspector — evaluating skin color, surface blemishes, fungal indicators, and morphological uniformity.
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

          {/* Interactive Vision Simulator */}
          <div className="border border-gray-200 rounded-3xl p-6 bg-[#F8FAF8] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-black text-[#123524] flex items-center gap-2">
                  <span>Interactive Gemini Vision Grading Sandbox</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#2E7D32]/10 text-[#2E7D32]">
                    <Sparkles className="w-3 h-3 text-[#2E7D32]" />
                    <span>Real-Time AI</span>
                  </span>
                </h4>
                <p className="text-xs text-gray-500">
                  Select a produce sample photo below, upload any custom photo, or take a live camera snapshot to trigger AI optical inspection.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowApiKeyModal(true)}
                  className="text-[11px] font-bold text-[#123524] hover:text-[#2E7D32] bg-white border border-gray-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-2xs hover:border-[#2E7D32] transition-colors cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5 text-[#2E7D32]" />
                  <span>{apiStatus.configured ? 'Gemini Key Active' : 'API Key Config'}</span>
                </button>
                <span className="text-[11px] font-bold text-[#2E7D32] bg-[#EAF6EC] px-3 py-1.5 rounded-full border border-[#2E7D32]/20">
                  Gemini 2.5 Flash Vision
                </span>
              </div>
            </div>

            {/* Hidden file input for custom produce photo */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCustomFileUpload}
            />

            {/* Image Selector Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {visionSamples.map((sample, idx) => (
                <div
                  key={idx}
                  onClick={() => selectPresetSample(idx)}
                  className={`rounded-2xl p-2.5 bg-white border transition-all cursor-pointer flex items-center gap-3 ${
                    !customImage && selectedImageSample === idx
                      ? 'border-[#2E7D32] ring-2 ring-[#2E7D32]/20 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={sample.img}
                    alt={sample.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="font-extrabold text-xs text-[#123524] block truncate">
                      {sample.title}
                    </span>
                    <span className="text-[10px] text-[#2E7D32] font-semibold">
                      {!customImage && selectedImageSample === idx ? '✓ Selected' : 'Inspect'}
                    </span>
                  </div>
                </div>
              ))}

              {/* Upload Custom Photo Card */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`rounded-2xl p-2.5 bg-white border border-dashed transition-all cursor-pointer flex items-center gap-3 ${
                  customImage && !isCameraActive
                    ? 'border-[#2E7D32] ring-2 ring-[#2E7D32]/20 shadow-md'
                    : 'border-gray-300 hover:border-[#2E7D32] hover:bg-emerald-50/30'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-[#EAF6EC] flex items-center justify-center text-[#2E7D32] shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-extrabold text-xs text-[#123524] block truncate">
                    {customImage && !isCameraActive ? customImageTitle : 'Upload Photo'}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">
                    {customImage && !isCameraActive ? '✓ Custom Loaded' : 'JPG, PNG, WebP'}
                  </span>
                </div>
              </div>

              {/* Live Webcam Snap Card */}
              <div
                onClick={() => (isCameraActive ? stopWebcam() : startWebcam())}
                className={`rounded-2xl p-2.5 bg-white border transition-all cursor-pointer flex items-center gap-3 ${
                  isCameraActive
                    ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/30 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isCameraActive ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                  {isCameraActive ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-extrabold text-xs text-[#123524] block truncate">
                    {isCameraActive ? 'Active Camera' : 'Live Camera'}
                  </span>
                  <span className="text-[10px] text-amber-700 font-semibold">
                    {isCameraActive ? 'Tap to close' : 'Webcam Snap'}
                  </span>
                </div>
              </div>
            </div>

            {/* Camera Error Alert if any */}
            {cameraError && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{cameraError}</span>
              </div>
            )}

            {/* Analysis Output Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-5 sm:p-7 rounded-2xl border border-gray-200 shadow-sm">
              {/* Photo Display with Inspection Overlays */}
              <div className="lg:col-span-5 space-y-3">
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-gray-900 shadow-inner">
                  {isCameraActive ? (
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      playsInline
                      muted
                      autoPlay
                    />
                  ) : (
                    <img
                      src={customImage || visionSamples[selectedImageSample].img}
                      alt={customImage ? customImageTitle : visionSamples[selectedImageSample].title}
                      className="w-full h-full object-cover"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/35 pointer-events-none" />

                  {/* Laser Scanning Animation Sweep Overlay */}
                  {isAnalyzingVision && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div className="absolute w-full h-1 bg-linear-to-r from-transparent via-[#8BC34A] to-transparent shadow-[0_0_15px_#8BC34A] animate-pulse top-1/2 -translate-y-1/2" />
                      <div className="absolute inset-0 bg-[#2E7D32]/10 backdrop-contrast-125" />
                      <div className="absolute inset-4 border border-[#8BC34A]/40 rounded-xl" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xs font-mono font-bold bg-black/70 px-3 py-1.5 rounded-full border border-[#8BC34A]/50 flex items-center gap-2">
                        <Scan className="w-4 h-4 text-[#8BC34A] animate-spin" />
                        <span>OPTICAL SPECTROMETRY SCANNING...</span>
                      </div>
                    </div>
                  )}

                  {/* Optical HUD overlay */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white text-[10px] font-mono">
                    <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/20 flex items-center gap-1">
                      <Activity className="w-3 h-3 text-[#8BC34A]" />
                      <span>GEMINI_AI_SCANNER</span>
                    </span>
                    <span className="bg-[#2E7D32] px-2 py-0.5 rounded font-bold">
                      {isAnalyzingVision ? 'ANALYZING...' : isCameraActive ? 'LIVE WEBCAM' : '100% FOCUS'}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white text-xs space-y-0.5">
                    <div className="font-bold text-sm text-[#8BC34A]">
                      {customImage ? customImageTitle : visionSamples[selectedImageSample].title}
                    </div>
                    <div className="text-[11px] text-gray-300 font-mono">
                      Target Area: 1080x720 • Macro Optical Inspection
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-2">
                  {isCameraActive ? (
                    <div className="flex gap-2">
                      <button
                        onClick={captureWebcamSnapshot}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#123524] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <Camera className="w-4 h-4 text-[#8BC34A]" />
                        <span>Capture & Analyze</span>
                      </button>
                      <button
                        onClick={stopWebcam}
                        className="py-2.5 px-4 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => triggerVisionAnalysis()}
                      disabled={isAnalyzingVision}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#123524] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md shadow-[#2E7D32]/20"
                    >
                      {isAnalyzingVision ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5 text-[#8BC34A]" />
                      )}
                      <span>{isAnalyzingVision ? 'Analyzing Optical Metrics with Gemini...' : 'Trigger AI Vision Inspection'}</span>
                    </button>
                  )}

                  {/* Download Agronomist Certificate Button */}
                  <button
                    onClick={handleDownloadCertificate}
                    disabled={isAnalyzingVision || !visionAnalysis}
                    className="w-full py-2 px-3 rounded-xl bg-white hover:bg-emerald-50 text-[#123524] hover:text-[#2E7D32] border border-gray-200 hover:border-[#2E7D32] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <FileDown className="w-3.5 h-3.5 text-[#2E7D32]" />
                    <span>Download Agronomist QA Certificate (PDF)</span>
                  </button>
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
                      {visionAnalysis?.is_live_gemini ? (
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
                      {visionAnalysis?.crop || (visionSamples[selectedImageSample].analysis as any).crop}
                    </h5>
                  </div>
                  <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-extrabold bg-[#EAF6EC] text-[#2E7D32] border border-[#2E7D32]/25">
                    {visionAnalysis?.grade || (visionSamples[selectedImageSample].analysis as any).grade}
                  </span>
                </div>

                {isAnalyzingVision ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-8 h-8 border-3 border-[#2E7D32] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-gray-500 font-medium">
                      Gemini Vision is computing chlorophyll depth, surface defect ratio, brix estimate, and OCR stamps...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Freshness</span>
                        <strong className="text-sm font-black text-[#123524]">
                          {visionAnalysis?.freshness_score || (visionSamples[selectedImageSample].analysis as any).freshness_score}
                        </strong>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Defect Ratio</span>
                        <strong className="text-sm font-black text-[#2E7D32]">
                          {visionAnalysis ? `${visionAnalysis.defect_percentage}%` : (visionSamples[selectedImageSample].analysis as any).surface_defects.split('(')[0]}
                        </strong>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Sugar Brix</span>
                        <strong className="text-sm font-black text-[#123524]">
                          {visionAnalysis?.sugar_brix_estimate || (visionSamples[selectedImageSample].analysis as any).sugar_brix_estimate}
                        </strong>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Shelf Life</span>
                        <strong className="text-sm font-black text-[#2E7D32]">
                          {visionAnalysis?.estimated_shelf_life_days ? `${visionAnalysis.estimated_shelf_life_days} Days` : '7 Days'}
                        </strong>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                      <span className="text-[10px] text-gray-500 font-bold uppercase block">Defect Analysis Details</span>
                      <p className="text-gray-700 font-medium">
                        {visionAnalysis?.surface_defects || (visionSamples[selectedImageSample].analysis as any).surface_defects}
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
                        {visionAnalysis?.ocr_detected_text || 'AUR-QC-PASSED • CRATE-402 • LOT #88'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#EAF6EC] border border-[#2E7D32]/20 space-y-1">
                      <span className="text-[10px] text-[#2E7D32] font-bold uppercase block">Recommended Packaging Action</span>
                      <p className="text-[#123524] font-extrabold text-xs">
                        ✓ {visionAnalysis?.recommended_action || (visionSamples[selectedImageSample].analysis as any).recommended_action}
                      </p>
                    </div>

                    {visionAnalysis?.agronomist_summary && (
                      <p className="text-[11px] text-gray-500 italic bg-white p-2.5 rounded-xl border border-gray-100">
                        Agronomist Evaluation: "{visionAnalysis.agronomist_summary}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SECTION 4: MULTI-LINGUAL REGISTRATION & SCAN LOCALIZATION            */}
        {/* ==================================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100 space-y-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF6EC] text-[#2E7D32] text-xs font-extrabold uppercase tracking-wider">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Feature 3: Vernacular Localization</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#123524] tracking-tight">
              🌐 Multilingual UI (Regional-First Localization)
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
              India and global agricultural markets span hundreds of languages. Aurbana's localization engine incorporates instant one-tap switching across <strong>English, Hindi, Punjabi, Telugu, Marathi, Spanish</strong>, and more. Both the administrative registration dashboard and the public consumer scan pages dynamically adapt their typography, terminology, and date formats.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#F8FAF8] border border-gray-200 space-y-2">
              <span className="text-2xl">🇮🇳</span>
              <h4 className="font-extrabold text-sm text-[#123524]">Vernacular Farmer UI</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Full portal translation for rural farm staff and cooperatives, rendering native Indic scripts with zero latency.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAF8] border border-gray-200 space-y-2">
              <span className="text-2xl">⚡</span>
              <h4 className="font-extrabold text-sm text-[#123524]">Offline i18n Bundles</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Pre-bundled translation dictionaries stored in browser cache so translation works even without internet connectivity.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F8FAF8] border border-gray-200 space-y-2">
              <span className="text-2xl">🥗</span>
              <h4 className="font-extrabold text-sm text-[#123524]">Consumer Passport Translation</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                When a buyer in Mumbai, London, or Texas scans the QR code, the certificate automatically loads in their preferred locale.
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* CALL TO ACTION                                                       */}
        {/* ==================================================================== */}
        <div className="p-8 sm:p-12 rounded-3xl bg-linear-to-r from-[#123524] via-[#1a442e] to-[#123524] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <div className="flex items-center justify-center md:justify-start gap-2 text-[#8BC34A] text-xs font-bold uppercase tracking-wider">
              <Leaf className="w-4 h-4" />
              <span>Experience Aurbana Today</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Ready to Register Your First Produce Batch?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Explore the live product creator with mandatory camera photo attachment, verified digital ID sequence formatting, and instant PDF certificate generation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => navigate('/create')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#8BC34A] hover:bg-[#7cb342] text-[#123524] text-xs font-black shadow-lg shadow-[#8BC34A]/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{langContent[currentLang].cta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/scan')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Scan Existing QR</span>
            </button>
          </div>
        </div>

      </div>

      {/* Gemini API Key Configuration Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#EAF6EC] text-[#2E7D32] flex items-center justify-center font-bold">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#123524]">Gemini API Key Settings</h3>
                  <p className="text-[11px] text-gray-500">Google Gemini 2.5 Multi-Modal Vision</p>
                </div>
              </div>
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1.5 text-xs text-gray-600">
              <div className="flex items-center justify-between font-bold text-[#123524]">
                <span>Current Active Engine:</span>
                <span className="text-[#2E7D32] font-extrabold">{apiStatus.engine}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-gray-500">
                You can optionally paste your free Gemini API key from Google AI Studio. If left blank, Aurbana runs its calibrated agronomist optical inspection engine.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#123524] block">
                Google Gemini API Key:
              </label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={userApiKeyInput}
                onChange={(e) => setUserApiKeyInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/20 text-xs font-mono outline-hidden"
              />
            </div>

            {apiKeySaveSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>API Key saved successfully! Live Gemini model activated.</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleSaveApiKey}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#123524] text-white text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                Save & Connect
              </button>
              <button
                onClick={() => {
                  setUserApiKeyInput('');
                  GeminiVisionService.setStoredApiKey('');
                  GeminiVisionService.checkApiStatus().then(setApiStatus);
                }}
                className="py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
