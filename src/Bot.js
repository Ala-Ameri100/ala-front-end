import React, { Component } from 'react'

//import styled from 'styled-components';
import  NaviBar  from './Components/Navibar';
import { ChatBox } from './Components/ChatBox';
import { MsgBox } from './Components/MsgBox';
import { InfoBox } from './Components/InfoBox';
import { ApplicationContext } from './Context';
import styled, { keyframes } from 'styled-components';
import { fadeInUp } from 'react-animations';
const bounceInAnimation = keyframes`${fadeInUp}`;
const header = styled.div`
    padding: 30px;
    text-align: center;
    background: #bc1a6b;
    color: white;
    font-size: 30px;
`;
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
    // background-color:#A9A9A9;
    display: flex;
    flex-direction: column;
    width: 35%;
    border: 2px solid grey;
    margin-left:10px
    border-radius: 0.25rem;
    animation: 1.0s ${bounceInAnimation};
    transition-timing-function: linear;
    box-shadow: 0px 5px 5px  grey;
    header{
        padding: 5px;
        text-align: center;
        background: #0000e6;
        color: white;
        font-size: 30px;
        text-align:left;
        font-style:
    }
`;

const InfoDiv = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;


export class Bot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chatArray: [],
            listening: true,
            ShowBot:true,
            SelTopic:[],
            DBQuestions:[],
            CurrentQuestion:[],
            CurrentRowID:[],
            TotalCorrectedQuestions:[
                {AnsweredQuestions: 0, TotalQuestions:0}
            ],
            Checkedval:[]
        };
    }

    componentDidMount() {
        fetch('/v1/welcome').then((res) => res.json()).then((data) => {
            console.log('data',data)
            let chatData = this.state.chatArray
            Object.keys(data).forEach(function(key) {
                //console.log("key-->"+key)
                chatData.push({
                    msg :  data[key].message,
                    clickable: data[key].clickable, 
                    botMsg:true,
                    Multioption:false
              });
              });

            
            
            this.pushToChat(chatData);
            
        });
    }

    pushToChat(data) {
        let chatArray = this.state.chatArray;
        this.setState({ chatArray: data });
        // for (let [i, msg] of data) {
        //     setTimeout(() => {
        //         chatArray.push({
        //             message: msg,
        //             botMsg: true,
        //             clickable: data.resReq ? data.resReq[i] : false,
        //             Topic: data.Topic ? data.Topic[i] : false,
        //         });
        //         this.setState({ chatArray: chatArray });
        //     }, i * 500);
        // };
        //console.log("chatArray-->"+JSON.stringify(chatArray))
    }

    //Upload answer to chatArray when user clicks on see answer
    UploadAnswer(){
        let RowID;
        let count=1;
        let AnsArray=[];
        let chatData = this.state.chatArray;
        let CurrentQuestion = this.state.CurrentQuestion;
        if(this.state.CurrentRowID.length){
            //console.log('CurrentRowID.length-1',this.state.CurrentRowID.length-1)
            RowID=this.state.CurrentRowID[this.state.CurrentRowID.length-1].rowID;
        }
        else{
            RowID=-1;
        }
        Object.keys(CurrentQuestion).forEach(function(key){
            key=parseInt(RowID)+1;
            console.log('key',key)
            if(count>0){
                for (let i = 0, len = CurrentQuestion[key].AnsKey.length; i < len; i += 1) { 
                    AnsArray.push({
                        value:CurrentQuestion[key].AnsKey.charAt(i)-1   
                    });
                    //AnsArray.push(+CurrentQuestion[key].AnsKey.charAt(i)); 
                    console.log('AnsArray',AnsArray)
                } 
                for(let i=0;i<AnsArray.length;i++){
                    console.log('AnsArray[i].value',AnsArray[i].value);
                    chatData.push({
                        msg:CurrentQuestion[AnsArray[i].value].msg,
                        botMsg:true,
                        clickable: false,
                        Multioption:false
                    });
                }
                chatData.push({
                    msg:"Next Question",
                    botMsg:true,
                    clickable: true,
                    Multioption:false
                });
            }
            count--;
        });  
        this.setState({chatArray:chatData});
    }

    //Function to upload questions to chatarray
    UploadQuestions(msg){
        let total;
        let TotalCorrectedQuestions=this.state.TotalCorrectedQuestions;
        let CurrentQuestion=[];
        let RowID;
        console.log('DBQuestions',this.state.DBQuestions);
        let DBQuestions = this.state.DBQuestions;
        let chatData = this.state.chatArray;
        console.log('Inside uploadQuestions',CurrentQuestion)
        let count=1;
        //Checking fo rowID to upload next questions
        //If the rowID is undefined then it will starts from begining
        //IF rowID is not zero then upload next question
        if(this.state.CurrentRowID.length){
            console.log('CurrentRowID.length-1',this.state.CurrentRowID.length-1)
            let CurrentRowID = this.state.CurrentRowID[this.state.CurrentRowID.length-1].rowID
            console.log('CurrentRowID',typeof CurrentRowID);
            console.log('DBQuestions',DBQuestions)
            console.log('DBQuestions',typeof DBQuestions.length);
            if(parseInt(CurrentRowID)+1>=this.state.DBQuestions.length){
                chatData.push({
                    msg:'Done with the questions, please select another topic',
                    botMsg:true,
                    clickable:false,
                    Multioption:false
                });
                chatData.push({
                    msg:'Topic',
                    botMsg:true,
                    clickable:true,
                    Multioption:false
                });
                this.setState({chatArray:chatData});
                return;
            }
            else{
            RowID=CurrentRowID;
            }
        }
        else{
            RowID=-1;
        }
        //Looping DBquestion to insert that to current question
        Object.keys(DBQuestions).forEach(function(key){
            key=parseInt(RowID)+1;
            console.log('key',key)
            if(count>0){
                console.log('count', count)
                
                if(DBQuestions[key].questionText!==""){
                    console.log('DBQuestions[key].questionText',DBQuestions[key].questionText)
                    chatData.push({
                        msg:DBQuestions[key].questionText,
                        botMsg:true,
                        clickable: false,
                        
                    });
                  
                }
                if(DBQuestions[key].answerChoice1!==""){
                    console.log('DBQuestions[key].questionText',DBQuestions[key].answerChoice1)
                    chatData.push({
                        msg:DBQuestions[key].answerChoice1,
                        botMsg:true, //To know it is bot message
                        clickable: DBQuestions[key].MultipleAns? false: true, //Making bubble as clickable
                        key:key, //Inserting row number
                        choice:1, //Making this option as 1
                        AnsKey:DBQuestions[key].correctAnswer, //Inserting answer key for future use
                        Qoptions:true, //To determine it is a option
                        Multioption:DBQuestions[key].MultipleAns? true: false
                    });
                    CurrentQuestion.push({
                        msg:DBQuestions[key].answerChoice1,
                        botMsg:true,
                        clickable: DBQuestions[key].MultipleAns? false: true,
                        key:key,
                        choice:1,
                        AnsKey:DBQuestions[key].correctAnswer,
                        Qoptions:true,
                        Multioption:DBQuestions[key].MultipleAns? true: false
                    });
                }
                if(DBQuestions[key].answerChoice2!==""){
                    console.log('DBQuestions[key].questionText',DBQuestions[key].answerChoice2)
                    chatData.push({
                        msg:DBQuestions[key].answerChoice2,
                        botMsg:true,
                        clickable: DBQuestions[key].MultipleAns? false: true,
                        key:key,
                        choice:2,
                        AnsKey:DBQuestions[key].correctAnswer,
                        Qoptions:true,
                        Multioption:DBQuestions[key].MultipleAns? true: false
                    });
                    CurrentQuestion.push({
                        msg:DBQuestions[key].answerChoice2,
                        botMsg:true,
                        clickable: DBQuestions[key].MultipleAns? false: true,
                        key:key,
                        choice:2,
                        AnsKey:DBQuestions[key].correctAnswer,
                        Qoptions:true,
                        Multioption:DBQuestions[key].MultipleAns? true: false
                    });
                }if(DBQuestions[key].answerChoice3!==""){
                    console.log('DBQuestions[key].questionText',DBQuestions[key].answerChoice3)
                    chatData.push({
                        msg:DBQuestions[key].answerChoice3,
                        botMsg:true,
                        clickable: DBQuestions[key].MultipleAns? false: true,
                        key:key,
                        choice:3,
                        AnsKey:DBQuestions[key].correctAnswer,
                        Qoptions:true,
                        Multioption:DBQuestions[key].MultipleAns? true: false
                    });
                    CurrentQuestion.push({
                        msg:DBQuestions[key].answerChoice3,
                        botMsg:true,
                        clickable: DBQuestions[key].MultipleAns? false: true,
                        key:key,
                        choice:3,
                        AnsKey:DBQuestions[key].correctAnswer,
                        Qoptions:true,
                        Multioption:DBQuestions[key].MultipleAns? true: false
                    });
                }if(DBQuestions[key].answerChoice4!==""){
                    console.log('DBQuestions[key].questionText',DBQuestions[key].answerChoice4)
                    chatData.push({
                        msg:DBQuestions[key].answerChoice4,
                        botMsg:true,
                        clickable: DBQuestions[key].MultipleAns? false: true,
                        key:key,
                        choice:4,
                        AnsKey:DBQuestions[key].correctAnswer,
                        Qoptions:true,
                        Multioption:DBQuestions[key].MultipleAns? true: false
                    });
                    CurrentQuestion.push({
                        msg:DBQuestions[key].answerChoice4,
                        botMsg:true,
                        clickable: DBQuestions[key].MultipleAns? false: true,
                        key:key,
                        choice:4,
                        AnsKey:DBQuestions[key].correctAnswer,
                        Qoptions:true,
                        Multioption:DBQuestions[key].MultipleAns? true: false
                    });
                }if(DBQuestions[key].answerChoice5!==""){
                    console.log('DBQuestions[key].questionText',DBQuestions[key].answerChoice5)
                    chatData.push({
                        msg:DBQuestions[key].answerChoice5,
                        botMsg:true,
                        clickable: DBQuestions[key].MultipleAns? false: true,
                        key:key,
                        choice:5,
                        AnsKey:DBQuestions[key].correctAnswer,
                        Qoptions:true,
                        Multioption:DBQuestions[key].MultipleAns? true: false
                    });
                    CurrentQuestion.push({
                        msg:DBQuestions[key].answerChoice5,
                        botMsg:true,
                        clickable: DBQuestions[key].MultipleAns? false: true,
                        key:key,
                        choice:5,
                        AnsKey:DBQuestions[key].correctAnswer,
                        Qoptions:true,
                        Multioption:DBQuestions[key].MultipleAns? true: false
                    });
                }
                if(DBQuestions[key].answerChoice6!==""){
                    console.log('DBQuestions[key].questionText',DBQuestions[key].answerChoice6)
                    chatData.push({
                        msg:DBQuestions[key].answerChoice6,
                        botMsg:true,
                        clickable: DBQuestions[key].MultipleAns? false: true,
                        key:key,
                        choice:6,
                        AnsKey:DBQuestions[key].correctAnswer,
                        Qoptions:true,
                        Multioption:DBQuestions[key].MultipleAns? true: false
                    });
                    CurrentQuestion.push({
                        msg:DBQuestions[key].answerChoice6,
                        botMsg:true,
                        clickable: DBQuestions[key].MultipleAns? false: true,
                        key:key,
                        choice:6,
                        AnsKey:DBQuestions[key].correctAnswer,
                        Qoptions:true,
                        Multioption:DBQuestions[key].MultipleAns? true: false
                    });
                }
                if(DBQuestions[key].answerChoice7!==""){
                    console.log('DBQuestions[key].questionText',DBQuestions[key].answerChoice7)
                    chatData.push({
                        msg:DBQuestions[key].answerChoice7,
                        botMsg:true,
                        clickable: DBQuestions[key].MultipleAns? false: true,
                         key:key,
                         choice:7,
                         AnsKey:DBQuestions[key].correctAnswer,
                         Qoptions:true,
                         Multioption:DBQuestions[key].MultipleAns? true: false
                    });
                    CurrentQuestion.push({
                        msg:DBQuestions[key].answerChoice7,
                        botMsg:true,
                        clickable: DBQuestions[key].MultipleAns? false: true,
                        key:key,
                        choice:7,
                        AnsKey:DBQuestions[key].correctAnswer,
                        Qoptions:true,
                        Multioption:DBQuestions[key].MultipleAns? true: false
                    });
                }
                if(DBQuestions[key].MultipleAns==true){
                    chatData.push({
                        msg:"Submit",
                        botMsg:true,
                        clickable: true
                    });
                }

                total = TotalCorrectedQuestions[0].TotalQuestions+1;
                TotalCorrectedQuestions[0].TotalQuestions=total;
                console.log('Total',total);
                
                //TotalCorrectedQuestions = TotalCorrectedQuestions[0].TotalQuestions = total
                
            }
            count--;
        });
        //TotalCorrectedQuestions = this.state.TotalCorrectedQuestions[0].TotalQuestions = total
        this.setState({TotalCorrectedQuestions:TotalCorrectedQuestions});
        console.log('TotalCorrectedQuestions',this.state.TotalCorrectedQuestions);
        this.setState({CurrentQuestion:CurrentQuestion});
        console.log('CurrentQuestion is',this.state.CurrentQuestion);
        this.setState({chatArray:chatData});
        console.log('chatArray is', this.state.chatArray)
        
    }


    //Verify answer when user choose any option
    CheckAnswer(msg){
        let TotalCorrectedQuestions =this.state.TotalCorrectedQuestions;
        let total2; 
        let res;
        let rowID;
        console.log('Inside check ans', msg)
        let CurrentQuestion = this.state.CurrentQuestion;
        console.log('Inside check ans', typeof(CurrentQuestion),CurrentQuestion)
        
        //Loop currentQuestions for options
        Object.keys(CurrentQuestion).map(key=>{
            console.log('Message is',CurrentQuestion[key].msg)
            if(msg.trim()===CurrentQuestion[key].msg){
                console.log('correct option',CurrentQuestion[key].choice)
                const choice=CurrentQuestion[key].choice;
                if(choice==CurrentQuestion[key].AnsKey){
                    rowID = CurrentQuestion[key].key
                    res=1; //If the selected option is correct
                    total2 = TotalCorrectedQuestions[0].AnsweredQuestions+1;
                    TotalCorrectedQuestions[0].AnsweredQuestions=total2;
                    console.log('Total2',total2);
                }
                else{
                    rowID = CurrentQuestion[key].key
                    res=2; //If the selected option is wrong
                }
            }
        });
        if(res ===1){
            return 1+","+rowID; //sending answer with checked question row ID if the user choosed option is correct
        }
        else{
            return 0+","+rowID; //sending answer with checked question row ID if the user choosed option is wrong
        }
        // const tifOptions = Object.keys(CurrentQuestion).map(key => 
        //     <option value={key}>{CurrentQuestion[key].msg}</option>
        // )
        // console.log('Inside check answerssssssss',tifOptions)
    }

    CheckForCorrectAns(msg){
        if(this.state.CurrentQuestion.length)
            {
                let RowID;
                const res = this.CheckAnswer(msg);
                console.log('result is', res);
                const answer_array = res.split(",");
                console.log('answer_array',answer_array)
                const choice=answer_array[0];
               
                if(answer_array[1] !== "undefined")
                {
                    RowID=answer_array[1];
                }
                else{
                    console.log('It isundefined!');
                    RowID=0;
                }
                console.log('choice,RowID',choice,RowID);
                this.setState({CurrentRowID:[]});   
                let CurrentRowID = this.state.CurrentRowID;
                    CurrentRowID.push({
                        rowID:RowID
                });
                this.setState({CurrentRowID:CurrentRowID});
                console.log('CurrentRowID',CurrentRowID)
                if(choice==1){
                    const chatArray = this.state.chatArray.slice();
                        chatArray.push({
                            msg: msg,
                            botMsg: false,
                            clickable: false,
                            Multioption:false
                        });
                        chatArray.push({
                            msg: 'Right Answer',
                            botMsg: true,
                            clickable: false,
                            Multioption:false
                        });
                        chatArray.push({
                            msg: 'Next Question',
                            botMsg: true,
                            clickable: true,
                            Multioption:false
                        });
                    this.setState({ chatArray: chatArray });
                }
                else{
                    const chatArray = this.state.chatArray.slice();
                         chatArray.push({
                            msg: msg,
                            botMsg: false,
                            clickable: false,
                            Multioption:false
                        });
                        chatArray.push({
                            msg: 'Wrong Answer',
                            botMsg: true,
                            clickable: false,
                            Multioption:false
                        });
                        chatArray.push({
                            msg: 'See Answer',
                            botMsg: true,
                            clickable: true,
                            Multioption:false
                        });
                    this.setState({ chatArray: chatArray });
                }
            }
    }

    checkMultiAns(){
        let TotalCorrectedQuestions =this.state.TotalCorrectedQuestions;
        let total2;
        let RowID;
        let currentRow;
        let AnsKey;
        let checkAns="";
        const chatArray = this.state.chatArray.slice();
        if(this.state.Checkedval.length){
            if(this.state.CurrentQuestion.length){
                AnsKey=this.state.CurrentQuestion[0].AnsKey;
                currentRow=this.state.CurrentQuestion[0].key;
            }
            let Checkedval=this.state.Checkedval;
            console.log('checkMultiAns',Checkedval)
            Object.keys(Checkedval).map(key=>{
                console.log('Checkedval[key].val',Checkedval[key].val);
                if(AnsKey.includes(Checkedval[key].val)){
                    checkAns=checkAns+Checkedval[key].val
                }
                else{
                    checkAns=checkAns+"0"
                }
            });
            console.log('checkAns',checkAns);
        }
        if(checkAns==AnsKey){
            total2 = TotalCorrectedQuestions[0].AnsweredQuestions+1;
            TotalCorrectedQuestions[0].AnsweredQuestions=total2;
            RowID=currentRow;
                chatArray.push({
                    msg: 'Right Answer',
                    botMsg: true,
                    clickable: false,
                    Multioption:false
                });
                chatArray.push({
                    msg: 'Next Question',
                    botMsg: true,
                    clickable: true,
                    Multioption:false
                });
            this.setState({ chatArray: chatArray });
        }
        else{
            RowID=currentRow;
            chatArray.push({
                msg: 'Wrong Answer',
                botMsg: true,
                clickable: false,
                Multioption:false
            });
            chatArray.push({
                msg: 'See Answer',
                botMsg: true,
                clickable: true,
                Multioption:false
            });
        this.setState({ chatArray: chatArray });
        }
        let CurrentRowID = this.state.CurrentRowID;
        CurrentRowID.push({
            rowID:RowID
        });
        this.setState({CurrentRowID:CurrentRowID});
        console.log('CurrentRowID',CurrentRowID)
    }

    fetchQuestions(msg){
        if(msg)
        {   
            let strchck = "More than one answer is possible";
            let CurrentRowID=[]; // Clearing current row iD   
            let DBQuestions=[]; // Clearing selected DB questions
                let SelTopic = this.state.SelTopic;
                const selTopic = SelTopic[0]; // fetching  selected topic to fetch questions
                fetch('/v1/getQuestionByTopicAndLevel?topic='+selTopic+'&difficulty_level='+msg, {
                method: 'POST',
                headers: { "Content-Type": "application/json", "Access-Control-Origin": "*" },
                //body: JSON.stringify({ 'messageText': msg, 'topic': null })
                 })
                .then((res) => res.json())
                .then((data) => {
                    console.log('Questions',data)
                    Object.keys(data).forEach(function(key){
                        if (data[key].correctAnswer.length>1) {
                            DBQuestions.push({
                                questionText:data[key].questionText,
                                answerChoice1:data[key].answerChoice1,
                                answerChoice2:data[key].answerChoice2,
                                answerChoice3:data[key].answerChoice3,
                                answerChoice4:data[key].answerChoice4,
                                answerChoice5:data[key].answerChoice5,
                                answerChoice6:data[key].answerChoice6,
                                answerChoice7:data[key].answerChoice7,
                                answerDescription:data[key].answerDescription,
                                correctAnswer:data[key].correctAnswer, 
                                Questions:true,
                                MultipleAns: true
                            });
                        }
                        else{
                            DBQuestions.push({
                                questionText:data[key].questionText,
                                answerChoice1:data[key].answerChoice1,
                                answerChoice2:data[key].answerChoice2,
                                answerChoice3:data[key].answerChoice3,
                                answerChoice4:data[key].answerChoice4,
                                answerChoice5:data[key].answerChoice5,
                                answerChoice6:data[key].answerChoice6,
                                answerChoice7:data[key].answerChoice7,
                                answerDescription:data[key].answerDescription,
                                correctAnswer:data[key].correctAnswer, 
                                Questions:true,
                                MultipleAns: false
                            });
                        }
                    });
                    this.setState({CurrentRowID:CurrentRowID}); 
                    this.setState({DBQuestions:DBQuestions}); //Inserting Question with options to DBQuestions
                    const chatArray = this.state.chatArray.slice();
                        chatArray.push({
                            msg: msg,
                            botMsg: false,
                            clickable: false,
                            Multioption:false
                        });
                    this.setState({ chatArray: chatArray }); //Adding selected questions levels to chatarray
                    this.UploadQuestions(msg); //Calling upload question to add first question to ChatArray
                }); 
                
        }     
}   

    //Fetch question levels using selected topic
    fetchQuestionLevels(msg){
        if(msg){
            let SelTopic=[];
            SelTopic.push(msg);
            this.setState({ SelTopic: SelTopic }); //Storing the selected topic into state object to use in fetech questions APi
            console.log('SelTopic is', SelTopic)
            console.log('inside fetch', msg)
            fetch('/v1/getDifficultyLevelByTopic?topic='+msg, {
                method: 'POST',
                headers: { "Content-Type": "application/json", "Access-Control-Origin": "*" },
                //body: JSON.stringify({ 'messageText': msg, 'topic': null })
            }).then((res) => res.json())
                .then((data) => {
                    console.log('Difflevels',data)
                    let chatData = this.state.chatArray
                    chatData.push({
                        msg:"Please select difficulty levels",
                        botMsg:true,
                        clickable:false
                    });
                    {data.map(diiflevels=>(
                        chatData.push({
                                msg : diiflevels ,
                                botMsg:true,
                                clickable: true,
                                Qlevels:true ,// to identify the pushed text is Question levels
                                Multioption:false
                            })
                    ))};
                this.pushToChat(chatData);
            });
            const chatArray = this.state.chatArray.slice();
            chatArray.push({
                msg: msg,
                botMsg: false,
                clickable: false,
                Multioption:false
            });
            this.setState({ chatArray: chatArray });
        }
    }
    

    //Fetch topic from db when user clicks on topic
    fetchTopic(msg) {
        if (msg) {
            let selTopic=[];
            let DBQuestions=[];
            let CurrentQuestion=[];
            let CurrentRowID=[];
            let Checkedval=[];
            console.log('fetch topic is called')
            //Topic API
            fetch('/v1/getTopics', {
                method: 'GET',
                headers: { "Content-Type": "application/json", "Access-Control-Origin": "*" },
                //body: JSON.stringify({ 'messageText': msg, 'topic': null })
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log('topics',data)
                    let chatData = this.state.chatArray
                    chatData.push({
                        msg:"Please select topic",
                        botMsg:true,
                        clickable:false
                    });
                    Object.keys(data).forEach(function(key) {
                    //console.log("key-->"+key)
                    chatData.push({
                        msg :  data[key].topic,
                        botMsg:true,//Msg is from bot
                        clickable: true, //Make bubble clickable
                        Topic:true, //Identify the pushed text is topic
                        Multioption:false
                    });
                });
                    this.pushToChat(chatData);

                });
            //Add selected topic to chatbox to display
            const chatArray = this.state.chatArray;
            chatArray.push({
                msg: msg,
                botMsg: false,
                clickable: false,
                Multioption:false
            });
            
            //await this.clear();
            //Resetting state objects
            this.setState({selTopic:selTopic});
            this.setState({DBQuestions:DBQuestions});
            this.setState({CurrentQuestion:CurrentQuestion});
            this.setState({CurrentRowID:CurrentRowID});
            this.setState({Checkedval:Checkedval});
            console.log('SelTopic',this.state.SelTopic);
            console.log('DBQuestions',this.state.DBQuestions);
            console.log('CurrentQuestion',this.state.CurrentQuestion);
            console.log('CurrentRowID',this.state.CurrentRowID);
            this.setState({ chatArray: chatArray });
            console.log('chatArray',chatArray )
        }
    }
    //  clear(){
    //     this.state = {
    //         chatArray: [],
    //         listening: true,
    //         ShowBot:false,
    //         SelTopic:[],
    //         DBQuestions:[],
    //         CurrentQuestion:[],
    //         CurrentRowID:[]
    //     };
    // }

    handleSend(msg){
        if(msg){
            //Call topic API
            if(msg.toUpperCase().trim()==="TOPIC"){
                this.fetchTopic(msg)
            }
            //Call question difficulty levels
            else if(this.state.chatArray.some(item => msg.trim() === item.msg && item.Topic === true)){
                console.log('inside elseif loop')
                this.fetchQuestionLevels(msg)
            }
            //call Questions
            else if(this.state.chatArray.some(item => msg.trim() === item.msg && item.Qlevels === true)){
                this.fetchQuestions(msg);
            }
            //Check for answers
            else if(this.state.CurrentQuestion.some(item => msg.trim() === item.msg && item.Qoptions === true)){
                this.CheckForCorrectAns(msg);
            }
            //When users click on next topic
            else if(msg.trim()==="Next Question"){
                let chatArray = this.state.chatArray;
                chatArray.push({
                    msg: msg,
                    botMsg: false,
                    clickable: false,
                    Multioption:false
                }); 
                this.setState({chatArray:chatArray})

                this.UploadQuestions(msg);
            }
            //When user clicks on see answers
            else if(msg.trim()==="See Answer"){
                let chatArray = this.state.chatArray;
                chatArray.push({
                    msg: msg,
                    botMsg: false,
                    clickable: false,
                    Multioption:false
                });
                this.setState({chatArray:chatArray})
                this.UploadAnswer(msg);
            }
            else if(msg.trim()=="Submit"){
                this.checkMultiAns();
            }
            //For un wanted text
            else{
                let chatArray = this.state.chatArray;
                chatArray.push({
                    msg: msg,
                    botMsg: false,
                    clickable: false,
                    Multioption:false
                });
                chatArray.push({
                    msg: 'Plase enter relevent message!',
                    botMsg: true,
                    clickable: false,
                    Multioption:false
                });
                this.setState({chatArray:chatArray});
                this.componentDidMount();
            }
        }

    }

    handleCheck(val){
        console.log('checked box is', val);
        let Checkedval = this.state.Checkedval;
        Checkedval.push({
            val:val
        })
        this.setState({Checkedval:Checkedval});
        // console.log('Checkedval',Checkedval);
    }
    
    toggleListening = () => {
        this.setState({ listening: !this.state.listening });
    }
    operations(){
        this.setState({
            ShowBot:!this.state.ShowBot
        })
    }

    render() {
        return (
            <>
                <ApplicationContext.Provider value={{ toggleListening: this.toggleListening }}>
                    <Listening hidden={this.state.listening} />
                    <NaviBar className="NewChat"></NaviBar>
                    <MainDiv>           
                        <InfoDiv>
                            <InfoBox 
                            AnsweredQuestions={this.state.TotalCorrectedQuestions[0].AnsweredQuestions}
                            TotalQuestions={this.state.TotalCorrectedQuestions[0].TotalQuestions}
                             />
                        </InfoDiv>
                        {
                            this.state.ShowBot?
                            <ChatDiv>
                                <header>ALA</header>
                                <ChatBox chatArray={this.state.chatArray} onClick={(msg) => this.handleSend(msg)} onCheck={(val)=>this.handleCheck(val)}></ChatBox>
                                <MsgBox onSend={(msg) => this.handleSend(msg)}></MsgBox>
                            </ChatDiv>:null
                        }
                        <div>
                        {/* <FaRobot size="1.5em" className="button" onClick={()=>this.operations()}></FaRobot> */}
                        </div>
                        
                    </MainDiv>
                </ApplicationContext.Provider>

            </>
        )
    }
}