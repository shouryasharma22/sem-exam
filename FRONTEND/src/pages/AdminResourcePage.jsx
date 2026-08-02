import { useEffect, useMemo, useState } from 'react';
import { fetchResources, deleteResource } from '../api/resourceApi';
import ResourceCard from '../components/common/ResourceCard';
import {departmentsList, examTypes, getRecentYears } from '../constants/academic.js';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import useDebounce from '../hooks/useDebounce.js';


const years = getRecentYears(12);
const PAGE_SIZE = 12;

function AdminResourcesPage() {
  const adminToken = localStorage.getItem('admin_token');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [year, setYear] = useState('');
  const [examType, setExamType] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [page, setPage] = useState(1);
  const [pageInfo, setPageInfo] = useState({ page: 1, limit: PAGE_SIZE, total: 0, hasMore: false });

  const debouncedSearch = useDebounce(searchQuery, 300);
  const debouncedSubjectCode = useDebounce(subjectCode, 300);

  const activeFilterCount = [department, subjectCode, year, examType].filter(Boolean).length;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, department, debouncedSubjectCode, year, examType]);

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
          page,
          limit: PAGE_SIZE,
        });
        if (!cancelled) {
          setResources(data.resources ?? []);
          setPageInfo({
            page: data.page ?? 1,
            limit: data.limit ?? PAGE_SIZE,
            total: data.total ?? 0,
            hasMore: data.hasMore ?? false,
          });
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [debouncedSearch, department, debouncedSubjectCode, year, examType, page]);

  const handleDelete = async (id) => {
    await deleteResource(id, adminToken);
    setResources((prev) => prev.filter((r) => r._id !== id));
  };

  const clearFilters = () => {
    setDepartment('');
    setSubjectCode('');
    setYear('');
    setExamType('');
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

  if (loading) {
    return (
      <div className="w-full min-h-[calc(100vh-84px)] bg-white flex justify-center items-center">
        <p className="text-sm font-mono text-black/60 animate-pulse">Syncing with resource database…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-[calc(100vh-84px)] bg-white flex justify-center items-center">
        <p className="text-sm font-mono text-red-600">Pipeline Exception Fault: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-84px)] bg-white">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Title Layer */}
        <div className="mt-16 mb-8 text-center max-w-4xl">
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-black mb-4 tracking-tight">
            Manage Resources
          </h1>
          <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">Admin Control Layer</p>
        </div>

        {/* Search and Toggle Row */}
        <div className="w-full max-w-5xl flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
          <div className="flex-1 relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search assets by title or course code..."
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

        {/* Conditional Advanced Filter Drawer */}
        {showFilters && (
          <div className="w-full max-w-5xl mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-black/10 bg-gray-50 p-6 sm:grid-cols-2 lg:grid-cols-4">
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
                className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-black/10 bg-white px-4 py-2 text-xs font-medium text-gray-500 hover:text-red-600 hover:border-red-500/30 cursor-pointer sm:col-span-2 lg:col-span-4 mt-2"
              >
                <X size={12} />
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Resource Grid Output Canvas */}
        <div className="w-full mb-24 max-w-7xl">
          {loading && (
            <p className="text-center font-mono text-xs text-black/60 animate-pulse">
              Syncing with resource database…
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                  {resources.map((resource) => (
                    <ResourceCard
                      key={resource._id}
                      resource={resource}
                      isAdmin
                      onDelete={handleDelete}
                    />
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
                        onClick={() => setPage((currentPage) => Math.min(currentPage + 1, totalPages))}
                        disabled={page === totalPages}
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

export default AdminResourcesPage;