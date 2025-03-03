import React, { useState } from 'react';

const AddJob = () => {
  // State to manage job input fields (description, location, priority, and status)
  const [job, setJob] = useState({
    description: '',  
    location: '',     
    priority: '',     
    status: 'submitted' 
  });

  // State to handle error messages
  const [error, setError] = useState('');
  
  // State to handle success messages
  const [success, setSuccess] = useState('');

  // Function to fetch jobs and log them to the console
  const fetchJobs = async () => {
    try {
      // Fetch list of jobs from the server
      const response = await fetch('http://localhost:5001/list-jobs');
      const data = await response.json();
    } catch (error) {
      // Log error if the fetch operation fails
      console.error("Error fetching jobs:", error);
    }
  };

  // Handle changes in input fields and update state accordingly
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    
    // Update the state with the new value for the specific input field
    setJob(prevJob => ({
      ...prevJob,
      [name]: value
    }));
  };

  // Handle form submission to add a new job
  const handleSubmit = (event) => {
    // Prevent page reload on form submit
    event.preventDefault(); 

    setError('');  
    setSuccess('');  

    // Check if all required fields are filled in
    if (!job.description || !job.location || !job.priority || !job.status) {
      setError('All fields are required. Please fill in all fields!');  // Set error message if fields are empty
      return;
    }

    // Data to be sent in the request body
    const jobData = {
      description: job.description,
      location: job.location,
      priority: job.priority,
      status: job.status
    };

    // Make a POST request to add the new job
    fetch('http://localhost:5001/create-job', {
      method: 'POST',  
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)  
    })
      .then(response => {
        // If response is not OK, throw an error
        if (!response.ok) {
          throw new Error('Failed to add job. Server response not OK.');
        }
        return response.json();  
      })
      .then(() => {
        // If successful, show success message and reset form fields
        setSuccess('Job added successfully!');
        
        // Reset job state to clear the form fields
        setJob({
          description: '',
          location: '',
          priority: '',
          status: 'submitted'  
        });
        
        // Fetch and log the updated list of jobs
        fetchJobs();  
      })
      .catch((error) => {
        // If an error occurs during the request, set the error message
        setError(`Failed to add job. Error: ${error.message}`);
      });
  };

  return (
    <div>
      <h1>Add Job</h1>
      
      {/* Display success message if job was added successfully */}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      
      {/* Display error message if something went wrong */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* Job creation form */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={job.description}
            onChange={handleInputChange}  
          />
        </div>
        
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={job.location}
            onChange={handleInputChange} 
          />
        </div>
        
        <div>
          <label>Priority:</label>
          <select
            name="priority"
            value={job.priority}
            onChange={handleInputChange}  
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div>
          <label>Status:</label>
          <select
            name="status"
            value={job.status}
            onChange={handleInputChange}  
          >
            <option value="submitted">Submitted</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        {/* Submit button to add the new job */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddJob;




