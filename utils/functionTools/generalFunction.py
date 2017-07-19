# -*- coding:utf-8 -*-

"""

@author: ZhangAYongqin
"""

def noneIfEmptyString(value):
    if value == "":
        return None
    return value

def noneIfNoKey(dict, key):
    if key in dict:
        value = dict[key]
        if value == "":
            return None
        return value
    return None

class myError(Exception):
    def __init__(self, value):
        self.value = value
    def __str__(self):
        return repr(self.value)