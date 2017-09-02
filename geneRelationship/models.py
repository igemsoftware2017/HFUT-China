from __future__ import unicode_literals

from django.db import models

# Create your models here.
class Gene(models.Model):
    '''gene model'''
    gene_id = models.CharField(primary_key=True, max_length=32)
    name = models.CharField(max_length=64)
    nicknames = models.TextField(null=True)
    definition = models.TextField(null=True)
    organism_short = models.CharField(max_length=16)
    organism = models.CharField(max_length=256)
    position = models.CharField(max_length=16)
    ntseq_length = models.IntegerField()
    ntseq = models.TextField(null=True)

    def __str__(self):
        return self.name

    class Meta:
        '''internal class'''
        managed = False
        db_table = 'bio_gene'

class Paper_Gene(models.Model):
    '''paper model'''
    paper_id = models.CharField(max_length=32)
    paper_title = models.CharField(max_length=255)
    paper_keyword = models.CharField(max_length=255, default=None)
    paper_abstract = models.TextField()
    paper_link = models.CharField(max_length=255)
    gene = models.ForeignKey(Gene, on_delete=models.CASCADE)
    paper_class = models.IntegerField(default=-1)

    def __str__(self):
        return self.paper_id

    class Meta:
        managed = False
        db_table = 'bio_paper_gene'

class One_KeySentence(models.Model):
    '''keysentence model'''
    gene_name_one = models.CharField(max_length=64)
    gene_name_two = models.CharField(max_length=64)
    paper = models.ForeignKey(Paper_Gene, on_delete=models.CASCADE)
    sentence = models.TextField()

    def __str__(self):
        return self.gene_name_one

    class Meta:
        '''internal class'''
        managed = False
        db_table = 'bio_one_keysentence'

class Three_KeySentence(models.Model):
    gene_name_one = models.CharField(max_length=64)
    gene_name_two = models.CharField(max_length=64)
    paper = models.ForeignKey(Paper_Gene, on_delete=models.CASCADE)
    sentence = models.TextField()

    def __str__(self):
        return self.gene_name_one

    class Meta:
        '''internal class'''
        managed = False
        db_table = 'bio_three_keysentence'

class Gene_Disease(models.Model):
    '''gene disease class'''
    gene_name = models.CharField(max_length=64)
    disease_name = models.CharField(max_length=64)
    disease_class = models.CharField(max_length=64)
    paper_id = models.IntegerField()

    def __str__(self):
        return self.gene_name

    class Meta:
        '''internal class'''
        managed = False
        db_table = 'bio_gene_disease'