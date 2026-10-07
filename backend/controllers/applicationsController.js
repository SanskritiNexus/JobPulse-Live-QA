const crypto = require('crypto');
const { loadApplications, saveApplications } = require('../database/jsonStore');

const getApplications = (req, res) => {
  const apps = loadApplications();
  return res.json({
    success: true,
    count: apps.length,
    applications: apps
  });
};

const createApplication = (req, res) => {
  const data = req.body || {};
  if (!data.title || !data.company) {
    return res.status(400).json({
      success: false,
      error: 'Title and Company are required fields.'
    });
  }

  const apps = loadApplications();

  // Check if job already saved to prevent duplicates
  const jobId = data.job_id;
  if (jobId && apps.some(a => a.job_id === jobId)) {
    return res.status(409).json({
      success: false,
      error: 'This job listing is already in your application tracker.'
    });
  }

  const newApp = {
    id: `app-${crypto.randomBytes(4).toString('hex')}`,
    job_id: jobId || null,
    title: String(data.title).trim(),
    company: String(data.company).trim(),
    location: String(data.location || 'India').trim(),
    stage: String(data.stage || 'Wishlist').trim(),
    source_url: String(data.source_url || '#').trim(),
    source_name: String(data.source_name || 'Live Job API').trim(),
    salary: String(data.salary || '').trim() || 'Not Specified',
    applied_date: data.applied_date || new Date().toISOString().split('T')[0],
    notes: String(data.notes || '').trim(),
    updated_at: new Date().toISOString()
  };

  apps.unshift(newApp);
  saveApplications(apps);

  return res.status(201).json({
    success: true,
    application: newApp
  });
};

const updateApplication = (req, res) => {
  const { id } = req.params;
  const data = req.body || {};
  const apps = loadApplications();

  const targetIdx = apps.findIndex(a => a.id === id);
  if (targetIdx === -1) {
    return res.status(404).json({
      success: false,
      error: 'Application not found.'
    });
  }

  const target = apps[targetIdx];
  if (data.stage !== undefined) target.stage = String(data.stage).trim();
  if (data.notes !== undefined) target.notes = String(data.notes).trim();
  if (data.salary !== undefined) target.salary = String(data.salary).trim();
  if (data.applied_date !== undefined) target.applied_date = data.applied_date;
  if (data.title !== undefined) target.title = String(data.title).trim();
  if (data.company !== undefined) target.company = String(data.company).trim();
  if (data.location !== undefined) target.location = String(data.location).trim();

  target.updated_at = new Date().toISOString();
  apps[targetIdx] = target;
  saveApplications(apps);

  return res.json({
    success: true,
    application: target
  });
};

const deleteApplication = (req, res) => {
  const { id } = req.params;
  const apps = loadApplications();

  const newApps = apps.filter(a => a.id !== id);
  if (newApps.length === apps.length) {
    return res.status(404).json({
      success: false,
      error: 'Application not found.'
    });
  }

  saveApplications(newApps);
  return res.json({
    success: true,
    message: 'Application removed successfully.'
  });
};

module.exports = {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication
};
