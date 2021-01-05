import React from 'react';
import { Navbar } from 'react-bootstrap';
import { FaQuestionCircle, FaInfoCircle } from 'react-icons/fa';

export const NaviBar = () => (
    <>
        <Navbar bg="primary" variant="dark">
            <Navbar.Brand href="/" className="ameri-logo">
                <img alt="Ameri100" style={{ "width": "7rem", "marginBottom": "5px" }} src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Ameri100_logo.png/320px-Ameri100_logo.png"></img>
            </Navbar.Brand>
            <Navbar.Brand href="/">
                ALA
            </Navbar.Brand>
            <hr />
            <FaQuestionCircle style={{ "marginLeft": "5px" }} color="white" size="1.5em" />
            <FaInfoCircle style={{ "marginLeft": "5px" }} color="white" size="1.5em" />
        </Navbar>
    </>
);