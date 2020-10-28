import re
import ast
import pprint
import string
from nltk import word_tokenize as tokenizer
from nltk.stem.snowball import SnowballStemmer
from nltk.corpus import stopwords
import postgre
import random
from difflib import SequenceMatcher



# One time
# import nltk
# nltk.download('stopwords')
# nltk.download('punkt')

# pprint settings
pp = pprint.PrettyPrinter(indent=2)

# Get default English stopwords and extend with punctuation
stopwords = stopwords.words('english')
stopwords.extend(string.punctuation)
stopwords.append('')

# Create stemmer
stemmer = SnowballStemmer('english')


def tokenize_remove_stopwords(x):
    return [token.lower() for token in tokenizer(x) if token.lower() not in stopwords]


def stem(x):
    return [stemmer.stem(token) for token in x]


def stem_match(inpt, q_id, question_tags):
    out = []
    a = stem(tokenize_remove_stopwords(inpt))

    for i, b in enumerate(question_tags):
        ratio = len(set(a).intersection(b)) / float(len(set(a).union(b)))
        ratio = round(ratio*100)
        out.append((q_id[i], ratio))

    out.sort(key=lambda x: x[1], reverse=True)
    return(out[:5])
    
 #Mycode   
def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()

def closeMatches(TopicList, topic): 
    c=[]
    print(TopicList)
    for word in TopicList:
        num = similar(word, topic)
        c. append(num)
    print(c)
    data = max(c)
    print('data is', data)
    if(data >=0.5):
        position = c.index(data)
        print('position',position)
        return TopicList[position]
    else:
        return -1
def findQuestions(topic, Qtype):
    print('topic and type', topic, Qtype)
    findquestion=postgre.findQuestionForTopic(topic,Qtype)
    return(findquestion)
 
def findTopic():
    res = postgre.fetchTopic()
    return res

def findQuestionDif(topic):
    
    TopicList = postgre.fetchTopic()
    #TopicList = map(lambda x:x.lower(), TopicL)
    #print('findQuestionDif', topic)
    EnteredTopic = closeMatches(TopicList,topic )
    print('entered topic', EnteredTopic)
    if(EnteredTopic!=-1):
        DiffLevel = postgre.fetchLevels(EnteredTopic)
    else:
        DiffLevel = -1
    return(DiffLevel)
    
#To select questions
def SelectQuestions(QuestionList):
    NewList=[]
    NewList.clear()
    n = random.randint(0,len(QuestionList))
    print('random number',n)
    NewList = list(QuestionList[n])
    options = NewList[1:5]
    print('options',options)
    #NewList = QuestionList[n]
    print('NewList',NewList)
    return(NewList,options)


def find(inpt, topic):
    q_id, question_tags = postgre.fetch_tags(topic)
    option_ids = stem_match(inpt, q_id, question_tags)
    choice, answer = postgre.fetch_details(option_ids[0][0])
    options = postgre.fetch_questions(option_ids)

    return(options, choice if choice else "", answer)


def standalone():
    while True:
        inpt = input(">>>")
        options, choices, answer = find(inpt, None)
        pp.pprint(options)
        print(choices)
        print(answer)


if __name__ == "__main__":
    standalone()
