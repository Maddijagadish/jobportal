import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function StudentDashboard() {
  const [jobs, setJobs] = useState([]);

  const fetchAllJobs = async () => {
    try {
      const res = await axios.get("http://localhost:3000/job/all", {
        withCredentials: true,
      });
      setJobs(res.data.jobs);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch jobs");
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, []);

  const handleApplyClick = () => {
    toast.success("Applied successfully!");
  };

  return (
    <Container
      fluid
      className="py-5 px-4"
      style={{ backgroundColor: "#eef5ff" }}
    >
      <ToastContainer position="top-center" autoClose={3000} />
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2 style={{ fontWeight: "700", color: "#1f3c88" }}>
          🚀 Available Jobs
        </h2>
        <p style={{ color: "#57617b", fontSize: "1.1rem" }}>
          Explore curated job opportunities just for you. Don't miss out!
        </p>
      </div>

      <Row>
        {jobs.length === 0 ? (
          <Col xs={12}>
            <p
              style={{
                textAlign: "center",
                fontSize: "1.2rem",
                color: "#999",
              }}
            >
              No jobs available right now. Please check back later!
            </p>
          </Col>
        ) : (
          jobs.map((job) => (
            <Col xs={12}sm={6} md={4} lg={4} xl={3} key={job._id} className="mb-4">
              <Card
                className="shadow"
                style={{
                  borderRadius: "15px",
                  padding: "20px",
                  backgroundColor: "#ffffff",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                  color: "#2d2d2d",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-5px) scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 25px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.08)";
                }}
              >
                <h5 style={{ fontWeight: "600", color: "#1f3c88" }}>
                  {job.title}
                </h5>
                <p
                  style={{
                    color: "#62656c",
                    marginBottom: "0.75rem",
                  }}
                >
                  {job.description}
                </p>
                <p style={{ margin: "0.25rem 0", fontSize: "0.95rem" }}>
                  <strong>📍 Location:</strong> {job.location}
                </p>
                <p style={{ margin: "0.25rem 0", fontSize: "0.95rem" }}>
                  <strong>📘 Type:</strong> {job.jobType}
                </p>
                <p style={{ margin: "0.25rem 0", fontSize: "0.95rem" }}>
                  <strong>💰 Salary:</strong> {job.salaryRange}
                </p>
                <p style={{ margin: "0.25rem 0", fontSize: "0.95rem" }}>
                  <strong>🧑‍💼 Posted By:</strong> {job.createdBy?.fullName}
                </p>
                <div className="text-end mt-3">
                  <Button
                    variant="success"
                    onClick={handleApplyClick}
                    style={{
                      borderRadius: "30px",
                      padding: "6px 20px",
                      fontWeight: "500",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.backgroundColor = "#28a745";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.backgroundColor = "";
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}