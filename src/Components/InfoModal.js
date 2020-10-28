import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const InfoModal = (props) => { 
    return (
        <>
          <Modal show={props.modalOpen} onHide={props.handleModalOpen}>
              <Modal.Header closeButton>
                 <Modal.Title>Info</Modal.Title>
              </Modal.Header>
              <Modal.Body>ALA is a conversational AI. <br></br>ALA stands for Ameri Learning App</Modal.Body>
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