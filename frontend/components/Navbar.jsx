import React from "react";
import { Container, Nav, Navbar, Dropdown, Image, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { clearUser,setUser } from "../redux/features/authSlice";
import axios from "axios";

export default function CusNavbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
  try {
    await axios.post("http://localhost:3000/jagadish/logout", {}, {
      withCredentials: true,
    });
    dispatch(setUser(null)); 
    toast.success("Logged out successfully");
    navigate("/login"); 
  } catch (err) {
    toast.error("Logout failed");
  }
};


  const handleBrandClick = () => {
    if (!user) {
      navigate("/");
    } else if (user.role === "student") {
      navigate("/studentDashboard");
    } else if (user.role === "recruiter") {
      navigate("/recruiterDashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand onClick={handleBrandClick} style={{ cursor: "pointer" }}>
          Job Portal
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/jobs">Jobs</Nav.Link>
            {user?.role === "recruiter" && (
              <Nav.Link as={Link} to="/companies">Companies</Nav.Link>
            )}
          </Nav>

          {!user ? (
            <div className="d-flex gap-2">
              <Button variant="outline-primary" as={Link} to="/login">Login</Button>
              <Button variant="primary" as={Link} to="/signup">Signup</Button>
            </div>
          ) : (
            <Dropdown align="end">
              <Dropdown.Toggle variant="light" className="border-0 bg-transparent">
                <Image
                  src={user.profilePic || "https://i.pravatar.cc/40"}
                  roundedCircle
                  width={40}
                  height={40}
                  style={{ objectFit: "cover" }}
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/profile">Profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
