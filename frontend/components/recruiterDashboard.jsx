import React, { useEffect, useState } from "react";
import { Container, Button, Card, Row, Col, Modal, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/features/authSlice";
import AddJob from "./AddJob";

export default function RecruiterDashboard() {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.auth.user);
  const [userData, setUserData] = useState(reduxUser);
  const [jobs, setJobs] = useState([]);
  const [showAddJob, setShowAddJob] = useState(false);
  const [editJobData, setEditJobData] = useState(null);

  const fetchUserData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/jagadish/profile", {
        withCredentials: true,
      });
      setUserData(res.data.user);
      dispatch(setUser(res.data.user));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch user");
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:3000/job/my-jobs", {
        withCredentials: true,
      });
      setJobs(res.data.jobs);
    } catch (err) {
      toast.error("Failed to fetch jobs");
    }
  };

  useEffect(() => {
    if (!reduxUser) fetchUserData();
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/job/delete/${id}`, { withCredentials: true });
      toast.success("Job deleted");
      fetchJobs();
    } catch (err) {
      toast.error("Failed to delete job");
    }
  };

  const handleEditSave = async () => {
    try {
      await axios.put(`http://localhost:3000/job/update/${editJobData._id}`, editJobData, { withCredentials: true });
      toast.success("Job updated");
      setEditJobData(null);
      fetchJobs();
    } catch (err) {
      toast.error("Failed to update job");
    }
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <Container className="mt-5 text-center">
      <ToastContainer position="top-center" autoClose={3000} />

      {showAddJob && <AddJob onJobPosted={fetchJobs} />}

      <h3 className="mt-4 mb-3">My Posted Jobs</h3>

      <Row className="g-3">
        {jobs.length === 0 ? (
          <p>No jobs posted yet.</p>
        ) : (
          jobs.map((job) => (
            <Col md={4} sm={6} xs={12} key={job._id}>
              <Card className="p-3 h-100 shadow-sm text-start">
                <h5>{job.title}</h5>
                <p>{job.description}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Type:</strong> {job.jobType}</p>
                <p><strong>Salary:</strong> {job.salaryRange}</p>
                <div className="d-flex gap-2 mt-2">
                  <Button size="sm" variant="warning" onClick={() => setEditJobData(job)}>Edit</Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(job._id)}>Delete</Button>
                </div>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <Button variant="primary" className="mt-4" onClick={() => setShowAddJob(!showAddJob)}>
        {showAddJob ? "Close Job Form" : "Add New Job"}
      </Button>

      <Modal show={!!editJobData} onHide={() => setEditJobData(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editJobData && (
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  value={editJobData.title}
                  onChange={(e) => setEditJobData({ ...editJobData, title: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editJobData.description}
                  onChange={(e) => setEditJobData({ ...editJobData, description: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  value={editJobData.location}
                  onChange={(e) => setEditJobData({ ...editJobData, location: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Job Type</Form.Label>
                <Form.Control
                  value={editJobData.jobType}
                  onChange={(e) => setEditJobData({ ...editJobData, jobType: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Salary Range</Form.Label>
                <Form.Control
                  value={editJobData.salaryRange}
                  onChange={(e) => setEditJobData({ ...editJobData, salaryRange: e.target.value })}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditJobData(null)}>Cancel</Button>
          <Button variant="success" onClick={handleEditSave}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
