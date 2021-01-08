import React, { Component } from "react";
import styled, { keyframes } from "styled-components";
import { pulse } from 'react-animations';


const bounceInAnimation = keyframes`${pulse}`;
const BounceAnimation = keyframes`
  0% { margin-bottom: 0; }
  50% { margin-bottom: 10px }
  100% { margin-bottom: 0 }
`;

const Bubblediv = styled.div`
    min-width: 30%;
    max-width: 50%;
    align-self: "flex-start";

`;
const IMges=styled.img`
    visibility:'visible';
    width:40px;
    height:50px;
`;

const DotWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  height:30px;  
  min-width: 20%;
  max-width: 50%;
  background-color:#0069d9;
  border-radius:10px 10px 0px 10px;
  margin: 5px;
  align-self:flex-start;
  box-shadow: 0px 3px 5px ; 
  animation: 0.5s ${bounceInAnimation};
`;

const Dot = styled.div`
  background-color: white;
  border-radius: 50%;
  width: 10px;
  height: 10px;
  margin: 0 5px;

  /* Animation */
  animation: ${BounceAnimation} 0.5s linear infinite;
  animation-delay: ${props => props.delay};
`;

class LoadingDots extends Component {

  render() 
  {
    return(
      <Bubblediv botMsg={this.props.botMsg} className="divBub">
        <IMges botMsg={this.props.botMsg} src={`${process.env.PUBLIC_URL}/assets/logobot.png`}></IMges>
        <DotWrapper>
        <Dot delay="0s" />
        <Dot delay=".1s" />
        <Dot delay=".2s" />
      </DotWrapper>
      </Bubblediv>
    )
  }
}

export default LoadingDots