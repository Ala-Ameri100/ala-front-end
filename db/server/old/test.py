import nltk.corpus
from nltk import word_tokenize as tokenizer
import nltk.stem.snowball
from nltk.corpus import wordnet
import string
import pandas as pd
import pprint

#nltk.download('averaged_perceptron_tagger')
#nltk.download('wordnet')

# pprint settings
pp = pprint.PrettyPrinter(indent=2)

# get all csv
BPC = pd.read_csv("data/BPC.csv", header=0)
Cloud_UX = pd.read_csv("data/Cloud_UX.csv", header=0)
Hana_CDS = pd.read_csv("data/Hana_CDS.csv", header=0)
SCP_MEAN_Stack = pd.read_csv("data/SCP_MEAN_Stack.csv", header=0)

BPC['Genere'] = 'BPC'
Cloud_UX['Genere'] = 'Cloud_UX'
Hana_CDS['Genere'] = 'Hana_CDS'
SCP_MEAN_Stack['Genere'] = 'SCP_MEAN_Stack'

# header = ,Topic,Difficulty Level,Question Full,Answer,Question Text,Choices
q_all = pd.concat([BPC, Cloud_UX, Hana_CDS, SCP_MEAN_Stack], sort=False)

questions = list(q_all["Question Text"])
choices = list(q_all["Choices"])
answers = list(q_all["Answer"])


# Get default English stopwords and extend with punctuation
stopwords = nltk.corpus.stopwords.words('english')
stopwords.extend(string.punctuation)
stopwords.append('')

# Create stemmer
stemmer = nltk.stem.snowball.SnowballStemmer('english')

# Create lemmatizer
lemmatizer = nltk.stem.wordnet.WordNetLemmatizer()


def tokenize_remove_stopwords(x):
    return [token.lower() for token in tokenizer(x) if token.lower() not in stopwords]


def stem(x):
    return [stemmer.stem(token) for token in x]


def get_wordnet_pos(pos_tag):
    if pos_tag[1].startswith('J'):
        return (pos_tag[0], wordnet.ADJ)
    elif pos_tag[1].startswith('V'):
        return (pos_tag[0], wordnet.VERB)
    elif pos_tag[1].startswith('N'):
        return (pos_tag[0], wordnet.NOUN)
    elif pos_tag[1].startswith('R'):
        return (pos_tag[0], wordnet.ADV)
    else:
        return (pos_tag[0], wordnet.NOUN)


def token_stopword_match(a, b, threshold=0.5):
    """
    
    a = stem(tokenize_remove_stopwords(a))
    b = stem(tokenize_remove_stopwords(b))
    
    """
    
    pos_a = map(get_wordnet_pos, nltk.pos_tag(tokenizer(a)))
    pos_b = map(get_wordnet_pos, nltk.pos_tag(tokenizer(b)))
    a = [lemmatizer.lemmatize(token.lower(), pos) for token, pos in pos_a
                if pos == wordnet.NOUN and token.lower() not in stopwords]
    b = [lemmatizer.lemmatize(token.lower(), pos) for token, pos in pos_b
                if pos == wordnet.NOUN and token.lower() not in stopwords]
    
    
    # Calculate Jaccard similarity
    ratio = len(set(a).intersection(b)) / float(len(set(a).union(b)))

    # return (ratio >= threshold)
    return (ratio)


def match(inpt):
    out = []
    for question in questions:
        out.append([question, token_stopword_match(inpt, question)])
    out.sort(key=lambda x: x[1], reverse=True)
    return(out[:5])


if __name__ == "__main__":
    while True:
        inpt = input(">>>")
        pp.pprint(match(inpt))
