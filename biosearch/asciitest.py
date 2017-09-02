from elasticsearch import Elasticsearch
es = Elasticsearch()
_keyword = "Environment"
_track = "Environment"
_query = {
        "query": {
            "bool":{
                "should":{
                    "multi_match": {
                    "query": _keyword,
                    "fields":["attribution"]
                    }
                },
                "must":{"match": {"track": _track}}
            }
        }
    }
_searched = es.search(index='search_index3', doc_type='searchtest3',body=_query)
print (_searched)