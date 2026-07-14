import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useResource } from '../context/ResourceContext';
import ResourceCard from '../components/common/ResourceCard';
import { departmentsList, examTypes, getRecentYears } from '../constants/academic.js';

const years = getRecentYears(12);
const resourceTypes = ['Exam Paper', 'Textbook', 'Class Notes'];

export default function Dashboard() {
  // 🟩 Pull all synchronized state hooks directly from the context
  const {
    filteredResources,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    department,
    setDepartment,
    subjectCode,
    setSubjectCode,
    year,
    setYear,
    examType,
    setExamType,
    resourceType,
    setResourceType,
    clearFilters
  } = useResource();

  const [showFilters, setShowFilters] = useState(false);
  
  const activeFilterCount = [department, subjectCode, year, examType, resourceType].filter(Boolean).length;

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
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="search by name, course, category and everything else"
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
          <div className="w-full max-w-5xl mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-black/10 bg-gray-50 p-6 sm:grid-cols-2 lg:grid-cols-5">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-black/50 font-mono">Subject Code</span>
              <input
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                placeholder="e.g. CS201"
                className="mt-2 w-full rounded-xl border border-black/20 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-[#ff571a]"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-black/50 font-mono">Department</span>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
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
                onChange={(e) => setYear(e.target.value)}
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
                onChange={(e) => setResourceType(e.target.value)}
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
                onChange={(e) => setExamType(e.target.value)}
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
              Syncing with resource database…
            </p>
          )}

          {error && <p className="text-center font-mono text-xs text-red-600">Error: {error}</p>}

          {!loading && !error && (
            /* 🟩 Directly map filteredResources from the Context! */
            filteredResources.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-black/20 rounded-xl max-w-2xl mx-auto">
                <p className="text-black text-sm font-medium">Could not find any resources</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredResources.map((resource) => (
                  <ResourceCard key={resource._id} resource={resource} />
                ))}
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}