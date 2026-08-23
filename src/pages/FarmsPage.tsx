import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Leaf, 
  Award, 
  Search, 
  CheckCircle2, 
  ArrowUpRight, 
  Layers, 
  Sparkles,
  Phone,
  UserCheck
} from 'lucide-react';
import { FarmPartner, ProduceRecord } from '../types';
import { ProduceStorageService } from '../services/produceStorage';

interface FarmsPageProps {
  navigate: (route: string) => void;
}

export const FarmsPage: React.FC<FarmsPageProps> = ({ navigate }) => {
  const [farms, setFarms] = useState<FarmPartner[]>([]);
  const [search, setSearch] = useState('');
  const [records, setRecords] = useState<ProduceRecord[]>([]);

  useEffect(() => {
    setFarms(ProduceStorageService.getFarms());
    setRecords(ProduceStorageService.getRecords());
  }, []);

  const filteredFarms = farms.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.state.toLowerCase().includes(search.toLowerCase()) ||
    f.region.toLowerCase().includes(search.toLowerCase()) ||
    f.primary_crops.some(c => c.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF6EC] text-[#2E7D32] text-xs font-bold uppercase tracking-wider">
          <Building2 className="w-3.5 h-3.5" />
          <span>Verified Origin Network</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#123524] tracking-tight">
          Registered Partner Farms
        </h1>
        <p className="text-base text-gray-600">
          Explore the certified growers, orchards, and organic farms connected to the Aurbana digital identity network.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by farm name, state, or crop..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-gray-200 text-sm shadow-xs focus:ring-2 focus:ring-[#2E7D32] outline-none"
        />
      </div>

      {/* Farms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFarms.map((farm) => {
          // Count active batches for this farm in our database
          const activeBatchesCount = records.filter(r => r.origin.toLowerCase().includes(farm.name.toLowerCase())).length;

          return (
            <div
              key={farm.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#2E7D32]/30 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={farm.avatar}
                    alt={farm.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    {farm.certified_organic ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-xs text-white text-xs font-bold shadow-xs">
                        <Leaf className="w-3 h-3" />
                        <span>Certified Organic</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs font-bold shadow-xs">
                        <span>Good Agri Practices</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center gap-1 text-xs font-bold text-[#2E7D32] uppercase tracking-wider mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{farm.region}, {farm.state}</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-[#123524]">
                      {farm.name}
                    </h3>
                  </div>

                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-500">Lead Grower:</span>
                      <span className="font-bold text-[#123524]">{farm.contact_person}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-gray-500">Network Partner Since:</span>
                      <span className="font-bold text-[#123524]">{farm.partner_since}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">Total Registered Batches:</span>
                      <span className="font-extrabold text-[#2E7D32]">{farm.total_batches + activeBatchesCount}</span>
                    </div>
                  </div>

                  {/* Primary Crops */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      Primary Cultivations:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {farm.primary_crops.map((crop, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-[#F8FAF8] text-[#123524] border border-gray-200 text-xs font-semibold"
                        >
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => navigate('/records')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#EAF6EC] hover:bg-[#2E7D32] text-[#2E7D32] hover:text-white text-xs font-bold transition-colors"
                >
                  <span>View Batches from {farm.name.split(' ')[0]}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
