import React, { useState , useEffect } from "react";
import { Form, Button, Container, Row, Col ,Card } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/authSlice";
import image2 from '../public/login.752Z.png';

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) {
      toast.warn("Please select a role before logging in.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/jagadish/login",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      const { token, message, user } = res.data;

      if (token) {
  // Cookies.set("token", token, { expires: 1 });
  dispatch(setUser(user)); 
  toast.success(message || "Login successful!");

  setTimeout(() => {
    if (user.role === "student") {
      navigate("/studentDashboard");
    } else if (user.role === "recruiter") {
      navigate("/recruiterDashboard");
    } else {
      navigate("/");
    }
  }, 2000);
} else {
  toast.error("Login failed! No token received.");
}

    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className=""
  style={{
    backgroundImage: isMobile ? "none" : `url(${image2})`,
    backgroundColor: isMobile ? "#ffffff" : "transparent",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "90vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "end",
  }}
>
  <Container fluid className="p-0">
    <Row className="w-100 g-0">
      <Col md={6}></Col>
      <Col
        md={6}
        xs={12}
        className="d-flex align-items-center justify-content-center"
      >
        <Card
          className="p-4 shadow-lg rounded-4 animate__animated animate__fadeIn"
          style={{
            width: "100%",
            maxWidth: "400px",
            backgroundColor: "#fff",  
          }}
        >
          <ToastContainer position="top-center" autoClose={3000} />
          <h3 className="text-center mb-4 text-primary">
            <i className="bi bi-box-arrow-in-right"></i> Login
          </h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select role</option>
                <option value="student">Student</option>
                <option value="recruiter">Recruiter</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">
              Login
            </Button>
          </Form>
        </Card>
      </Col>
    </Row>
  </Container>
</div>

  );
}
