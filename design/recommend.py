"""
implement recommend for parts

@author: Bowen, Ray, Yu
"""

from projectManage.models import Parts, Teams, Team_Parts
from operator import itemgetter
from . import between_markov
from . import forward_markov
from . import backward_markov
import json
import os.path
import pickle

from design.search_part import get_func_parts

BASE = os.path.dirname(os.path.abspath(__file__))

def getApriorRecommend(chainStr, funcStr=None):
    """
    get recommendations with aprior algorithm

    @param chainStr: part chain
    @type chainStr: str
    @return : recommendations
    @rytpe: dict
    """
    dataList = chainStr.split('_')
    #dataList = dataList[len(dataList)-2:len(dataList)]
    fList = list()
    with open(BASE+'/../freq.txt', 'rb') as f:
        fList = pickle.load(f)
    strResult = getResult(dataList, fList, funcStr)
    recommend_list = list()
    for partId in strResult:
        partObj = Parts.objects.filter(part_id=int(partId)).first()
        partInfo = {
            'part_id': partObj.part_id,
            'part_name': partObj.part_name,
            'part_type': partObj.part_type,
        }
        recommend_list.append(partInfo)
    return recommend_list

def analyseData(dataList,dataLength = 2):
    tempData = []
    tempData1 = []
    tempData2 = []
    for item in dataList:
            tempData.append(item)
            tempData1.append(tempData)
            tempData = []
    tempData1 = map(set,tempData1)
    tempData2 = tempData1
    for i in range(dataLength - 1):
        for item in tempData1:
            for j in range(len(tempData2)):
                if (item.union(tempData2[j]) not in tempData):
                    tempData.append(item.union(tempData2[j]))
        tempData2 = tempData
        tempData = []
    flag = False

    for item in tempData2:
        if len(item) < dataLength:
            tempData2.remove(item)
            flag = True
    while (flag == True):
        flag = False
        for item in tempData2:
            if len(item) < dataLength:
                tempData2.remove(item)
                flag = True
    return tempData2

def getResult(currentList,dataList, funcStr):#currentList ,dataList pin fan xiang ji
    dataList = toFrozenset(dataList)
    dataLength = len(currentList)
    max_length = 4
    resultList = []
    if dataLength == 0:
        return resultList
    if dataLength > max_length:
        currentList = currentList[dataLength-4:]
        dataLength = 4
    while dataLength > 0:
        for item in dataList:
            for item1 in item:
                if frozenset(currentList).issubset(item1):
                    if (item1^frozenset(currentList)) not in resultList:
                        resultList.append(item1^frozenset(currentList))
        if len(resultList) >= 5:
            break
        currentList = currentList[1:]
        dataLength = dataLength - 1
    resultList = toBeOne(resultList)
    result_part_count = len(resultList)
    dictionary_result = {}
    for each_part in range(result_part_count):
        dictionary_result[resultList[each_part]] = 100 - (100 * each_part) / result_part_count
    if funcStr != None and funcStr != '':
        adjuct_to_func(funcStr, dictionary_result)
    final_result = list()
    for part_pair in sorted(dictionary_result.items(), key=itemgetter(1), reverse=True):
        final_result.append(part_pair[0])
    return final_result

def adjuct_to_func(funcStr, dictionary_result):
    if funcStr.startswith('_'):
        funcStr = funcStr[1:]
    if funcStr.endswith('_'):
        funcStr = funcStr[:-1]
    func_part_list = get_func_parts(funcStr.split('_'))
    for key in dictionary_result:
        if long(key) in func_part_list:
            dictionary_result[key] += 10


def toBeOne(data):#delete chong fu xiang
    result = []
    for item in data:
        t = list(item)
        for item2 in t:
            if item2 not in result:
                result.append(item2)
    return result

def toFrozenset(data):
    result = []
    for item in data:
        temp = []
        for i in item:
            temp.append(frozenset(i))
        result.append(temp)
    return result

def getBetweenMarkovRecommend(part_id_one, part_id_two):
    """
    get recommendations with Markov algorithm

    @param part_id: part id
    @type part_id: str
    @return : recommendations
    @rytpe: dict
    """
    chains = list()
    predictChains = between_markov.predict(5, 5, part_id_one, part_id_two, loadB())
    if not predictChains:
        return chains
    for predictChain in predictChains:
        chain = list()
        for part in predictChain:
            infos = getPartNameAndType(part)
            if not infos[0]:
                break
            item = {
                'part_id':part,
                'part_name': infos[0],
                'part_type' : infos[1]
            }
            chain.append(item)
        chains.append(chain)
    recommend_list = chains
    return recommend_list

def getBeforeMarkovRecommend(part_id):
    """
    get recommendations with Markov algorithm

    @param part_id: part id
    @type part_id: str
    @return : recommendations
    @rytpe: dict
    """
    chains = list()
    predictChains = forward_markov.predict(5, 5, part_id, loadC())
    if not predictChains:
        return chains
    for predictChain in predictChains:
        chain = list()
        for part in predictChain:
            infos = getPartNameAndType(part)
            if not infos[0]:
                break
            item = {
                'part_id':part,
                'part_name': infos[0],
                'part_type' : infos[1]
            }
            chain.append(item)
        chains.append(chain)
    recommend_list = chains
    return recommend_list

def getMarkovRecommend(part_id):
    """
    get recommendations with Markov algorithm

    @param part_id: part id
    @type part_id: str
    @return : recommendations
    @rytpe: dict
    """
    chains = list()
    predictChains = backward_markov.predict(5, 5, part_id, loadA())
    if not predictChains:
        return chains
    for predictChain in predictChains:
        chain = list()
        for part in predictChain:
            infos = getPartNameAndType(part)
            if not infos[0]:
                break
            item = {
                'part_id':part,
                'part_name': infos[0],
                'part_type' : infos[1]
            }
            chain.append(item)
        chains.append(chain)
    recommend_list = chains
    return recommend_list

def loadA():
    tranFile = open(BASE+'/../data/back_matrix_0.json', 'r')
    A = json.loads(tranFile.read())
    return A

def loadB():
    tranFile = open(BASE+'/../data/between_matrix_0.json', 'r')
    B = json.loads(tranFile.read())
    return B

def loadC():
    tranFile = open(BASE+'/../data/before_matrix_0.json', 'r')
    C = json.loads(tranFile.read())
    return C

def getPartNameAndType(part_id):
    try:
        partObj = Parts.objects.filter(part_id=int(part_id)).first()
        return partObj.part_name, partObj.part_type
    except:
        return None, None
