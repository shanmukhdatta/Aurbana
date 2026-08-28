import React, { useState, useEffect, useRef } from 'react';
import { 
  ScanLine, 
  Camera, 
  CameraOff, 
  Search, 
  Sparkles, 
  ArrowRight, 
  QrCode, 
  AlertCircle, 
  CheckCircle2, 
  FlipHorizontal,
  RefreshCw
} from 'lucide-react';
import jsQR from 'jsqr';
import { ProduceStorageService } from '../services/produceStorage';
import { ProduceRecord } from '../types';

interface ScanPageProps {
  navigate: (route: string) => void;
}

export const ScanPage: React.FC<ScanPageProps> = ({ navigate }) => {
  const [manualId, setManualId] = useState('');
  const [manualError, setManualError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [recentRecords, setRecentRecords] = useState<ProduceRecord[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const scanLockRef = useRef(false);

  useEffect(() => {
    setRecentRecords(ProduceStorageService.getRecords().slice(0, 6));
  }, []);

  // Camera handling with robust webcam constraint fallback
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { 
              facingMode: { ideal: facingMode }, 
              width: { ideal: 1280 }, 
              height: { ideal: 720 }
            }
          });
        } catch (constraintErr) {
          console.warn('Constrained camera request failed, falling back to basic video stream', constraintErr);
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
        }

        streamRef.current = stream;
        setCameraActive(true);
        scanLockRef.current = false;

        // Attach stream to video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.muted = true;
          try {
            await videoRef.current.play();
          } catch (e) {
            console.warn('Video play error', e);
          }
        }

        // Begin frame scan loop
        scanFrame();
      } else {
        setCameraError('Camera access is not supported by your browser environment.');
      }
    } catch (err: any) {
      console.warn('Camera stream error', err);
      setCameraError(err?.message || 'Unable to access camera. Please check camera permissions or use manual search / upload image below.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    setCameraActive(false);
  };

  // Ensure stream is bound to video element whenever cameraActive or videoRef updates
  useEffect(() => {
    if (cameraActive && videoRef.current && streamRef.current) {
      if (videoRef.current.srcObject !== streamRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play().catch(console.warn);
      }
    }
  }, [cameraActive]);

  const lastScanTimeRef = useRef<number>(0);

  const scanFrame = async () => {
    if (scanLockRef.current) return;

    const now = Date.now();
    // Scan frame processing
    if (now - lastScanTimeRef.current >= 100) {
      lastScanTimeRef.current = now;

      if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
        const video = videoRef.current;

        // Strategy 1: Try Native Hardware-Accelerated BarcodeDetector if available
        if ('BarcodeDetector' in window) {
          try {
            const barcodeDetector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
            const barcodes = await barcodeDetector.detect(video);
            if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
              scanLockRef.current = true;
              handleScannedResult(barcodes[0].rawValue);
              return;
            }
          } catch (e) {
            // Fallback to jsQR canvas
          }
        }

        // Strategy 2: Crisp jsQR decoding
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (ctx) {
            const vWidth = video.videoWidth || 640;
            const vHeight = video.videoHeight || 480;

            if (canvas.width !== vWidth || canvas.height !== vHeight) {
              canvas.width = vWidth;
              canvas.height = vHeight;
            }

            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(video, 0, 0, vWidth, vHeight);
            const imageData = ctx.getImageData(0, 0, vWidth, vHeight);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: 'attemptBoth',
            });

            if (code?.data) {
              scanLockRef.current = true;
              handleScannedResult(code.data);
              return;
            }
          }
        }
      }
    }

    if (!scanLockRef.current) {
      animationFrameId.current = requestAnimationFrame(scanFrame);
    }
  };

  // Image file QR decoding fallback (Upload image / photo)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        // Try BarcodeDetector on image
        if ('BarcodeDetector' in window) {
          try {
            const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
            const barcodes = await detector.detect(img);
            if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
              handleScannedResult(barcodes[0].rawValue);
              return;
            }
          } catch (err) {
            // Fallback to jsQR canvas
          }
        }

        // Fallback jsQR canvas decode
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        const ctx = tempCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth',
          });
          if (code?.data) {
            handleScannedResult(code.data);
          } else {
            setManualError('No readable QR code found in the uploaded image. Please try a clearer image or enter the ID manually.');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    // Attempt starting camera when mounted
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const handleScannedResult = (scannedText: string) => {
    stopCamera();

    const extractedId = ProduceStorageService.normalizeId(scannedText);

    if (extractedId) {
      navigate(`/p/${extractedId}`);
    } else {
      setManualError(`Could not detect a valid Aurbana ID from QR code: ${scannedText.slice(0, 40)}`);
      scanLockRef.current = false;
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualError('');
    const raw = manualId.trim();
    if (!raw) {
      setManualError('Please enter a valid Aurbana ID or product name (e.g. TOM-20260829-1223 or Tomato)');
      return;
    }

    const cleanId = ProduceStorageService.normalizeId(raw);
    if (cleanId) {
      const found = await ProduceStorageService.fetchRecordByProduceId(cleanId);
      if (found) {
        navigate(`/p/${found.produce_id}`);
        return;
      }
    }

    // Fuzzy database search
    const results = await ProduceStorageService.searchRecords(raw);
    if (results.length > 0) {
      navigate(`/p/${results[0].produce_id}`);
      return;
    }

    if (cleanId && (cleanId.startsWith('AUR-') || /^[A-Z]{3,4}-\d{8}-\d{4}/i.test(cleanId))) {
      navigate(`/p/${cleanId}`);
      return;
    }

    setManualError(`No matching produce found for "${raw}". Try searching by Aurbana ID, produce name, or farm.`);
  };

  const toggleCamera = () => {
    stopCamera();
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF6EC] text-[#2E7D32] text-xs font-bold uppercase tracking-wider">
          <ScanLine className="w-3.5 h-3.5" />
          <span>Real-Time QR Scanner</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#123524] tracking-tight">
          Scan Fresh Produce
        </h1>
        <p className="text-base text-gray-600">
          Scan an Aurbana QR code to discover its digital identity.
        </p>
      </div>

      {/* Main Scanner Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 space-y-8">
        
        {/* Camera Viewfinder */}
        <div className="relative max-w-md mx-auto aspect-square rounded-3xl overflow-hidden bg-black flex items-center justify-center border-4 border-[#123524] shadow-2xl">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={cameraActive ? "w-full h-full object-cover" : "hidden"}
          />
          <canvas ref={canvasRef} className="hidden" />

          {cameraActive ? (
            <>
              {/* Scanning Target Overlay */}
              <div className="absolute inset-0 border-2 border-white/20 pointer-events-none flex items-center justify-center p-8">
                <div className="w-48 h-48 sm:w-60 sm:h-60 border-2 border-[#8BC34A] rounded-2xl relative animate-pulse">
                  {/* Corner marks */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-[#8BC34A] rounded-tl-lg" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-[#8BC34A] rounded-tr-lg" />
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-[#8BC34A] rounded-bl-lg" />
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-[#8BC34A] rounded-br-lg" />

                  {/* Horizontal animated scanning laser */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#8BC34A] to-transparent shadow-[0_0_8px_#8BC34A] absolute top-1/2 -translate-y-1/2 animate-bounce" />
                </div>
              </div>

              {/* Camera Controls Overlay */}
              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between pointer-events-auto">
                <button
                  onClick={toggleCamera}
                  className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 hover:bg-black/80 transition-colors"
                >
                  <FlipHorizontal className="w-4 h-4" />
                  <span>Flip Camera</span>
                </button>

                <button
                  onClick={stopCamera}
                  className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 hover:bg-black/80 transition-colors"
                >
                  <CameraOff className="w-4 h-4" />
                  <span>Pause</span>
                </button>
              </div>
            </>
          ) : (
            <div className="text-center p-6 space-y-4 text-white">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto text-[#8BC34A]">
                <Camera className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-base">Camera Viewfinder Paused</p>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  {cameraError || 'Allow camera permission or click below to resume scanner'}
                </p>
              </div>
              <button
                onClick={startCamera}
                className="px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#8BC34A] hover:text-[#123524] text-white text-xs font-extrabold transition-all shadow-md inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Start Camera Scanner</span>
              </button>
            </div>
          )}
        </div>

        {/* Upload Image / Photo File Fallback */}
        <div className="max-w-md mx-auto flex items-center justify-center">
          <label className="w-full py-2.5 px-4 rounded-xl border border-dashed border-[#2E7D32]/40 bg-[#EAF6EC]/50 hover:bg-[#EAF6EC] text-[#2E7D32] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors">
            <QrCode className="w-4 h-4" />
            <span>Upload or Select QR Code Image File</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* OR Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-4 text-xs font-extrabold uppercase text-gray-400 tracking-wider absolute">
            or enter manually
          </span>
        </div>

        {/* Manual ID Input (Requirement #11) */}
        <form onSubmit={handleManualSubmit} className="space-y-3 max-w-md mx-auto">
          <label htmlFor="manual_produce_id" className="text-xs font-bold text-gray-700 uppercase tracking-wider block text-center">
            Enter Aurbana ID manually
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                id="manual_produce_id"
                type="text"
                value={manualId}
                onChange={(e) => {
                  setManualId(e.target.value);
                  setManualError('');
                }}
                placeholder="e.g. TOM-20260829-1223"
                className="w-full pl-4 pr-4 py-3 rounded-xl border border-gray-300 font-mono text-sm font-bold uppercase focus:ring-2 focus:ring-[#2E7D32] outline-none"
              />
            </div>
            <button
              type="submit"
              id="view-produce-manual-btn"
              className="px-6 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#123524] text-white text-sm font-extrabold shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Produce</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {manualError && (
            <p className="text-xs text-red-600 flex items-center justify-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{manualError}</span>
            </p>
          )}
        </form>

        {/* Quick Test Demo Batches */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-gray-500 tracking-wider">
              Quick Test Sample Batches:
            </span>
            <span className="text-xs text-[#2E7D32] font-semibold">
              Click to simulate instant scan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {recentRecords.slice(0, 3).map((rec) => (
              <button
                key={rec.id}
                onClick={() => navigate(`/p/${rec.produce_id}`)}
                className="p-3 rounded-2xl bg-[#F8FAF8] hover:bg-[#EAF6EC] border border-gray-100 hover:border-[#2E7D32]/30 text-left transition-all flex items-center gap-3 group"
              >
                <img
                  src={rec.image_url || ''}
                  alt={rec.produce_name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-extrabold text-[#123524] truncate group-hover:text-[#2E7D32]">
                    {rec.produce_name}
                  </div>
                  <div className="text-[10px] font-mono text-gray-500 truncate">
                    {rec.produce_id}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
