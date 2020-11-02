import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Modal } from 'react-bootstrap';
import { FormGroup, FormControl } from "react-bootstrap";
import { Bot } from "../Bot";
 

const LoginModal = (props) => {
    const accessToken=[];
    const SERVER_URL ='auth/signin';
    const [username, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();
    let signInRequest = {};
    let authentication=false;

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
                .then((res) => res.json())
                .then((data) => {
                  accessToken.push({
                    accessToken:data.accessToken
                  })
                  console.log('accessToken',accessToken[0].accessToken);
                });
              if(accessToken.length){
                authentication=true;
                localStorage.setItem('accessToken',accessToken[0].accessToken);
                //const NewaccessToken = localStorage.getItem('accessToken')
                const sval = JSON.stringify(localStorage.getItem('accessToken'))
                console.log('NewaccessToken',sval)
              }
              //console.log('accessToken2',accessToken[0]);
              
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
                {/* <Bot UseraccessToken={accessToken}></Bot> */}
            </Modal>
            
        </>
    );
}

 

export default LoginModal;