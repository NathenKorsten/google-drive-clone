import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Card, Button, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import Center from "./Center";

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const [error, setError] = useState("");
  const history = useHistory();
  const handleLogout = async () => {
    setError("");
    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Failed to log out");
    }
  };
  return (
    <Center>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Hi, {currentUser?.email}</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Link className="btn btn-primary w-100 mt-3" to="/update-profile">
            Update profile
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log Out
        </Button>
      </div>
    </Center>
  );
}
