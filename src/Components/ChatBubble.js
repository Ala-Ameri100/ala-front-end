import React from 'react';
import styled, { keyframes } from 'styled-components';
import { bounceIn } from 'react-animations';
import { Checkbox, useIsFocusVisible, Radio } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const bounceInAnimation = keyframes`${bounceIn}`;

const IMges=styled.img`
    visibility:${props => props.botMsg ? 'visible' : 'Hidden'};
    width:40px;
    height:30px;
`;

const Bubblediv = styled.div`
    min-width: 30%;
    max-width: 100%;
    align-self: ${props => props.botMsg ? "flex-start" : "flex-end"};

`;
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
    } else if(props.Multioption){
        return "#e68a00"
    }
    else if (props.botMsg) {
        return "#0069d9";
    } else {
        return "#989898";
    }
    
}



export const ChatBubble = (props) => (
    
        <Bubblediv botMsg={props.botMsg} className="divBub">
           <IMges botMsg={props.botMsg} src={`${process.env.PUBLIC_URL}/assets/bot-icon-5.jpg`} width="20px" height="20px"></IMges>
               <Bubble Multioption={props.Multioption} choice={props.choice} botMsg={props.botMsg} clicks={props.clicks} onClick={() => props.handleClick(props.text)} onChange={()=> props.Multioption?props.handleCheck(props.choice): null} >
               {/* <Bubble Multioption={props.Multioption} choice={props.choice} botMsg={props.botMsg} clicks={props.clicks} onClick={() => props.handleClick(props.text)}>  */}
                {props.Multioption ?
                <FormControlLabel
                control={
                  <Radio
                    color="primary"
                  />
                }
                label={props.text}
                value={props.choice}
              />:
                <p>{props.text}</p>}
        </Bubble>
        </Bubblediv>
);  