const express = require('express');
const router = express.Router();
const applicationsController = require('../controllers/applicationsController');

router.get('/applications', applicationsController.getApplications);
router.post('/applications', applicationsController.createApplication);
router.put('/applications/:id', applicationsController.updateApplication);
router.delete('/applications/:id', applicationsController.deleteApplication);

module.exports = router;
