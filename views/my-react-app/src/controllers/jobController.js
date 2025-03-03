const { Job, jobStatusEnum, jobPriorityEnum } = require('../../../../models/jobModel');

// Function to create a new job
exports.createJob = async function(req, res) {
  try {
    // Validate that the required 'description' field is provided and is a non-empty string
    if (!req.body.description || typeof req.body.description !== 'string' || req.body.description.trim() === '') {
      return res.status(400).send({ message: "Description is required and must be a non-empty string." });
    }

    // Validate that the required 'location' field is provided and is a non-empty string
    if (!req.body.location || typeof req.body.location !== 'string' || req.body.location.trim() === '') {
      return res.status(400).send({ message: "Location is required and must be a non-empty string." });
    }

    // Validate the 'priority' field
    if (!jobPriorityEnum.includes(req.body.priority)) {
      return res.status(400).send({ message: "Invalid priority value. Valid options are: 'low', 'medium', 'high'." });
    }

    // Validate the 'status' field if provided (allowing only 'submitted', 'in progress', or 'completed')
    if (req.body.status && !['submitted', 'in progress', 'completed'].includes(req.body.status)) {
      return res.status(400).send({ message: "Invalid status value. Valid options are: 'submitted', 'in progress', 'completed'." });
    }

    // Create a new job object with the provided data
    const jobModel = new Job({
      description: req.body.description,
      location: req.body.location,
      priority: req.body.priority,
      // Default to 'submitted' if status is not provided
      status: req.body.status || 'submitted', 
      submittedAt: Date.now(),
      updatedAt: Date.now()
    });
    
    // Save the new job to the database 
    const savedJob = await jobModel.save();  

    // Return a success message and the saved job object
    res.status(201).send({ message: 'The job has been successfully created.', job: savedJob });

  } catch (err) {
    // Handle any errors that occur during job creation
    console.error('Error saving job:', err);
    res.status(500).send({ message: "An error occurred while creating the job.", error: err.message });
  }
};

// Function to list jobs with optional status filtering
exports.listJobs = async function(req, res) {
  // Custom status order
  const statusOrder = ['submitted', 'in progress', 'completed'];  

  // Validate the 'status' query parameter
  const status = req.query.status;
  if (status && !statusOrder.includes(status)) {
    return res.status(400).send({ message: "Invalid status provided. Valid statuses are 'submitted', 'in progress', or 'completed'." });
  }

  // Build the query to exclude archived jobs
  const query = { status: { $ne: 'archived' } };
  if (status) {
    // Apply the status filter if provided
    query.status = status;  
  }

  try {
    // Fetch the jobs matching the query
    const jobs = await Job.find(query);

    // Sort the jobs based on the custom status order and the 'submittedAt' field in descending order
    jobs.sort((a, b) => {
      // Compare the jobs based on their status order first
      const statusComparison = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      if (statusComparison !== 0) return statusComparison;

      // If the statuses are the same, compare by the 'submittedAt' field
      return b.submittedAt - a.submittedAt;  
    });

    // Return the sorted list of jobs
    res.status(200).send({ message: 'Jobs fetched successfully.', jobs: jobs });
  } catch (err) {
    // Handle any errors that occur while fetching jobs
    console.log('Error fetching jobs:', err);
    return res.status(500).send({ message: "An error occurred while fetching the jobs." });
  }
};

