'''accounts urls'''
from django.contrib import admin
from django.conf.urls import *
from . import views

urlpatterns = [
    url(r'^register$', views.register),
    url(r'^login$', views.login),
    url(r'^changePassword$', views.changePassword),
    url(r'^logout$', views.logout),
    # url(r'^user/change_password$', views.change_password),
    # url(r'^user/confirm$', views.confirm),
    # url(r'^user/reconfirm$', views.reconfirm),
]