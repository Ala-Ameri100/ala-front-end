import {  Modal } from 'react-bootstrap';
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
 
const SignupModal = (props) => {
  const SERVER_URL='/auth/signup'
  const [Username, setUsername] = useState("");
  const [Role, setRole] = useState('["mod","user"]');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
 


//   function validateForm() {
//     return email.length > 0 && password.length > 0;
//   }
  

  function handleSubmit(event) {
    console.log('Username',Username);
    console.log('Role',Role);
    console.log('email',email);
    console.log('password',password);
    console.log(JSON.stringify({ 'username': email.trim(), 'password': password.trim(), 'email':email.trim(), 'role':Role}));
    event.preventDefault();
    const res = fetch({ url: SERVER_URL, method: "POST", body: JSON.stringify({ 'username': email.trim(), 'password': password.trim(), 'email':email.trim(), 'role':Role}) });
   // const data =  res.json();
    console.log('SignUP', JSON.stringify(res));
  }
    return (
        <>
            <Modal show={props.smodalOpen} onHide={props.handleSignupModalOpen}>
                <Modal.Header closeButton>
                    <Modal.Title>Sign Up</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="Login">
      <form onSubmit={handleSubmit}>
      <FormGroup >
        UserName
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
            
          />
        </FormGroup>
        <FormGroup controlId="email" >
        Email
          <FormControl
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </FormGroup>
        {/* <FormGroup controlId="password" >
          Role
          <FormControl
            value={Role}
            onChange={e => setRole(e.target.value)}
            
          />
        </FormGroup> */}
        <Button variant="primary"  type="submit">
          Rigister
        </Button>{' '}
        
      </form>
    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
 
export default SignupModal;