export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateStr, timeStr) {
  const date = formatDate(dateStr);
  return timeStr ? `${date} at ${timeStr}` : date;
}

export function isUpcoming(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const appt = new Date(dateStr);
  appt.setHours(0, 0, 0, 0);
  return appt >= today;
}

export function isToday(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const today = new Date();
  return (
    d.getUTCFullYear() === today.getUTCFullYear() &&
    d.getUTCMonth() === today.getUTCMonth() &&
    d.getUTCDate() === today.getUTCDate()
  );
}

export function getDoctorId(appointment) {
  const doc = appointment?.doctorId;
  if (!doc) return null;
  return typeof doc === 'object' ? doc._id : doc;
}

export function getPatientId(appointment) {
  const patient = appointment?.patientId;
  if (!patient) return null;
  return typeof patient === 'object' ? patient._id : patient;
}
