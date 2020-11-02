import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Modal } from 'react-bootstrap';
import { FormGroup, FormControl } from "react-bootstrap";
import { Bot } from "../Bot";
import { wait } from "@testing-library/react";
 

const LoginModal = (props) => {
    const SERVER_URL ='auth/signin';
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    let signInRequest = {};
    let errmsg = "";
    const[userlogin, setuserlogin] = useState("");

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
               })
               .then((res) => res.json()).then((data) => {
                localStorage.setItem('accessToken',data.accessToken);

                console.log('Error message',data.message)
                errmsg = data.message;
                console.log('Data after login',data.username)

                  if(errmsg==='Bad credentials')
                  {
                    console.log('Login Failed')
                    alert('Signin failed! Please try Again')
                   }
                   else
                 {
                  console.log('Login Success')
                  props.handleLoginModalOpen();
                  }
               // setuserlogin(data.username);
               }).catch(() => {
                  // Only network error comes here
                  console.log('Im here')
                 // alert('User could not sign in!')
            });
                //.catch(() => alert('Could not register user!'));
                console.log('Error message',errmsg)
                
                //alert('Succesfully loggedin!');
                //window.location.reload(false);
          }
      }

      function handleClear(e) {
        e.preventDefault();
       // let cleardata="";
        setUsername("");
        setPassword("");
        //console.log('The clear button was clicked.');
      }

    return (
        <>
            <Modal 
              show={props.lmodalOpen} 
              onHide={props.handleLoginModalOpen}
              backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <div className="Login">
      <form onSubmit={handleSubmit} id="formid">
        <FormGroup controlId="username" >
        Username
          <FormControl
            autoFocus
            required
            id="uname"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="password" >
          Password
          <FormControl
            value={password}
            id="pwd"
            required
            onChange={e => setPassword(e.target.value)}
            type="password"
          />
        </FormGroup>
        <Button variant="primary" type="submit">
          Login
        </Button>{' '}
        <Button variant="secondary" onClick={handleClear}>
        Clear
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