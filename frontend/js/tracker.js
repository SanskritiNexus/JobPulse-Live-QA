/**
 * Tracker Module
 * Manages the Kanban application tracking board & backend REST CRUD.
 */

export const TrackerModule = {
  applications: [],

  async init() {
    await this.loadApplications();
    this.setupEventListeners();
  },

  async loadApplications() {
    try {
      const res = await fetch('/api/applications');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.applications = data.applications || [];
      this.renderKanban();
      return this.applications;
    } catch (err) {
      console.error('Error loading applications:', err);
      this.applications = [];
      return [];
    }
  },

  getTrackedSet() {
    return new Set(this.applications.map(a => a.job_id).filter(Boolean));
  },

  renderKanban() {
    const stages = ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

    stages.forEach(stage => {
      const containerId = `cards${stage}`;
      const countId = `count${stage}`;
      const container = document.getElementById(containerId);
      const countBadge = document.getElementById(countId);

      if (!container) return;

      const stageApps = this.applications.filter(a => a.stage === stage);
      if (countBadge) countBadge.textContent = stageApps.length;

      if (stageApps.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 30px 10px; color: var(--text-muted); font-size: 0.8rem;">
            Empty stage
          </div>
        `;
        return;
      }

      container.innerHTML = stageApps.map(app => `
        <div class="kanban-card" data-app-id="${app.id}">
          <div class="kanban-card-title">${app.title}</div>
          <div class="kanban-card-meta">🏢 ${app.company} • ${app.location || 'India'}</div>

          <div style="font-size: 0.78rem; color: var(--primary); font-weight: 600; margin-bottom: 6px;">
            💰 ${app.salary || 'Salary not specified'}
          </div>

          ${app.notes ? `
            <div style="font-size: 0.78rem; color: var(--text-muted); background: var(--secondary-bg); padding: 6px; border-radius: 4px; margin-bottom: 8px;">
              📝 ${app.notes}
            </div>
          ` : ''}

          <div class="kanban-card-actions">
            <select class="form-control select-stage" data-app-id="${app.id}" style="padding: 2px 6px; font-size: 0.75rem;">
              <option value="Wishlist" ${app.stage === 'Wishlist' ? 'selected' : ''}>Wishlist</option>
              <option value="Applied" ${app.stage === 'Applied' ? 'selected' : ''}>Applied</option>
              <option value="Interviewing" ${app.stage === 'Interviewing' ? 'selected' : ''}>Interviewing</option>
              <option value="Offer" ${app.stage === 'Offer' ? 'selected' : ''}>Offer</option>
              <option value="Rejected" ${app.stage === 'Rejected' ? 'selected' : ''}>Rejected</option>
            </select>

            <div style="display: flex; gap: 4px;">
              <button type="button" class="btn-secondary btn-edit-notes" data-app-id="${app.id}" style="padding: 2px 6px; font-size: 0.75rem;" title="Edit Notes">✏️</button>
              <button type="button" class="btn-secondary btn-delete-app" data-app-id="${app.id}" style="padding: 2px 6px; font-size: 0.75rem; color: var(--danger);" title="Remove">🗑️</button>
            </div>
          </div>
        </div>
      `).join('');
    });
  },

  setupEventListeners() {
    document.addEventListener('change', async (e) => {
      if (e.target.classList.contains('select-stage')) {
        const appId = e.target.dataset.appId;
        const newStage = e.target.value;
        try {
          const res = await fetch(`/api/applications/${appId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stage: newStage })
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          this.showToast(`Stage updated to ${newStage}`, 'success');
          await this.loadApplications();
        } catch (err) {
          this.showToast(`Error updating stage: ${err.message}`, 'error');
        }
      }
    });

    document.addEventListener('click', async (e) => {
      const deleteBtn = e.target.closest('.btn-delete-app');
      if (deleteBtn) {
        const appId = deleteBtn.dataset.appId;
        if (confirm('Are you sure you want to remove this tracked job application?')) {
          try {
            const res = await fetch(`/api/applications/${appId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            this.showToast('Application removed', 'success');
            await this.loadApplications();
          } catch (err) {
            this.showToast(`Error removing application: ${err.message}`, 'error');
          }
        }
      }

      const editBtn = e.target.closest('.btn-edit-notes');
      if (editBtn) {
        const appId = editBtn.dataset.appId;
        const app = this.applications.find(a => a.id === appId);
        if (app) {
          const newNotes = prompt('Update notes for this job:', app.notes || '');
          if (newNotes !== null) {
            try {
              const res = await fetch(`/api/applications/${appId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes: newNotes })
              });
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              this.showToast('Notes updated successfully', 'success');
              await this.loadApplications();
            } catch (err) {
              this.showToast(`Error saving notes: ${err.message}`, 'error');
            }
          }
        }
      }
    });
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};
