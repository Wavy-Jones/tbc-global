import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/client'
import { CheckCircle, AlertCircle, Eye, EyeOff, Zap, Shield, Clock } from 'lucide-react'

export function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', full_name: '', phone_number: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await authApi.register(form)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch (err: any) {
      const detail = err.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-20 animate-pulse" />
      
      <div className="relative z-10 text-center max-w-md animate-fade-in">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-12">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse-glow shadow-xl">
            <CheckCircle className="text-white" size={48} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">🎉 Welcome Aboard!</h2>
          <p className="text-gray-600 mb-3">Your account has been created successfully.</p>
          <p className="text-sm text-gray-500">Redirecting you to login...</p>
          
          <div className="mt-8 flex justify-center">
            <div className="flex gap-2">
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: `${i * 0.2}s`}} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-20 animate-pulse delay-700" />

      <div className="w-full max-w-md relative z-10">

        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
            <div className="bg-white shadow-xl rounded-2xl p-2.5 group-hover:scale-105 transition-transform">
              <img src="/logo.jpeg" alt="TBC Global Finance" className="h-14 w-14 object-contain" />
            </div>
            <div className="text-left">
              <span className="font-black text-2xl text-gray-900 block">TBC Global</span>
              <span className="text-green-600 text-sm font-semibold">Finance</span>
            </div>
          </Link>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Start Your Journey</h1>
          <p className="text-gray-500">Create your account in under 2 minutes</p>
        </div>

        {/* Benefits Banner */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-5 mb-6 shadow-sm">
          <p className="text-green-900 text-xs font-bold mb-4 uppercase tracking-wide flex items-center gap-2">
            <Zap size={14} /> Why Join TBC Global?
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { icon: <Zap size={18} />, label: '2hr Approval' },
              { icon: <Shield size={18} />, label: 'Secure' },
              { icon: <Clock size={18} />, label: 'Fast Payout' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-3 shadow-sm">
                <div className="text-green-600 mb-1 flex justify-center">{item.icon}</div>
                <p className="text-xs font-semibold text-gray-700">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8">
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border-2 border-red-200 text-red-700 text-sm px-4 py-4 rounded-2xl mb-6 animate-fade-in">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input 
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50 text-gray-900 font-medium"
                placeholder="John Doe" value={form.full_name}
                onChange={e => update('full_name', e.target.value)} required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input type="email" 
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50 text-gray-900 font-medium"
                placeholder="you@example.com" value={form.email}
                onChange={e => update('email', e.target.value)} required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              <input 
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50 text-gray-900 font-medium"
                placeholder="+27 82 123 4567" value={form.phone_number}
                onChange={e => update('phone_number', e.target.value)} required />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Create Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} 
                  className="w-full px-4 py-3.5 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-gray-50 text-gray-900 font-medium"
                  placeholder="Min. 8 characters" value={form.password}
                  onChange={e => update('password', e.target.value)} required minLength={8} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                <Shield size={12} /> Must include uppercase, lowercase, and a number
              </p>
            </div>

            <button type="submit" disabled={loading} 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Zap size={20} /> Create My Account
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600 mb-4">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 font-bold hover:text-green-700 hover:underline">
                Sign in
              </Link>
            </p>
            
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By registering, you agree to our{' '}
              <a href="#" className="text-green-600 hover:underline font-medium">Terms & Conditions</a>
              {' '}and{' '}
              <a href="#" className="text-green-600 hover:underline font-medium">Privacy Policy</a>
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Your data is protected with 256-bit encryption
          </p>
        </div>
      </div>
    </div>
  )
}
