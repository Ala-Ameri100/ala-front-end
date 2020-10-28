from psycopg2 import connect, Error
import ast

try:
    connection = connect(
        user="postgres", password="ALA", host="127.0.0.1", port="5432", database="NewAla")
except (Exception, Error) as error:
    print("Error while connecting to PostgreSQL", error)
    
try:
    connectionold = connect(
        user="postgres", password="ALA", host="127.0.0.1", port="5432", database="ala")
except (Exception, Error) as error:
    print("Error while connecting to PostgreSQL", error)

#Mycode
def fetchTopic():
    query = 'select distinct "Topic" from public.questions where "Topic" <> '+"'""'"+''
    cursor = connection.cursor()
    cursor.execute(query)
    path_exec = cursor.fetchall()
    topic_list = []
    topic_list = [row[0] for row in path_exec]
    cursor.close()
    return topic_list
    print("resulted row is",topic_list)
    
def fetchLevels(topic):
    print('inside fetchlevel',topic)
    selectedTopic = "'"+topic+"'"
    print(selectedTopic)
    query = 'select distinct "Difficulty Level" from public.questions  WHERE "Topic"='+ selectedTopic +'' # work from here
    print(query)
    cursor = connection.cursor()
    cursor.execute(query)
    path_exec = cursor.fetchall()
    #print('pathexc', path_exec)
    QuestionLevels = []
    QuestionLevels = [row[0] for row in path_exec]
    cursor.close()
    #print("resulted row is",QuestionLevels)
    return QuestionLevels
def findQuestionForTopic(topic,Qtype):
    #print('topic Qtype inside postgre', topic, Qtype)
    selectedTopic = "'"+topic+"'"
    SelectedQtype = "'"+Qtype+"'"
    #print(selectedTopic)
    query = 'select "Question Text","Answer Choice 1","Answer Choice 2","Answer Choice 3 (optional)","Answer Choice 4 (optional)","Answer Choice 5 (optional)","Correct answer","Answer Description (optional)" from public.questions where "Topic" = '+selectedTopic+' and "Difficulty Level" = '+SelectedQtype+'' # work from here
    print(query)
    cursor = connection.cursor()
    cursor.execute(query)
    QuestionSList = cursor.fetchall()
    #print('pathexc', QuestionSList)
    cursor.close()
   # AllQuestions={"answer":QuestionSList}
    #for row in QuestionSList:
    #    AllQuestions["Questions"]=row[0]
    #print("resulted row is",QuestionSList)
    return QuestionSList


def fetch_tags(genere):
    cursor = connectionold.cursor()
    query = 'SELECT "id","Question Tags" FROM "questions"'
    if genere:
        query += f' WHERE "Genere"=\'{genere}\''
    print(query)
    cursor.execute(query)
    rows = cursor.fetchall()
    cursor.close()

    q_id = []
    tags = []

    for row in rows:
        q_id.append(row[0])
        tags.append(ast.literal_eval(row[1]))

    return(q_id, tags)


def fetch_details(option_id):
    cursor = connectionold.cursor()
    query = 'SELECT "Choices","Answer" FROM questions WHERE "id"='
    query += f'{option_id}'
    cursor.execute(query)
    print(query)
    row = cursor.fetchone()
    cursor.close()
    choices, answer = row[0], row[1]
    return(choices, answer)


def fetch_questions(option_ids):
    cursor = connectionold.cursor()
    query = 'SELECT "Question Text" FROM questions WHERE "id"='
    question_score = []
    for option_id, score in option_ids:
        _query = query+f'{option_id}'
        print(_query)
        cursor.execute(_query)
        row = cursor.fetchone()
        question_score.append([row[0], score])
    cursor.close()
    return question_score


def disconnect_db():
    print("Disconnecting DB....")
    connection.close()
