
from django.shortcuts import render
import json
import math
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from .esfunc import *
from .models import Wiki
from .suggestion import *

numOfEachPage = 5
cacheNum = 4

def randomPage(request):
    result = dict()
    try:
        data = json.loads(request.body)
        keyword = data.get('keyword')
        track = data.get('track')
        page = data.get('page')
        teamList = getanswer(keyword, track, page)
        request.session['answers'] = teamList
        r = Retrieve()
        suggestions = r.retrieve(keyword)
        groups = getGroup(track)
        result = {
            'successful': True,
            'data': {
                'groups': groups,
                'suggestions': suggestions,
                'content': teamList[0:numOfEachPage]
            }
        }
    except Exception as e:
        print(e)
        result = {
            'successful': False,
            'error': {
                'id': '1',
                'msg': e.value
            }
        }
    finally:
        return HttpResponse(json.dumps(result), content_type='application/json')


def turnPage(request):
    answers = []
    try:
        data = json.loads(request.body)
        page = data.get('page')
        answers = request.session.get('answers')
        answers = answers[(page-1)*numOfEachPage:page*numOfEachPage]
        print(answers)
        result = {
            'successful': True,
            'data': {
                'content': answers
            }
        }
    except Exception as e:
        print(e)
        result = {
            'successful': False,
            'error': {
                'id': '1',
                'msg': e.value
            }
        }
    finally:
        return HttpResponse(json.dumps(result), content_type='application/json')

def getCache(request):
    result = dict()
    try:
        data = json.loads(request.body)
        page = data.get('page')
        keyword = data('keyword')
        track = data.get('track')
        teamList = getanswer(keyword, track, page)
        request.session['answers'] = teamList
        result = {
            'successful': True
        }
    except Exception as e:
        print(e)
        result = {
            'successful': False,
            'error': {
                'id': '1',
                'msg': e.value
            }
        }
    finally:
        return HttpResponse(json.dumps(result), content_type='application/json')

def getDetail(request):
    data = None
    detail = None
    try:
        data = json.loads(request.body)
        id = data['_id']
        detail = getdetailbyid(id)
        detail = detail['_source']
        result = {
            'successful': True,
            'data': detail
        }
    except Exception as e:
        print(e)
    finally:
        return HttpResponse(json.dumps(result), content_type='application/json')

def bioSearchFirst(request):
    data = json.loads(request.body)
    _id = data["_id"]
    keyword = data["keyword"]
    part = getPartDetail(_id)
    r = Retrieve()
    suggestions = r.retrieve(keyword)
    teamIdsStr = part["teams"]
    teamIds = teamIdsStr.split(',')
    teams = getTeamWiki(teamIds, None)
    result = {
        'successful': True,
        'data': {
            'pageSum':math.ceil(teams.__len__()/numOfEachPage),
            'content':teams[0:numOfEachPage],
            'suggestions': suggestions,
            'part':part
        }
    }
    return HttpResponse(json.dumps(result), content_type='application/json')

def classify(request):
    data = json.loads(request.body)
    keyword = data.get("keyword")
    classification = data["classification"]
    teamsIds = request.session.get('answers')
    teams = getClassification(classification, keyword)
    result = {
        'successful': True,
        'data': {
            'pageSum':math.ceil(teams.__len__()/numOfEachPage),
            'content':teams[0:numOfEachPage]
        }
    }
    return HttpResponse(json.dumps(result), content_type='application/json')