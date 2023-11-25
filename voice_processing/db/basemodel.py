import peewee
from peewee import Model

from db.postgres import pg_db


class BaseModel(Model):
    class Meta:
        database = pg_db


models = peewee.Model.__subclasses__()
