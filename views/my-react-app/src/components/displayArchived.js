import React, { useState, useEffect } from 'react';

const ArchivedJobList = () => {
  // State to hold the list of archived jobs
  const [archivedJobs, setArchivedJobs] = useState([]);

  // State to manage any error messages
  const [error, setError] = useState(null);

  // Function to fetch archived jobs from the server
  const fetchArchivedJobs = async () => {
    try {
      // Send a request to get the list of archived jobs
      const response = await fetch('http://localhost:5001/list-archived-jobs');
      const data = await response.json();
  
      console.log("Fetched Jobs: ", data.jobs);
  
      // Filter jobs where status is 'archived'
      const archived = data.jobs.filter((job) => job.status === 'archived');
      
      console.log("Filtered Archived Jobs: ", archived);
      
      // Set the filtered archived jobs to state
      setArchivedJobs(archived);
    } catch (error) {
      // Log and show error if fetching archived jobs fails
      console.error("Error fetching archived jobs:", error);
      setError("Failed to fetch archived jobs.");
    }
  };

  // Function to unarchive a job
  const unarchiveJob = async (jobId) => {
    try {
      // Send a POST request to unarchive the selected job
      const response = await fetch('http://localhost:5001/unarchive-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobId }),  
      });

      const data = await response.json();
      if (response.ok) {
        // If the request is successful, remove the job from the archived jobs list
        setArchivedJobs(archivedJobs.filter((job) => job._id !== jobId));
        alert('Job unarchived successfully');  
      } else {
        // If the request fails, set the error message
        setError(data.message || 'Failed to unarchive the job');
      }
    } catch (error) {
      // Log and show error if unarchiving fails
      console.error('Error unarchiving job:', error);
      setError('Failed to unarchive the job.');
    }
  };

  // Use effect hook to fetch archived jobs when the component is mounted
  useEffect(() => {
    fetchArchivedJobs();
  }, []); 

  return (
    <div>
      {/* Display error message if any */}
      {error && <div>Error: {error}</div>}

      <h1>Archived Jobs</h1>

      <ul>
        {/* If no archived jobs, show a message */}
        {archivedJobs.length === 0 ? (
          <li>No archived jobs available.</li>
        ) : (
          // Otherwise, list all archived jobs
          archivedJobs.map((job) => (
            <li key={job._id || job.description}> 
              <p><strong>ID:</strong> {job._id}</p>
              <p><strong>Description:</strong> {job.description}</p>
              <p><strong>Status:</strong> {job.status}</p>
              <p><strong>Archived At:</strong> {job.archivedAt ? new Date(job.archivedAt).toLocaleString() : 'Not available'}</p>
              {/* Button to unarchive the job */}
              <button onClick={() => unarchiveJob(job._id)}>Unarchive</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ArchivedJobList;



