import React from 'react';
import { X, CheckCircle2, ShieldCheck, Printer, Download, MapPin, Calendar, User, Phone, Home, QrCode } from 'lucide-react';

export default function ConfirmationSlipModal({ booking, onClose }) {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-[#0b2b32] border border-[#1b5f6d] rounded-3xl max-w-lg w-full text-white shadow-2xl overflow-hidden my-6 print:border-none print:shadow-none print:text-black print:bg-white">
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between print:bg-teal-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white text-teal-800 flex items-center justify-center font-extrabold shadow-md">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-100">
                Official Booking Slip
              </div>
              <h3 className="text-xl font-extrabold">HomeSetu Confirmed Stay</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/20 hover:bg-black/30 text-white transition-colors print:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Voucher Body */}
        <div className="p-6 space-y-6">
          {/* Big Confirmation ID Box */}
          <div className="p-5 rounded-2xl bg-[#082227] border-2 border-dashed border-emerald-500/50 text-center space-y-2 print:bg-slate-100 print:border-slate-400">
            <span className="text-xs font-semibold text-teal-300 uppercase tracking-widest print:text-slate-600">
              Unique Booking Confirmation ID
            </span>
            <div className="text-3xl font-black tracking-wider text-amber-400 print:text-slate-900 font-mono">
              {booking.confirmationId || "HS-2026-CONFIRMED"}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 print:text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              Status: Verified & Accepted by PG Owner
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#0e363e]/70 border border-teal-800/80 print:bg-slate-50 print:border-slate-300">
              <div>
                <p className="text-teal-400/80 uppercase font-semibold text-[10px] print:text-slate-500">Student Name</p>
                <p className="font-bold text-white text-sm mt-0.5 print:text-slate-900">{booking.studentName}</p>
                <p className="text-teal-300/80 mt-0.5 print:text-slate-600">{booking.studentCollege}</p>
                <p className="text-teal-300/80 print:text-slate-600">{booking.studentPhone}</p>
              </div>
              <div>
                <p className="text-teal-400/80 uppercase font-semibold text-[10px] print:text-slate-500">PG Accommodation</p>
                <p className="font-bold text-white text-sm mt-0.5 print:text-slate-900">{booking.pgName}</p>
                <p className="text-teal-300/80 mt-0.5 print:text-slate-600">{booking.pgLocality}, {booking.pgCity}</p>
                <p className="text-teal-300/80 print:text-slate-600">Zero Brokerage Connect</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#0e363e]/70 border border-teal-800/80 text-center print:bg-slate-50 print:border-slate-300">
              <div>
                <p className="text-teal-400/80 uppercase font-semibold text-[10px] print:text-slate-500">Room Type</p>
                <p className="font-bold text-white mt-1 print:text-slate-900">{booking.roomType}</p>
              </div>
              <div>
                <p className="text-teal-400/80 uppercase font-semibold text-[10px] print:text-slate-500">Move-in Date</p>
                <p className="font-bold text-white mt-1 print:text-slate-900">{booking.moveInDate}</p>
              </div>
              <div>
                <p className="text-teal-400/80 uppercase font-semibold text-[10px] print:text-slate-500">Agreed Rent</p>
                <p className="font-bold text-amber-400 mt-1 print:text-slate-900">₹{booking.monthlyRent?.toLocaleString('en-IN')}/mo</p>
              </div>
            </div>

            {booking.ownerNotes && (
              <div className="p-3.5 rounded-xl bg-teal-950/60 border border-teal-800 text-teal-200 print:bg-slate-100 print:text-slate-800">
                <span className="font-bold text-teal-300 block mb-0.5 print:text-slate-900">Owner's Check-in Note:</span>
                "{booking.ownerNotes}"
              </div>
            )}
          </div>

          {/* Verification instructions */}
          <div className="text-[11px] text-teal-300/70 text-center leading-relaxed print:text-slate-600">
            Please present this Confirmation ID and your student ID card upon arrival at the PG.
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 px-4 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
