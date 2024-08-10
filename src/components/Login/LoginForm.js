// src/components/Login/LoginPage.js
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple check for demonstration. Replace with actual authentication logic.
    if (username === 'admin' && password === 'password') {
      localStorage.setItem('isAuthenticated', true);
      window.location.href = ("/dashboard")
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <Container>
      <h2>Login</h2>
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
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
    </Container>
  );
}

export default LoginPage;
