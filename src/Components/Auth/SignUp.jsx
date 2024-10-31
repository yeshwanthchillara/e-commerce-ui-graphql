import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { signupSubmit } from "../../actions";
// import { useDispatch } from "react-redux";
// import { mainSliceActions } from "../../Store/MainSlice";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Form, Alert, Button } from "react-bootstrap";

import './Auth.css'

function Signup() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confrimPassword, setConfrimPassword] = useState("");
  const [show, setShow] = useState(false)
  const [signUpBtnClicked, setSignUpBtnClicked] = useState(false);

  // const dispatch = useDispatch();
  const navigate = useNavigate();

  function generatePassword() {
    var length = 8,
      charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  // google Auth
  const handleCallbackResponse = (response) => {
    const decoded = jwt_decode(response.credential);
    const userData = {
      name: decoded.name,
      username: decoded.email,
      email: decoded.email,
      password: generatePassword(),
      profileImage: decoded.picture,
    };
    signupSubmit(userData, navigate);
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "904622826862-dpd51rk6vaqghctaghfqhh6l9ndevd8t.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    // google.accounts.id.renderButton(document.getElementById("signUpDiv"), {
    //   theme: "Outline",
    //   size: "large",
    // });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !username || !email || !password || !confrimPassword)
      return toast.error("Please Enter all Details", { position: "top-right" });
    if (password !== confrimPassword)
      return toast.error("Password & Confrim Password Not Matching");
    const userData = { name, username, email, password };
    signupSubmit(userData, navigate);
  };

  return (
    <div
      className="sign-in__wrapper"
    >
      {/* Overlay */}
      <div className="sign-in__backdrop"></div>
      {/* Form */}
      <Form className="shadow p-4 bg-white rounded"
        onSubmit={handleSubmit}
      >
        <div className="h4 mb-2 text-center">Sign Up</div>
        {/* ALert */}
        {show ? (
          <Alert
            className="mb-2"
            variant="danger"
            onClose={() => setShow(false)}
            dismissible
          >
            Incorrect Details
          </Alert>
        ) : (
          <div />
        )}
        <Form.Group className="mb-2" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="name">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="confirm-password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={confrimPassword}
            placeholder="confrim Password"
            onChange={(e) => setConfrimPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button className="w-100" variant="dark" type="submit" disabled={signUpBtnClicked}>
          {!signUpBtnClicked ? 'Sign In' : 'Signing In...'}
        </Button>
        <div className="d-flex justify-content-between">
          <Button
            className="text-muted px-0"
            variant="link"
            onClick={() => navigate("/", { replace: true })}>
            Close
          </Button>
          <Button
            className="text-muted px-0"
            variant="link"
            onClick={() => navigate("/login", { replace: true })}>
            Already Registered?
          </Button>
        </div>
      </Form >
    </div >
  );
}

export default Signup;
