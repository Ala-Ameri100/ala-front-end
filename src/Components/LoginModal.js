import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Modal } from 'react-bootstrap';
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
 

const LoginModal = (props) => {
    const SERVER_URL ='auth/signin';
    const [username, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();
    let signInRequest = {};

    async  function handleSubmit(event) {
         event.preventDefault();
         if (username === "" || password === "") {
            alert("Fields are required");
            return;
          }
          else{
              console.log('Inside signIn');
              props.handleLoginModalOpen();
            //     fetch('/auth/signin').then((res) => res.json()).then((data) => {
            //     console.log('data',data)
            // });
            signInRequest = {
              'username': username, 'password': password
            }
              const res =  fetch(SERVER_URL, {
                method: 'POST',
                headers: { "Content-Type": "application/json", "Access-Control-Origin": "*" },
                body: JSON.stringify(signInRequest)
                 })
                .then((res) => res.json())
                .then((data) => {
          
                  console.log("response--"+data)
                });
              //const data =  res.json();
              console.log('login data',JSON.stringify(res));
              //setHistory('/home');
            // if(email==='vishwa@gmail.com' && password==='1234'){
            //     console.log('email',email ,password);
            //     //const res = await fetch({ url: SERVER_URL, method: "POST", body: values });
            //     //const data = await res.json();
            //     //setHistory('/home');
            //     props.handleLoginModalOpen();
            //     history.push("/home");
            //     alert('you are loggedin!')
     
            // }
            // else{
            //     alert('please check credentials!');
            // }
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
                
            </Modal>
        </>
    );
}

 

export default LoginModal;