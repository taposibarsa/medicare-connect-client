'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@heroui/react';
import { toast } from 'sonner';
import PageHeader from '@/components/dashboard/PageHeader';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import ConfirmDialog from '@/components/dashboard/ConfirmDialog';
import InteractiveStarRating from '@/components/dashboard/InteractiveStarRating';
import StarRating from '@/components/StarRating';
import EmptyState from '@/components/EmptyState';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getMyReviews, getAppointments, createReview, updateReview, deleteReview } from '@/lib/api';
import { getDoctorId } from '@/lib/dashboardUtils';

export default function PatientReviewsPage() {
  useEffect(() => { document.title = 'My Reviews | MediCare Connect'; }, []);

  const { data, isLoading, refetch } = useAsyncData(() => getMyReviews(), []);
  const { data: apptData } = useAsyncData(() => getAppointments(), []);
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [doctorId, setDoctorId] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const reviews = data?.data || [];
  const visitedDoctors = useMemo(() => {
    const map = new Map();
    (apptData?.data || [])
      .filter((a) => a.appointmentStatus === 'completed')
      .forEach((a) => {
        const id = getDoctorId(a);
        if (id && a.doctorId) map.set(id, a.doctorId);
      });
    return Array.from(map.entries()).map(([id, doctor]) => ({ id, doctor }));
  }, [apptData]);

  const handleSubmit = async () => {
    if (!doctorId || !reviewText.trim()) {
      toast.error('Please select a doctor and write a review.');
      return;
    }
    setIsSaving(true);
    try {
      if (editTarget) {
        await updateReview(editTarget._id, { rating, reviewText });
        toast.success('Review updated');
      } else {
        await createReview({ doctorId, rating, reviewText });
        toast.success('Review submitted');
      }
      setShowForm(false);
      setEditTarget(null);
      setDoctorId('');
      setRating(5);
      setReviewText('');
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsSaving(true);
    try {
      await deleteReview(deleteTarget._id);
      toast.success('Review deleted');
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div>
      <PageHeader
        title="My Reviews"
        description="Share feedback for doctors you've visited."
        action={
          <Button className="bg-[#5e17eb] text-white" onPress={() => { setShowForm(true); setEditTarget(null); }}>
            Add review
          </Button>
        }
      />

      {reviews.length === 0 ? (
        <EmptyState title="No reviews yet" message="Complete an appointment to leave your first review." />
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#111827]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">{review.doctorId?.doctorName}</p>
                  <StarRating rating={review.rating} />
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{review.reviewText}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="bordered" onPress={() => { setEditTarget(review); setDoctorId(getDoctorId({ doctorId: review.doctorId }) || ''); setRating(review.rating); setReviewText(review.reviewText); setShowForm(true); }}>
                    Edit
                  </Button>
                  <Button size="sm" className="bg-red-600 text-white" onPress={() => setDeleteTarget(review)}>Delete</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 dark:bg-[#111827]">
            <h3 className="text-lg font-semibold">{editTarget ? 'Edit review' : 'Add review'}</h3>
            <div className="mt-4 space-y-4">
              {!editTarget && (
                <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
                  <option value="">Select doctor</option>
                  {visitedDoctors.map(({ id, doctor }) => (
                    <option key={id} value={id}>{doctor.doctorName}</option>
                  ))}
                </select>
              )}
              <InteractiveStarRating value={rating} onChange={setRating} />
              <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} rows={4} placeholder="Share your experience..." className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onPress={() => { setShowForm(false); setEditTarget(null); }}>Cancel</Button>
              <Button className="bg-[#5e17eb] text-white" isLoading={isSaving} onPress={handleSubmit}>Save</Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog isOpen={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete review?" message="This cannot be undone." confirmLabel="Delete" isLoading={isSaving} />
    </div>
  );
}
