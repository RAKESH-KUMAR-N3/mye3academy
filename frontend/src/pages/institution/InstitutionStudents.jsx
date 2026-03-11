import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

import {
  FaArrowLeft,
  FaSpinner,
  FaExclamationTriangle,
  FaTimes,
  FaChartBar,
  FaClipboardList,
  FaQuestionCircle,
} from "react-icons/fa";

import { Search, GraduationCap, Phone, Info, Calendar, Clock, ExternalLink, Plus, Mail, Lock, User as UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchInstitutionStudents } from "../../redux/institutionDashboardSlice";

const ITEMS_PER_PAGE = 8;

const InstitutionStudents = () => {
  const dispatch = useDispatch();
  const { students, loading, error } = useSelector((state) => state.institutionDashboard || {});

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

  // Add Student Form State
  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Activity Modal State
  const [selectedStudentForActivity, setSelectedStudentForActivity] = useState(null);
  const [activityType, setActivityType] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [isActivityLoading, setIsActivityLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchInstitutionStudents());
  }, [dispatch]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/api/institution/students/add", newStudent);
      toast.success("Student added successfully!");
      setShowAddModal(false);
      setNewStudent({ firstName: "", lastName: "", email: "", password: "", phone: "" });
      dispatch(fetchInstitutionStudents());
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add student");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openActivityModal = async (student, type) => {
    setSelectedStudentForActivity(student);
    setActivityType(type);
    setIsActivityLoading(true);
    try {
      const { data } = await api.get(`/api/institution/students/${student._id}/activity`);
      setActivityData(data);
    } catch (err) {
      toast.error("Failed to load activity details");
    } finally {
      setIsActivityLoading(false);
    }
  };

  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;
    const term = searchTerm.toLowerCase();
    return students.filter((s) => {
      const fullName = `${s.firstname || ""} ${s.lastname || ""}`.toLowerCase();
      return fullName.includes(term) || s.email?.toLowerCase().includes(term);
    });
  }, [searchTerm, students]);

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredStudents.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, filteredStudents]);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);

  return (
    <div className="w-full relative">
      {/* Visual background accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/30 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/20 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative z-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight uppercase italic leading-none">Campus Students</h1>
          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] mt-2 opacity-80">
            Precision Student Management & Performance Tracking
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 active:scale-95"
        >
          <Plus size={16} /> Add New Student
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-10 relative z-10">
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex-grow max-w-xl flex items-center group transition-all hover:border-indigo-200">
            <div className="w-12 h-12 flex items-center justify-center text-slate-300 group-hover:text-indigo-500 transition-colors">
                <Search size={20} />
            </div>
            <input
                type="text"
                placeholder="Search by name, email or ID..."
                className="flex-grow bg-transparent border-none focus:ring-0 text-sm font-bold text-slate-700 placeholder:text-slate-300 placeholder:uppercase placeholder:tracking-widest"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="px-6 py-2 bg-white rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
            <div className="text-right">
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none">Total Directory</p>
                <p className="text-lg font-black text-slate-800 leading-none mt-1">{filteredStudents.length}</p>
            </div>
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                <UserIcon size={18} />
            </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden relative z-10 font-sans">
        {loading ? (
          <div className="p-32 flex flex-col items-center">
            <ClipLoader color="#4f46e5" size={50} />
            <p className="mt-6 text-slate-400 font-black uppercase text-[10px] tracking-[0.3em] animate-pulse">Refreshing Campus Intel...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-32 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                <GraduationCap size={40} />
            </div>
            <p className="text-slate-400 font-bold uppercase text-[11px] tracking-widest">No matching student records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/30 border-b border-slate-100 h-16">
                  <th className="px-8 text-[9px] font-black uppercase text-slate-400 tracking-[0.25em]">Registry Intel</th>
                  <th className="px-8 text-[9px] font-black uppercase text-slate-400 tracking-[0.25em]">Communication</th>
                  <th className="px-8 text-[9px] font-black uppercase text-slate-400 tracking-[0.25em] text-center">Purchases</th>
                  <th className="px-8 text-[9px] font-black uppercase text-slate-400 tracking-[0.25em] text-center">Performance Stats</th>
                  <th className="px-8 text-[9px] font-black uppercase text-slate-400 tracking-[0.25em] text-right">Access Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedStudents.map((s) => (
                  <tr key={s._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center border-2 border-slate-100 overflow-hidden shadow-sm group-hover:border-indigo-200 transition-all p-0.5">
                          <img
                            src={`https://ui-avatars.com/api/?background=f8fafc&color=4f46e5&bold=true&name=${encodeURIComponent(s.firstname + " " + s.lastname)}`}
                            alt="avatar"
                            className="w-full h-full object-cover rounded-xl"
                          />
                        </div>
                        <div className="min-w-0">
                           <h4 className="font-black text-slate-800 uppercase tracking-tight text-sm truncate">{s.firstname} {s.lastname}</h4>
                           <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider block mt-1">{s.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1.5 min-w-[140px]">
                        <div className="flex items-center gap-3 text-slate-600">
                             <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                <Phone size={14} />
                             </div>
                             <span className="text-xs font-black text-slate-700 tracking-tight">{s.phoneNumber || "UNAVAILABLE"}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                            <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">VERIFIED CAMPUS ID</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                        <div className="flex justify-center">
                           <button 
                             onClick={() => openActivityModal(s, 'purchased')}
                             className="flex flex-col items-center bg-emerald-50/50 px-5 py-2.5 rounded-2xl border border-emerald-100 hover:bg-emerald-50 transition active:scale-95 min-w-[85px] group/btn"
                           >
                              <span className="text-sm font-black text-emerald-700 leading-none">₹{s.purchasedTestCount || 0}</span>
                              <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mt-1.5">Asset Log</span>
                           </button>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex justify-center items-center gap-4">
                          <button 
                            onClick={() => openActivityModal(s, 'attempts')}
                            className="flex flex-col items-center bg-orange-50/50 px-4 py-2.5 rounded-2xl border border-orange-100 hover:bg-orange-50 transition active:scale-95 min-w-[70px] group/btn"
                          >
                             <span className="text-sm font-black text-orange-700 leading-none">{s.attemptCount || 0}</span>
                             <span className="text-[8px] font-black text-orange-400 uppercase tracking-widest mt-1.5">Mock Tests</span>
                          </button>
                          <button 
                             onClick={() => openActivityModal(s, 'doubts')}
                             className="flex flex-col items-center bg-purple-50/50 px-4 py-2.5 rounded-2xl border border-purple-100 hover:bg-purple-50 transition active:scale-95 min-w-[70px]"
                          >
                             <span className="text-sm font-black text-purple-700 leading-none">{s.doubtCount || 0}</span>
                             <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest mt-1.5">Inquiries</span>
                          </button>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right min-w-[120px]">
                       <span className="text-xs font-black text-slate-800 tracking-tight">{new Date(s.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                       <div className="flex items-center justify-end gap-1.5 mt-1.5">
                            <Clock size={10} className="text-slate-300" />
                            <span className="text-[8px] text-slate-300 font-black uppercase tracking-widest">ENTRY LOGGED</span>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
               <button
                 key={i}
                 onClick={() => setCurrentPage(i + 1)}
                 className={`w-10 h-10 rounded-xl font-bold text-sm transition ${currentPage === i+1 ? "bg-indigo-600 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"}`}
               >
                 {i + 1}
               </button>
            ))}
        </div>
      )}

      {/* ADD STUDENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in h-[85vh] flex flex-col">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div>
                  <h2 className="text-2xl font-black text-slate-900">Add New Student</h2>
                  <p className="text-sm text-slate-500">Provide credentials for the new campus access.</p>
               </div>
               <button onClick={() => setShowAddModal(false)} className="w-10 h-10 rounded-full hover:bg-slate-200 transition flex items-center justify-center text-slate-400">
                  <FaTimes size={20} />
               </button>
            </div>
            <form onSubmit={handleAddStudent} className="p-8 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">First Name</label>
                        <div className="relative">
                           <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                           <input 
                              type="text" required
                              className="w-full bg-slate-50 border-none rounded-2xl pl-12 py-3.5 focus:ring-2 focus:ring-indigo-600"
                              placeholder="Kiran"
                              value={newStudent.firstName}
                              onChange={(e) => setNewStudent({...newStudent, firstName: e.target.value})}
                           />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Last Name</label>
                        <input 
                            type="text" required
                            className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-600"
                            placeholder="Kumar"
                            value={newStudent.lastName}
                            onChange={(e) => setNewStudent({...newStudent, lastName: e.target.value})}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input 
                            type="email" required
                            className="w-full bg-slate-50 border-none rounded-2xl pl-12 py-3.5 focus:ring-2 focus:ring-indigo-600"
                            placeholder="student@campus.com"
                            value={newStudent.email}
                            onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Temporary Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input 
                            type="password" required
                            className="w-full bg-slate-50 border-none rounded-2xl pl-12 py-3.5 focus:ring-2 focus:ring-indigo-600"
                            placeholder="••••••••"
                            value={newStudent.password}
                            onChange={(e) => setNewStudent({...newStudent, password: e.target.value})}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input 
                            type="tel"
                            className="w-full bg-slate-50 border-none rounded-2xl pl-12 py-3.5 focus:ring-2 focus:ring-indigo-600"
                            placeholder="9876543210"
                            value={newStudent.phone}
                            onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                        />
                    </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition active:scale-95 flex justify-center disabled:opacity-50"
                >
                  {isSubmitting ? <ClipLoader size={18} color="#fff" /> : "Authorize Student"}
                </button>
            </form>
          </div>
        </div>
      )}

      {/* ACTIVITY MODAL */}
      {selectedStudentForActivity && activityType && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
             <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 capitalize">{activityType} Tracking</h3>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                             Student: <span className="text-indigo-600 font-black">{selectedStudentForActivity.firstname} {selectedStudentForActivity.lastname}</span>
                        </p>
                    </div>
                    <button onClick={() => { setSelectedStudentForActivity(null); setActivityType(null); }} className="w-10 h-10 rounded-full hover:bg-slate-100 transition flex items-center justify-center text-slate-400 shadow-sm border border-slate-200">
                        <FaTimes size={18} />
                    </button>
                </div>

                {/* TAB SWITCHER WITHIN MODAL */}
                <div className="flex bg-slate-100/80 p-1.5 mx-8 mt-8 rounded-[1.25rem] gap-1.5 border border-slate-200/50">
                    {[
                        { id: 'attempts', label: 'Attempts', icon: <FaChartBar className="mb-0.5" /> },
                        { id: 'purchased', label: 'Purchased', icon: <ShoppingBag size={14} className="mb-0.5" /> },
                        { id: 'doubts', label: 'Doubts', icon: <FaQuestionCircle className="mb-0.5" /> }
                    ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActivityType(tab.id)}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activityType === tab.id ? "bg-white text-indigo-600 shadow-[0_4px_20px_rgba(0,0,0,0.05)] scale-[1.02]" : "text-slate-400 hover:text-slate-600 hover:bg-white/50"}`}
                        >
                          {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>
                
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    {isActivityLoading ? (
                        <div className="py-20 text-center">
                            <ClipLoader color="#4f46e5" size={40} />
                            <p className="mt-4 text-[10px] text-slate-400 font-black tracking-widest">FETCHING PERFORMANCE DATA...</p>
                        </div>
                    ) : (
                        <div className="space-y-4 pb-4">
                            {/* ATTEMPTS VIEW */}
                            {activityType === 'attempts' && (
                                activityData?.attempts?.length > 0 ? (
                                    activityData.attempts.map((att) => {
                                        const totalMarks = att.mocktestId?.totalMarks;
                                        const scorePercentage = totalMarks ? (att.score / totalMarks) * 100 : 0;
                                        return (
                                            <div key={att._id} className="p-6 bg-white rounded-[2rem] border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgba(79,70,229,0.08)] transition-all group relative overflow-hidden">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center text-indigo-700 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                                            <FaChartBar size={28} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-1.5">
                                                                <span className="text-[11px] bg-indigo-100 text-indigo-700 font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider">Exam Attempt</span>
                                                                <span className="text-[11px] text-slate-500 font-extrabold uppercase tracking-widest">{new Date(att.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                            <h5 className="font-extrabold text-slate-900 text-xl uppercase tracking-tighter leading-tight">{att.mocktestId?.title || "Mock Test"}</h5>
                                                            <div className="flex items-center gap-2 mt-2.5">
                                                                <Clock size={14} className="text-slate-400" />
                                                                <span className="text-[11px] text-slate-500 font-extrabold uppercase tracking-widest">{new Date(att.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-8 bg-slate-50 p-5 rounded-3xl border border-slate-200/60 shadow-sm">
                                                        <div className="text-center px-6 border-r border-slate-200">
                                                            <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-[0.2em] mb-1.5">Accuracy</p>
                                                            <p className="text-2xl font-black text-indigo-700 leading-none">{att.correctCount || 0}</p>
                                                            <p className="text-[10px] text-slate-500 font-extrabold uppercase mt-1.5">Correct</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-[0.2em] mb-1.5">Final Score</p>
                                                            <div className="flex items-baseline justify-end gap-1">
                                                                <span className="text-4xl font-black text-slate-900 leading-none">{att.score}</span>
                                                                <span className="text-base font-black text-slate-400">/ {totalMarks || 'N/A'}</span>
                                                            </div>
                                                            <div className="mt-3 w-28 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                                <div 
                                                                    className="h-full bg-indigo-600 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(79,70,229,0.3)]" 
                                                                    style={{ width: `${Math.min(scorePercentage, 100)}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-6 pt-6 border-t border-dashed border-slate-200 flex flex-wrap justify-between items-center gap-4">
                                                    <div className="flex gap-4">
                                                        <div className="flex items-center gap-2.5 text-emerald-700 bg-emerald-100/50 px-5 py-2.5 rounded-2xl border border-emerald-200">
                                                            <CheckCircle size={16} />
                                                            <span className="text-[11px] font-extrabold uppercase tracking-widest">Passed Verification</span>
                                                        </div>
                                                        <div className="flex items-center gap-2.5 text-slate-600 bg-slate-100 px-5 py-2.5 rounded-2xl border border-slate-200">
                                                            <Info size={16} />
                                                            <span className="text-[11px] font-extrabold uppercase tracking-widest">System Logged</span>
                                                        </div>
                                                    </div>
                                                    <Link
                                                        to={`/student/review/${att._id}`}
                                                        target="_blank"
                                                        className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] hover:bg-indigo-700 transition-all flex items-center gap-3 shadow-xl hover:-translate-y-1 active:scale-95"
                                                    >
                                                        Review Analysis <ExternalLink size={14} />
                                                    </Link>
                                                </div>
                                                {/* Decorative element */}
                                                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-50/20 rounded-full blur-3xl -z-0"></div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <EmptyActivityState icon={<FaClipboardList size={40} />} message="NO EXAM ATTEMPTS FOUND" />
                                )
                            )}

                            {/* PURCHASED TESTS VIEW */}
                            {activityType === 'purchased' && (
                                activityData?.purchasedTests?.length > 0 ? (
                                    activityData.purchasedTests.map((test, idx) => (
                                        <div key={idx} className="p-6 bg-white rounded-[2rem] border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-indigo-400 transition-all overflow-hidden relative">
                                            <div className="absolute top-0 left-0 w-2.5 h-full bg-slate-100 group-hover:bg-indigo-600 transition-colors"></div>
                                            <div className="flex items-center gap-7 flex-1 pr-4">
                                                <div className="w-20 h-20 rounded-[1.8rem] bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center text-indigo-700 group-hover:scale-105 transition-transform duration-500 shadow-inner flex-shrink-0">
                                                    <ShoppingBag size={32} />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-[11px] bg-indigo-100 text-indigo-700 font-black px-3 py-1 rounded-lg uppercase tracking-wider">Course Enrollment</span>
                                                        <span className="text-[11px] text-emerald-600 font-extrabold uppercase tracking-widest flex items-center gap-1.5"><CheckCircle size={12} /> Verified Asset</span>
                                                    </div>
                                                    <h5 className="font-black text-slate-900 text-2xl uppercase tracking-tighter leading-tight truncate">{test.title}</h5>
                                                    <div className="mt-4 flex items-center gap-6 flex-wrap">
                                                        <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/60 shadow-sm">
                                                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Order No:</span>
                                                            <span className="text-[11px] text-slate-900 font-black">{test.orderId}</span>
                                                        </div>
                                                        {test.paymentId && test.paymentId !== 'N/A' && (
                                                            <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/60 shadow-sm">
                                                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Payment Ref:</span>
                                                                <span className="text-[11px] text-slate-800 font-black">{test.paymentId}</span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-2.5 group/date">
                                                            <Calendar size={16} className="text-indigo-400 group-hover/date:scale-110 transition-transform" />
                                                            <span className="text-[11px] text-slate-600 font-black uppercase tracking-widest">{new Date(test.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-3 min-w-[190px] bg-slate-50 p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                                                <div className="text-right">
                                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.25em] mb-2">Purchase Value</p>
                                                    <p className="text-4xl font-black text-slate-900 leading-none tracking-tighter">₹{test.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                                                </div>
                                                <div className="mt-2 flex items-center gap-2.5 bg-white px-5 py-2.5 rounded-2xl border border-emerald-100 shadow-sm">
                                                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]"></span>
                                                    <span className="text-[11px] font-black text-emerald-700 tracking-[0.15em] uppercase">Permanent Access</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <EmptyActivityState icon={<ShoppingBag size={40} />} message="NO TEST PURCHASES RECORDED" />
                                )
                            )}

                            {/* DOUBTS VIEW */}
                            {activityType === 'doubts' && (
                                activityData?.doubts?.length > 0 ? (
                                    activityData.doubts.map((d) => (
                                        <div key={d._id} className="p-0 bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] relative overflow-hidden group">
                                            <div className="flex items-stretch">
                                                <div className={`w-3 ${d.status === 'answered' ? 'bg-emerald-500' : 'bg-amber-500'} group-hover:w-4 transition-all duration-300`}></div>
                                                <div className="p-7 flex-1">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-2xl tracking-[0.15em] border ${d.status === 'answered' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                                                                {d.status} Status
                                                            </span>
                                                            <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
                                                            <span className="text-[10px] text-slate-400 font-black tracking-widest uppercase">{new Date(d.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex -space-x-2">
                                                            {[1, 2, 3].map(i => (
                                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                                                                    <img src={`https://ui-avatars.com/api/?name=Expert+${i}&background=random`} alt="expert" className="w-full h-full opacity-60" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="relative mb-6">
                                                        <span className="absolute -left-4 -top-2 text-4xl text-slate-100 font-serif leading-none">“</span>
                                                        <p className="text-lg font-bold text-slate-700 leading-relaxed italic pr-6 pl-2 relative z-10">
                                                            {d.text}
                                                        </p>
                                                        <span className="absolute -right-2 -bottom-4 text-4xl text-slate-100 font-serif leading-none">”</span>
                                                    </div>

                                                    <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-dashed border-slate-100">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                                                                <FaQuestionCircle size={14} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Context / Topic</p>
                                                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">{d.mocktestId?.title || "General Inquiry"}</p>
                                                            </div>
                                                        </div>
                                                        
                                                        {d.assignedInstructor ? (
                                                            <div className="flex items-center gap-3 bg-indigo-50/50 px-4 py-2 rounded-2xl border border-indigo-100/50">
                                                                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-black">
                                                                    {d.assignedInstructor.firstname?.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className="text-[8px] text-indigo-400 font-black uppercase tracking-widest leading-none mb-0.5">Assigned Expert</p>
                                                                    <p className="text-[10px] font-black text-indigo-700 uppercase tracking-tight">{d.assignedInstructor.firstname}</p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-slate-400 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100/30">
                                                                <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse"></div>
                                                                <span className="text-[9px] font-black uppercase tracking-widest">Awaiting Expert Assignment</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <EmptyActivityState icon={<FaQuestionCircle size={40} />} message="NO DOUBTS RAISED YET" />
                                )
                            )}
                        </div>
                    )}
                </div>
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button 
                        onClick={() => { setSelectedStudentForActivity(null); setActivityType(null); }} 
                        className="px-8 py-3 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition shadow-sm"
                    >
                        Close Portal
                    </button>
                </div>
             </div>
          </div>
      )}
    </div>
  );
};

/* Helper UI Components */
const EmptyActivityState = ({ icon, message }) => (
    <div className="py-20 text-center text-slate-300">
        <div className="mb-4 flex justify-center opacity-20">{icon}</div>
        <p className="text-[11px] font-black tracking-[0.2em]">{message}</p>
    </div>
);
const CheckCircle = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
const ShoppingBag = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>;

export default InstitutionStudents;
