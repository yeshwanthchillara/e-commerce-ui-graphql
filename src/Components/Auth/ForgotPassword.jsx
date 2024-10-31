import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { forgotPasswordSubmit } from "../../actions";
import { useNavigate } from "react-router-dom";
import { Form, Button } from 'react-bootstrap';

function ForgotPassword() {
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const closeBtnClicked = () => {
    navigate("/");
  };

  const handleLogin = async () => {
    if (!username) return toast.error("Please Enter Username");
    let response = await forgotPasswordSubmit(username);
    document.getElementById("response_div").classList.add("forgotSuccess");
    document.getElementById("response_div").innerHTML = response.message;
  };

  return (
    <div className="sign-in__wrapper">
      {/* Overlay */}
      <div className="sign-in__backdrop"></div>
      {/* Form */}
      <Form className="shadow p-4 bg-white rounded">
        <div className="h4 mb-2 text-center">Forgot Password</div>
        <div id="response_div"></div>
        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Button className="w-100" variant="dark" onClick={handleLogin}>
          Send Email
        </Button>
        <Button className="w-100 my-1" variant="light" onClick={closeBtnClicked}>
          close
        </Button>
      </Form>
    </div>
  );
}

export default ForgotPassword;
