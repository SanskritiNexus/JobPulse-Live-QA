/**
 * Main Frontend Application Entry Point
 * Orchestrates Tab Navigation, Job Search, Modal handling, and Modules.
 */

import { AuthModule } from './auth.js';
import { JobsModule } from './jobs.js';
import { TrackerModule } from './tracker.js';
import { DashboardModule } from './dashboard.js';

class JobPulseApp {
  async init() {
    AuthModule.init();
    this.bindTabNavigation();
    this.bindTrackModal();

    // Initialize Tracker and fetch tracked job IDs
    await TrackerModule.init();
    const trackedSet = TrackerModule.getTrackedSet();

    // Initialize Jobs module and perform initial search
    await JobsModule.init();
    await JobsModule.executeSearch(trackedSet);

    // Wire track job clicks on cards
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

  bindTabNavigation() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', async () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const targetId = tab.dataset.target;
        document.querySelectorAll('.tab-content').forEach(view => view.classList.remove('active'));

        const targetView = document.getElementById(targetId);
        if (targetView) targetView.classList.add('active');

        if (targetId === 'viewTracker') {
          await TrackerModule.loadApplications();
        } else if (targetId === 'viewAnalytics') {
          await DashboardModule.loadAnalytics();
        }
      });
    });
  }

  openTrackModal(job) {
    const modal = document.getElementById('trackJobModal');
    if (!modal) return;

    document.getElementById('modalJobId').value = job.id;
    document.getElementById('modalSourceUrl').value = job.source_url || '#';
    document.getElementById('modalSourceName').value = job.source_name || 'Adzuna API';
    document.getElementById('modalTitle').value = job.title;
    document.getElementById('modalCompany').value = job.company;
    document.getElementById('modalLocation').value = job.location || 'India';
    document.getElementById('modalStage').value = 'Wishlist';
    document.getElementById('modalSalary').value = JobsModule.formatSalary(job.salary_min, job.salary_max, job.salary_currency);
    document.getElementById('modalNotes').value = `Found via ${job.source_name} on ${new Date().toLocaleDateString()}`;

    modal.classList.add('active');
  }

  bindTrackModal() {
    const modal = document.getElementById('trackJobModal');
    const closeBtn = document.getElementById('btnCloseModal');
    const cancelBtn = document.getElementById('btnCancelModal');
    const form = document.getElementById('trackJobForm');

    const closeModal = () => modal?.classList.remove('active');

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          job_id: document.getElementById('modalJobId').value,
          title: document.getElementById('modalTitle').value,
          company: document.getElementById('modalCompany').value,
          location: document.getElementById('modalLocation').value,
          stage: document.getElementById('modalStage').value,
          source_url: document.getElementById('modalSourceUrl').value,
          source_name: document.getElementById('modalSourceName').value,
          salary: document.getElementById('modalSalary').value,
          notes: document.getElementById('modalNotes').value
        };

        try {
          const res = await fetch('/api/applications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Failed to save application');

          TrackerModule.showToast(`Saved "${payload.title}" to Tracker!`, 'success');
          closeModal();
          await TrackerModule.loadApplications();
          const updatedTrackedSet = TrackerModule.getTrackedSet();
          await JobsModule.executeSearch(updatedTrackedSet);
        } catch (err) {
          TrackerModule.showToast(`Error: ${err.message}`, 'error');
        }
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new JobPulseApp();
  app.init();
});
