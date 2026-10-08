import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { Clock, CheckCircle2, XCircle, FileText, MapPin, Calendar, IndianRupee, ShieldCheck, ArrowRight, User } from 'lucide-react';
import ConfirmationSlipModal from './ConfirmationSlipModal';

export default function StudentDashboard({ onExploreClick }) {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [selectedBookingForSlip, setSelectedBookingForSlip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, [currentUser]);

  const loadBookings = async () => {
    if (!currentUser) return;
    setLoading(false);
    const data = await api.getStudentBookings(currentUser.id);
    setBookings(data);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 text-white">
      {/* Student Profile Overview Card */}
      <div className="bg-[#0b2b32] border border-[#16515c] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg">
            {currentUser?.fullName?.charAt(0) || "S"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold text-white">{currentUser?.fullName}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-900/80 text-teal-300 text-xs font-semibold border border-teal-700/60">
                Verified Student
              </span>
            </div>
            <p className="text-xs sm:text-sm text-teal-300/80 mt-1">
              🎓 {currentUser?.college || "College of Engineering Pune (COEP)"}
            </p>
            <p className="text-xs text-teal-400/60 mt-0.5">
              📧 {currentUser?.email} • 📞 {currentUser?.phone || "+91 98765 43210"}
            </p>
          </div>
        </div>

        <button
          onClick={onExploreClick}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 shadow-md shrink-0"
        >
          <span>Find More PGs</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Booking Requests List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">My Booking Requests</h3>
            <p className="text-xs text-teal-300/70">
              Structured application flow with real-time status and official Confirmation IDs
            </p>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            {bookings.length} Applications
          </span>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-[#0b2b32] border border-[#16515c] rounded-2xl p-10 text-center space-y-3">
            <p className="text-sm text-teal-300">You haven't submitted any booking requests yet.</p>
            <button
              onClick={onExploreClick}
              className="px-5 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400"
            >
              Explore PGs Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-[#0c3139] border border-[#17525e] hover:border-teal-500/60 rounded-2xl p-5 sm:p-6 transition-all shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left side info */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-lg font-bold text-white">{booking.pgName}</h4>
                    <span className="text-xs text-teal-300/70 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      {booking.pgLocality}, {booking.pgCity}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-teal-200/90">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-teal-400" />
                      Move-in: <strong>{booking.moveInDate}</strong> ({booking.durationMonths} months)
                    </span>
                    <span>Room: <strong>{booking.roomType}</strong></span>
                    <span className="text-amber-400 font-bold">
                      ₹{booking.monthlyRent?.toLocaleString('en-IN')}/mo
                    </span>
                  </div>

                  {booking.message && (
                    <p className="text-xs text-teal-300/70 italic">
                      "{booking.message}"
                    </p>
                  )}

                  {booking.ownerNotes && (
                    <div className="text-xs p-2.5 rounded-lg bg-teal-950/60 border border-teal-800 text-teal-200">
                      <span className="font-semibold text-teal-300">Owner Feedback: </span>
                      {booking.ownerNotes}
                    </div>
                  )}
                </div>

                {/* Right side status & action */}
                <div className="flex flex-col sm:items-end gap-3 shrink-0">
                  {/* Status Badge */}
                  {booking.status === 'ACCEPTED' ? (
                    <div className="flex flex-col sm:items-end gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Approved by Owner!
                      </span>
                      {booking.confirmationId && (
                        <div className="text-right">
                          <span className="text-[10px] text-teal-300/70 uppercase tracking-wider block">Confirmation ID</span>
                          <span className="text-base font-mono font-extrabold text-amber-400">
                            {booking.confirmationId}
                          </span>
                        </div>
                      )}
                      <button
                        onClick={() => setSelectedBookingForSlip(booking)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        View Confirmation Slip
                      </button>
                    </div>
                  ) : booking.status === 'REJECTED' ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-bold border border-red-500/40">
                      <XCircle className="w-4 h-4 text-red-400" />
                      Declined by Owner
                    </span>
                  ) : (
                    <div className="flex flex-col sm:items-end gap-1.5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
                        <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                        Pending Owner Approval
                      </span>
                      <p className="text-[11px] text-teal-400/60 max-w-[200px] sm:text-right">
                        Confirmation ID is generated once the owner accepts your request.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Slip Modal */}
      {selectedBookingForSlip && (
        <ConfirmationSlipModal
          booking={selectedBookingForSlip}
          onClose={() => setSelectedBookingForSlip(null)}
        />
      )}
    </div>
  );
}
