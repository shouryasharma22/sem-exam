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

  // 🎨 Dark mode custom badges matching the theme palette
  const typeBadgeClass = isExamPaper
    ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
    : 'bg-blue-500/10 border border-blue-500/20 text-blue-400';

  const getViewablePdfUrl = (originalUrl) => {
  if (!originalUrl) return '#';
  if (!originalUrl.includes('cloudinary.com')) return originalUrl;

  // 1. Strip out any forced download flags
  let cleanUrl = originalUrl.replace('/upload/fl_attachment/', '/upload/');
  
  // 2. Add the clean inline rendering instructions for your new /image/upload files
  if (cleanUrl.includes('/upload/') && !cleanUrl.includes('fl_inline')) {
    cleanUrl = cleanUrl.replace('/upload/', '/upload/fl_inline,f_auto/');
  }

  return cleanUrl;
};
  
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#434655]/40 bg-[#0F1422] p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#b4c5ff]/40 hover:shadow-2xl flex flex-col justify-between">
      <div>
        {/* Card Header Track */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#8d90a0]">{resourceType}</p>
            <h2 className="mt-2 text-xl font-bold text-white tracking-tight leading-snug group-hover:text-[#b4c5ff] transition-colors">{title}</h2>
          </div>
          <span className="shrink-0 rounded bg-[#151b2d] border border-[#434655] px-2.5 py-1 mountaineer-badge text-xs font-mono uppercase tracking-widest text-[#c3c6d7]">
            {normalizedSubject}
          </span>
        </div>

        {/* Descriptor Tags Meta Grid */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className={`rounded px-2.5 py-0.5 text-xs font-mono uppercase tracking-wider ${typeBadgeClass}`}>
            {typeLabel}
          </span>
          {semester && (
            <span className="rounded bg-[#151b2d] border border-[#434655]/60 px-2.5 py-0.5 text-xs font-mono text-[#c3c6d7]">
              SEM {semester}
            </span>
          )}
          {year && !isExamPaper && (
            <span className="rounded bg-[#151b2d] border border-[#434655]/60 px-2.5 py-0.5 text-xs font-mono text-[#c3c6d7]">
              {year}
            </span>
          )}
        </div>

        {/* Filter Keyword Tag Collections */}
        <div className="mb-6 flex flex-wrap gap-1.5">
          {Array.isArray(tags) && tags.length > 0 ? (
            tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-mono text-[#8d90a0] hover:text-[#b4c5ff] transition-colors"
              >
                #{String(tag).trim()}
              </span>
            ))
          ) : (
            <span className="text-[11px] font-mono text-slate-600 italic">
              #no_tags
            </span>
          )}
        </div>
      </div>

      {/* Footer Interface Component Anchor Links */}
      <div className="mt-4 pt-4 border-t border-[#434655]/30 flex items-center justify-between gap-3">
        <div>
          <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#8d90a0]">Payload Source</p>
          <p className="text-xs text-[#c3c6d7] font-mono">Secure CDN Node</p>
        </div>
        
        {/* 🌟 FIXED: Passing fileUrl directly through the filter handler stream */}
        <a
          href={getViewablePdfUrl(fileUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-xl bg-[#151b2d] border border-[#434655] px-4 py-2.5 text-xs font-mono text-slate-300 transition-all duration-200 hover:border-[#b4c5ff] hover:text-[#b4c5ff] focus:outline-none focus:ring-1 focus:ring-[#b4c5ff]"
        >
          View
        </a>
      </div>
    </article>
  );
}

export default ResourceCard;