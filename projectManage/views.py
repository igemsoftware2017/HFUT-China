# -*- coding:utf-8 -*-

"""

@author: Chenghao
"""

from django.shortcuts import render
from .models import *
from geneRelationship.models import Gene
from accounts.models import *
from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext, loader
from django.contrib.auth.hashers import make_password, check_password
from django.core.mail import send_mail
from utils.functionTools.generalFunction import noneIfEmptyString,noneIfNoKey,myError
import json
import string
import random

# Create your views here.

def getUserProject(request):
	try:
		body = request.body.decode('utf-8')
		data = json.loads(body)
		projects = Project.objects.filter(creator=user)
		projectsList = []
		for project in projects:
			projectsList.append({
				'project_name': noneIfEmptyString(project.project_name),
				'project_id': project.id,
				'track': noneIfEmptyString(project.track.track),
				'function': noneIfEmptyString(project.function),
				'creator': project.creator.userName
				})
		result = {
			'successful': True,
			'data': projectsList,
			'error': {
				'id': '',
				'msg': '',
			}
		}
	except myError as e:
		result = {
			'successful': False,
			'error': {
				'id': '3',
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

def getTracks(request):
	try:
		tracks = Tracks.objects.all()
		tracksList = []
		for track in tracks:
			tracksList.append({
				'track_id': track.id,
				'track_name': track.track
				})
		result = {
			'successful': True,
			'data': tracksList,
			'error': {
				'id': '',
				'msg': '',
			},
		}
	except Exception as e:
		result = {
			'successful': False,
			'error': {
				'id': '1024',
				'msg': e.args
			}
		}
	finally:
		return HttpResponse(json.dumps(result), content_type='application/json')


def createNewProject(request):
	try:
		body = request.body.decode('utf-8')
		data = json.loads(body)
		project_name = data['project_name']
		if not project_name:
			raise myError('Project_name can\'t be null.' )
		# track = Tracks.objects.filter(track=data['track']).first()
		# function = Functions.objects.filter(function=data['function']),first()
		project = Project()
		project.creator = user
		project.project_name = project_name
		project.track = track
		# project.function = function
		project.save()
		result = {
			'successful': True,
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
	except Exception as e:
		result = {
			'successful': False,
			'error': {
				'id': '1024',
				'msg': e.args
			}
		}
	finally:
		return HttpResponse(json.dumps(result), content_type='application/json')

def changeProjectName(request):
	try:
		body = request.body.decode('utf-8')
		data = json.loads(body)
		project_id = data['project_id']
		project = Project()
		project = Project.objects.filter(id=project_id).first()
		if user != project.creator:
			raise myError('Change Failed.')
		project.project_name = data['project_name']
		project.save()
		result = {
			'successful': True,
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
	except Exception as e:
		result = {
			'successful': False,
			'error': {
				'id': '1024',
				'msg': e.args
			}
		}
	finally:
		return HttpResponse(json.dumps(result), content_type='application/json')

def  deleteProject(request):
	try:
		body = request.body.decode('utf-8')
		data = json.loads(body)
		project_id = data['project_id']
		project = Project()
		project = Project.objects.filter(id=project_id).first()
		if user != project.creator:
			raise myError('Delete Failed.')
		project.delete()
		result = {
			'successful': True,
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
	except Exception as e:
		result = {
			'successful': False,
			'error': {
				'id': '1024',
				'msg': e.args
			}
		}
	finally:
		return HttpResponse(json.dumps(result), content_type='application/json')

def getProjectDevices(request):
	try:
		body = request.body.decode('utf-8')
		data = json.loads(body)
		project_id = data['project_id']
		project = Project()
		project = Project.objects.filter(id=project_id).first()
		if user != project.creator:
			raise myError('Check Failed.')
		chains = Chain.objects.filter(project=project)
		chainsList = []
		for chain in chains:
			seq = chain.sequence
			if not seq:
				chainLength = 0
			else:
				if seq.startswith('_'):
					seq = seq[1:]
				if seq.endswith('_'):
					seq = seq[:-1]
				chainLength = len(seq.split('_'))
			chainsList.append(
				{
					'chain_id': chain.id,
					'chain_sequence': chain.sequence,
					'chain_name': chain.name,
					'chain_isModified': chain.isModified,
					'chain_image_file_path': chain.image_file_path,
					'chain_Length': chainLength
				})
		result = {
			'successful': True,
			'data': chainsList,
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
	except Exception as e:
		result = {
			'successful': False,
			'error': {
				'id': '1024',
				'msg': e.args
			}
		}
	finally:
		return HttpResponse(json.dumps(result), content_type='application/json')

def createProjectDevice(request):
	try:
		body = request.body.decode('utf-8')
		data = json.loads(body)
		project_id = data['project_id']
		project = Project.objects.filter(id=project_id).first()
		if user != project.creator:
			raise myError('Create Failed.')
		if not data['device_name']:
			raise myError('Devicee_name can\'t be Null.' )
		chain = Chain()
		chain.name = data['device_name']
		chain.project = project
		chain.save()
		result = {
			'successful': True,
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
	except Exception as e:
		result = {
			'successful': False,
			'error': {
				'id': '1024',
				'msg': e.args
			}
		}
	finally:
		return HttpResponse(json.dumps(result), content_type='application/json')

def deleteProjectDevice(request):
	try:
		body = request.body.decode('utf-8')
		data = json.loads(body)
		project_id = data['project_id']
		project = Project.objects.filter(id=project_id).first()
		if user != project.creator:
			raise myError('Delete Failed.')
		chain = Chain.objects.filter(id=data['device_id']).first()
		deleteMassage = chain.delete()
		print(deleteMassage)
		result = {
			'successful': True,
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
	except Exception as e:
		result = {
			'successful': False,
			'error': {
				'id': '1024',
				'msg': e.args
			}
		}
	finally:
		return HttpResponse(json.dumps(result), content_type='application/json')