import React, { useEffect, useState } from 'react';
import { X, Printer, Download, Sparkles, Check, Leaf, ShieldCheck } from 'lucide-react';
import { ProduceRecord } from '../types';
import { generateQRCodeDataUrl } from '../utils/qrHelper';
import { getPublicProduceUrl } from '../utils/idGenerator';

interface PrintLabelModalProps {
  produce: ProduceRecord | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintLabelModal: React.FC<PrintLabelModalProps> = ({
  produce,
  isOpen,
  onClose
}) => {
  const [qrUrl, setQrUrl] = useState('');
  const [labelSize, setLabelSize] = useState<'standard' | 'crate' | 'compact'>('standard');
  const [copies, setCopies] = useState<number>(4);

  useEffect(() => {
    if (!produce || !isOpen) return;
    const url = getPublicProduceUrl(produce.produce_id);
    generateQRCodeDataUrl(url, { width: 400, margin: 4, darkColor: '#000000' }).then(setQrUrl);
  }, [produce, isOpen]);

  if (!isOpen || !produce) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#123524] text-white">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#8BC34A]" />
            <h3 className="text-lg font-extrabold tracking-tight">
              Aurbana Produce Tag & Crate Sticker Studio
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options & Preview Container */}
        <div className="p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#F8FAF8] border border-[#EAF6EC]">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-gray-700 uppercase">Label Format:</label>
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-gray-200">
                <button
                  onClick={() => setLabelSize('standard')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                    labelSize === 'standard' ? 'bg-[#2E7D32] text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Crate Tag (4" x 3")
                </button>
                <button
                  onClick={() => setLabelSize('crate')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                    labelSize === 'crate' ? 'bg-[#2E7D32] text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Pallet Label (6" x 4")
                </button>
                <button
                  onClick={() => setLabelSize('compact')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                    labelSize === 'compact' ? 'bg-[#2E7D32] text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Consumer Sticker (2" x 2")
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-700 uppercase">Print Copies:</label>
              <input
                type="number"
                min="1"
                max="50"
                value={copies}
                onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 px-2 py-1 text-center font-bold text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#2E7D32]"
              />
            </div>
          </div>

          {/* Printable Label Visualizer */}
          <div className="flex justify-center p-4 sm:p-6 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
            {/* The Actual Sticker */}
            <div 
              id="printable-crate-label"
              className="bg-white text-black p-5 rounded-xl shadow-lg border-2 border-black/80 w-full max-w-md flex flex-col justify-between"
              style={{ minHeight: '260px' }}
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b-2 border-black pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-extrabold text-sm">
                    AU
                  </div>
                  <div>
                    <div className="text-lg font-black tracking-tight leading-none">
                      AURBANA
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-gray-700">
                      Digital Produce Passport
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-black uppercase bg-black text-white px-2 py-0.5 rounded">
                    VERIFIED BATCH
                  </div>
                  <div className="text-[9px] font-mono text-gray-600 mt-0.5">
                    {produce.batch_number}
                  </div>
                </div>
              </div>

              {/* Main Content Info */}
              <div className="grid grid-cols-3 gap-3 py-3 items-center">
                <div className="col-span-2 space-y-1.5">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-gray-500">
                      Produce Item
                    </div>
                    <div className="text-2xl font-black tracking-tight leading-tight">
                      {produce.produce_name}
                      {produce.variety ? (
                        <span className="text-xs font-semibold text-gray-600 block">
                          {produce.variety}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-gray-500 block">
                        Harvest Age
                      </span>
                      <span className="font-extrabold text-sm">
                        {produce.age_days === 0 ? 'Fresh Today' : `${produce.age_days} Days`}
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase font-bold text-gray-500 block">
                        Condition
                      </span>
                      <span className="font-extrabold text-sm">
                        {produce.condition}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs pt-1">
                    <span className="text-[9px] uppercase font-bold text-gray-500 block">
                      Origin Farm
                    </span>
                    <span className="font-bold text-xs line-clamp-1">
                      {produce.origin}
                    </span>
                  </div>
                </div>

                {/* QR Code in Sticker */}
                <div className="flex flex-col items-center justify-center p-1 bg-white border border-black rounded-lg">
                  {qrUrl && (
                    <img src={qrUrl} alt="Aurbana QR" className="w-24 h-24 object-contain" />
                  )}
                  <span className="text-[8px] font-extrabold uppercase tracking-tight text-center mt-1">
                    SCAN TO VERIFY
                  </span>
                </div>
              </div>

              {/* Footer Bar on Label */}
              <div className="border-t-2 border-black pt-2 flex items-center justify-between text-[10px]">
                <div className="font-mono font-black tracking-wider text-xs">
                  {produce.produce_id}
                </div>
                <div className="text-[9px] font-semibold text-gray-600">
                  {produce.quantity || 'Standard Crate'}
                </div>
                <div className="font-bold text-[9px] uppercase">
                  aurbana.com/p
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="text-xs text-gray-500">
              * Supports standard thermal label printers (Zebra, Brother, Dymo) and standard desktop A4 printers.
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#123524] text-white text-sm font-bold shadow-md transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print {copies} {copies === 1 ? 'Sticker' : 'Stickers'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
