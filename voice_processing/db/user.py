from peewee import BlobField, CharField

from db.basemodel import BaseModel


class User(BaseModel):
    username = CharField(unique=True)
    password = CharField()
    voice_sample = BlobField()
    verification_sample = BlobField(null=True)
