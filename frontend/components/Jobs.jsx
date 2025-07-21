import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    locations: [],
    jobTypes: [],
    titles: [],
  });

  const reduxUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const locations = ["Hyderabad", "Bangalore", "Viskhapatnam", "Chennai", "Remote"];
  const jobTypes = ["Full-Time", "Part-Time", "Internship", "Freelance"];
  const titles = ["Software Developer", "Data Analyst", "Frontend Developer", "Backend Developer", "Full Stack Developer"];

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:3000/job/public");
      setJobs(res.data.jobs);
      setFilteredJobs(res.data.jobs);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (type, value) => {
    setFilters((prev) => {
      const isChecked = prev[type].includes(value);
      return {
        ...prev,
        [type]: isChecked
          ? prev[type].filter((v) => v !== value)
          : [...prev[type], value],
      };
    });
  };

  const applyFilters = () => {
    let tempJobs = [...jobs];

    if (filters.locations.length) {
      tempJobs = tempJobs.filter((job) => filters.locations.includes(job.location));
    }

    if (filters.jobTypes.length) {
      tempJobs = tempJobs.filter((job) => filters.jobTypes.includes(job.jobType));
    }

    if (filters.titles.length) {
      tempJobs = tempJobs.filter((job) => filters.titles.includes(job.title));
    }

    setFilteredJobs(tempJobs);
  };

  const clearFilters = () => {
    setFilters({ locations: [], jobTypes: [], titles: [] });
    setFilteredJobs(jobs);
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const handleApply = (jobId) => {
    if (!reduxUser) {
      toast.warn("Please login to apply");
      navigate("/login");
    } else {
      toast.success("Applied successfully!");
      // You can implement your actual apply API call here if needed
    }
  };

  return (
    <div>
      <ToastContainer position="top-center" autoClose={3000} />
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row className="mb-4">
          {/* Left Filter Panel */}
          <Col md={3} className="bg-dark text-white p-4">
            <h5 className="mb-3">Filter Jobs</h5>

            <h6>By Location</h6>
            {locations.map((loc, idx) => (
              <Form.Check
                key={idx}
                type="checkbox"
                label={loc}
                checked={filters.locations.includes(loc)}
                onChange={() => handleCheckboxChange("locations", loc)}
              />
            ))}

            <hr />

            <h6>By Job Type</h6>
            {jobTypes.map((type, idx) => (
              <Form.Check
                key={idx}
                type="checkbox"
                label={type}
                checked={filters.jobTypes.includes(type)}
                onChange={() => handleCheckboxChange("jobTypes", type)}
              />
            ))}

            <hr />

            <h6>By Title</h6>
            {titles.map((title, idx) => (
              <Form.Check
                key={idx}
                type="checkbox"
                label={title}
                checked={filters.titles.includes(title)}
                onChange={() => handleCheckboxChange("titles", title)}
              />
            ))}

            <Button variant="secondary" className="mt-3 w-100" onClick={clearFilters}>
              Clear Filters
            </Button>
          </Col>

          {/* Jobs Listing */}
          <Col md={9}>
            <Row className="p-4">
              <h5 className="mb-3 text-center">Available Jobs</h5>
              {filteredJobs.length === 0 ? (
                <p className="text-center">No jobs found with selected filters.</p>
              ) : (
                filteredJobs.map((job) => (
                  <Col md={6} key={job._id} className="mb-3">
                    <Card className="p-3 shadow-sm h-100">
                      <h5>{job.title}</h5>
                      <p>{job.description}</p>
                      <p><strong>Location:</strong> {job.location}</p>
                      <p><strong>Job Type:</strong> {job.jobType}</p>
                      <p><strong>Salary:</strong> {job.salaryRange}</p>
                      <Button variant="primary" className="w-100" onClick={() => handleApply(job._id)}>
                        Apply
                      </Button>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          </Col>
        </Row>
      )}
    </div>
  );
}
