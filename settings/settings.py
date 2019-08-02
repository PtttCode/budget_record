import os
from settings.logger import Logger

MONGO_HOST = os.environ.get("MONGO_HOST", "localhost")
MONGO_PORT = os.environ.get("MONGO_PORT", 27017)
MONGO_DB = os.environ.get("MONGO_DB", "budget_data")
COLLECTION = os.environ.get("COLLECTION", "materials_inf")

ES_HOST = os.environ.get("ES_HOST", "localhost")
ES_PORT = os.environ.get("ES_PORT", 9200)
ES_INDEX = os.environ.get("ES_INDEX", "budget_data")
ES_DOC_TYPE = os.environ.get("ES_DOC_TYPE", "materials")

COLUMNS = os.environ.get("COLUMNS", ["material_name", "prices", "period", "unit", "type", "specs",
                                     "areas", "project", "brand", "remarks"])

logger = Logger()

