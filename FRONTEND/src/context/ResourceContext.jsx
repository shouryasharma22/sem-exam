import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchResources } from '../api/resourceApi';
import useDebounce from '../hooks/useDebounce';

const ResourceContext = createContext(null);

export function ResourceProvider({ children }) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🟩 All filter states now live globally in the context
  const [searchQuery, setSearchQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [year, setYear] = useState('');
  const [examType, setExamType] = useState('');
  const [resourceType, setResourceType] = useState('');

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const debouncedSubjectCode = useDebounce(subjectCode, 300);

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

  // 🟩 Single, optimized filtration pipeline
  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch = !debouncedSearchQuery.trim() || 
        String(resource.title || '').toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        String(resource.subjectCode || '').toLowerCase().includes(debouncedSearchQuery.toLowerCase());

      const matchesDept = !department || 
        String(resource.department || '').toLowerCase() === department.toLowerCase();

      const matchesSubject = !debouncedSubjectCode.trim() || 
        String(resource.subjectCode || '').toLowerCase().includes(debouncedSubjectCode.toLowerCase());

      const matchesYear = !year || 
        String(resource.year || '') === String(year);

      const matchesExamType = !examType || 
        String(resource.examType || '').toLowerCase() === examType.toLowerCase();

      const matchesResourceType = !resourceType || 
        String(resource.resourceType || '').toLowerCase() === resourceType.toLowerCase();

      return matchesSearch && matchesDept && matchesSubject && matchesYear && matchesExamType && matchesResourceType;
    });
  }, [resources, debouncedSearchQuery, department, debouncedSubjectCode, year, examType, resourceType]);

  const clearFilters = () => {
    setSearchQuery('');
    setDepartment('');
    setSubjectCode('');
    setYear('');
    setExamType('');
    setResourceType('');
  };

  const value = useMemo(
    () => ({
      resources,
      filteredResources,
      loading,
      error,
      searchQuery,
      department,
      subjectCode,
      year,
      examType,
      resourceType,
      setSearchQuery,
      setDepartment,
      setSubjectCode,
      setYear,
      setExamType,
      setResourceType,
      clearFilters,
    }),
    [resources, filteredResources, loading, error, searchQuery, department, subjectCode, year, examType, resourceType]
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