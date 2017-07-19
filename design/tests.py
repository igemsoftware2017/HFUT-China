import os,django
os.environ["DJANGO_SETTINGS_MODULE"] = "BioDesignVer.settings"
django.setup()
from django.test import TestCase
from design.recommend import getMarkovRecommend, get_chain, predict
from design.getImage import createFolder,geneFileName,getSequenceResultImage
from projectManage.models import *
from accounts.models import User
from design.project import getUserProject,formatProjectList,getChainList,getChain
from django.test.utils import setup_test_environment
from django.test import Client
from django.core.urlresolvers import reverse
from json import *
from importlib import import_module
from django.conf import settings
from django.contrib.sessions.backends.db import SessionStore
from django.contrib.sessions.models import Session
from recommend import getPartNameAndType,getMarkovRecommend,getApriorRecommend,analyseData,getResult,toBeOne,toFrozenset
import time
import datetime
import os.path
import py.test
from design.search_part import getPart,format_fuzzy_result

# Create your tests here.
BASE = os.path.dirname(os.path.abspath(__file__))

class RecommendTestCase(TestCase):
	def setUp(self):
		self.partId = 1
	def test_MarkovRecommend(self):
		self.result = getMarkovRecommend(self.partId)
		self.assertEqual(self.result, [])

class MarkovTestCase(TestCase):
    def test_get_chain(self):
        process = [{'f': [1, None]},
                   {'a': [0.5, 'f'], 'k': [0.5, 'f']},
                   {'j': [0.5, 'k'], 'g': [0.5, 'a']}]
        ans = ['f', 'k', 'j']
        res = get_chain('j', 2, process)
        self.assertEqual(ans, res, None)

    def test_predict(self):
        A = {'a': {'g': 1.0, 'j': 1.0},
             'g': {'f': 1.0},
             'f': {'a': 0.5, 'k': 0.5},
             'k': {'j': 0.5},
             'j': {'f': 1.0},
             'r': {'u': 1.0},
             'u': {'v': 1.0}}
        ss = ('f', 'b')
        anss = ([['a', 'j'], ['a', 'g']], None)
        for s, ans in zip(ss, anss):
            res = predict(2, 2, s, A)
            self.assertEqual(res, ans, None)

class createFolderTestCase(TestCase):
    def setUp(self):
        self.year     = str(time.localtime().tm_year)
        self.month    = str(time.localtime().tm_mon)
        self.day      = str(time.localtime().tm_mday)
        self.predict_result = BASE + '/../downloads/'
        self.predict_result += self.year + '/'
        self.predict_result += self.month + '/'
        self.predict_result += self.day + '/'

    # correct input, but the folder has existed
    def test_repeat_folder(self):
        self.contentType = "image"
        self.result = True
        if os.path.exists(BASE + self.contentType + '/'):
            pass
        else:
            createFolder(self.contentType)
        try:
            createFolder(self.contentType)
        except Exception, e:
            self.result = False
        finally:
            self.assertEqual(self.result,True,"can create same folder twice")
        
    # correct input, and the folder is new
    def test_new_folder(self):
        self.contentType = "image"
        self.result = True
        if not os.path.exists(BASE + self.contentType + '/'):
            try:
                createFolder(self.contentType)
            except Exception, e:
                self.result = False
            finally:
                self.assertEqual(self.result,True,"create new folder correctly")
        else:
            print "the folder has created!!!"

class geneFileNameTestCase(TestCase):
    def setUp(self):
        self.now = datetime.datetime.now()
        self.timeString = str(self.now.year)+'-'+str(self.now.month)+'-'+str(self.now.day)+'-'+str(self.now.hour)+'-'+str(self.now.minute)+'-'+str(self.now.second)

    #file name is correct and surfix is correct
    # for example:predict string is 2015-8-4-11-3-30-test.txt
    def test_normal(self):
        self.fileName = "test"
        self.surfix = "txt"
        self.timeString = self.timeString + '-' + self.fileName
        self.timeString = self.timeString + '.' + self.surfix
        self.assertEqual(geneFileName(self.fileName,self.surfix),self.timeString)

