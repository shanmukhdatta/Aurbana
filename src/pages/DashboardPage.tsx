import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  ClipboardList, 
  Printer, 
  Building2, 
  TrendingUp, 
  QrCode, 
  ShieldCheck, 
  Layers, 
  ArrowUpRight, 
  Eye, 
  Clock, 
  Sparkles,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { ProduceRecord, UserSession } from '../types';
import { ProduceStorageService } from '../services/produceStorage';
import { ConditionBadge } from '../components/ConditionBadge';

interface DashboardPageProps {
  activeUser: UserSession | null;
  navigate: (route: string) => void;
  onOpenQR: (produce: ProduceRecord) => void;
  onPrint: (produce: ProduceRecord) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  activeUser,
  navigate,
  onOpenQR,
  onPrint
}) => {
  const [records, setRecords] = useState<ProduceRecord[]>([]);
  const [stats, setStats] = useState({
    totalIdentities: 1248,
    activeBatches: 326,
    registeredFarms: 84,
    qrScans: 8421
  });

  useEffect(() => {
    const allRecords = ProduceStorageService.getRecords();
    setRecords(allRecords);

    // Calculate real dynamic totals overlaid with platform baseline
    const dynamicScans = allRecords.reduce((acc, r) => acc + (r.scan_count || 0), 0);
    const activeCount = allRecords.filter(r => r.status === 'Active').length;

    setStats({
      totalIdentities: 1240 + allRecords.length,
      activeBatches: 320 + activeCount,
      registeredFarms: 84,
      qrScans: 8400 + dynamicScans
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
      
      {/* Top Header Greeting (Requirement #12) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF6EC] text-[#2E7D32] text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authorized Facility Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#123524] tracking-tight">
            Good Morning, {activeUser ? activeUser.name.split(' ')[0] : 'Aurbana Staff'}
          </h1>
          <p className="text-sm text-gray-600">
            {activeUser ? `${activeUser.facility} • ${activeUser.role}` : 'Central Fresh Logistics & Traceability Terminal'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/create')}
            id="dash-create-btn"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2E7D32] text-white text-sm font-extrabold hover:bg-[#123524] shadow-md shadow-[#2E7D32]/20 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-[#8BC34A]" />
            <span>+ Create Identity</span>
          </button>
        </div>
      </div>

      {/* Statistics 4 Cards (Requirement #12) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Stat 1: Total Produce Identities */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Total Produce Identities
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#EAF6EC] text-[#2E7D32] flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-[#123524]">
              {stats.totalIdentities.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18% from last week</span>
            </div>
          </div>
        </div>

        {/* Stat 2: Active Batches */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Active Batches
            </span>
            <div className="w-9 h-9 rounded-xl bg-lime-50 text-lime-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-[#123524]">
              {stats.activeBatches.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
              <span>Under active retail circulation</span>
            </div>
          </div>
        </div>

        {/* Stat 3: Registered Farms */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Registered Farms
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-[#123524]">
              {stats.registeredFarms.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-amber-600 font-semibold">
              <span>12 states across India</span>
            </div>
          </div>
        </div>

        {/* Stat 4: QR Scans */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              QR Scans
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-[#123524]">
              {stats.qrScans.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Consumer verifications</span>
            </div>
          </div>
        </div>

      </div>

      {/* Dashboard Quick Actions (Requirement #13) */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#123524]">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Action 1 */}
          <button
            onClick={() => navigate('/create')}
            id="dash-action-create"
            className="p-6 rounded-2xl bg-[#2E7D32] hover:bg-[#123524] text-white text-left transition-all shadow-md group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <PlusCircle className="w-6 h-6 text-[#8BC34A]" />
            </div>
            <div>
              <div className="text-base font-extrabold flex items-center justify-between">
                <span>+ Create Produce Identity</span>
                <ArrowUpRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-white/80 mt-1">
                Register new batch and generate unique QR passport
              </p>
            </div>
          </button>

          {/* Action 2 */}
          <button
            onClick={() => navigate('/records')}
            id="dash-action-records"
            className="p-6 rounded-2xl bg-white hover:bg-[#EAF6EC]/50 border border-gray-200 text-left transition-all shadow-xs group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EAF6EC] text-[#2E7D32] flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold text-[#123524] flex items-center justify-between">
                <span>View Produce Records</span>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#2E7D32] group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Filter, search, edit, and audit produce database
              </p>
            </div>
          </button>

          {/* Action 3 */}
          <button
            onClick={() => navigate('/qr-management')}
            id="dash-action-qr"
            className="p-6 rounded-2xl bg-white hover:bg-[#EAF6EC]/50 border border-gray-200 text-left transition-all shadow-xs group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EAF6EC] text-[#2E7D32] flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold text-[#123524] flex items-center justify-between">
                <span>Manage QR Codes</span>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#2E7D32] group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Sticker label generator and thermal tag bulk studio
              </p>
            </div>
          </button>

          {/* Action 4 */}
          <button
            onClick={() => navigate('/farms')}
            id="dash-action-farms"
            className="p-6 rounded-2xl bg-white hover:bg-[#EAF6EC]/50 border border-gray-200 text-left transition-all shadow-xs group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EAF6EC] text-[#2E7D32] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-extrabold text-[#123524] flex items-center justify-between">
                <span>Registered Farms</span>
                <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-[#2E7D32] group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Partner directory, geographic origins, and growers
              </p>
            </div>
          </button>

        </div>
      </div>

      {/* Active Batches Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-[#123524]">
              Active Produce Identities
            </h2>
            <p className="text-xs text-gray-500">
              Live inventory and farm traceability passports
            </p>
          </div>

          <button
            onClick={() => navigate('/records')}
            className="text-xs font-bold text-[#2E7D32] hover:text-[#123524] flex items-center gap-1"
          >
            <span>Open Full Registry</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase font-bold text-gray-500">
                <th className="pb-3">Produce</th>
                <th className="pb-3">Aurbana ID</th>
                <th className="pb-3">Origin Farm</th>
                <th className="pb-3">Age</th>
                <th className="pb-3">Condition</th>
                <th className="pb-3">Scans</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.slice(0, 5).map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={r.image_url || ''}
                        alt={r.produce_name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <div className="font-extrabold text-[#123524]">{r.produce_name}</div>
                        <div className="text-xs text-gray-500">{r.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 font-mono font-bold text-xs text-[#2E7D32]">
                    {r.produce_id}
                  </td>
                  <td className="py-4 text-xs font-medium text-gray-700">
                    {r.origin}
                  </td>
                  <td className="py-4 text-xs font-bold text-[#123524]">
                    {r.age_days === 0 ? 'Fresh Today' : `${r.age_days} Days`}
                  </td>
                  <td className="py-4">
                    <ConditionBadge condition={r.condition} size="sm" />
                  </td>
                  <td className="py-4 text-xs font-semibold text-gray-600">
                    {r.scan_count || 0} scans
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenQR(r)}
                        className="p-1.5 rounded-lg border border-gray-200 hover:bg-[#EAF6EC] text-[#2E7D32] transition-colors"
                        title="View QR"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onPrint(r)}
                        className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors"
                        title="Print Label"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/p/${r.produce_id}`)}
                        className="p-1.5 rounded-lg bg-[#2E7D32] text-white hover:bg-[#123524] transition-colors"
                        title="Public Certificate"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
