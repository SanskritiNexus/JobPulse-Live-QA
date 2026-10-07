const axios = require('axios');

class AdzunaService {
  constructor() {
    this.appId = (process.env.ADZUNA_APP_ID || '').trim();
    this.appKey = (process.env.ADZUNA_APP_KEY || '').trim();
    this.country = (process.env.ADZUNA_COUNTRY || 'in').trim().toLowerCase();
    this.baseUrl = `https://api.adzuna.com/v1/api/jobs/${this.country}/search`;
  }

  isConfigured() {
    return Boolean(this.appId && this.appKey);
  }

  getProviderName() {
    return `Adzuna API (${this.country.toUpperCase()})`;
  }

  normalizeJob(rawItem, defaultLocation) {
    const jobId = rawItem.id || rawItem.adref || String(Math.random()).slice(2, 10);
    const title = (rawItem.title || 'Untitled Position')
      .replace(/<\/?strong>/gi, '')
      .trim();
    const company = rawItem.company?.display_name || 'Direct Employer';
    const locationName = rawItem.location?.display_name || defaultLocation || 'India';
    const categoryLabel = rawItem.category?.label || 'IT & Engineering';
    
    let contractType = 'Full-Time';
    if (rawItem.contract_type) {
      contractType = rawItem.contract_type.charAt(0).toUpperCase() + rawItem.contract_type.slice(1);
    }

    const description = (rawItem.description || 'No description provided.')
      .replace(/<\/?strong>/gi, '')
      .trim();

    return {
      id: String(jobId),
      title: title,
      company: company,
      location: locationName,
      category: categoryLabel,
      contract_type: contractType,
      salary_min: rawItem.salary_min || null,
      salary_max: rawItem.salary_max || null,
      salary_currency: this.country === 'in' ? 'INR' : 'USD',
      description: description,
      source_url: rawItem.redirect_url || '#',
      source_name: `Adzuna (${this.country.toUpperCase()})`,
      posted_at: rawItem.created || new Date().toISOString().split('T')[0],
      fetched_at: new Date().toISOString(),
      is_live: true
    };
  }

  async searchJobs({ query = '', location = '', page = 1, limit = 10, category = null, jobType = null, sortBy = 'date' }) {
    if (!this.isConfigured()) {
      return {
        provider: 'adzuna',
        provider_name: this.getProviderName(),
        is_configured: false,
        total_results: 0,
        page,
        limit,
        query,
        location,
        fetched_at: new Date().toISOString(),
        results: [],
        error: 'Adzuna API credentials (ADZUNA_APP_ID / ADZUNA_APP_KEY) are not configured in environment variables.'
      };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(Math.max(1, parseInt(limit, 10) || 10), 50);
    const targetUrl = `${this.baseUrl}/${pageNum}`;

    const params = {
      app_id: this.appId,
      app_key: this.appKey,
      results_per_page: limitNum,
      'content-type': 'application/json'
    };

    if (query) params.what = query;
    if (location) params.where = location;
    if (sortBy === 'date' || sortBy === 'salary') {
      params.sort_by = sortBy;
    }

    try {
      const response = await axios.get(targetUrl, {
        params,
        timeout: 10000
      });

      const rawResults = response.data.results || [];
      const totalCount = response.data.count || rawResults.length;

      const normalized = rawResults.map(item => this.normalizeJob(item, location));

      return {
        provider: 'adzuna',
        provider_name: this.getProviderName(),
        is_configured: true,
        total_results: totalCount,
        page: pageNum,
        limit: limitNum,
        query,
        location,
        fetched_at: new Date().toISOString(),
        results: normalized,
        error: null
      };

    } catch (err) {
      const status = err.response?.status;

      if (status === 401 || status === 403) {
        return {
          provider: 'adzuna',
          provider_name: this.getProviderName(),
          is_configured: true,
          total_results: 0,
          page: pageNum,
          limit: limitNum,
          query,
          location,
          fetched_at: new Date().toISOString(),
          results: [],
          error: `Adzuna API authentication failed (HTTP ${status}). Please verify your ADZUNA_APP_ID and ADZUNA_APP_KEY in .env.`
        };
      }

      if (status === 429) {
        return {
          provider: 'adzuna',
          provider_name: this.getProviderName(),
          is_configured: true,
          total_results: 0,
          page: pageNum,
          limit: limitNum,
          query,
          location,
          fetched_at: new Date().toISOString(),
          results: [],
          error: 'Adzuna API rate limit exceeded (HTTP 429). Please wait a few moments before searching again.'
        };
      }

      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        return {
          provider: 'adzuna',
          provider_name: this.getProviderName(),
          is_configured: true,
          total_results: 0,
          page: pageNum,
          limit: limitNum,
          query,
          location,
          fetched_at: new Date().toISOString(),
          results: [],
          error: 'Network timeout while requesting job listings from Adzuna API.'
        };
      }

      return {
        provider: 'adzuna',
        provider_name: this.getProviderName(),
        is_configured: true,
        total_results: 0,
        page: pageNum,
        limit: limitNum,
        query,
        location,
        fetched_at: new Date().toISOString(),
        results: [],
        error: `Unexpected error connecting to Adzuna API: ${err.message}`
      };
    }
  }
}

module.exports = new AdzunaService();
