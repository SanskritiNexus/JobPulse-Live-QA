const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobsController');

router.get('/provider/status', jobsController.getProviderStatus);
router.get('/jobs/search', jobsController.searchJobs);

module.exports = router;
