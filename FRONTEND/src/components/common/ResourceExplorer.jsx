import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { fetchResources } from '../../api/resourceApi';
import ResourceCard from './ResourceCard';
import useDebounce from '../../hooks/useDebounce';
import { departments, examTypes, getRecentYears } from '../../constants/academic';

const years = getRecentYears(8);

function ResourceExplorer({ resourceType, pageTitle, pageDescription }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [year, setYear] = useState('');
  const [examType, setExamType] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const debouncedSearch = useDebounce(searchQuery, 300);
  const debouncedSubjectCode = useDebounce(subjectCode, 300);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchResources({
          resourceType,
          search: debouncedSearch,
          department,
          subjectCode: debouncedSubjectCode,
          year,
          examType,
        });
        if (!cancelled) setResources(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [resourceType, debouncedSearch, department, debouncedSubjectCode, year, examType]);

  const activeFilterCount = [department, subjectCode, year, examType].filter(Boolean).length;

  const clearFilters = () => {
    setDepartment('');
    setSubjectCode('');
    setYear('');
    setExamType('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">{pageTitle}</h1>
        <p className="mt-2 text-sm text-[#8d90a0]">{pageDescription}</p>
      </div>

      {/* Search + filter toggle */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8d90a0]" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or course code…"
            className="w-full rounded-2xl border border-[#434655] bg-[#0F1422] py-3 pl-11 pr-4 text-sm text-slate-200 placeholder:text-[#8d90a0] outline-none focus:border-[#b4c5ff]/50 focus:ring-1 focus:ring-[#b4c5ff]/30"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#434655] bg-[#0F1422] px-5 py-3 text-sm font-medium text-slate-300 transition-colors hover:border-[#b4c5ff]/40 hover:text-[#b4c5ff]"
        >
          <SlidersHorizontal size={15} />
          Filters
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-[#b4c5ff]/20 px-2 py-0.5 text-xs text-[#b4c5ff]">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-[#434655]/60 bg-[#0F1422] p-5 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8d90a0]">Subject Code</span>
            <input
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              placeholder="e.g. CS201"
              className="mt-2 w-full rounded-xl border border-[#434655] bg-[#151b2d] px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-[#b4c5ff]/50"
            />
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8d90a0]">Department</span>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[#434655] bg-[#151b2d] px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-[#b4c5ff]/50"
            >
              <option value="">All departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8d90a0]">Year</span>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[#434655] bg-[#151b2d] px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-[#b4c5ff]/50"
            >
              <option value="">All years</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8d90a0]">Exam Type</span>
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="mt-2 w-full rounded-xl border border-[#434655] bg-[#151b2d] px-3 py-2.5 text-sm text-slate-200 outline-none focus:border-[#b4c5ff]/50"
            >
              <option value="">All types</option>
              {examTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-[#434655] px-3 py-2 text-xs font-medium text-[#8d90a0] hover:text-red-400 hover:border-red-500/40 sm:col-span-2 lg:col-span-4"
            >
              <X size={12} />
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <p className="py-16 text-center text-sm font-mono text-slate-400">Loading resources…</p>
      ) : error ? (
        <p className="py-16 text-center text-sm font-mono text-red-400">{error}</p>
      ) : resources.length === 0 ? (
        <p className="py-16 text-center text-sm font-mono text-slate-500">No resources match your search.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard key={resource._id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ResourceExplorer;