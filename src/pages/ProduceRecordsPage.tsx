import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  QrCode, 
  Printer, 
  Eye, 
  Edit3, 
  Trash2, 
  ArrowUpDown, 
  Sparkles, 
  RefreshCw, 
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { ProduceRecord, ProduceCondition, ProduceStatus } from '../types';
import { ProduceStorageService } from '../services/produceStorage';
import { ConditionBadge } from '../components/ConditionBadge';
import { PRODUCE_PRESETS } from '../data/mockProduce';

interface ProduceRecordsPageProps {
  navigate: (route: string) => void;
  onOpenQR: (produce: ProduceRecord) => void;
  onPrint: (produce: ProduceRecord) => void;
}

export const ProduceRecordsPage: React.FC<ProduceRecordsPageProps> = ({
  navigate,
  onOpenQR,
  onPrint
}) => {
  const [records, setRecords] = useState<ProduceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduce, setSelectedProduce] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'age' | 'scans'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Edit Modal State
  const [editingRecord, setEditingRecord] = useState<ProduceRecord | null>(null);
  const [editCondition, setEditCondition] = useState<ProduceCondition>('Excellent');
  const [editStorage, setEditStorage] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState<ProduceStatus>('Active');

  const loadRecords = () => {
    setRecords(ProduceStorageService.getRecords());
  };

  useEffect(() => {
    loadRecords();
    const unsubscribe = ProduceStorageService.subscribe(() => {
      loadRecords();
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Filtered and Sorted Records
  const filteredRecords = useMemo(() => {
    return records
      .filter((r) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = r.produce_name.toLowerCase().includes(q);
          const matchId = r.produce_id.toLowerCase().includes(q);
          const matchOrigin = r.origin.toLowerCase().includes(q);
          const matchFarmer = (r.farmer_name || '').toLowerCase().includes(q);
          const matchBatch = (r.batch_number || '').toLowerCase().includes(q);
          if (!matchName && !matchId && !matchOrigin && !matchFarmer && !matchBatch) {
            return false;
          }
        }

        // Produce filter
        if (selectedProduce !== 'all' && r.produce_name.toLowerCase() !== selectedProduce.toLowerCase()) {
          return false;
        }

        // Condition filter
        if (selectedCondition !== 'all' && r.condition !== selectedCondition) {
          return false;
        }

        // Status filter
        if (selectedStatus !== 'all' && r.status !== selectedStatus) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        let compare = 0;
        if (sortBy === 'date') {
          compare = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else if (sortBy === 'age') {
          compare = a.age_days - b.age_days;
        } else if (sortBy === 'scans') {
          compare = (b.scan_count || 0) - (a.scan_count || 0);
        }
        return sortOrder === 'desc' ? compare : -compare;
      });
  }, [records, searchQuery, selectedProduce, selectedCondition, selectedStatus, sortBy, sortOrder]);

  const handleEditClick = (record: ProduceRecord) => {
    setEditingRecord(record);
    setEditCondition(record.condition);
    setEditStorage(record.storage_location || '');
    setEditNotes(record.notes || '');
    setEditStatus(record.status);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    ProduceStorageService.updateRecord(editingRecord.produce_id, {
      condition: editCondition,
      storage_location: editStorage,
      notes: editNotes,
      status: editStatus
    });

    setEditingRecord(null);
    loadRecords();
  };

  const handleToggleStatus = (produceId: string, currentStatus: ProduceStatus) => {
    const nextStatus: ProduceStatus = currentStatus === 'Active' ? 'Deactivated' : 'Active';
    ProduceStorageService.setStatus(produceId, nextStatus);
    loadRecords();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF6EC] text-[#2E7D32] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Aurbana Central Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#123524] tracking-tight">
            Produce Records Database
          </h1>
          <p className="text-sm text-gray-600">
            Search, filter, audit, and generate physical crate tags for registered batches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/create')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#123524] text-white text-sm font-extrabold shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4 text-[#8BC34A]" />
            <span>+ Create Identity</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, produce, farm, or batch code..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#2E7D32] outline-none"
            />
          </div>

          {/* Filter by Produce Name */}
          <div>
            <select
              value={selectedProduce}
              onChange={(e) => setSelectedProduce(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-[#2E7D32] outline-none bg-white text-gray-700"
            >
              <option value="all">All Produce Items</option>
              {PRODUCE_PRESETS.map(p => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Filter by Condition */}
          <div>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-[#2E7D32] outline-none bg-white text-gray-700"
            >
              <option value="all">All Conditions</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Poor">Poor</option>
            </select>
          </div>

        </div>

        {/* Secondary Filter & Sort Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-500 uppercase">Status:</span>
            <div className="flex items-center gap-1">
              {['all', 'Active', 'Deactivated'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    selectedStatus === st
                      ? 'bg-[#123524] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {st === 'all' ? 'All' : st}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-500 uppercase">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 bg-white"
            >
              <option value="date">Date Registered</option>
              <option value="age">Harvest Age</option>
              <option value="scans">QR Scan Count</option>
            </select>

            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="p-1 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600"
              title="Toggle Sort Order"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table View (Prompt Requirement #14) */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#F8FAF8] border-b border-gray-200/80 text-[11px] uppercase font-extrabold text-gray-500 tracking-wider">
                <th className="py-3.5 px-5">Produce</th>
                <th className="py-3.5 px-4">Aurbana ID</th>
                <th className="py-3.5 px-4">Origin Farm</th>
                <th className="py-3.5 px-4">Age</th>
                <th className="py-3.5 px-4">Condition</th>
                <th className="py-3.5 px-4">Registered Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-[#EAF6EC]/20 transition-colors">
                    
                    {/* Produce */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={record.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80'}
                          alt={record.produce_name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <div className="font-extrabold text-[#123524]">
                            {record.produce_name}
                          </div>
                          {record.variety && (
                            <div className="text-xs text-gray-500 truncate max-w-[140px]">
                              {record.variety}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Aurbana ID */}
                    <td className="py-4 px-4 font-mono font-bold text-xs text-[#2E7D32]">
                      {record.produce_id}
                    </td>

                    {/* Origin */}
                    <td className="py-4 px-4 text-xs font-semibold text-gray-800 max-w-[180px] truncate" title={record.origin}>
                      {record.origin}
                    </td>

                    {/* Age */}
                    <td className="py-4 px-4 text-xs font-bold text-[#123524]">
                      {record.age_days === 0 ? 'Fresh Today' : `${record.age_days} Days`}
                    </td>

                    {/* Condition */}
                    <td className="py-4 px-4">
                      <ConditionBadge condition={record.condition} size="sm" />
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-xs text-gray-600">
                      {new Date(record.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleStatus(record.produce_id, record.status)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold transition-all ${
                          record.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}
                        title="Click to toggle active status"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${record.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        <span>{record.status}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenQR(record)}
                          className="p-2 rounded-xl border border-gray-200 hover:bg-[#EAF6EC] text-[#2E7D32] transition-colors"
                          title="View scannable QR"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onPrint(record)}
                          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors"
                          title="Print thermal crate tag"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleEditClick(record)}
                          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors"
                          title="Edit batch properties"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => navigate(`/p/${record.produce_id}`)}
                          className="p-2 rounded-xl bg-[#2E7D32] text-white hover:bg-[#123524] transition-colors shadow-2xs"
                          title="Open public digital certificate"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <div className="space-y-2">
                      <AlertCircle className="w-8 h-8 text-gray-400 mx-auto" />
                      <p className="font-bold text-gray-700">No produce records found matching your filters</p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedProduce('all');
                          setSelectedCondition('all');
                          setSelectedStatus('all');
                        }}
                        className="text-xs font-bold text-[#2E7D32] hover:underline"
                      >
                        Reset all filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Record Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden p-6 sm:p-8 space-y-6">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-[#123524]">
                  Edit Produce Record
                </h3>
                <p className="text-xs font-mono font-bold text-[#2E7D32]">
                  {editingRecord.produce_id} • {editingRecord.produce_name}
                </p>
              </div>
              <button
                onClick={() => setEditingRecord(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-sm">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">Condition</label>
                <select
                  value={editCondition}
                  onChange={(e) => setEditCondition(e.target.value as ProduceCondition)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-medium focus:ring-2 focus:ring-[#2E7D32]"
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Average">Average</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">Storage Location</label>
                <input
                  type="text"
                  value={editStorage}
                  onChange={(e) => setEditStorage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-medium focus:ring-2 focus:ring-[#2E7D32]"
                  placeholder="e.g. Cold Unit B-04 (12°C)"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as ProduceStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-medium focus:ring-2 focus:ring-[#2E7D32]"
                >
                  <option value="Active">Active</option>
                  <option value="Delivered">Delivered / Sold</option>
                  <option value="Deactivated">Deactivated</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">Inspector Quality Notes</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 font-medium focus:ring-2 focus:ring-[#2E7D32] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#2E7D32] hover:bg-[#123524] text-white font-extrabold shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
