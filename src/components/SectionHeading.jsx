export default function SectionHeading({ title, subtitle, align = 'center', light = false }) {
  const alignClass =
    align === 'left' ? 'text-left' : align === 'right' ? 'text-right' : 'text-center';

  const titleClass = light ? 'text-white' : 'text-slate-800 dark:text-white';
  const subtitleClass = light
    ? 'text-violet-100'
    : 'text-slate-600 dark:text-slate-400';

  return (
    <div className={`mb-10 ${alignClass}`}>
      <h2 className={`text-3xl font-bold sm:text-4xl ${titleClass}`}>{title}</h2>
      {subtitle && (
        <p className={`mt-3 max-w-2xl ${subtitleClass} ${align === 'center' ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
