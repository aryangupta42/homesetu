import React, { useState } from 'react';
import { X, Calendar, IndianRupee, Bed, Send, ShieldAlert, CheckCircle2, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

export default function BookingRequestModal({ pg, rooms, onClose, onSuccess }) {
  const { currentUser } = useAuth();

  const [roomType, setRoomType] = useState(rooms.length > 0 ? rooms[0].roomType : "Double Sharing");
  const [moveInDate, setMoveInDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [durationMonths, setDurationMonths] = useState(6);
  const [college, setCollege] = useState(currentUser?.college || "College of Engineering Pune (COEP)");
  const [phone, setPhone] = useState(currentUser?.phone || "+91 98765 43210");
  const [message, setMessage] = useState("Hi, I am looking to move in next week. Please review my application.");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedRoom = rooms.find(r => r.roomType === roomType) || { pricePerMonth: pg.monthlyRent };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    const bookingPayload = {
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      studentEmail: currentUser.email,
      studentPhone: phone,
      studentCollege: college,
      pgListingId: pg.id,
      pgName: pg.name,
      pgCity: pg.city,
      pgLocality: pg.locality,
      ownerId: pg.ownerId,
      roomType: roomType,
      monthlyRent: selectedRoom.pricePerMonth,
      moveInDate: moveInDate,
      durationMonths: Number(durationMonths),
      message: message
    };

    await api.createBooking(bookingPayload);
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      onSuccess();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0b2b32] border border-[#1b5f6d] rounded-3xl max-w-lg w-full text-white shadow-2xl overflow-hidden relative my-8">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0d383f] to-[#0a282e] border-b border-teal-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              Direct Application
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              Booking Request
            </h3>
            <p className="text-xs text-teal-300/80">{pg.name} • {pg.locality}, {pg.city}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-teal-900/60 hover:bg-teal-800 text-teal-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-bold text-white">Application Sent!</h4>
            <p className="text-sm text-teal-200/80 max-w-sm mx-auto leading-relaxed">
              Your booking request has been sent directly to <strong>{pg.ownerName || "the PG Owner"}</strong>.
            </p>
            <div className="p-4 rounded-xl bg-[#082227] border border-teal-800 text-xs text-amber-300">
              Status: <strong>PENDING OWNER APPROVAL</strong>
              <br />
              Once approved, your unique <strong>Confirmation ID</strong> will be generated automatically.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Room selection */}
            <div>
              <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-2">
                Select Room Type & Sharing
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {rooms.map(room => (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => setRoomType(room.roomType)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      roomType === room.roomType
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                        : 'bg-[#082227] border-teal-800 text-teal-200 hover:border-teal-600'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{room.roomType}</div>
                    <div className="text-sm font-extrabold text-amber-400 mt-1">
                      ₹{room.pricePerMonth?.toLocaleString('en-IN')}/mo
                    </div>
                    <div className="text-[10px] text-teal-300/70 mt-0.5">
                      {room.availableBeds > 0 ? `${room.availableBeds} beds available` : 'Few beds left'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dates & duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
                  Expected Move-in Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
                  Stay Duration (Months)
                </label>
                <select
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value={3}>3 Months</option>
                  <option value={6}>6 Months (Semester)</option>
                  <option value={10}>10 Months (Academic Year)</option>
                  <option value={12}>12 Months (Full Year)</option>
                </select>
              </div>
            </div>

            {/* Student College & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
                  Your College / Institute
                </label>
                <input
                  type="text"
                  required
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. COEP, Symbiosis, MIT"
                  className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Note to owner */}
            <div>
              <label className="block text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
                Note to Owner (Optional)
              </label>
              <textarea
                rows="2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mention any food preferences, quiet study requirements, etc."
                className="w-full bg-[#082227] border border-teal-800 rounded-xl px-3 py-2 text-xs text-white placeholder-teal-400/40 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Slide 5 Process Reminder */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-3 text-xs text-amber-200">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                <strong>Structured Booking Flow:</strong> You will not be charged any brokerage. Confirmation ID is issued immediately once the owner accepts.
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-teal-300 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-orange-500/20 flex items-center gap-2"
              >
                {loading ? 'Submitting...' : 'Send Booking Request'}
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
