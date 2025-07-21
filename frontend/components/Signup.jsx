import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UploadButton from "../components/uploadButton.jsx";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();
  const handleFileSelect = (file) => {
    setProfilePic(file);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role) {
      toast.warn("Please select a role before submitting!");
      return;
    }
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (profilePic) {
        data.append("profilePic", profilePic);
      }
     const res = await axios.post("http://localhost:3000/jagadish/register",data,
  {
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" },
  }
);
      console.log("Response from server:", res.data);
      if (res.status === 201) {
        toast.success(res.data.message || "User registered successfully!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.info("Registration completed, please login.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Server Error");
    }
  };

  return (
    <Container className="mt-5">
      <ToastContainer position="top-center" autoClose={3000} />
      <Row className="justify-content-center">
        <Col md={6}>
          <h2>Sign Up</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                autoComplete="tel"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="recruiter">Recruiter</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-4">
              <UploadButton onFileSelect={handleFileSelect} />
            </Form.Group>
            <Button type="submit" variant="primary">
              Register
            </Button>
            <Form.Group className="mb-3">
              <Form.Check
                required
                label="Agree to terms and conditions"
                feedback="You must agree before submitting."
                feedbackType="invalid"
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
