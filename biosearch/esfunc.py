# -*- coding:utf-8 -*-
from elasticsearch import Elasticsearch
import chardet
import json
# from .models import LdaKeyword
from projectManage.models import Parts

es = Elasticsearch()
fields = ["attribution","background","description","design","human_practice","modeling","notebook","protocol","result","safety","keywords"]

def getTeamId(year, name):
    _query = {
        "size": 1,
        "query": { 
            "bool": { 
                "must": [
                    { "match": { "year": year}}, 
                    { "match": { "team_name": name }}  
                ]
            }
        }
    }
    _searched = es.search(index='team_wiki', doc_type='wiki',body=_query)
    team = _searched['hits']['hits'][0]
    _id = team["_id"]
    print(_id)
    return _id

def getdetailbyid(_id, keyword):
    _query = {
        "size": 1,
        "query": {
            "bool": {
                "filter": [{
                    "term": {
                        "_id":_id
                    }
                }]
            }
        }
    }
    _searched = es.search(index='team_wiki', doc_type='wiki',body=_query)
    return _searched['hits']['hits'][0]

def getanswer(_keyword, _track1, page):
    _query = {
        "from": (page-1)*2,
        "size": 10,
        "query": {
            "bool":{
                "must":[{
                        "multi_match":{
                            "query": _keyword,
                            "fields": [
                                "background",
                                "description",
                                "design",
                                "human_practice",
                                "modeling",
                                "protocol",
                                "result",
                                "keywords"
                            ],
                            "fuzziness" : "AUTO"
                        }
                    }
                ]
            }
        },
        "sort": [{
            "_score": {"order": "desc"}
        },{
            "calScore": {"order": "desc"}
        },{
            "year": {"order": "desc"}
        }],
        "highlight": {
            "pre_tags" : ["<font color='#f35762'><b>"],
            "post_tags" : ["</b></font>"],
            "fragment_size" : 80,
            "fields": {
                "background":{},    
                "description":{},
                "design":{},
                "human_practice":{},
                "modeling":{},
                "protocol":{},
                "result":{},
                "keywords":{}
            }
        }
    }
    if _track1:
        _query["query"]["bool"]["filter"] = [{
                    "terms": {
                        "track": _track1
                    }
                }]
    _searched = es.search(index='team_wiki', doc_type='wiki',body=_query)
    searchsort = _searched["hits"]["hits"]
    searchfilter = filter(searchsort)
    return searchfilter

def filter(searchsort):
    teamList = list()
    groupDict = dict()
    for i in searchsort:
        abstract = ""
        if i['_source']['description']!="":
            abstract = i['_source']['description']
        elif i['_source']['design']!="":
            abstract = i['_source']['design']
        elif i['_source']['background']!="":
            abstract = i['_source']['background']
        abstract = abstract[:500]
        highlight = list()
        if i.get('highlight'):
            if len(i['highlight'])>0:
                for field in i['highlight'].keys():
                    highlight.append(i['highlight'][field][0])
        awards = ''
        if i['_source']['medal'] != 'None':
            awards = i['_source']['medal']
        else:
            awards = 'No Medal'
        if i['_source']['awards'] != 'None':
            awards = awards + i['_source']['awards']
        else:
            awards = awards + '/No Special Prizes'
        biobricks = i['_source']['biobrick'].split('\n')
        parts = list()
        for biobrick in biobricks:
            partRaw = getPart(biobrick)
            if partRaw:
                part = {
                    "_id": partRaw["_id"],
                    "part_name": partRaw["_source"]["part_name"],
                    "part_type" : partRaw["_source"]['part_type']
                }
                parts.append(part)
        tmp = {
            '_id':i['_id'],
            'title':i['_source']['year']+'-'+i['_source']['team_name'],
            'keywords':i['_source']['keywords'],
            'biobrick': parts,
            'awards': awards,
            'type': i['_source']['type'],
            'abstract':abstract,
            'highlight': highlight
        }
        # group = json.loads(i['_source']['group'])
        # for field in group.keys():
        #     if (groupDict.get(field) < group.get(field)):
        #         groupDict[field] = group.get[field]
        # groups = list()
        # groups = [['123',0.5]]
        # for (key, value) in groupDict.items():
        #     groups.append([key, value])
        # print (tmp)
        teamList.append(tmp)
    # groups.sort(key = lambda x:x[1], reverse=True)
    # groups = groups[:8]
    # result = {
    #     'teamList': teamList,
    #     'groups': groups
    # }
    return teamList

