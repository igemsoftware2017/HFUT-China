from __future__ import unicode_literals

from django.db import models

# Create your models here.

class Wiki(models.Model):
    '''wiki model'''
    wiki_id = models.IntegerField(primary_key=True)
    team_name = models.CharField(max_length=255)
    attribution = models.TextField(null=True)
    background = models.TextField(null=True)
    description = models.TextField(null=True)
    design = models.TextField(null=True)
    human_practice = models.TextField(null=True)
    modeling = models.TextField(null=True)
    notebook = models.TextField(null=True)
    protocol = models.TextField(null=True)
    result = models.TextField(null=True)
    safety = models.TextField(null=True)
    keywords = models.TextField(null=True)
    track = models.TextField(null=True)
    part_favorite = models.TextField(null=True)
    part_normal = models.TextField(null=True)

    def __str__(self):
        return self.team_name

    class Meta:
        managed = False
        db_table = 'team_wiki'

class LdaKeyword(models.Model):
    '''wiki model'''
    id = models.IntegerField(primary_key=True)
    keyword = models.CharField(max_length=300)
    theme_name = models.CharField(max_length=45)
    track = models.CharField(max_length=45)

    def __str__(self):
        return self.theme_name

    class Meta:
        managed = False
        db_table = 'lda_keyword'