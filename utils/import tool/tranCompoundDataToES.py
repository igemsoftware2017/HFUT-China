import os
import django
import sys
from elasticsearch import Elasticsearch

pro_dir = os.getcwd()
sys.path.append(pro_dir)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "BioDesignVer.settings")
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()

from projectManage.models import Compound as compound

id = 1

def saveInfoToES(es, compound_list):
    global id
    for compound_info in compound_list:
        print('processing compound %s' % compound_info.compound_id)
        compound_body = {
            'compound_id' : compound_info.compound_id,
            'name' : compound_info.name
        }
        res = es.index(index="biodesigners", doc_type="compounds", body=compound_body)
        id += 1
        if not res['created']:
            print('compound %s error' % compound_info.compound_id)

def mainFunc():
    es = Elasticsearch()
    print('process started')
    x = 0
    y = 1000
    total = compound.objects.count()
    while y < total:
        compound_list = compound.objects.all()[x:y]
        saveInfoToES(es, compound_list)
        x = y
        y = y+1000
        if y > total:
            y = total
    print('process ended')
    

if __name__ == '__main__':
    django.setup()
    mainFunc()