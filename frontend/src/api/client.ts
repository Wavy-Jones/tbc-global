import axios from 'axios'

const BASE_URL = (import.meta.env.VITE_API_URL ?? '') + '/api/v1'

// Create axios instance
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 - redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ============ AUTH ============
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (data: { email: string; password: string; full_name: string; phone_number: string }) =>
    api.post('/auth/register', data),

  me: () => api.get('/auth/me'),
}

// ============ CUSTOMERS ============
export const customerApi = {
  createProfile: (data: object) => api.post('/customers/profile', data),
  getProfile: () => api.get('/customers/profile'),
  updateProfile: (data: object) => api.put('/customers/profile', data),
  listAll: () => api.get('/customers/'),
  getById: (id: number) => api.get(`/customers/${id}`),
}

// ============ APPLICATIONS ============
export const applicationApi = {
  checkAffordability: (data: { requested_amount: number; loan_term_months: number; purpose?: string }) =>
    api.post('/applications/calculate-affordability', data),

  submit: (data: { requested_amount: number; loan_term_months: number; purpose?: string }) =>
    api.post('/applications/', data),

  myApplications: () => api.get('/applications/my-applications'),

  getById: (id: number) => api.get(`/applications/${id}`),

  listAll: (status?: string) =>
    api.get('/applications/', { params: status ? { status_filter: status } : {} }),

  review: (id: number, data: { approved: boolean; approved_amount?: number; rejection_reason?: string }) =>
    api.post(`/applications/${id}/review`, data),

  updateStatus: (id: number, status: string) =>
    api.put(`/applications/${id}/status`, null, { params: { new_status: status } }),
}

// ============ LOANS ============
export const loanApi = {
  myLoans: () => api.get('/loans/my-loans'),
  getById: (id: number) => api.get(`/loans/${id}`),
  listAll: (status?: string) =>
    api.get('/loans/', { params: status ? { status_filter: status } : {} }),
  recordPayment: (id: number, data: { amount: number; payment_method: string }) =>
    api.post(`/loans/${id}/payment`, data),
  updateStatus: (id: number, newStatus: string) =>
    api.put(`/loans/${id}/status`, null, { params: { new_status: newStatus } }),
  getPayments: (id: number) => api.get(`/loans/${id}/payments`),
}

// ============ DASHBOARD ============
export const dashboardApi = {
  stats: () => api.get('/dashboard/stats'),
}
