const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

let cachedToken = null;
let tokenExpiry = 0;

export async function getToken() {
  if (typeof window === 'undefined') return null;
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  const res = await fetch('/api/express-token', { credentials: 'include' });
  if (!res.ok) {
    cachedToken = null;
    tokenExpiry = 0;
    return null;
  }
  const data = await res.json();
  cachedToken = data.token;
  tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;
  return cachedToken;
}

export function clearTokenCache() {
  cachedToken = null;
  tokenExpiry = 0;
}

export async function apiFetch(path, { method = 'GET', body, token, cache = 'no-store' } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache,
  });

  if (res.status === 401 && typeof window !== 'undefined') {
    window.location.href = '/login';
    return null;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export async function apiFetchAuthenticated(path, options = {}) {
  const token = await getToken();
  if (!token) {
    if (typeof window !== 'undefined') window.location.href = '/login';
    return null;
  }
  return apiFetch(path, { ...options, token });
}

// Public
export async function getFeaturedDoctors(limit = 6) {
  return apiFetch(`/api/doctors/featured?limit=${limit}`);
}

export async function getDoctors({ search, sort, page = 1, limit = 9 } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (sort) params.set('sort', sort);
  params.set('page', String(page));
  params.set('limit', String(limit));
  return apiFetch(`/api/doctors?${params.toString()}`);
}

export async function getDoctorById(id) {
  return apiFetch(`/api/doctors/${id}`);
}

export async function getStats() {
  return apiFetch('/api/stats');
}

export async function getReviews({ doctorId, limit } = {}) {
  const params = new URLSearchParams();
  if (doctorId) params.set('doctorId', doctorId);
  const query = params.toString();
  const result = await apiFetch(`/api/reviews${query ? `?${query}` : ''}`);
  if (limit && result?.data) return { ...result, data: result.data.slice(0, limit) };
  return result;
}

// Users
export async function getMe() {
  return apiFetchAuthenticated('/api/users/me');
}

export async function updateMe(body) {
  return apiFetchAuthenticated('/api/users/me', { method: 'PUT', body });
}

export async function uploadImageFile(file) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch('/api/upload-image', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Upload failed');
  }

  return data;
}

export async function createDoctorProfile(body) {
  return apiFetchAuthenticated('/api/doctors', { method: 'POST', body });
}

// Appointments
export async function getAppointments() {
  return apiFetchAuthenticated('/api/appointments');
}

export async function getAppointmentById(id) {
  return apiFetchAuthenticated(`/api/appointments/${id}`);
}

export async function rescheduleAppointment(id, body) {
  return apiFetchAuthenticated(`/api/appointments/${id}/reschedule`, { method: 'PATCH', body });
}

export async function cancelAppointment(id) {
  return apiFetchAuthenticated(`/api/appointments/${id}/cancel`, { method: 'PATCH' });
}

export async function acceptAppointment(id) {
  return apiFetchAuthenticated(`/api/appointments/${id}/accept`, { method: 'PATCH' });
}

export async function rejectAppointment(id) {
  return apiFetchAuthenticated(`/api/appointments/${id}/reject`, { method: 'PATCH' });
}

export async function completeAppointment(id) {
  return apiFetchAuthenticated(`/api/appointments/${id}/complete`, { method: 'PATCH' });
}

// Reviews
export async function getMyReviews() {
  return apiFetchAuthenticated('/api/reviews/my');
}

export async function createReview(body) {
  return apiFetchAuthenticated('/api/reviews', { method: 'POST', body });
}

export async function updateReview(id, body) {
  return apiFetchAuthenticated(`/api/reviews/${id}`, { method: 'PUT', body });
}

export async function deleteReview(id) {
  return apiFetchAuthenticated(`/api/reviews/${id}`, { method: 'DELETE' });
}

// Prescriptions
export async function getPrescriptions() {
  return apiFetchAuthenticated('/api/prescriptions');
}

export async function createPrescription(body) {
  return apiFetchAuthenticated('/api/prescriptions', { method: 'POST', body });
}

export async function updatePrescription(id, body) {
  return apiFetchAuthenticated(`/api/prescriptions/${id}`, { method: 'PUT', body });
}

// Doctors (authenticated)
export async function getMyDoctorProfile() {
  return apiFetchAuthenticated('/api/doctors/me');
}

export async function updateDoctor(id, body) {
  return apiFetchAuthenticated(`/api/doctors/${id}`, { method: 'PUT', body });
}

export async function getAdminDoctors(status) {
  const query = status ? `?status=${status}` : '';
  return apiFetchAuthenticated(`/api/doctors/admin${query}`);
}

export async function verifyDoctor(id) {
  return apiFetchAuthenticated(`/api/doctors/${id}/verify`, { method: 'PATCH' });
}

export async function rejectDoctor(id) {
  return apiFetchAuthenticated(`/api/doctors/${id}/reject`, { method: 'PATCH' });
}

export async function revokeDoctor(id) {
  return apiFetchAuthenticated(`/api/doctors/${id}/verify`, { method: 'DELETE' });
}

// Admin users
export async function getUsers() {
  return apiFetchAuthenticated('/api/users');
}

export async function suspendUser(id) {
  return apiFetchAuthenticated(`/api/users/${id}/suspend`, { method: 'PATCH' });
}

export async function deleteUser(id) {
  return apiFetchAuthenticated(`/api/users/${id}`, { method: 'DELETE' });
}

// Admin analytics
export async function getAdminAnalytics() {
  return apiFetchAuthenticated('/api/admin/analytics');
}

// Payments
export async function getPayments() {
  return apiFetchAuthenticated('/api/payments');
}

export async function createCheckoutSession(body) {
  return apiFetchAuthenticated('/api/payments/checkout', { method: 'POST', body });
}

export async function confirmCheckoutSession(sessionId) {
  return apiFetchAuthenticated('/api/payments/confirm-session', {
    method: 'POST',
    body: { sessionId },
  });
}
