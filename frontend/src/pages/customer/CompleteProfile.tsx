import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { customerApi } from '../../api/client'
import { CheckCircle, AlertCircle, ArrowLeft, ArrowRight, User, Briefcase, CreditCard } from 'lucide-react'

const PROVINCES = ['Gauteng', 'Western Cape', 'Eastern Cape', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'North West', 'Free State', 'Northern Cape']
const BANKS = ['Absa', 'Standard Bank', 'FNB', 'Nedbank', 'Capitec Bank', 'African Bank', 'TymeBank', 'Discovery Bank', 'Investec', 'Other']
const ACCOUNT_TYPES = ['Cheque', 'Savings', 'Transmission']
const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say']

type Step = 1 | 2 | 3

interface FormData {
  id_number: string
  date_of_birth: string
  gender: string
  nationality: string
  street_address: string
  city: string
  province: string
  postal_code: string
  employer_name: string
  employer_phone: string
  job_title: string
  employment_start_date: string
  monthly_income: string
  bank_name: string
  account_number: string
  account_type: string
  branch_code: string
}

export function CompleteProfile() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<FormData>({
    id_number: '', date_of_birth: '', gender: '', nationality: 'South African',
    street_address: '', city: '', province: '', postal_code: '',
    employer_name: '', employer_phone: '', job_title: '', employment_start_date: '', monthly_income: '',
    bank_name: '', account_number: '', account_type: '', branch_code: '',
  })

  const update = (field: keyof FormData, value: string) =>
    setForm(f => ({ ...f, [field]: value }))

  const validateStep1 = () => {
    if (form.id_number.length !== 13 || !/^\d+$/.test(form.id_number)) {
      setError('ID number must be exactly 13 digits'); return false
    }
    if (!form.date_of_birth) { setError('Please enter your date of birth'); return false }
    if (!form.gender) { setError('Please select your gender'); return false }
    setError(''); return true
  }

  const validateStep2 = () => {
    if (!form.street_address || !form.city || !form.province || !form.postal_code) {
      setError('Please fill in all address fields'); return false
    }
    if (!form.employer_name || !form.job_title || !form.employer_phone || !form.employment_start_date) {
      setError('Please fill in all employment fields'); return false
    }
    const income = parseFloat(form.monthly_income)
    if (isNaN(income) || income < 4000) {
      setError('Monthly income must be at least R4,000'); return false
    }
    setError(''); return true
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2)
    else if (step === 2 && validateStep2()) setStep(3)
  }

  const handleSubmit = async () => {
    if (!form.bank_name || !form.account_number || !form.account_type || !form.branch_code) {
      setError('Please fill in all banking fields'); return
    }
    setLoading(true)
    setError('')
    try {
      await customerApi.createProfile({
        ...form,
        monthly_income: parseFloat(form.monthly_income),
        date_of_birth: form.date_of_birth + 'T00:00:00',
        employment_start_date: form.employment_start_date + 'T00:00:00',
      })
      navigate('/apply', { replace: true })
    } catch (err: any) {
      const detail = err.response?.data?.detail
      setError(typeof detail === 'string' ? detail : 'Failed to save profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { n: 1, label: 'Personal Info' },
    { n: 2, label: 'Employment' },
    { n: 3, label: 'Banking' },
  ]

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-500 mt-1">Required before you can apply for a loan</p>
        </div>

        {/* Steps */}
        <div className="flex items-center mb-8">
          {steps.map((s, i) => (
            <div key={s.n} className={`flex items-center ${i < steps.length - 1 ? 'flex-1' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                step > s.n ? 'bg-green-500 text-white' : step === s.n ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {step > s.n ? <CheckCircle size={16} /> : s.n}
              </div>
              <span className={`ml-2 text-sm font-medium ${step === s.n ? 'text-green-700' : step > s.n ? 'text-green-600' : 'text-gray-400'}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${step > s.n ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-6">
            <AlertCircle size={16} className="shrink-0 mt-0.5" /> {error}
          </div>
        )}

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="card border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-700">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">Personal Information</h2>
                <p className="text-gray-400 text-sm">Your identity details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">South African ID Number</label>
                <input className="input" placeholder="e.g. 8001015800080" maxLength={13}
                  value={form.id_number}
                  onChange={e => update('id_number', e.target.value.replace(/\D/g, ''))} />
                <p className="text-xs text-gray-400 mt-1">Your 13-digit SA ID number</p>
              </div>
              <div>
                <label className="label">Date of Birth</label>
                <input type="date" className="input"
                  value={form.date_of_birth}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={e => update('date_of_birth', e.target.value)} />
              </div>
              <div>
                <label className="label">Gender</label>
                <select className="input" value={form.gender} onChange={e => update('gender', e.target.value)}>
                  <option value="">Select gender</option>
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Nationality</label>
                <input className="input" value={form.nationality}
                  onChange={e => update('nationality', e.target.value)} />
              </div>
            </div>

            <button onClick={handleNext} className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
              Next: Employment & Address <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Step 2: Employment & Address */}
        {step === 2 && (
          <div className="card border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-700">
                <Briefcase size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">Employment & Address</h2>
                <p className="text-gray-400 text-sm">Your work and home details</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-700">Home Address</p>
              <div>
                <label className="label">Street Address</label>
                <input className="input" placeholder="123 Main Street"
                  value={form.street_address} onChange={e => update('street_address', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">City</label>
                  <input className="input" placeholder="Johannesburg"
                    value={form.city} onChange={e => update('city', e.target.value)} />
                </div>
                <div>
                  <label className="label">Province</label>
                  <select className="input" value={form.province} onChange={e => update('province', e.target.value)}>
                    <option value="">Select province</option>
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Postal Code</label>
                <input className="input" placeholder="2000" maxLength={4}
                  value={form.postal_code} onChange={e => update('postal_code', e.target.value.replace(/\D/g, ''))} />
              </div>

              <p className="text-sm font-semibold text-gray-700 pt-2">Employment Details</p>
              <div>
                <label className="label">Employer Name</label>
                <input className="input" placeholder="ABC Company (Pty) Ltd"
                  value={form.employer_name} onChange={e => update('employer_name', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Job Title</label>
                  <input className="input" placeholder="Software Developer"
                    value={form.job_title} onChange={e => update('job_title', e.target.value)} />
                </div>
                <div>
                  <label className="label">Employer Phone</label>
                  <input className="input" placeholder="+27 11 555 1234"
                    value={form.employer_phone} onChange={e => update('employer_phone', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">Employment Start Date</label>
                <input type="date" className="input"
                  value={form.employment_start_date}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={e => update('employment_start_date', e.target.value)} />
              </div>
              <div>
                <label className="label">Monthly Net Income (after tax)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">R</span>
                  <input type="number" className="input pl-7" placeholder="e.g. 15000" min={4000}
                    value={form.monthly_income} onChange={e => update('monthly_income', e.target.value)} />
                </div>
                <p className="text-xs text-gray-400 mt-1">Minimum R4,000 to qualify for a loan</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => { setStep(1); setError('') }} className="btn-secondary flex-1">← Back</button>
              <button onClick={handleNext} className="btn-primary flex-1 flex items-center justify-center gap-2">
                Next: Banking <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Banking */}
        {step === 3 && (
          <div className="card border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-700">
                <CreditCard size={20} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">Banking Details</h2>
                <p className="text-gray-400 text-sm">Where your loan funds will be deposited</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Bank Name</label>
                <select className="input" value={form.bank_name} onChange={e => update('bank_name', e.target.value)}>
                  <option value="">Select your bank</option>
                  {BANKS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Account Number</label>
                <input className="input" placeholder="e.g. 62123456789"
                  value={form.account_number}
                  onChange={e => update('account_number', e.target.value.replace(/\D/g, ''))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Account Type</label>
                  <select className="input" value={form.account_type} onChange={e => update('account_type', e.target.value)}>
                    <option value="">Select type</option>
                    {ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Branch Code</label>
                  <input className="input" placeholder="e.g. 250655"
                    value={form.branch_code}
                    onChange={e => update('branch_code', e.target.value.replace(/\D/g, ''))} />
                  <p className="text-xs text-gray-400 mt-1">6-digit code (ask your bank)</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
                <p className="font-semibold text-amber-900 mb-1">🔒 Your information is secure</p>
                <p className="text-amber-700">Banking details are encrypted and used only to disburse your approved loan.</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => { setStep(2); setError('') }} className="btn-secondary flex-1">← Back</button>
              <button onClick={handleSubmit} disabled={loading}
                className="btn-gold flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                ) : (
                  <><CheckCircle size={18} /> Complete Profile</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
