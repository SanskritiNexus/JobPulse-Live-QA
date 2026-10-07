const { loadApplications } = require('../database/jsonStore');

const getAnalytics = (req, res) => {
  const apps = loadApplications();
  const total = apps.length;
  const stages = { Wishlist: 0, Applied: 0, Interviewing: 0, Offer: 0, Rejected: 0 };
  const companies = new Set();

  for (const a of apps) {
    const st = a.stage || 'Wishlist';
    stages[st] = (stages[st] || 0) + 1;
    if (a.company) {
      companies.add(String(a.company).trim());
    }
  }

  const appliedCount = (stages.Applied || 0) + (stages.Interviewing || 0) + (stages.Offer || 0) + (stages.Rejected || 0);
  const interviewCount = (stages.Interviewing || 0) + (stages.Offer || 0);
  const responseRate = appliedCount > 0 ? parseFloat(((interviewCount / appliedCount) * 100).toFixed(1)) : 0;

  return res.json({
    total_tracked: total,
    total_companies: companies.size,
    response_rate_pct: responseRate,
    stages_breakdown: stages,
    offer_count: stages.Offer || 0,
    interview_count: stages.Interviewing || 0
  });
};

module.exports = {
  getAnalytics
};
