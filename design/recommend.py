"""
implement recommend for parts

@author: Bowen, Ray, Yu
"""

from projectManage.models import Parts, Teams, Team_Parts
from operator import itemgetter
from .bettwen_markov1 import *
from .before_markov1 import *
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
    predictChains = bettwen_predict(5, 5, part_id_one, part_id_two, loadB())
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
    predictChains = before_predict(5, 5, part_id, loadC())
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
    predictChains = predict(5, 5, part_id, loadA())
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
    tranFile = open(BASE+'/../data/bettwen_matrix_0.json', 'r')
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

def get_chain(num, pos, process):
    if pos == 0:
        return []   # 起点即给出的BioBrick不记录在内
    else:
        chain = get_chain(process[pos][num][2], pos-1, process)     # 得到下标在pos-1前的链
        chain.append(process[pos][num][0])          # 加入当前BioBrick
        return chain


def predict(m, num, s, A):
    """predict the chain after s

    calculate the probability of a m-length chain,
    then return chains.
    CAUTION the number of chains maybe less then num

    args:
        m: the length of predict chain
        num: the number of predict chain
        s: the last element of the current chain
        A: transition matrix
    return:
        some chains save in list
    """
    process = []            # 记录分析过程
    start = [[s, 1, None], ]    # BioBrick 概率 父节点下标（其中概率指的是从给出的BioBrick开始到此处的概率）
    process.append(start)

    for i in range(m):      # 根据预测的长度确定迭代次数
        line = process[-1]  # 获取上一行
        temp_line = {}      # 临时保存下一行的所有结果 {BioBrick: [[BioBrick, 概率， 父节点下标], ]}
        for idx, mem in enumerate(line):
            if mem[0] not in A:     # 判断是否存在该键，即是否有后继BioBrick
                continue
            for k in A[mem[0]].keys():  # 遍历可转移的下一个BioBrick
                if k in temp_line:  # 判断字典是否存在该键，避免插入的键值不存在
                    temp_line[k].append([k, mem[1]*A[mem[0]][k], idx])
                else:
                    temp_line[k] = [[k, mem[1]*A[mem[0]][k], idx], ]
        next_line = []
        for k in temp_line.keys():
            temp_line[k].sort(key=lambda x: x[1], reverse=True)     # 按概率排序
            temp_line[k] = temp_line[k][0:num]  # 根据需要预测的条数确定每层每个不同结尾保留数量，但是这是最大个数
            next_line.extend(temp_line[k])      # 将筛选过的结果保存起来
        process.append(next_line)       # 将该行保存到记录分析过程的数据结构中

    ans = sorted(process[-1], key=lambda b: b[1], reverse=True)     # 按概率排序
    process[-1] = ans

    if len(ans) == 0:
        return None     # Can't predict, because no answer can be find
    else:
        count = min(len(ans), num)    # the number of ans maybe less than num
        chains = []
        for i in range(count):
            chains.append(get_chain(i, len(process)-1, process))
        return chains