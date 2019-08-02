from pymongo import MongoClient

from settings.settings import logger


class MongoDB(object):
    def __init__(self, mongo_host, mongo_port, db_name, collection):
        self.client = MongoClient(host=mongo_host, port=mongo_port)
        self.col = self.client[db_name][collection]
        self.counts = self.get_id_max() + 1

    def get_id_max(self):
        try:
            counts = self.col.find_one(sort=[("id", -1)])["id"]
        except TypeError as e:
            logger.error(e)
            counts = 0

        return counts

    def insert2mongo(self, datas):
        for idx, v in enumerate(datas):
            v.update({"id": self.counts})
            self.counts += 1
        rep = self.col.insert_many(datas)
        return rep

    def get_datas(self):
        cursor = self.col.find().sort([("updateDate", -1)])

        res = list()
        for i in cursor:
            i.pop("_id")
            i.pop("update_time")
            res.append(i)
            # print(i)

        return res

    def update(self, query, doc):
        return self.col.find_one_and_replace(query, doc)
        # return self.col.update_one(query, {"$set": {value}})

    def delete(self, query):
        return self.col.delete_one(query).acknowledged

    def save(self, doc):
        return self.col.replace_one(filter={"material_name": doc["material_name"]}, replacement=doc)

    def search_one(self, name):
        return self.col.find_one({"material_name": name})


