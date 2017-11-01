# -*- coding:utf-8 -*-
from elasticsearch import Elasticsearch

# copy data from mongodb to elasticsearch
import pymysql

# 打开数据库连接
db = pymysql.connect("localhost","root","qaz123","wiki")

# 使用cursor()方法获取操作游标
cursor = db.cursor()

# SQL 查询语句
sql = "SELECT * FROM team"

def buildIndexAndMapping(_es):
    _index_mappings = {
        "mappings": {
            "wiki": {
                "properties": {
                    "year" : {"type": "keyword"},
                    "team_name" : {"type": "text"},
                    "background" : {"type": "text"},
                    "description" : {"type": "text"},
                    "design" : {"type": "text"},
                    "human_practice" : {"type": "text"},
                    "modeling" : {"type": "text"},
                    "notebook" : {"type": "text"},
                    "protocol" : {"type": "text"},
                    "result" : {"type": "text"},
                    "track" : {"type": "keyword"},
                    "recommend": {"type": "text"},
                    "recommendWords": {"type": "text"},
                    "biobrick": {"type": "text"},
                    "keywords" : {"type": "text"},
                    "theme" : {"type": "keyword"},
                    "awards" : {"type": "text"},
                    "type": {"type": "text"},
                    "medal": {"type": "text"},
                    "calScore": {"type": "integer"},
                    "link": {"type": "text"}
                }
            },
        }
    }
    if _es.indices.exists(index='team_wiki') is not True:
        _es.indices.create(index='team_wiki', body=_index_mappings)

def writeData(_es):
    #这里的数据是测试用的 ，，，
    user_cursor = []
    try:
        # 执行SQL语句
        cursor.execute(sql)
        # 获取所有记录列表
        results = cursor.fetchall()
        for row in results:
            tmp = {
                "year" : row[0].__str__(),
                "team_name" : row[1].__str__(),
                "background" : row[2].__str__(),
                "description" : row[3].__str__(),
                "design" : row[4].__str__(),
                "human_practice" : row[5].__str__(),
                "modeling" : row[6].__str__(),
                "notebook" : row[7].__str__(),
                "protocol" : row[8].__str__(),
                "result" : row[9].__str__(),
                "track" : row[10].__str__(),
                "recommend": row[11].__str__(),
                "recommendWords": row[12].__str__(),
                "biobrick": row[13].__str__(),
                "keywords" : row[14].__str__(),
                "theme" : row[15].__str__(),
                "awards" : row[16].__str__(),
                "type": row[17].__str__(),
                "medal": row[18].__str__(),
                "calScore": row[19].__str__(),
                "link": row[20].__str__()
            }
            user_cursor.append(tmp)
    except:
        print("Error: unable to fetch data")
    processed = 0
    for _doc in user_cursor:
        try:
            _es.index(index='team_wiki', doc_type='wiki', refresh=True, body=_doc)
            processed += 1
            print('Processed: ' + str(processed), flush=True)
        except Exception as e:
            print(e)


def mainFunc():
    print("copy data from mongodb to elasticsearch")
    es = Elasticsearch()
    buildIndexAndMapping(es)
    print("search finished")
    writeData(es)


if __name__ == '__main__':
    mainFunc()