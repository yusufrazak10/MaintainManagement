const express = require('express');
const path = require('path');
const { archiveJob, batchUpdateJobStatuses, updateJobInfo, listJobs, createJob, listArchivedJobs, unarchiveJob  } = require(path.resolve(__dirname, '../views/my-react-app/src/controllers/jobController'));

// Initialize the router
const router = express.Router();

// Define the routes
router.post('/create-job', createJob);  
router.get('/list-jobs', listJobs);  
router.get('/list-archived-jobs', listArchivedJobs); 
router.put('/update-job-info', updateJobInfo);  
router.put('/update-job-statuses', batchUpdateJobStatuses);  
router.post('/archive-job', archiveJob);  
router.post('/unarchive-job', unarchiveJob); 

// Export routes.
module.exports = router;


