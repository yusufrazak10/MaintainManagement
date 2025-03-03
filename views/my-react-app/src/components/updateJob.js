import React, { useState, useEffect } from 'react';

const UpdateJob = () => {
  // State to hold the list of jobs fetched from the server
  const [jobs, setJobs] = useState([]);
  
  // State to hold the job ID entered by the user for updating a job
  const [jobIdToUpdate, setJobIdToUpdate] = useState('');
  
  // State to manage the job fields (description, location, priority, status) for updating
  const [updatedJob, setUpdatedJob] = useState({
    description: '',
    location: '',
    priority: '',
    status: ''
  });
  
  // State to store error messages
  const [error, setError] = useState('');
  
  // State to store success messages
  const [success, setSuccess] = useState('');

  // Fetch all jobs when the component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Fetch jobs from the backend API
        const response = await fetch('http://localhost:5001/list-jobs'); 
        const data = await response.json();
        
        // If data is fetched successfully, set the jobs in state
        if (data) {
          setJobs(data.jobs);  
        }
      } catch (error) {
        // Log error if fetching fails
        console.error("Error fetching jobs:", error);
      }
    };
    
    fetchJobs();
  }, []); 

  // Handle the input change for the Job ID field
  const handleJobIdChange = (event) => {
    // Set the entered Job ID in state
    setJobIdToUpdate(event.target.value);  
  };

  // Fetch the job details based on the entered Job ID
  const handleJobFetch = () => {
    const job = jobs.find(job => job._id === jobIdToUpdate);  
    if (job) {
      // Set the job details in the updatedJob state
      setUpdatedJob({
        description: job.description,
        location: job.location,
        priority: job.priority,
        status: job.status
      });
    } else {
      // If no job is found, set an error message
      setError('Job not found with the entered ID');
    }
  };

  // Handle input changes for the job update form fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    
    // Update the updatedJob state with the new value of the respective field
    setUpdatedJob(prevJob => ({
      ...prevJob,
      [name]: value 
    }));
  };

  // Handle form submission for updating the job
  const handleUpdate = (event) => {
    // Prevent page refresh on form submission
    event.preventDefault();  

    setError('');  
    setSuccess(''); 

    // Prepare the job data to be updated
    const jobData = {
      jobId: jobIdToUpdate,  
      description: updatedJob.description,
      location: updatedJob.location,
      priority: updatedJob.priority,
      status: updatedJob.status
    };

    // Send a PUT request to update the job information on the server
    fetch('http://localhost:5001/update-job-info', {  
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)  
    })
    .then(response => response.json())  
    .then(() => {
      // On success, display a success message
      setSuccess('Job updated successfully!');
      
      // Reset the form fields after a successful update
      setUpdatedJob({
        description: '',
        location: '',
        priority: '',
        status: ''
      });
      // Clear the Job ID input field after successful update
      setJobIdToUpdate('');  
    })
    .catch((error) => {
      // If an error occurs, display an error message
      console.error('Error updating job:', error);
      setError('Failed to update job. Please try again!');
    });
  };

  return (
    <div>
      <h1>Update Job</h1>

      {/* Display success message if job is updated successfully */}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      
      {/* Display error message if any error occurs */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Input field for Job ID */}
      <div>
        <label>Enter Job ID to Update:</label>
        <input 
          type="text" 
          value={jobIdToUpdate}
          onChange={handleJobIdChange}  
          placeholder="Enter Job ID"
        />
        <button onClick={handleJobFetch}>Fetch Job</button>  {/* Button to fetch job details based on Job ID */}
      </div>

      {/* If a job is selected and fetched, show the update form */}
      {jobIdToUpdate && updatedJob.description && (
        <form onSubmit={handleUpdate}>
          {/* Input field for updating job description */}
          <div>
            <label>Description:</label>
            <input
              type="text"
              name="description"
              value={updatedJob.description}
              onChange={handleInputChange}  
            />
          </div>
          
          {/* Input field for updating job location */}
          <div>
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={updatedJob.location}
              onChange={handleInputChange}  
            />
          </div>
          
          {/* Dropdown to select job priority */}
          <div>
            <label>Priority:</label>
            <select
              name="priority"
              value={updatedJob.priority}
              onChange={handleInputChange}  
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          {/* Dropdown to select job status */}
          <div>
            <label>Status:</label>
            <select
              name="status"
              value={updatedJob.status}
              onChange={handleInputChange}  
            >
              <option value="submitted">Submitted</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Submit button to update the job */}
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default UpdateJob;







