# -*- coding:utf-8 -*-
import json

def getGeneList():
    readFile = open('all_gene.json', 'r')
    for n in readFile:
        js = json.loads(n)
    geneNameList = []
    while js:
        gene = js.pop(0)
        geneNameList.append(gene['gene_name'])
    readFile.close()
    return geneNameList

def selectGene(gene_list):
    selectFile = open('disease.json', 'r')
    for f in selectFile:
        select = json.loads(f)
    selectList = []
    for s in select:
        if s['gene'] in gene_list:
            selectList.append(s)
    return selectList

if __name__ == '__main__':
    resultFile = open('resultDisease.json', 'a')
    geneList = getGeneList()
    selectList = selectGene(geneList)
    resultFile.write(json.dumps(selectList))