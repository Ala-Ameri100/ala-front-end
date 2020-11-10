import React, { Component } from 'react'
import styled from 'styled-components';
import { Button, Form, Modal } from 'react-bootstrap';
import { FaMicrophoneAlt, FaTelegramPlane } from 'react-icons/fa';
import { ApplicationContext } from '../Context';


const Msg = styled.div`
    display: flex;
   //min-height: 15%;
    width: 100%;
    /* min-width: 150px;
    max-width: 500px; */
    align-items: end;
    padding: 5px;
    padding:10px;

    textarea {
        resize: none;
        width: 100%;
        height: 100%;
        margin: 0px 5px 0px 5px;
        
        /*box-shadow: 0px 5px 5px  grey;*/
    }
    
    div {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;

        button {
            margin: 5px;
            // box-shadow: 0px 5px 5px  grey;
        }
    }
`;

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : null;
if (recognition) {
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
}

export class MsgBox extends Component {

    static contextType = ApplicationContext;

    constructor(props) {
        super(props);
        this.state = {
            value: "",
            modal: { show: false },
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        this.handleSend = this.handleSend.bind(this);
        this.startRecognition = this.startRecognition.bind(this);
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleEnter(event) {
        if (event.key === 'Enter') {
            this.handleSend();
        }
    }

    handleSend() {
        // const { toggleListening } = this.context;
        // toggleListening();
        const value = this.state.value;
        this.props.onSend(value);
        this.setState({
            value: ""
        });
    }

    startRecognition() {
        const { toggleListening } = this.context;
        if (recognition) {
            toggleListening();
            recognition.start();
            console.log('listening...');
            recognition.onresult = event => {
                let speech = event.results[0][0].transcript;
                // console.log(speech);
                this.setState({ value: speech });
                // this.setState({ value: speech }, this.handleSend);
            };         
            recognition.onend = () => { 
                console.log('Speech error');
                toggleListening();
            };
        } else {
            this.setState({ modal: { show: true } })
        }
    }

    render() {
        return (
            <>
                
                <Msg>
                    {/* <textarea placeholder="Enter your message...." value={this.state.value} onKeyUp={this.handleEnter} onChange={this.handleChange}></textarea> */}
                    <Form.Control as="textarea" style={{"box-shadow": "0px 3px 15px"}} placeholder="Enter your message...." value={this.state.value} onKeyUp={this.handleEnter} onChange={this.handleChange} />
                    <div>
                        <Button style={{"box-shadow": "0px 3px 15px"}} variant="outline-primary" onClick={this.handleSend}><FaTelegramPlane size="1.5em" /></Button>
                        <Button style={{"box-shadow": "0px 3px 15px"}} variant="outline-success" onClick={this.startRecognition}><FaMicrophoneAlt size="1.5em" /></Button>
                    </div>
                </Msg>

                <Modal show={this.state.modal.show} onHide={() => this.setState({ modal: { show: false } })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Oops!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Speech recognition not supported by browser.</p>
                    </Modal.Body>
                </Modal>
            </>
        )
    }
}