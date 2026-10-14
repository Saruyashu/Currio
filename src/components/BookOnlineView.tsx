import React, { useState } from 'react';
import { ShieldCheck, Calendar, Clock, CheckCircle2 } from 'lucide-react';

export const BookOnlineView: React.FC = () => {
  const [selectedService, setSelectedService] = useState('appraisal');
  const [date, setDate] = useState('2026-10-15');
  const [time, setTime] = useState('14:00');
  const [name, setName] = useState('Sarvesh Sawant');
  const [email, setEmail] = useState('sarvesh@curio.art');
  const [lotDetails, setLotDetails] = useState('1968 Rolex Submariner Ref. 5513 inspection & archive certification.');
  const [booked, setBooked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBooked(true);
  };

  return (
    <div className="bg-white min-h-[85vh] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="font-mono-num text-[11px] uppercase tracking-wider text-[#bfa054] font-bold block">
            PRIVATE CONSIGNMENT & CURATORIAL SERVICES
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#0c1926]">
            Book a Curatorial Consultation
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-light max-w-lg mx-auto">
            Schedule private vault appraisals, physical provenance inspections, or high-value consignment advisories with our accredited specialists.
          </p>
        </div>

        {booked ? (
          <div className="p-8 bg-[#f8f9fa] border border-neutral-200 rounded-2xl text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-[#0c1926]">
              Consultation Confirmed
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Your appointment for {date} at {time} has been reserved. Our senior horology & antiquities appraiser will contact you at {email}.
            </p>
            <button
              onClick={() => setBooked(false)}
              className="px-6 py-2 bg-[#0c1926] text-white text-xs font-semibold uppercase tracking-wider rounded cursor-pointer"
            >
              Book Another Appointment
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 bg-[#f8f9fb] border border-neutral-200 rounded-2xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setSelectedService('appraisal')}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedService === 'appraisal'
                    ? 'border-[#bfa054] bg-white ring-1 ring-[#bfa054]/40 shadow-xs'
                    : 'border-neutral-200 bg-white/50 text-neutral-500 hover:bg-white'
                }`}
              >
                <ShieldCheck className="w-5 h-5 text-[#bfa054] mb-2" />
                <h4 className="font-serif-luxury text-sm font-semibold text-[#0c1926]">Physical Appraisal</h4>
                <p className="text-[11px] text-neutral-500 mt-1 font-light">Laboratory examination and grading report.</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedService('consignment')}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedService === 'consignment'
                    ? 'border-[#bfa054] bg-white ring-1 ring-[#bfa054]/40 shadow-xs'
                    : 'border-neutral-200 bg-white/50 text-neutral-500 hover:bg-white'
                }`}
              >
                <Calendar className="w-5 h-5 text-[#bfa054] mb-2" />
                <h4 className="font-serif-luxury text-sm font-semibold text-[#0c1926]">Consignment Advisory</h4>
                <p className="text-[11px] text-neutral-500 mt-1 font-light">Valuation reserve pricing & marquee lot listing.</p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedService('vault')}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedService === 'vault'
                    ? 'border-[#bfa054] bg-white ring-1 ring-[#bfa054]/40 shadow-xs'
                    : 'border-neutral-200 bg-white/50 text-neutral-500 hover:bg-white'
                }`}
              >
                <Clock className="w-5 h-5 text-[#bfa054] mb-2" />
                <h4 className="font-serif-luxury text-sm font-semibold text-[#0c1926]">Escrow Vault Handover</h4>
                <p className="text-[11px] text-neutral-500 mt-1 font-light">Armored white-glove courier custody transfer.</p>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Collector Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#0c1926]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#0c1926]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Desired Session Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#0c1926]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">Preferred Time Window</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#0c1926]"
                >
                  <option value="10:00">10:00 AM CET (Morning Session)</option>
                  <option value="14:00">02:00 PM CET (Afternoon Gallery)</option>
                  <option value="17:00">05:00 PM CET (Private Evening)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 block mb-1">Lot Particulars & Provenance Notes</label>
              <textarea
                rows={3}
                value={lotDetails}
                onChange={(e) => setLotDetails(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#0c1926]"
              />
            </div>

            <div className="pt-2 text-right">
              <button
                type="submit"
                className="px-8 py-3 bg-[#0c1926] hover:bg-[#16293d] text-white font-semibold text-xs tracking-widest uppercase rounded cursor-pointer transition-colors"
              >
                Confirm Curatorial Booking
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
