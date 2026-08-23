import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  Leaf 
} from 'lucide-react';

interface ContactPageProps {
  navigate: (route: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ navigate }) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    farmName: '',
    email: '',
    phone: '',
    location: '',
    crops: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF6EC] text-[#2E7D32] text-xs font-bold uppercase tracking-wider">
          <Leaf className="w-3.5 h-3.5" />
          <span>Farmer Onboarding & Partnerships</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#123524] tracking-tight">
          Connect with Aurbana
        </h1>
        <p className="text-base text-gray-600">
          Interested in giving your farm's harvest transparent digital identities, or partnering as a regional collection hub?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Contact info info */}
        <div className="md:col-span-5 space-y-6 bg-[#123524] text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-[#8BC34A] uppercase tracking-wider">
                Aurbana AgriTech Hubs
              </span>
              <h3 className="text-2xl font-black mt-1">
                Regional Logistics
              </h3>
            </div>

            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#8BC34A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Central Agri-Facility:</strong>
                  Ludhiana Agri-Corridor, Punjab 141001
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-[#8BC34A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Western Transit Depot:</strong>
                  Nashik-Mumbai Expressway Hub, Maharashtra
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#8BC34A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Email:</strong>
                  partnerships@aurbana.com
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-xs text-gray-400">
            Aurbana is an open transparency platform. We welcome smallholder farmers, cooperatives, and commercial estates.
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-7 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#123524]">
                Inquiry Received!
              </h3>
              <p className="text-sm text-gray-600 max-w-sm mx-auto">
                An Aurbana regional agricultural officer will contact your farm within 24 business hours to setup digital identity tagging.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 rounded-xl bg-[#2E7D32] text-white text-xs font-bold"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-extrabold text-[#123524]">
                Farmer Registration Request
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Harpreet Singh"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Farm / Entity Name *</label>
                  <input
                    type="text"
                    required
                    value={form.farmName}
                    onChange={(e) => setForm({ ...form, farmName: e.target.value })}
                    placeholder="e.g. Green Valley Farm"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="contact@farm.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32] outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">Cultivated Crops</label>
                <input
                  type="text"
                  value={form.crops}
                  onChange={(e) => setForm({ ...form, crops: e.target.value })}
                  placeholder="e.g. Tomatoes, Cauliflower, Capsicum"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32] outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase">Message / Location Details</label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your weekly harvest volume or farm location..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2E7D32] outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl bg-[#2E7D32] hover:bg-[#123524] text-white text-sm font-extrabold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Partner Request</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
