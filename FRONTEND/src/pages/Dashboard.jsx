import { useResource } from '../context/ResourceContext';
import ResourceCard from '../components/common/ResourceCard';

export default function Dashboard() {
  const { 
    filteredResources, 
    loading, 
    error, 
    searchQuery, 
    setSearchQuery,
    selectedDepartment,
    setSelectedDepartment
  } = useResource();

  const departments = [
    { id: 'computer science', name: 'Computer Science' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'information technology', name: 'Information Technology' },
    { id: 'mechanical', name: 'Mechanical' }
  ];

  return (
    <div className="relative overflow-hidden flex flex-col items-center w-full min-h-[calc(100vh-84px)]">
      
      {/* 🚀 Hero Headline Header Layout */}
      <div className="mt-24 mb-16 text-center max-w-4xl px-4 animate-fadeIn">
        <h1 className="text-6xl md:text-7xl font-black text-[#b4c5ff] mb-8 tracking-tight leading-[1.1]">
          Academic Resource Cluster
        </h1>
        <p className="text-xl md:text-2xl text-[#c3c6d7] leading-relaxed mb-12 max-w-2xl mx-auto">
          Decentralized access to past end-sem papers, textbooks, and peer class notes curated for NITK cycles.
        </p>

        {/* 🔍 Prominent Centered Search Input Box */}
        <div className="max-w-2xl mx-auto relative group mb-24">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Query by keyword or course code (e.g., CS201)..." 
            className="w-full bg-[#151b2d] text-[#dce1fb] border-2 border-[#434655] rounded-full py-5 pl-8 pr-16 text-lg focus:outline-none focus:border-[#b4c5ff] transition-all shadow-xl font-medium"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-50 font-mono text-xs bg-[#2e3447] px-2 py-1 rounded border border-[#434655]">
            <span>⌘</span><span>K</span>
          </div>
        </div>

        {/* 🗂️ Department Capsule Selection Section */}
        <div className="w-full max-w-5xl mx-auto">
          <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-[#8d90a0] mb-8">
            Browse Resources
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(selectedDepartment === dept.id ? '' : dept.id)}
                className={`px-8 py-3 border text-sm font-mono uppercase tracking-widest transition-all cursor-pointer ${
                  selectedDepartment === dept.id
                    ? 'border-[#b4c5ff] text-[#b4c5ff] bg-[#2563eb]/20 shadow-lg shadow-blue-500/10'
                    : 'border-[#434655] text-[#c3c6d7] hover:border-[#b4c5ff] hover:text-[#b4c5ff] bg-[#151b2d]'
                }`}
              >
                {dept.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🎴 Responsive Resource List Execution */}
      <div className="w-full max-w-6xl px-4 pb-24">
        {loading && (
          <p className="text-center text-xs font-mono text-blue-400 animate-pulse">Syncing with resource database...</p>
        )}
        
        {error && (
          <p className="text-center text-xs font-mono text-red-400">Error: {error}</p>
        )}

        {!loading && !error && (
          filteredResources.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#434655] bg-[#151b2d] rounded-xl max-w-2xl mx-auto">
              <p className="text-[#c3c6d7] text-sm font-medium">No data matching query.</p>
              <p className="text-[#8d90a0] text-xs mt-1 font-mono uppercase">Clear active filters or modify search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource._id} resource={resource} />
              ))}
            </div>
          )
        )}
      </div>

      {/* 🌌 Background Mesh Gradient Radial Orbs */}
      <div className="absolute inset-0 -z-10 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[800px] h-[800px] bg-blue-500/20 rounded-full blur-[160px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-[#4edea3]/10 rounded-full blur-[140px]"></div>
      </div>
    </div>
  );
}