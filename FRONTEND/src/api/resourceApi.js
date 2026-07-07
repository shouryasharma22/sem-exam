const API_BASE_URL = 'http://localhost:8000/api/v1';
const RESOURCE_URL = `${API_BASE_URL}/resources`;
const ADMIN_UPLOAD_URL = `${API_BASE_URL}/admin/upload`;

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
export async function fetchResources({ search = '', department = '', semester = '' } = {}) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (department) params.append('department', department);
  if (semester !== '' && semester !== null) params.append('semester', String(semester));

  const endpoint = params.toString() ? `${RESOURCE_URL}?${params.toString()}` : RESOURCE_URL;

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    const wrapper = await parseResponse(response);
    return wrapper.data?.resources ?? [];
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
export async function uploadResource(formData, adminToken) {
  if (!(formData instanceof FormData)) {
    throw new Error('uploadResource requires a FormData object as the first argument.');
  }

  if (!adminToken || typeof adminToken !== 'string') {
    throw new Error('Admin token is required for resource uploads.');
  }

  try {
    const response = await fetch(ADMIN_UPLOAD_URL, {
      method: 'POST',
      headers: {
        'x-admin-token': adminToken,
      },
      body: formData,
    });

    const wrapper = await parseResponse(response);
    return wrapper.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Resource upload failed: ${error.message}`);
    }
    throw new Error('Resource upload failed due to an unexpected error.');
  }
}
