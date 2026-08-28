import React, { useState, useRef, useEffect } from 'react';
import { 
  PlusCircle, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Image as ImageIcon, 
  Check, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  Package, 
  Thermometer, 
  Layers, 
  User, 
  Building2,
  FileText,
  Upload,
  Camera,
  CameraOff,
  FlipHorizontal,
  Trash2,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProduceRecord, ProduceCondition, ProduceCategory } from '../types';
import { ProduceStorageService } from '../services/produceStorage';
import { generateProduceId } from '../utils/idGenerator';
import { getProduceImage } from '../utils/produceImageHelper';
import { PRODUCE_PRESETS } from '../data/mockProduce';
import { ConditionBadge } from '../components/ConditionBadge';

interface CreateProducePageProps {
  onSuccess: (createdProduce: ProduceRecord) => void;
  navigate: (route: string) => void;
}

export const CreateProducePage: React.FC<CreateProducePageProps> = ({ onSuccess, navigate }) => {
  // Form State
  const [produceName, setProduceName] = useState('Tomato');
  const [variety, setVariety] = useState('');
  const [category, setCategory] = useState<ProduceCategory>('Vegetable');
  const [ageDays, setAgeDays] = useState<string>('2');
  const [condition, setCondition] = useState<ProduceCondition>('Excellent');
  const [origin, setOrigin] = useState('Green Valley Farm, Punjab');
  
  // Photo & Live Camera State (Mandatory)
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Expandable additional info
  const [showAdditional, setShowAdditional] = useState(false);
  const [supplierName, setSupplierName] = useState('Green Valley Agri-Cooperative');
  const [farmerName, setFarmerName] = useState('Harpreet Singh');
  const [harvestDate, setHarvestDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 2);
    return d.toISOString().split('T')[0];
  });
  const [collectionDate, setCollectionDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  });
  const [batchNumber, setBatchNumber] = useState(`BATCH-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`);
  const [quantity, setQuantity] = useState('450 kg (18 crates)');
  const [storageLocation, setStorageLocation] = useState('Cold Zone A (12°C)');
  const [notes, setNotes] = useState('Firm texture, deep natural color, hand-picked in early morning mist.');
  
  // UI Errors & Loading
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick preset selector
  const handleSelectPreset = (preset: typeof PRODUCE_PRESETS[0]) => {
    setProduceName(preset.name);
    setCategory(preset.category);
    setImageUrl(preset.image);
    setBatchNumber(`BATCH-${new Date().getFullYear()}-${preset.name.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`);
    if (errors.produceName) {
      setErrors(prev => ({ ...prev, produceName: '' }));
    }
    if (errors.imageUrl) {
      setErrors(prev => ({ ...prev, imageUrl: '' }));
    }
  };

  // Camera Management
  const startCamera = async (facing: 'environment' | 'user' = cameraFacingMode) => {
    setCameraError(null);
    setIsCameraLoading(true);
    setIsCameraOpen(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera access is not supported by your browser.');
        setIsCameraLoading(false);
        return;
      }

      // Clean previous stream if any
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(t => t.stop());
        cameraStreamRef.current = null;
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      cameraStreamRef.current = stream;
      setCameraFacingMode(facing);
      setIsCameraLoading(false);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.muted = true;
        try {
          await videoRef.current.play();
        } catch (e) {
          console.warn('Camera video play issue:', e);
        }
      }
    } catch (err: any) {
      console.warn('Camera permission / start error:', err);
      setCameraError(err?.message || 'Unable to open camera. Please check camera permissions or upload a photo file.');
      setIsCameraLoading(false);
    }
  };

  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach(t => t.stop());
      cameraStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
    setIsCameraLoading(false);
  };

  const toggleCameraFacing = () => {
    const nextMode = cameraFacingMode === 'environment' ? 'user' : 'environment';
    startCamera(nextMode);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setImageUrl(dataUrl);
        if (errors.imageUrl) {
          setErrors(prev => ({ ...prev, imageUrl: '' }));
        }
        stopCamera();
      }
    } catch (err) {
      console.error('Error capturing snapshot:', err);
      setCameraError('Failed to capture photo from camera.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, imageUrl: 'Selected file is not an image.' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setImageUrl(event.target.result);
        if (errors.imageUrl) {
          setErrors(prev => ({ ...prev, imageUrl: '' }));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Sync stream to video element when camera mounts
  useEffect(() => {
    if (isCameraOpen && videoRef.current && cameraStreamRef.current) {
      if (videoRef.current.srcObject !== cameraStreamRef.current) {
        videoRef.current.srcObject = cameraStreamRef.current;
        videoRef.current.play().catch(console.warn);
      }
    }
  }, [isCameraOpen]);

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!produceName.trim()) {
      newErrors.produceName = 'Please enter a produce name (e.g. Tomato, Mango, Strawberry)';
    }

    const ageNum = parseInt(ageDays, 10);
    if (ageDays.trim() !== '' && (isNaN(ageNum) || ageNum < 0)) {
      newErrors.ageDays = 'Age must be 0 or a positive number';
    } else if (ageNum > 365) {
      newErrors.ageDays = 'Age exceeds realistic fresh produce shelf life';
    }

    if (!imageUrl || !imageUrl.trim()) {
      newErrors.imageUrl = 'Produce photo is mandatory. Please capture a live photo with camera, upload an image file, or provide a photo URL.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const finalName = produceName.trim() || 'Fresh Produce';
      const generatedId = generateProduceId(finalName);
      const parsedAge = Math.max(0, parseInt(ageDays, 10) || 0);
      const finalOrigin = origin.trim() || 'Green Valley Farm, Punjab';

      // Construct journey steps
      const regDateFormatted = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const harvestDateObj = new Date(harvestDate);
      const harvestFormatted = isNaN(harvestDateObj.getTime()) 
        ? `${parsedAge} Days Ago` 
        : harvestDateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

      const newRecord = await ProduceStorageService.createRecord({
        produce_id: generatedId,
        produce_name: finalName,
        variety: variety.trim() || undefined,
        category,
        age_days: parsedAge,
        condition,
        origin: finalOrigin,
        supplier_name: supplierName.trim() || undefined,
        farmer_name: farmerName.trim() || undefined,
        harvest_date: harvestDate,
        collection_date: collectionDate,
        registration_date: new Date().toISOString().split('T')[0],
        batch_number: batchNumber.trim() || `BATCH-${Date.now().toString().slice(-4)}`,
        quantity: quantity.trim() || undefined,
        storage_location: storageLocation.trim() || undefined,
        notes: notes.trim() || undefined,
        image_url: imageUrl.trim() || getProduceImage(finalName, category),
        status: 'Active',
        grade: condition === 'Excellent' ? 'Grade A+' : condition === 'Good' ? 'Grade A' : 'Standard',
        shelf_life_days: category === 'Leafy Green' ? 5 : category === 'Fruit' ? 10 : 25,
        journey: [
          {
            title: 'Harvested',
            date: `${harvestFormatted}, Morning`,
            location: finalOrigin,
            handler: farmerName || 'Verified Farm Partner',
            notes: 'Harvested at optimal maturity index.',
            status: 'completed'
          },
          {
            title: 'Collected & Inspected',
            date: `${collectionDate}, Daytime`,
            location: 'Aurbana Regional Transit Depot',
            handler: supplierName || 'Aurbana Logistics',
            notes: `Visual inspection completed. Condition graded as ${condition}.`,
            status: 'completed'
          },
          {
            title: 'Registered with Aurbana',
            date: `${regDateFormatted}, Today`,
            location: 'Aurbana Central Identity Registry',
            handler: 'Authorized Inspection Officer',
            notes: `Digital passport generated. Assigned ID ${generatedId}.`,
            status: 'completed'
          },
          {
            title: 'Available for Verification',
            date: 'Active in Real-Time',
            location: 'Public Aurbana Verification Portal',
            notes: 'Scannable by distributors, retail grocers, and consumers.',
            status: 'completed'
          }
        ]
      });

      // Confetti burst for satisfaction
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2E7D32', '#8BC34A', '#123524', '#4CAF50']
        });
      } catch {
        // ignore
      }

      setIsSubmitting(false);
      onSuccess(newRecord);
    } catch (err) {
      console.error('Error in identity generation:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF6EC] text-[#2E7D32] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Produce Digital Passport Creator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#123524] tracking-tight">
          Create Produce Identity
        </h1>
        <p className="text-base text-gray-600">
          Register a fresh produce batch and generate its unique Aurbana QR code.
        </p>
      </div>

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100 space-y-8">
        
        {/* SECTION 1: Core Produce Details */}
        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#123524] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#EAF6EC] text-[#2E7D32] text-xs flex items-center justify-center font-bold">1</span>
              <span>Essential Produce Information</span>
            </h2>
            <span className="text-xs text-gray-500">* Required fields</span>
          </div>

          {/* Quick Produce Preset Chips */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Quick Pick Common Produce:
            </label>
            <div className="flex flex-wrap gap-2">
              {PRODUCE_PRESETS.slice(0, 8).map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    produceName.toLowerCase() === preset.name.toLowerCase()
                      ? 'bg-[#2E7D32] text-white shadow-sm'
                      : 'bg-gray-50 text-gray-700 hover:bg-[#EAF6EC] hover:text-[#123524] border border-gray-200'
                  }`}
                >
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vegetable / Fruit Name */}
            <div className="space-y-1.5">
              <label htmlFor="produce_name_input" className="text-sm font-bold text-gray-800 flex items-center justify-between">
                <span>Vegetable / Fruit Name *</span>
              </label>
              <input
                id="produce_name_input"
                type="text"
                value={produceName}
                onChange={(e) => setProduceName(e.target.value)}
                placeholder="e.g. Tomato"
                className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:ring-2 focus:ring-[#2E7D32] outline-none transition-all ${
                  errors.produceName ? 'border-red-500 bg-red-50/30' : 'border-gray-300 focus:border-[#2E7D32]'
                }`}
              />
              {errors.produceName && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.produceName}</span>
                </p>
              )}
            </div>

            {/* Age / Days Since Harvest */}
            <div className="space-y-1.5">
              <label htmlFor="age_days_input" className="text-sm font-bold text-gray-800 flex items-center justify-between">
                <span>Age / Days Since Harvest *</span>
                <span className="text-xs text-gray-500">Positive number</span>
              </label>
              <div className="relative">
                <input
                  id="age_days_input"
                  type="number"
                  min="0"
                  max="180"
                  value={ageDays}
                  onChange={(e) => setAgeDays(e.target.value)}
                  placeholder="e.g. 2"
                  className={`w-full pl-4 pr-16 py-3 rounded-xl border text-sm font-medium focus:ring-2 focus:ring-[#2E7D32] outline-none transition-all ${
                    errors.ageDays ? 'border-red-500 bg-red-50/30' : 'border-gray-300 focus:border-[#2E7D32]'
                  }`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 uppercase">
                  Days
                </span>
              </div>
              {errors.ageDays && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.ageDays}</span>
                </p>
              )}
            </div>

            {/* Condition with Visual Indicator */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-gray-800 flex items-center justify-between">
                <span>Condition *</span>
                <ConditionBadge condition={condition} size="sm" />
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Excellent', 'Good', 'Average', 'Poor'] as ProduceCondition[]).map((cond) => (
                  <button
                    type="button"
                    key={cond}
                    onClick={() => setCondition(cond)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      condition === cond
                        ? 'border-[#2E7D32] bg-[#EAF6EC] text-[#123524] ring-2 ring-[#2E7D32]'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${
                      cond === 'Excellent' ? 'bg-emerald-500' :
                      cond === 'Good' ? 'bg-lime-500' :
                      cond === 'Average' ? 'bg-amber-500' : 'bg-rose-500'
                    }`} />
                    <span>{cond}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Origin / Farm */}
            <div className="space-y-1.5">
              <label htmlFor="origin_input" className="text-sm font-bold text-gray-800 flex items-center justify-between">
                <span>Origin / Farm *</span>
              </label>
              <div className="relative">
                <input
                  id="origin_input"
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="e.g. Green Valley Farm, Punjab"
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium focus:ring-2 focus:ring-[#2E7D32] outline-none transition-all ${
                    errors.origin ? 'border-red-500 bg-red-50/30' : 'border-gray-300 focus:border-[#2E7D32]'
                  }`}
                />
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              {errors.origin && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.origin}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: Mandatory Produce Photo & Live Camera */}
        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#123524] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#EAF6EC] text-[#2E7D32] text-xs flex items-center justify-center font-bold">2</span>
              <span>Produce Photo & Camera Verification</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span>* Mandatory</span>
            </span>
          </div>

          <p className="text-xs text-gray-600">
            A verified crop photo is mandatory for identity issuance and QR verification. Snap a photo with your device camera, upload a photo file, or enter an image link.
          </p>

          {/* Camera Viewfinder Panel */}
          {isCameraOpen && (
            <div className="bg-slate-950 rounded-3xl p-4 sm:p-6 border-2 border-[#2E7D32] shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between text-white pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#8BC34A] animate-pulse" />
                  <span className="text-sm font-bold">Crop Camera Viewfinder</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleCameraFacing}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <FlipHorizontal className="w-4 h-4" />
                    <span>Flip Camera</span>
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <CameraOff className="w-4 h-4" />
                    <span>Close</span>
                  </button>
                </div>
              </div>

              {/* Viewfinder Frame */}
              <div className="relative aspect-video max-h-[360px] w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/20 shadow-inner">
                {isCameraLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 text-white space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8BC34A]" />
                    <p className="text-xs font-medium text-gray-300">Connecting to camera device...</p>
                  </div>
                )}

                {cameraError ? (
                  <div className="p-6 text-center text-rose-300 space-y-3 max-w-md">
                    <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                    <p className="text-sm font-bold text-white">Camera Check Notice</p>
                    <p className="text-xs text-rose-200">{cameraError}</p>
                    <div className="flex justify-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => startCamera(cameraFacingMode)}
                        className="px-4 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#123524] text-white text-xs font-bold flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Retry Camera</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold flex items-center gap-1.5"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File Instead</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    {/* Camera grid overlay */}
                    <div className="absolute inset-0 pointer-events-none border border-white/10 grid grid-cols-3 grid-rows-3 opacity-25">
                      <div className="border-r border-b border-white/20" />
                      <div className="border-r border-b border-white/20" />
                      <div className="border-b border-white/20" />
                      <div className="border-r border-b border-white/20" />
                      <div className="border-r border-b border-white/20" />
                      <div className="border-b border-white/20" />
                      <div className="border-r border-white/20" />
                      <div className="border-r border-white/20" />
                      <div />
                    </div>

                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-white flex items-center gap-1.5 border border-white/10">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>Camera Streaming Live</span>
                    </div>
                  </>
                )}
              </div>

              {/* Snap Button inside Camera */}
              {!cameraError && (
                <div className="flex items-center justify-center gap-4 pt-2">
                  <button
                    type="button"
                    onClick={capturePhoto}
                    id="capture-produce-photo-btn"
                    className="px-8 py-3.5 rounded-2xl bg-[#2E7D32] hover:bg-[#8BC34A] hover:text-[#123524] text-white font-extrabold text-sm shadow-xl flex items-center gap-2.5 transition-all transform active:scale-95 cursor-pointer"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Snap Photo</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Photo Display Card & Selector Actions */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Preview Card (5 cols) */}
            <div className="md:col-span-5 space-y-3">
              <div className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                imageUrl 
                  ? 'border-[#2E7D32]/40 shadow-md bg-gray-50' 
                  : errors.imageUrl 
                  ? 'border-rose-400 bg-rose-50/50' 
                  : 'border-dashed border-gray-300 bg-gray-50/70'
              }`}>
                {imageUrl ? (
                  <>
                    <img 
                      src={imageUrl} 
                      alt={produceName || 'Produce photo'} 
                      className="w-full h-full object-cover"
                      onError={() => {
                        setCameraError('Failed to load image from URL. Please try capturing or uploading another photo.');
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600/95 backdrop-blur-md text-white text-[11px] font-bold shadow-md">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        <span>Photo Attached</span>
                      </span>
                    </div>

                    <div className="absolute bottom-3 inset-x-3 bg-black/70 backdrop-blur-md text-white p-2.5 rounded-xl text-xs flex items-center justify-between">
                      <span className="font-bold truncate max-w-[160px]">{produceName || 'Produce Item'}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setImageUrl('');
                          stopCamera();
                        }}
                        className="text-rose-300 hover:text-rose-100 flex items-center gap-1 font-bold transition-colors cursor-pointer"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-gray-400 space-y-2">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-700">No Photo Attached</p>
                      <p className="text-[11px] text-gray-400">Produce photo is mandatory to generate passport</p>
                    </div>
                  </div>
                )}
              </div>

              {errors.imageUrl && (
                <p className="text-xs text-rose-600 flex items-center gap-1.5 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                  <span>{errors.imageUrl}</span>
                </p>
              )}
            </div>

            {/* Right Action Options (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              <div className="bg-[#F8FAF8] rounded-2xl p-4 sm:p-5 border border-gray-200 space-y-3">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Select Photo Method:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Button 1: Open Camera */}
                  <button
                    type="button"
                    onClick={() => startCamera()}
                    id="open-camera-produce-btn"
                    className="p-3.5 rounded-xl bg-[#2E7D32] hover:bg-[#123524] text-white text-xs font-bold shadow-md shadow-[#2E7D32]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-[#8BC34A]" />
                    <span>{imageUrl ? 'Retake with Camera' : 'Take Photo (Camera)'}</span>
                  </button>

                  {/* Button 2: Upload Image File */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    id="upload-produce-file-btn"
                    className="p-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold border border-gray-300 shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-[#2E7D32]" />
                    <span>Upload Image File</span>
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Toggleable URL input option */}
                <div className="pt-2 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-xs font-bold text-[#2E7D32] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{showUrlInput ? '− Hide Image URL Input' : '+ Or enter image URL directly'}</span>
                  </button>

                  {showUrlInput && (
                    <div className="mt-2 space-y-2 animate-in fade-in duration-150">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => {
                          setImageUrl(e.target.value);
                          if (errors.imageUrl) {
                            setErrors(prev => ({ ...prev, imageUrl: '' }));
                          }
                        }}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#2E7D32] outline-none bg-white"
                      />
                      <p className="text-[11px] text-gray-500">
                        Paste any public image URL (Unsplash, Cloudinary, AWS S3, etc.)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Note */}
              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  This photo is permanently linked to the produce digital passport and appears on retail QR scans.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: Expandable Additional Information */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => setShowAdditional(!showAdditional)}
            className="w-full px-6 py-4 bg-[#F8FAF8] hover:bg-gray-100 flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-[#2E7D32]" />
              <span className="text-sm font-extrabold text-[#123524]">
                Additional Information
              </span>
              <span className="text-xs font-semibold text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                Optional
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-[#2E7D32]">
              <span>{showAdditional ? 'Collapse Details' : 'Expand Details'}</span>
              {showAdditional ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showAdditional && (
            <div className="p-6 space-y-6 bg-white animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Specific Variety / Subspecies */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Produce Variety / Type
                  </label>
                  <input
                    type="text"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    placeholder="e.g. Roma Vine-Ripened or Alphonso Hapus"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-[#2E7D32] outline-none"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Produce Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProduceCategory)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-[#2E7D32] outline-none bg-white"
                  >
                    <option value="Vegetable">Vegetable</option>
                    <option value="Fruit">Fruit</option>
                    <option value="Leafy Green">Leafy Green</option>
                    <option value="Root">Root / Tuber</option>
                    <option value="Herb">Herb</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Supplier / Farmer Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Supplier / Farmer Name
                  </label>
                  <input
                    type="text"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder="e.g. Harpreet Singh (Lead Farmer)"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-[#2E7D32] outline-none"
                  />
                </div>

                {/* Cooperative or Supplier Entity */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Supplier Organization / Co-op
                  </label>
                  <input
                    type="text"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    placeholder="e.g. Green Valley Agri-Cooperative"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-[#2E7D32] outline-none"
                  />
                </div>

                {/* Harvest Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Harvest Date
                  </label>
                  <input
                    type="date"
                    value={harvestDate}
                    onChange={(e) => setHarvestDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-[#2E7D32] outline-none"
                  />
                </div>

                {/* Collection Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Collection Date
                  </label>
                  <input
                    type="date"
                    value={collectionDate}
                    onChange={(e) => setCollectionDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-[#2E7D32] outline-none"
                  />
                </div>

                {/* Batch Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Batch Number
                  </label>
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    placeholder="e.g. BATCH-2026-TOM-114"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-mono font-medium focus:ring-2 focus:ring-[#2E7D32] outline-none"
                  />
                </div>

                {/* Quantity */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Quantity / Packaging
                  </label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 450 kg (18 crates)"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-[#2E7D32] outline-none"
                  />
                </div>

                {/* Storage Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Storage Location / Temperature
                  </label>
                  <input
                    type="text"
                    value={storageLocation}
                    onChange={(e) => setStorageLocation(e.target.value)}
                    placeholder="e.g. Cold Unit B-04 (12°C)"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-[#2E7D32] outline-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase">
                  Quality Notes & Observations
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Firm skin, high natural brix sweetness, zero synthetic residues detected."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-[#2E7D32] outline-none resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Live ID Preview Preview Strip */}
        <div className="p-4 rounded-2xl bg-[#EAF6EC]/80 border border-[#2E7D32]/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#123524]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#2E7D32]" />
            <span>
              Target Digital ID will follow format: <strong className="font-mono bg-white px-2 py-0.5 rounded border text-[#123524]">{generateProduceId(produceName || 'Tomato')}</strong>
            </span>
          </div>
          <span className="text-gray-500 font-medium">Sequence: [VEG]-[YYYYMMDD]-[HHmm] (24h)</span>
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            id="generate-aurbana-identity-btn"
            disabled={isSubmitting}
            className="w-full py-4 px-8 rounded-2xl bg-[#2E7D32] hover:bg-[#123524] text-white text-base font-extrabold shadow-lg shadow-[#2E7D32]/25 hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-[#8BC34A]" />
                <span>Generate Aurbana Identity</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
