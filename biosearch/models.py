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

class LdaResult(models.Model):
    '''wiki model'''
    tracks = models.IntegerField(primary_key=True)
    keywords_0 = models.CharField(max_length=300)
    teams_0 = models.TextField(null=True)
    keywords_1 = models.CharField(max_length=300)
    teams_1 = models.TextField(null=True)
    keywords_2 = models.CharField(max_length=300)
    teams_2 = models.TextField(null=True)
    keywords_3 = models.CharField(max_length=300)
    teams_3 = models.TextField(null=True)
    keywords_4 = models.CharField(max_length=300)
    teams_4 = models.TextField(null=True)

    def __str__(self):
        return self.tracks
    class Meta:
        managed = False
        db_table = 'ldaresult'

class SimplePart(models.Model):
    '''wiki model'''
    part_id          = models.IntegerField(primary_key=True)
    part_name        = models.CharField(max_length=255)
    short_desc       = models.CharField(max_length=255,null=True)
    description       = models.CharField(max_length=255,null=True)
    part_type        = models.CharField(max_length=20,null=True)
    sequence         = models.TextField(null=True)
    team             = models.TextField(null = True)
    teamId			 = models.TextField(null = True)

    def __str__(self):
        return self.tracks
    class Meta:
        managed = False
        db_table = 'simpepart'