import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, CheckCircle2, Building2, Send } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Horology');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-white min-h-[85vh]">
      {/* Header */}
      <section className="bg-[#0b1726] text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-neutral-800 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="font-mono-num text-[11px] uppercase tracking-widest text-[#bfa054] font-bold block">
            SALEROOM CONCIERGE & ADVISORY
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-6xl font-normal tracking-tight text-white leading-tight">
            Contact Curio
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 max-w-lg mx-auto font-light leading-relaxed">
            Speak directly with our department specialists for lot condition reports, private treaties, or consignments.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono-num uppercase tracking-wider text-[#bfa054] font-bold">
                DIRECT INQUIRY
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#0c1926]">
                Send a Message to Our Specialists
              </h2>
              <p className="text-xs text-neutral-500 font-light">
                Inquiries are answered within 24 hours by an accredited department curator.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 bg-[#f8f9fb] border border-neutral-200 rounded-2xl text-center space-y-4 max-w-lg">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif-luxury text-xl font-bold text-[#0c1926]">
                  Inquiry Received
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed font-light">
                  Thank you, <strong>{name}</strong>. Your inquiry has been routed to the {department} Curatorial Department. We will reply to {email} shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                    setSubject('');
                  }}
                  className="px-6 py-2 bg-[#0c1926] text-white text-xs font-semibold uppercase tracking-wider rounded cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 bg-[#f8f9fb] border border-neutral-200 rounded-2xl space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Lord Sterling"
                      className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#bfa054]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sterling@collector.org"
                      className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#bfa054]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#bfa054]"
                    >
                      <option value="Horology">Fine Timepieces & Horology</option>
                      <option value="Numismatics">Ancient & Rare Numismatics</option>
                      <option value="Manuscripts">Historic Folios & Signed Art</option>
                      <option value="Vintage Optics">Vintage Cameras & Optics</option>
                      <option value="Escrow Logistics">Escrow & Armored Logistics</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 block mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Consignment Inquiry for Ref. 5513"
                      className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#bfa054]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">Message & Lot Details</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details about the collectible, provenance certificates, or specific questions."
                    className="w-full bg-white border border-neutral-300 rounded px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-[#bfa054] leading-relaxed"
                  />
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#bfa054] hover:bg-[#a98c42] text-white font-bold text-xs tracking-widest uppercase rounded cursor-pointer transition-colors shadow-xs flex items-center gap-1.5 ml-auto"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Inquiry</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Saleroom Details & Concierge */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-[#0b1726] text-white rounded-2xl space-y-5">
              <span className="font-mono-num text-[10px] tracking-widest text-[#bfa054] uppercase font-bold block">
                GLOBAL HEADQUARTERS
              </span>
              <h3 className="font-serif-luxury text-2xl font-normal text-white">
                Mayfair Saleroom, London
              </h3>
              
              <div className="space-y-3 text-xs text-neutral-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#bfa054] shrink-0 mt-0.5" />
                  <span>24 Old Bond Street, Mayfair, London W1S 4PB, United Kingdom</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#bfa054] shrink-0" />
                  <span className="font-mono-num">+44 (0) 20 7946 0912</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#bfa054] shrink-0" />
                  <span>concierge@curio.art</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#bfa054] shrink-0" />
                  <span>Monday – Friday: 09:30 – 18:00 GMT (By Appointment)</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#f8f9fb] border border-neutral-200 rounded-2xl space-y-4">
              <h4 className="font-serif-luxury text-base font-semibold text-[#0c1926]">
                Regional Saleroom Consuls
              </h4>
              <div className="space-y-3 text-xs divide-y divide-neutral-200">
                <div className="pt-2">
                  <p className="font-semibold text-neutral-900">New York Saleroom</p>
                  <p className="text-neutral-500">980 Madison Ave, New York · +1 (212) 555-0188</p>
                </div>
                <div className="pt-2">
                  <p className="font-semibold text-neutral-900">Geneva Vault</p>
                  <p className="text-neutral-500">Rue du Rhône 42, Genève · +41 22 555 0142</p>
                </div>
                <div className="pt-2">
                  <p className="font-semibold text-neutral-900">Tokyo Ginza Saleroom</p>
                  <p className="text-neutral-500">6-10-1 Ginza, Chuo-ku, Tokyo · +81 3 5555 0199</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
