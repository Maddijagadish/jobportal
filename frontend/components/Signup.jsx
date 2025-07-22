import React, { useState ,useEffect } from "react";
import { Form, Button, Container, Row, Col , Card } from "react-bootstrap";
import axios from "axios";
import "animate.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UploadButton from "../components/uploadButton.jsx";
import image1 from '../public/Google_AI_Studio_2025-07-22T05_50_53.563Z.png';

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
  });
    const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


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
    <div
  style={{
    backgroundImage: isMobile ? "none" : `url(${image1})`,
    backgroundColor: isMobile ? "#ffffff" : "transparent",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "90vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "start",
  }}
>
  <Container fluid>
    <Row className="w-100">
      <Col md={6} className="d-flex align-items-center justify-content-center">
        <Card
          className="p-4 shadow-lg rounded-4 animate__animated animate__fadeIn"
          style={{
            width: "100%",
            maxWidth: "500px",
            backgroundColor: "rgba(#fff)",
          }}
        >
          <ToastContainer position="top-center" autoClose={3000} />
          <h3 className="text-center mb-4 text-primary">
            <i className="bi bi-person-plus-fill"></i> Sign Up
          </h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
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

            <Form.Group>
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

            <Form.Group>
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

            <Form.Group>
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

            <Form.Group>
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required>
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="recruiter">Recruiter</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mt-3">
              <UploadButton onFileSelect={handleFileSelect} />
            </Form.Group>

            <Form.Group className="mt-3">
              <Form.Check
                required
                label="Agree to terms and conditions"
                feedback="You must agree before submitting."
                feedbackType="invalid"
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-3 w-100">
              Register
            </Button>
          </Form>
        </Card>
      </Col>
      <Col md={6}></Col>
    </Row>
  </Container>
</div>



  );
}
