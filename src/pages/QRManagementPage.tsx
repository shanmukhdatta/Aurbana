import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  Download, 
  Sparkles, 
  QrCode, 
  Check, 
  Layers, 
  FileText, 
  RefreshCw,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { ProduceRecord } from '../types';
import { ProduceStorageService } from '../services/produceStorage';
import { generateQRCodeDataUrl, downloadDataUrl } from '../utils/qrHelper';
import { getPublicProduceUrl } from '../utils/idGenerator';

interface QRManagementPageProps {
  navigate: (route: string) => void;
  onPrint: (produce: ProduceRecord) => void;
  onOpenQR: (produce: ProduceRecord) => void;
}

export const QRManagementPage: React.FC<QRManagementPageProps> = ({
  navigate,
  onPrint,
  onOpenQR
}) => {
  const [records, setRecords] = useState<ProduceRecord[]>([]);
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>([]);
  const [qrCache, setQrCache] = useState<Record<string, string>>({});
  const [sheetLayout, setSheetLayout] = useState<'4-up' | '8-up' | '12-up'>('8-up');

  useEffect(() => {
    let isMounted = true;

    const update = async () => {
      const all = ProduceStorageService.getRecords();
      setRecords(all);
      if (selectedBatchIds.length === 0 && all.length > 0) {
        setSelectedBatchIds(all.slice(0, 4).map(r => r.produce_id));
      }

      // Pre-generate QR data URLs for batches atomically
      try {
        const qrPromises = all.map(async (r) => {
          const url = getPublicProduceUrl(r.produce_id);
          const dataUrl = await generateQRCodeDataUrl(url, { width: 300, margin: 4 });
          return [r.produce_id, dataUrl] as const;
        });

        const results = await Promise.all(qrPromises);
        if (isMounted) {
          const newCache: Record<string, string> = {};
          results.forEach(([id, dataUrl]) => {
            newCache[id] = dataUrl;
          });
          setQrCache(newCache);
        }
      } catch (err) {
        console.error('Error pre-generating QR codes', err);
      }
    };

    update();
    const unsubscribe = ProduceStorageService.subscribe(() => {
      update();
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedBatchIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedBatchIds(records.map(r => r.produce_id));
  };

  const deselectAll = () => {
    setSelectedBatchIds([]);
  };

  const handlePrintSheet = () => {
    window.print();
  };

  const selectedRecords = records.filter(r => selectedBatchIds.includes(r.produce_id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF6EC] text-[#2E7D32] text-xs font-bold uppercase tracking-wider mb-2">
            <Printer className="w-3.5 h-3.5" />
            <span>Label & Thermal Tag Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#123524] tracking-tight">
            QR Code & Crate Tag Management
          </h1>
          <p className="text-sm text-gray-600">
            Batch-generate, download vector assets, and print multi-up crate sticker sheets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrintSheet}
            disabled={selectedRecords.length === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2E7D32] hover:bg-[#123524] text-white text-sm font-extrabold shadow-md transition-all disabled:opacity-40"
          >
            <Printer className="w-4 h-4" />
            <span>Print Batch Sticker Sheet ({selectedRecords.length})</span>
          </button>
        </div>
      </div>

      {/* Grid of Batch Selectors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Batch Selection List */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-[#123524] uppercase tracking-wider">
              Select Batches to Print ({selectedRecords.length}/{records.length})
            </h3>
            <div className="flex items-center gap-2 text-xs font-bold text-[#2E7D32]">
              <button onClick={selectAll} className="hover:underline">All</button>
              <span>•</span>
              <button onClick={deselectAll} className="hover:underline text-gray-500">None</button>
            </div>
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {records.map(rec => {
              const isSelected = selectedBatchIds.includes(rec.produce_id);
              return (
                <div
                  key={rec.id}
                  onClick={() => toggleSelect(rec.produce_id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected 
                      ? 'bg-[#EAF6EC] border-[#2E7D32] ring-1 ring-[#2E7D32]' 
                      : 'bg-[#F8FAF8] border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#2E7D32] border-[#2E7D32] text-white' : 'border-gray-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-[#123524] truncate">
                        {rec.produce_name}
                      </div>
                      <div className="text-[10px] font-mono text-gray-600 truncate">
                        {rec.produce_id}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-[#2E7D32] block">
                      {rec.age_days === 0 ? 'Fresh Today' : `${rec.age_days}d ago`}
                    </span>
                    <span className="text-[9px] text-gray-400">
                      {rec.condition}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Multi-Up Sheet Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-700 uppercase">Sheet Layout:</span>
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                {(['4-up', '8-up', '12-up'] as const).map(l => (
                  <button
                    key={l}
                    onClick={() => setSheetLayout(l)}
                    className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                      sheetLayout === l ? 'bg-[#2E7D32] text-white' : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xs text-gray-500 font-medium hidden sm:inline">
              Standard 8.5" x 11" or A4 Adhesive Sheet
            </span>
          </div>

          {/* Printable Sheet Viewport */}
          <div className="bg-gray-200 p-6 rounded-3xl border border-gray-300 overflow-hidden">
            <div className={`grid gap-4 bg-white p-6 rounded-2xl shadow-md min-h-[500px] ${
              sheetLayout === '4-up' ? 'grid-cols-2' : sheetLayout === '8-up' ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3 sm:grid-cols-4'
            }`}>
              {selectedRecords.map(rec => (
                <div
                  key={rec.id}
                  className="border-2 border-black/80 rounded-xl p-3 flex flex-col justify-between text-black bg-white space-y-2"
                >
                  <div className="flex items-center justify-between border-b border-black pb-1">
                    <span className="text-[9px] font-black uppercase">AURBANA</span>
                    <span className="text-[8px] font-mono font-bold bg-black text-white px-1 rounded">
                      VERIFIED
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-sm font-black leading-tight truncate">
                      {rec.produce_name}
                    </div>
                    <div className="text-[9px] text-gray-700 truncate">
                      {rec.origin.split(',')[0]}
                    </div>
                  </div>

                  <div className="flex justify-center p-1 bg-white">
                    {qrCache[rec.produce_id] ? (
                      <img src={qrCache[rec.produce_id]} alt="QR" className="w-16 h-16 object-contain" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 animate-pulse rounded" />
                    )}
                  </div>

                  <div className="border-t border-black pt-1 text-center font-mono font-black text-[9px] truncate">
                    {rec.produce_id}
                  </div>
                </div>
              ))}

              {selectedRecords.length === 0 && (
                <div className="col-span-full flex items-center justify-center py-20 text-gray-400 text-sm font-bold">
                  Select at least one produce batch on the left to preview sticker sheet.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
