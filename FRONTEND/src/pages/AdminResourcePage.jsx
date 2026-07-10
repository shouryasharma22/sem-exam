import { useEffect, useState } from 'react';
import { fetchResources, deleteResource } from '../api/resourceApi';
import ResourceCard from '../components/common/ResourceCard';

function AdminResourcesPage() {
  const adminToken = localStorage.getItem('admin_token');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await fetchResources();
        if (!cancelled) setResources(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const handleDelete = async (id) => {
    await deleteResource(id, adminToken);
    setResources((prev) => prev.filter((r) => r._id !== id));
  };

  if (loading) {
    return <p className="p-8 text-sm font-mono text-slate-400">Loading resources…</p>;
  }

  if (error) {
    return <p className="p-8 text-sm font-mono text-red-400">{error}</p>;
  }

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold text-white">Manage Resources</h1>
      {resources.length === 0 ? (
        <p className="text-sm font-mono text-slate-500">No resources yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard
              key={resource._id}
              resource={resource}
              isAdmin
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminResourcesPage;