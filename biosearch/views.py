from django.shortcuts import render
import json
import math
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from .esfunc import *
from .models import Wiki
from .suggestion import *

numOfEachPage = 5
cacheNum = 2

def randomPage(request):
    result = dict()
    try:
        body = request.body
        body = body.decode('utf-8')
        data = json.loads(body)
        keyword = data.get('keyword')
        teams = getPartTeam(keyword)
        track = data.get('track')
        track.append('NotSpecified')
        page = data.get('page')
        suggestions = list()
        groups = list()
        if page == 1 :
            r = Retrieve()
            suggestions = r.retrieve(keyword)
            # groups = getLdaResult(track)
        teamList = getanswer(keyword, track, page)
        teams.extend(teamList)
        request.session['answers'] = teams
        result = {
            'successful': True,
            'data': {
                'groups': groups,
                'suggestions': suggestions,
                'content': teams[0:numOfEachPage]
            }
        }
    except Exception as e:
        print('Error:', e)
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
        body = request.body
        body = body.decode('utf-8')
        data = json.loads(body)
        page = data.get('page')
        answers = request.session.get('answers')
        answers = answers[(page-1)*numOfEachPage:page*numOfEachPage]
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
        body = request.body
        body = body.decode('utf-8')
        data = json.loads(body)
        page = data.get('page')
        keyword = data.get('keyword')
        track = data.get('track')
        track.append('NotSpecified')
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
    result = dict()
    try:
        body = request.body
        body = body.decode('utf-8')
        data = json.loads(body)
        id = data['_id']
        keyword = data['keyword']
        detail = getdetailbyid(id, keyword)
        detail = detail['_source']
        awards = ''
        if detail['medal'] != 'None':
            awards = detail['medal']
        else:
            awards = 'No Medal'
        if detail['awards'] != 'None':
            awards = awards + detail['awards']
        else:
            awards = awards + '/No Special Prizes'
        detail['awards'] = awards
        recommendNames = detail['recommend'].split('\n')
        recommendKeywords = detail['recommendWords'].split('/')
        recommends = list()
        for index in range(len(recommendNames)):
            recommends.append({
                "team_name": recommendNames[index],
                "keywords": recommendKeywords[index]
            })
        detail["recommends"] = recommends
        result = {
            'successful': True,
            'data': detail
        }
    except Exception as e:
        print(e)
    finally:
        return HttpResponse(json.dumps(result), content_type='application/json')


def classify(request):
    body = request.body
    body = body.decode('utf-8')
    data = json.loads(body)
    keyword = data.get("keyword")
    classification = data["classification"]
    teamsIds = request.session.get('answers')
    # teams = getClassification(classification, keyword)
    result = {
        'successful': True,
        'data': {
            'pageSum':math.ceil(teams.__len__()/numOfEachPage),
            'content':teams[0:numOfEachPage]
        }
    }
    return HttpResponse(json.dumps(result), content_type='application/json')

def searchPart(request):
    body = request.body
    body = body.decode('utf-8')
    data = json.loads(body)
    keyword = data["keyword"]
    part = getPart(keyword)
    return HttpResponse(json.dumps(part), content_type='application/json')

def getOneTeam(request):
    body = request.body
    body = body.decode('utf-8')
    data = json.loads(body)
    teamName = data["teamName"]
    index = teamName.find('_')
    year = str(teamName[0:index])
    name = teamName[index+1:]
    id = getTeamId(year, name)
    result = {
        'successful': True,
        'data': {
            'id': id
        }
    }
    return HttpResponse(json.dumps(result), content_type='application/json')
