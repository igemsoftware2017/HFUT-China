from elasticsearch import Elasticsearch
import MySQLdb
connect = MySQLdb.connect(
    host='localhost',
    port=3306,
    user='root',
    passwd='',
    db='wiki'
)
cur = connect.cursor()

es = Elasticsearch()
query = {
    "size":5000,
    "query": {
        "match_all": {}
    }
}

_searched = es.search(index='team_wiki', doc_type='wiki',body=query)
teams = _searched['hits']['hits']
for team in teams:
    id = team["_id"]
    team = team["_source"]
    team_name = team["team_name"]
    year = team["year"]
    print(year, team_name)
    cur.execute("update team set _id='%s' where year = %d and team_name='%s'"%(id, int(year), team_name))
connect.commit()
