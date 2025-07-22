import React, { useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

export default function AddJob({ onJobPosted }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    jobType: "",
    salaryRange: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/job/post", formData, { withCredentials: true });
      toast.success("Job posted successfully!");
      setFormData({
        title: "",
        description: "",
        location: "",
        jobType: "",
        salaryRange: "",
      });
      onJobPosted(); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post job");
    }
  };

  return (
    <Container className="mt-5">
      <ToastContainer position="top-center" autoClose={3000} />
      <Card className="p-4 shadow-sm">
        <h3 className="text-center mb-4">Post New Job</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label><strong>Title</strong></Form.Label>
            <Form.Control name="title" value={formData.title} onChange={handleChange} required placeholder="Enter the job title" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><strong>Description</strong></Form.Label>
            <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} required placeholder="Enter the job Description" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><strong>Location</strong></Form.Label>
            <Form.Control name="location" value={formData.location} onChange={handleChange} required placeholder="Enter the job location" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><strong>Job Type</strong></Form.Label>
            <Form.Control name="jobType" value={formData.jobType} onChange={handleChange} required placeholder="e.g. Full-Time, Part-Time" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label><strong>Salary Range</strong></Form.Label>
            <Form.Control name="salaryRange" value={formData.salaryRange} onChange={handleChange} required placeholder="e.g. 30,000 - 50,000" />
          </Form.Group>

          <div className="text-center">
            <Button variant="primary" type="submit" className="px-4">
              Post Job
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
