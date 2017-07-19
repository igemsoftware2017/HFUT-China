import os,django
os.environ["DJANGO_SETTINGS_MODULE"] = "BioDesignVer.settings"
django.setup()
from geneRelationship.models import *
import traceback
import csv

def saveThreeSentenceToDB():
	readFile = file('3Sentence.csv', 'r')
	reader = csv.reader(readFile)
	for line in reader:
		try:
			gene_name_one = line[0]
			gene_name_two = line[1]
			sentence = line[2]
			paper_id = line[4][3:]
			paper = Paper_Gene.objects.filter(paper_id=paper_id).first()
			if paper:
				three_keySentence = Three_KeySentence.objects.filter(gene_name_one=gene_name_one, gene_name_two=gene_name_two, 
						sentence=sentence, paper=paper).first()
				if not three_keySentence:
					three_keySentence = Three_KeySentence()
					three_keySentence.gene_name_one = gene_name_one
					three_keySentence.gene_name_two = gene_name_two
					three_keySentence.sentence = sentence
					three_keySentence.paper = paper
					three_keySentence.save()
		except:
			traceback.print_exc()

if __name__ == '__main__':
	saveThreeSentenceToDB()