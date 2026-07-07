import { useResource } from '../context/ResourceContext';
import ResourceGrid from '../components/common/ResourceGrid';
import Sidebar from '../components/layout/Sidebar';

function Dashboard() {
  const { filteredResources, loading, error, resources, selectedDepartment, selectedSemester, clearFilters, } = useResource();

  const hasFilters = Boolean(selectedDepartment || selectedSemester);

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <section className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Browse</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Student resource dashboard</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Explore textbooks, notes, and past exam papers curated for your semester and department.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm">
              <span className="font-semibold text-slate-900">{filteredResources.length}</span>
              <span className="ml-2">resources visible</span>
            </div>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>
      </header>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <span className="animate-spin rounded-full border-4 border-slate-300 border-t-blue-600 p-4" />
          </div>
          <p className="mt-6 text-lg font-semibold text-slate-900">Syncing resources...</p>
          <p className="mt-2 text-sm text-slate-500">Please wait while we fetch the latest student materials.</p>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-rose-700">Network error</p>
              <p className="mt-2 text-sm text-rose-700">{error}</p>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-rose-700 shadow-sm transition hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-300"
            >
              Retry connection
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <Sidebar />
          <div className="space-y-6">
            <ResourceGrid resources={filteredResources} />
            {Array.isArray(resources) && resources.length === 0 && (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                No resources available yet. Try again later or check your backend connection.
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default Dashboard;
