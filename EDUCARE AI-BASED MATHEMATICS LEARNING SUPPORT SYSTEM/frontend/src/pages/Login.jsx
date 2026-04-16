import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/auth';
import { BookOpen } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const data = await login(email, password);
      // Redirect based on role
      if (data.user.role === 'student') navigate('/student');
      else if (data.user.role === 'teacher') navigate('/teacher');
      else if (data.user.role === 'family') navigate('/family');
      else navigate('/student'); // fallback
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Area - Branding (hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-primary-600 text-white p-12 flex-col justify-center relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-500 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
        
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-8 text-primary-100 font-semibold tracking-wider text-sm uppercase">
            <BookOpen size={20} />
            <span>The Digital Curator</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Master Mathematics with AI Precision.
          </h1>
          <p className="text-primary-100 text-lg mb-12">
            Join a community of learners and educators leveraging advanced neural networks to map mathematical mastery through personalized guidance.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-primary-700/50 p-6 rounded-2xl border border-primary-500/30 backdrop-blur-sm">
              <h3 className="text-3xl font-bold mb-1">98%</h3>
              <p className="text-primary-200 text-sm">Success Rate</p>
            </div>
            <div className="bg-primary-700/50 p-6 rounded-2xl border border-primary-500/30 backdrop-blur-sm">
              <h3 className="text-3xl font-bold mb-1">24/7</h3>
              <p className="text-primary-200 text-sm">AI Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Area - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden flex items-center gap-3 mb-10 text-primary-600 font-bold text-xl">
            <BookOpen size={28} />
            <span>EDUCARE</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Welcome back</h2>
            <p className="text-slate-500">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100 flex items-center gap-2">
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                required
                className="input-field"
                placeholder="name@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <input
                type="password"
                required
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input type="checkbox" className="rounded text-primary-600 focus:ring-primary-500 border-slate-300 w-4 h-4 cursor-pointer" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-base shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
