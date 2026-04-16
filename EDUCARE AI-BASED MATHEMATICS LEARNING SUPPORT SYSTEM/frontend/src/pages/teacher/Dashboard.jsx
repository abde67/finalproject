import React, { useEffect, useState } from 'react';
import { fetchTeacherDashboard, approveRecommendation } from '../../services/dashboards';
import { getCurrentUser } from '../../services/auth';
import { Users, BarChart3, AlertTriangle, CheckCircle, Mail } from 'lucide-react';

const TeacherDashboard = () => {
  const user = getCurrentUser();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const dbData = await fetchTeacherDashboard();
      setDashboardData(dbData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveRecommendation(id);
      // Reload or filter out
      loadDashboard();
    } catch(err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Loading classroom data...</div>;

  const students = dashboardData?.students_overview || [];
  const pendingRecs = dashboardData?.pending_approvals || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome, {user?.full_name}</h1>
          <p className="text-slate-500">Monitor your class performance analytics and review the latest AI-generated mathematics materials.</p>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card flex flex-col justify-center border-l-4 border-l-primary-500">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-50 text-primary-600 rounded-lg"><BarChart3 size={18} /></div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Class Performance</h3>
          </div>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-4xl font-bold text-primary-600">78.5%</span>
            <span className="text-emerald-500 text-sm font-semibold flex items-center">↗ +4.2%</span>
          </div>
        </div>

        <div className="glass-card flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Users size={18} /></div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Active Students</h3>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-4xl font-bold text-slate-800">{students.length}</span>
            <div className="flex -space-x-3">
              {students.slice(0, 3).map((s, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">
                  {s.full_name?.charAt(0)}
                </div>
              ))}
              {students.length > 3 && (
                <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500">
                  +{students.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="glass-card bg-primary-600 border-none text-white flex flex-col justify-center shadow-lg shadow-primary-500/30">
          <div className="flex items-center gap-3 mb-2 opacity-90">
            <h3 className="text-sm font-bold uppercase tracking-widest">Pending Approvals</h3>
          </div>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-5xl font-bold">{pendingRecs.length}</span>
          </div>
          <button className="mt-4 w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-colors">
            Review Now →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
          {/* Student Performance List */}
          <div className="glass-card p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Student Performance</h2>
              <button className="text-sm text-primary-600 font-semibold hover:text-primary-700">Download CSV</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 rounded-tl-lg font-bold tracking-wider">Student</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Mastery Level</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Weak Topics</th>
                    <th className="px-6 py-4 rounded-tr-lg font-bold tracking-wider text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.slice(0,5).map((s, i) => (
                    <tr key={i} className="bg-white border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold flex flex-col items-center justify-center">
                          {s.full_name?.charAt(0)}
                        </div>
                        {s.full_name}
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-500">88%</td>
                      <td className="px-6 py-4 text-slate-500">
                        {s.gap_records?.slice(0, 1).map((g, gi) => (
                          <span key={gi} className="bg-slate-100 px-2 py-1 rounded text-xs">{g.topic}</span>
                        )) || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="w-24 h-2 bg-slate-100 block ml-auto rounded-full overflow-hidden">
                           <span className="block h-full bg-emerald-500 w-[88%] rounded-full"></span>
                        </span>
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr><td colSpan="4" className="text-center py-8 text-slate-400">No students found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Class Skill Gaps */}
          <div className="glass-card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800">Class Skill Gaps</h2>
              <span className="text-xs text-red-500 bg-red-50 flex items-center pl-2 pr-3 py-1 rounded-full font-bold gap-1">
                <AlertTriangle size={14} /> High Priority
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border border-slate-100 rounded-xl bg-slate-50 flex items-start gap-4 hover:border-red-200 transition-colors cursor-pointer">
                <div className="p-3 bg-white rounded-lg shadow-sm border border-slate-100 text-red-500">
                  <BarChart3 size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800">Trigonometric Identities</h4>
                  <p className="text-sm text-slate-500 mt-1">42% of class currently struggling with proofs and simplifications.</p>
                </div>
              </div>
              <div className="p-4 border border-slate-100 rounded-xl bg-slate-50 flex items-start gap-4 hover:border-orange-200 transition-colors cursor-pointer">
                <div className="p-3 bg-white rounded-lg shadow-sm border border-slate-100 text-orange-500">
                  <Users size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800">Polynomial Long Division</h4>
                  <p className="text-sm text-slate-500 mt-1">Foundational weakness identified in 12 students.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="space-y-8">
          {/* Pending AI Exercises */}
          <div className="glass-card border-t-4 border-t-primary-500">
             <h2 className="text-lg font-bold text-slate-800 mb-6">Pending AI Exercises</h2>
             <div className="space-y-4">
               {pendingRecs.slice(0, 3).map((rec, i) => (
                 <div key={i} className="p-4 border border-slate-100 rounded-xl bg-white shadow-sm">
                   <div className="flex items-center gap-2 mb-3">
                     <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                       For {rec.student_name?.split(' ')[0]}
                     </span>
                     <span className="text-[10px] text-slate-400 font-medium ml-auto">OCT 25</span>
                   </div>
                   <h4 className="font-bold text-sm text-slate-800 mb-2">{rec.topic_name}</h4>
                   <p className="text-xs text-slate-500 mb-4 line-clamp-2">"Customized practice focusing on step-by-step factorization techniques to address recent gaps."</p>
                   <div className="flex gap-2">
                     <button onClick={() => handleApprove(rec.id)} className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold py-2 rounded-lg transition-colors">
                       Approve
                     </button>
                     <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold py-2 rounded-lg transition-colors">
                       Reject
                     </button>
                   </div>
                 </div>
               ))}
               {pendingRecs.length === 0 && (
                 <div className="text-slate-400 text-sm text-center py-8">
                   <CheckCircle className="mx-auto mb-2 opacity-50 block" size={32} />
                   All clear! No pending approvals.
                 </div>
               )}
             </div>
          </div>

          <div className="glass-card">
            <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Quick Messages</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">EH</div>
                <div>
                  <h5 className="text-sm font-bold text-slate-800">Elena Rodriguez</h5>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">Thank you for unlocking the advanced algebra module!</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">LS</div>
                <div>
                  <h5 className="text-sm font-bold text-slate-800">Leo Smith</h5>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">I am still struggling with question number 4 on the assignment.</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-2 border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 rounded-lg transition-colors text-sm">
               View All Messages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