class getUserProjectTestCase(TestCase):
    def setUp(self):
        #initial information into temperory database
        self.user = User()
        self.user.username = "Bob"
        self.user.password = "123"
        self.user.email = "asfja"
        self.user.isConfirmed = True
        self.user.save()
        self.emptyProjectUser = User()
        self.emptyProjectUser.userName = "empty"
        self.emptyProjectUser.password = "123"
        self.emptyProjectUser.email = "1312"
        self.emptyProjectUser.isConfirmed = False
        self.emptyProjectUser.save()

        self.project1 = Project()
        self.project1.project_name = "project1"
        self.project1.creator_id = self.user
        self.project1.save()
        self.project2 = Project()
        self.project2.project_name = "project2"
        self.project2.creator_id = self.user
        self.project2.save()

    def test_normal(self):
        self.assertTrue(getUserProject(self.user)['isSuccessful'])
    def test_empty_project(self):
        self.assertEqual(getUserProject(self.emptyProjectUser)['projects'],[])

class formatProjectListTestCase(TestCase):
    def setUp(self):
        #initial information into temperory database
        self.user = User()
        self.user.userName = "Bob"
        self.user.password = "123"
        self.user.email = "asfja"
        self.user.isConfirmed = True
        self.user.save()

        self.project1 = Project()
        self.project1.project_name = "project1"
        self.project1.creator_id = self.user
        self.project1.save()
        self.project2 = Project()
        self.project2.project_name = "project2"
        self.project2.creator_id = self.user
        self.project2.save()

    def test_list_exist(self):
        self.projectList = Project.objects.filter(creator_id=self.user)
        # construct the predict result
        #print formatProjectList(self.projectList)
        self.predictResult = list()
        self.p1 = {
            'id':1L,
            'name':unicode(self.project1.project_name,"utf-8"),
            'creator':unicode(self.user.userName,"utf-8"),
            'function':None,
            'track':None,
        }
        self.p2 = {
            'id':2L,
            'name':unicode(self.project2.project_name, "utf-8"),
            'creator':unicode(self.user.userName,"utf-8"),
            'function':None,
            'track':None,
        }
        self.predictResult.append(self.p1)
        self.predictResult.append(self.p2)
        self.assertEqual(cmp(formatProjectList(self.projectList),self.predictResult), 0)
        

    def test_null_list(self):
        self.assertEqual(cmp(formatProjectList([]),[]),0)

class getChainListTestCase(TestCase):
    def setUp(self):
        #initial information into temperory database
        self.user = User()
        self.user.username = "Bob"
        self.user.password = "123"
        self.user.email = "email"
        self.user.is_confirmed = True
        self.user.save()

        self.project = Project()
        self.project.project_name = "project"
        self.project.creator_id = self.user
        self.project.save()
        
        self.chain1 = Chain()
        self.chain1.name = "chain1"
        self.chain1.project = self.project
        self.chain1.save()
        self.chain2 = Chain()
        self.chain2.name = "chain2"
        self.chain2.project = self.project
        self.chain2.save()

    def test_id_exist(self):
        self.predictResult = [{
        'id':1,
        'name':'chain1',
        },{
        'id':2,
        'name':'chain2',
        }]
        self.realResult = getChainList(self.project.pk)
        self.assertEqual(cmp(self.realResult,self.predictResult),0)

    def test_id_not_exist(self):
        self.predictResult = []
        self.realResult = getChainList(5)
        self.assertEqual(cmp(self.realResult,self.predictResult),0)
    def test_id_null(self):
        self.predictResult = []
        self.realResult = getChainList(None)
        self.assertEqual(cmp(self.realResult,self.predictResult),0)

