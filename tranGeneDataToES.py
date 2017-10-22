import os
import django
import sys
from elasticsearch import Elasticsearch

import os,django
os.environ["DJANGO_SETTINGS_MODULE"] = "BioDesignVer.settings"
django.setup()
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
#os.environ['DJANGO_SETTING_MODULE']='BioDesigner.settings'
from geneRelationship.models import Gene

id = 1

def saveInfoToES(es, gene_list):
    global id
    for gene_info in gene_list:
        print('processing gene %s' % gene_info.gene_id)
        gene_body = {
            'gene_id' : gene_info.gene_id,
            'name' : gene_info.name,
            'definition': gene_info.definition,
            'organism': gene_info.organism
        }
        res = es.index(index="biodesigners", doc_type="genes", body=gene_body)
        id += 1
        if not res['created']:
            print('gene %s error' % gene_info.gene_id)

def mainFunc():
    es = Elasticsearch()
    print('process started')
    gene_list = Gene.objects.all()
    saveInfoToES(es, gene_list)
    print('process ended')

if __name__ == '__main__':
    django.setup()
    mainFunc()