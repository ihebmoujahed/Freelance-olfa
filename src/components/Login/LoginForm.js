// src/components/Login/LoginPage.js
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button, Container, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css"; // Custom CSS file for additional styling

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple check for demonstration. Replace with actual authentication logic.
    if (username === "admin" && password === "password") {
      localStorage.setItem("isAuthenticated", true);
      window.location.href = "/dashboard";
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card
        className="p-4 shadow-sm rounded"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <Card.Body>
          <Card.Title className="text-center mb-4">Login</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-3">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default LoginPage;
