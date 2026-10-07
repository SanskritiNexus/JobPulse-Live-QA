/**
 * Application Tracker Kanban Board Module
 */

import { ApiService } from './api.js';
import { Components } from './components.js';

export const TrackerModule = {
  applications: [],

  async init() {
    await this.loadApplications();
    this.setupEventListeners();
  },

  async loadApplications() {
    const data = await ApiService.getApplications();
    this.applications = data.applications || [];
    this.renderKanban();
    this.updateStatsBar();
  },

  updateStatsBar() {
    const totalEl = document.getElementById('stat-total-tracked');
    const interviewEl = document.getElementById('stat-interviews');
    const offerEl = document.getElementById('stat-offers');

    if (totalEl) totalEl.textContent = this.applications.length;
    if (interviewEl) {
      const count = this.applications.filter(a => a.stage === 'Interviewing').length;
      interviewEl.textContent = count;
    }
    if (offerEl) {
      const count = this.applications.filter(a => a.stage === 'Offer').length;
      offerEl.textContent = count;
    }
  },

  renderKanban() {
    const stages = ['Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected'];
    
    stages.forEach(stage => {
      const colId = `kanban-col-${stage.toLowerCase()}`;
      const container = document.getElementById(colId);
      const countBadge = document.getElementById(`count-${stage.toLowerCase()}`);

      if (!container) return;

      const stageApps = this.applications.filter(a => a.stage === stage);
      if (countBadge) countBadge.textContent = stageApps.length;

      if (stageApps.length === 0) {
        container.innerHTML = `
          <div style="text-align: center; padding: 40px 10px; color: var(--text-muted); font-size: 0.85rem;">
            No positions in ${stage}
          </div>
        `;
        return;
      }

      container.innerHTML = stageApps.map(app => `
        <div class="glass-card kanban-card" data-app-id="${app.id}" draggable="true">
          <div class="card-title">${app.title}</div>
          <div class="card-company">🏢 ${app.company} • <span style="color: var(--text-muted);">${app.location}</span></div>
          
          <div style="font-size: 0.78rem; color: var(--accent-cyan); margin-bottom: 8px;">
            💰 ${app.salary || 'Salary not specified'}
          </div>

          ${app.notes ? `<div style="font-size: 0.78rem; color: var(--text-secondary); background: rgba(0,0,0,0.2); padding: 6px 10px; border-radius: 6px; margin-bottom: 10px; line-height: 1.4;">
            📝 ${app.notes}
          </div>` : ''}

          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 10px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.06);">
            <select class="glass-input select-stage" data-app-id="${app.id}" style="padding: 2px 6px; font-size: 0.75rem;">
              <option value="Wishlist" ${app.stage === 'Wishlist' ? 'selected' : ''}>Wishlist</option>
              <option value="Applied" ${app.stage === 'Applied' ? 'selected' : ''}>Applied</option>
              <option value="Interviewing" ${app.stage === 'Interviewing' ? 'selected' : ''}>Interviewing</option>
              <option value="Offer" ${app.stage === 'Offer' ? 'selected' : ''}>Offer</option>
              <option value="Rejected" ${app.stage === 'Rejected' ? 'selected' : ''}>Rejected</option>
            </select>

            <div style="display: flex; gap: 4px;">
              <button class="glass-button-secondary btn-edit-notes" data-app-id="${app.id}" style="padding: 4px 8px; font-size: 0.75rem;" title="Edit Notes">✏️</button>
              <button class="glass-button-secondary btn-delete-app" data-app-id="${app.id}" style="padding: 4px 8px; font-size: 0.75rem; color: var(--accent-rose);" title="Remove">🗑️</button>
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
          await ApiService.updateApplication(appId, { stage: newStage });
          Components.showToast(`Application stage updated to ${newStage}`, 'success');
          await this.loadApplications();
        } catch (err) {
          Components.showToast(`Failed to update stage: ${err.message}`, 'error');
        }
      }
    });

    document.addEventListener('click', async (e) => {
      const deleteBtn = e.target.closest('.btn-delete-app');
      if (deleteBtn) {
        const appId = deleteBtn.dataset.appId;
        if (confirm('Are you sure you want to remove this job from your application tracker?')) {
          try {
            await ApiService.deleteApplication(appId);
            Components.showToast('Application removed', 'info');
            await this.loadApplications();
          } catch (err) {
            Components.showToast(`Error: ${err.message}`, 'error');
          }
        }
      }

      const editBtn = e.target.closest('.btn-edit-notes');
      if (editBtn) {
        const appId = editBtn.dataset.appId;
        const app = this.applications.find(a => a.id === appId);
        if (app) {
          const newNotes = prompt('Update notes for this application:', app.notes || '');
          if (newNotes !== null) {
            try {
              await ApiService.updateApplication(appId, { notes: newNotes });
              Components.showToast('Notes saved successfully', 'success');
              await this.loadApplications();
            } catch (err) {
              Components.showToast(`Error updating notes: ${err.message}`, 'error');
            }
          }
        }
      }
    });
  }
};
