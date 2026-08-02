const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const RESOURCE_URL = `${API_BASE_URL}/resources`;
const ADMIN_URL = `${API_BASE_URL}/admin`;
const ADMIN_UPLOAD_URL = `${ADMIN_URL}/upload`;
const ADMIN_DELETE_URL = `${ADMIN_URL}/resources`;


async function parseResponse(response) {
  const json = await response.json().catch(() => null);
  const wrapper = json || {};

  if (!response.ok || wrapper.statusCode >= 400) {
    const message = wrapper.message || wrapper.error || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = wrapper.statusCode || response.status;
    error.payload = wrapper;
    throw error;
  }

  return wrapper;
}

export async function fetchResources({
  search = '',
  department = '',
  semester = '',
  resourceType = '',
  subjectCode = '',
  year = '',
  examType = '',
  page = 1,
  limit = 12,
} = {}) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (department) params.append('department', department);
  if (semester !== '' && semester !== null) params.append('semester', String(semester));
  if (resourceType) params.append('resourceType', resourceType);
  if (subjectCode) params.append('subjectCode', subjectCode);
  if (year) params.append('year', String(year));
  if (examType) params.append('examType', examType);
  if (page) params.append('page', String(page));
  if (limit) params.append('limit', String(limit));

  const endpoint = params.toString() ? `${RESOURCE_URL}?${params.toString()}` : RESOURCE_URL;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    const wrapper = await parseResponse(response);
    if (Array.isArray(wrapper)) {
      return { resources: wrapper, page: 1, limit, total: wrapper.length, hasMore: false };
    }

    return {
      resources: wrapper.data?.resources ?? [],
      page: wrapper.data?.page ?? 1,
      limit: wrapper.data?.limit ?? limit,
      total: wrapper.data?.total ?? 0,
      hasMore: wrapper.data?.hasMore ?? false,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Unable to load resources: ${error.message}`);
    }
    throw new Error('Unable to load resources due to an unexpected error.');
  }
}

export const uploadResource = async (formData, adminToken) => {
  try {
    const headers = {
      Accept: 'application/json'
    };
    if (adminToken && typeof adminToken === 'string') {
      headers['x-admin-token'] = adminToken;
    }

    const response = await fetch(ADMIN_UPLOAD_URL, {
      method: 'POST',
      headers,
      body: formData,
    });


    // Parse out the network stream response shell securely
    const wrapper = await parseResponse(response);
    
    // Safely extract the inner data payload payload
    return wrapper?.data || wrapper;
    
  } catch (error) {
    console.error("Frontend API Resource Upload Error:", error);
    throw error;
  }
};


export const deleteResource = async (id, adminToken) => {
  const headers = {
    Accept: 'application/json'
  };
  if (adminToken && typeof adminToken === 'string') {
    headers['x-admin-token'] = adminToken;
  }

  const response = await fetch(`${ADMIN_DELETE_URL}/${id}`, {
    method: 'DELETE',
    headers,
  });

  const wrapper = await parseResponse(response);
  return wrapper?.data || wrapper;
};