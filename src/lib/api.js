const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

let cachedToken = null;
let tokenExpiry = 0;

export async function getToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

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

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

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

  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

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

export async function apiFetchAuthenticated(path, options = {}) {
  const token = await getToken();

  if (!token) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  return apiFetch(path, { ...options, token });
}

export async function getMe() {
  return apiFetchAuthenticated('/api/users/me');
}

export async function updateMe(body) {
  return apiFetchAuthenticated('/api/users/me', { method: 'PUT', body });
}

export async function createDoctorProfile(body) {
  return apiFetchAuthenticated('/api/doctors', { method: 'POST', body });
}

export async function getReviews({ doctorId, limit } = {}) {
  const params = new URLSearchParams();
  if (doctorId) params.set('doctorId', doctorId);
  const query = params.toString();
  const result = await apiFetch(`/api/reviews${query ? `?${query}` : ''}`);

  if (limit && result?.data) {
    return { ...result, data: result.data.slice(0, limit) };
  }

  return result;
}
