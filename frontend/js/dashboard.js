/**
 * Dashboard Module
 * Renders analytics and application pipeline metrics.
 */

export const DashboardModule = {
  async init() {
    await this.loadAnalytics();
  },

  async loadAnalytics() {
    try {
      const res = await fetch('/api/analytics');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.renderMetrics(data);
    } catch (err) {
      console.error('Error loading analytics:', err);
    }
  },

  renderMetrics(data) {
    if (!data) return;

    const totalEl = document.getElementById('statTotalTracked');
    const companiesEl = document.getElementById('statTotalCompanies');
    const responseEl = document.getElementById('statResponseRate');
    const interviewsEl = document.getElementById('statInterviewsCount');
    const offersEl = document.getElementById('statOffersCount');

    if (totalEl) totalEl.textContent = data.total_tracked || 0;
    if (companiesEl) companiesEl.textContent = data.total_companies || 0;
    if (responseEl) responseEl.textContent = `${data.response_rate_pct || 0}%`;
    if (interviewsEl) interviewsEl.textContent = data.interview_count || 0;
    if (offersEl) offersEl.textContent = data.offer_count || 0;

    const container = document.getElementById('stagesBreakdownContainer');
    if (container && data.stages_breakdown) {
      const stages = data.stages_breakdown;
      const total = data.total_tracked || 1;

      container.innerHTML = Object.entries(stages).map(([stage, count]) => {
        const pct = Math.round((count / total) * 100);
        return `
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
              <span><strong>${stage}</strong> (${count})</span>
              <span>${pct}%</span>
            </div>
            <div style="height: 8px; background: var(--secondary-bg); border-radius: 4px; overflow: hidden;">
              <div style="width: ${pct}%; height: 100%; background: var(--primary); transition: width 0.3s ease;"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }
};
