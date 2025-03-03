import React, { useState } from 'react';

const ArchiveJob = () => {
  // State to hold the job ID entered by the user
  const [jobId, setJobId] = useState('');  

  // State to store any error messages
  const [error, setError] = useState('');   

  // State to store success messages after job is archived
  const [success, setSuccess] = useState(''); 

  // Function to fetch jobs from the server (for listing jobs or refreshing data)
  const fetchJobs = async () => {
    try {
      // Make an API call to fetch the list of jobs
      const response = await fetch('http://localhost:5001/list-jobs');
      const data = await response.json();
      // Log the list of jobs to the console
      console.log(data.jobs);  
    } catch (error) {
      // Handle error in case of failed fetch
      console.error("Error fetching jobs:", error); 
    }
  };

  // Handle change in the job ID input field
  const handleInputChange = (event) => {
    const { value } = event.target;
    // Set the value of jobId state when user types
    setJobId(value);  
  };

  // Handle form submission to archive a job
  const handleUnarchive = (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();  
    
    // Reset previous success or error messages before performing a new action
    setError('');
    setSuccess('');

    // Check if the jobId is provided; if not, show an error message
    if (!jobId) {
      setError("Job ID is required.");
      // Exit the function early if jobId is empty
      return;  
    }

    // Send a POST request to the backend to archive the job
    fetch('http://localhost:5001/archive-job', {
      method: 'POST',  
      headers: {
        'Content-Type': 'application/json',  
      },
      body: JSON.stringify({ jobId }) 
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to archive job. Server response not OK.');
      }
      // Parse the response as JSON if it's successful
      return response.json();  
    })
    .then(() => {
      // On success, set the success message and optionally refresh the job list
      setSuccess('Job archived successfully!');
      // Refresh the list of jobs
      fetchJobs(); 
      // Reset the job ID field after successful archive
      setJobId(''); 
    })
    .catch((error) => {
      // Handle any errors that occur during the fetch or response parsing
      setError(`Failed to archive job. Error: ${error.message}`);
    });
  };

  return (
    <div>
      <h1>Archive Job</h1>

      {/* Display success message if job was archived successfully */}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {/* Display error message if there was a failure in archiving */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Form to input the job ID and submit the archive request */}
      <form onSubmit={handleUnarchive}>
        <div>
          <label>Job ID:</label>
          <input
            type="text"
            name="jobId"
            value={jobId}  
            onChange={handleInputChange}  
            placeholder="Enter Job ID to Archive"  
          />
        </div>
        <button type="submit">Archive</button>  
      </form>
    </div>
  );
};

export default ArchiveJob;



