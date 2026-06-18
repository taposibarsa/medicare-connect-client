export default function NotFound() {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6">
        <div className="max-w-lg text-center">
          <h1 className="text-8xl font-extrabold text-[#5e17eb]">404</h1>
  
          <h2 className="mt-4 text-3xl font-bold text-slate-800">
            Page Not Found
          </h2>
  
          <p className="mt-3 text-slate-600">
            Sorry, the page you’re looking for doesn’t exist or may have been
            moved.
          </p>
  
          <a
            href="/"
            className="mt-8 inline-flex items-center rounded-lg bg-[#5e17eb] px-6 py-3 text-white font-medium transition hover:opacity-90"
          >
            Back to Home
          </a>
        </div>
      </main>
    );
  }