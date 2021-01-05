import React from 'react';
import styled, { keyframes } from 'styled-components';
import { bounceIn } from 'react-animations';

const bounceInAnimation = keyframes`${bounceIn}`;

const Bubble = styled.div`
    min-width: 20%;
    max-width: 70%;
    background-color: ${props => bubbleColor(props)};
    border-radius: ${props => props.botMsg ? "0px 7px 7px 7px" : "7px 0px 7px 7px"};
    margin: 5px;
    align-self: ${props => props.botMsg ? "flex-start" : "flex-end"};

    p {
        padding: 5px;
        color: white;
    }

    animation: 0.5s ${bounceInAnimation};
`;


function bubbleColor(props) {
    if (props.clicks) {
        return "#28a745";
    } else if (props.botMsg) {
        return "#0069d9";
    } else {
        return "#989898";
    }
}


export const ChatBubble = (props) => (
    <Bubble botMsg={props.botMsg} clicks={props.clicks} onClick={() => props.handleClick(props.text)}>
        <p>{props.text}</p>
    </Bubble>
);