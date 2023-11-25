from peewee import BlobField, CharField

from db.basemodel import BaseModel


class User(BaseModel):
    username = CharField()
    password = CharField()
    voice_sample = BlobField()