def biosort(searched):
    search = searched['hits']['hits']
    #score 重新计算并排序
    search.sort(key = lambda x:x['_score']+x['_source']['hits'],reverse=True)
    return search
    
def getPart(keyword):
    query = {
        "from" : 0,
        "size" : 1,
        "query" : {
            "multi_match" : {
                "fields" : ["part_name"],
                "query" : keyword
            }
        }
    }
    _searched = es.search(index="biodesigners", doc_type="parts", body=query)
    partRaw = None
    if len(_searched["hits"]["hits"])>0:
        return _searched["hits"]["hits"][0]
    else:
        return None

def getPartTeam(keyword):
    partRaw = getPart(keyword)
    teams = list()
    if partRaw:
        teamsStr = partRaw["_source"]['teamId']
        teamIdList = teamsStr.split(',')
        teams = getTeamWiki(teamIdList, None, keyword)
    else:
        teams = []
    return teams

def getTeamWiki(teamIds, _keyword, part): 
    query = dict()
    if _keyword:
        query = {
            "query": {
                "bool": {
                    "filter": {
                        "terms": {
                            "_id": teamIds
                        }
                    },
                    "must":[{
                            "multi_match":{
                                "query": _keyword,
                                "fields": [
                                    "attribution",
                                    "background",
                                    "description",
                                    "design",
                                    "human_practice",
                                    "modeling",
                                    "notebook",
                                    "protocol",
                                    "result",
                                    "safety",
                                    "keywords"
                                ],
                                "fuzziness" : "AUTO"
                            }
                        }
                    ]
                }
            },
            "highlight": {
                "pre_tags" : ["<font color='#f35762'><b>"],
                "post_tags" : ["</b></font>"],
                "fragment_size" : 80,
                "fields": {
                    "attribution":{},
                    "background":{},
                    "description":{},
                    "design":{},
                    "human_practice":{},
                    "modeling":{},
                    "notebook":{},
                    "protocol":{},
                    "result":{},
                    "safety":{},
                    "keywords":{},
                    "part_favorite":{},
                    "part_normal":{}
                }
            }
        }
    else:
        query = {
            "query": {
                "bool": {
                    "filter": {
                        "terms": {
                            "_id": teamIds
                        }
                    }
                }
            }
        }

    _searched = es.search(index='team_wiki', doc_type='wiki',body=query)
    teams = filter(_searched["hits"]["hits"])
    return teams

def getPartDetail(_id):
    query = {
        "size": 1,
        "query": {
            "bool": {
                "filter": {
                    "term": {
                        "_id": _id
                    }
                }
            }
        }
    }
    _searched = es.search(index="biodesigners", doc_type="parts", body=query)
    partDetail = _searched["hits"]["hits"][0]["_source"]
    return partDetail

def getClassification(classification, keyword):
    query = dict()
    if keyword:
        query = {
            "query": {
                "bool": {
                    "filter": {
                        "terms": {
                            "_id": teamIds
                        }
                    },
                    "must":[{
                            "match":{
                                "classification": {
                                    "query": classification.join(' '),
                                    "operator": "and"
                                }
                            }
                        }, {
                            "multi_match":{
                                "query": keyword,
                                "fields": [
                                    "background",
                                    "description",
                                    "design",
                                    "human_practice",
                                    "modeling",
                                    "protocol",
                                    "result",
                                    "keywords"
                                ],
                                "fuzziness" : "AUTO"
                            }
                        }
                    ]
                }
            },
            "highlight": {
                "pre_tags" : ["<font color='#f35762'><b>"],
                "post_tags" : ["</b></font>"],
                "fragment_size" : 80,
                "fields": {
                    "background":{},
                    "description":{},
                    "design":{},
                    "human_practice":{},
                    "modeling":{},
                    "protocol":{},
                    "result":{},
                    "keywords":{}
                }
            }
        }
    else:
        query = {
            "query": {
                "bool": {
                    "filter": {
                        "terms": {
                            "_id": teamIds
                        }
                    },
                    "must":[{
                            "match":{
                                "classification": {
                                    "query": classification.join(' '),
                                    "operator": "and"
                                }
                            }
                        }
                    ]
                }
            }
        }
    _searched = es.search(index='team_wiki', doc_type='wiki',body=query)
    teams = filter(_searched["hits"]["hits"])
    return teams

# def getLdaResult(tracks):
#     ldaResult = list()
#     for track in tracks:
#         themes = LdaKeyword.objects.filter(track=track)
#         for theme in themes:
#             ldaResult.append({
#                 "theme_name": theme.theme_name,
#                 "keyword": theme.keyword
#             })
#     return ldaResult