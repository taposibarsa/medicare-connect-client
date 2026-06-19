import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center dark:bg-slate-900/80 dark:text-white bg-slate-50 px-6">
      <div className="max-w-lg text-center">
        <h1 className="text-8xl font-extrabold text-[#5e17eb]">404</h1>

        <h2 className="mt-4 text-3xl font-bold text-slate-800 dark:text-white">
          Page Not Found
        </h2>

        <p className="mt-3 text-slate-600 dark:text-slate-300">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or may have
          been moved.
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