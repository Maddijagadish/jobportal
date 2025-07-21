import React, { useEffect, useState, useRef } from "react";
import { Container, Button, Row, Col, Card, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/features/authSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.auth.user);
  const [userData, setUserData] = useState(reduxUser);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const fileInputRef = useRef();
  const resumeInputRef = useRef();

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

  useEffect(() => {
    if (!reduxUser) {
      fetchUserData();
    } else {
      setUserData(reduxUser);
    }
  }, [reduxUser]);

  const handleChange = (e) => {
    setUpdatedData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("fullName", updatedData.fullName || userData.fullName);
      formData.append("phoneNumber", updatedData.phoneNumber || userData.phoneNumber);

      if (fileInputRef.current?.files[0]) {
        formData.append("profilePic", fileInputRef.current.files[0]);
      }

      if (userData.role === "student" && resumeInputRef.current?.files[0]) {
        formData.append("resume", resumeInputRef.current.files[0]);
      }

      const res = await axios.put("http://localhost:3000/jagadish/profile", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated successfully");
      setUserData(res.data.user);
      dispatch(setUser(res.data.user));
      setEditMode(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  if (!userData) return <p>Loading...</p>;

  return (
    <Container className="mt-3">
      <ToastContainer position="top-center" autoClose={3000} />
      <h2 className="text-center mb-4">My Profile</h2>
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-3 shadow-sm">
            <div className="text-center mb-3">
              <img
                src={userData.profilePic || "https://via.placeholder.com/150"}
                alt="Profile"
                width="150"
                height="150"
                style={{ borderRadius: "50%" }}
              />
            </div>

            {!editMode ? (
              <>
                <p><strong>Full Name:</strong> {userData.fullName}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Phone:</strong> {userData.phoneNumber}</p>
                <p><strong>Role:</strong> {userData.role}</p>
                {userData.role === "student" && userData.resume && (
                  <p><strong>Resume:</strong> <a href={userData.resume} target="_blank" rel="noreferrer">View</a></p>
                )}
                <Button variant="primary" onClick={() => {
                  setUpdatedData(userData);
                  setEditMode(true);
                }}>Edit Profile</Button>
              </>
            ) : (
              <>
                <Form.Group className="mb-2">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    name="fullName"
                    value={updatedData.fullName !== undefined ? updatedData.fullName : userData.fullName}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    name="phoneNumber"
                    value={updatedData.phoneNumber !== undefined ? updatedData.phoneNumber : userData.phoneNumber}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Profile Picture</Form.Label>
                  <Form.Control type="file" ref={fileInputRef} />
                </Form.Group>

                {userData.role === "student" && (
                  <Form.Group className="mb-2">
                    <Form.Label>Upload Resume</Form.Label>
                    <Form.Control type="file" ref={resumeInputRef} />
                  </Form.Group>
                )}

                <div className="d-flex gap-2 mt-3">
                  <Button variant="success" onClick={handleSave}>Save</Button>
                  <Button variant="secondary" onClick={() => setEditMode(false)}>Cancel</Button>
                </div>
              </>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
