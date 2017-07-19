# -*- coding:utf-8 -*-

import os,django
os.environ["DJANGO_SETTINGS_MODULE"] = "BioDesignVer.settings"
django.setup()
from geneRelationship.models import Gene_Disease
import traceback
import json

def saveGene_DiseasetoDB():
	readFile = file('resultDisease.json')
	for f in readFile:
		gnee_disease_objects = json.loads(f)
	for gene_disease_object in gnee_disease_objects:
		try:
			gene_name = gene_disease_object['gene']
			disease_name = gene_disease_object['disease']
			gene_disease = Gene_Disease.objects.filter(gene_name=gene_name, disease_name=disease_name).first()
			if not gene_disease:
				gene_disease = Gene_Disease()
				gene_disease.gene_name = gene_name
				gene_disease.disease_name = disease_name
				gene_disease.disease_class = gene_disease_object['dis_class']
				gene_disease.paper_id = gene_disease_object['pubmedid']
				gene_disease.save()
		except:
			traceback.print_exc()

if __name__ == '__main__':
	saveGene_DiseasetoDB()