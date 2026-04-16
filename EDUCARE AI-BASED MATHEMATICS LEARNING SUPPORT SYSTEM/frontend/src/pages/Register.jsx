import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/auth';
import { BookOpen } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'student',
    grade_level: '10', // Default required for student
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await register(formData);
      // Automatically redirect to login upon success
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Area - Branding */}
      <div className="hidden lg:flex w-1/2 bg-primary-600 text-white p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-500 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>
        
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-8 text-primary-100 font-semibold tracking-wider text-sm uppercase">
            <BookOpen size={20} />
            <span>The Digital Curator</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Start Your Mastery Journey.
          </h1>
          <p className="text-primary-100 text-lg mb-12">
            Create an account to track skill gaps, receive customized AI interventions, and monitor classroom progress.
          </p>
          
          <div className="bg-primary-700/50 p-6 rounded-2xl border border-primary-500/30 backdrop-blur-sm">
            <p className="text-primary-100 italic">"Transforming abstract numbers into concrete understanding."</p>
          </div>
        </div>
      </div>

      {/* Right Area - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="lg:hidden flex items-center gap-3 mb-8 text-primary-600 font-bold text-xl">
            <BookOpen size={28} />
            <span>EDUCARE</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Create your account</h2>
            <p className="text-slate-500">Enter your details to register today.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
              <span className="font-semibold">Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                name="full_name"
                required
                className="input-field"
                placeholder="John Doe"
                value={formData.full_name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                required
                className="input-field"
                placeholder="name@school.edu"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Account Role</label>
                <select
                  name="role"
                  className="input-field appearance-none"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="family">Parent / Family</option>
                </select>
              </div>

              {formData.role === 'student' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Grade Level</label>
                  <select
                    name="grade_level"
                    className="input-field appearance-none"
                    value={formData.grade_level}
                    onChange={handleChange}
                  >
                    <option value="9">Grade 9</option>
                    <option value="10">Grade 10</option>
                    <option value="11">Grade 11</option>
                    <option value="12">Grade 12</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                required
                className="input-field"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 mt-2 text-base shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40"
            >
              {loading ? 'Creating...' : 'Register'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
