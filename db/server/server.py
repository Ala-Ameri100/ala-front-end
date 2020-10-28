import re
from flask import Flask, request, jsonify, render_template
from match import find
from match import findTopic
from match import findQuestionDif
from postgre import disconnect_db
from match import findQuestions
from match import SelectQuestions
from nltk.stem import PorterStemmer


CurrentSelectedTopic=[]
QuestionList=[]
CurrentQuestion=[]
porter = PorterStemmer()
app = Flask(__name__, static_url_path='')
#port = int(os.getenv("PORT"))

confidence_measure = 50
welcome_response = {"answer": ["Hi! I am the Ameri100 Learning Assistant. You can call me ALA",
                               "Ask a question to get started.",
                               "You can ask questions from BPC, Cloud, UX, Hana CDS, SCP, MEAN stack.",
                               "Topic"]}

@app.route("/")
def home():
    return render_template("index.html")
    


@app.route("/api/welcome", methods=["GET", "POST"])
def welcome():
    welcome_response["resReq"] = [False, False, False, True]
    return jsonify(welcome_response)

    


@app.route("/api/query", methods=["POST"])
def query():
    print(request.json)
    message = request.json.get("messageText")
    if(porter.stem(message.strip().lower())=="topic"):
        print("Inside if functions")
        res=findTopic()
        response={"answer":res}
        response["answer"] = res
        response["Topic"]=[True]*len(res)
        response["resReq"] = [True]*len(res)
        #print(response)
        
    else:
        DifLevels = findQuestionDif(message.strip())
        print('Entered topic inside server', DifLevels)
        if DifLevels!=-1:
           CurrentSelectedTopic.append(message.strip())
           DifLevels.insert(
                        0, "Please choose question difficulty levels from below")
           response={"answer":DifLevels}
           response["answer"] = DifLevels 
           response["resReq"] = [True]*len(DifLevels)
        
        elif len(CurrentSelectedTopic)!=0:
            print('CurrentSelectedTopic',CurrentSelectedTopic)
            Questions = findQuestions(CurrentSelectedTopic[-1],message.strip())
            if(Questions.count!=0):
                CurrentSelectedTopic.clear()
                QuestionList = Questions.copy()
                #print('QuestionList',QuestionList)
                SelectedQuestions,options=SelectQuestions(QuestionList)
                print('Selected questions and options are BEFORE',SelectedQuestions)
                while("" in SelectedQuestions) : 
                    SelectedQuestions.remove("") 
                #SelectedQuestions.remove("") 
                print('Selected questions and options are',SelectedQuestions)
                CurrentQuestion.append(SelectedQuestions)
                response={"answer":SelectedQuestions}
                response["answer"] = SelectedQuestions 
                #response["Questions"]=True*len(Questions)
                response["resReq"] = [True]*len(SelectedQuestions)
        
        else:
            print('CurrentQuestion is',CurrentQuestion)
            #CurrentSelectedTopic.clear()
            topic = request.json.get("topic") if request.json.get("topic") else None
            options, choices, answer = find(message, topic)
            print(options, choices, answer)
            if choices:
                choice_index = list(set(re.findall(r"(\b[ABCDE]\b)", answer)))
                choice_index = " ".join(choice_index).replace("A", "0").replace(
                        "B", "1").replace("C", "2").replace("D", "3").replace("E", "4")
                print("choice_index>>>",choice_index)
                choice_index = [int(x) for x in choice_index.split(" ")]
                #choices = [x[0].strip() for x in re.findall(r"(?<=[ABCDE]\.)(.*?)(?=(([ABCDE]\.)|$))", choices)]
                #choices = [x[0].strip() for x in choices]
                choices = [x.strip() for x in choices.split("$")]
                print(choices, choice_index)
                choices = [choices[i].replace(".", "") for i in choice_index]
                response = {"options": options,
                            "question": options[0][0], "confidence": options[0][1], "answer": choices}
            else:
                response = {"options": options,
                            "question": options[0][0], "confidence": options[0][1], "answer": [answer]}

            # lack of confidence
            if options[0][1] < confidence_measure:
                choices = [x[0] for x in options[:3]]
                choices.insert(
                        0, "Sorry, I did not understand that. Please choose from questions below")
                response["answer"] = choices
                response["resReq"] = [False, True, True, True]
    return jsonify(response)


if __name__ == "__main__":
    try:
        app.run(debug=True)
        print('Main class')
        # app.run(host="0.0.0.0",port=port,debug=False)
    finally:
        disconnect_db()
