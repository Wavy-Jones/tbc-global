import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { applicationApi } from '../../api/client'
import { AffordabilityResult } from '../../types'
import { CheckCircle, XCircle, AlertCircle, ArrowLeft, Calculator, Send } from 'lucide-react'

const PURPOSES = [
  'Medical expenses', 'Home repairs', 'Education fees', 'Vehicle repairs',
  'Funeral costs', 'Debt consolidation', 'Business needs', 'Other',
]

export function ApplyLoan() {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [form, setForm] = useState({ requested_amount: 1000, loan_term_months: 6, purpose: '' })
  const [affordability, setAffordability] = useState<AffordabilityResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(v)

  const checkAffordability = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await applicationApi.checkAffordability({
        requested_amount: form.requested_amount,
        loan_term_months: form.loan_term_months,
        purpose: form.purpose,
      })
      setAffordability(res.data)
      setStep(2)
    } catch (err: any) {
      const detail = err.response?.data?.detail
      if (typeof detail === 'string' && detail.toLowerCase().includes('profile not found')) {
        setError('profile_required')
      } else {
        setError(typeof detail === 'string' ? detail : 'Could not check affordability. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const submitApplication = async () => {
    setSubmitting(true)
    setError('')
    try {
      await applicationApi.submit({
        requested_amount: form.requested_amount,
        loan_term_months: form.loan_term_months,
        purpose: form.purpose,
      })
      setStep(3)
    } catch (err: any) {
      const detail = err.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const steps = [
    { n: 1, label: 'Loan Details' },
    { n: 2, label: 'Affordability' },
    { n: 3, label: 'Submitted' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Step Indicators */}
        <div className="flex items-center gap-0 mb-8">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center gap-2.5 ${i < steps.length - 1 ? 'flex-1' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                  step > s.n ? 'bg-green-500 text-white' : step === s.n ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {step > s.n ? <CheckCircle size={16} /> : s.n}
                </div>
                <span className={`text-sm font-medium ${step === s.n ? 'text-green-700' : step > s.n ? 'text-green-600' : 'text-gray-400'}`}>
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 ${step > s.n ? 'bg-green-400' : 'bg-gray-200'}`} />
                )}
              </div>
            </div>
          ))}
        </div>

        {error === 'profile_required' ? (
          <div className="bg-amber-50 border border-amber-300 text-amber-800 px-4 py-4 rounded-xl mb-6">
            <p className="font-semibold mb-1">Profile setup required</p>
            <p className="text-sm mb-3">You need to complete your profile before applying for a loan.</p>
            <Link to="/profile/setup" className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm py-2 px-5 rounded-lg transition-colors">
              Complete My Profile →
            </Link>
          </div>
        ) : error ? (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
            <AlertCircle size={16} className="shrink-0 mt-0.5" /> {error}
          </div>
        ) : null}

        {/* ===== STEP 1 ===== */}
        {step === 1 && (
          <div className="card border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-700">
                <Calculator size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">Loan Details</h2>
                <p className="text-gray-400 text-sm">Tell us how much you need</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="label mb-0">Loan Amount</label>
                  <span className="text-2xl font-black text-green-700">{formatCurrency(form.requested_amount)}</span>
                </div>
                <input type="range" min={100} max={5000} step={100}
                  value={form.requested_amount}
                  onChange={e => setForm(f => ({ ...f, requested_amount: Number(e.target.value) }))}
                  className="w-full h-2 bg-green-200 rounded-full appearance-none cursor-pointer accent-green-700" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>R100</span><span>R5,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="label mb-0">Repayment Term</label>
                  <span className="text-2xl font-black text-green-700">{form.loan_term_months} months</span>
                </div>
                <input type="range" min={1} max={24} step={1}
                  value={form.loan_term_months}
                  onChange={e => setForm(f => ({ ...f, loan_term_months: Number(e.target.value) }))}
                  className="w-full h-2 bg-green-200 rounded-full appearance-none cursor-pointer accent-green-700" />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1 month</span><span>24 months</span>
                </div>
              </div>

              <div>
                <label className="label">Purpose of Loan</label>
                <select className="input" value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))}>
                  <option value="">Select a purpose</option>
                  {PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="bg-green-50 rounded-xl p-4 text-sm">
                <p className="font-semibold text-green-900 mb-2">Quick Summary</p>
                <div className="space-y-1 text-green-700">
                  <div className="flex justify-between"><span>Amount requested</span><span className="font-bold">{formatCurrency(form.requested_amount)}</span></div>
                  <div className="flex justify-between"><span>Interest rate</span><span className="font-bold">15% per annum</span></div>
                  <div className="flex justify-between"><span>Repayment term</span><span className="font-bold">{form.loan_term_months} months</span></div>
                </div>
              </div>

              <button onClick={checkAffordability} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? 'Checking affordability...' : <><Calculator size={18} /> Check Affordability</>}
              </button>
            </div>
          </div>
        )}

        {/* ===== STEP 2 ===== */}
        {step === 2 && affordability && (
          <div className="space-y-4">
            <div className={`card border-2 shadow-sm ${affordability.can_afford ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${affordability.can_afford ? 'bg-green-600' : 'bg-red-500'} text-white`}>
                  {affordability.can_afford ? <CheckCircle size={28} /> : <XCircle size={28} />}
                </div>
                <div>
                  <h2 className={`text-xl font-black ${affordability.can_afford ? 'text-green-800' : 'text-red-800'}`}>
                    {affordability.can_afford ? '✅ You Qualify!' : '❌ Not Approved'}
                  </h2>
                  <p className={`text-sm ${affordability.can_afford ? 'text-green-600' : 'text-red-600'}`}>
                    {affordability.can_afford ? 'Great news! You can afford this loan.' : 'Unfortunately, this loan exceeds your affordability.'}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className={affordability.can_afford ? 'text-green-700' : 'text-red-700'}>Affordability Score</span>
                  <span className="font-bold">{affordability.affordability_score.toFixed(0)}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${affordability.can_afford ? 'bg-green-600' : 'bg-red-500'}`}
                    style={{ width: `${affordability.affordability_score}%` }} />
                </div>
              </div>
            </div>

            <div className="card border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Loan Breakdown</h3>
              <div className="space-y-3">
                {[
                  { label: 'Loan Amount', value: formatCurrency(form.requested_amount), highlight: false },
                  { label: 'Interest Rate', value: '15% per annum', highlight: false },
                  { label: 'Repayment Term', value: `${form.loan_term_months} months`, highlight: false },
                  { label: 'Monthly Payment', value: formatCurrency(affordability.monthly_payment), highlight: true },
                  { label: 'Total Repayment', value: formatCurrency(affordability.total_repayment), highlight: false },
                  { label: 'Total Interest', value: formatCurrency(affordability.total_repayment - form.requested_amount), highlight: false },
                ].map(row => (
                  <div key={row.label} className={`flex justify-between py-2 ${row.highlight ? 'border-y border-gray-100' : ''}`}>
                    <span className="text-gray-500 text-sm">{row.label}</span>
                    <span className={`font-semibold ${row.highlight ? 'text-green-700 text-lg' : 'text-gray-900 text-sm'}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Income Assessment</h3>
              <div className="space-y-3">
                {[
                  { label: 'Monthly Income', value: formatCurrency(affordability.monthly_income) },
                  { label: 'Monthly Payment', value: formatCurrency(affordability.monthly_payment) },
                  { label: 'Remaining Income', value: formatCurrency(affordability.disposable_income) },
                  { label: 'Debt-to-Income Ratio', value: `${(affordability.debt_to_income_ratio * 100).toFixed(1)}%` },
                ].map(row => (
                  <div key={row.label} className="flex justify-between py-1.5">
                    <span className="text-gray-500 text-sm">{row.label}</span>
                    <span className="font-semibold text-gray-900 text-sm">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setStep(1); setAffordability(null) }} className="btn-secondary flex-1">
                ← Adjust Loan
              </button>
              {affordability.can_afford && (
                <button onClick={submitApplication} disabled={submitting} className="btn-gold flex-1 flex items-center justify-center gap-2">
                  {submitting ? 'Submitting...' : <><Send size={16} /> Submit Application</>}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ===== STEP 3 ===== */}
        {step === 3 && (
          <div className="card border border-gray-200 shadow-sm text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" size={40} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-gray-500 mb-2">Your loan application has been received.</p>
            <p className="text-gray-400 text-sm mb-8">Our team will review it and you'll receive a decision within 2-4 hours.</p>
            <div className="bg-green-50 rounded-xl p-4 mb-8 text-left text-sm">
              <p className="font-semibold text-green-800 mb-3">What happens next?</p>
              {['Our team reviews your application', 'We verify your documents and affordability', "You'll receive an approval notification", 'Funds are transferred to your account'].map((item, i) => (
                <div key={i} className="flex items-start gap-2 mb-2">
                  <span className="w-5 h-5 bg-green-700 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                  <span className="text-gray-600">{item}</span>
                </div>
              ))}
            </div>
            <Link to="/dashboard" className="btn-primary inline-block">Go to My Dashboard</Link>
          </div>
        )}
      </div>
    </div>
  )
}
