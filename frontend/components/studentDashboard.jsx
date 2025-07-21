import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function StudentDashboard() {
  const [jobs, setJobs] = useState([]);

  const fetchAllJobs = async () => {
    try {
      const res = await axios.get("http://localhost:3000/job/all", { withCredentials: true });
      setJobs(res.data.jobs);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch jobs");
    }
  };

  useEffect(() => {
    fetchAllJobs();
  }, []);

  return (
    <Container className="mt-5">
      <ToastContainer position="top-center" />
      <h3 className="text-center mb-4">Available Jobs</h3>
      <Row>
        {jobs.length === 0 ? (
          <p className="text-center">No jobs available.</p>
        ) : (
          jobs.map((job) => (
            <Col md={4} key={job._id} className="mb-3">
              <Card className="p-3 shadow-sm">
                <h5>{job.title}</h5>
                <p>{job.description}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Type:</strong> {job.jobType}</p>
                <p><strong>Salary:</strong> {job.salaryRange}</p>
                <p><strong>Posted By:</strong> {job.createdBy?.fullName}</p>
                <Button variant="success" >Apply</Button>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}