class getChainTestCase(TestCase):
    def setUp(self):
        #initial information into temperory database
        self.user = User()
        self.user.username = "Bob"
        self.user.password = "123"
        self.user.email = "email"
        self.user.is_confirmed = True
        self.user.save()

        self.project = Project()
        self.project.project_name = "project"
        self.project.creator_id = self.user
        self.project.save()
        
        self.chain1 = Chain()
        self.chain1.name = "chain1"
        self.chain1.id = 1
        self.chain1.sequence = "1_2_3"
        self.chain1.project = self.project
        self.chain1.save()
        self.chain2 = Chain()
        self.chain2.id = 2
        self.chain2.name = "chain2"
        self.chain2.sequence = ""
        self.chain2.project = self.project
        self.chain2.save()

        self.partObj1 = Parts()
        self.partObj1.part_id = 1
        self.partObj1.part_name = "part1"
        self.partObj1.part_type = "type1"
        self.partObj1.save()
        self.partObj2 = Parts()
        self.partObj2.part_id = 2
        self.partObj2.part_name = "part2"
        self.partObj2.part_type = "type2"
        self.partObj2.save()
        self.partObj3 = Parts()
        self.partObj3.part_id = 3
        self.partObj3.part_name = "part3"
        self.partObj3.part_type = "type3"
        self.partObj3.save()

    # chain id exist, chain contains several parts
    def test_normal_chain(self):
        self.predictResult = [{
        'part_id' : unicode('1',"utf-8"),
        'part_name' : unicode('part1',"utf-8"),
        'part_type' : unicode('type1',"utf-8")
        },{
        'part_id' : unicode('2',"utf-8"),
        'part_name' : unicode('part2',"utf-8"),
        'part_type' : unicode('type2',"utf-8")
        },{
        'part_id' : unicode('3',"utf-8"),
        'part_name' : unicode('part3',"utf-8"),
        'part_type' : unicode('type3',"utf-8")
        }]
        self.realResult = getChain(1)
        print self.realResult
        self.cmpResult = cmp(self.predictResult,self.realResult[1])
        self.assertTrue(self.cmpResult==0 and self.realResult[0])

    # chain id exist, chain's sequence is empty
    def test_empty_chain(self):
        self.predictResult = []
        self.realResult = getChain(2)
        self.cmpResult = cmp(self.predictResult,self.realResult[1])
        self.assertTrue(self.cmpResult==0 and self.realResult[0])
    # chain id doesn't exist
    def test_chainId_not_exist(self):
        self.predictResult = None
        self.realResult = getChain(3)
        self.cmpResult = cmp(self.predictResult,self.realResult[1])
        self.assertTrue((self.cmpResult==0)and(self.realResult[0] == False))

