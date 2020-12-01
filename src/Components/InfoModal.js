import React from 'react';
import styled from 'styled-components';
import { Button, Modal } from 'react-bootstrap';
import {FaGrinBeam} from 'react-icons/fa';

const InfoModal = (props) => { 
    return (
        <>
          <Modal show={props.modalOpen} onHide={props.handleModalOpen}>
              <Modal.Header closeButton className="login-nav">
                 <Modal.Title>Info</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                 <p >
                <b>Welcome to Ameri100 Learning Assistant</b> <br></br><br></br>  You can begin with selecting a Topic to start learning. <br></br> You will get a set of questions based on the Topic and Difficulty level that you choose. 
                <br></br> Some questions may contain more than one right answer.<br></br> You will get a score of 1 point for each right answer in Score Board.<br></br><br></br> Happy Learning <FaGrinBeam size="20px" color="grey"></FaGrinBeam> !         
                 </p></Modal.Body>
              {/* <Modal.Footer>
              <Button variant="secondary" onClick={props.handleModalOpen}>
                    Cancel
                 </Button>
                <Button variant="danger" onClick={props.handleModalLogout}>
                    Yes
                 </Button> 
              </Modal.Footer> */}
          </Modal>
        </>
     );
}

export default InfoModal;