'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadImageFile } from '@/lib/api';

export default function ImageUpload({
  value,
  onChange,
  onFileChange,
  label = 'Profile photo',
  deferUpload = false,
}) {
  const inputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [localPreview, setLocalPreview] = useState('');

  const preview = value || localPreview;

  useEffect(() => {
    return () => {
      if (localPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  const handleFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB.');
      return;
    }

    setError('');

    if (deferUpload) {
      if (localPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(localPreview);
      }

      const objectUrl = URL.createObjectURL(file);
      setLocalPreview(objectUrl);
      onFileChange?.(file);
      onChange?.('');
      return;
    }

    setIsUploading(true);

    try {
      const data = await uploadImageFile(file);
      onChange(data.url);
      onFileChange?.(null);
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    if (localPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(localPreview);
    }

    setLocalPreview('');
    onChange?.('');
    onFileChange?.(null);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}{' '}
        <span className="font-normal text-slate-400">(optional)</span>
      </label>

      <div className="flex items-center gap-4">
        {preview ? (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-slate-200 dark:border-slate-700">
            <Image src={preview} alt="Profile preview" fill className="object-cover" unoptimized />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow"
              aria-label="Remove photo"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-dashed border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800/50">
            <Upload size={20} className="text-slate-400" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Uploading...
              </span>
            ) : (
              preview ? 'Change photo' : 'Upload photo'
            )}
          </button>
          <p className="mt-1 text-xs text-slate-400">
            {deferUpload
              ? 'Photo will be saved when you create your account.'
              : 'JPG, PNG or WebP. Max 5 MB.'}
          </p>
        </div>
      </div>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
