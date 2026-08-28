import React, { useState } from 'react';
import { 
  Mic, 
  Sparkles, 
  Languages, 
  Cpu, 
  Camera, 
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
  Leaf
} from 'lucide-react';

interface FutureUpdatesPageProps {
  navigate: (route: string) => void;
}

export const FutureUpdatesPage: React.FC<FutureUpdatesPageProps> = ({ navigate }) => {
  // Voice Simulator State
  const [selectedVoiceSample, setSelectedVoiceSample] = useState<number>(0);
  const [isSimulatingVoice, setIsSimulatingVoice] = useState(false);
  const [voiceParsedData, setVoiceParsedData] = useState<any>(null);

  // Vision Simulator State
  const [selectedImageSample, setSelectedImageSample] = useState<number>(0);
  const [isAnalyzingVision, setIsAnalyzingVision] = useState(false);
  const [visionResult, setVisionResult] = useState<any>(null);

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

  const simulateVisionAnalysis = (idx: number) => {
    setSelectedImageSample(idx);
    setIsAnalyzingVision(true);
    setVisionResult(null);

    setTimeout(() => {
      setIsAnalyzingVision(false);
      setVisionResult(visionSamples[idx].analysis);
    }, 1400);
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
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-base font-black text-[#123524]">
                  Interactive Gemini Vision Grading Sandbox
                </h4>
                <p className="text-xs text-gray-500">
                  Select a produce sample photo below to trigger real-time AI optical inspection.
                </p>
              </div>
              <span className="hidden sm:inline-block text-[11px] font-bold text-[#2E7D32] bg-[#EAF6EC] px-3 py-1 rounded-full">
                Gemini 2.5 Flash Vision Model
              </span>
            </div>

            {/* Image Selector Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {visionSamples.map((sample, idx) => (
                <div
                  key={idx}
                  onClick={() => simulateVisionAnalysis(idx)}
                  className={`rounded-2xl p-2.5 bg-white border transition-all cursor-pointer flex items-center gap-3 ${
                    selectedImageSample === idx
                      ? 'border-[#2E7D32] ring-2 ring-[#2E7D32]/20 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={sample.img}
                    alt={sample.title}
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="font-extrabold text-xs text-[#123524] block truncate">
                      {sample.title}
                    </span>
                    <span className="text-[10px] text-[#2E7D32] font-semibold">
                      {selectedImageSample === idx ? '✓ Currently Selected' : 'Click to inspect'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Analysis Output Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-5 sm:p-7 rounded-2xl border border-gray-200 shadow-sm">
              {/* Photo Display with Simulated Inspection Overlays */}
              <div className="lg:col-span-5 space-y-3">
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-gray-900 shadow-inner">
                  <img
                    src={visionSamples[selectedImageSample].img}
                    alt={visionSamples[selectedImageSample].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                  {/* Optical HUD overlay */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-white text-[10px] font-mono">
                    <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/20 flex items-center gap-1">
                      <Activity className="w-3 h-3 text-[#8BC34A]" />
                      <span>GEMINI_AI_SCANNER</span>
                    </span>
                    <span className="bg-[#2E7D32] px-2 py-0.5 rounded font-bold">
                      100% FOCUS
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white text-xs space-y-0.5">
                    <div className="font-bold text-sm text-[#8BC34A]">
                      {visionSamples[selectedImageSample].title}
                    </div>
                    <div className="text-[11px] text-gray-300 font-mono">
                      Target Area: 1080x720 • Macro Inspection
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => simulateVisionAnalysis(selectedImageSample)}
                  disabled={isAnalyzingVision}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2E7D32] hover:bg-[#123524] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isAnalyzingVision ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5 text-[#8BC34A]" />
                  )}
                  <span>{isAnalyzingVision ? 'Analyzing Optical Metrics...' : 'Trigger AI Vision Inspection'}</span>
                </button>
              </div>

              {/* Analysis Metrics */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                      Certified Agronomist Report
                    </span>
                    <h5 className="font-black text-lg text-[#123524]">
                      {visionSamples[selectedImageSample].analysis.crop}
                    </h5>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#EAF6EC] text-[#2E7D32] border border-[#2E7D32]/25">
                    {visionSamples[selectedImageSample].analysis.grade}
                  </span>
                </div>

                {isAnalyzingVision ? (
                  <div className="py-12 text-center space-y-3">
                    <div className="w-8 h-8 border-3 border-[#2E7D32] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs text-gray-500 font-medium">
                      Gemini Vision is computing chlorophyll depth, surface defect ratio, and brix estimate...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Freshness Index</span>
                        <strong className="text-sm font-black text-[#123524]">{visionSamples[selectedImageSample].analysis.freshness_score}</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Defect Percentage</span>
                        <strong className="text-sm font-black text-[#2E7D32]">{visionSamples[selectedImageSample].analysis.surface_defects.split('(')[0]}</strong>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1.5">
                      <span className="text-[10px] text-gray-500 font-bold uppercase block">Defect Analysis Details</span>
                      <p className="text-gray-700 font-medium">
                        {visionSamples[selectedImageSample].analysis.surface_defects}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#EAF6EC] border border-[#2E7D32]/20 space-y-1">
                      <span className="text-[10px] text-[#2E7D32] font-bold uppercase block">Recommended Packaging Action</span>
                      <p className="text-[#123524] font-extrabold text-xs">
                        ✓ {visionSamples[selectedImageSample].analysis.recommended_action}
                      </p>
                    </div>
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
    </div>
  );
};
