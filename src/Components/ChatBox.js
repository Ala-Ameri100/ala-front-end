import React, { Component } from 'react'
import styled from 'styled-components';
import { ChatBubble } from './ChatBubble';

const Chat = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 150px;
    max-width: 500px;
    height: 85%;
    overflow-y: auto;
    padding: 5px;
    margin-bottom: 10px;
`;

export class ChatBox extends Component {

    componentDidUpdate() {
        setTimeout(() => {
            this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        }, 500);
    }

    handleClick(value, clickable) {
        if (clickable) this.props.onClick(value);
    }

    render() {
        return (
            <Chat id="chatDiv">
                {this.props.chatArray.map((chat, index) => {
                    return <ChatBubble key={index} text={chat.message} botMsg={chat.botMsg} clicks={chat.clickable} handleClick={(value) => this.handleClick(value, chat.clickable)}></ChatBubble>
                })}
                <div style={{ float: "left", clear: "both" }}
                    ref={(el) => { this.messagesEnd = el; }}>
                </div>
            </Chat>

        )
    }
}