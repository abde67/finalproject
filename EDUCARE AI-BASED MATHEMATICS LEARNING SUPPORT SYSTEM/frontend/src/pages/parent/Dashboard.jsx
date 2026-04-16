import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../../services/auth';
import { fetchParentDashboard } from '../../services/dashboards';
import { FileText, PlayCircle, BarChart, ExternalLink, Calendar, MessageSquare, AlertTriangle, ArrowRight } from 'lucide-react';

const ParentDashboard = () => {
  const user = getCurrentUser();
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchParentDashboard();
        setStudent(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load student data. Ensure this parent account is linked to a student.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="py-12 text-slate-400 font-medium text-sm">Loading student insights...</div>;
  if (error) return <div className="py-12 text-red-500 font-medium text-sm">{error}</div>;
  if (!student) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome back, {user?.full_name?.split(' ')[0] || 'Jonathan'}</h1>
        <p className="text-slate-500">Here's the latest analysis of {student.name}'s academic progress and focus areas for the week.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Top Banner Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-slate-200 rounded-full mb-4 border-4 border-white shadow-sm overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary-400 to-primary-600 text-white font-bold text-xl">
                AM
              </div>
              <h3 className="font-bold text-slate-800">{student.student_name}</h3>
              <p className="text-xs text-slate-400 mt-1">{student.grade}</p>
              <button className="mt-4 border border-slate-200 text-xs font-bold text-slate-600 py-1.5 px-4 rounded-full uppercase tracking-wider hover:bg-slate-50">View Profile</button>
            </div>

            <div className="glass-card flex flex-col justify-center border-t-4 border-t-primary-500">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Overall Mastery</h4>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary-600">{student.mastery}%</span>
                <span className="text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded">↑ 3%</span>
              </div>
              <p className="text-xs text-slate-400 mt-4 leading-relaxed">Generated from 24 active exercises and 3 core exams.</p>
            </div>

            <div className="glass-card flex flex-col justify-center">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Current Focus Areas</h4>
              <ul className="space-y-3">
                {student.focus_areas.map((area, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recent Results */}
          <div className="glass-card p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">Recent Assessment Results</h2>
              <button className="text-xs font-bold text-primary-600 tracking-wider hover:text-primary-700">VIEW HISTORY</button>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] text-slate-400 uppercase tracking-widest bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 font-bold">Assessment Name</th>
                  <th className="px-6 py-4 font-bold">Type</th>
                  <th className="px-6 py-4 font-bold">Score</th>
                  <th className="px-6 py-4 font-bold text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {student.results.map((r, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-semibold text-slate-700">{r.name}</td>
                    <td className="px-6 py-4 text-slate-500">{r.type}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      <span className={`px-2 py-1 rounded text-xs ${parseInt(r.score) > 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                        {r.score}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-right text-xs font-medium">{r.date}<br/>2024</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Gap Analysis */}
          <div className="glass-card">
            <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Learning Gap Analysis</h2>
            <div className="space-y-4">
              {student.gaps.map((gap, i) => (
                <div key={i} className="bg-orange-50/50 border border-orange-100 rounded-xl p-5 flex gap-4">
                  <div className="text-orange-500 flex-shrink-0 mt-1">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">{gap.topic}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{gap.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          <div className="glass-card bg-primary-600 text-white shadow-xl shadow-primary-500/20 text-center py-10 px-6 border-none">
            <div className="w-12 h-12 bg-white/20 rounded-2xl mx-auto flex items-center justify-center mb-6">
              <Calendar className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Strategy Session</h3>
            <p className="text-primary-100 text-sm mb-8 leading-relaxed">Book a 15-minute consultation to discuss curriculum adjustments based on AI data.</p>
            <button className="bg-white text-primary-700 font-bold py-3 px-6 rounded-xl w-full hover:bg-primary-50 transition-colors shadow-sm">
              Book Now
            </button>
          </div>

          <div className="glass-card">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-lg font-bold text-slate-800">Recommended Actions</h2>
               <button className="p-1.5 rounded-md hover:bg-slate-100"><ExternalLink size={16} className="text-slate-400" /></button>
             </div>
             <div className="space-y-1">
               {student.actions.map((act, i) => (
                 <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                   <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                     {act.type === 'Video' ? <PlayCircle size={18} /> : act.type === 'Interactive' ? <FileText size={18} /> : <BarChart size={18} />}
                   </div>
                   <div className="flex-1">
                     <h5 className="font-bold text-sm text-slate-800">{act.title}</h5>
                     <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">{act.type}</p>
                   </div>
                   <div className="text-primary-200"><ArrowRight size={16} /></div>
                 </div>
               ))}
             </div>
          </div>

          <div className="glass-card">
            <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Messages & Updates</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                  {/* Avatar bubble */}
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h5 className="text-sm font-bold text-slate-800">Mrs. Thompson</h5>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">1 h ago</span>
                  </div>
                  <p className="text-xs text-slate-600">"Alex showed great improvement in today's algebra drills. Keep it up!"</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h5 className="text-sm font-bold text-slate-800">System Update</h5>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Yesterday</span>
                  </div>
                  <p className="text-xs text-slate-600">New practice modules assigned for Quadratic Equations.</p>
                </div>
              </div>
            </div>
            <button className="text-xs font-bold text-primary-600 uppercase tracking-widest text-center block w-full mt-6 hover:text-primary-700">
              View All Messages
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