class FooTest(TestCase):
    #preparing to test
    def setUp(self):
        testName = self.shortDescription()
        print testName

    #ending the test
    def tearDown(self):
        print "end"

    #test analyseData from recommend.py
    def test_7_1(self):
        "test analyseData from recommend.py"
        dataList = [1,2,3,4]
        c2 = analyseData(dataList)
        expectResult = [set([1,2]),set([1,3]),set([1,4]),set([2,3]),set([2,4]),set([3,4])]
        self.assertListEqual(c2,expectResult,"nalyseData Error")

    def test_7_2(self):
        "test analyseData from recommend.py"
        dataList = []
        c2 = analyseData(dataList)
        expectResult = []
        self.assertListEqual(c2,expectResult,"nalyseData Error")

    #test toFrozenset from recommend.py
    def test_8_1(self):
        "test toFrozenset from recommend.py"
        simdata = [[['1']],[['2']],[['3']],[['4']],[['5']]]
        result = toFrozenset(simdata)
        expectResult = [[frozenset(['1'])],[frozenset(['2'])],[frozenset(['3'])],[frozenset(['4'])],[frozenset(['5'])]]
        self.assertListEqual(result,expectResult,"toFrozenset Error")

    def test_8_2(self):
        "test toFrozenset from recommend.py"
        simdata = []
        result = toFrozenset(simdata)
        expectResult = []
        self.assertListEqual(result,expectResult,"toFrozenset Error")

    def test_8_3(self):
        "test toFrozenset from recommend.py"
        simdata = [set(['1']),set(['2']),set(['3']),set(['4'])]
        result = toFrozenset(simdata)
        expectResult = [[frozenset(['1'])],[frozenset(['2'])],[frozenset(['3'])],[frozenset(['4'])]]
        self.assertListEqual(result,expectResult,"toFrozenset Error")

    def test_8_4(self):
        "test toFrozenset from recommend.py"
        simdata = [frozenset(['1']),frozenset(['2']),frozenset(['3']),frozenset(['4'])]
        result = toFrozenset(simdata)
        expectResult = [[frozenset(['1'])],[frozenset(['2'])],[frozenset(['3'])],[frozenset(['4'])]]
        self.assertListEqual(result,expectResult,"toFrozenset Error")

    #test getResult from recommend.py
    def test_9_1(self):
        "test getResult from recommend.py"
        c2 = [[['1'],['2'],['3'],['5']],[['1','3'],['3','2'],['2','5'],['3','5']],[['3','2','5']]]
        dataList = ['1']
        result = getResult(dataList,c2,'')
        expectResult = ['3']
        self.assertListEqual(result,expectResult,"getResult Error")

    def test_9_2(self):
        "test getResult from recommend.py"
        c2 = [[['1'],['2'],['3'],['5']],[['1','3'],['3','2'],['2','5'],['3','5']],[['3','2','5']]]
        dataList = []
        result = getResult(dataList,c2,'')
        expectResult = []
        self.assertListEqual(result,expectResult,"getResult Error")

    def test_9_3(self):
        "test getResult from recommend.py"
        c2 = []
        dataList = ['1']
        result = getResult(dataList,c2,'')
        expectResult = []
        self.assertListEqual(result,expectResult,"getResult Error")

    def test_9_4(self):
        "test getResult from recommend.py"
        c2 = []
        dataList = []
        result = getResult(dataList,c2,'')
        expectResult = []
        self.assertListEqual(result,expectResult,"getResult Error")

    #test toBeOne from recommend.py
    def test_10_1(self):
        "test toBeOne from recommend.py"
        data = [frozenset(['1','2']),frozenset(['2','3']),frozenset(['1','2','3','4'])]
        result = toBeOne(data)
        expectResult = ['1','2','3','4']
        self.assertListEqual(result,expectResult,"toBeOne Error")

    def test_10_2(self):
        "test toBeOne from recommend.py"
        data = []
        result = toBeOne(data)
        expectResult = []
        self.assertListEqual(result,expectResult,"toBeOne Error")

    def test_10_3(self):
        "test toBeOne from recommend.py"
        data = [set(['1','2']),set(['2','3']),set(['1','2','3','4'])]
        result = toBeOne(data)
        expectResult = ['1','2','3','4']
        self.assertListEqual(result,expectResult,"toBeOne Error")

    def test_10_4(self):
        "test toBeOne from recommend.py"
        data = [['1','2'],['2','3'],['1','2','3','4']]
        result = toBeOne(data)
        expectResult = ['1','2','3','4']
        self.assertListEqual(result,expectResult,"toBeOne Error")      

class searchPartTestCase(TestCase):
    def setUp(self):
        self.partObj1 = Parts()
        self.partObj1.part_id = 1
        self.partObj1.part_name = "part1"
        self.partObj1.part_type = "type1"
        self.partObj1.save()
        self.partObj2 = Parts()
        self.partObj2.part_id = 2
        self.partObj2.part_name = "part2"
        self.partObj2.part_type = "type2"
        self.partObj2.save()
        self.partObj3 = Parts()
        self.partObj3.part_id = 3
        self.partObj3.part_name = "part3"
        self.partObj3.part_type = "type3"
        self.partObj3.save()

    def test_search_part_none(self):
        result = getPart('none')
        self.assertEqual(result['successful'], False)

    def test_search_part_normal(self):
        result = getPart('part1')
        self.assertEqual(result['successful'], True)

    def test_3_1(self):
        format_fuzzy_result([])