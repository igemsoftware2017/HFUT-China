
from django.shortcuts import render
import json
import math
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from .esfunc import *
from .models import Wiki
from .suggestion import *

numOfEachPage = 20

def firstPage(request):
    data = json.loads(request.body)
    keyword = data['keyword']
    track = data.get('track')
    answers = []
    result = {}
    try:
        parts = getPart(keyword)

        answers = getanswer(keyword,track)
        teamList = answers['teamList']
        teamIds = list()
        for team in teamList:
            teamIds.append(team["_id"])
        request.session['answers'] = teamIds
        r = Retrieve()
        suggestions = r.retrieve(keyword)
        result = {
            'successful': True,
            'data': {
                'pageSum':math.ceil(teamList.__len__()/numOfEachPage),
                'content':teamList[0:numOfEachPage],
                'groups': answers['groups'],
                'suggestions': suggestions,
                'parts':parts
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
    data = None
    answers = []
    try:
        data = json.loads(request.body)
        page = data['page']
        keyword = data['keyword']
        answers = request.session.get('answers')
        answers = answers[(page-1)*numOfEachPage:page*numOfEachPage]
        teams = getTeamWiki(answers, keyword)
        print(teams)
    except Exception as e:
        print(str(e))
    finally:
        return HttpResponse(json.dumps(teams), content_type='application/json')
# Create your views here.

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