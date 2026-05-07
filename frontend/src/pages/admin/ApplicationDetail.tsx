import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { applicationApi } from '../../api/client'
import { LoanApplication } from '../../types'
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react'

export function ApplicationDetail() {
  const { id } = useParams<{ id: string }>()

  const [application, setApplication] = useState<LoanApplication | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showDecision, setShowDecision] = useState(false)
  const [decision, setDecision] = useState<'approve' | 'reject' | null>(null)
  const [approvedAmount, setApprovedAmount] = useState(0)
  const [rejectionReason, setRejectionReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [decisionError, setDecisionError] = useState('')

  useEffect(() => {
    if (!id) return
    applicationApi.getById(Number(id))
      .then(res => {
        setApplication(res.data)
        setApprovedAmount(res.data.requested_amount)
      })
      .catch(() => setError('Application not found'))
      .finally(() => setLoading(false))
  }, [id])

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(v)

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleString('en-ZA') : '—'

  const submitDecision = async () => {
    if (!application) return
    setSubmitting(true)
    setDecisionError('')
    try {
      const data = decision === 'approve'
        ? { approved: true, approved_amount: approvedAmount }
        : { approved: false, rejection_reason: rejectionReason || 'Application does not meet lending criteria.' }
      const res = await applicationApi.review(application.id, data)
      setApplication(res.data)
      setShowDecision(false)
    } catch (err: any) {
      setDecisionError(err.response?.data?.detail || 'Failed to submit decision. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const setUnderReview = async () => {
    if (!application) return
    try {
      const res = await applicationApi.updateStatus(application.id, 'under_review')
      setApplication(res.data)
    } catch {}
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700" />
    </div>
  )

  if (error || !application) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-500 mb-4">{error || 'Application not found'}</p>
        <Link to="/admin" className="btn-primary">Back to Dashboard</Link>
      </div>
    </div>
  )

  const canReview = ['submitted', 'under_review'].includes(application.status)

  const StatusBar = () => {
    const configs: Record<string, { color: string; icon: JSX.Element; label: string }> = {
      submitted:    { color: 'bg-yellow-50 border-yellow-200 text-yellow-800', icon: <Clock size={18} />,       label: 'Awaiting Review' },
      under_review: { color: 'bg-green-50 border-green-300 text-green-800',    icon: <Clock size={18} />,       label: 'Under Review'   },
      approved:     { color: 'bg-green-50 border-green-300 text-green-800',    icon: <CheckCircle size={18} />, label: 'Approved'       },
      rejected:     { color: 'bg-red-50 border-red-200 text-red-800',          icon: <XCircle size={18} />,     label: 'Rejected'       },
    }
    const cfg = configs[application.status] || configs.submitted
    return (
      <div className={`flex items-center gap-2 border rounded-xl px-4 py-3 font-semibold ${cfg.color}`}>
        {cfg.icon} {cfg.label}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <Link to="/admin" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">{application.application_number}</h1>
            <p className="text-gray-400 text-sm mt-0.5">Submitted {formatDate(application.submitted_at)}</p>
          </div>
          <StatusBar />
        </div>

        {/* Action buttons */}
        {canReview && (
          <div className="flex gap-3 mb-6">
            {application.status === 'submitted' && (
              <button onClick={setUnderReview}
                className="btn-secondary text-sm flex items-center gap-2">
                <Clock size={16} /> Mark Under Review
              </button>
            )}
            <button
              onClick={() => { setDecision('approve'); setShowDecision(true) }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
              <CheckCircle size={18} /> Approve
            </button>
            <button
              onClick={() => { setDecision('reject'); setShowDecision(true) }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
              <XCircle size={18} /> Reject
            </button>
          </div>
        )}

        {/* Decision Result Banners */}
        {application.status === 'approved' && application.approved_amount && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6">
            <p className="font-bold text-green-800 mb-2 flex items-center gap-2">
              <CheckCircle size={18} /> Loan Approved
            </p>
            <p className="text-green-700 text-sm">
              Approved Amount: <span className="font-bold text-lg">{formatCurrency(application.approved_amount)}</span>
            </p>
          </div>
        )}
        {application.status === 'rejected' && application.rejection_reason && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6">
            <p className="font-bold text-red-800 mb-2 flex items-center gap-2">
              <XCircle size={18} /> Application Rejected
            </p>
            <p className="text-red-700 text-sm">Reason: {application.rejection_reason}</p>
          </div>
        )}

        {/* Cards */}
        <div className="space-y-4">

          {/* Loan Details */}
          <div className="card border border-gray-200 shadow-sm">
            <h2 className="font-black text-gray-900 mb-4 text-lg">Loan Details</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Requested Amount', value: formatCurrency(application.requested_amount) },
                { label: 'Loan Term',         value: `${application.loan_term_months} months` },
                { label: 'Purpose',           value: application.purpose || 'Not specified' },
                { label: 'Interest Rate',     value: application.interest_rate ? `${(application.interest_rate * 100).toFixed(0)}% p.a.` : '15% p.a.' },
              ].map(row => (
                <div key={row.label} className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-500 text-xs mb-1">{row.label}</p>
                  <p className="font-bold text-gray-900">{row.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Affordability */}
          {application.affordability_score != null && (
            <div className="card border border-gray-200 shadow-sm">
              <h2 className="font-black text-gray-900 mb-4 text-lg">Affordability Assessment</h2>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-500">Affordability Score</span>
                  <span className={`font-bold ${application.affordability_score >= 70 ? 'text-green-600' : application.affordability_score >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {application.affordability_score.toFixed(0)} / 100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className={`h-3 rounded-full transition-all ${application.affordability_score >= 70 ? 'bg-green-500' : application.affordability_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${application.affordability_score}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Monthly Payment', value: application.monthly_payment ? formatCurrency(application.monthly_payment) : '—' },
                  { label: 'Total Repayment', value: application.total_repayment ? formatCurrency(application.total_repayment) : '—' },
                  { label: 'Total Interest',  value: application.total_repayment && application.requested_amount ? formatCurrency(application.total_repayment - application.requested_amount) : '—' },
                ].map(row => (
                  <div key={row.label} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-gray-400 text-xs mb-1">{row.label}</p>
                    <p className="font-bold text-gray-900 text-sm">{row.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="card border border-gray-200 shadow-sm">
            <h2 className="font-black text-gray-900 mb-4 text-lg">Timeline</h2>
            <div className="space-y-3">
              {[
                { label: 'Application Created',  date: application.created_at,   done: true },
                { label: 'Application Submitted', date: application.submitted_at, done: !!application.submitted_at },
                { label: 'Decision Made',         date: application.updated_at,   done: ['approved', 'rejected'].includes(application.status) },
              ].map(event => (
                <div key={event.label} className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${event.done ? 'bg-green-700' : 'bg-gray-200'}`}>
                    <div className={`w-2 h-2 rounded-full ${event.done ? 'bg-white' : 'bg-gray-400'}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${event.done ? 'text-gray-900' : 'text-gray-400'}`}>{event.label}</p>
                    <p className="text-xs text-gray-400">{event.done ? formatDate(event.date) : 'Pending'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ===== DECISION MODAL ===== */}
        {showDecision && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
              <div className={`flex items-center gap-3 mb-5 ${decision === 'approve' ? 'text-green-700' : 'text-red-700'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${decision === 'approve' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {decision === 'approve' ? <CheckCircle size={22} /> : <XCircle size={22} />}
                </div>
                <h2 className="text-xl font-black">
                  {decision === 'approve' ? 'Approve Application' : 'Reject Application'}
                </h2>
              </div>

              {decisionError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
                  <AlertCircle size={16} className="shrink-0" /> {decisionError}
                </div>
              )}

              {decision === 'approve' ? (
                <div className="mb-5">
                  <label className="label">Approved Amount (R)</label>
                  <input type="number" className="input" min={100} max={5000}
                    value={approvedAmount}
                    onChange={e => setApprovedAmount(Number(e.target.value))} />
                  <p className="text-xs text-gray-400 mt-1">
                    Requested: {formatCurrency(application.requested_amount)}. Can approve less if needed.
                  </p>
                </div>
              ) : (
                <div className="mb-5">
                  <label className="label">Rejection Reason</label>
                  <textarea className="input min-h-[100px] resize-none"
                    placeholder="e.g. Income does not meet minimum requirements..."
                    value={rejectionReason}
                    onChange={e => setRejectionReason(e.target.value)} />
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => { setShowDecision(false); setDecisionError('') }}
                  className="btn-secondary flex-1" disabled={submitting}>
                  Cancel
                </button>
                <button onClick={submitDecision} disabled={submitting}
                  className={`flex-1 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50 ${decision === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                  {submitting ? 'Processing...' : decision === 'approve' ? '✅ Confirm Approval' : '❌ Confirm Rejection'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
