import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Users, Building, FileCheck, CheckCircle2, XCircle } from 'lucide-react';
import { api } from '../api';

export default function AdminPortal() {
  const [stats, setStats] = useState({
    totalUsers: 6,
    totalStudents: 3,
    totalOwners: 2,
    totalListings: 5,
    verifiedListings: 5,
    totalBookings: 3
  });
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const s = await api.getAdminStats();
    const list = await api.getPgs();
    setStats(s);
    setPgs(list);
    setLoading(false);
  };

  const handleToggleVerify = async (pgId) => {
    await api.toggleVerifyPg(pgId);
    loadData();
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 text-white">
      {/* Header Banner */}
      <div className="bg-[#0b2b32] border border-[#16515c] rounded-3xl p-6 sm:p-8 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Admin Management Portal</h2>
            <p className="text-xs sm:text-sm text-teal-300/80">
              Listing Verification, Trust Operations & Platform Metrics
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0c3139] border border-[#17525e]">
          <span className="text-xs text-teal-400 font-semibold uppercase">Total Students</span>
          <div className="text-3xl font-extrabold text-white mt-1">{stats.totalStudents || 3}</div>
        </div>
        <div className="p-5 rounded-2xl bg-[#0c3139] border border-[#17525e]">
          <span className="text-xs text-amber-400 font-semibold uppercase">PG Owners</span>
          <div className="text-3xl font-extrabold text-white mt-1">{stats.totalOwners || 2}</div>
        </div>
        <div className="p-5 rounded-2xl bg-[#0c3139] border border-[#17525e]">
          <span className="text-xs text-emerald-400 font-semibold uppercase">Verified Stays</span>
          <div className="text-3xl font-extrabold text-white mt-1">{stats.verifiedListings || 5}</div>
        </div>
        <div className="p-5 rounded-2xl bg-[#0c3139] border border-[#17525e]">
          <span className="text-xs text-purple-400 font-semibold uppercase">Total Applications</span>
          <div className="text-3xl font-extrabold text-white mt-1">{stats.totalBookings || 3}</div>
        </div>
      </div>

      {/* Listing Verification Management */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Manage & Verify PG Accommodations</h3>
        <p className="text-xs text-teal-300/70">
          Ensure listing authenticity to maintain student safety standards (Slide 6: Verified Listings)
        </p>

        <div className="bg-[#0c3139] border border-[#17525e] rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#092227] text-teal-300/80 border-b border-teal-800 uppercase tracking-wider">
              <tr>
                <th className="p-4">PG Property</th>
                <th className="p-4">City / Locality</th>
                <th className="p-4">Owner</th>
                <th className="p-4">Starting Rent</th>
                <th className="p-4">Verification Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-800/40">
              {pgs.map(pg => (
                <tr key={pg.id} className="hover:bg-teal-900/20 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-3">
                    <img src={pg.coverImage} alt={pg.name} className="w-10 h-10 rounded-lg object-cover" />
                    <span>{pg.name}</span>
                  </td>
                  <td className="p-4 text-teal-200">{pg.locality}, {pg.city}</td>
                  <td className="p-4 text-teal-200">{pg.ownerName || "Ramesh Kothrud"}</td>
                  <td className="p-4 font-bold text-amber-400">₹{pg.monthlyRent?.toLocaleString('en-IN')}/mo</td>
                  <td className="p-4">
                    {pg.isVerified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40">
                        <ShieldAlert className="w-3.5 h-3.5" /> Unverified
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleVerify(pg.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                        pg.isVerified
                          ? 'bg-red-900/50 hover:bg-red-800 text-red-200 border border-red-700/50'
                          : 'bg-teal-600 hover:bg-teal-500 text-white shadow-md'
                      }`}
                    >
                      {pg.isVerified ? 'Revoke Badge' : 'Grant Verified Badge'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
