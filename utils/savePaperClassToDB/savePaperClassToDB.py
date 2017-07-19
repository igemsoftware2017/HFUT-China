# -*- coding:utf-8 -*-

import os,django
os.environ["DJANGO_SETTINGS_MODULE"] = "BioDesignVer.settings"
django.setup()
from geneRelationship.models import Paper_Gene
import traceback
import json

def savePaperClassToDB():
	readFile = file('julei.json')
	s = json.load(readFile)
	paper_classes = s['rows']
	for paper_class in paper_classes:
		try:
			paper_id = str(paper_class[2][3:-4])
			gene_id = str(paper_class[1])
			paper_gene = Paper_Gene.objects.filter(paper_id=paper_id, gene_id=gene_id).first()
			if paper_gene:
				paper_gene.paper_class = paper_class[3]
				paper_gene.save()
		except:
			traceback.print_exc()
if __name__ == '__main__':
	savePaperClassToDB()