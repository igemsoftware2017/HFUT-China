# -*- coding:utf-8 -*-
# markov algorithm


def cal_probability(data_set):
    """calculate transition matrix

    calculate the probability of going from state i to state j in 1 time step

    args:
        data_set: datas use to calculate transition matrix, type is list
    return:
        a directory, record probability in transition matrix
    """
    A = {}
    total = {}
    for data in data_set:
        count = len(data)
        for i in range(count-1):
            A[data[i]] = A.get(data[i], {})
            A[data[i]][data[i+1]] = A[data[i]].get(data[i+1], 0) + 1
            total[data[i]] = total.get(data[i], 0) + 1

    for key, value in A.items():
        for k in value.keys():
            A[key][k] = A[key][k]/total[key]    # 针对版本差异进行修改

    return A


def get_chain(num, pos, process):
    if pos == 0:
        return []   # 起点即给出的BioBrick不记录在内
    else:
        chain = get_chain(process[pos][num][2], pos-1, process)     # 得到下标在pos-1前的链
        chain.append(process[pos][num][0])          # 加入当前BioBrick
        return chain


def bettwen_predict(max_len, num, b1, b2, A):
    """predict the chain between b1 and b2

    CAUTION the number of chains maybe less then num

    args:
        max_len: the max length of predict chain
        num: the number of predict chain
        b1: the begin of the predicted chain
        b2: the end of the predicted chain
        A: transition matrix
    return:
        some chains save in list
    """
    process = []            # 记录分析过程
    start = [[b1, 1, None], ]    # BioBrick 概率 父节点下标（其中概率指的是从给出的BioBrick开始到此处的概率）
    process.append(start)

    ans_pos = []

    for i in range(max_len+1):      # 根据预测的长度确定迭代次数
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
            if k == b2:
                p1 = len(next_line) - len(temp_line[k])
                p2 = len(next_line)
                c = 0
                for j in range(p1, p2):
                    ans_pos.append([i, temp_line[k][c][2], temp_line[k][c][1]])
                    c += 1

        process.append(next_line)       # 将该行保存到记录分析过程的数据结构中

    ans_pos.sort(key=lambda b: b[2], reverse=True)    # 按概率排序
    # ans = sorted(process[-1], key=lambda b: b[1], reverse=True)     # 按概率排序
    # process[-1] = ans

    if len(ans_pos) == 0:
        return None                       # Can't predict, because no answer can be find
    else:
        count = min(len(ans_pos), num)    # the number of ans maybe less than num
        chains = []
        for i in range(count):
            chains.append(get_chain(ans_pos[i][1], ans_pos[i][0], process))
        return chains                     # 由于b1可能直接连着b2，所以返回结果中可能包含空列表
                

if __name__ == "__main__":
    data_set = [['j', 'f', 'a'],
                ['f', 'k', 'j'],
                ['r', 'u', 'v'],
                ['a', 'g', 'f']]
    A = cal_probability(data_set)
    print(A)

    res = predict(3, 5, 'f', 'a', A)  # only two chains can be find
    print(res)
    if res is None:
        print('No answer!')
    else:
        for chain in res:
            for elem in chain:
                print(elem)
            print(chain)
