import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { applicationApi, loanApi, customerApi } from '../../api/client'
import { LoanApplication, Loan } from '../../types'
import { FileText, Plus, TrendingUp, Clock, AlertCircle, UserCheck } from 'lucide-react'

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    submitted: 'badge-pending',
    under_review: 'badge-review',
    approved: 'badge-approved',
    rejected: 'badge-rejected',
    draft: 'bg-gray-100 text-gray-600 text-xs px-2.5 py-0.5 rounded-full font-medium',
    cancelled: 'bg-gray-100 text-gray-500 text-xs px-2.5 py-0.5 rounded-full font-medium',
  }
  const labels: Record<string, string> = {
    submitted: 'Submitted', under_review: 'Under Review',
    approved: 'Approved', rejected: 'Rejected', draft: 'Draft', cancelled: 'Cancelled',
  }
  return <span className={map[status] || 'badge-pending'}>{labels[status] || status}</span>
}

function LoanStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: 'badge-approved', pending_disbursement: 'badge-pending',
    paid_off: 'badge-review', defaulted: 'badge-rejected',
  }
  const labels: Record<string, string> = {
    active: 'Active', pending_disbursement: 'Pending Disbursement',
    paid_off: 'Paid Off', defaulted: 'Defaulted',
  }
  return <span className={map[status] || 'badge-pending'}>{labels[status] || status}</span>
}

export function CustomerDashboard() {
  const { user } = useAuth()
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const [hasProfile, setHasProfile] = useState<boolean | null>(null)
  const [tab, setTab] = useState<'applications' | 'loans'>('applications')

  useEffect(() => {
    const loadData = async () => {
      const [profileResult, appResult, loanResult] = await Promise.allSettled([
        customerApi.getProfile(),
        applicationApi.myApplications(),
        loanApi.myLoans(),
      ])
      setHasProfile(profileResult.status === 'fulfilled' || profileResult.reason?.response?.status !== 404)
      if (appResult.status === 'fulfilled') setApplications(appResult.value.data)
      if (loanResult.status === 'fulfilled') setLoans(loanResult.value.data)
      setLoading(false)
    }
    loadData()
  }, [])

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0 }).format(amount)

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const activeLoans = loans.filter(l => l.status === 'active')
  const pendingApps = applications.filter(a => ['submitted', 'under_review'].includes(a.status))

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              Welcome back, {user?.full_name.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-500 mt-1">Manage your loans and applications</p>
          </div>
          <Link to="/apply" className="btn-gold flex items-center gap-2">
            <Plus size={18} /> Apply for a Loan
          </Link>
        </div>

        {/* Profile Required Banner */}
        {hasProfile === false && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700 shrink-0">
                <UserCheck size={22} />
              </div>
              <div>
                <p className="font-bold text-amber-900">Profile setup required</p>
                <p className="text-amber-700 text-sm">Complete your profile to apply for a loan — takes about 3 minutes.</p>
              </div>
            </div>
            <Link to="/profile/setup"
              className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-6 rounded-xl transition-colors text-sm shadow-sm">
              Complete Profile →
            </Link>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Applications', value: applications.length, icon: <FileText size={20} />, color: 'bg-green-50 text-green-700' },
            { label: 'Pending Review', value: pendingApps.length, icon: <Clock size={20} />, color: 'bg-yellow-50 text-yellow-700' },
            { label: 'Active Loans', value: activeLoans.length, icon: <TrendingUp size={20} />, color: 'bg-emerald-50 text-emerald-700' },
            {
              label: 'Outstanding',
              value: activeLoans.length > 0 ? formatCurrency(activeLoans.reduce((sum, l) => sum + l.outstanding_balance, 0)) : 'R0',
              icon: <AlertCircle size={20} />,
              color: 'bg-amber-50 text-amber-700'
            },
          ].map(stat => (
            <div key={stat.label} className="card border border-gray-100">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color} mb-3`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              <p className="text-gray-500 text-sm mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Active Loan Banner */}
        {activeLoans.length > 0 && (
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-2xl p-6 mb-8 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-green-200 text-sm font-medium mb-1">Current Active Loan</p>
                <p className="text-3xl font-black">{formatCurrency(activeLoans[0].outstanding_balance)}</p>
                <p className="text-green-200 text-sm mt-1">Outstanding Balance</p>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-8">
                <div>
                  <p className="text-green-300 text-xs">Monthly Payment</p>
                  <p className="font-bold text-lg">{formatCurrency(activeLoans[0].monthly_payment)}</p>
                </div>
                <div>
                  <p className="text-green-300 text-xs">Loan Number</p>
                  <p className="font-bold text-sm">{activeLoans[0].loan_number}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-6">
          {(['applications', 'loans'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab === t ? 'bg-white shadow text-green-700' : 'text-gray-500 hover:text-gray-700'}`}>
              {t} ({t === 'applications' ? applications.length : loans.length})
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="card border border-gray-100 text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-700 mx-auto" />
            <p className="text-gray-400 mt-4">Loading...</p>
          </div>
        ) : tab === 'applications' ? (
          applications.length === 0 ? (
            <div className="card border border-gray-100 text-center py-16">
              <FileText size={48} className="text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-500 mb-2">No Applications Yet</h3>
              <p className="text-gray-400 text-sm mb-6">Apply for your first loan — takes less than 5 minutes!</p>
              <Link to="/apply" className="btn-primary">Apply for a Loan</Link>
            </div>
          ) : (
            <div className="card border border-gray-100 overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['Application', 'Amount', 'Term', 'Monthly', 'Status', 'Date'].map(h => (
                        <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {applications.map(app => (
                      <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-sm text-gray-900">{app.application_number}</p>
                          <p className="text-xs text-gray-400">{app.purpose || 'No purpose specified'}</p>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(app.requested_amount)}</td>
                        <td className="px-6 py-4 text-gray-600 text-sm">{app.loan_term_months} months</td>
                        <td className="px-6 py-4 text-gray-600 text-sm">{app.monthly_payment ? formatCurrency(app.monthly_payment) : '—'}</td>
                        <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                        <td className="px-6 py-4 text-gray-500 text-sm">{formatDate(app.submitted_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          loans.length === 0 ? (
            <div className="card border border-gray-100 text-center py-16">
              <TrendingUp size={48} className="text-gray-200 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-500 mb-2">No Active Loans</h3>
              <p className="text-gray-400 text-sm">Your approved loans will appear here.</p>
            </div>
          ) : (
            <div className="card border border-gray-100 overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['Loan', 'Principal', 'Monthly', 'Outstanding', 'Status'].map(h => (
                        <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {loans.map(loan => (
                      <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-sm text-gray-900">{loan.loan_number}</p>
                          <p className="text-xs text-gray-400">{loan.term_months} months @ 15% p.a.</p>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(loan.principal_amount)}</td>
                        <td className="px-6 py-4 text-gray-600 text-sm">{formatCurrency(loan.monthly_payment)}</td>
                        <td className="px-6 py-4 font-semibold text-green-700">{formatCurrency(loan.outstanding_balance)}</td>
                        <td className="px-6 py-4"><LoanStatusBadge status={loan.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
