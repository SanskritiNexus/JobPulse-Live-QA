/**
 * UI Component Renderers & Helpers
 */

export const Components = {
  /**
   * Format relative time string (e.g. "2 days ago", "Today")
   */
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

  /**
   * Format currency salary range
   */
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

  /**
   * Render Job Card HTML
   */
  renderJobCard(job, isTracked = false) {
    const timeAgo = this.formatTimeAgo(job.posted_at);
    const salaryStr = this.formatSalary(job.salary_min, job.salary_max, job.salary_currency);
    const initial = (job.company || 'C').charAt(0).toUpperCase();

    return `
      <div class="glass-card job-card" data-job-id="${job.id}">
        <div>
          <div class="job-card-header">
            <div class="company-avatar">${initial}</div>
            <div>
              <span class="badge badge-live">
                <span style="width: 6px; height: 6px; border-radius: 50%; background: #34d399; display: inline-block;"></span>
                Live Listing
              </span>
            </div>
          </div>

          <h3 class="job-title">${job.title}</h3>
          <div class="company-name">${job.company}</div>

          <div class="job-meta-pills">
            <span class="badge badge-location">📍 ${job.location || 'India'}</span>
            <span class="badge badge-provider">💼 ${job.contract_type || 'Full-Time'}</span>
            <span class="badge" style="background: rgba(139, 92, 246, 0.15); color: #c4b5fd; border: 1px solid rgba(139, 92, 246, 0.3);">
              💰 ${salaryStr}
            </span>
          </div>

          <p class="job-description-snippet">${job.description || 'No detailed snippet available. View original listing on source for full description.'}</p>
        </div>

        <div class="job-card-footer">
          <div class="source-info">
            <span class="source-name">${job.source_name || 'External API'}</span>
            <span class="posted-time">Posted ${timeAgo}</span>
          </div>

          <div class="card-actions">
            <a href="${job.source_url}" target="_blank" rel="noopener noreferrer" class="glass-button-secondary" style="padding: 6px 12px; font-size: 0.8rem;" title="Open original job posting">
              🔗 Open Source
            </a>
            
            ${isTracked 
              ? `<button class="glass-button-secondary" disabled style="padding: 6px 12px; font-size: 0.8rem; opacity: 0.7;">
                  ✓ Tracked
                 </button>`
              : `<button class="glass-button-primary btn-track-job" data-job-json='${JSON.stringify(job).replace(/'/g, "&apos;")}' style="padding: 6px 12px; font-size: 0.8rem;">
                  + Track
                 </button>`
            }
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render Loading Skeletons
   */
  renderSkeletons(count = 6) {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `
        <div class="glass-card job-card" style="min-height: 240px;">
          <div style="display: flex; gap: 12px; margin-bottom: 12px;">
            <div class="skeleton" style="width: 44px; height: 44px; border-radius: 10px;"></div>
            <div style="flex: 1;">
              <div class="skeleton" style="width: 70%; height: 18px; margin-bottom: 8px;"></div>
              <div class="skeleton" style="width: 40%; height: 14px;"></div>
            </div>
          </div>
          <div class="skeleton" style="width: 100%; height: 40px; margin: 12px 0;"></div>
          <div class="skeleton" style="width: 100%; height: 14px; margin-bottom: 6px;"></div>
          <div class="skeleton" style="width: 80%; height: 14px; margin-bottom: 16px;"></div>
          <div class="skeleton" style="width: 100%; height: 32px; margin-top: auto;"></div>
        </div>
      `;
    }
    return html;
  },

  /**
   * Display Toast Message
   */
  showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
};
