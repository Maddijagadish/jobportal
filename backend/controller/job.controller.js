import {Job} from "../model/job.model.js";

export const postJob = async (req, res) => {
  try {
    const { title, description, location, jobType, salaryRange } = req.body;

    if (!title || !description || !location || !jobType || !salaryRange ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newJob = new Job({
      title,
      description,
      location,
      jobType,
      salaryRange,
      createdBy: req.user._id,
    });

    await newJob.save();

    res.status(201).json({ message: "Job posted successfully", job: newJob });
  } catch (err) {
    console.error("Error in postJob:", err);
    res.status(500).json({ message: "Failed to post job" });
  }
};


export const getJobsByRecruiter = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user._id });
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: 'Fetching jobs failed', error: err.message });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("createdBy", "fullName email");
    res.json({ jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!job) return res.status(404).json({ message: "Job not found" });

    const { title, description, location, jobType, salaryRange } = req.body;

    job.title = title;
    job.description = description;
    job.location = location;
    job.jobType = jobType;
    job.salaryRange = salaryRange;

    await job.save();

    res.json({ message: "Job updated successfully", job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update job" });
  }
};



export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Deletion failed', error: err.message });
  }
};


export const searchJobs = async (req, res) => {
  try {
    const { keyword, location, jobType } = req.query;
    const filter = {};

    if (keyword) filter.title = { $regex: keyword, $options: "i" };
    if (location) filter.location = { $regex: location, $options: "i" };
    if (jobType) filter.jobType = jobType;

    const jobs = await Job.find(filter);
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
};

