import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Modal, Spinner } from 'react-bootstrap';
import { FormGroup, FormControl, Form } from "react-bootstrap";
import { Bot } from "../Bot";
import { wait } from "@testing-library/react";

const reload = () => window.location.reload();

const LoginModal = (props) => {
  const SERVER_URL = 'auth/signin';
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  let signInRequest = {};
  let errmsg = "";
  const [userlogin, setuserlogin] = useState("");
  const [isloading, setloading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (username === "" || password === "") {
      alert("Fields are required");
      return;
    }
    else {

      setloading(true);

      signInRequest = {
        'username': username, 'password': password
      }
      const res = fetch(SERVER_URL, {
        method: 'POST',
        headers: { "Content-Type": "application/json", "Access-Control-Origin": "*" },
        body: JSON.stringify(signInRequest)
      })
        .then((res) => res.json()).then((data) => {          
          console.log('Error message', data.message)
          errmsg = data.message;
          console.log('Data after login', data.username)

          if (errmsg === 'Bad credentials') {
            console.log('Login Failed')
            alert('Signin failed! Please try Again')
          }
          else {
            console.log('Login Success')
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('uname', data.username);
            props.handleLoginModalOpen();

            window.location.reload(false);
          }

          setloading(false);

          // setuserlogin(data.username);
        }).catch(() => {
          // Only network error comes here
          console.log('Im here')
          // alert('User could not sign in!')
        });


      //.catch(() => alert('Could not register user!'));
      console.log('Error message', errmsg)
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
        onExit={reload}
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
                  aria-describedby="pwdHelp"
                />
                <small id="pwdHelp" class="text-muted">
                  Must be 6-40 characters long
                </small>
              </FormGroup>
              {!isloading && <Button variant="primary" type="submit">
                Login
          </Button>}
              {isloading && <Button variant="primary" type="submit" disabled>
                <Spinner animation="border" variant="light" size="sm" as="span" /> Loading...
          </Button>}
              {' '}
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