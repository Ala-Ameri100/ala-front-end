import React, { Component , Fragment} from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import styled from 'styled-components';
import { FaQuestionCircle, FaInfoCircle, FaSignInAlt,FaSignOutAlt, FaStreetView, } from 'react-icons/fa';
import InfoModal from './InfoModal'
import LoginModal from './LoginModal'
import SignupModal from './SignupModal'
 
export default class NaviBar extends Component {
  
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            lmodalOpen: false,
            smodalOpen: false,
            userlogin: 'Guest'
        }
    }
 
    handleModalOpen = () => {
        this.setState((prevState) => {
            return {
                modalOpen: !prevState.modalOpen,
            }
        })
    }

    handleLogout=()=>{
        console.log('inside logout')
        localStorage.setItem('accessToken',"")
        localStorage.removeItem('uname')
        
        this.handleLoginModalOpen();
    }
    
    handleLoginModalOpen = () => {
        this.setState((prevState) => {
            return {
                lmodalOpen: !prevState.lmodalOpen
            }
        })
    }

     handleSignupModalOpen = () => {
         this.setState((prevState) => {
            return {
               smodalOpen: !prevState.smodalOpen
            }
       })
     }
 
    render() {
        return (
            <>
                <Navbar className="color-nav" >
                    <Navbar.Brand href="/" className="ameri-logo" >
                        <img alt="Ameri100" style={{ "width": "7rem", "marginBottom": "5px",  }} src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Ameri100_logo.png/320px-Ameri100_logo.png"></img>
                    </Navbar.Brand>
                    <div>
                    {localStorage.getItem('uname')? 
                    <Nav.Item style={{color: "white"}}>Hi {localStorage.getItem('uname')} ! </Nav.Item>: <Nav.Item></Nav.Item>
                     }
                    </div>
                    <hr />

                    {localStorage.getItem('accessToken')? 
                    <Nav.Link onClick={this.handleLogout} style={{color: "white", textDecoration: 'none'}}><FaSignOutAlt></FaSignOutAlt> Logout</Nav.Link>:
                    <Fragment><Nav.Link onClick={this.handleLoginModalOpen} style={{color: "white", textDecoration: 'none'}}><FaSignInAlt></FaSignInAlt> Login</Nav.Link>
                    <Nav.Link onClick={this.handleSignupModalOpen} style={{color: "white", textDecoration: 'none'}}><FaStreetView></FaStreetView> Signup</Nav.Link> </Fragment>
                    }                   
 
                    <div className="upload-icon">                    
                        {/* <FaQuestionCircle className="faq-icon" size="1.5em" cursor="pointer" /> */}
                        <FaInfoCircle className="fai-icon" size="1.5em" cursor="pointer" onClick={this.handleModalOpen} />
                    </div>
 
                </Navbar>
                <InfoModal
                    modalOpen={this.state.modalOpen}
                    handleModalOpen={this.handleModalOpen}
                />
                <LoginModal
                lmodalOpen={this.state.lmodalOpen}
                handleLoginModalOpen={this.handleLoginModalOpen}
                />
                <SignupModal
                smodalOpen={this.state.smodalOpen}
                handleSignupModalOpen={this.handleSignupModalOpen}
                handleLoginModalOpen={this.handleLoginModalOpen}
            />
            </>
        )
    }
}