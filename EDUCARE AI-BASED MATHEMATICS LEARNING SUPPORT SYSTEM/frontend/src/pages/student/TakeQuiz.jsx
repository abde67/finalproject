import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuizzes, submitQuiz } from '../../services/dashboards';
import { BookOpen, CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';

const TakeQuiz = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [scoreInput, setScoreInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const data = await fetchQuizzes();
        setTopics(data.topics || []);
      } catch (err) {
        console.error("Failed to fetch quizzes", err);
      } finally {
        setLoading(false);
      }
    };
    loadQuizzes();
  }, []);

  const handleSelectQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setScoreInput('');
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedQuiz || !scoreInput) return;
    
    setSubmitting(true);
    try {
      await submitQuiz(selectedQuiz.id, parseFloat(scoreInput));
      setSuccess(true);
      setTimeout(() => {
        navigate('/student'); // Go back to dashboard to see results
      }, 2000);
    } catch (err) {
        console.error("Failed to submit quiz", err);
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-500">Loading available quizzes...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Knowledge Checks</h1>
        <p className="text-slate-500">Select a topic to test your mastery. Your results will automatically update your learning gaps.</p>
      </div>

      {!selectedQuiz ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <div key={topic.id} className="glass-card flex flex-col h-full border-t-4 border-t-primary-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary-50 text-primary-600 rounded-lg"><BookOpen size={20} /></div>
                <h3 className="font-bold text-slate-800">{topic.topic_name}</h3>
              </div>
              
              <div className="flex-1">
                {topic.quizzes && topic.quizzes.length > 0 ? (
                  <ul className="space-y-2">
                    {topic.quizzes.map(quiz => (
                       <li 
                         key={quiz.id} 
                         onClick={() => handleSelectQuiz(quiz)}
                         className="flex items-center justify-between p-3 bg-slate-50 hover:bg-primary-50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-primary-100 group"
                       >
                         <div className="flex flex-col">
                           <span className="text-sm font-semibold text-slate-700 group-hover:text-primary-700">Test {quiz.id}</span>
                           <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Total Marks: {quiz.total_mark}</span>
                         </div>
                         <ArrowRight size={16} className="text-slate-400 group-hover:text-primary-600" />
                       </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">No tests available for this topic yet.</p>
                )}
              </div>
            </div>
          ))}
          {topics.length === 0 && (
             <div className="col-span-full py-12 text-center text-slate-400">
               <AlertTriangle className="mx-auto mb-4 opacity-50 block" size={32} />
               No topics found. Please ask your administrator to seed the database.
             </div>
          )}
        </div>
      ) : (
        <div className="glass-card max-w-2xl mx-auto border-t-4 border-t-orange-500 relative overflow-hidden">
           {/* Mockup UI for taking a quiz. In a real app we would render individual standard questions. */}
           <div className="mb-8 border-b border-slate-100 pb-6">
              <button 
                onClick={() => setSelectedQuiz(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest mb-6 flex items-center gap-1"
              >
                ← Back to Topics
              </button>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Simulate Quiz Attempt</h2>
              <p className="text-slate-500 text-sm">
                To test the AI Gap Analysis logic without building a 50-question interactive form, enter your mocked score below out of <strong className="text-slate-800">{selectedQuiz.total_mark}</strong>.
                Getting less than 70% will trigger a Gap Record!
              </p>
           </div>

           {success ? (
             <div className="py-12 text-center flex flex-col items-center">
               <CheckCircle className="text-emerald-500 mb-4" size={48} />
               <h3 className="text-xl font-bold text-slate-800 mb-2">Quiz Submitted Successfully!</h3>
               <p className="text-slate-500 text-sm">The backend gap analysis engine has evaluated your score. Redirecting to dashboard...</p>
             </div>
           ) : (
             <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">
                    Your Score
                  </label>
                  <div className="flex gap-4 items-center">
                    <input
                      type="number"
                      required
                      min="0"
                      max={selectedQuiz.total_mark}
                      className="input-field max-w-[150px] text-lg font-bold text-center"
                      placeholder="e.g. 65"
                      value={scoreInput}
                      onChange={(e) => setScoreInput(e.target.value)}
                    />
                    <span className="text-slate-400 font-bold text-xl">/ {selectedQuiz.total_mark}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Enter a number less than {selectedQuiz.total_mark * 0.7} to trigger a weakness alert.</p>
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full shadow-lg shadow-primary-500/30"
                >
                  {submitting ? 'Evaluating...' : 'Submit Attempt & Run Analysis'}
                </button>
             </form>
           )}
        </div>
      )}
    </div>
  );
};

export default TakeQuiz;
