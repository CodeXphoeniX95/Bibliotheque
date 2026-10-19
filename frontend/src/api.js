import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
})

export const livresAPI = {
  getAll: (params) => api.get('/livres', { params }),
  getOne: (id) => api.get(`/livres/${id}`),
  create: (data) => api.post('/livres', data),
  update: (id, data) => api.put(`/livres/${id}`, data),
  delete: (id) => api.delete(`/livres/${id}`)
}

export const empruntsAPI = {
  getAll: () => api.get('/emprunts'),
  create: (data) => api.post('/emprunts', data),
  retourner: (id) => api.put(`/emprunts/${id}/retour`)
}

export const statsAPI = {
  get: () => api.get('/stats')
}

export default api
