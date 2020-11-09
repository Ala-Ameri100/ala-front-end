import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import  NaviBar  from './Navibar';

export default function Rigister() {
  const name="";
  const phone="";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();


  function validateForm() {
    return email.length > 0 && password.length > 0;
  }
  async function handleLogin(){
    history.push("/login");
  }

  function handleSubmit(event) {
    event.preventDefault();
    //const res = await fetch({ url: SERVER_URL, method: "POST", body: values });
    //const data = await res.json();
  }

  return (
    <div>
      <NaviBar className="NewChat"></NaviBar>
    <div className="Login">
      <form onSubmit={handleSubmit}>
      <FormGroup  bsSize="large">
        Name
          <FormControl
            autoFocus
            value={name}
          />
        </FormGroup>
        <FormGroup  bsSize="large">
        Phone
          <FormControl
            value={phone}
          />
        </FormGroup>
        <FormGroup controlId="email" bsSize="large">
        Email
          <FormControl
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="password" bsSize="large">
          Password
          <FormControl
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
        </FormGroup>
        <Button variant="primary" disabled={!validateForm()} type="submit">
          Rigister
        </Button>{' '}
        <Button variant="primary"  onClick={handleLogin} >
          Login
        </Button>
      </form>
    </div>
    </div>
  );
}