// Function to update job information
exports.updateJobInfo = async function(req, res) {
  const { jobId, description, location, priority, status } = req.body;

  // Validate input fields
  if (!jobId) {
    return res.status(400).send({ message: "Job ID is required." });
  }
  if (!description || description.trim() === '') {
    return res.status(400).send({ message: "Description is required." });
  }
  if (!location || location.trim() === '') {
    return res.status(400).send({ message: "Location is required." });
  }
  if (!priority || !jobPriorityEnum.includes(priority)) {
    return res.status(400).send({ message: "Valid priority is required. (low, medium, high)" });
  }

  // Prepare the data to update
  let updateData = {
    description,
    location,
    priority,
    // Default to 'submitted' if no status is provided
    status: status || 'submitted',  
    updatedAt: Date.now(), 
  };

  try {
    // Find the job by its ID and update it
    const job = await Job.findByIdAndUpdate(jobId, updateData, { new: true });
    
    if (!job) {
      return res.status(404).send({ message: "Job not found." });
    }

    // Return a success message
    res.status(200).send({ message: 'Job updated successfully.' });
  } catch (err) {
    // Handle any errors that occur during job update
    console.log('Error updating job:', err);
    return res.status(500).send({ message: "An error occurred while updating the job." });
  }
};

// Function to batch update the status of multiple jobs
exports.batchUpdateJobStatuses = async function(req, res) {
  const { jobIds, status } = req.body;

  // Validate inputs
  if (!jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
    return res.status(400).send({ message: "Job IDs are required and must be an array." });
  }

  // Query for jobs that match the provided job IDs
  let query = { _id: { $in: jobIds } };

  try {
    // Use `updateMany` to update the status of the jobs
    const result = await Job.updateMany(query, { status: status });

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "No jobs found to update." });
    }
    if (result.modifiedCount === 0) {
      return res.status(200).send({ message: "Jobs were found but none were updated (status may already be the same)." });
    }

    // Return a success message
    res.status(200).send({ message: 'Job updated successfully.' });

  } catch (err) {
    // Handle any errors that may occur
    console.log('Error updating job:', err);
    return res.status(500).send({ message: "An error occurred while updating the job." });
  }
};

// Function to archive a job
exports.archiveJob = async function(req, res) {
  const { jobId } = req.body;  

  // Validate inputs
  if (!jobId || typeof jobId !== 'string') {
    return res.status(400).send({ message: "Job ID is required and must be a string." });
  }

  // Query by job ID
  let query = { _id: jobId };  
  let updateData = {  
    status: 'archived',
    updatedAt: Date.now(),
    archivedAt: Date.now()
  };

  try {
    // Update the job to set its status to 'archived'
    const result = await Job.updateOne(query, updateData);

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Job not found or already archived." });
    }

    // Return a success message
    res.status(200).send({ message: "Job archived successfully." });

  } catch (err) {
    // Handle any errors that occur during job archiving
    console.log('Error archiving job:', err);
    return res.status(500).send({ message: "An error occurred while archiving the job." });
  }
};

// Function to fetch only archived jobs
exports.listArchivedJobs = async function(req, res) {
  try {
    // Fetch jobs with the status 'archived'
    const archivedJobs = await Job.find({ status: 'archived' });

    // Return the list of archived jobs
    res.status(200).send({ message: 'Archived jobs fetched successfully.', jobs: archivedJobs });
  } catch (err) {
    // Handle any errors that occur while fetching archived jobs
    console.log('Error fetching archived jobs:', err);
    return res.status(500).send({ message: "An error occurred while fetching the archived jobs." });
  }
};

// Function to unarchive a job
exports.unarchiveJob = async function(req, res) {
  const { jobId } = req.body;  

  // Validate inputs
  if (!jobId || typeof jobId !== 'string') {
    return res.status(400).send({ message: "Job ID is required and must be a string." });
  }

  // Ensure the job is archived
  let query = { _id: jobId, status: 'archived' };  
  let updateData = { 
    // Change the status back to 'submitted' 
    status: 'submitted',  
    updatedAt: Date.now(),
    archivedAt: null  
  };

  try {
    // Update the job to unarchive it
    const result = await Job.updateOne(query, updateData);

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Job not found or it's not archived." });
    }

    // Return a success message
    res.status(200).send({ message: "Job unarchived successfully." });

  } catch (err) {
    // Handle any errors that may occur during job unarchiving
    console.log('Error unarchiving job:', err);
    return res.status(500).send({ message: "An error occurred while unarchiving the job." });
  }
};







  

