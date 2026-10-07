/**
 * Jobs Module
 * Manages Job Search, Filters, Rendering, Pagination, and Adzuna API Status.
 */

export const JobsModule = {
  currentPage: 1,
  limit: 12,
  totalResults: 0,
  currentQuery: '',
  currentLocation: 'India',
  currentCategory: '',
  currentSort: 'date',
  providerInfo: null,
  trackedJobIds: new Set(),

  async init() {
    await this.checkProviderStatus();
    this.bindSearchEvents();
    this.bindPaginationEvents();
  },

  async checkProviderStatus() {
    try {
      const res = await fetch('/api/provider/status');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      this.providerInfo = await res.json();

      const dot = document.getElementById('providerStatusDot');
      const text = document.getElementById('providerStatusText');

      if (text) text.textContent = this.providerInfo.provider_name || 'Adzuna API';
      if (dot) {
        dot.className = this.providerInfo.is_configured ? 'dot-indicator' : 'dot-indicator offline';
      }
    } catch (err) {
      console.error('Error fetching provider status:', err);
    }
  },

  bindSearchEvents() {
    const form = document.getElementById('searchForm');
    const inputQ = document.getElementById('searchInput');
    const selectLoc = document.getElementById('locationFilter');
    const selectCat = document.getElementById('categoryFilter');
    const selectSort = document.getElementById('sortFilter');

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        this.currentQuery = inputQ.value.trim();
        this.currentLocation = selectLoc.value;
        this.currentCategory = selectCat.value;
        this.currentSort = selectSort.value;
        this.currentPage = 1;
        await this.executeSearch();
      });
    }

    // Popular chip buttons
    document.querySelectorAll('.chip-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const query = btn.dataset.query;
        if (query && inputQ) {
          inputQ.value = query;
          this.currentQuery = query;
          this.currentPage = 1;
          await this.executeSearch();
        }
      });
    });
  },

  bindPaginationEvents() {
    const prevBtn = document.getElementById('btnPrevPage');
    const nextBtn = document.getElementById('btnNextPage');

    if (prevBtn) {
      prevBtn.addEventListener('click', async () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          await this.executeSearch();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', async () => {
        this.currentPage++;
        await this.executeSearch();
      });
    }
  },

  formatSalary(min, max, currency = 'INR') {
    if (!min && !max) return 'Salary on Listing';
    const symbol = currency === 'INR' ? '₹' : '$';

    const formatNum = (num) => {
      if (currency === 'INR') {
        if (num >= 100000) return `${(num / 100000).toFixed(1)} Lakhs`;
        if (num >= 1000) return `${(num / 1000).toFixed(0)}k`;
      }
      return num >= 1000 ? `${(num / 1000).toFixed(0)}k` : num.toString();
    };

    if (min && max) return `${symbol}${formatNum(min)} - ${symbol}${formatNum(max)} / yr`;
    if (min) return `From ${symbol}${formatNum(min)} / yr`;
    return `Up to ${symbol}${formatNum(max)} / yr`;
  },

  formatTimeAgo(dateString) {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffSecs = Math.floor((now - date) / 1000);
      if (isNaN(diffSecs) || diffSecs < 0) return 'Recently';

      if (diffSecs < 3600) return 'Just now';
      const hours = Math.floor(diffSecs / 3600);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      if (days === 1) return 'Yesterday';
      if (days < 30) return `${days}d ago`;
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  },

  async executeSearch(trackedSet = new Set()) {
    this.trackedJobIds = trackedSet;
    const container = document.getElementById('jobList');
    const metaText = document.getElementById('searchResultsMeta');

    if (!container) return;

    // Show loading text
    container.innerHTML = '<div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-muted);">Fetching live job listings...</div>';
    if (metaText) metaText.textContent = 'Querying backend Adzuna API...';

    const params = new URLSearchParams({
      q: this.currentQuery,
      location: this.currentLocation,
      page: this.currentPage.toString(),
      limit: this.limit.toString(),
      sort_by: this.currentSort
    });

    if (this.currentCategory) params.append('category', this.currentCategory);

    try {
      const res = await fetch(`/api/jobs/search?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data.error) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; background: var(--panel-bg); border: 1px solid var(--border-color); padding: 40px; border-radius: 8px; text-align: center;">
            <h3 style="margin-bottom: 8px; color: var(--danger);">⚠️ Job Search Unavailable</h3>
            <p style="color: var(--text-muted); margin-bottom: 16px;">${data.error}</p>
            <button id="btnRetrySearch" class="btn-primary">🔄 Retry Search</button>
          </div>
        `;
        document.getElementById('btnRetrySearch')?.addEventListener('click', () => this.executeSearch(trackedSet));
        if (metaText) metaText.textContent = 'Search error';
        return;
      }

      this.totalResults = data.total_results || 0;
      const results = data.results || [];

      if (results.length === 0) {
        container.innerHTML = `
          <div style="grid-column: 1 / -1; background: var(--panel-bg); border: 1px solid var(--border-color); padding: 50px 20px; border-radius: 8px; text-align: center;">
            <h3 style="margin-bottom: 8px;">No Job Listings Found</h3>
            <p style="color: var(--text-muted); margin-bottom: 16px;">No active openings matched your criteria in ${this.currentLocation || 'India'}.</p>
            <button id="btnClearSearch" class="btn-secondary">Clear Search Input</button>
          </div>
        `;
        document.getElementById('btnClearSearch')?.addEventListener('click', () => {
          document.getElementById('searchInput').value = '';
          this.currentQuery = '';
          this.executeSearch(trackedSet);
        });
        if (metaText) metaText.textContent = '0 jobs found';
        this.updatePaginationControls();
        return;
      }

      if (metaText) {
        const cacheNote = data.from_cache ? ' (cached)' : '';
        metaText.innerHTML = `Showing <strong>${results.length}</strong> live jobs from <strong>${data.provider_name || 'Adzuna API'}</strong>${cacheNote}`;
      }

      container.innerHTML = results.map(job => this.renderJobCard(job)).join('');
      this.updatePaginationControls();

    } catch (err) {
      console.error('Error executing job search:', err);
      container.innerHTML = `<div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--danger);">Failed to connect to backend job search API.</div>`;
    }
  },

  renderJobCard(job) {
    const isTracked = this.trackedJobIds.has(job.id);
    const salaryStr = this.formatSalary(job.salary_min, job.salary_max, job.salary_currency);
    const timeAgo = this.formatTimeAgo(job.posted_at);

    return `
      <div class="job-card" id="jobCard" data-job-id="${job.id}">
        <div>
          <div class="job-card-header">
            <h3 class="job-title">${job.title}</h3>
          </div>
          <div class="company-name">🏢 ${job.company}</div>

          <div class="job-pills">
            <span class="pill">📍 ${job.location || 'India'}</span>
            <span class="pill">💼 ${job.contract_type || 'Full-time'}</span>
            <span class="pill pill-salary">💰 ${salaryStr}</span>
          </div>

          <p class="job-description">${job.description || 'No detailed snippet available. Click below to view the original posting.'}</p>
        </div>

        <div class="job-card-footer">
          <span class="posted-date">Posted ${timeAgo} • ${job.source_name || 'Adzuna'}</span>
          
          <div class="card-actions">
            <a href="${job.source_url}" target="_blank" rel="noopener noreferrer" class="btn-secondary" title="Open original listing">
              🔗 View Link
            </a>
            
            ${isTracked 
              ? `<button class="btn-secondary" disabled style="opacity: 0.7;">✓ Tracked</button>`
              : `<button id="applyButton" class="btn-primary btn-track-job" data-job-json='${JSON.stringify(job).replace(/'/g, "&apos;")}'>
                  + Track
                 </button>`
            }
          </div>
        </div>
      </div>
    `;
  },

  updatePaginationControls() {
    const prevBtn = document.getElementById('btnPrevPage');
    const nextBtn = document.getElementById('btnNextPage');
    const pageIndicator = document.getElementById('pageIndicator');

    if (prevBtn) prevBtn.disabled = this.currentPage <= 1;
    if (nextBtn) {
      const hasMorePages = (this.currentPage * this.limit) < this.totalResults;
      nextBtn.disabled = !hasMorePages && this.totalResults > 0;
    }
    if (pageIndicator) {
      pageIndicator.textContent = `Page ${this.currentPage}`;
    }
  }
};
