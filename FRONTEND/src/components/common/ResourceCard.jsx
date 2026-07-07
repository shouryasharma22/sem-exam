function ResourceCard({ resource }) {
  const {
    title = 'Untitled resource',
    subjectCode = 'N/A',
    resourceType = 'Resource',
    examType = '',
    year = '',
    semester = '',
    fileUrl = '#',
    tags = [],
  } = resource || {};

  const normalizedSubject = String(subjectCode).toUpperCase();
  const isExamPaper = String(resourceType).toLowerCase() === 'exam paper';

  const typeLabel = isExamPaper
    ? `${examType || 'Exam'} ${year ? String(year) : ''}`.trim()
    : resourceType;

  const typeBadgeClass = isExamPaper
    ? 'bg-amber-100 text-amber-700'
    : 'bg-slate-100 text-slate-700';

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">{resourceType}</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">{title}</h2>
        </div>
        <span className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-mono uppercase tracking-[0.2em] text-slate-600">
          {normalizedSubject}
        </span>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${typeBadgeClass}`}>
          {typeLabel}
        </span>
        {semester && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
            Sem {semester}
          </span>
        )}
        {year && !isExamPaper && (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
            {year}
          </span>
        )}
      </div>

      <p className="mb-5 text-sm leading-6 text-slate-600">
        A polished resource card built for fast student browsing and secure downloads.
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        {Array.isArray(tags) && tags.length > 0 ? (
          tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
            >
              #{String(tag).trim()}
            </span>
          ))
        ) : (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
            No tags available
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Resource link</p>
          <p className="text-sm text-slate-500">Secure Cloudinary PDF</p>
        </div>
        <a
          href={fileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Open file
        </a>
      </div>
    </article>
  );
}

export default ResourceCard;
