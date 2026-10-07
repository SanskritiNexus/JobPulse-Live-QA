/**
 * Main Application Manager for JobPulse Live
 */

import { ApiService } from './api.js';
import { Components } from './components.js';
import { TrackerModule } from './tracker.js';

class JobPulseApp {
  constructor() {
    this.currentQuery = '';
    this.currentLocation = 'India';
    this.currentCategory = '';
    this.currentSort = 'date';
    this.currentPage = 1;
    this.providerInfo = null;
    this.trackedJobIds = new Set();
  }

  async init() {
    this.bindTabNavigation();
    this.bindSearchAndFilters();
    this.bindModal();
    
    // Check provider credentials & status
    await this.checkProviderStatus();
    
    // Initialize Kanban board
    await TrackerModule.init();
    this.updateTrackedIds();

    // Perform initial live job search
    await this.executeJobSearch();
  }

  updateTrackedIds() {
    this.trackedJobIds = new Set(TrackerModule.applications.map(a => a.job_id).filter(Boolean));
  }

  async checkProviderStatus() {
    this.providerInfo = await ApiService.getProviderStatus();
    const providerBadge = document.getElementById('active-provider-badge');
    const warningBanner = document.getElementById('credentials-warning-banner');

    if (providerBadge) {
      providerBadge.innerHTML = `
        <span style="width: 8px; height: 8px; border-radius: 50%; background: ${this.providerInfo.is_configured ? '#34d399' : '#fbbf24'}; display: inline-block;"></span>
        ${this.providerInfo.provider_name}
      `;
    }

    if (warningBanner) {
      if (!this.providerInfo.is_configured && this.providerInfo.provider_id === 'fallback') {
        warningBanner.style.display = 'flex';
        warningBanner.innerHTML = `
          <div>
            <strong>ℹ️ Live Demo Mode Active:</strong> Adzuna API credentials (<code>ADZUNA_APP_ID</code> / <code>ADZUNA_APP_KEY</code>) are not yet configured in <code>.env</code> file. Showing live demo listings for India.
          </div>
          <a href="https://developer.adzuna.com" target="_blank" class="glass-button-secondary" style="padding: 4px 12px; font-size: 0.8rem;">
            Get Free Adzuna Keys ↗
          </a>
        `;
      } else {
        warningBanner.style.display = 'none';
      }
    }
  }

  bindTabNavigation() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', async () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const targetViewId = tab.dataset.target;
        document.querySelectorAll('.tab-view').forEach(view => view.classList.remove('active'));
        
        const targetView = document.getElementById(targetViewId);
        if (targetView) targetView.classList.add('active');

