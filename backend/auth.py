import hashlib
import datetime
import time
import jwt
from flask import request, make_response, jsonify, abort
from backend import db
from backend.database import Comment, Recipe, User, Sub

SECRET_KEY = "capstore-project-3900"
session = {}

def add_to_session(id, token):
    session[id] = token

def get_id_from_token(token):
    info = jwt.decode(token, SECRET_KEY, algorithms='HS256')
    return info["id"]

def make_token(id, exp):
    token = jwt.encode(
        {'id': id, 'exp': exp}, key=SECRET_KEY, algorithm='HS256')
    token = token.decode('utf-8')
    return token

def is_already_login(id):
    return id in session and not is_token_expire(session[id])

def is_token_expire(token):
    timestamp = jwt.decode(token, SECRET_KEY, algorithms='HS256')["exp"]
    time_obj = datetime.datetime.utcfromtimestamp(timestamp)
    return datetime.datetime.utcnow() < time_obj

def is_token_exists(token):
    return get_id_from_token(token) in session


def auth_register(email, password, username):
    #return {'u_id':uid, 'token':token}
    user_e = User.query.filter_by(email=email).first()
    user_n = User.query.filter_by(username=username).first()
    if user_e is not None:
        abort(400, 'email exists')  
    elif user_n is not None:
        abort(400, 'username exists')
    else:
        user = User()
        user.email = email
        user.username = username
        user.password = password
        db.session.add(user)
        db.session.commit()
        user_r = User.query.filter_by(email=email, password=password).first()
        exp = datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
        token = make_token(user_r.uid, exp)
        add_to_session(user_r.uid, token)
        return {
            "u_id":  user_r.uid,
            "token":  token,
            "message": "user created successfully",
            "code": 200
            }

def auth_login(email, password):
    #return {'u_id':uid, 'token':token}
    try:
        user = User.query.filter_by(email=email, password=password).first()
        if not user:
            abort(400, 'Username or password incorrect')
        id = user.uid
        if is_already_login(id):
            abort(400, 'already login')  
        else:
            exp = datetime.datetime.utcnow() + datetime.timedelta(minutes=120)
            token = make_token(id, exp)
            add_to_session(id, token)
            return {
                "u_id": user.uid,
                "token": token,
                "message": "user login successfully",
                "code": 200
            }
            
    except:
        raise

def auth_logout(token):
    #return boolean to indicate logout is success or not
    id = -1
    try:
        id = get_id_from_token(token)
    except:
        return True
    if id in session:
        del session[id]
    return True

def auth_details(token, id):
    try:
        user = User.query.filter_by(uid=id).first()
        if user is None:
            abort(400, 'no such user')
        recipes = Recipe.query.filter_by(uid=id).all()
        recipe_list = []
        for i in recipes:
            recipe_list.append(i.rid)

        reviews = Comment.query.filter_by(uid=id).all()
        review_list = []
        for i in reviews:
            review_list.append(i.rid)

        subscribing = Sub.query.filter_by(explorer=id).all()
        subscribing_l = []
        for i in subscribing:
            subscribing_l.append(i.contributor)

        subscribers = Sub.query.filter_by(contributor=id).all()
        subscribers_l = []
        for i in subscribers:
            subscribers_l.append(i.explorer)
        return {
            "username": user.username,
            "email": user.email,
            "u_id": user.uid,
            "password": user.password,
            "profile_pic": user.profile_images,
            "subscribers": len(subscribers_l),
            "subscribing": len(subscribing_l),
            "recipes": len(recipe_list),
            "reviews": len(review_list),
        }
        
    except:
        raise

def auth_update(token, password, username, email, image):
    id = get_id_from_token(token)
    user = User.query.filter_by(uid=id).first()
    if not user or token == '':
        abort(400, 'no such user')
    dup_user = User.query.filter_by(username=username).first()
    if dup_user is not None and dup_user != user:
        abort(400, 'Cannot change to an occupied username')
    dup_user = User.query.filter_by(email=email).first()
    if dup_user is not None and dup_user != user:
        abort(400, 'Cannot change to an occupied email')
    if username!='':
        user.username = username
    if username!='':
        user.password = password
    if email!='':
        user.email = email
    if image==None: 
        user.profile_images = ""
    else:
        user.profile_images=image
    db.session.commit()
