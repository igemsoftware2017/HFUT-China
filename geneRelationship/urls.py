from django.contrib import admin
from django.conf.urls import *
from . import views

urlpatterns = [
	url(r'^searchGenes$', views.searchGenes),
    url(r'^getRelatedGene$', views.getRelatedGene),
    url(r'^randomGene$', views.randomGene),
    url(r'^getGeneInfo$', views.getGeneInfo),
    url(r'^getRelatedPaper$', views.getRelatedPaper),
    url(r'^getOneSentence$', views.getOneSentence),
    url(r'^getThreeSentences$', views.getThreeSentences),
    url(r'^getRelatedDisease$', views.getRelatedDisease),
]