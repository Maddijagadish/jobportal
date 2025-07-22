import React, { useEffect, useState } from "react";
import {Container,Button,Card,Row,Col,Modal,Form,} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/features/authSlice";
import AddJob from "./AddJob";
import "react-toastify/dist/ReactToastify.css";

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
      console.error("Error fetching user:", err);
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
      console.error("Error fetching jobs:", err);
    }
  };

  useEffect(() => {
    if (!reduxUser) fetchUserData();
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/job/delete/${id}`, {
        withCredentials: true,
      });
      toast.success("Job deleted");
      fetchJobs();
    } catch (err) {
      toast.error("Failed to delete job");
      console.error("Delete error:", err);
    }
  };

  const handleEditSave = async () => {
    try {
      await axios.put(
        `http://localhost:3000/job/update/${editJobData._id}`,
        editJobData,
        { withCredentials: true }
      );
      toast.success("Job updated");
      setEditJobData(null);
      fetchJobs();
    } catch (err) {
      toast.error("Failed to update job");
      console.error("Update error:", err);
    }
  };

  if (!userData) return <p className="text-center">Loading...</p>;

  return (
    <Container fluid style={{ padding: "2rem", backgroundColor: "#f5f7fa" }}>
      <ToastContainer position="top-center" autoClose={3000} />
      <h3
        className="text-center mb-4"
        style={{ fontWeight: "700", color: "#1f3c88", fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)" }}
      >
        💼 My Posted Jobs
      </h3>

      <div className="d-flex justify-content-center mb-4">
        <Button
          variant="primary"
          onClick={() => setShowAddJob(!showAddJob)}
          style={{
            fontWeight: "500",
            padding: "10px 25px",
            borderRadius: "30px",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {showAddJob ? "Close Job Form" : "Add New Job"}
        </Button>
      </div>

      {showAddJob && <AddJob onJobPosted={fetchJobs} />}

      <Row className="g-4">
        {jobs.length === 0 ? (
          <Col xs={12}>
            <p className="text-center text-muted">No jobs posted yet.</p>
          </Col>
        ) : (
          jobs.map((job) => (
            <Col xs={12} sm={6} md={4} key={job._id}>
              <Card
                className="h-100 shadow-sm p-3"
                style={{
                  borderRadius: "15px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                  backgroundColor: "#ffffff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                }}
              >
                <h5 style={{ fontWeight: "600", color: "#1f3c88" }}>{job.title}</h5>
                <p style={{ color: "#525f7f" }}>{job.description}</p>
                <p><strong>📍 Location:</strong> {job.location}</p>
                <p><strong>📘 Type:</strong> {job.jobType}</p>
                <p><strong>💰 Salary:</strong> {job.salaryRange}</p>
                <div className="d-flex gap-2 mt-2">
                  <Button size="sm"
                    variant="warning"
                    onClick={() => setEditJobData(job)}
                    style={{ transition: "transform 0.3s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    Edit
                  </Button>
                  <Button size="sm"
                    variant="danger"
                    onClick={() => handleDelete(job._id)}
                    style={{ transition: "transform 0.3s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <Modal show={!!editJobData} onHide={() => setEditJobData(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editJobData && (
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Title</Form.Label>
                <Form.Control value={editJobData.title}
                  onChange={(e) =>
                    setEditJobData({ ...editJobData, title: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3}
                  value={editJobData.description}
                  onChange={(e) =>
                    setEditJobData({
                      ...editJobData,
                      description: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Location</Form.Label>
                <Form.Control value={editJobData.location}
                  onChange={(e) =>
                    setEditJobData({
                      ...editJobData,
                      location: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Job Type</Form.Label>
                <Form.Control value={editJobData.jobType}
                  onChange={(e) =>
                    setEditJobData({
                      ...editJobData,
                      jobType: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Salary Range</Form.Label>
                <Form.Control value={editJobData.salaryRange}
                  onChange={(e) =>
                    setEditJobData({
                      ...editJobData,
                      salaryRange: e.target.value,
                    })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditJobData(null)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleEditSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}