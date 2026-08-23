import React, { useEffect, useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  ExternalLink, 
  Copy, 
  Check, 
  PlusCircle, 
  ShieldCheck, 
  Sparkles,
  QrCode,
  Share2
} from 'lucide-react';
import { ProduceRecord } from '../types';
import { generateQRCodeDataUrl, generateQRCodeSvg, downloadDataUrl, downloadSvg } from '../utils/qrHelper';
import { getPublicProduceUrl } from '../utils/idGenerator';
import { ConditionBadge } from './ConditionBadge';

interface QRResultModalProps {
  produce: ProduceRecord;
  isOpen: boolean;
  onClose: () => void;
  onPrint: (produce: ProduceRecord) => void;
  onCreateAnother?: () => void;
  onViewPublic?: (produceId: string) => void;
  navigate?: (route: string) => void;
}

export const QRResultModal: React.FC<QRResultModalProps> = ({
  produce,
  isOpen,
  onClose,
  onPrint,
  onCreateAnother,
  onViewPublic,
  navigate
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [qrSvg, setQrSvg] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const publicUrl = getPublicProduceUrl(produce.produce_id);

  const handleViewPublic = () => {
    if (onViewPublic) {
      onViewPublic(produce.produce_id);
    } else if (navigate) {
      navigate(`/p/${produce.produce_id}`);
      onClose();
    } else {
      window.location.href = `/p/${produce.produce_id}`;
    }
  };

  const handleCreateAnother = () => {
    if (onCreateAnother) {
      onCreateAnother();
    } else if (navigate) {
      navigate('/create');
      onClose();
    } else {
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);

    Promise.all([
      generateQRCodeDataUrl(publicUrl, { width: 500, margin: 4, darkColor: '#000000' }),
      generateQRCodeSvg(publicUrl, { margin: 4, darkColor: '#000000' })
    ]).then(([pngUrl, svgStr]) => {
      if (isMounted) {
        setQrDataUrl(pngUrl);
        setQrSvg(svgStr);
        setLoading(false);
      }
    }).catch(err => {
      console.error(err);
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, publicUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPng = () => {
    if (qrDataUrl) {
      downloadDataUrl(qrDataUrl, `Aurbana-${produce.produce_id}-QR.png`);
    }
  };

  const handleDownloadSvg = () => {
    if (qrSvg) {
      downloadSvg(qrSvg, `Aurbana-${produce.produce_id}-QR.svg`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-xl w-full overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#123524] via-[#2E7D32] to-[#123524] text-white p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-[#8BC34A] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Digital Identity Created</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Your Produce Identity is Ready
          </h2>
          <p className="text-white/80 text-sm mt-1">
            Unique digital passport generated and stored in Aurbana Database.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Produce Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#F8FAF8] border border-[#EAF6EC]">
            <div>
              <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
                Produce
              </div>
              <div className="text-base font-extrabold text-[#123524] truncate">
                {produce.produce_name}
              </div>
            </div>

            <div>
              <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
                Age
              </div>
              <div className="text-base font-extrabold text-[#123524]">
                {produce.age_days === 0 ? 'Fresh Today' : `${produce.age_days} Days`}
              </div>
            </div>

            <div>
              <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
                Condition
              </div>
              <div className="mt-0.5">
                <ConditionBadge condition={produce.condition} size="sm" />
              </div>
            </div>

            <div>
              <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">
                Origin
              </div>
              <div className="text-xs font-bold text-[#123524] truncate" title={produce.origin}>
                {produce.origin.split(',')[0]}
              </div>
            </div>
          </div>

          {/* Aurbana ID Badge */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#EAF6EC] border border-[#2E7D32]/20">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D32]">
                Aurbana ID:
              </span>
              <code className="text-sm font-mono font-bold text-[#123524] bg-white px-2.5 py-1 rounded-md border border-[#2E7D32]/20">
                {produce.produce_id}
              </code>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#2E7D32] hover:text-[#123524] bg-white px-3 py-1.5 rounded-lg border border-[#2E7D32]/20 shadow-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>
          </div>

          {/* QR Code Presentation Box */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-[#2E7D32]/30 bg-white space-y-4">
            {loading ? (
              <div className="w-48 h-48 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2E7D32]"></div>
              </div>
            ) : (
              <div className="relative group bg-white p-4 rounded-xl shadow-md border border-gray-200">
                <img
                  src={qrDataUrl}
                  alt={`QR for ${produce.produce_id}`}
                  className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                />
                <div className="absolute inset-0 bg-[#123524]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <span className="bg-white text-[#123524] text-xs font-bold px-2 py-1 rounded shadow">
                    ISO Quiet Zone (Scannable)
                  </span>
                </div>
              </div>
            )}

            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-[#123524]">
                Scan with Google Lens or Camera to view produce identity
              </p>
              <p className="text-xs text-gray-500 font-mono">
                {publicUrl}
              </p>
              <p className="text-[11px] text-[#2E7D32] font-semibold pt-1">
                ✓ ISO/IEC 18004 Compliant (Quiet Zone Margin 4 • High Contrast 100%)
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              onClick={handleDownloadPng}
              id="qr-download-png-btn"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-xs"
            >
              <Download className="w-4 h-4 text-[#2E7D32]" />
              <span>Download QR</span>
            </button>

            <button
              onClick={() => onPrint(produce)}
              id="qr-print-label-btn"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-xs"
            >
              <Printer className="w-4 h-4 text-[#2E7D32]" />
              <span>Print Label</span>
            </button>

            <button
              onClick={handleViewPublic}
              id="qr-view-public-btn"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#2E7D32] text-white text-sm font-bold hover:bg-[#123524] transition-all shadow-sm"
            >
              <span>View Public Page</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Create another button */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={handleCreateAnother}
              className="flex items-center gap-2 text-xs font-bold text-[#2E7D32] hover:text-[#123524] transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Another Identity</span>
            </button>

            <button
              onClick={handleDownloadSvg}
              className="text-xs text-gray-500 hover:text-gray-800 underline"
            >
              Download as Vector SVG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
