# -*- coding:utf-8 -*-

"""

@author: ZhangAYongqin
"""

from pymongo import MongoClient
import json

client = MongoClient('localhost', 27017)

db = client['biodesignver']
collection = db['biodesignver']
with open('analy_result.json','rb') as jsonfile:
    json_data = json.loads(jsonfile.read())
    for gene_data in json_data:
        post_id = collection.insert_one(gene_data)