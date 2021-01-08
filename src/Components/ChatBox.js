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
    border-radius: 5%;
    
`;

export class ChatBox extends Component {

    componentDidUpdate() {
        setTimeout(() => {
            this.messagesEnd.scrollIntoView({ behavior: "smooth" });
        }, 500);
    }

    handleClick(value, clickable) {
        console.log('Inside handle click',value);
        if (clickable) this.props.onClick(value);
        
    }
    handleCheck(value, Multioption){
        if(Multioption) {
            this.props.onCheck(value);
            console.log('Option is',value )
        }
        
    }

    render() {
        return (
            <Chat id="chatDiv">
                {this.props.chatArray.map((chat, index) => {
                    //console.log("chat--->"+JSON.stringify(chat)+"--index-->"+index)
                    return <ChatBubble Qoptions={chat.Qoptions} IsQuestion={chat.IsQuestion} key={index} text={chat.msg} botMsg={chat.botMsg} choice={chat.choice} clicks={chat.clickable} handleClick={(value) => this.handleClick(value, chat.clickable)} handleCheck={(value)=>this.handleCheck(value, chat.Multioption)}></ChatBubble>
                })}
                <div style={{ float: "left", clear: "both" }}
                    ref={(el) => { this.messagesEnd = el; }}>
                </div>
            </Chat>
        )
    }
}