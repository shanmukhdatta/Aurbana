import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  QrCode, 
  FileCheck, 
  Building2, 
  MapPin, 
  Calendar, 
  Thermometer, 
  Download,
  Sparkles
} from 'lucide-react';
import { ProduceRecord } from '../types';
import { getPublicProduceUrl } from '../utils/idGenerator';

interface ExportCertificateModalProps {
  record: ProduceRecord;
  qrUrl: string;
  onClose: () => void;
}

export const ExportCertificateModal: React.FC<ExportCertificateModalProps> = ({
  record,
  qrUrl,
  onClose,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const passportUrl = getPublicProduceUrl(record.produce_id);
  const issueDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 my-8">
        
        {/* Modal Action Header (Screen only) */}
        <div className="no-print p-4 sm:p-6 bg-[#123524] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2E7D32] flex items-center justify-center text-white">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                Traceability Certificate
              </h3>
              <p className="text-xs text-gray-300">
                Official export & wholesale quality compliance document
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              id="print-certificate-btn"
              className="px-4 py-2 rounded-xl bg-[#8BC34A] hover:bg-[#7cb342] text-[#123524] text-xs font-black transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF Certificate</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE CERTIFICATE CONTAINER */}
        <div ref={certificateRef} className="p-6 sm:p-12 bg-white space-y-8 font-sans text-gray-800 print:p-8">
          
          {/* Certificate Border Framing */}
          <div className="border-4 border-[#123524] p-6 sm:p-10 rounded-2xl relative bg-linear-to-b from-[#F8FAF8] via-white to-[#F8FAF8]">
            
            {/* Watermark Logo Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-3 pointer-events-none">
              <ShieldCheck className="w-96 h-96 text-[#123524]" />
            </div>

            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b-2 border-[#123524]/20 pb-8">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-16 h-16 rounded-2xl bg-[#123524] flex items-center justify-center text-[#8BC34A] shadow-md">
                  <ShieldCheck className="w-9 h-9" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#123524] tracking-tight uppercase">
                    AURBANA
                  </div>
                  <div className="text-xs font-extrabold uppercase tracking-widest text-[#2E7D32]">
                    Agri-Supply Chain Digital Identity Registry
                  </div>
                  <div className="text-[10px] text-gray-500 font-medium mt-0.5">
                    ISO/IEC 18004 Verified Traceability Compliance
                  </div>
                </div>
              </div>

              <div className="text-center sm:text-right space-y-1 bg-white p-4 rounded-xl border border-gray-200 shadow-xs">
                <div className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                  CERTIFICATE NUMBER
                </div>
                <div className="text-base font-mono font-black text-[#123524]">
                  CERT-{record.produce_id}
                </div>
                <div className="text-[11px] font-semibold text-gray-500">
                  Issued: {issueDate}
                </div>
              </div>
            </div>

            {/* Certificate Title */}
            <div className="text-center py-6 space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF6EC] text-[#2E7D32] text-xs font-extrabold uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>OFFICIAL CERTIFICATE OF ORIGIN & QUALITY</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#123524]">
                Verified Digital Produce Passport
              </h1>
              <p className="text-xs text-gray-600 max-w-lg mx-auto">
                This document certifies that the produce batch listed below has undergone digital registration, optical grading, and supply chain provenance verification.
              </p>
            </div>

            {/* Produce Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
              
              {/* Left Column: Produce Specs */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  {record.image_url && (
                    <img 
                      src={record.image_url} 
                      alt={record.produce_name}
                      className="w-20 h-20 rounded-2xl object-cover border border-gray-200 shadow-xs"
                    />
                  )}
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      PRODUCE ITEM
                    </span>
                    <h2 className="text-xl font-black text-[#123524]">
                      {record.produce_name}
                    </h2>
                    <span className="text-xs font-semibold text-[#2E7D32]">
                      {record.variety || record.category} ({record.category})
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Aurbana Passport ID</span>
                    <strong className="font-mono font-bold text-[#123524]">{record.produce_id}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Batch Number</span>
                    <strong className="font-mono text-gray-800">{record.batch_number || 'N/A'}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Condition Grade</span>
                    <strong className="text-[#2E7D32]">{record.grade || record.condition}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="text-[10px] font-bold text-gray-400 uppercase block">Harvest Age</span>
                    <strong className="text-gray-800">{record.age_days} Days ({record.harvest_date})</strong>
                  </div>
                </div>
              </div>

              {/* Right Column: Origin & Logistics */}
              <div className="space-y-3 text-xs border-t md:border-t-0 md:border-l border-gray-100 md:pl-6 pt-4 md:pt-0">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    FARM ORIGIN & GROWER
                  </span>
                  <div className="font-bold text-[#123524] text-sm flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#2E7D32]" />
                    <span>{record.origin}</span>
                  </div>
                  <p className="text-gray-600">Lead Farmer: <strong>{record.farmer_name || 'Verified Cooperative Partner'}</strong></p>
                </div>

                <div className="space-y-1 pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    STORAGE & LOGISTICS
                  </span>
                  <p className="text-gray-700">Storage Facility: <strong>{record.storage_location || 'Cold Transit Depot'}</strong></p>
                  <p className="text-gray-700">Storage Temperature: <strong>{record.temp_celsius ? `${record.temp_celsius}°C` : '4°C Controlled'}</strong></p>
                  <p className="text-gray-700">Quantity / Weight: <strong>{record.quantity || 'Standard Commercial Crate'}</strong></p>
                </div>
              </div>

            </div>

            {/* Verified Provenance Timeline */}
            <div className="space-y-3">
              <div className="text-xs font-extrabold uppercase text-[#123524] tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#2E7D32]" />
                <span>Verified Supply Chain Provenance Trail</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                {record.journey && record.journey.length > 0 ? (
                  record.journey.map((step, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white border border-gray-200 space-y-1">
                      <div className="flex items-center gap-1 text-[#2E7D32] font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{step.title}</span>
                      </div>
                      <div className="text-[10px] text-gray-500">{step.date}</div>
                      <div className="text-[10px] text-gray-700 truncate">{step.location}</div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 p-3 rounded-xl bg-[#EAF6EC] text-[#2E7D32] font-semibold text-center text-xs">
                    Harvested, Cold-Chilled, Registered, and Verified Active on Aurbana Network.
                  </div>
                )}
              </div>
            </div>

            {/* QR Code & Signatures Footer */}
            <div className="pt-6 border-t-2 border-[#123524]/20 flex flex-col sm:flex-row items-center justify-between gap-6">
              
              {/* QR Verification Module */}
              <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-gray-200">
                {qrUrl ? (
                  <img src={qrUrl} alt="Certificate QR" className="w-20 h-20 border rounded-xl" />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="text-left space-y-1">
                  <span className="text-[10px] font-bold uppercase text-[#2E7D32]">
                    SCAN TO VERIFY ONLINE
                  </span>
                  <div className="font-mono text-[10px] text-gray-500 break-all max-w-[200px]">
                    {passportUrl}
                  </div>
                  <span className="text-[9px] text-gray-400 block">
                    ISO/IEC 18004 Standard Compliant
                  </span>
                </div>
              </div>

              {/* Official Seal & Signature */}
              <div className="flex items-center gap-8 text-center sm:text-right">
                <div className="space-y-1">
                  <div className="w-28 h-12 border-b-2 border-gray-400 mx-auto sm:ml-auto flex items-end justify-center pb-1">
                    <span className="font-serif italic text-sm text-[#123524] font-bold">Kavita Sharma</span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">
                    Chief Quality Inspector
                  </span>
                  <span className="text-[9px] text-gray-400 block">
                    Aurbana Registry Operations
                  </span>
                </div>

                <div className="w-20 h-20 rounded-full border-4 border-double border-[#2E7D32] flex flex-col items-center justify-center text-[#2E7D32] p-1 rotate-[-12deg] shadow-xs">
                  <ShieldCheck className="w-6 h-6" />
                  <span className="text-[8px] font-black uppercase text-center leading-tight">
                    OFFICIALLY VERIFIED
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
