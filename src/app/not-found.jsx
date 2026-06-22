import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6 dark:bg-[#0f172a]">
      <div className="max-w-lg text-center">
        <Image
          src="/404.svg"
          alt="Page not found illustration"
          width={320}
          height={240}
          className="mx-auto mb-6"
          priority
        />

        <h1 className="text-6xl font-extrabold text-[#5e17eb]">404</h1>

        <h2 className="mt-4 text-3xl font-bold text-slate-800 dark:text-white">Page Not Found</h2>

        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center rounded-lg bg-[#5e17eb] px-6 py-3 font-medium text-white transition hover:opacity-90"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
