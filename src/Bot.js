import React, { Component } from 'react'
import { useHistory } from "react-router-dom";
//import styled from 'styled-components';
import { FaCaretRight, FaGrinBeam, FaFrown } from 'react-icons/fa';
import NaviBar from './Components/Navibar';
import { ChatBox } from './Components/ChatBox';
import { MsgBox } from './Components/MsgBox';
import { InfoBox } from './Components/InfoBox';
import { ApplicationContext } from './Context';
import styled, { keyframes } from 'styled-components';
import { fadeInUp } from 'react-animations';
import LoginModal from './Components/LoginModal';
import LoadingDots from './Components/LoadindDots';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Checkbox, useIsFocusVisible, Radio } from '@material-ui/core';

const bounceInAnimation = keyframes`${fadeInUp}`;

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

const MainDiv = styled.div`
    display: flex;
    height: calc(100vh - 58px);
    padding-right:30px;
    padding-left:30px;
   
`;


const ChatDiv = styled.div`
    // background-color:#A9A9A9;
    
    border-radius: 0.5rem;
    animation: 1.0s ${bounceInAnimation};
    transition-timing-function: linear;
    box-shadow: 0px 3px 15px ;
    margin : 20px
    // background: linear-gradient(#abbaab, #ffffff);
    header{        
        width:100%;
        //height:15%;
        position:relative;
        background-image: linear-gradient(to right, #303f9f,#45cafc);
        border-top-left-radius:10px;
        border-top-right-radius:10px;
        border-bottom-left-radius: 50% 20%;
        border-bottom-right-radius: 50% 20%;
        color: white;
        font-size: 30px;
        text-align: center;
        font-family: "Times New Roman", Times, serif;
      }
`;

const InfoDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding-top:15px;
    padding-bottom:15px;
