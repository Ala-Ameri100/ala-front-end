import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Modal } from 'react-bootstrap';
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
 

const LoginModal = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();
    function validateForm() {
        return email.length > 0 && password.length > 0;
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
        <>
            <Modal show={props.lmodalOpen} onHide={props.handleLoginModalOpen}>
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
        
        
      </form>
    </div>
                </Modal.Body>
                
            </Modal>
        </>
    );
}

 

export default LoginModal;