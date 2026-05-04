import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dashboardApi, applicationApi } from '../../api/client'
import { DashboardStats, LoanApplication } from '../../types'
import { FileText, CheckCircle, Clock, TrendingUp, Eye } from 'lucide-react'

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
  return <span className={`${map[status] || 'badge-pending'}`}>{labels[status] || status}</span>
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [applications, setApplications] = useState<LoanApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    Promise.all([
      dashboardApi.stats().catch(() => ({ data: null })),
      applicationApi.listAll().catch(() => ({ data: [] })),
    ]).then(([statsRes, appsRes]) => {
      setStats(statsRes.data)
      setApplications(appsRes.data)
    }).finally(() => setLoading(false))
  }, [])

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0 }).format(v)

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter)
  const pendingCount = applications.filter(a => ['submitted', 'under_review'].includes(a.status)).length

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Manage loan applications and monitor platform performance
            {pendingCount > 0 && (
              <span className="ml-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingCount} need review</span>
            )}
          </p>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="card border border-gray-100 animate-pulse">
                <div className="w-10 h-10 bg-gray-100 rounded-xl mb-3" />
                <div className="h-8 bg-gray-100 rounded mb-2 w-16" />
                <div className="h-4 bg-gray-50 rounded w-24" />
              </div>
            ))}
          </div>
        ) : stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
        )}

        {/* Financial Summary */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-2xl p-5 shadow-md">
              <p className="text-green-200 text-xs font-medium uppercase tracking-wide mb-1">Total Disbursed</p>
              <p className="text-3xl font-black">{formatCurrency(stats.total_disbursed)}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl p-5">
              <p className="text-amber-100 text-xs font-medium uppercase tracking-wide mb-1">Outstanding Balance</p>
              <p className="text-3xl font-black">{formatCurrency(stats.total_outstanding)}</p>
            </div>
            <div className={`rounded-2xl p-5 text-white ${stats.default_rate > 5 ? 'bg-gradient-to-br from-red-600 to-red-700' : 'bg-gradient-to-br from-green-600 to-green-700'}`}>
              <p className="text-xs font-medium uppercase tracking-wide mb-1 opacity-80">Default Rate</p>
              <p className="text-3xl font-black">{stats.default_rate.toFixed(1)}%</p>
            </div>
          </div>
        )}

        {/* Applications Table */}
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
                <button key={f.key} onClick={() => setFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f.key ? 'bg-white shadow text-green-700' : 'text-gray-500 hover:text-gray-700'}`}>
                  {f.label} ({f.key === 'all' ? applications.length : applications.filter(a => a.status === f.key).length})
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-700 mx-auto" />
              <p className="text-gray-400 mt-4">Loading applications...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <FileText size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400">No applications found</p>
            </div>
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
                  {filtered.map(app => (
                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-sm text-gray-900">{app.application_number}</p>
                        <p className="text-xs text-gray-400">ID: {app.id}</p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(app.requested_amount)}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{app.loan_term_months}m</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{app.monthly_payment ? formatCurrency(app.monthly_payment) : '—'}</td>
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
                      <td className="px-6 py-4 text-gray-500 text-sm">{formatDate(app.submitted_at)}</td>
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
      </div>
    </div>
  )
}
