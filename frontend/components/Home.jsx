import React, { useState } from "react";
import { Container, Row, Col, Button, Form, Card, Carousel } from "react-bootstrap";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init();

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchText.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchText.trim())}`);
    } else {
      navigate("/jobs");
    }
  };

  const handleGetStarted = () => {
    navigate("/signup");
  };

  return (
    <div>
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Hero Section */}
      <div className="bg-primary text-white text-center py-5" data-aos="fade-down">
        <motion.h1 initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          Welcome to Job Portal
        </motion.h1>
        <p>Your gateway to your dream job</p>
        <Button variant="light" className="px-4 py-2" onClick={handleGetStarted}>
          Get Started
        </Button>
      </div>

      {/* Search Section */}
      <Container className="my-5" data-aos="zoom-in">
        <h2 className="text-center mb-4">Search Jobs</h2>
        <Form className="d-flex justify-content-center">
          <Form.Control
            type="text"
            placeholder="Search job roles, companies..."
            className="w-50 me-2"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button variant="primary" onClick={handleSearch}>
            Search
          </Button>
        </Form>
      </Container>

      {/* Explore Job Roles Section */}
      <Container className="my-5" data-aos="fade-up">
        <h2 className="text-center mb-4">Explore Job Roles</h2>
        <Carousel indicators={false} controls={true} interval={2000}>
          {["Frontend Developer", "Backend Developer", "Fullstack Developer", "Data Scientist", "UI/UX Designer", "DevOps Engineer"].map((role, idx) => (
            <Carousel.Item key={idx}>
              <div className="d-flex justify-content-center">
                <Card className="p-4 m-2 shadow text-center w-50 border-0 rounded-4" style={{ background: "#f8f9fa" }}>
                  <h4 className="text-primary">{role}</h4>
                </Card>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>

      {/* Companies Section */}
      <Container className="my-5" data-aos="flip-up">
        <h2 className="text-center mb-4">Our Collaborated Companies</h2>
        <Row className="text-center">
          {[
            { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
            { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
            { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
            { name: "TCS", logo: "https://cdn.worldvectorlogo.com/logos/tcs.svg" },
            { name: "Infosys", logo: "https://cdn.worldvectorlogo.com/logos/infosys-3.svg" },
            { name: "Zoho", logo: "https://cdn.worldvectorlogo.com/logos/zoho.svg" },
            { name: "Accenture", logo: "https://cdn.worldvectorlogo.com/logos/accenture-6.svg" },
            { name: "Deloitte", logo: "https://cdn.worldvectorlogo.com/logos/deloitte-2.svg" },
          ].map((company, idx) => (
            <Col md={3} sm={6} className="mb-3" key={idx} data-aos="fade-up" data-aos-delay={100 * (idx + 1)}>
              <Card className="p-3 shadow-sm d-flex align-items-center rounded-4">
                <img src={company.logo} height="30" className="me-2" alt={company.name} />
                <strong>{company.name}</strong>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Footer */}
      <div className="bg-dark text-white text-center py-4" data-aos="fade-in">
        <h5>Contact Us</h5>
        <p>Email: support@jobportal.com | Phone: +91-1234567890</p>
        <p>© 2025 Job Portal. All rights reserved.</p>
      </div>
    </div>
  );
}
