import re
import ast
import pprint
import string
import pandas as pd
#from fuzzywuzzy import process
from nltk import word_tokenize as tokenizer
from nltk.stem.snowball import SnowballStemmer
from nltk.corpus import stopwords

# pprint settings
pp = pprint.PrettyPrinter(indent=2)


# read csv
BPC = pd.read_csv("data/BPC.csv", header=0)
Cloud_UX = pd.read_csv("data/Cloud_UX.csv", header=0)
Hana_CDS = pd.read_csv("data/Hana_CDS.csv", header=0)
SCP_MEAN_Stack = pd.read_csv("data/SCP_MEAN_Stack.csv", header=0)

# adding tags
BPC['Genere'] = 'BPC'
Cloud_UX['Genere'] = 'Cloud_UX'
Hana_CDS['Genere'] = 'Hana_CDS'
SCP_MEAN_Stack['Genere'] = 'SCP_MEAN_Stack'

# header = ,Topic,Difficulty Level,Question Full,Answer,Question Text,Choices
q_all = pd.concat([BPC, Cloud_UX, Hana_CDS, SCP_MEAN_Stack], sort=False)

questions = list(q_all["Question Text"])
question_tags = list(q_all["Question Tags"])
choices = list(q_all["Choices"])
answers = list(q_all["Answer"])


# Get default English stopwords and extend with punctuation
stopwords = stopwords.words('english')
stopwords.extend(string.punctuation)
stopwords.append('')

# Create stemmer
stemmer = SnowballStemmer('english')

def fuzzy_match(inpt, questions):
    options = process.extract(inpt, questions)
    top_option = options[0][0]
    return(options, top_option)

def tokenize_remove_stopwords(x):
    return [token.lower() for token in tokenizer(x) if token.lower() not in stopwords]

def stem(x):
    return [stemmer.stem(token) for token in x]

def stem_match(inpt, questions, question_tags):
    out = []
    a = stem(tokenize_remove_stopwords(inpt))

    for i, question_tag in enumerate(question_tags):
        #b = stem(tokenize_remove_stopwords(question))
        b = ast.literal_eval(question_tag)
        ratio = len(set(a).intersection(b)) / float(len(set(a).union(b)))
        ratio = round(ratio*100)
        out.append((questions[i], ratio))
    
    out.sort(key=lambda x: x[1], reverse=True)
    return(out[:5], out[0][0])

def find(inpt, topic):
    if not topic:
        global questions
        global question_tags
        global choices
        global answers
    else:
        q_filter = q_all.loc[q_all["Genere"] == topic]
        questions = list(q_filter["Question Text"])
        question_tags = list(q_filter["Question Tags"])
        choices = list(q_filter["Choices"])
        answers = list(q_filter["Answer"])

    #options, top_option = fuzzy_match(inpt, questions)
    options, top_option = stem_match(inpt, questions, question_tags)

    choice = choices[questions.index(top_option)]
    choice = "" if pd.isnull(choice) else choice
    answer = answers[questions.index(top_option)]

    return(options, choice, answer)


def check():
    for i, answer in enumerate(answers):
        if pd.notnull(choices[i]):
            choice_index = set(re.findall(r"(\b[ABCDE]\b)", answer))
            print(answer, ">>>>>>>>>>>>>>>>>>>>>", choice_index)


def standalone():
    while True:
        inpt = input(">>>")
        options, choices, answer = find(inpt, None)
        pp.pprint(options)
        print(choices)
        print(answer)


if __name__ == "__main__":
    standalone()