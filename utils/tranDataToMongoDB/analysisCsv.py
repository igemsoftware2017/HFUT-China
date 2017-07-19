# -*- coding:utf-8 -*-

"""

@author: ZhangAYongqin
"""


import csv,json
csvfile = open('results.csv', 'rb')
csvReader = csv.DictReader(csvfile,fieldnames=['main_gene','related_gene','relations'])
csv_array = list()
name_array = list()
result_array = list()
for row in csvReader:
    csv_array.append(row)
for x in csv_array:
    if x['main_gene'] not in name_array:
        name_array.append(x['main_gene'])

for x in name_array:
    result_item = dict()
    result_item['main_gene'] = x
    result_item['related_gene'] = list()
    for p in csv_array:
        if p['main_gene'] == x:
            result_item['related_gene'].append({'name':p['related_gene'],'relations':p['relations']})
    result_array.append(result_item)

with open('analy_result.json', 'wb') as jsonfile:
        jsonfile.write(json.dumps(result_array))