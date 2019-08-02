import datetime
import time
from flask import Flask, request, jsonify
from flask_restful import reqparse, abort, Resource
from dateutil import parser as isodate


from utils.es import ES
from utils.mongo import MongoDB
from settings.settings import logger, ES_PORT, ES_HOST, MONGO_DB, MONGO_PORT, MONGO_HOST, COLLECTION
from settings.settings import ES_INDEX, ES_DOC_TYPE
from utils.utils import texts_deal, excel_to_mongo

parser = reqparse.RequestParser()
es = ES(ES_HOST, ES_PORT)
mongo = MongoDB(MONGO_HOST, MONGO_PORT, MONGO_DB, COLLECTION)


class DataTable(Resource):
    def get(self):
        body = request.args
        logger.info(body)
        limit = int(body.get("limit", 10))
        page = int(body.get("page", 1))
        # limit = request.args.get("limit", 10)
        # page = request.args.get("page", 1)
        logger.info(limit)
        logger.info(page)
        all_data = mongo.get_datas()
        begin_pos = (page - 1) * limit
        data = all_data[begin_pos:begin_pos + limit]
        # logger.info(type(data[0]["update_time"]))

        return {"code": 0, "data": data, "count": len(all_data)}

    def post(self):
        body = request.json
        logger.info(body)
        name = body["name"]
        data = mongo.search_one(name)
        res = []

        if not data:
            return {"code": 2, "msg": "获取数据失败！"}

        for idx, v in enumerate(data["prices"]):
            dic = dict()
            dic["value"] = v
            dic["date"] = data["period"][idx]
            res.append(dic)
        logger.info(res)

        return {"code": 0, "data": res, "name": data["material_name"]}

    def put(self):
        body = request.json
        update = body.get("update", False)
        body["prices"] = [round(float(i)) for i in texts_deal(body["prices"]).split(",")]
        body["period"] = texts_deal(body["period"]).split(",")
        ret = mongo.search_one(body["material_name"])
        logger.info(ret)
        if not update and ret:
            return {"code": 1, "msg": "数据已存在，确认在原基础上修改吗？"}
        elif ret:
            prices_period = zip(ret["prices"] + body["prices"], ret["period"] + body["period"])
            sorted(prices_period, key=lambda x: x[1])
            for i in prices_period:
                body["prices"].append(i[0])
                body["period"].append(i[1])

            body["id"] = ret["id"]
            body["_id"] = ret["_id"]

        # update_time = isodate.parser(str(datetime.datetime.now()))
        update_time = datetime.datetime.fromtimestamp(time.time())
        print(update_time)
        body["update_time"] = update_time
        logger.info(body)

        res = mongo.insert2mongo([body]) if not ret else mongo.save(body)
        logger.info(res)
        # rep = es.insert2es(index=ES_INDEX, doc_type=ES_DOC_TYPE, data=data)

        if not res:
            return {"code": 2, "msg": "插入失败！"}

        return {"code": 0, "msg": "插入成功！"}

    def patch(self):
        body = request.json
        print(body)
        query = body.get("query")
        update_value = body.get("update_value")

        res = mongo.update(query, update_value)
        if not res:
            return {"code": 1, "msg": "更新失败！"}

        return {"code": 0, "msg": "更新成功！"}

    def delete(self):
        body = request.json
        logger.info(body)
        res = [mongo.delete({"id": i["id"]}) for i in body]
        res = all(res)
        logger.info(res)

        if not res:
            return {"code": 1, "msg": "删除失败！"}

        return {"code": 0, "msg": "删除成功！"}


class DataSearch(Resource):

    def get(self):
        body = request.args
        logger.info(body)
        limit = int(body.get("limit", 10))
        page = int(body.get("page", 1))
        question = body.get("question", None)
        # limit = request.args.get("limit", 10)
        # page = request.args.get("page", 1)
        logger.info(limit)
        logger.info(page)

        all_data = mongo.get_datas()
        join_data = ["".join(["".join([str(k) for k in j]) if isinstance(j, list) else str(j) for j in list(i.values())]) for i in all_data]
        results = [all_data[idx] for idx, value in enumerate(join_data) if question in value]
        # logger.info(res[0])
        logger.info(len(results))

        begin_pos = (page - 1) * limit
        res = results[begin_pos:begin_pos + limit]
        # logger.info(type(data[0]["update_time"]))

        return {"code": 0, "data": res, "count": len(results)}


class UploadFile(Resource):

    def post(self):
        files = request.files.getlist("file")
        wrong_list = []
        ret = 0
        # import pdb
        # pdb.set_trace()
        for f in files:
            if f:
                save_path = "data/upload/{}".format(f.filename)
                f.save(save_path)
                ret, wrong_list = excel_to_mongo(mongo, save_path)

        logger.info(ret)
        if ret is True and not wrong_list:
            return {"code": 0, "msg": "上传成功!", "wrong_list": wrong_list}
        elif ret != 2 and wrong_list:
            return {"code": 1, "msg": "上传失败!", "wrong_list": wrong_list}
        elif ret == 2:
            return {"code": 1, "msg": "警告！上传数据全部重复！", "wrong_list": []}



# @app.route("/table_show", methods=["GET"])
# def show():
#     limit = request.args.get("limit", 10)
#     page = request.args.get("page", 1)
#     print(limit, page)
#     data = mongo.get_datas()
#     begin_pos = (page-1)*limit
#     data = data[begin_pos:begin_pos+limit]
#     return jsonify({"code": 0, "data": data})