`;


export class Bot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chatArray: [],
            listening: true,
            ShowBot: true,
            SelTopic: [],
            DBQuestions: [],
            CurrentQuestion: [],
            CurrentRowID: [],
            TotalCorrectedQuestions: [
                { AnsweredQuestions: 0, TotalQuestions: 0 }
            ],
            Checkedval: [],
            isLoading: false,
            selectedvalue: '',
            selectedQoption: ''
        };
        this.rdlevelchange = this.rdlevelchange.bind(this);
        this.selectedmulti = this.selectedmulti.bind(this);
    }

    componentDidMount() {
        let atkon = localStorage.getItem('accessToken')

        fetch('/api/v1/welcome').then((res) => res.json()).then((data) => {
            console.log('data', data)
            let chatData = this.state.chatArray
            Object.keys(data).forEach(function (key) {

                console.log('inside compdidmount', atkon)
                if (atkon !== "") {
                    console.log('inside if')

                    chatData.push({
                        msg: data[key].message,
                        clickable: data[key].clickable,
                        botMsg: true,
                        Multioption: false
                    });
                }
                else {
                    console.log('inside else')
                    chatData.push({
                        msg: data[key].message,
                        clickable: false,
                        botMsg: true,
                        Multioption: false
                    });
                }
                //console.log("key-->"+key)
            });

            if (atkon == "") {
                chatData.push({
                    msg: 'Please login',
                    botMsg: true,
                    clickable: false,
                    Multioption: false
                });
            }
            else {

                this.fetchTopic('Topic');
            }
            this.pushToChat(chatData);
        });
    }

    pushToChat(data) {
        let chatArray = this.state.chatArray;
        this.setState({ chatArray: data });
    }

    rdlevelchange(e) {
        this.setState({ selectedvalue: e.target.value });
        console.log('selected event ', e.target.value)
        // console.log('selected option',this.state.)
    }

    selectedmulti(e) {
        let Checkedval = this.state.Checkedval;
        Checkedval.push({
            val: e.target.value
        });
        this.setState({ Checkedval: Checkedval });
    }

    //Upload answer to chatArray when user clicks on see answer
    UploadAnswer() {
        let Correctoptions = [];
        let RowID;
        let count = 1;
        let AnsArray = [];
        let chatData = this.state.chatArray;
        let CurrentQuestion = this.state.CurrentQuestion;
        if (this.state.CurrentRowID.length) {
            //console.log('CurrentRowID.length-1',this.state.CurrentRowID.length-1)
            RowID = this.state.CurrentRowID[this.state.CurrentRowID.length - 1].rowID;
        }
        else {
            RowID = -1;
        }
        Object.keys(CurrentQuestion).forEach(function (key) {
            key = parseInt(RowID) + 1;
            console.log('key', key)
            if (count > 0) {
                for (let i = 0, len = CurrentQuestion[key].AnsKey.length; i < len; i += 1) {
                    AnsArray.push({
                        value: CurrentQuestion[key].AnsKey.charAt(i) - 1
                    });
                    //AnsArray.push(+CurrentQuestion[key].AnsKey.charAt(i)); 
                    console.log('AnsArray', AnsArray)
                }
                for (let i = 0; i < AnsArray.length; i++) {
                    Correctoptions.push(<form><FaCaretRight></FaCaretRight>{CurrentQuestion[AnsArray[i].value].msg}</form>);
                    //console.log('AnsArray[i].value', AnsArray[i].value);
                }
                chatData.push({
                    msg: Correctoptions,
                    botMsg: true,
                    clickable: false,
                    Multioption: false
                });
                chatData.push({
                    msg: "Next Question",
                    botMsg: true,
                    clickable: true,
                    Multioption: false
                });
            }
            count--;
        });
        this.setState({ chatArray: chatData });
    }

    //Function to upload questions to chatarray
    UploadQuestions(msg) {
        let total;
        let TotalCorrectedQuestions = this.state.TotalCorrectedQuestions;
        let CurrentQuestion = [];
        let RowID;
        console.log('DBQuestions', this.state.DBQuestions);
        let DBQuestions = this.state.DBQuestions;
        let chatData = this.state.chatArray;
        console.log('Inside uploadQuestions', CurrentQuestion)
        let count = 1;

        let CurQuestionarr = [];
        //Checking fo rowID to upload next questions
        //If the rowID is undefined then it will starts from begining
        //IF rowID is not zero then upload next question
        if (this.state.CurrentRowID.length) {
            console.log('CurrentRowID.length-1', this.state.CurrentRowID.length - 1)
            let CurrentRowID = this.state.CurrentRowID[this.state.CurrentRowID.length - 1].rowID
            console.log('CurrentRowID', typeof CurrentRowID);
            console.log('DBQuestions', DBQuestions)
            console.log('DBQuestions', typeof DBQuestions.length);
            if (parseInt(CurrentRowID) + 1 >= this.state.DBQuestions.length) {
                chatData.push({
                    msg: 'Done with the questions, please select another topic',
                    botMsg: true,
                    clickable: false,
                    Multioption: false
                });
                chatData.push({
                    msg: 'Topic',
                    botMsg: true,
                    clickable: true,
                    Multioption: false
                });
                this.setState({ chatArray: chatData });
                return;
            }
            else {
                RowID = CurrentRowID;
            }
        }
        else {
            RowID = -1;
        }
        //Looping DBquestion to insert that to current question

        let currentComponent = this;

        Object.keys(DBQuestions).forEach(function (key) {
            key = parseInt(RowID) + 1;
            console.log('key', key)
            if (count > 0) {
                console.log('count', count)

                // let selectedQoption = this.state.selectedQoption;

                // if (DBQuestions[key].questionText !== "") {
                //     console.log('DBQuestions[key].questionText', DBQuestions[key].questionText)
                //     chatData.push({
                //         msg: DBQuestions[key].questionText,
                //         botMsg: true,
                //         clickable: false,
                //         IsQuestion:true
                //     });
                // }
                currentComponent.setState({ Checkedval: [] });
                if (DBQuestions[key].MultipleAns == true) {

                    if (DBQuestions[key].questionText !== "") {
                        CurQuestionarr.push(
                            <form>
                                {DBQuestions[key].questionText}
                            </form>

                        );
                    }

                    if (DBQuestions[key].answerChoice1 !== "") {
                        CurQuestionarr.push(
                            <form>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                        />
                                    }
                                    label={DBQuestions[key].answerChoice1}
                                    value={1}
                                    onChange={currentComponent.selectedmulti}
                                />
                            </form>
                        );
                        CurrentQuestion.push({
                            msg: DBQuestions[key].answerChoice1,
                            key: key,
                            choice: 1,
                            AnsKey: DBQuestions[key].correctAnswer,
                        });

                    }

                    if (DBQuestions[key].answerChoice2 !== "") {
                        CurQuestionarr.push(
                            <form>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                        />
                                    }
                                    label={DBQuestions[key].answerChoice2}
                                    value={2}
                                    onChange={currentComponent.selectedmulti}

                                />
                            </form>
                        );
                        CurrentQuestion.push({
                            msg: DBQuestions[key].answerChoice2,
                            key: key,
                            choice: 2,
                            AnsKey: DBQuestions[key].correctAnswer,
                        });

                    }
                    if (DBQuestions[key].answerChoice3 !== "") {
                        CurQuestionarr.push(
                            <form>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                        />
                                    }
                                    label={DBQuestions[key].answerChoice3}
                                    value={3}
                                    onChange={currentComponent.selectedmulti}
                                />
                            </form>
                        );
                        CurrentQuestion.push({
                            msg: DBQuestions[key].answerChoice3,
                            key: key,
                            choice: 3,
                            AnsKey: DBQuestions[key].correctAnswer,
                        });
                    }


                    if (DBQuestions[key].answerChoice4 !== "") {
                        CurQuestionarr.push(
                            <form>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                        />
                                    }
                                    label={DBQuestions[key].answerChoice4}
                                    value={4}
                                    onChange={currentComponent.selectedmulti}
                                />
                            </form>
                        );
                        CurrentQuestion.push({
                            msg: DBQuestions[key].answerChoice4,
                            key: key,
                            choice: 4,
                            AnsKey: DBQuestions[key].correctAnswer,
                        });
                    }
                    if (DBQuestions[key].answerChoice5 !== "") {
                        CurQuestionarr.push(
                            <form>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                        />
                                    }
                                    label={DBQuestions[key].answerChoice5}
                                    value={5}
                                    onChange={currentComponent.selectedmulti}
                                />
                            </form>
                        );
                        CurrentQuestion.push({
                            msg: DBQuestions[key].answerChoice5,
                            key: key,
                            choice: 5,
                            AnsKey: DBQuestions[key].correctAnswer,
                        });
                    }
                    if (DBQuestions[key].answerChoice6 !== "") {
                        CurQuestionarr.push(
                            <form>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                        />
                                    }
                                    label={DBQuestions[key].answerChoice6}
                                    value={6}
                                    onChange={currentComponent.selectedmulti}
                                />
                            </form>
                        );
                        CurrentQuestion.push({
                            msg: DBQuestions[key].answerChoice6,
                            key: key,
                            choice: 6,
                            AnsKey: DBQuestions[key].correctAnswer,
                        });
                    }

                    if (DBQuestions[key].answerChoice7 !== "") {
                        CurQuestionarr.push(
                            <form>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                        />
                                    }
                                    label={DBQuestions[key].answerChoice7}
                                    value={7}
                                    onChange={currentComponent.selectedmulti}
                                />
                            </form>
                        );
                        CurrentQuestion.push({
                            msg: DBQuestions[key].answerChoice7,
                            key: key,
                            choice: 7,
                            AnsKey: DBQuestions[key].correctAnswer,
                        });
                    }

                }
                else {
                    currentComponent.setState({ selectedQoption: '' });

                    if (DBQuestions[key].questionText !== "") {
                        CurQuestionarr.push(
                            <form>
                                {DBQuestions[key].questionText}
                            </form>
                        );
                    }

                    if (DBQuestions[key].answerChoice1 !== "") {
                        CurQuestionarr.push(
                            <form>
                                <FormControlLabel
                                    control={
                                        <Radio
                                        />
                                    }
                                    label={DBQuestions[key].answerChoice1}
                                    value={DBQuestions[key].answerChoice1}
                                    onChange={e => currentComponent.setState({ selectedQoption: e.target.value })}
                                />
                            </form>
                        );
                        CurrentQuestion.push({
                            msg: DBQuestions[key].answerChoice1,
                            key: key,
                            choice: 1,
                            AnsKey: DBQuestions[key].correctAnswer,
                        });
                    }

                    if (DBQuestions[key].answerChoice2 !== "") {
                        CurQuestionarr.push(
                            <form>
                                <FormControlLabel
                                    control={
                                        <Radio
                                        />
                                    }
                                    label={DBQuestions[key].answerChoice2}
                                    value={DBQuestions[key].answerChoice2}
                                    onChange={e => currentComponent.setState({ selectedQoption: e.target.value })}
                                />
                            </form>
                        );
                        CurrentQuestion.push({
                            msg: DBQuestions[key].answerChoice2,
                            key: key,
                            choice: 2,
                            AnsKey: DBQuestions[key].correctAnswer,
                        });
                    }
                    if (DBQuestions[key].answerChoice3 !== "") {
                        CurQuestionarr.push(
                            <form>
                                <FormControlLabel
                                    control={
                                        <Radio
                                        />
                                    }
                                    label={DBQuestions[key].answerChoice3}
                                    value={DBQuestions[key].answerChoice3}
                                    onChange={e => currentComponent.setState({ selectedQoption: e.target.value })}
                                />
                            </form>
                        );
                        CurrentQuestion.push({
                            msg: DBQuestions[key].answerChoice3,
                            key: key,
                            choice: 3,
                            AnsKey: DBQuestions[key].correctAnswer,
                        });
                    }


                    if (DBQuestions[key].answerChoice4 !== "") {
                        CurQuestionarr.push(
                            <form>
                                <FormControlLabel
                                    control={
                                        <Radio
                                        />
                                    }
                                    label={DBQuestions[key].answerChoice4}
                                    value={DBQuestions[key].answerChoice4}
                                    onChange={e => currentComponent.setState({ selectedQoption: e.target.value })}
                                />
                            </form>
                        );
                        CurrentQuestion.push({
                            msg: DBQuestions[key].answerChoice4,
                            key: key,
                            choice: 4,
                            AnsKey: DBQuestions[key].correctAnswer,
                        });
                    }
                    if (DBQuestions[key].answerChoice5 !== "") {
                        CurQuestionarr.push(
                            <form>
                                <FormControlLabel
                                    control={
                                        <Radio
                                        />
                                    }
                                    label={DBQuestions[key].answerChoice5}
                                    value={DBQuestions[key].answerChoice5}
                                    onChange={e => currentComponent.setState({ selectedQoption: e.target.value })}
                                />
                            </form>
                        );
                        CurrentQuestion.push({
                            msg: DBQuestions[key].answerChoice5,
                            key: key,
                            choice: 5,
                            AnsKey: DBQuestions[key].correctAnswer,
                        });
                    }
                    if (DBQuestions[key].answerChoice6 !== "") {
                        CurQuestionarr.push(
                            <form>
                                <FormControlLabel
                                    control={
                                        <Radio
                                        />
                                    }
                                    label={DBQuestions[key].answerChoice6}
                                    value={DBQuestions[key].answerChoice6}
                                    onChange={e => currentComponent.setState({ selectedQoption: e.target.value })}
                                />
                            </form>
                        );
                        CurrentQuestion.push({
                            msg: DBQuestions[key].answerChoice6,
                            key: key,
                            choice: 6,
                            AnsKey: DBQuestions[key].correctAnswer,
                        });
                    }

                    if (DBQuestions[key].answerChoice7 !== "") {
                        CurQuestionarr.push(
                            <form>
                                <FormControlLabel
                                    control={
                                        <Radio
                                        />
                                    }
                                    label={DBQuestions[key].answerChoice7}
                                    value={DBQuestions[key].answerChoice7}
                                    onChange={e => currentComponent.setState({ selectedQoption: e.target.value })}
                                />
                            </form>
                        );
                        CurrentQuestion.push({
                            msg: DBQuestions[key].answerChoice7,
                            key: key,
                            choice: 7,
                            AnsKey: DBQuestions[key].correctAnswer,
                        });
                    }
                }

                // currentComponent.setState({Checkedval:Checkedval})

                chatData.push({
                    msg: CurQuestionarr,
                    botMsg: true, //To know it is bot message
                    //clickable: DBQuestions[key].MultipleAns ? false : true, //Making bubble as clickable
                    clickable: false,
                    key: key, //Inserting row number
                    choice: 1, //Making this option as 1
                    AnsKey: DBQuestions[key].correctAnswer, //Inserting answer key for future use
                    Qoptions: true, //To determine it is a option
                    Multioption: DBQuestions[key].MultipleAns ? true : false
                });


                if (DBQuestions[key].MultipleAns == true) {
                    chatData.push({
                        msg: "Send",
                        botMsg: true,
                        clickable: true
                    });
                }
                else {
                    chatData.push({
                        msg: "Send Option",
                        botMsg: true,
                        clickable: true
                    });
                }

                total = TotalCorrectedQuestions[0].TotalQuestions + 1;
                TotalCorrectedQuestions[0].TotalQuestions = total;
                console.log('Total', total);

                //TotalCorrectedQuestions = TotalCorrectedQuestions[0].TotalQuestions = total

            }
            count--;
        });
        //TotalCorrectedQuestions = this.state.TotalCorrectedQuestions[0].TotalQuestions = total
        this.setState({ TotalCorrectedQuestions: TotalCorrectedQuestions });
        console.log('TotalCorrectedQuestions', this.state.TotalCorrectedQuestions);
        this.setState({ CurrentQuestion: CurrentQuestion });
        console.log('CurrentQuestion is', this.state.CurrentQuestion);
        this.setState({ chatArray: chatData });
        console.log('chatArray is', this.state.chatArray)

    }

    //Verify answer when user choose any option
    CheckAnswer(msg) {
        let TotalCorrectedQuestions = this.state.TotalCorrectedQuestions;
        let total2;
        let res;
        let rowID;
        console.log('Inside check ans', msg)
        let CurrentQuestion = this.state.CurrentQuestion;
        console.log('Inside check ans', typeof (CurrentQuestion), CurrentQuestion)

        //Loop currentQuestions for options
        Object.keys(CurrentQuestion).map(key => {
            console.log('Message is', CurrentQuestion[key].msg)
            if (msg.trim() === CurrentQuestion[key].msg) {
                console.log('correct option', CurrentQuestion[key].choice)
                const choice = CurrentQuestion[key].choice;
                if (choice == CurrentQuestion[key].AnsKey) {
                    rowID = CurrentQuestion[key].key
                    res = 1; //If the selected option is correct
                    total2 = TotalCorrectedQuestions[0].AnsweredQuestions + 1;
                    TotalCorrectedQuestions[0].AnsweredQuestions = total2;
                    console.log('Total2', total2);
                }
                else {
                    rowID = CurrentQuestion[key].key
                    res = 2; //If the selected option is wrong
                }
            }
        });
        if (res === 1) {
            return 1 + "," + rowID; //sending answer with checked question row ID if the user choosed option is correct
        }
        else {
            return 0 + "," + rowID; //sending answer with checked question row ID if the user choosed option is wrong
        }
        // const tifOptions = Object.keys(CurrentQuestion).map(key => 
        //     <option value={key}>{CurrentQuestion[key].msg}</option>
        // )
        // console.log('Inside check answerssssssss',tifOptions)
    }

    CheckForCorrectAns(msg) {
        if (msg !== "") {
            if (this.state.CurrentQuestion.length) {
                let RowID;
                const res = this.CheckAnswer(msg);
                console.log('result is', res);
                const answer_array = res.split(",");
                console.log('answer_array', answer_array)
                const choice = answer_array[0];

                if (answer_array[1] !== "undefined") {
                    RowID = answer_array[1];
                }
                else {
                    console.log('It isundefined!');
                    RowID = 0;
                }
                console.log('choice,RowID', choice, RowID);
                this.setState({ CurrentRowID: [] });
                let CurrentRowID = this.state.CurrentRowID;
                CurrentRowID.push({
                    rowID: RowID
                });
                this.setState({ CurrentRowID: CurrentRowID });
                console.log('CurrentRowID', CurrentRowID)
                if (choice == 1) {
                    const chatArray = this.state.chatArray.slice();
                    chatArray.push({
                        msg: msg,
                        botMsg: false,
                        clickable: false,
                        Multioption: false
                    });
                    chatArray.push({
                        msg: <form><FaGrinBeam size="30px"></FaGrinBeam>{' '}Right Answer</form>,
                        botMsg: true,
                        clickable: false,
                        Multioption: false
                    });
                    chatArray.push({
                        msg: 'Next Question',
                        botMsg: true,
                        clickable: true,
                        Multioption: false
                    });
                    this.setState({ chatArray: chatArray });
                }
                else {
                    const chatArray = this.state.chatArray.slice();

                    chatArray.push({
                        msg: msg,
                        botMsg: false,
                        clickable: false,
                        Multioption: false
                    });
                    chatArray.push({
                        msg: <form><FaFrown size="30px"></FaFrown>{' '}Wrong Answer</form>,
                        botMsg: true,
                        clickable: false,
                        Multioption: false
                    });
                    chatArray.push({
                        msg: 'See Answer',
                        botMsg: true,
                        clickable: true,
                        Multioption: false
                    });
                    this.setState({ chatArray: chatArray });
                }
            }
        }
    }

    // checkMultiAns() {
    //     let TotalCorrectedQuestions = this.state.TotalCorrectedQuestions;
    //     let total2;
    //     let RowID;
    //     let currentRow;
    //     let AnsKey;
    //     let checkAns = "";
    //     const chatArray = this.state.chatArray.slice();
    //     if (this.state.Checkedval.length) {
    //         if (this.state.CurrentQuestion.length) {
    //             console.log('currentQuestion inside multi ans',this.state.CurrentQuestion)
    //             AnsKey = this.state.CurrentQuestion[0].AnsKey;
    //             console.log('AnsKey', AnsKey)
    //             console.log('AnsKey type', typeof AnsKey)
    //             currentRow = this.state.CurrentQuestion[0].key;
    //         }
    //         let Checkedval = this.state.Checkedval;
    //         console.log('checkMultiAns', Checkedval)
    //         Object.keys(Checkedval).map(key => {
    //             console.log('Checkedval[key].val', Checkedval[key].val);
    //             if (AnsKey.includes(Checkedval[key].val)) {
    //                 checkAns = checkAns + Checkedval[key].val
    //             }
    //             else {
    //                 checkAns = checkAns + "0"
    //             }
    //         });
    //         console.log('checkAns', checkAns);
    //     }
    //     else{

    //     }
    //     if (checkAns.length == AnsKey.length) {
    //         total2 = TotalCorrectedQuestions[0].AnsweredQuestions + 1;
    //         TotalCorrectedQuestions[0].AnsweredQuestions = total2;
    //         RowID = currentRow;
    //         chatArray.push({
    //             msg: <form><FaGrinBeam size="30px"></FaGrinBeam>{' '}Right Answer</form>,
    //             botMsg: true,
    //             clickable: false,
    //             Multioption: false
    //         });
    //         chatArray.push({
    //             msg: 'Next Question',
    //             botMsg: true,
    //             clickable: true,
    //             Multioption: false
    //         });
    //         this.setState({ chatArray: chatArray });
    //     }
    //     else {
    //         RowID = currentRow;
    //         chatArray.push({
    //             msg: <form><FaFrown size="30px"></FaFrown>{' '}Wrong Answer</form>,
    //             botMsg: true,
    //             clickable: false,
    //             Multioption: false
    //         });
    //         chatArray.push({
    //             msg: 'See Answer',
    //             botMsg: true,
    //             clickable: true,
    //             Multioption: false
    //         });
    //         this.setState({ chatArray: chatArray });
    //     }
    //     let CurrentRowID = this.state.CurrentRowID;
    //     CurrentRowID.push({
    //         rowID: RowID
    //     });
    //     this.setState({ CurrentRowID: CurrentRowID });
    //     console.log('CurrentRowID', CurrentRowID)
    // }

    checkMultiAns() {
        let TotalCorrectedQuestions = this.state.TotalCorrectedQuestions;
        let total2;
        let RowID;
        let currentRow;
        let AnsKey;
        let checkAns = "";
        const chatArray = this.state.chatArray.slice();
        if (this.state.Checkedval.length) {
            if (this.state.CurrentQuestion.length) {
                console.log('currentQuestion inside multi ans', this.state.CurrentQuestion)
                AnsKey = this.state.CurrentQuestion[0].AnsKey;
                console.log('AnsKey', AnsKey)
                console.log('AnsKey type', typeof AnsKey)
                currentRow = this.state.CurrentQuestion[0].key;
            }
            let Checkedval = this.state.Checkedval;
            console.log('checkMultiAns', Checkedval)
            Object.keys(Checkedval).map(key => {
                console.log('Checkedval[key].val', Checkedval[key].val);
                if (AnsKey.includes(Checkedval[key].val)) {
                    checkAns = checkAns + Checkedval[key].val
                }
                else {
                    checkAns = checkAns + "0"
                }
            });
            console.log('checkAns', checkAns);

            if (checkAns.length == AnsKey.length) {
                total2 = TotalCorrectedQuestions[0].AnsweredQuestions + 1;
                TotalCorrectedQuestions[0].AnsweredQuestions = total2;
                RowID = currentRow;
                chatArray.push({
                    msg: <form><FaGrinBeam size="30px"></FaGrinBeam>{' '}Right Answer</form>,
                    botMsg: true,
                    clickable: false,
                    Multioption: false
                });
                chatArray.push({
                    msg: 'Next Question',
                    botMsg: true,
                    clickable: true,
                    Multioption: false
                });
                this.setState({ chatArray: chatArray });
            }
            else {
                RowID = currentRow;
                chatArray.push({
                    msg: <form><FaFrown size="30px"></FaFrown>{' '}Wrong Answer</form>,
                    botMsg: true,
                    clickable: false,
                    Multioption: false
                });
                chatArray.push({
                    msg: 'See Answer',
                    botMsg: true,
                    clickable: true,
                    Multioption: false
                });
                this.setState({ chatArray: chatArray });
            }
            let CurrentRowID = this.state.CurrentRowID;
            CurrentRowID.push({
                rowID: RowID
            });
            this.setState({ CurrentRowID: CurrentRowID });
            console.log('CurrentRowID', CurrentRowID)
        }
        // else {
        //     chatArray.push({
        //         msg: 'Please select options',
        //         botMsg: true,
        //         clickable: false,
        //         Multioption: false
        //     });
        //     this.setState({ chatArray: chatArray });
        // }

    }


    fetchQuestions(msg) {
        if (msg) {
            let strchck = "More than one answer is possible";
            let CurrentRowID = []; // Clearing current row iD   
            let DBQuestions = []; // Clearing selected DB questions
            let SelTopic = this.state.SelTopic;
            const accessToken = localStorage.getItem('accessToken');
            const selTopic = SelTopic[0]; // fetching  selected topic to fetch questions

            this.setState({ isLoading: true });

            fetch('/api/v1/getQuestionByTopicAndLevel?topic=' + selTopic + '&difficulty_level=' + msg, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json", "Access-Control-Origin": "*",
                    "Authorization": "Bearer " + accessToken
                },
                //body: JSON.stringify({ 'messageText': msg, 'topic': null })
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log('Questions', data)

                    this.setState({ isLoading: false });

                    Object.keys(data).forEach(function (key) {
                        if (data[key].correctAnswer.length > 1) {
                            DBQuestions.push({
                                questionText: data[key].questionText,
                                answerChoice1: data[key].answerChoice1,
                                answerChoice2: data[key].answerChoice2,
                                answerChoice3: data[key].answerChoice3,
                                answerChoice4: data[key].answerChoice4,
                                answerChoice5: data[key].answerChoice5,
                                answerChoice6: data[key].answerChoice6,
                                answerChoice7: data[key].answerChoice7,
                                answerDescription: data[key].answerDescription,
                                correctAnswer: data[key].correctAnswer,
                                Questions: true,
                                MultipleAns: true
                            });
                        }
                        else {
                            DBQuestions.push({
                                questionText: data[key].questionText,
                                answerChoice1: data[key].answerChoice1,
                                answerChoice2: data[key].answerChoice2,
                                answerChoice3: data[key].answerChoice3,
                                answerChoice4: data[key].answerChoice4,
                                answerChoice5: data[key].answerChoice5,
                                answerChoice6: data[key].answerChoice6,
                                answerChoice7: data[key].answerChoice7,
                                answerDescription: data[key].answerDescription,
                                correctAnswer: data[key].correctAnswer,
                                Questions: true,
                                MultipleAns: false
                            });
                        }
                    });
                    this.setState({ CurrentRowID: CurrentRowID });
                    this.setState({ DBQuestions: DBQuestions }); //Inserting Question with options to DBQuestions
                    const chatArray = this.state.chatArray.slice();
                    chatArray.push({
                        msg: msg,
                        botMsg: false,
                        clickable: false,
                        Multioption: false
                    });
                    this.setState({ chatArray: chatArray }); //Adding selected questions levels to chatarray
                    this.UploadQuestions(msg); //Calling upload question to add first question to ChatArray
                });

        }
    }

    //Fetch question levels using selected topic
    fetchQuestionLevels(msg) {
        if (msg) {
            let SelTopic = [];
            SelTopic.push(msg);
            const accessToken = localStorage.getItem('accessToken');
            this.setState({ SelTopic: SelTopic }); //Storing the selected topic into state object to use in fetech questions APi
            console.log('SelTopic is', SelTopic)
            console.log('inside fetch', msg)

            this.setState({ isLoading: true });

            fetch('/api/v1/getDifficultyLevelByTopic?topic=' + msg, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json", "Access-Control-Origin": "*",
                    "Authorization": "Bearer " + accessToken
                },
                //body: JSON.stringify({ 'messageText': msg, 'topic': null })
            }).then((res) => res.json())
                .then((data) => {

                    let temparr = [];
                    this.setState({ isLoading: false });

                    console.log('Difflevels', data)
                    let chatData = this.state.chatArray
                    temparr.push(
                        "Please select difficulty levels"
                    );
                    this.setState({ selectedvalue: '' })
                    console.log('initial selection : ', this.state.selectedvalue)
                    {
                        temparr.push()
                        data.map(diiflevels => (
                            temparr.push(
                                <form>
                                    <FormControlLabel
                                        control={<Radio />}
                                        label={diiflevels}
                                        value={diiflevels}
                                        name="groupname"
                                        //checked={this.state.selectedvalue==diiflevels}
                                        onChange={this.rdlevelchange}
                                    />
                                </form>

                                //     <form >
                                //          <input
                                //        type="radio"                              
                                //        value={diiflevels}
                                //        name="level"
                                //        onChange={this.rdlevelchange}
                                //         //checked={this.state.rdchklevel==diiflevels}                                
                                //   />
                                //     <label>
                                //         {diiflevels}
                                //     </label>                             
                                //   </form>
                            )
                        ))
                        //console.log('inside temparr',temparr)
                    };

                    chatData.push({
                        msg: temparr,
                        botMsg: true,
                        clickable: false,
                        Qlevels: true,// to identify the pushed text is Question levels
                        Multioption: false
                        //choice: 1
                    })
                    chatData.push({
                        msg: "Send Level",
                        botMsg: true,
                        clickable: true,
                        Qlevels: true,
                        Multioption: false
                        //choice: 1
                    })

                    // chatData.push({
                    //      msg: this.state.selectedvalue,
                    //         botMsg: false,
                    //         clickable: true,
                    //         Qlevels: true,
                    //          Multioption: false
                    //          //choice: 1
                    //      })

                    this.pushToChat(chatData);
                });
            const chatArray = this.state.chatArray.slice();
            chatArray.push({
                msg: msg,
                botMsg: false,
                clickable: false,
                Multioption: false
            });
            this.setState({ chatArray: chatArray });
        }
    }

    //Fetch topic from db when user clicks on topic
    fetchTopic(msg) {

        if (msg) {
            let selTopic = [];
            let DBQuestions = [];
            let CurrentQuestion = [];
            let CurrentRowID = [];
            let Checkedval = [];
            let temptoparr = [];
            const accessToken = localStorage.getItem('accessToken');

            this.setState({ isLoading: true });

            console.log('isloading', this.state.isLoading)
            console.log('accessToken', JSON.stringify(accessToken));
            console.log('fetch topic is called')
            //Topic API
            fetch('/api/v1/getTopics', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json", "Access-Control-Origin": "*",
                    "Authorization": "Bearer " + accessToken
                }

            })
                .then((res) => res.json())
                .then((data) => {

                    this.setState({ isLoading: false });

                    console.log('topics', data)
                    let chatData = this.state.chatArray
                    temptoparr.push(
                        "Please select topic"
                    );

                    let thistopic = this
                    this.setState({ selectedvalue: '' });

                    Object.keys(data).forEach(function (key) {
                        //console.log("key-->"+key)
                        if (data[key].topic != "") {

                            temptoparr.push(
                                <form>
                                    <FormControlLabel
                                        control={<Radio />}
                                        label={data[key].topic}
                                        value={data[key].topic}
                                        name="groupname"
                                        //checked={this.state.selectedvalue==diiflevels}
                                        onChange={thistopic.rdlevelchange}
                                    />
                                </form>
                            )
                        }
                    });

                    chatData.push({
                        msg: temptoparr,
                        botMsg: true,//Msg is from bot
                        clickable: false, //Make bubble clickable
                        Topic: true, //Identify the pushed text is topic
                        Multioption: false
                    });


                    chatData.push({
                        msg: "Send Topic",
                        botMsg: true,//Msg is from bot
                        clickable: true, //Make bubble clickable
                        Topic: true, //Identify the pushed text is topic
                        Multioption: false
                    });

                    this.pushToChat(chatData);

                });
            //Add selected topic to chatbox to display


            //await this.clear();
            //Resetting state objects
            this.setState({ selTopic: selTopic });
            this.setState({ DBQuestions: DBQuestions });
            this.setState({ CurrentQuestion: CurrentQuestion });
            this.setState({ CurrentRowID: CurrentRowID });
            this.setState({ Checkedval: Checkedval });
            console.log('SelTopic', this.state.SelTopic);
            console.log('DBQuestions', this.state.DBQuestions);
            console.log('CurrentQuestion', this.state.CurrentQuestion);
            console.log('CurrentRowID', this.state.CurrentRowID);
            //  this.setState({ chatArray: chatArray });
            //console.log('chatArray', chatArray)
        }
    }

    handleSend(msg) {
        const accessToken = localStorage.getItem('accessToken');
        console.log(JSON.stringify(accessToken))
        if (!accessToken) {
            let chatArray = this.state.chatArray;
            chatArray.push({
                msg: msg,
                botMsg: false,
                clickable: false,
                Multioption: false
            });
            chatArray.push({
                msg: 'Please login',
                botMsg: true,
                clickable: false,
                Multioption: false
            });
            this.setState({ chatArray: chatArray })
        }
        else {
            this.handleSendMsg(msg);
        }
    }

    handleSendMsg(msg) {
        if (msg) {

            let selectedQoption = this.state.selectedQoption
            console.log("check sel val inside handle send", selectedQoption)
            if (msg.toUpperCase().trim() === "TOPIC") {
                this.fetchTopic(msg);
                const chatArray = this.state.chatArray;
                chatArray.push({
                    msg: msg,
                    botMsg: false,
                    clickable: false,
                    Multioption: false
                });
                this.setState({ chatArray: chatArray });

            }
            //Call question difficulty levels
            // else if (this.state.chatArray.some(item => msg.trim() === item.msg && item.Topic === true)) {
            else if (msg.trim() === "Send Topic") {
                console.log('inside elseif loop')
                this.fetchQuestionLevels(this.state.selectedvalue);
            }
            //call Questions

            //else if (this.state.chatArray.some(item => msg.trim() === item.msg && item.Qlevels === true)) {
            else if (msg.trim() === "Send Level") {
                //console.log('inside handlesend chat array',chatArray)

                this.fetchQuestions(this.state.selectedvalue);
            }
            //Check for answers
            // else if (this.state.CurrentQuestion.some(item => msg.trim() === item.msg && item.Qoptions === true)) {
            else if (msg.trim() === "Send Option") {
                // if (selectedQoption ==='') {


                //     let chatArray = this.state.chatArray;
                //     chatArray.push({
                //         msg: 'Please choose any one option',
                //         botMsg: true,
                //         clickable: false,
                //         Multioption: false
                //     });
                //     this.setState({ chatArray: chatArray })
                // }

                // else {
                    this.CheckForCorrectAns(selectedQoption);
             //   }
            }

            //When users click on next topic
            else if (msg.trim() === "Next Question") {
                let chatArray = this.state.chatArray;
                chatArray.push({
                    msg: msg,
                    botMsg: false,
                    clickable: false,
                    Multioption: false
                });
                this.setState({ chatArray: chatArray })

                this.UploadQuestions(msg);
            }
            //When user clicks on see answers
            else if (msg.trim() === "See Answer") {
                let chatArray = this.state.chatArray;
                chatArray.push({
                    msg: msg,
                    botMsg: false,
                    clickable: false,
                    Multioption: false
                });
                this.setState({ chatArray: chatArray })
                this.UploadAnswer(msg);
            }
            else if (msg.trim() == "Send") {
                let chatArray = this.state.chatArray;
if(this.state.Checkedval !=''){
    chatArray.push({
        msg: "Send",
        botMsg: false,
        clickable: false,
        Multioption: false
    });
    this.setState({ chatArray: chatArray })
}
              
                console.log('inside seleted multi', this.state.Checkedval)
                this.checkMultiAns();
            }
            //For un wanted text
            else {
                let chatArray = this.state.chatArray;
                chatArray.push({
                    msg: msg,
                    botMsg: false,
                    clickable: false,
                    Multioption: false
                });
                chatArray.push({
                    msg: 'Please enter relevent message!',
                    botMsg: true,
                    clickable: false,
                    Multioption: false
                });
                chatArray.push({
                    msg: 'Topic',
                    botMsg: true,
                    clickable: false,
                    Multioption: false
                });
                this.setState({ chatArray: chatArray });
            }
        }
    }

    handleCheck(val) {
        console.log('checked box is', val);
        let Checkedval = this.state.Checkedval;
        Checkedval.push({
            val: val
        });
        this.setState({ Checkedval: Checkedval });
        // console.log('Checkedval',Checkedval);
    }

    toggleListening = () => {
        this.setState({ listening: !this.state.listening });
    }

    operations() {
        this.setState({
            ShowBot: !this.state.ShowBot
        })
    }

    render() {
        return (
            <>
                <ApplicationContext.Provider value={{ toggleListening: this.toggleListening }}>
                    <Listening hidden={this.state.listening} />
                    <NaviBar className="NewChat" ></NaviBar>

                    <MainDiv className="maindivCls">
                        <InfoDiv className="infodivcls">
                            <InfoBox
                                AnsweredQuestions={this.state.TotalCorrectedQuestions[0].AnsweredQuestions}
                                TotalQuestions={this.state.TotalCorrectedQuestions[0].TotalQuestions}
                            />
                        </InfoDiv>
                        <ChatDiv className="chatdivcls">
                            <header className="headers"><img src="/assets/logobot.png" width="40px" height="40px"></img>  ALA</header>
                            <ChatBox className="chatboxcls" chatArray={this.state.chatArray} onClick={(msg) => this.handleSend(msg)} onCheck={(val) => this.handleCheck(val)}></ChatBox>
                            {this.state.isLoading && <LoadingDots></LoadingDots>}
                            <MsgBox className="msgboxcls" onSend={(msg) => this.handleSend(msg)}></MsgBox>
                        </ChatDiv>
                    </MainDiv>
                </ApplicationContext.Provider>
            </>
        )
    }
}