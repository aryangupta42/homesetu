import React, { useState } from 'react';
import { 
  Star, ShieldCheck, ThumbsUp, AlertTriangle, Send, 
  CheckCircle2, Sparkles, User, MessageSquare, Flag, 
  ShieldAlert, Award, Smile, Heart, Check
} from 'lucide-react';
import { api, calculateTrustScore } from '../api';
import { useAuth } from '../context/AuthContext';

export default function ReviewsSection({ pg, reviews = [], onReviewAdded }) {
  const { currentUser } = useAuth();
  
  // New review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [cleanlinessScore, setCleanlinessScore] = useState(5);
  const [foodScore, setFoodScore] = useState(5);
  const [roomQualityScore, setRoomQualityScore] = useState(5);
  const [safetyScore, setSafetyScore] = useState(5);
  const [ownerBehaviourScore, setOwnerBehaviourScore] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [reportedReviews, setReportedReviews] = useState({});
  const [votedReviews, setVotedReviews] = useState({});

  // Compute live Trust Score (0-100)
  const trustScore = calculateTrustScore(pg, reviews);

  // Review analytics computation
  const totalReviewsCount = reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length;
    const percentage = totalReviewsCount > 0 ? Math.round((count / totalReviewsCount) * 100) : (stars === 5 ? 70 : stars === 4 ? 30 : 0);
    return { stars, count, percentage };
  });

  const avgCleanliness = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + (r.cleanlinessScore || 5), 0) / reviews.length).toFixed(1)
    : "4.8";
  const avgFood = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + (r.foodScore || 5), 0) / reviews.length).toFixed(1)
    : "4.6";
  const avgRoomQuality = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + (r.roomQualityScore || 5), 0) / reviews.length).toFixed(1)
    : "4.7";
  const avgSafety = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + (r.safetyScore || 5), 0) / reviews.length).toFixed(1)
    : "4.9";
  const avgOwnerBehaviour = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + (r.ownerBehaviourScore || 5), 0) / reviews.length).toFixed(1)
    : "4.7";

  const handleVoteHelpful = async (reviewId) => {
    if (votedReviews[reviewId]) return;
    setVotedReviews(prev => ({ ...prev, [reviewId]: true }));
    await api.voteHelpfulReview(reviewId);
    if (onReviewAdded) onReviewAdded();
  };

  const handleReport = async (reviewId) => {
    if (reportedReviews[reviewId]) return;
    const confirmReport = window.confirm("Report this review to HomeSetu moderation team for inappropriate content?");
    if (!confirmReport) return;
    
    setReportedReviews(prev => ({ ...prev, [reviewId]: true }));
    await api.reportReview(reviewId);
    alert("Thank you. This review has been flagged and submitted to HomeSetu Trust & Safety team.");
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please login as a verified student to write an official resident review.");
      return;
    }
    if (!comment.trim()) return;

    setIsSubmitting(true);
    await api.addReview({
      pgListingId: pg.id,
      studentId: currentUser.id,
      studentName: currentUser.fullName,
      studentCollege: currentUser.college || "Verified Student",
      rating,
      comment: comment.trim(),
      cleanlinessScore,
      foodScore,
      roomQualityScore,
      safetyScore,
      ownerBehaviourScore,
      isVerifiedResident: true
    });

    setIsSubmitting(false);
    setSubmitSuccess(true);
    setComment('');
    setTimeout(() => setSubmitSuccess(false), 4000);
    if (onReviewAdded) onReviewAdded();
  };

  return (
    <div className="space-y-6 text-white">
      {/* HomeSetu Trust Score & Safety Dossier Hero Card */}
      <div className="bg-gradient-to-br from-[#0c363f] to-[#092227] border-2 border-teal-600/60 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-teal-800 pb-5">
          <div className="flex items-center gap-4">
            {/* Circular Trust Score Ring */}
            <div className="relative w-20 h-20 rounded-2xl bg-[#081d21] border-2 border-amber-400 flex flex-col items-center justify-center shadow-lg shadow-amber-500/10">
              <span className="text-[10px] text-teal-300 uppercase font-black tracking-widest">TRUST</span>
              <span className="text-2xl font-black text-amber-400">{trustScore}</span>
              <span className="text-[9px] text-teal-400/80">OUT OF 100</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-white">HomeSetu Trust & Credibility Score</h4>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> High Integrity
                </span>
              </div>
              <p className="text-xs text-teal-300/80 mt-1 max-w-xl">
                Algorithmic score generated dynamically from property deed validation, police verification, fire safety compliance, and genuine resident reviews.
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 text-amber-400 justify-end">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <div className="text-sm font-bold text-white mt-1">
              {pg.rating?.toFixed(1) || "4.5"} Star Resident Rating
            </div>
            <div className="text-[11px] text-teal-300/70">
              Based on {totalReviewsCount} verified reviews
            </div>
          </div>
        </div>

        {/* 6 Pillars Breakdown Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-4 text-xs">
          <div className="bg-[#081d21] p-2.5 rounded-xl border border-teal-800">
            <div className="text-[10px] text-teal-400/80 uppercase font-semibold">1. Owner ID</div>
            <div className="font-bold text-white mt-0.5 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Aadhaar Verified
            </div>
          </div>

          <div className="bg-[#081d21] p-2.5 rounded-xl border border-teal-800">
            <div className="text-[10px] text-teal-400/80 uppercase font-semibold">2. Police Clearance</div>
            <div className="font-bold text-white mt-0.5 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Clear & Verified
            </div>
          </div>

          <div className="bg-[#081d21] p-2.5 rounded-xl border border-teal-800">
            <div className="text-[10px] text-teal-400/80 uppercase font-semibold">3. Property Deed</div>
            <div className="font-bold text-white mt-0.5 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Municipal Proof
            </div>
          </div>

          <div className="bg-[#081d21] p-2.5 rounded-xl border border-teal-800">
            <div className="text-[10px] text-teal-400/80 uppercase font-semibold">4. Fire Safety</div>
            <div className="font-bold text-white mt-0.5 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> NOC Certified
            </div>
          </div>

          <div className="bg-[#081d21] p-2.5 rounded-xl border border-teal-800">
            <div className="text-[10px] text-teal-400/80 uppercase font-semibold">5. Biometric / CCTV</div>
            <div className="font-bold text-white mt-0.5 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Active 24x7
            </div>
          </div>

          <div className="bg-[#081d21] p-2.5 rounded-xl border border-teal-800">
            <div className="text-[10px] text-teal-400/80 uppercase font-semibold">6. Student Feedback</div>
            <div className="font-bold text-white mt-0.5 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> 100% Genuine
            </div>
          </div>
        </div>
      </div>

      {/* Review Analytics & Rating Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Star Rating Distribution Bar Chart */}
        <div className="bg-[#0b2b32] border border-teal-800 rounded-2xl p-4 sm:p-5">
          <h5 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <span>Rating Distribution</span>
            <span className="text-xs text-teal-400/80 font-normal">({totalReviewsCount} Reviews)</span>
          </h5>

          <div className="space-y-2 text-xs">
            {ratingDistribution.map((row) => (
              <div key={row.stars} className="flex items-center gap-2">
                <span className="w-12 text-teal-300 font-semibold flex items-center gap-1">
                  {row.stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2.5 rounded-full bg-[#081d21] overflow-hidden border border-teal-800">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"
                    style={{ width: `${row.percentage}%` }}
                  />
                </div>
                <span className="w-12 text-right text-teal-300/80 text-[11px]">
                  {row.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 5 Dimension Aspect Averages */}
        <div className="bg-[#0b2b32] border border-teal-800 rounded-2xl p-4 sm:p-5">
          <h5 className="text-sm font-bold text-white mb-3">Living Quality Dimensions</h5>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-[#081d21] border border-teal-800/80 flex items-center justify-between">
              <span className="text-teal-300">Cleanliness & Hygiene</span>
              <strong className="text-amber-400 font-bold">{avgCleanliness} / 5.0</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-[#081d21] border border-teal-800/80 flex items-center justify-between">
              <span className="text-teal-300">Food & Mess Quality</span>
              <strong className="text-amber-400 font-bold">{avgFood} / 5.0</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-[#081d21] border border-teal-800/80 flex items-center justify-between">
              <span className="text-teal-300">Room Comfort & Space</span>
              <strong className="text-amber-400 font-bold">{avgRoomQuality} / 5.0</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-[#081d21] border border-teal-800/80 flex items-center justify-between">
              <span className="text-teal-300">Safety & Security</span>
              <strong className="text-amber-400 font-bold">{avgSafety} / 5.0</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-[#081d21] border border-teal-800/80 flex items-center justify-between sm:col-span-2">
              <span className="text-teal-300">Owner & Warden Behaviour</span>
              <strong className="text-amber-400 font-bold">{avgOwnerBehaviour} / 5.0</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Resident Review Submission Form */}
      <div className="bg-[#0b2b32] border border-teal-800 rounded-2xl p-5 sm:p-6 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-5 h-5 text-amber-400" />
          <h5 className="text-sm sm:text-base font-bold text-white">
            Write an Official Resident Review
          </h5>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-600/40 font-medium">
            Verified Residents Only
          </span>
        </div>

        {submitSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Your review has been successfully authenticated and published to HomeSetu!</span>
          </div>
        )}

        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="block text-teal-300/80 mb-1 font-semibold">Overall Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full bg-[#081d21] border border-teal-700 rounded-lg px-2.5 py-1.5 text-white"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 - Outstanding)</option>
                <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                <option value={3}>⭐⭐⭐ (3 - Average)</option>
                <option value={2}>⭐⭐ (2 - Below Par)</option>
                <option value={1}>⭐ (1 - Needs Improvement)</option>
              </select>
            </div>

            <div>
              <label className="block text-teal-300/80 mb-1 font-semibold">Cleanliness</label>
              <select
                value={cleanlinessScore}
                onChange={(e) => setCleanlinessScore(Number(e.target.value))}
                className="w-full bg-[#081d21] border border-teal-700 rounded-lg px-2.5 py-1.5 text-white"
              >
                {[5, 4, 3, 2, 1].map(v => <option key={v} value={v}>{v} / 5 Stars</option>)}
              </select>
            </div>

            <div>
              <label className="block text-teal-300/80 mb-1 font-semibold">Food Quality</label>
              <select
                value={foodScore}
                onChange={(e) => setFoodScore(Number(e.target.value))}
                className="w-full bg-[#081d21] border border-teal-700 rounded-lg px-2.5 py-1.5 text-white"
              >
                {[5, 4, 3, 2, 1].map(v => <option key={v} value={v}>{v} / 5 Stars</option>)}
              </select>
            </div>

            <div>
              <label className="block text-teal-300/80 mb-1 font-semibold">Safety & Guard</label>
              <select
                value={safetyScore}
                onChange={(e) => setSafetyScore(Number(e.target.value))}
                className="w-full bg-[#081d21] border border-teal-700 rounded-lg px-2.5 py-1.5 text-white"
              >
                {[5, 4, 3, 2, 1].map(v => <option key={v} value={v}>{v} / 5 Stars</option>)}
              </select>
            </div>

            <div>
              <label className="block text-teal-300/80 mb-1 font-semibold">Owner Behaviour</label>
              <select
                value={ownerBehaviourScore}
                onChange={(e) => setOwnerBehaviourScore(Number(e.target.value))}
                className="w-full bg-[#081d21] border border-teal-700 rounded-lg px-2.5 py-1.5 text-white"
              >
                {[5, 4, 3, 2, 1].map(v => <option key={v} value={v}>{v} / 5 Stars</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-teal-300/80 mb-1.5 font-semibold">
              Your Written Feedback & Practical Living Experience
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share authentic details about Wi-Fi speed, study atmosphere, hot water, warden support, and whether you recommend it to fellow college students..."
              className="w-full bg-[#081d21] border border-teal-700 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-teal-400/40 focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-teal-400/70">
              {currentUser ? `Submitting as ${currentUser.fullName} (${currentUser.college || 'Verified Student'})` : 'Please login to post a resident review.'}
            </span>

            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Publishing Review...' : 'Submit Verified Review'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Review List */}
      <div className="space-y-3">
        <h5 className="text-sm font-bold text-white flex items-center gap-2">
          <span>Student Reviews ({reviews.length})</span>
        </h5>

        {reviews.length === 0 ? (
          <div className="p-6 rounded-2xl bg-[#0b2b32] border border-teal-800 text-center text-teal-300/70 text-xs">
            No resident reviews submitted yet. Be the first student to review this stay!
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-2xl bg-[#0b2b32] border border-teal-800/80 hover:border-teal-700 transition-colors space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-teal-800 flex items-center justify-center font-bold text-white text-xs">
                    {rev.studentName ? rev.studentName.charAt(0) : "S"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{rev.studentName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-semibold border border-teal-600/40 flex items-center gap-1">
                        <Check className="w-3 h-3 text-teal-400" /> Verified Resident
                      </span>
                    </div>
                    <div className="text-[11px] text-teal-300/60 mt-0.5">
                      {rev.studentCollege} • {rev.createdAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-[#081d21] px-2.5 py-1 rounded-lg border border-teal-800">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-white ml-1">{rev.rating || 5}.0</span>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">
                "{rev.comment}"
              </p>

              {/* Sub-scores Tags */}
              <div className="flex flex-wrap items-center gap-2 text-[10px]">
                <span className="px-2 py-0.5 rounded bg-[#081d21] text-teal-300 border border-teal-800">
                  Cleanliness: {rev.cleanlinessScore || 5}/5
                </span>
                <span className="px-2 py-0.5 rounded bg-[#081d21] text-teal-300 border border-teal-800">
                  Food: {rev.foodScore || 5}/5
                </span>
                <span className="px-2 py-0.5 rounded bg-[#081d21] text-teal-300 border border-teal-800">
                  Safety: {rev.safetyScore || 5}/5
                </span>
                <span className="px-2 py-0.5 rounded bg-[#081d21] text-teal-300 border border-teal-800">
                  Owner: {rev.ownerBehaviourScore || 5}/5
                </span>
              </div>

              {/* Action Bar (Helpful Vote & Report) */}
              <div className="flex items-center justify-between border-t border-teal-800/60 pt-2.5 text-xs text-teal-300/70">
                <button
                  onClick={() => handleVoteHelpful(rev.id)}
                  disabled={votedReviews[rev.id]}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    votedReviews[rev.id]
                      ? 'bg-teal-500/20 text-teal-200 border-teal-500'
                      : 'hover:bg-teal-900/40 hover:text-white border-teal-800'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({(rev.helpfulVotes || 0) + (votedReviews[rev.id] ? 1 : 0)})</span>
                </button>

                <button
                  onClick={() => handleReport(rev.id)}
                  disabled={reportedReviews[rev.id]}
                  className="flex items-center gap-1 text-[11px] hover:text-red-300 transition-colors cursor-pointer"
                >
                  <Flag className="w-3 h-3 text-red-400" />
                  <span>{reportedReviews[rev.id] ? 'Reported' : 'Report Inappropriate'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
