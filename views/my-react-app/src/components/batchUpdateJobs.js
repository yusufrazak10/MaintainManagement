import React, { useState, useEffect } from 'react';

const BatchUpdateJob = () => {
  // State to hold the list of jobs
  const [jobs, setJobs] = useState([]);

  // State to track selected jobs for batch update
  const [selectedJobs, setSelectedJobs] = useState([]);  

  // State to hold the selected status for updating jobs
  const [status, setStatus] = useState('');  

  // State to manage error messages
  const [error, setError] = useState('');

  // State to manage success messages
  const [success, setSuccess] = useState('');

  // Fetch jobs from the API when the component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Make an API call to fetch the list of jobs
        const response = await fetch('http://localhost:5001/list-jobs');
        const data = await response.json();
        setJobs(data.jobs);  
      } catch (error) {
        console.error("Error fetching jobs:", error); 
      }
    };
    // Call the fetchJobs function.
    fetchJobs();  
  }, []);  

  // Handle job selection (checkbox click)
  const handleJobSelection = (event, jobId) => {
    // Add or remove jobId from selectedJobs based on checkbox status
    if (event.target.checked) {
      setSelectedJobs(prevState => [...prevState, jobId]);
    } else {
      setSelectedJobs(prevState => prevState.filter(id => id !== jobId));
    }
  };

  // Handle change in status selection dropdown
  const handleStatusChange = (event) => {
    // Set the status to the selected value
    setStatus(event.target.value);  
  };

  // Handle batch update form submission
  const handleBatchUpdate = (event) => {
    // Prevent default form submission behavior
    event.preventDefault(); 

    // Reset previous error message
    setError('');  
    // Reset previous success message
    setSuccess('');  

    // Check if at least one job is selected
    if (selectedJobs.length === 0) {
      setError('Please select at least one job to update.');  
      return;
    }

    // Prepare the data for batch update
    const jobData = {
      jobIds: selectedJobs,  
      status: status          
    };

    // Send PUT request to update selected jobs' status
    fetch('http://localhost:5001/update-job-statuses', {
      method: 'PUT',  
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)  
    })
    .then(response => response.json())  
    .then(data => {
      setSuccess(data.message || 'Jobs updated successfully!');  
      // Clear selected jobs after successful update
      setSelectedJobs([]);  
    })
    .catch((error) => {
      console.error('Error updating jobs:', error);  
      // Show error message if update fails
      setError('Failed to update jobs. Please try again!');  
    });
  };

  return (
    <div>
      <h1>Batch Update Job Statuses</h1>

      {/* Display success message if jobs were updated successfully */}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {/* Display error message if there was an issue with the batch update */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Form to update the status of selected jobs */}
      <form onSubmit={handleBatchUpdate}>
        <div>
          <label>Status:</label>
          <select name="status" value={status} onChange={handleStatusChange}>
            <option value="submitted">Submitted</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <h2>Select Jobs to Update</h2>
          {/* Loop through the jobs array and display a checkbox for each job */}
          {jobs.map(job => (
            <div key={job.id}>
              <input
                type="checkbox"
                id={`job-${job._id}`}
                // Handle checkbox click
                onChange={(e) => handleJobSelection(e, job._id)}  
              />
              <label htmlFor={`job-${job._id}`}>{job.description}</label>
            </div>
          ))}
        </div>

        {/* Button to submit the batch update form */}
        <button type="submit">Update Selected Jobs</button>
      </form>
    </div>
  );
};

export default BatchUpdateJob;


