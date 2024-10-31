import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { forgotUsernameSubmit } from "../../actions";
import { useNavigate } from "react-router-dom";
import { Form, Button } from 'react-bootstrap';
import './Auth.css'

function ForgotUsername() {
  const [email, setEmail] = useState("");
  const [loginClicked, setLoginClicked] = useState(false)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closeBtnClicked = () => {
    navigate("/");
  };

  const handleLogin = async () => {
    try {
      setLoginClicked(true)
      if (!email) return toast.error("Please Enter Email");
      let response = await forgotUsernameSubmit(email);
      document.getElementById("response_div")?.classList?.add("forgotSuccess");
      document.getElementById("response_div").innerHTML = response.message;
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
        <div className="h4 mb-2 text-center">Forgot Username</div>
        <div id="response_div"></div>
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
        <Button className="w-100" variant="dark" onClick={handleLogin} disabled={loginClicked}>
          {!loginClicked ? 'Find Username' : 'Finding Username'}
        </Button>
        <Button className="w-100 my-1" variant="light" onClick={closeBtnClicked}>
          close
        </Button>
      </Form>
    </div>
  );
}

export default ForgotUsername;
