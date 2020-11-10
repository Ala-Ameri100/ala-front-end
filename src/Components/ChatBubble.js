import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { bounceIn } from 'react-animations';
import { Checkbox, useIsFocusVisible, Radio } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';


const bounceInAnimation = keyframes`${bounceIn}`;

const TypingBalls = styled.div`
    margin: 32px;
    span {
      width: 10px;
      height: 10px;
      background-color: black;
      display: inline-block;
      margin: 1px;
      border-radius: 50%;
      &:nth-child(1) {
        animation: bounce 1s infinite;
      }
      &:nth-child(2) {
        animation: bounce 1s infinite .2s;
      }
      &:nth-child(3) {
        animation: bounce 1s infinite .4s;
      }
    }
    @keyframes bounce {
        0% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(8px);
        }
        100% {
          transform: translateY(0px);
        }
      }
      
`;
const IMges=styled.img`
    visibility:${props => props.botMsg ? 'visible' : 'Hidden'};
    width:40px;
    height:50px;
`;

const Bubblediv = styled.div`
    min-width: 30%;
    max-width: 100%;
    align-self: ${props => props.botMsg ? "flex-start" : "flex-end"};

`;
const Bubble = styled.div`
    min-width: 20%;
    max-width: 90%;
    background-color: ${props => bubbleColor(props)};
    border-radius: ${props => props.botMsg ? "0px 7px 7px 7px" : "7px 0px 7px 7px"};
    margin: 5px;
    align-self: ${props => props.botMsg ? "flex-start" : "flex-end"};
    // box-shadow: 0px 2px 15px ;
    box-shadow: 0px 3px 5px ; 
    p {
        padding: 5px;
        color: white;
    }

    &:hover {
      opacity: ${props => bubbleOP(props)};
      cursor: ${props => bubbleCursor(props)};
      }
    animation: 0.5s ${bounceInAnimation};
`;


function bubbleOP(props) {
    if (props.clicks) {
        return 0.75;
    } else if(props.Multioption){
       return 0.75;
    }
    else if (props.botMsg) {
        return "#0069d9";
    } else {
        return "#989898";
    }
    
}

function bubbleColor(props) {
  if(props.Qoptions){
    return "#0069d9"
  }
  else if (props.clicks) {
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

function bubbleCursor(props) {
  if (props.clicks) {
      return 'pointer';
  } else if(props.Multioption){
      return 'pointer'
  }
  else if (props.botMsg) {
      return '';
  } else {
      return '';
  }
  
}


export class ChatBubble extends React.Component{
    
  render(){
      return(


      <Bubblediv botMsg={this.props.botMsg} className="divBub">

         <IMges botMsg={this.props.botMsg} src={`${process.env.PUBLIC_URL}/assets/logobot.png`}></IMges>
             <Bubble Qoptions={this.props.Qoptions} IsQuestion={this.props.IsQuestion} choice={this.props.choice} botMsg={this.props.botMsg} clicks={this.props.clicks} onClick={() => this.props.handleClick(this.props.text)} >
              
              {/* <TypingBalls>
                  <span></span>
                  <span></span>
                  <span></span>
              </TypingBalls> */}
             {/* <Bubble Multioption={props.Multioption} choice={props.choice} botMsg={props.botMsg} clicks={props.clicks} onClick={() => props.handleClick(props.text)}>  */}
              {/* {this.props.Multioption ?
              <FormControlLabel
              control={
                <Checkbox
                  color="primary"
                />
              }
              label={this.props.text}
              value={this.props.choice}
            />: */}
              <p>{this.props.text}</p>
      </Bubble>
      </Bubblediv>      
      )
  }
}