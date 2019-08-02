from flask_restful import Api
from flask import Flask, request, jsonify
import ptttloggg


from api.urls import DataTable, UploadFile, DataSearch

app = Flask(__name__)
api = Api(app)
api.add_resource(DataTable, "/data_table")
api.add_resource(UploadFile, "/upload")
api.add_resource(DataSearch, "/search")


@app.after_request
def cors(environ):
    environ.headers['Access-Control-Allow-Origin'] = '*'
    environ.headers['Access-Control-Allow-Method'] = '*'
    environ.headers['Access-Control-Allow-Headers'] = 'x-requested-with,content-type'
    return environ

# @app.route("/abc", methods=["POST", "PUT"])
# def test():
#     if request.method == "PUT":
#         print(request.form)
#     return jsonify({"code": 0, "msg": "插入成功！"})


if __name__ == '__main__':
    ptttloggg.initLogConf()
    app.run(debug=True, port=8888)


