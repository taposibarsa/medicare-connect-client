export default function AuthLayout({ children }) {
  return (
    <div className="relative min-h-[calc(100vh-8rem)] overflow-hidden bg-slate-50 dark:bg-[#0f172a]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#5e17eb]/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-violet-400/10 blur-3xl" />
      </div>
      <div className="relative mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl items-center justify-center px-4 py-10 sm:px-6">
        {children}
      </div>
    </div>
  );
}
