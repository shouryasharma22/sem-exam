import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchResources } from '../api/resourceApi';
import useDebounce from '../hooks/useDebounce';

const ResourceContext = createContext(null);

export function ResourceProvider({ children }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    async function loadInitialResources() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchResources();
        setResources(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        setError(fetchError.message || 'Unable to load resources');
      } finally {
        setLoading(false);
      }
    }

    loadInitialResources();
  }, []);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const title = String(resource.title || '').toLowerCase();
      const subjectCode = String(resource.subjectCode || '').toLowerCase();
      const department = String(resource.department || '').toLowerCase();
      const semester = String(resource.semester ?? '').toLowerCase();
      const query = debouncedSearchQuery.trim().toLowerCase();
      const departmentFilter = selectedDepartment.trim().toLowerCase();
      const semesterFilter = selectedSemester.trim();

      const matchesSearch =
        !query || title.includes(query) || subjectCode.includes(query);
      const matchesDepartment =
        !departmentFilter || department.includes(departmentFilter);
      const matchesSemester =
        !semesterFilter || semester === semesterFilter;

      return matchesSearch && matchesDepartment && matchesSemester;
    });
  }, [resources, debouncedSearchQuery, selectedDepartment, selectedSemester]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDepartment('');
    setSelectedSemester('');
  };

  const value = useMemo(
    () => ({
      resources,
      filteredResources,
      loading,
      error,
      searchQuery,
      selectedDepartment,
      selectedSemester,
      setSearchQuery,
      setSelectedDepartment,
      setSelectedSemester,
      clearFilters,
    }),
    [resources, filteredResources, loading, error, searchQuery, selectedDepartment, selectedSemester]
  );

  return <ResourceContext.Provider value={value}>{children}</ResourceContext.Provider>;
}

export function useResource() {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error('useResource must be used within a ResourceProvider');
  }
  return context;
}
