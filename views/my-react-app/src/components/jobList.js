import React, { useState, useEffect } from 'react';

const JobList = () => {
  // State to hold the list of jobs fetched from the server
  const [jobs, setJobs] = useState([]);
  
  // State to manage any error messages
  const [error, setError] = useState(null);

  // State to hold the selected status filter
  const [selectedStatus, setSelectedStatus] = useState('');

  // Function to fetch jobs from the server using async/await
  const fetchJobs = async (status = '') => {
    try {
      // Send a request to get the list of jobs, including the status filter if provided
      const response = await fetch(`http://localhost:5001/list-jobs?status=${status}`);
      const data = await response.json();
      // Set the jobs data to state once fetched successfully
      setJobs(data.jobs); 
    } catch (error) {
      // Log and handle error if fetching jobs fails
      console.error("Error fetching jobs:", error);
      // Set error message to state
      setError(error.message); 
    }
  };

  // useEffect hook to fetch jobs when the component mounts or when the selectedStatus changes
  useEffect(() => {
    // Fetch jobs from the API using fetch and the selectedStatus filter
    fetch('http://localhost:5001/list-jobs')  
      .then((response) => {
        // If the response is not ok, throw an error
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();  
      })
      .then((data) => {
        // Set the jobs data to state once fetched successfully
        setJobs(data.jobs);  
      })
      .catch((error) => {
        // Handle error if fetching jobs fails
        setError(error.message); 
      });
  }, []);  // This effect runs once when the component mounts

  // Handle status filter change
  const handleStatusChange = (event) => {
    // Update selected status
    setSelectedStatus(event.target.value); 
    // Call fetchJobs with the selected status to filter jobs
    fetchJobs(event.target.value); 
  };

  return (
    <div>
      {/* Status filter dropdown */}
      <div>
        <label htmlFor="status-filter">Filter by Status: </label>
        <select id="status-filter" value={selectedStatus} onChange={handleStatusChange}>
          <option value="">All</option>
          <option value="submitted">Submitted</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Display error message if there is any */}
      {error && <div>Error: {error}</div>}
      
      <ul>
        {/* If no jobs are available, display a message */}
        {jobs.length === 0 ? (
          <li>No jobs available.</li>  
        ) : (
          // If jobs are available, display them in a list
          jobs.map((job) => (
            <li key={job._id}> {/* Use job._id as the unique key */}
              <div>
                {/* Display job ID */}
                <p><strong>ID:</strong> {job._id}</p>
                {/* Display job description, fallback to 'No description available' if it's empty */}
                <p><strong>Description:</strong> {job.description || 'No description available'}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Priority:</strong> {job.priority}</p>
                <p><strong>Status:</strong> {job.status}</p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default JobList;

// IM AWARE THAT CONTROLLER FILE SHOULD NOT BE PART OF MY FRONT END BUT WHEN I DO NOT HAVE IT PART OF THE FOLDER IT IS CURRENTLY IN IM GETTING IMPORT ERRORS AND ITS NOT ALLOWING ME TO IMPORT, HENCE I HAVE CONTROLLER FILES IN ITS CURRENT PLACE.
  