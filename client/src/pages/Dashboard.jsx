import { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { fetchResources } from '../api/resourceApi';
import ResourceCard from '../components/ResourceCard.jsx';
import { departmentsList, examTypes, getRecentYears } from '../constants/academic.js';
import useDebounce from '../hooks/useDebounce.js';

const years = getRecentYears(12);
const resourceTypes = ['Exam Paper', 'Textbook', 'Class Notes'];
const pageSize = 12;

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [year, setYear] = useState('');
  const [examType, setExamType] = useState('');
  const [resourceType, setResourceType] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageInfo, setPageInfo] = useState({ page: 1, limit: pageSize, total: 0, hasMore: false });

  const debouncedSearch = useDebounce(searchQuery, 300);
  const debouncedSubjectCode = useDebounce(subjectCode, 300);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, department, debouncedSubjectCode, year, examType, resourceType]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await fetchResources({
          search: debouncedSearch,
          department,
          subjectCode: debouncedSubjectCode,
          year,
          examType,
          resourceType,
          page,
          limit: pageSize,
        });
        if (!cancelled) {
          setResources(data.resources ?? []);
          setPageInfo({
            page: data.page ?? 1,
            limit: data.limit ?? pageSize,
            total: data.total ?? 0,
            hasMore: data.hasMore ?? false,
          });
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally
       {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [debouncedSearch, department, debouncedSubjectCode, year, examType, resourceType, page]);
  //using cancelled to prevent old state updates by adding a cleanup function to useeffect which runs after every dependency change.

  const activeFilterCount = [department, subjectCode, year, examType, resourceType].filter(Boolean).length;

  const clearFilters = () => {
    setDepartment('');
    setSubjectCode('');
    setYear('');
    setExamType('');
    setResourceType('');
    setPage(1);
  };

  const totalPages = Math.max(Math.ceil(pageInfo.total / pageInfo.limit), 1);
  const visiblePages = useMemo(() => {
    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);

    for (let index = start; index <= end; index += 1) {
      pages.push(index);
    }

    return pages;
  }, [page, totalPages]);

  const startItem = pageInfo.total === 0 ? 0 : (page - 1) * pageInfo.limit + 1;
  const endItem = Math.min(page * pageInfo.limit, pageInfo.total);

  return (
    <div className="w-full min-h-[calc(100vh-84px)] bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="mt-16 mb-8 text-center max-w-4xl">
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-black mb-12 tracking-tight">
            One Stop for all college resources
          </h1>
        </div>

        {/* Search Input and Filter Toggle */}
        <div className="w-full max-w-5xl flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
          <div className="flex-1 relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by subject code..."
              className="w-full bg-white border border-black rounded-xl py-4 pl-6 pr-14 text-black focus:outline-none focus:border-[#ff571a] transition-all"
            />
            <Search
              size={20}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-black/60 group-focus-within:text-[#ff571a] transition-colors"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-black bg-white px-6 py-4 text-sm font-medium text-black transition-colors hover:border-[#ff571a] hover:text-[#ff571a] font-serif cursor-pointer shrink-0"
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-[#ff571a]/10 px-2 py-0.5 text-xs text-[#ff571a] font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="w-full max-w-5xl mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-black/10 bg-gray-50 p-6 sm:grid-cols-2 lg:grid-cols-5">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-black/50 font-mono">Subject Code</span>
              <input
                value={subjectCode}
                onChange={(e) => {
                  setSubjectCode(e.target.value);
                  setPage(1);
                }}
                placeholder="e.g. CS201"
                className="mt-2 w-full rounded-xl border border-black/20 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-[#ff571a]"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-black/50 font-mono">Department</span>
              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setPage(1);
                }}
                className="mt-2 w-full rounded-xl border border-black/20 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-[#ff571a]"
              >
                <option value="">All departments</option>
                {departmentsList.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-black/50 font-mono">Year</span>
              <select
                value={year}
                onChange={(e) => {
                  setYear(e.target.value);
                  setPage(1);
                }}
                className="mt-2 w-full rounded-xl border border-black/20 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-[#ff571a]"
              >
                <option value="">All years</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-black/50 font-mono">Resource Type</span>
              <select
                value={resourceType}
                onChange={(e) => {
                  setResourceType(e.target.value);
                  setPage(1);
                }}
                className="mt-2 w-full rounded-xl border border-black/20 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-[#ff571a]"
              >
                <option value="">All types</option>
                {resourceTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-black/50 font-mono">Exam Type</span>
              <select
                value={examType}
                onChange={(e) => {
                  setExamType(e.target.value);
                  setPage(1);
                }}
                className="mt-2 w-full rounded-xl border border-black/20 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-[#ff571a]"
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
                className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-black/10 bg-white px-4 py-2 text-xs font-medium text-gray-500 hover:text-red-600 hover:border-red-500/30 cursor-pointer sm:col-span-2 lg:col-span-5 mt-2"
              >
                <X size={12} />
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Clean Resource Output Grid */}
        <div className="w-full mb-24">
          {loading && (
            <p className="text-center font-mono text-xs text-black/60 animate-pulse">
              Fetching resources.....
            </p>
          )}

          {error && <p className="text-center font-mono text-xs text-red-600">Error: {error}</p>}

          {!loading && !error && (
            resources.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-black/20 rounded-xl max-w-2xl mx-auto">
                <p className="text-black text-sm font-medium">Could not find any resources</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {resources.map((resource) => (
                    <ResourceCard key={resource._id} resource={resource} />
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-black/70">
                    Showing {startItem}-{endItem} of {pageInfo.total} resources
                  </p>
                  {pageInfo.total > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 1))}
                        disabled={page === 1}
                        className="rounded-lg border border-black/10 px-3 py-2 text-sm font-medium text-black transition disabled:cursor-not-allowed disabled:opacity-50 hover:border-[#ff571a] hover:text-[#ff571a]"
                      >
                        Previous
                      </button>
                      {visiblePages.map((pageNumber) => (
                        <button
                          key={pageNumber}
                          type="button"
                          onClick={() => setPage(pageNumber)}
                          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${page === pageNumber ? 'bg-[#ff571a] text-white' : 'border border-black/10 text-black hover:border-[#ff571a] hover:text-[#ff571a]'}`}
                        >
                          {pageNumber}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setPage((currentPage) => currentPage + 1)}
                        disabled={!pageInfo.hasMore && page >= totalPages}
                        className="rounded-lg border border-black/10 px-3 py-2 text-sm font-medium text-black transition disabled:cursor-not-allowed disabled:opacity-50 hover:border-[#ff571a] hover:text-[#ff571a]"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              </>
            )
          )}
        </div>
      </main>
    </div>
  );
}