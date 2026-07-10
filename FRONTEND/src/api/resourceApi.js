const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const RESOURCE_URL = `${API_BASE_URL}/resources`;
const ADMIN_URL = `${API_BASE_URL}/admin`;
const ADMIN_UPLOAD_URL = `${ADMIN_URL}/upload`;
const ADMIN_DELETE_URL = `${ADMIN_URL}/resources`;

/**
 * Normalize fetch responses and throw a readable error when status is not OK.
 * @param {Response} response
 * @returns {Promise<any>}
 */
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

/**
 * Fetch resources from the backend and return the parsed resource array.
 * @param {Object} [query] query filters for the resource list
 * @param {string} [query.search] search term
 * @param {string} [query.department] department filter
 * @param {string|number} [query.semester] semester filter
 * @returns {Promise<any[]>}
 */
export async function fetchResources({
  search = '',
  department = '',
  semester = '',
  resourceType = '',
  subjectCode = '',
  year = '',
  examType = '',
} = {}) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (department) params.append('department', department);
  if (semester !== '' && semester !== null) params.append('semester', String(semester));
  if (resourceType) params.append('resourceType', resourceType);
  if (subjectCode) params.append('subjectCode', subjectCode);
  if (year) params.append('year', String(year));
  if (examType) params.append('examType', examType);

  const endpoint = params.toString() ? `${RESOURCE_URL}?${params.toString()}` : RESOURCE_URL;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    const wrapper = await parseResponse(response);
    if (Array.isArray(wrapper)) {
      return wrapper;
    }
    return wrapper.data?.resources ?? wrapper.resources ?? [];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Unable to load resources: ${error.message}`);
    }
    throw new Error('Unable to load resources due to an unexpected error.');
  }
}
/**
 * Upload a resource using multipart/form-data and admin authorization.
 * @param {FormData} formData
 * @param {string} adminToken
 * @returns {Promise<any>}
 */
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

/**
 * Delete a resource by ID using admin authorization.
 * @param {string} id resource _id
 * @param {string} adminToken
 * @returns {Promise<any>}
 */
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