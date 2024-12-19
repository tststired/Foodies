from enum import unique
from flask_sqlalchemy import SQLAlchemy
from flask import *
from datetime import *
import json
from sqlalchemy import ForeignKey, LargeBinary, null
import sqlalchemy
from backend import db


class test(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)


class User(db.Model):

    uid = db.Column(db.Integer, index=True, primary_key=True, autoincrement=True)
    #list of string for images b64
    profile_images = db.Column(db.Text)
    username = db.Column(db.String(64))
    password = db.Column(db.String(64))
    email = db.Column(db.String(64), index=True)
    first_name = db.Column(db.String(64))
    last_name = db.Column(db.String(64))
    sessionID = db.Column(db.String(64))
    cookie = db.Column(db.String(64))
    points = db.Column(db.Integer)
  
    
class Recipe(db.Model):
    
    rid = db.Column(db.Integer, index=True, primary_key=True, autoincrement=True)
    uid = db.Column(db.Integer, ForeignKey('user.uid'), index = True)    
    #list of string for images b64
    recipe_images = db.Column(db.TEXT)
    thumbnail = db.Column(db.TEXT)
    #preperation time 
    time = db.Column(db.TEXT)
    ingredients = db.Column(db.TEXT)
    method = db.Column(db.TEXT)
    title = db.Column(db.String(64), index = True)
    time_created = db.Column(db.DateTime(timezone=True), server_default=sqlalchemy.func.now())
    time_updated = db.Column(db.DateTime(timezone=True), onupdate=sqlalchemy.func.now())
    points = db.Column(db.Integer)    
   
      
class Comment(db.Model):
    
    cid = db.Column(db.Integer, index=True, primary_key=True, autoincrement=True) 
    #can be null, if null means directly to recipe 
    parent = db.Column(db.Integer, ForeignKey('comment.cid'), index = True)
    rid = db.Column(db.String(64), ForeignKey('recipe.rid'))   
    uid = db.Column(db.Integer, ForeignKey('user.uid'), index = True)    
    #list of string for images b64
    comment_images = db.Column(db.Text)
    stars = db.Column(db.Integer)
    comment = db.Column(db.Text)
    time_created = db.Column(db.DateTime(timezone=True), server_default=sqlalchemy.func.now())
    time_updated = db.Column(db.DateTime(timezone=True), onupdate=sqlalchemy.func.now())
    upvotes = db.Column(db.Integer)

    
class Tag(db.Model):
    
    tid = db.Column(db.Integer, index=True, primary_key=True, autoincrement=True)
    tag = db.Column(db.String(64))
    rid = db.Column(db.Integer, ForeignKey('recipe.rid'), index = True)


class Like(db.Model):
    
    lid = db.Column(db.Integer, index=True, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(64), ForeignKey('user.uid'), index = True)
    rid = db.Column(db.String(64), ForeignKey('recipe.rid'))
    
    
class Sub(db.Model):
    
    sid = db.Column(db.Integer, index=True, primary_key=True, autoincrement=True)
    explorer = db.Column(db.Integer, ForeignKey('user.uid'), index = True)
    contributor = db.Column(db.Integer, ForeignKey('user.uid'), index = True)
