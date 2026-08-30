import ResourceCard from './ResourceCard';

function ResourceGrid({ resources = [] }) {
  if (!Array.isArray(resources) || resources.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
        <p className="text-lg font-semibold text-slate-900">No study materials match your search parameters.</p>
        <p className="mt-3 text-sm text-slate-500">Try adjusting your search terms or filter selections.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {resources.map((resource) => (
        <ResourceCard key={resource._id || resource.id || resource.title} resource={resource} />
      ))}
    </div>
  );
}

export default ResourceGrid;