        if (targetViewId === 'view-tracker') {
          await TrackerModule.loadApplications();
          this.updateTrackedIds();
        } else if (targetViewId === 'view-analytics') {
          await this.loadAnalyticsView();
        }
      });
    });
  }

  bindSearchAndFilters() {
    const searchForm = document.getElementById('search-form');
    const inputQ = document.getElementById('search-query');
    const selectLoc = document.getElementById('filter-location');
    const selectCat = document.getElementById('filter-category');
    const selectSort = document.getElementById('filter-sort');

    if (searchForm) {
      searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        this.currentQuery = inputQ.value.trim();
        this.currentLocation = selectLoc.value;
        this.currentCategory = selectCat.value;
        this.currentSort = selectSort.value;
        this.currentPage = 1;
        await this.executeJobSearch();
      });
    }

    // Quick chip buttons
    document.querySelectorAll('.chip-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const query = btn.dataset.query;
        if (query) {
          inputQ.value = query;
          this.currentQuery = query;
          this.currentPage = 1;
          await this.executeJobSearch();
        }
      });
    });

    // Handle 1-click "Track" button on Job Cards
    document.addEventListener('click', (e) => {
      const trackBtn = e.target.closest('.btn-track-job');
      if (trackBtn) {
        const rawJson = trackBtn.dataset.jobJson;
        if (rawJson) {
          try {
            const job = JSON.parse(rawJson);
            this.openTrackModal(job);
          } catch (err) {
            console.error('Error parsing job JSON:', err);
          }
        }
      }
    });
  }

  async executeJobSearch() {
    const container = document.getElementById('jobs-results-grid');
    const statusText = document.getElementById('search-results-meta');

    if (!container) return;

    // Show Skeletons
    container.innerHTML = Components.renderSkeletons(6);
    if (statusText) statusText.textContent = 'Querying live external job provider...';

    const data = await ApiService.searchJobs({
      q: this.currentQuery,
      location: this.currentLocation,
      category: this.currentCategory,
      sort_by: this.currentSort,
      page: this.currentPage,
      limit: 12
    });

    this.updateTrackedIds();

    if (data.notice) {
      const warningBanner = document.getElementById('credentials-warning-banner');
      if (warningBanner) {
        warningBanner.style.display = 'flex';
        warningBanner.innerHTML = `
          <div>${data.notice}</div>
          <a href="https://developer.adzuna.com" target="_blank" class="glass-button-secondary" style="padding: 4px 12px; font-size: 0.8rem;">
            Get Free Adzuna Keys ↗
          </a>
        `;
      }
    }

    if (data.error) {
      container.innerHTML = `
        <div class="glass-panel" style="grid-column: 1 / -1; padding: 40px; text-align: center;">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">⚠️</div>
          <h3 style="margin-bottom: 8px;">API Search Issue</h3>
          <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto 20px auto;">${data.error}</p>
          <button id="btn-retry-search" class="glass-button-primary">🔄 Retry Live Search</button>
        </div>
      `;
      document.getElementById('btn-retry-search')?.addEventListener('click', () => this.executeJobSearch());
      if (statusText) statusText.textContent = 'Search failed';
      return;
    }


    if (!data.results || data.results.length === 0) {
      container.innerHTML = `
        <div class="glass-panel" style="grid-column: 1 / -1; padding: 50px 20px; text-align: center;">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🔍</div>
          <h3 style="margin-bottom: 8px;">No Listings Found</h3>
          <p style="color: var(--text-secondary); margin-bottom: 16px;">No current active jobs matched your filters in ${this.currentLocation || 'India'}.</p>
          <button id="btn-clear-search" class="glass-button-secondary">Clear Search Filters</button>
        </div>
      `;
      document.getElementById('btn-clear-search')?.addEventListener('click', () => {
        document.getElementById('search-query').value = '';
        this.currentQuery = '';
        this.executeJobSearch();
      });
      if (statusText) statusText.textContent = '0 jobs found';
      return;
    }

    if (statusText) {
      const cacheNote = data.from_cache ? ' (cached)' : '';
      statusText.innerHTML = `Showing <strong>${data.results.length}</strong> live jobs from <strong>${data.provider_name || 'External API'}</strong>${cacheNote}`;
    }

    container.innerHTML = data.results.map(job => {
      const isTracked = this.trackedJobIds.has(job.id);
      return Components.renderJobCard(job, isTracked);
    }).join('');
  }

  openTrackModal(job) {
    const modal = document.getElementById('track-job-modal');
    if (!modal) return;

    document.getElementById('modal-job-id').value = job.id;
    document.getElementById('modal-job-title').value = job.title;
    document.getElementById('modal-job-company').value = job.company;
    document.getElementById('modal-job-location').value = job.location || 'India';
    document.getElementById('modal-job-source-url').value = job.source_url || '#';
    document.getElementById('modal-job-source-name').value = job.source_name || 'Live Job API';
    document.getElementById('modal-job-salary').value = Components.formatSalary(job.salary_min, job.salary_max, job.salary_currency);
    document.getElementById('modal-job-notes').value = `Found via ${job.source_name} on ${new Date().toLocaleDateString()}`;

    modal.classList.add('active');
  }

  bindModal() {
    const modal = document.getElementById('track-job-modal');
    const closeBtn = document.getElementById('btn-close-modal');
    const form = document.getElementById('form-save-job');

    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          job_id: document.getElementById('modal-job-id').value,
          title: document.getElementById('modal-job-title').value,
          company: document.getElementById('modal-job-company').value,
          location: document.getElementById('modal-job-location').value,
          stage: document.getElementById('modal-job-stage').value,
          source_url: document.getElementById('modal-job-source-url').value,
          source_name: document.getElementById('modal-job-source-name').value,
          salary: document.getElementById('modal-job-salary').value,
          notes: document.getElementById('modal-job-notes').value
        };

        try {
          await ApiService.createApplication(payload);
          Components.showToast(`Saved "${payload.title}" to Application Tracker!`, 'success');
          modal.classList.remove('active');
          await TrackerModule.loadApplications();
          this.updateTrackedIds();
          await this.executeJobSearch(); // Refresh track status on grid
        } catch (err) {
          Components.showToast(`Error: ${err.message}`, 'error');
        }
      });
    }
  }

  async loadAnalyticsView() {
    const analytics = await ApiService.getAnalytics();
    if (!analytics) return;

    document.getElementById('analytics-total-tracked').textContent = analytics.total_tracked;
    document.getElementById('analytics-companies-count').textContent = analytics.total_companies;
    document.getElementById('analytics-response-rate').textContent = `${analytics.response_rate_pct}%`;
    document.getElementById('analytics-offers-count').textContent = analytics.offer_count;

    const breakdownContainer = document.getElementById('analytics-stages-breakdown');
    if (breakdownContainer && analytics.stages_breakdown) {
      const stages = analytics.stages_breakdown;
      const total = analytics.total_tracked || 1;
      
      breakdownContainer.innerHTML = Object.entries(stages).map(([stage, count]) => {
        const pct = Math.round((count / total) * 100);
        return `
          <div style="margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
              <span><strong>${stage}</strong> (${count})</span>
              <span>${pct}%</span>
            </div>
            <div style="height: 8px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden;">
              <div style="width: ${pct}%; height: 100%; background: var(--status-${stage.toLowerCase()}); transition: width 0.5s ease;"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new JobPulseApp();
  app.init();
});
