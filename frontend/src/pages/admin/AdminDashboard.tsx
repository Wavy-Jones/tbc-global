import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dashboardApi, applicationApi, customerApi, loanApi } from '../../api/client'
import { DashboardStats, LoanApplication, Loan, CustomerWithUser, Payment } from '../../types'
import {
  FileText, CheckCircle, Clock, TrendingUp, Eye, Users, CreditCard,
  Search, AlertTriangle, X, ChevronDown, ChevronUp,
} from 'lucide-react'

type Tab = 'overview' | 'applications' | 'customers' | 'loans'

const fmt = (v: number) =>
  new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0 }).format(v)

const fmtDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    submitted: 'badge-pending', under_review: 'badge-review',
    approved: 'badge-approved', rejected: 'badge-rejected',
  }
  const labels: Record<string, string> = {
    submitted: '🕐 Submitted', under_review: '🔍 Under Review',
    approved: '✅ Approved', rejected: '❌ Rejected',
    draft: 'Draft', cancelled: 'Cancelled',
  }
  return <span className={map[status] || 'badge-pending'}>{labels[status] || status}</span>
}

function LoanStatusBadge({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    pending_disbursement: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    paid_off: 'bg-blue-100 text-blue-800',
    defaulted: 'bg-red-100 text-red-800',
    written_off: 'bg-gray-100 text-gray-600',
  }
  const labels: Record<string, string> = {
    pending_disbursement: '⏳ Pending Disbursement',
    active: '✅ Active',
    paid_off: '🏁 Paid Off',
    defaulted: '⚠️ Defaulted',
    written_off: '🗑 Written Off',
  }
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg[status] || 'bg-gray-100 text-gray-600'}`}>
      {labels[status] || status}
    </span>
  )
}

// ===== PAYMENT MODAL =====
function PaymentModal({
  loan,
  customerName,
  onClose,
  onSuccess,
}: {
  loan: Loan
  customerName: string
  onClose: () => void
  onSuccess: (updated: Loan) => void
}) {
  const [amount, setAmount] = useState(loan.monthly_payment)
  const [method, setMethod] = useState('eft')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    setSubmitting(true)
    setError('')
    try {
      const res = await loanApi.recordPayment(loan.id, { amount, payment_method: method })
      onSuccess(res.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to record payment')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-black text-gray-900">Record Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-1.5 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Loan</span><span className="font-semibold">{loan.loan_number}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Customer</span><span className="font-semibold">{customerName}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Outstanding</span><span className="font-bold text-red-600">{fmt(loan.outstanding_balance)}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Monthly Payment</span><span className="font-semibold">{fmt(loan.monthly_payment)}</span></div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-lg mb-4">
            <AlertTriangle size={15} className="shrink-0" /> {error}
          </div>
        )}

        <div className="space-y-4 mb-5">
          <div>
            <label className="label">Amount (R)</label>
            <input type="number" className="input" min={1} max={loan.outstanding_balance + 1}
              value={amount} onChange={e => setAmount(Number(e.target.value))} />
          </div>
          <div>
            <label className="label">Payment Method</label>
            <select className="input" value={method} onChange={e => setMethod(e.target.value)}>
              <option value="eft">EFT</option>
              <option value="debit_order">Debit Order</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1" disabled={submitting}>Cancel</button>
          <button onClick={submit} disabled={submitting || amount <= 0}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50">
            {submitting ? 'Processing...' : '✅ Record Payment'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ===== PAYMENT HISTORY MODAL =====
function PaymentHistoryModal({ loan, customerName, onClose }: { loan: Loan; customerName: string; onClose: () => void }) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loanApi.getPayments(loan.id)
      .then(res => setPayments(res.data))
      .finally(() => setLoading(false))
  }, [loan.id])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-black text-gray-900">Payment History</h2>
            <p className="text-gray-400 text-sm">{loan.loan_number} · {customerName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700" /></div>
        ) : payments.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No payments recorded yet</div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {payments.map(p => (
              <div key={p.id} className="bg-gray-50 rounded-xl p-3.5 text-sm">
                <div className="flex justify-between items-start mb-1.5">
                  <span className="font-bold text-gray-900">{fmt(p.amount)}</span>
                  <span className="text-xs text-gray-400">{new Date(p.payment_date).toLocaleString('en-ZA')}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-xs">
                  <span>{p.payment_reference}</span>
                  <span className="capitalize">{p.payment_method || 'eft'}</span>
                </div>
                <div className="flex gap-4 text-xs text-gray-400 mt-1">
                  <span>Principal: {fmt(p.principal_amount)}</span>
                  <span>Interest: {fmt(p.interest_amount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <button onClick={onClose} className="btn-secondary w-full mt-4">Close</button>
      </div>
    </div>
  )
}

// ===== CUSTOMER DETAIL PANEL =====
function CustomerRow({ customer }: { customer: CustomerWithUser }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <td className="px-6 py-4">
          <p className="font-semibold text-sm text-gray-900">{customer.user.full_name}</p>
          <p className="text-xs text-gray-400">{customer.user.email}</p>
        </td>
        <td className="px-6 py-4 text-gray-600 text-sm">{customer.user.phone_number || '—'}</td>
        <td className="px-6 py-4 text-gray-600 text-sm">{customer.province || '—'}</td>
        <td className="px-6 py-4 text-gray-600 text-sm">{customer.employer_name}</td>
        <td className="px-6 py-4 font-semibold text-gray-900 text-sm">{fmt(customer.monthly_income)}</td>
        <td className="px-6 py-4">
          <div className="flex gap-1.5">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${customer.kyc_verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>KYC</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${customer.fica_compliant ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>FICA</span>
          </div>
        </td>
        <td className="px-6 py-4 text-gray-400 text-sm">{fmtDate(customer.created_at)}</td>
        <td className="px-6 py-4 text-gray-400">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </td>
      </tr>
      {expanded && (
        <tr className="bg-amber-50">
          <td colSpan={8} className="px-6 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div><p className="text-gray-400 text-xs mb-0.5">ID Number</p><p className="font-semibold text-gray-800">{customer.id_number}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Date of Birth</p><p className="font-semibold text-gray-800">{fmtDate(customer.date_of_birth)}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Gender</p><p className="font-semibold text-gray-800 capitalize">{customer.gender}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Job Title</p><p className="font-semibold text-gray-800">{customer.job_title}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Bank</p><p className="font-semibold text-gray-800">{customer.bank_name}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Account Type</p><p className="font-semibold text-gray-800 capitalize">{customer.account_type || '—'}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">City</p><p className="font-semibold text-gray-800">{customer.city || '—'}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Address</p><p className="font-semibold text-gray-800">{customer.street_address || '—'}</p></div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

// ===== MAIN COMPONENT =====
export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('overview')

  // Overview + Applications state
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const [appFilter, setAppFilter] = useState('all')
  const [loadingOverview, setLoadingOverview] = useState(true)

  // Customers state
  const [customers, setCustomers] = useState<CustomerWithUser[]>([])
  const [customerSearch, setCustomerSearch] = useState('')
  const [loadingCustomers, setLoadingCustomers] = useState(false)
  const [customersFetched, setCustomersFetched] = useState(false)

  // Loans state
  const [loans, setLoans] = useState<Loan[]>([])
  const [loanFilter, setLoanFilter] = useState('all')
  const [loadingLoans, setLoadingLoans] = useState(false)
  const [loansFetched, setLoansFetched] = useState(false)

  // Modals
  const [paymentLoan, setPaymentLoan] = useState<Loan | null>(null)
  const [historyLoan, setHistoryLoan] = useState<Loan | null>(null)

  // Computed customer lookup for loans tab
  const customerMap = Object.fromEntries(customers.map(c => [c.id, c]))

  useEffect(() => {
    Promise.all([
      dashboardApi.stats().catch(() => ({ data: null })),
      applicationApi.listAll().catch(() => ({ data: [] })),
    ]).then(([s, a]) => {
      setStats(s.data)
      setApplications(a.data)
    }).finally(() => setLoadingOverview(false))
  }, [])

  const loadCustomers = () => {
    if (customersFetched) return
    setLoadingCustomers(true)
    customerApi.listAll()
      .then(res => setCustomers(res.data))
      .finally(() => { setLoadingCustomers(false); setCustomersFetched(true) })
  }

  const loadLoans = () => {
    if (loansFetched) return
    setLoadingLoans(true)
    Promise.all([
      loanApi.listAll().catch(() => ({ data: [] })),
      customersFetched ? Promise.resolve({ data: customers }) : customerApi.listAll().catch(() => ({ data: [] })),
    ]).then(([l, c]) => {
      setLoans(l.data)
      if (!customersFetched) { setCustomers(c.data); setCustomersFetched(true) }
    }).finally(() => { setLoadingLoans(false); setLoansFetched(true) })
  }

  const handleTabChange = (t: Tab) => {
    setTab(t)
    if (t === 'customers') loadCustomers()
    if (t === 'loans') loadLoans()
  }

  const pendingCount = applications.filter(a => ['submitted', 'under_review'].includes(a.status)).length
  const filteredApps = appFilter === 'all' ? applications : applications.filter(a => a.status === appFilter)

  const filteredLoans = loanFilter === 'all' ? loans : loans.filter(l => l.status === loanFilter)

  const filteredCustomers = customers.filter(c => {
    const q = customerSearch.toLowerCase()
    return !q || c.user.full_name.toLowerCase().includes(q) ||
      c.user.email.toLowerCase().includes(q) ||
      c.id_number.includes(q)
  })

  const updateLoan = (updated: Loan) => {
    setLoans(prev => prev.map(l => l.id === updated.id ? updated : l))
    setPaymentLoan(null)
  }

  const handleStatusChange = async (loan: Loan, newStatus: string) => {
    try {
      const res = await loanApi.updateStatus(loan.id, newStatus)
      setLoans(prev => prev.map(l => l.id === loan.id ? res.data : l))
    } catch {}
  }

  const tabs: { key: Tab; label: string; icon: JSX.Element }[] = [
    { key: 'overview', label: 'Overview', icon: <TrendingUp size={16} /> },
    { key: 'applications', label: `Applications${pendingCount > 0 ? ` (${pendingCount})` : ''}`, icon: <FileText size={16} /> },
    { key: 'customers', label: 'Customers', icon: <Users size={16} /> },
    { key: 'loans', label: 'Loans', icon: <CreditCard size={16} /> },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">TBC Global — Loan Management Platform</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 mb-6 w-fit">
          {tabs.map(t => (
            <button key={t.key} onClick={() => handleTabChange(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                tab === t.key ? 'bg-green-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* ===== OVERVIEW TAB ===== */}
        {tab === 'overview' && (
          <>
            {loadingOverview ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="card border border-gray-100 animate-pulse">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl mb-3" />
                    <div className="h-8 bg-gray-100 rounded mb-2 w-16" />
                    <div className="h-4 bg-gray-50 rounded w-24" />
                  </div>
                ))}
              </div>
            ) : stats && (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total Applications', value: stats.total_applications, icon: <FileText size={20} />, color: 'bg-green-50 text-green-700', sub: 'All time' },
                    { label: 'Pending Review', value: stats.pending_applications, icon: <Clock size={20} />, color: 'bg-yellow-50 text-yellow-700', sub: 'Awaiting decision' },
                    { label: 'Approved', value: stats.approved_applications, icon: <CheckCircle size={20} />, color: 'bg-emerald-50 text-emerald-700', sub: 'Total approved' },
                    { label: 'Active Loans', value: stats.active_loans, icon: <TrendingUp size={20} />, color: 'bg-amber-50 text-amber-700', sub: 'Currently active' },
                  ].map(stat => (
                    <div key={stat.label} className="card border border-gray-100">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color} mb-3`}>{stat.icon}</div>
                      <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                      <p className="text-gray-700 text-sm font-medium mt-0.5">{stat.label}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{stat.sub}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-2xl p-5 shadow-md">
                    <p className="text-green-200 text-xs font-medium uppercase tracking-wide mb-1">Total Disbursed</p>
                    <p className="text-3xl font-black">{fmt(stats.total_disbursed)}</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl p-5">
                    <p className="text-amber-100 text-xs font-medium uppercase tracking-wide mb-1">Outstanding Balance</p>
                    <p className="text-3xl font-black">{fmt(stats.total_outstanding)}</p>
                  </div>
                  <div className={`rounded-2xl p-5 text-white ${stats.default_rate > 5 ? 'bg-gradient-to-br from-red-600 to-red-700' : 'bg-gradient-to-br from-green-600 to-green-700'}`}>
                    <p className="text-xs font-medium uppercase tracking-wide mb-1 opacity-80">Default Rate</p>
                    <p className="text-3xl font-black">{stats.default_rate.toFixed(1)}%</p>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ===== APPLICATIONS TAB ===== */}
        {tab === 'applications' && (
          <div className="card border border-gray-100 p-0 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-900">Loan Applications</h2>
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1 flex-wrap">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'submitted', label: 'Pending' },
                  { key: 'under_review', label: 'In Review' },
                  { key: 'approved', label: 'Approved' },
                  { key: 'rejected', label: 'Rejected' },
                ].map(f => (
                  <button key={f.key} onClick={() => setAppFilter(f.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${appFilter === f.key ? 'bg-white shadow text-green-700' : 'text-gray-500 hover:text-gray-700'}`}>
                    {f.label} ({f.key === 'all' ? applications.length : applications.filter(a => a.status === f.key).length})
                  </button>
                ))}
              </div>
            </div>

            {loadingOverview ? (
              <div className="text-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-700 mx-auto" /></div>
            ) : filteredApps.length === 0 ? (
              <div className="text-center py-16"><FileText size={40} className="text-gray-200 mx-auto mb-3" /><p className="text-gray-400">No applications found</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['Application', 'Amount', 'Term', 'Monthly', 'Score', 'Status', 'Submitted', ''].map(h => (
                        <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredApps.map(app => (
                      <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-sm text-gray-900">{app.application_number}</p>
                          <p className="text-xs text-gray-400">ID: {app.id}</p>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">{fmt(app.requested_amount)}</td>
                        <td className="px-6 py-4 text-gray-600 text-sm">{app.loan_term_months}m</td>
                        <td className="px-6 py-4 text-gray-600 text-sm">{app.monthly_payment ? fmt(app.monthly_payment) : '—'}</td>
                        <td className="px-6 py-4">
                          {app.affordability_score != null ? (
                            <div className="flex items-center gap-2">
                              <div className="w-12 bg-gray-200 rounded-full h-1.5">
                                <div className={`h-1.5 rounded-full ${app.affordability_score >= 70 ? 'bg-green-500' : app.affordability_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                  style={{ width: `${app.affordability_score}%` }} />
                              </div>
                              <span className="text-xs font-medium text-gray-600">{app.affordability_score.toFixed(0)}</span>
                            </div>
                          ) : '—'}
                        </td>
                        <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                        <td className="px-6 py-4 text-gray-500 text-sm">{fmtDate(app.submitted_at)}</td>
                        <td className="px-6 py-4">
                          <Link to={`/admin/applications/${app.id}`}
                            className="inline-flex items-center gap-1.5 text-green-700 hover:text-green-800 text-sm font-medium transition-colors">
                            <Eye size={14} /> Review
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ===== CUSTOMERS TAB ===== */}
        {tab === 'customers' && (
          <div className="card border border-gray-100 p-0 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-900">Customers {customers.length > 0 && <span className="text-gray-400 font-normal text-base">({customers.length})</span>}</h2>
              <div className="relative w-full sm:w-72">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email or ID..."
                  className="input pl-9 py-2 text-sm"
                  value={customerSearch}
                  onChange={e => setCustomerSearch(e.target.value)}
                />
              </div>
            </div>

            {loadingCustomers ? (
              <div className="text-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-700 mx-auto" /></div>
            ) : filteredCustomers.length === 0 ? (
              <div className="text-center py-16"><Users size={40} className="text-gray-200 mx-auto mb-3" /><p className="text-gray-400">{customerSearch ? 'No customers match your search' : 'No customers yet'}</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['Customer', 'Phone', 'Province', 'Employer', 'Income', 'Compliance', 'Joined', ''].map(h => (
                        <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCustomers.map(c => <CustomerRow key={c.id} customer={c} />)}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ===== LOANS TAB ===== */}
        {tab === 'loans' && (
          <div className="card border border-gray-100 p-0 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 border-b border-gray-100">
              <h2 className="text-lg font-black text-gray-900">Loans {loans.length > 0 && <span className="text-gray-400 font-normal text-base">({loans.length})</span>}</h2>
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1 flex-wrap">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'pending_disbursement', label: 'Pending' },
                  { key: 'active', label: 'Active' },
                  { key: 'paid_off', label: 'Paid Off' },
                  { key: 'defaulted', label: 'Defaulted' },
                ].map(f => (
                  <button key={f.key} onClick={() => setLoanFilter(f.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${loanFilter === f.key ? 'bg-white shadow text-green-700' : 'text-gray-500 hover:text-gray-700'}`}>
                    {f.label} ({f.key === 'all' ? loans.length : loans.filter(l => l.status === f.key).length})
                  </button>
                ))}
              </div>
            </div>

            {loadingLoans ? (
              <div className="text-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-700 mx-auto" /></div>
            ) : filteredLoans.length === 0 ? (
              <div className="text-center py-16"><CreditCard size={40} className="text-gray-200 mx-auto mb-3" /><p className="text-gray-400">No loans found</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {['Loan', 'Customer', 'Principal', 'Outstanding', 'Monthly', 'Status', 'Next Payment', 'Actions'].map(h => (
                        <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredLoans.map(loan => {
                      const customer = customerMap[loan.customer_id]
                      const customerName = customer?.user.full_name || `Customer #${loan.customer_id}`
                      return (
                        <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-semibold text-sm text-gray-900">{loan.loan_number}</p>
                            <p className="text-xs text-gray-400">ID: {loan.id}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-gray-900">{customerName}</p>
                            <p className="text-xs text-gray-400">{customer?.user.email || ''}</p>
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-900 text-sm">{fmt(loan.principal_amount)}</td>
                          <td className="px-6 py-4">
                            <span className={`font-bold text-sm ${loan.outstanding_balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {fmt(loan.outstanding_balance)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600 text-sm">{fmt(loan.monthly_payment)}</td>
                          <td className="px-6 py-4"><LoanStatusBadge status={loan.status} /></td>
                          <td className="px-6 py-4 text-gray-500 text-sm">{fmtDate(loan.next_payment_date)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              {loan.status === 'pending_disbursement' && (
                                <button onClick={() => handleStatusChange(loan, 'active')}
                                  className="text-xs bg-green-600 hover:bg-green-700 text-white font-semibold px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                                  Disburse
                                </button>
                              )}
                              {(loan.status === 'active' || loan.status === 'pending_disbursement') && (
                                <button onClick={() => setPaymentLoan(loan)}
                                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                                  + Payment
                                </button>
                              )}
                              {loan.status === 'active' && (
                                <button onClick={() => handleStatusChange(loan, 'defaulted')}
                                  className="text-xs bg-red-100 hover:bg-red-200 text-red-700 font-semibold px-2.5 py-1.5 rounded-lg transition-colors whitespace-nowrap">
                                  Default
                                </button>
                              )}
                              <button onClick={() => setHistoryLoan(loan)}
                                className="text-xs text-gray-500 hover:text-gray-700 font-medium px-2 py-1.5 transition-colors whitespace-nowrap">
                                History
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Modals */}
      {paymentLoan && (
        <PaymentModal
          loan={paymentLoan}
          customerName={customerMap[paymentLoan.customer_id]?.user.full_name || `Customer #${paymentLoan.customer_id}`}
          onClose={() => setPaymentLoan(null)}
          onSuccess={updateLoan}
        />
      )}
      {historyLoan && (
        <PaymentHistoryModal
          loan={historyLoan}
          customerName={customerMap[historyLoan.customer_id]?.user.full_name || `Customer #${historyLoan.customer_id}`}
          onClose={() => setHistoryLoan(null)}
        />
      )}
    </div>
  )
}
