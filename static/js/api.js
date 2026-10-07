/**
 * API Service for JobPulse Live Job Tracker
 * Communicates strictly with our backend API endpoints.
 */

const API_BASE = '/api';

export const ApiService = {
  /**
   * Fetch active provider configuration & credentials status
   */
  async getProviderStatus() {
    try {
      const res = await fetch(`${API_BASE}/provider/status`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Error fetching provider status:', err);
      return {
        provider_id: 'unknown',
        provider_name: 'Unavailable',
        is_configured: false,
        error: err.message
      };
    }
  },

  /**
   * Search live job listings via backend provider
   */
  async searchJobs({ q = '', location = '', page = 1, limit = 12, category = '', job_type = '', sort_by = 'date', nocache = false }) {
    const params = new URLSearchParams({
      q,
      location,
      page: page.toString(),
      limit: limit.toString(),
      sort_by
    });
    if (category) params.append('category', category);
    if (job_type) params.append('job_type', job_type);
    if (nocache) params.append('nocache', 'true');

    try {
      const res = await fetch(`${API_BASE}/jobs/search?${params.toString()}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP Error ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.error('Error searching jobs:', err);
      return {
        error: err.message || 'Failed to connect to backend job search service.',
        results: [],
        total_results: 0
      };
    }
  },

  /**
   * Application Tracker CRUD Operations
   */
  async getApplications() {
    try {
      const res = await fetch(`${API_BASE}/applications`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Error fetching applications:', err);
      return { applications: [], count: 0 };
    }
  },

  async createApplication(appData) {
    try {
      const res = await fetch(`${API_BASE}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save application');
      return data;
    } catch (err) {
      throw err;
    }
  },

  async updateApplication(appId, updateData) {
    try {
      const res = await fetch(`${API_BASE}/applications/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update application');
      return data;
    } catch (err) {
      throw err;
    }
  },

  async deleteApplication(appId) {
    try {
      const res = await fetch(`${API_BASE}/applications/${appId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete application');
      return data;
    } catch (err) {
      throw err;
    }
  },

  /**
   * Analytics Endpoint
   */
  async getAnalytics() {
    try {
      const res = await fetch(`${API_BASE}/analytics`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Error fetching analytics:', err);
      return null;
    }
  }
};
