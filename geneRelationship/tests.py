import os,django
os.environ["DJANGO_SETTINGS_MODULE"] = "BioDesignVer.settings"
django.setup()
from django.test import TestCase
from search_relation import search_relation,search_genes,search_papers,search_one_sentence,search_related_disease,search_three_sentence
from models import Gene,Gene_Disease,Paper_Gene,One_KeySentence,Three_KeySentence
import py.test

# Create your tests here.
class searchRelationTestCase(TestCase):
	def setUp(self):
		self.gene = Gene()
		self.gene.gene_id = 'test'
		self.gene.name = 'test_gene'
		self.gene.ntseq_length = 0
		self.gene.save()

		self.paper_gene = Paper_Gene()
		self.paper_gene.paper_id = 'paper_id'
		self.paper_gene.paper_title = 'title'
		self.paper_gene.paper_link = 'www.test.com'
		self.paper_gene.gene = self.gene
		self.paper_gene.paper_keyword = ''
		self.paper_gene.save()

	
	def test_search_relation(self):
		search_result = search_relation('none')
		self.assertEqual(search_result, None)

	def test_search_genes(self):
		search_result = search_genes('none')
		self.assertEqual(search_result, None)

	def test_search_papers(self):
		search_result = search_papers('test')
		self.assertEqual(search_result, [])

	def test_search_one_sentence(self):
		search_result = search_one_sentence('name1', 'name2')
		self.assertEqual(search_result, [])

	def test_search_three_sentence(self):
		search_result = search_three_sentence('name1', 'name2')
		self.assertEqual(search_result, [])

	def test_search_related_disease(self):
		search_result = search_related_disease('name1')
		if search_result:
			return True