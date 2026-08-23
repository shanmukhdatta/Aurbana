import React, { useState } from 'react';
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
  Upload
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
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80');
  
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
  };

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

        {/* SECTION 2: Expandable Additional Information */}
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

                {/* Produce Image URL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Produce Photo URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
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
              Target Digital ID will follow format: <strong className="font-mono bg-white px-2 py-0.5 rounded border">AUR-2026-{produceName ? produceName.substring(0, 3).toUpperCase() : 'PRD'}-XXXXX</strong>
            </span>
          </div>
          <span className="text-gray-500 font-medium">QR URL will be generated instantly</span>
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
