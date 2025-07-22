import React, { useState, useEffect } from "react";
import {Container,Row,Col,Card,Button,Form,Spinner,} from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

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

  const locations = ["Hyderabad","Bangalore","Viskhapatnam","Chennai","Remote",];
  const jobTypes = ["Full-Time", "Part-Time", "Internship", "Freelance"];
  const titles = ["Software Developer","Data Analyst","Frontend Developer","Backend Developer","Full Stack Developer",];

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
      console.error("Error fetching jobs:", err);
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
      tempJobs = tempJobs.filter((job) =>
        filters.locations.includes(job.location)
      );
    }

    if (filters.jobTypes.length) {
      tempJobs = tempJobs.filter((job) =>
        filters.jobTypes.includes(job.jobType)
      );
    }

    if (filters.titles.length) {
      tempJobs = tempJobs.filter((job) =>
        filters.titles.includes(job.title)
      );
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
    } else if (reduxUser.role !== "student") {
      toast.error("Only students can apply for jobs");
    } else {
      toast.success("Applied successfully!");
    }
  };

  return (
    <Container fluid style={{ backgroundColor: "#eef2f7", padding: "1rem" }}>
      <ToastContainer position="top-center" autoClose={3000} />
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row>
          <Col xs={12} sm={4} md={4} lg={3}
            style={{
              backgroundColor: "#f8f9fa",
              color: "#212529",
              padding: "1.5rem",
              height: "100%",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <h4 style={{ fontWeight: "700" }}>🔎 Filter Jobs</h4>

            <div style={{ marginTop: "1rem" }}>
              <h6>📍 By Location</h6>
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

              <h6>🧭 By Job Type</h6>
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

              <h6>💼 By Title</h6>
              {titles.map((title, idx) => (
                <Form.Check
                  key={idx}
                  type="checkbox"
                  label={title}
                  checked={filters.titles.includes(title)}
                  onChange={() => handleCheckboxChange("titles", title)}
                />
              ))}

              <Button
                variant="secondary"
                className="mt-3 w-100"
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          </Col>

          <Col xs={12} sm={8} md={8} lg={9} style={{ overflowY: "auto", height: "100%" }}>
            <h3
              style={{
                fontWeight: "700",
                color: "#343a40",
                fontSize: "clamp(1.5rem, 5vw, 2rem)",
                textAlign: "center",
                marginBottom: "2rem",
              }}
            >
              📄 Available Jobs
            </h3>

            <Row>
              {filteredJobs.length === 0 ? (
                <p className="text-center text-muted">
                  No jobs found with selected filters.
                </p>
              ) : (
                filteredJobs.map((job) => (
                  <Col xs={12} sm={12} md={6} lg={4} xl={3} className="mb-4" key={job._id}>
                    <Card
                      className="shadow-sm"
                      style={{
                        borderRadius: "15px",
                        padding: "1.5rem",
                        backgroundColor: "#ffffff",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          "translateY(-5px) scale(1.01)";
                        e.currentTarget.style.boxShadow =
                          "0 12px 24px rgba(0,0,0,0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow =
                          "0 4px 10px rgba(0,0,0,0.08)";
                      }}
                    >
                      <h5 style={{ fontWeight: "600", color: "#212529" }}>
                        {job.title}
                      </h5>
                      <p style={{ color: "#495057" }}>{job.description}</p>
                      <p>
                        <strong>📍 Location:</strong> {job.location}
                      </p>
                      <p>
                        <strong>🧭 Type:</strong> {job.jobType}
                      </p>
                      <p>
                        <strong>💰 Salary:</strong> {job.salaryRange}
                      </p>
                      <Button
                        variant="primary"
                        className="mt-2 w-100"
                        style={{
                          borderRadius: "30px",
                          fontWeight: "500",
                          transition: "transform 0.3s ease",
                        }}
                        onClick={() => handleApply(job._id)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.03)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        Apply Now
                      </Button>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          </Col>
        </Row>
      )}
    </Container>
  );
}