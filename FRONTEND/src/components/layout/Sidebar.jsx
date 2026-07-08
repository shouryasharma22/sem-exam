import { useResource } from '../../context/ResourceContext';

const departments = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Mechanical',
];

const semesters = Array.from({ length: 8 }, (_, index) => index + 1);

function Sidebar() {
  const {
    selectedDepartment,
    selectedSemester,
    setSelectedDepartment,
    setSelectedSemester,
    clearFilters,
  } = useResource();

  const hasActiveFilters = Boolean(selectedDepartment || selectedSemester);

  return (
    <aside className="sticky top-24 col-span-1 hidden h-fit rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">
        <div>
          <p className="text-sm font-semibold text-slate-900">Filters</p>
          <p className="text-sm text-slate-500">Refine your resource list</p>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-semibold text-blue-600 transition hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          >
            Reset Filters
          </button>
        )}
      </div>

      <div className="space-y-6 px-6 py-5">
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Department</h2>
            <span className="text-xs text-slate-500">Choose one</span>
          </div>
          <div className="space-y-2">
            {departments.map((department) => {
              const isActive = selectedDepartment === department;

              return (
                <button
                  type="button"
                  key={department}
                  onClick={() => setSelectedDepartment(isActive ? '' : department)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                    isActive
                      ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>{department}</span>
                  {isActive && (
                    <span className="rounded-full bg-blue-500 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                      Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Semester</h2>
            <span className="text-xs text-slate-500">1–8</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {semesters.map((semester) => {
              const isActive = String(selectedSemester) === String(semester);

              return (
                <button
                  type="button"
                  key={semester}
                  onClick={() => setSelectedSemester(isActive ? '' : String(semester))}
                  className={`rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {semester}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </aside>
  );
}

export default Sidebar;
