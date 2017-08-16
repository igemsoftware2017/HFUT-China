# Markov算法的前向推荐版本

def cal_forward_prob(data_set):
    A = {}
    total = {}
    for data in data_set:
        count = len(data)
        for i in range(count-1, 0, -1):
            A[data[i]] = A.get(data[i], {})
            A[data[i]][data[i-1]] = A[data[i]].get(data[i-1], 0) + 1
            total[data[i]] = total.get(data[i], 0) + 1

    for key, value in A.items():
        for k in value.keys():
            A[key][k] = A[key][k] / total[key]

    return A


def get_chain(num, pos, process):
    if pos == 0:
        return []   # 起点即给出的BioBrick不记录在内
    else:
        chain = get_chain(process[pos][num][2], pos-1, process)     # 得到下标在pos-1前的链
        chain.insert(0, process[pos][num][0])          # 加入当前BioBrick到最前面
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
