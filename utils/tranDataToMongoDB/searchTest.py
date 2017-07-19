from pymongo import MongoClient
import json

client = MongoClient('localhost', 27017)

db = client['biodesignver']
collection = db['biodesignver']
result = collection.find_one({"main_gene": "TNF"})