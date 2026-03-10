import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getImageUrl, handleImageError } from "../utils/imageHelper";
import { Clock, BookOpen, FileText, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const MockTestCard = ({ test, isEmbedded = false, index = 0 }) => {
  const navigate = useNavigate();
  const { userData, myMockTests } = useSelector((state) => state.user);

  const isPurchased =
    userData?.purchasedTests?.some(
      (id) => id === test._id || (id._id && id._id === test._id)
    ) || myMockTests?.some((t) => t._id === test._id);

  const effectivePrice =
    test.discountPrice > 0 && Number(test.discountPrice) < Number(test.price)
      ? Number(test.discountPrice)
      : Number(test.price);

  const canStart = test.isFree === true || effectivePrice <= 0 || isPurchased;

  const handleAction = (e) => {
    if (e) e.stopPropagation();
    if (!userData) {
      toast.error("Please login to continue");
      return navigate("/login");
    }
    if (canStart) {
      navigate(`/student/instructions/${test._id}`);
    } else {
      navigate(`/all-tests/${test._id}`);
    }
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

  const features = [
    { label: "Live Test", count: test.featureCounts?.liveTests || 0, icon: "⚡" },
    { label: "Chapter Test", count: test.featureCounts?.chapterTests || 0, icon: "📝" },
    { label: "Full Test", count: test.featureCounts?.fullTests || 0, icon: "🏆" },
  ];

  const languagesText = useMemo(() => {
    if (!test.languages || test.languages.length === 0) return "English";
    if (test.languages.length <= 2) return test.languages.join(", ");
    return `${test.languages.slice(0, 2).join(", ")} + ${test.languages.length - 2}`;
  }, [test.languages]);

  const isGrand = test.isGrandTest === true;

  // Theme Definitions
  const theme = isGrand ? {
    headerBg: "bg-gradient-to-br from-amber-50 via-orange-50/80 to-white",
    pillBg: "bg-amber-100/50",
    pillText: "text-amber-600",
    accentText: "text-amber-500",
    hoverText: "group-hover:text-amber-600",
    buttonBg: "bg-amber-500",
    buttonHover: "hover:bg-amber-600",
    shadow: "shadow-amber-100",
    badge: "iotrophy", 
    btnLabel: "View Grand Test"
  } : {
    headerBg: "bg-gradient-to-br from-[#f0fff4] via-emerald-50/80 to-white", 
    pillBg: "bg-emerald-100/50",
    pillText: "text-emerald-600",
    accentText: "text-emerald-500",
    hoverText: "group-hover:text-emerald-600",
    buttonBg: "bg-[#21b731]", 
    buttonHover: "hover:bg-[#1a9227]",
    shadow: "shadow-emerald-100",
    badge: "zap",
    btnLabel: "View Test Series"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      onClick={() => navigate(`/all-tests/${test._id}`)}
      className={`flex flex-col bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-xl hover:${theme.shadow}/40 transition-all duration-300 overflow-hidden cursor-pointer group h-full`}
    >
      {/* ── HEADER (Dynamic Theme) ── */}
      <div className={`pt-4 px-4 pb-2.5 ${theme.headerBg} relative border-b border-slate-50`}>
        <div className="flex justify-between items-start relative z-10">
          {/* Circular Logo - High Elevation with Aura */}
          <div className="relative group">
            {/* Blow-out Aura backdrop */}
            <div className={`absolute -inset-1 rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500 ${isGrand ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
            
            <div className="w-14 h-14 rounded-full bg-white shadow-[0_12px_24px_-8px_rgba(0,0,0,0.18),0_4px_6px_-2px_rgba(0,0,0,0.05)] border-2 border-white flex items-center justify-center overflow-hidden transform group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_20px_35px_-12px_rgba(0,0,0,0.25)] transition-all duration-500 relative z-20">
              {/* Distinct inner gradient for depth */}
              <div className={`absolute inset-0 opacity-15 ${isGrand ? 'bg-gradient-to-tr from-amber-300 via-white to-transparent' : 'bg-gradient-to-tr from-emerald-300 via-white to-transparent'}`}></div>
              <img
                src={catImage}
                alt="Category"
                onError={handleImageError}
                className="w-full h-full object-contain p-3 relative z-10 drop-shadow-sm"
              />
            </div>
          </div>

          {/* Enrollment Pill - Super Elevated & Vibrant */}
          <div className={`flex items-center gap-1.5 px-4 py-2 bg-white rounded-full shadow-[0_12px_28px_-6px_rgba(0,0,0,0.15),0_8px_15px_-4px_rgba(0,0,0,0.1)] ${theme.shadow} border border-white/90 relative overflow-hidden group/pill z-20 transform group-hover:-translate-y-0.5 transition-transform`}>
            {/* Vibrant glow background inside pill */}
            <div className={`absolute -left-2 -top-2 w-8 h-8 rounded-full blur-lg opacity-20 ${isGrand ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
            
            {isGrand ? (
              <Trophy size={11} className="text-amber-500 animate-pulse relative z-10" />
            ) : (
              <span className="text-emerald-500 text-[11px] font-bold animate-bounce relative z-10">⚡</span>
            )}
            <span className="text-[11px] font-black text-slate-800 tracking-tight relative z-10">
              {enrolledCount} <span className="text-slate-500 font-bold ml-0.5">Users</span>
            </span>
            {/* Extended Glossy shine on pill */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full group-hover/pill:translate-x-full transition-transform duration-700"></div>
          </div>
        </div>
        
        {/* Subtle decorative circle */}
        <div className="absolute top-[-20%] right-[-10%] w-24 h-24 bg-white/40 rounded-full blur-2xl"></div>
      </div>

      {/* ── BODY (Info Section) ── */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Top Badge for differentiation */}
        <div className="mb-2">
           <span className={`text-[8px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded ${isGrand ? "bg-amber-100/70 text-amber-700" : "bg-emerald-100/70 text-emerald-700"}`}>
             {isGrand ? "Grand Test" : "Mock Test"}
           </span>
        </div>

        {/* Title */}
        <h3 className={`text-[15px] font-black text-slate-800 leading-snug mb-2.5 ${theme.hoverText} transition-colors line-clamp-2 min-h-[2.4rem] tracking-tight`}>
          {test.title}
        </h3>

        {/* Subjects - Renamed from Languages */}
        <div className={`flex items-start gap-2 mb-4 ${theme.accentText}`}>
          <BookOpen size={14} strokeWidth={3} className="shrink-0 mt-0.5" />
          <span className="text-[11px] font-black uppercase tracking-wider line-clamp-1">
            {languagesText}
          </span>
        </div>

        {/* Test Spec Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
           <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 flex flex-col gap-1">
              <span className="text-[8px] font-black text-slate-400 tracking-[0.1em] uppercase">Duration</span>
              <span className="text-[11px] font-black text-slate-800 flex items-center gap-1.5">
                 <Clock size={11} className={theme.accentText} /> {test.durationMinutes || 0} Min
              </span>
           </div>
           <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 flex flex-col gap-1">
              <span className="text-[8px] font-black text-slate-400 tracking-[0.1em] uppercase">Total Qs</span>
              <span className="text-[11px] font-black text-slate-800 flex items-center gap-1.5">
                 <FileText size={11} className={theme.accentText} /> {test.totalQuestions || 0} Qs
              </span>
           </div>
           <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 flex flex-col gap-1">
              <span className="text-[8px] font-black text-slate-400 tracking-[0.1em] uppercase">Total Marks</span>
              <span className="text-[11px] font-black text-slate-800 flex items-center gap-1.5">
                 <Trophy size={11} className={theme.accentText} /> {test.totalMarks || 0} Pts
              </span>
           </div>
           <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 flex flex-col gap-1">
              <span className="text-[8px] font-black text-slate-400 tracking-[0.1em] uppercase">Access</span>
              <span className={`text-[11px] font-black flex items-center gap-1.5 ${test.isFree ? 'text-emerald-600' : 'text-slate-800'}`}>
                 {test.isFree ? 'FREE' : `₹${effectivePrice}`}
              </span>
           </div>
        </div>
      </div>

      {/* ── FOOTER (Action Button) ── */}
      <div className="px-4 pb-4 mt-auto">
        <button
          onClick={handleAction}
          className={`w-full py-2.5 ${theme.buttonBg} ${theme.buttonHover} text-white rounded-lg font-black text-[10px] uppercase tracking-[0.15em] shadow-lg ${theme.shadow}/50 transition-all active:scale-[0.97] transform hover:shadow-xl`}
        >
          {theme.btnLabel}
        </button>
      </div>
    </motion.div>
  );
};

export default MockTestCard;
