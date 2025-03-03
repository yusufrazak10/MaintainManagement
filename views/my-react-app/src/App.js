import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AddJob from './components/jobSubmit';
import UpdateJob from './components/updateJob';
import BatchUpdateJob from './components/batchUpdateJobs';
import JobList from './components/jobList';
import ArchivedJobList from './components/displayArchived';
import ArchiveJob from './components/archiveJob';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <h1>Job Management</h1>

        {/* Navigation Links */}
        <nav>
          <ul>
            <li><Link to="/add-job">Add Job</Link></li>
            <li><Link to="/update-job">Update Job</Link></li>
            <li><Link to="/batch-update">Batch Update Jobs</Link></li>
            <li><Link to="/archive-job">Archive Job</Link></li>
            <li><Link to="/archived-jobs">View Archived Jobs</Link></li>
          </ul>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<><AddJob /><JobList /></>} />
          <Route path="/add-job" element={<><AddJob /><JobList /></>} />
          <Route path="/update-job" element={<><UpdateJob /><JobList /></>} />
          <Route path="/batch-update" element={<><BatchUpdateJob /><JobList /></>} />
          <Route path="/archive-job" element={<><ArchiveJob /><JobList /></>} />
          <Route path="/archived-jobs" element={<ArchivedJobList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;


