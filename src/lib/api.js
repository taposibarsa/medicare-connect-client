const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function getToken() {
  // Phase 4: wire to Better Auth JWT token endpoint
  return null;
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
