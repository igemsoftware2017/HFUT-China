import json
file = open("../1.json","r", encoding="utf-8")
str = file.read()
search = json.loads(str)
for x in search["hits"]["hits"]:
    print(x["_source"]["team_name"])