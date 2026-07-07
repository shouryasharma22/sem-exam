import { useMemo } from 'react';
import { useResource } from '../../context/ResourceContext';

function Navbar({ activeTab, onChangeTab }) {
  const { searchQuery, setSearchQuery, clearFilters } = useResource();

  const showClear = Boolean(searchQuery?.trim());

  const badgeClass =
    'inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur-lg';

  const navButtonClass = (selected) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      selected
        ? 'bg-slate-100/10 text-white shadow-sm'
        : 'bg-white/10 text-slate-200 hover:bg-white/15'
    }`;

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-900/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-4">
          <div className={badgeClass}>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span>NITK SemExam Hub</span>
          </div>
          <div className="hidden text-sm text-slate-300 sm:block">
            A centralized student resource library for notes, exams, and uploads.
          </div>
        </div>

        <div className="relative flex-1 min-w-0">
          <label className="sr-only" htmlFor="global-search">
            Search resources
          </label>
          <div className="relative">
            <input
              id="global-search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by title or subject code"
              className="w-full rounded-3xl border border-white/15 bg-slate-800/90 px-4 py-3 pr-12 text-sm text-white outline-none ring-1 ring-transparent transition focus:border-blue-400 focus:ring-blue-500"
            />
            {showClear && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  clearFilters();
                }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-700/80 px-2 py-1 text-sm text-slate-200 transition hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onChangeTab('browse')}
            className={navButtonClass(activeTab === 'browse')}
          >
            Browse
          </button>
          <button
            type="button"
            onClick={() => onChangeTab('admin')}
            className={navButtonClass(activeTab === 'admin')}
          >
            Admin Panel
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
