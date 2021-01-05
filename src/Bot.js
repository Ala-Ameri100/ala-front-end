import React, { Component } from 'react'
import styled from 'styled-components';
import { NaviBar } from './Components/Navibar';
import { ChatBox } from './Components/ChatBox';
import { MsgBox } from './Components/MsgBox';
import { InfoBox } from './Components/InfoBox';
import { ApplicationContext } from './Context';

const MainDiv = styled.div`
    display: flex;
    height: calc(100vh - 58px);
    padding:10px;
`;

const Listening = styled.div`
    display : block;
    position : fixed;
    z-index: 100;
    background-image : url("/assets/listening2.gif");
    /* background-color: black; */
    background-color: #120724;
    opacity : 0.5;
    background-repeat : no-repeat;
    background-position : center;
    left : 0;
    bottom : 0;
    right : 0;
    top : 0;
`;

const ChatDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: 30%;
    border: 1px solid #dfdfdf;
    border-radius: 0.25rem;
`;

const InfoDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: 70%;
`;

export class Bot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chatArray: [],
            listening: true,
        };
    }

    componentDidMount() {
        fetch('/welcome').then((res) => res.json()).then((data) => {
            this.pushToChat(data);
        });
    }

    pushToChat(data) {
        let chatArray = this.state.chatArray;
        for (const [i, msg] of data.answer.entries()) {
            setTimeout(() => {
                chatArray.push({
                    message: msg,
                    botMsg: true,
                    clickable: data.resReq ? data.resReq[i] : false,
                    Topic: data.Topic ? data.Topic[i] : false,
                });
                this.setState({ chatArray: chatArray });
            }, i * 500);
        };
        console.log(chatArray)
    }

    handleSend(msg) {
        if (msg) {
            console.log(msg)
            
            fetch('/query', {
                method: 'POST',
                headers: { "Content-Type": "application/json", "Access-Control-Origin": "*" },
                body: JSON.stringify({ 'messageText': msg, 'topic': null })
            })
                .then((res) => res.json())
                .then((data) => {
                    this.pushToChat(data);
                });
            const chatArray = this.state.chatArray.slice();
            chatArray.push({
                message: msg,
                botMsg: false,
                clickable: false,
            });
            this.setState({ chatArray: chatArray });
        }
    }

    
    toggleListening = () => {
        this.setState({ listening: !this.state.listening });
    }

    render() {
        return (
            <>
                <ApplicationContext.Provider value={{ toggleListening: this.toggleListening }}>
                    <Listening hidden={this.state.listening} />
                    <NaviBar></NaviBar>
                    <MainDiv>
                        <ChatDiv>
                            <ChatBox chatArray={this.state.chatArray} onClick={(msg) => this.handleSend(msg)}></ChatBox>
                            <MsgBox onSend={(msg) => this.handleSend(msg)}></MsgBox>
                        </ChatDiv>
                        <InfoDiv>
                            <InfoBox />
                        </InfoDiv>
                    </MainDiv>
                </ApplicationContext.Provider>

            </>
        )
    }
}