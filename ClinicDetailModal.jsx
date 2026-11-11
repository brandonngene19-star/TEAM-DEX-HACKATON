import React from 'react';

export default function ClinicDetailModal({ clinic, onClose }) {
  if (!clinic) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/35 rounded-full p-2 text-white transition"
          >
            ✕
          </button>
          <span className="bg-blue-500/40 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            {clinic.area} Hub
          </span>
          <h2 className="text-2xl font-bold mt-2">{clinic.name}</h2>
          <p className="text-blue-100 text-sm mt-1">★ {clinic.rating} Reviews • Fee: <strong className="text-white">{clinic.fee}</strong></p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Operating Hours</h4>
            <p className="text-slate-700 text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">
              Monday – Saturday: 08:00 AM – 9:00 PM<br />
              Emergency Services: 24/7 Open
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Verified Services</h4>
            <div className="flex flex-wrap gap-2">
              {["General Consultation", "Laboratory Tests", "Pharmacy On-Site", "Emergency Care"].map((service, index) => (
                <span key={index} className="bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-blue-100">
                  ✓ {service}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Direct Contact</h4>
            <p className="text-slate-700 text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">
              Phone: +237 600 000 000<br />
              Email: contact@{clinic.name.toLowerCase().replace(/[^a-z]/g, '')}.cm
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl hover:bg-slate-300 transition text-sm"
          >
            Close
          </button>
          <button 
            onClick={() => alert(`Booking appointment at ${clinic.name}...`)}
            className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition text-sm shadow-lg shadow-blue-600/30"
          >
            Book Appointment
          </button>
        </div>

      </div>
    </div>
  );
}