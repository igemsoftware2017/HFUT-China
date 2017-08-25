
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
    track = data['track']
    answers = []
    result = {}
    try:

        # keyword = "in order to distinguish differential gene expression"
        # track = ["food"]
        # 替换上面的
        keyword = data['keyword']
        track = data['track']

        parts = getPart(keyword)

        answers = getanswer(keyword,track)
        request.session['answers'] = answers
        r = Retrieve()
        suggestions = r.retrieve(keyword)
        result = {
            'successful': True,
            'data': {
                'pageSum':math.ceil(answers.__len__()/numOfEachPage),
                'content':answers[0:numOfEachPage],
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
        answers = request.session.get('answers')
        answers = answers[0+page*numOfEachPage:0+(page+1)*numOfEachPage]
    except Exception as e:
        print(e)
    finally:
        return HttpResponse(json.dumps(answers), content_type='application/json')
# Create your views here.

def getDetail(request):
    data = None
    detail = None
    try:
        data = json.loads(request.body)
        id = data['_id']
        detail = getdetailbyid(id)
    except Exception as e:
        print(e)
    finally:
        return HttpResponse(json.dumps(detail), content_type='application/json')

    def bioSearchFirst(request):
        data = json.loads(request.body)
        keyword = data["keyword"]
        parts = getPart(keyword)
        suggestions = r.retrieve(keyword)
        if len(parts)>0:
            part = parts[0]
            teamIds = part["teams"]
            teams = getTeamWiki(teamIds)
            result = {
                'successful': True,
                'data': {
                    'pageSum':math.ceil(teams.__len__()/numOfEachPage),
                    'content':teams[0:numOfEachPage],
                    'suggestions': suggestions,
                    'parts':parts
                }
            }
        return HttpResponse(json.dumps(result), content_type='application/json')