# -*- coding:utf-8 -*-

"""

@author: ZhangAYongqin
"""


import csv,json
with open('results.csv', 'rb') as csvfile:
    gene_set = set()
    csvReader = csv.DictReader(csvfile,fieldnames=['main_gene','related_gene','relations'])
    i = 1
    for row in csvReader:
        gene_set.add(row['main_gene'])
    gene_name = []
    for name in gene_set:
        gene_name.append(name)
    with open('gene_name.json', 'wb') as jsonfile:
        jsonfile.write(json.dumps(gene_name))
