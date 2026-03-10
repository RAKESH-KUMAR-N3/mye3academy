import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock, BookOpen, Unlock, Play, FileText, Trophy, CheckCircle2, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { fetchPublicTestById } from "../redux/mockTestSlice";
import { getImageUrl, handleImageError } from "../utils/imageHelper";

import { motion } from "framer-motion";

const PremiumTestCard = ({ test, index = 0 }) => {
  const dispatch = useDispatch();
  const navigate  = useNavigate();

  const { userData, myMockTests }  = useSelector((s) => s.user);

  const purchasedTests = userData?.purchasedTests || userData?.enrolledMockTests || [];
  const isGrand        = test.isGrandTest === true;
  const isFree         = test.isFree === true;
  
  const hasPurchased   = purchasedTests.some((i) => i._id === test._id || i === test._id) || 
                       myMockTests?.some((t) => t._id === test._id);

  const effectivePrice =
    test.discountPrice > 0 && Number(test.discountPrice) < Number(test.price)
      ? Number(test.discountPrice)
      : Number(test.price);

  const canStart = isFree || effectivePrice <= 0 || hasPurchased;

  const handleAction = (e) => {
    if (e) e.stopPropagation();
    if (!userData) {
      toast.error("Please login first!");
      navigate("/login");
      return;
    }
    navigate(`/student/instructions/${test._id}`);
  };

  const catImage = (test.category && (test.category.icon || test.category.image)) 
    ? getImageUrl(test.category.icon || test.category.image) 
    : "/logo.png";

  const enrolledCount = useMemo(() => {
    const total = (test.baseEnrolledCount || 0) + (test.attempts?.length || 0);
    if (total >= 1000) {
      const num = total / 1000;
      return `${num >= 10 ? Math.round(num) : num.toFixed(1)}k`;
    }
    return total;
  }, [test.baseEnrolledCount, test.attempts]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      onClick={() => navigate(`/all-tests/${test._id}`)}
      className="flex flex-col bg-white rounded-2xl border-2 border-amber-100/50 shadow-md hover:shadow-2xl hover:border-amber-300 transition-all duration-500 overflow-hidden cursor-pointer group h-full relative"
    >
      {/* ── PREMIUM GLOW ACCENT ── */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-[40px] -mr-12 -mt-12 pointer-events-none group-hover:bg-amber-400/20 transition-colors"></div>

      {/* ── HEADER (Gold Section) ── */}
      <div className="pt-4 px-5 pb-2.5 bg-amber-50/50 relative border-b border-amber-100/30">
        <div className="flex justify-between items-start relative z-10">
          {/* Circular Logo - Elevated */}
          <div className="w-11 h-11 rounded-full bg-white shadow-xl border-2 border-white p-2 flex items-center justify-center overflow-hidden transform group-hover:scale-110 transition-transform duration-500">
            <img
              src={catImage}
              alt="Category"
              onError={handleImageError}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Elite Pill - Enhanced Elevation */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-full shadow-[0_4px_15px_rgba(245,158,11,0.4)] border border-amber-300 relative overflow-hidden group/pill">
            <Trophy size={11} className="animate-pulse relative z-10" />
            <span className="text-[11px] font-black tracking-tight relative z-10 shadow-sm">{enrolledCount} Elite</span>
            {/* Animated shine */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/pill:translate-x-full transition-transform duration-1000"></div>
          </div>
        </div>
      </div>

      {/* ── BODY (Info Section) ── */}
      <div className="px-5 py-4 flex-grow flex flex-col">
        <div className="mb-2">
            <span className="text-[9px] font-black text-amber-600 uppercase tracking-[0.2em] bg-amber-100/50 px-2.5 py-1 rounded-md">GRAND TEST SERIES</span>
        </div>
        
        <h3 className="text-[17px] font-black text-slate-800 leading-tight mb-3.5 group-hover:text-amber-600 transition-colors uppercase tracking-tight line-clamp-2 min-h-[2.6rem]">
          {test.title}
        </h3>
        
        <div className="flex items-center gap-3.5 mb-5 text-slate-500">
          <div className="flex items-center gap-1.5">
            <BookOpen size={14} className="text-amber-500" />
            <span className="text-[12px] font-black tracking-tight">
              {test.languages && test.languages.length > 0 ? test.languages[0].toUpperCase() : "ENGLISH"}
            </span>
          </div>
          <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
          <div className="flex items-center gap-1.5">
             <span className="text-[12px] font-black text-amber-600 tracking-tight">{test.totalTests || 0} Tests</span>
          </div>
          <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
          <div className="flex items-center gap-1.5">
            <Trophy size={14} className="text-emerald-500" />
            <span className="text-[12px] font-black tracking-tight">Ranked</span>
          </div>
        </div>

        {/* ── FEATURES LIST (DYNAMIC) ── */}
        <div className="space-y-2.5 mb-6">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <span className="text-[12px] font-bold text-slate-700 leading-tight tracking-tight">
                {test.featureCounts?.liveTests || 0} Live Tests
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <span className="text-[12px] font-bold text-slate-700 leading-tight tracking-tight">
                {test.featureCounts?.chapterTests || 0} Practice Modules
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <span className="text-[12px] font-bold text-slate-700 leading-tight tracking-tight">
                {test.featureCounts?.fullTests || 0} Selection Series
              </span>
            </div>
        </div>
      </div>

      {/* ── FOOTER / ACTION ── */}
      <div className="p-5 pt-0">
        <button
          onClick={handleAction}
          className="w-full py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-amber-200 transition-all flex items-center justify-center gap-2 group/btn active:scale-[0.98]"
        >
          View Grand Test <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default PremiumTestCard;
