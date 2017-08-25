# -*- coding: utf-8 -*-
import warnings
warnings.filterwarnings(action='ignore', category=UserWarning, module='gensim')
from gensim import models
from nltk.tokenize import word_tokenize

class Retrieve:
    def getStopWords(self):
        stop_words = []
        f = open('./biosearch/sw.txt','r',encoding='utf-8')
        for line in f.readlines():
            stop_words.append(line.strip().lower())
        stop_words = set(stop_words)
        return stop_words
    def __init__(self):
        self.stop_words = self.getStopWords()
        self.model = models.Word2Vec.load('./biosearch/model4/word2vec_gensim')

    def retrieve(self, str):
        words = word_tokenize(str)
        print(words)
        newWords = []
        for word in words:
            if word.lower() not in self.stop_words:
                newWords.append(word.lower())
        try:
            if newWords != []:
                #找出 相似度 最高的n个单词
                n = 9
                sim = self.model.most_similar(positive=newWords, topn=n)
                return sim
            else:  #去除停词后发现没有有效词汇了
                print('未发现有效的词语，没有推荐内容！')
        except KeyError:
            print('词语未收录在词库中，没有推荐内容！')

if __name__ == '__main__':
    r = Retrieve()
