import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Modal } from 'react-bootstrap';
import { FormGroup, FormControl } from "react-bootstrap";
import { Bot } from "../Bot";
import { wait } from "@testing-library/react";
 

const LoginModal = (props) => {
    const SERVER_URL ='auth/signin';
    const [username, setEmail] = useState("");
    const [password, setPassword] = useState("");
    let signInRequest = {};

    async  function handleSubmit(event) {
         event.preventDefault();
         if (username === "" || password === "") {
            alert("Fields are required");
            return;
          }
        else{
            signInRequest = {
              'username': username, 'password': password
            }
            const res =  fetch(SERVER_URL, {
              method: 'POST',
              headers: { "Content-Type": "application/json", "Access-Control-Origin": "*" },
              body: JSON.stringify(signInRequest)
               }).then((res) => res.json()).then((data) => {
                localStorage.setItem('accessToken',data.accessToken);
                });
                props.handleLoginModalOpen();
                //alert('Succesfully loggedin!');
                window.location.reload(false);
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
        <FormGroup controlId="username" >
        UserName
          <FormControl
            autoFocus
            
            value={username}
            onChange={e => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="password" >
          Password
          <FormControl
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
        </FormGroup>
        <Button variant="primary" type="submit">
          LogIN
        </Button>
        
        
      </form>
    </div>
                </Modal.Body>
                {/* <Bot UseraccessToken={accessToken}></Bot> */}
            </Modal>
            
        </>
    );
}

 

export default LoginModal;