const mongoose = require('mongoose');

// Define the job status enum
const jobStatusEnum = ['submitted', 'in progress', 'completed', 'archived'];

// Define the job priority enum
const jobPriorityEnum = ['low', 'medium', 'high'];

// Job Schema
const jobSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: jobPriorityEnum,
      required: true,
    },
    status: {
      type: String,
      enum: jobStatusEnum,
      default: 'submitted',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    archivedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, 
  }
);

// Create a Job model from the schema
const Job = mongoose.model('Job', jobSchema);

module.exports = {Job, jobStatusEnum, jobPriorityEnum};



