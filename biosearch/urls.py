# -*- coding:utf-8 -*-
from django.conf.urls import *
from . import views

urlpatterns = [
    url(r'^firstPage', views.firstPage),
    url(r'^turnPage', views.turnPage),
    url(r'^getDetail', views.getDetail),
]