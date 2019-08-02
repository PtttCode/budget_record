import pandas as pd
import re
import time
import datetime

from settings.settings import COLUMNS, logger


pattern = re.compile(r"[^\d+\.\,]")


def texts_deal(string):
    e_pun = u',.!?[]()<>"\''
    c_pun = u'，。！？【】（）《》“‘'
    table = {ord(f): ord(t) for f, t in zip(c_pun, e_pun)}
    return string.translate(table)


def excel_to_mongo(mongo, filename):
    update_list = []
    insert_list = []
    wrong_list = []
    df = pd.read_excel(filename)
    data = df[COLUMNS].fillna("")
    data = data.values.tolist()

    for index, i in enumerate(data):
        dic = {COLUMNS[idx]: j for idx, j in enumerate(i)}
        dic["period"] = dic["period"].strftime("%Y/%m/%d") if type(dic["period"]) is not str else dic["period"]
        dic["prices"] = [round(float(re.sub(pattern, "", num)), 2) for num in texts_deal(str(dic["prices"])).split(",")]
        dic["period"] = texts_deal(dic["period"]).split(",")
        dic["update_time"] = datetime.datetime.fromtimestamp(time.time())

        ret = mongo.search_one(dic["material_name"])
        if ret and if_repeat(ret["period"], dic["period"]) is True:
            print(ret["period"], dic["period"], if_repeat(ret["period"], dic["period"]), dic["material_name"])
            prices_period = zip(ret["prices"] + dic["prices"], ret["period"] + dic["period"])
            sorted(prices_period, key=lambda x: x[1])
            dic["prices"], dic["period"] = [], []
            for value in prices_period:
                dic["prices"].append(value[0])
                dic["period"].append(value[1])
            # print(ret["period"], dic["period"], if_repeat(ret["period"], dic["period"]))
            for k, v in dic.items():
                ret[k] = dic[k] if dic[k] else ret[k]
            logger.info(dic)
            logger.info(ret)
            mongo.save(ret)
        elif ret and if_repeat(ret["period"], dic["period"]):
            wrong_list.append(dic["material_name"])
        else:
            logger.info(dic)
            insert_list.append(dic)
    if insert_list:
        ret = mongo.insert2mongo(insert_list).acknowledged
    else:
        ret = 2
    # wrong_list += [insert_list[idx]["material_name"] for idx, _ in enumerate(ret)]

    return ret, wrong_list


def if_repeat(old_period, new_period):
    if list(set(new_period)) == list(set(new_period) - set(old_period)):
        return True
    return False


if __name__ == '__main__':
    filename = "../template.xlsx"
    # excel_to_mongo(filename)
    import datetime
    print(str(datetime.datetime.now()))
    # print(re.sub(pattern, "", "1,23.00"))
