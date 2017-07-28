# -*- coding:utf-8 -*-

"""

@author:    ZhangAYongqin
"""
from django.shortcuts import render
from projectManage.models import *
from accounts.models import *
from django.http import HttpResponse, HttpResponseRedirect
from .search_part import ambiguousSearch, getPart
from utils.functionTools.generalFunction import noneIfEmptyString,noneIfNoKey,myError
from .recommend import *
from .search_part import *
from .getImage import *
import json
import string

# Create your views here.

def getChain(request):
    try:
        data = json.loads(request.body)
        try:
            token = Token.objects.filter(token=data['token']).first()
            user = token.user
        except:
            raise myError('Please Log In.')
        project_id = data['project_id']
        project = Project()
        project = Project.objects.filter(id=project_id).first()
        if user != project.creator:
            raise myError('Check Failed.')
        chain = Chain.objects.filter(id=data['chain_id']).first()
        sequence = chain.sequence
        sequenceList = []
        if (sequence):
            if sequence.startswith('_'):
                sequence = sequence[1:]
            if sequence.endswith('_'):
                sequence = sequence[:-1]
            sequenceList = sequence.split('_')
        partList = []
        for seq in sequenceList:
            part = Parts.objects.filter(part_id=seq).first()
            partList.append({
                    'part_id': part.part_id,
                    'part_name': part.part_name,
                    'part_type': part.part_type
                })
        result = {
            'successful': True,
            'data': partList,
            'error': {
                'id': '',
                'msg': '',
            },
        }
    except myError as e:
        result = {
            'successful': False,
            'error': {
                'id': '3',
                'msg': e.value,
            }
        }
    except myError as e:
        result = {
            'successful': False,
            'error': {
                'id': '1024',
                'msg': e.args
            }
        }
    finally:
        return HttpResponse(json.dumps(result), content_type='application/json')

def searchParts(request):
    try:
        data = json.loads(request.body)
        try:
            token = Token.objects.filter(token=data['token']).first()
            user = token.user
        except:
            raise myError('Please Log In.')
        keyword = data['keyword']
        try:
            funcs = data['funcs']
        except:
            funcs = None
        searchResult = ambiguousSearch(keyword, funcs)
        result = {
            'successful': True,
            'data': searchResult,
            'error': {
                'id': '',
                'msg': '',
            }
        }
    except myError as e:
        result = {
            'successful': False,
            'error': {
                'id': '',
                'msg': e.value,
            }
        }
    except Exception as e:
        result = {
            'successful': False,
            'error': {
                'id': '',
                'msg': e.args,
            }
        }
    finally:
        return HttpResponse(json.dumps(result), content_type='application/json')

def getParts(request):
    try:
        data = json.loads(request.body)
        try:
            token = Token.objects.filter(token=data['token']).first()
            user = token.user
        except:
            raise myError('Please Log In.')
        part_name = data['part_name']
        searchResult = getPart(part_name)
        if searchResult['successful']:
            result = {
                'successful': True,
                'data': searchResult,
                'error': {
                    'id': '',
                    'msg': '',
                }
            }
        else:
            raise myError('Check Failed.')
    except myError as e:
        result = {
            'successful': False,
            'error': {
                'id': '',
                'msg': e.value,
            }
        }
    except Exception as e:
        result = {
            'successful': False,
            'error': {
                'id': '',
                'msg': e.args,
            }
        }
    finally:
        return HttpResponse(json.dumps(result), content_type='application/json')


def updateChain(request):
    try:
        data = json.loads(request.body)
        try:
            token = Token.objects.filter(token=data['token']).first()
            user = token.user
        except:
            raise myError('Please Log In.')
        project_id = data['project_id']
        project = Project()
        project = Project.objects.filter(id=project_id).first()
        if user != project.creator:
            raise myError('Update Failed.')
        chainid = data['chain_id']
        chain = Chain()
        chain = Chain.objects.filter(id=data['chain_id']).first()
        if len(data['chain_info']):
            seq = ''
            for chain_item in data['chain_info']:
                if seq:
                    seq += '_' + str(chain_item[u'part_id'])
                else:
                    seq += str(chain_item[u'part_id'])
        chain.sequence = seq
        chain.save()
        result = {
            'successful': True,
            'data': seq,
            'error': {
                'id': '',
                'msg': '',
            }
        }
    except myError as e:
        result = {
            'successful': False,
            'error': {
                'id': '',
                'msg': e.value,
            }
        }
    except Exception as e:
        result = {
            'successful': False,
            'error': {
                'id': '',
                'msg': e.args,
            }
        }
    finally:
        return HttpResponse(json.dumps(result), content_type='application/json')

