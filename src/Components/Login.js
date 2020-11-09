import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import  NaviBar  from './Navibar';
import  { Redirect } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }
  async function handleRigister(){
      history.push("/signup");
  }

  async  function handleSubmit(event) {
     event.preventDefault();
     if (email === "" || password === "") {
        alert("Fields are required");
        return;
      }
      else{
        if(email==='vishwa@gmail.com' && password==='1234'){
            console.log('email',email ,password);
            //const res = await fetch({ url: SERVER_URL, method: "POST", body: values });
            //const data = await res.json();
            //setHistory('/home');
            history.push("/home");
            alert('you are loggedin!')
 
        }
        else{
            alert('please check credentials!');
        }
      }
  }

  return (
      <div>
          <NaviBar className="NewChat"></NaviBar>
          <div className="Login">
      <form onSubmit={handleSubmit}>
        <FormGroup controlId="email" bsSize="large">
        Email
          <FormControl
            autoFocus
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
          Login
        </Button>{' '}
        
        <Button variant="primary"  onClick={handleRigister} >
          Rigister
        </Button>
      </form>
    </div>
      </div>
  );
}