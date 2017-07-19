import os,django
os.environ["DJANGO_SETTINGS_MODULE"] = "BioDesignVer.settings"
django.setup()
from geneRelationship.models import *
import traceback
import csv

def saveOneSentenceToDB():
	readFile = file('singleSentence.csv', 'r')
	reader = csv.reader(readFile)
	for line in reader:
		try:
			gene_name_one = line[0]
			gene_name_two = line[1]
			sentence = line[2]
			paper_id = line[4][3:]
			paper = Paper_Gene.objects.filter(paper_id=paper_id).first()
			if paper:
				one_keySentence = One_KeySentence.objects.filter(gene_name_one=gene_name_one, gene_name_two=gene_name_two, 
						sentence=sentence, paper=paper).first()
				if not one_keySentence:
					one_keySentence = One_KeySentence()
					one_keySentence.gene_name_one = gene_name_one
					one_keySentence.gene_name_two = gene_name_two
					one_keySentence.sentence = sentence
					one_keySentence.paper = paper
					one_keySentence.save()
		except:
			traceback.print_exc()

if __name__ == '__main__':
	saveOneSentenceToDB()