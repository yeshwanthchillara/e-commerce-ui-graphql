import React, { useEffect, useState } from "react";
import { loginSubmit, oAuthVerification } from "../../actions";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { mainSliceActions } from "../../Store/MainSlice";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Form, Alert, Button } from "react-bootstrap";

import './Auth.css'

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginClicked, setLoginClicked] = useState(false)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // google Auth
  const handleCallbackResponse = (response) => {
    // const decoded = jwt_decode(response.credential);
    oAuthVerification(response.credential, navigate, dispatch);
  };

  useEffect(() => {
    /* global google*/
    google.accounts.id.initialize({
      client_id:
        "904622826862-dpd51rk6vaqghctaghfqhh6l9ndevd8t.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    // google.accounts.id.renderButton(document.getElementById("signInDiv"), {
    //   theme: "Outline",
    //   size: "large",
    // });
  }, []);

  const clickedCreateNewAcc = () => {
    navigate("/sign-up");
  };

  const closeBtnClicked = () => {
    navigate("/");
  };

  const handleLogin = async () => {
    try {
      setLoginClicked(true)
      if (!username || !password) setShow(true)
      const loginData = { username, password };
      await loginSubmit(loginData, navigate, dispatch);
    } catch {

    } finally {
      setLoginClicked(false)
    }
  };

  return (
    <div className="sign-in__wrapper">
      {/* Overlay */}
      <div className="sign-in__backdrop"></div>
      {/* Form */}
      <Form className="shadow p-4 bg-white rounded">
        <div className="h4 mb-2 text-center">Sign In</div>
        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
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
        <Button className="w-100" variant="dark" onClick={handleLogin} disabled={loginClicked}>
          {!loginClicked ? 'Log In' : 'Logging In...'}
        </Button>
        <div className="d-flex justify-content-between">
          <Button
            className="text-muted px-0"
            variant="link"
            onClick={() => navigate("/forgot-username")}
          >
            Forgot Username?
          </Button>
          <Button
            className="text-muted px-0"
            variant="link"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </Button>
        </div>
        <div className="d-flex justify-content-between">
          <Button
            className="text-muted px-0"
            variant="link"
            onClick={closeBtnClicked}
          >
            Close
          </Button>
          <Button
            className="text-muted px-0"
            variant="link"
            onClick={clickedCreateNewAcc}
          >
            Sign Up
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default SignIn;
