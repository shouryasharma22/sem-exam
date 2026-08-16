import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';

function ResourceCard({ resource, isAdmin = false, onDelete }) {
  const {
    _id,
    title = 'Untitled resource',
    subjectCode = 'N/A',
    resourceType = 'Resource',
    examType = '',
    year = '',
    semester = '',
    fileUrl = '#',
    tags = [],
  } = resource || {};

  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const normalizedSubject = String(subjectCode).toUpperCase();
  const isExamPaper = String(resourceType).toLowerCase() === 'exam paper';

  const typeLabel = isExamPaper
    ? `${examType || 'Exam'} `.trim()
    : resourceType;

  const typeBadgeClass = isExamPaper
    ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
    : 'bg-blue-500/10 border border-blue-500/20 text-blue-400';

  const getViewablePdfUrl = (originalUrl) => {
    if (!originalUrl) return '#';
    if (!originalUrl.includes('cloudinary.com')) return originalUrl;
    return originalUrl.replace('/upload/fl_attachment/', '/upload/').replace('/upload/fl_attachment,', '/upload/');
  };

  const handleDeleteClick = () => {
    setDeleteError('');
    setConfirming(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      await onDelete(_id);
    } catch (err) {
      setDeleteError(err.message || 'Delete failed');
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#434655]/40 bg-[#0F1422] p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#b4c5ff]/40 hover:shadow-2xl flex flex-col justify-between">
      <div>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#8d90a0]">{resourceType}</p>
            <h2 className="mt-2 text-xl font-bold text-white tracking-tight leading-snug group-hover:text-[#b4c5ff] transition-colors">{title}</h2>
          </div>
          <span className="shrink-0 rounded bg-[#151b2d] border border-[#434655] px-2.5 py-1 text-xs font-mono uppercase tracking-widest text-[#c3c6d7]">
            {normalizedSubject}
          </span>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className={`rounded px-2.5 py-0.5 text-xs font-mono uppercase tracking-wider ${typeBadgeClass}`}>
            {typeLabel}
          </span>
          {semester && (
            <span className="rounded bg-[#151b2d] border border-[#434655]/60 px-2.5 py-0.5 text-xs font-mono text-[#c3c6d7]">
              SEM {semester}
            </span>
          )}
          {year && (
            <span className="rounded bg-[#151b2d] border border-[#434655]/60 px-2.5 py-0.5 text-xs font-mono text-[#c3c6d7]">
              {year}
            </span>
          )}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-[#434655]/30">
        {/* 🟩 Added w-full to make the container stretch and changed gap spacing */}
        <div className="flex items-center justify-between gap-3 w-full">

          {/* 🟩 Added flex-1 and w-full here to allow children to fill the entire horizontal space */}
          <div className="flex items-center gap-2 w-full flex-1">
            {isAdmin && (
              <button
                type="button"
                onClick={handleDeleteClick}
                disabled={deleting}
                aria-label={`Delete ${title}`}
                className="inline-flex items-center justify-center rounded-xl bg-[#151b2d] border border-[#434655] p-2.5 text-red-400/70 transition-all duration-200 hover:border-red-500/50 hover:text-red-400 focus:outline-none focus:ring-1 focus:ring-red-500/50 disabled:opacity-50 shrink-0"
              >
                <Trash2 size={14} />
              </button>
            )}
            
            {/* 🟩 Added w-full and justify-center to stretch the View button */}
            <a href={resource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full rounded-xl bg-[#151b2d] border border-[#434655] px-4 py-2.5 text-xs font-mono text-slate-300 transition-all duration-200 hover:border-[#b4c5ff] hover:text-[#b4c5ff] focus:outline-none focus:ring-1 focus:ring-[#b4c5ff]"
            >
              View
            </a>
          </div>
        </div>

        {confirming && (
          <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/5 p-3">
            <p className="text-xs font-mono text-red-300">Delete this resource permanently?</p>
            {deleteError && (
              <p className="mt-1 text-[11px] font-mono text-red-400">{deleteError}</p>
            )}
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-1.5 text-xs font-mono text-red-300 hover:bg-red-500/20 disabled:opacity-50 flex-1"
              >
                {deleting && <Loader2 size={12} className="animate-spin" />}
                {deleting ? 'Deleting…' : 'Confirm delete'}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={deleting}
                className="rounded-lg border border-[#434655] px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 disabled:opacity-50 flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default ResourceCard;