import React, { useState } from 'react';
import { X, Calendar, Clock, Video, MapPin, CheckCircle2, QrCode, Phone, User, ShieldCheck } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function ScheduleVisitModal({ pg, onClose }) {
  const { currentUser } = useAuth();
  const [visitDate, setVisitDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('Morning (10:00 AM - 1:00 PM)');
  const [visitType, setVisitType] = useState('Physical In-Person Visit');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 00001');
  const [notes, setNotes] = useState('Looking to check room ventilation and Wi-Fi speed.');
  const [loading, setLoading] = useState(false);
  const [confirmedVisit, setConfirmedVisit] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const visit = await api.scheduleVisit({
      studentId: currentUser?.id || 1,
      studentName: currentUser?.fullName || "Student",
      studentPhone: phone,
      pgId: pg.id,
      pgName: pg.name,
      visitDate,
      timeSlot,
      visitType,
      notes
    });
    setConfirmedVisit(visit);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0b2b32] border border-[#1b5f6d] rounded-3xl max-w-md w-full text-white shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#0d383f] to-[#0a282e] border-b border-teal-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Schedule a PG Visit</h3>
              <p className="text-xs text-teal-300/80 truncate max-w-[220px]">{pg.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-teal-900/60 text-teal-300 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedVisit ? (
          <div className="p-6 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Visit Scheduled!</span>
              <h4 className="text-xl font-extrabold text-white mt-1">Direct Owner Appointment Confirmed</h4>
              <p className="text-xs text-teal-300/80 mt-1">
                Zero broker interaction. Please show this Visit Pass upon arrival or on video call.
              </p>
            </div>

            {/* Visit Pass Voucher */}
            <div className="p-4 rounded-2xl bg-[#082227] border-2 border-dashed border-teal-700 space-y-3 text-left text-xs">
              <div className="flex justify-between items-center border-b border-teal-800/80 pb-2">
                <div>
                  <span className="text-[10px] text-teal-400 uppercase font-semibold">Pass Code</span>
                  <div className="font-mono font-black text-amber-400 text-base">{confirmedVisit.passCode}</div>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-teal-900 text-teal-200 text-[10px] font-bold border border-teal-700">
                  {confirmedVisit.visitType}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-teal-200"><strong>PG:</strong> {confirmedVisit.pgName}</p>
                <p className="text-teal-200"><strong>Date:</strong> {confirmedVisit.visitDate}</p>
                <p className="text-teal-200"><strong>Slot:</strong> {confirmedVisit.timeSlot}</p>
                <p className="text-teal-200"><strong>Host:</strong> {pg.ownerName} ({pg.ownerPhone})</p>
              </div>

              <div className="pt-2 border-t border-teal-800/80 flex items-center justify-between text-[11px] text-teal-400/80">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Free • No Brokerage</span>
                <span className="font-mono text-amber-300">HomeSetu Verified</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition-colors"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Visit Type Toggle */}
            <div>
              <label className="block text-xs font-semibold text-teal-300 mb-1.5">Choose Visit Mode:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setVisitType('Physical In-Person Visit')}
                  className={`py-2 px-3 rounded-xl border text-left font-bold transition-all ${
                    visitType === 'Physical In-Person Visit'
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md'
                      : 'bg-[#082227] text-teal-200 border-teal-800 hover:bg-teal-900/40'
                  }`}
                >
                  <MapPin className="w-4 h-4 mb-1" />
                  <div>In-Person Visit</div>
                  <div className="text-[10px] font-normal opacity-80">Walk-in physical tour</div>
                </button>

                <button
                  type="button"
                  onClick={() => setVisitType('Live 360° Video Tour')}
                  className={`py-2 px-3 rounded-xl border text-left font-bold transition-all ${
                    visitType === 'Live 360° Video Tour'
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md'
                      : 'bg-[#082227] text-teal-200 border-teal-800 hover:bg-teal-900/40'
                  }`}
                >
                  <Video className="w-4 h-4 mb-1" />
                  <div>360° Video Call</div>
                  <div className="text-[10px] font-normal opacity-80">Live WhatsApp/Meet call</div>
                </button>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-xs font-semibold text-teal-300 mb-1">Preferred Visit Date</label>
              <input
                type="date"
                required
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Time Slot */}
            <div>
              <label className="block text-xs font-semibold text-teal-300 mb-1">Time Slot</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                <option value="Afternoon (2:00 PM - 5:00 PM)">Afternoon (2:00 PM - 5:00 PM)</option>
                <option value="Evening (5:00 PM - 7:30 PM)">Evening (5:00 PM - 7:30 PM)</option>
              </select>
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-xs font-semibold text-teal-300 mb-1">Your Contact Phone</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 00000"
                className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-teal-300 mb-1">Special Queries / Requests (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Would like to check quiet study room"
                className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs transition-all shadow-md"
            >
              {loading ? 'Confirming with Host...' : 'Confirm Visit (0% Cost)'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
