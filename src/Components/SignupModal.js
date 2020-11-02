import {  Modal } from 'react-bootstrap';
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
 
const SignupModal = (props) => {
  const SERVER_URL='auth/signup'
  const [Username, setUsername] = useState("");
  const [Role, setRole] = useState('["mod","user"]');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  let signupRequest = {};
  let authenticated = false;
  

//   function validateForm() {
//     return email.length > 0 && password.length > 0;
//   }
function handleClear(e) {
  e.preventDefault();
 // let cleardata="";
  setUsername("");
  setPassword("");
  //console.log('The clear button was clicked.');
}


  function handleSubmit(event) {
    console.log('Username',Username);
    console.log('Role',Role);
    console.log('email',email);
    console.log('password',password);
    
    event.preventDefault();

    signupRequest = {
      'username':Username, 'password': password.trim(), 'email':email.trim(), 'role':["mod","user"]
    }

    console.log("signupRequest--->"+JSON.stringify(signupRequest));
    fetch(SERVER_URL, {
      method: 'POST',
      headers: { "Content-Type": "application/json", "Access-Control-Origin": "*" },
      body: JSON.stringify(signupRequest)
       })
      .then((res) => res.json())
      .then((data) => {
         authenticated = true

         let errmsg=data.message;

         if(errmsg==='Error: Username is already taken!'){
           alert('Username is already taken!')
         }
         else if(errmsg==='Error: Email is already in use!'){
          alert('Email is already in use!')
         }
         else if(errmsg==='User registered successfully!'){
          props.handleSignupModalOpen();
          props.handleLoginModalOpen();
         }
         else{
          alert('Enter valid Credentials!')
         }
         console.log('Error message',data.message)         
         console.log("response--"+JSON.stringify(data))
      });
  }
    return (
        <>
            <Modal 
              show={props.smodalOpen} 
              onHide={props.handleSignupModalOpen}
              backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Sign Up</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="Login">
      <form onSubmit={handleSubmit}>
      <FormGroup >
        Username
          <FormControl
            autoFocus
            value={Username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup  >
        Password
          <FormControl
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup controlId="email" >
        Email
          <FormControl
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        <Button variant="primary"  type="submit">
          Signup
        </Button>{' '}
        <Button variant="secondary" onClick={handleClear}>
        Clear
        </Button>
        
        
      </form>
    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
 
export default SignupModal;