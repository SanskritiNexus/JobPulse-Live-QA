const adzunaService = require('../services/adzunaService');
const MemoryCache = require('../services/memoryCache');

const cacheTtl = parseInt(process.env.CACHE_TTL_SECONDS || '300', 10);
const cache = new MemoryCache(cacheTtl);

const getProviderStatus = (req, res) => {
  return res.json({
    provider_id: 'adzuna',
    provider_name: adzunaService.getProviderName(),
    is_configured: adzunaService.isConfigured(),
    cache_ttl_seconds: cacheTtl,
    active_env_provider: process.env.JOB_API_PROVIDER || 'adzuna'
  });
};

const searchJobs = async (req, res) => {
  const query = (req.query.q || '').trim();
  const location = (req.query.location || '').trim();
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '10', 10);
  const category = (req.query.category || '').trim() || null;
  const jobType = (req.query.job_type || '').trim() || null;
  const sortBy = (req.query.sort_by || 'date').trim();
  const bypassCache = (req.query.nocache || 'false').toLowerCase() === 'true';

  const cacheKey = `jobs:${query}:${location}:${page}:${limit}:${category}:${jobType}:${sortBy}`;

  if (!bypassCache) {
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      return res.json({
        ...cachedResult,
        from_cache: true
      });
    }
  }

  const result = await adzunaService.searchJobs({
    query,
    location,
    page,
    limit,
    category,
    jobType,
    sortBy
  });

  result.from_cache = false;
  if (!result.error) {
    cache.set(cacheKey, result);
  }

  return res.json(result);
};

module.exports = {
  getProviderStatus,
  searchJobs
};