def getARecommend(request):
    try:
        data = json.loads(request.body)
        token = Token()
        token = Token.objects.filter(token=data.data['token']).first()
        chainStr = data.data['seq']
        try:
            funcsStr = data.data['funcs']
        except:
            funcsStr = ''
        if chainStr.startswith('_'):
            chainStr = chainStr[1:]
        if chainStr.endswith('_'):
            chainStr = chainStr[:-1]
        recommend_list = getApriorRecommend(chainStr, funcStr)
        result = {
            'successful': True,
            'data': recommend_list,
            'error': {
                'id': '',
                'msg': '',
            }
        }
    except myError as e:
        result = {
            'successful': False,
            'error': {
                'id': '',
                'msg': e.value,
            }
        }
    except Exception as e:
        result = {
            'successful': False,
            'error': {
                'id': '',
                'msg': e.args,
            }
        }
    finally:
        return HttpResponse(json.dumps(result), content_type='application/json')

def getMRecommend(request):
    try:
        data = json.loads(request.body)
        try:
            token = Token.objects.filter(token=data['token']).first()
            user = token.user
        except:
            raise myError('Please Log In.')
        part_id = str(data['part_id'])
        part_id_before = str(data['part_id_before'])
        position = data['position']
        recommend_list = list()
        if position == 'front':
            recommend_list = getBeforeMarkovRecommend(part_id)
        if position == 'back':
            recommend_list = getMarkovRecommend(part_id)
        if position == 'middle-front' or position == 'middle-back':
            recommend_list = getBetweenMarkovRecommend(part_id_before, part_id)
        result = {
            'successful': True,
            'data': {
                'recommend_list': recommend_list
            },
            'error': {
                'id': '',
                'msg': '',
            }
        }
    except myError as e:
        result = {
            'successful': False,
            'error': {
                'id': '',
                'msg': e.value,
            }
        }
    except Exception as e:
        result = {
            'successful': False,
            'error': {
                'id': '',
                'msg': e.args,
            }
        }
    finally:
        return HttpResponse(json.dumps(result), content_type='application/json')

def getResultImage(request):
    try:
        data = json.loads(request.body)
        try:
            token = Token.objects.filter(token=data['token']).first()
            user = token.user
        except:
            raise myError('Please Log In.')
        project_id = data['project_id']
        project = Project()
        project = Project.objects.filter(id=project_id).first()
        if user != project.creator:
            raise myError('Get Failed.')
        chainid = data['chain_id']
        chain = Chain.objects.filter(id=data['chain_id']).first()
        sequence = chain.sequence
        if not sequence:
            filepath = None
            raise myError('no img.')
        else:
            if sequence.startswith('_'):
                sequence = sequence[1:]
            if sequence.endswith('_'):
                sequence = sequence[:-1]
            chainName = chain.name
            width = 80 * len(sequence.split('_'))
            height = 100
            if width > 800:
                width = 800
                height = 200 * (len(sequence.split('_')) // 10)
            filepath = getSequenceResultImage(sequence, width, height, chainName)
            chain.isModified = False
            chain.image_file_path = filepath
            chain.save()
        result = {
            'successful': True,
            'data': filepath,
            'error': {
                'id': '',
                'msg': '',
            }
        }
    except myError as e:
        result = {
            'successful': False,
            'error': {
                'id': '',
                'msg': e.value,
            }
        }
    except Exception as e:
        result = {
            'successful': False,
            'error': {
                'id': '',
                'msg': e.args,
            }
        }
    finally:
        return HttpResponse(json.dumps(result), content_type='application/json')
