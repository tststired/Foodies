import math
import sys
from flask import Flask, request
from flask import jsonify, abort
from backend import app, db
from backend.auth import auth_login, auth_logout, auth_register, auth_details, auth_update, get_id_from_token
from backend.database import Comment, Like, Recipe, User, Tag, Sub
import json
from backend.comment import tree




@app.route('/check', methods=['GET'])
def check():
    # check if app is working for debug    
    
    return jsonify({'message': 'Server is up', 'statusCode': 200, 'status' : 'success'})
 

@app.route("/auth/signup", methods=['GET','POST'])
def register():
    # signup a new user
    #
    # parameter: {email: str, password: str, name: str}
    # return: {token: str, uid: int}
    
    parameter = request.get_json()
    response = auth_register(parameter['email'], parameter['password'], parameter['username'])
    
    return jsonify(response)
 
@app.route("/auth/login", methods=['GET','POST'])
def login():
    # login a user
    #
    # parameter: {email: str, password: str}
    # return: {token: str, uid: int}
    
    parameter = request.get_json()
    response = auth_login(parameter['email'], parameter['password'])
    
    return jsonify(response)

@app.route("/auth/logout", methods=['POST'])
def logout():
    # logout a user
    #
    # parameter: {token: str}
    # return: {is_success: bool}
    
    parameter = request.get_json()
    success = auth_logout(parameter['token'])
    
    if success: return {'success': True}
    return {'success': False}

@app.route("/profile/detail", methods=['GET'])
def detail():
    # if u_id is null, return the details of token owner
    # display profile details of a registered user
    #
    # parameter: {token:str, u_id:str}
    # return {profile_images: str,
    #           username: str,
    #           email: str,
    #           u_id: int,
    #           subscribers: int,
    #           subscribing: int,
    #           recipes: int,
    #           reviews: int}
    
    parameter1 = request.args.get('token')
    parameter2 = request.args.get('u_id')
    response = auth_details(parameter1, parameter2) 
    
    return jsonify(response)


@app.route("/profile/edit_detail", methods=['POST'])
def edit_detail():
    # if u_id is null, return the details of token owner
    #
    # parameter: {token: token,
    #           username: str,
    #           email: email}
    
    parameter = request.get_json()
    auth_update(parameter['token'], parameter['password'], parameter['username'], parameter['email'], parameter['image'])
    
    return jsonify()


@app.route("/profile/subscribe", methods=['POST'])
def subscribe():
    # an explorer subscribes a contributer
    #
    # parameter: {token:str, 
    #           u_id:str} 
    
    e_id = get_id_from_token(request.get_json()["token"])
    c_id = request.get_json()["user_id"]
    relation = Sub.query.filter_by(explorer=e_id, contributor=c_id).first()
    
    if relation is not None:
        abort(400, 'already subscribed')
        
    relation = Sub()
    relation.explorer = e_id
    relation.contributor = c_id
    db.session.add(relation)
    db.session.commit()
    
    return jsonify()


@app.route("/profile/is_subscribed", methods=['POST'])


def is_subscribed():
    # check if given token user subscribed to user with uid
    # 
    # parameter: {token:str, 
    #           u_id:str}
    
    token_id = get_id_from_token(request.get_json()["token"])
    id = request.get_json()["user_id"]
    relation = Sub.query.filter_by(explorer=token_id, contributor=id).first()
    
    if relation is not None:
        return jsonify(True)
    else:
        return jsonify(False)

@app.route("/profile/unsubscribe", methods=['POST'])
def unsubscribe():
    # check if user is subscribed if they are, unsubscribe
    #
    # parameter: {token:str, 
    #           u_id:str}
    
    e_id = get_id_from_token(request.get_json()["token"])
    c_id = request.get_json()["user_id"]
    relation = Sub.query.filter_by(explorer=e_id, contributor=c_id).first()
    db.session.delete(relation)
    db.session.commit()
    
    return jsonify()

@app.route("/recipe/get_recipe", methods= ['GET'])

def get_recipe():
    # retrieve a recipe given a token and rid
    #
    # parameter: {token: str,
    #           recipe_id: str}
    # return:    {thubmnail: str,
    #           recipe_name: str,
    #           user_id: int,
    #           likes: int,
    #           comment: [{uid:str, 
    #                       username: str, 
    #                       profile_images: str,                                 
    #                       comment:str,
    #                       comment_id:str,
    #                       upvotes:int,
    #                       time_updated: str}]
    #           ingredients: [{amount: int,
    #                       unit: str,
    #                       ingredient: str}],
    #           prep_time: int,
    #           method: str,
    #           meal_type: str,
    #           recipe_pic: pic,
    #           recipe_vid: vid,}

    r = Recipe.query.filter_by(rid=request.args.get("recipe_id")).first()
    tags = Tag.query.filter_by(rid=request.args.get("recipe_id")).all()
    user = User.query.filter_by(uid=r.uid).first()
    meal_type = ""
    tags_l = []
    for t in tags:
        tags_l.append(t.tag)

    for tag in tags_l:
        if ((str(tag) == "breakfast") | (str(tag) == "lunch") | (str(tag) == "dinner") | (str(tag) == "dessert")) :
            meal_type = str(tag)
        
    return jsonify({
        "thumbnail": r.thumbnail,
        "recipe_name": r.title,
        "username": user.username,
        "profile_pic": user.profile_images,
        "user_id": r.uid,
        "stars": starcounter(),
        "likes": r.points,
        "time_created": r.time_created,
        "comments": tree(request.args.get("recipe_id")),
        "ingredients": json.loads(r.ingredients.replace("'", "\"")),
        "prep_time": r.time,
        "method": r.method,
        "meal_type" : meal_type,
        "recipe_pic": json.loads(r.recipe_images.replace("'","\"")),
        "tags": tags_l
        })
    
def starcounter():
    r = Recipe.query.filter_by(rid=request.args.get("recipe_id")).first()
    c = Comment.query.filter_by(rid=r.rid).filter_by(parent=None).all()
    parents = []   
    for i in c: 
        parents.append(i.stars)
        
    
    
    if len(parents)==0: return 0
    return {"stars": math.floor(int(sum(parents)/len(parents))), "volume":len(parents)}
    
        
    
    
    
@app.route("/recipe/add_recipe", methods = ['POST'])
def add_recipe():
    # add a recipe to the database
    # pictures are optional but text parameters are required
    #
    # parameter: {token: token
    #            thumbnail: pic,
    #            recipe_name: str,
    #            ingredients: [{amount: int,
    #                           unit: str,
    #                           ingredient: str}],
    #            prep_time: int,
    #            method: str,
    #            meal_type: str,
    #            recipe_pic: pic,
    #            }
    # return {}
                            
    id = get_id_from_token(request.get_json()["token"])
    if id is None: 
        abort(400, 'inv token')
    else: 
        r = Recipe( 
        uid = id,
        recipe_images = json.dumps(request.get_json()["recipe_pic"]),
        thumbnail = str(request.get_json()["thumbnail"]),
        time = str(request.get_json()["prep_time"]),
        ingredients = str(request.get_json()["ingredients"]),
        title = str(request.get_json()["recipe_name"]), 
        method = str(request.get_json()["method"]),
        points = str(0))
        
        # force flush here to retrieve the rid from database
        db.session.add(r)
        db.session.commit()
        db.session.flush()
        db.session.refresh(r)        
        
        # split tags here to allow for better matching
        # wagyu beef & american beef would be split into 
        # [wagyu, beef] and [american, beef]
        # allowing for searches of beef to return both results
        
        json1 = request.get_json()["ingredients"]
        for i in json1:
            j = i.get("ingredient").split(" ")
            for k in j:
                db.session.add(Tag(rid=r.rid, tag=k))
        db.session.add(Tag(rid=r.rid, tag=str(request.get_json()["meal_type"])))
        db.session.commit()
        
    return jsonify()

@app.route("/recipe/likes", methods=['POST']) 
def recipe_like():
    # like the recipe
    #
    # parameter: {token: str,
    #           recipe_id: str}
    
    rid = request.get_json()["recipe_id"]
    r = Recipe.query.filter_by(rid=rid).first()
    r.points = r.points + 1
    id = get_id_from_token(request.get_json()["token"])
    
    db.session.add(Like(uid=id, rid=rid))
    db.session.commit()
    
    return jsonify()

@app.route("/recipe/unlikes", methods=['POST']) 
def recipe_unlike():
    # unlike the recipe
    #
    # parameter: {token: str,
    #           recipe_id: str}
    
    rid = request.get_json()["recipe_id"]
    r = Recipe.query.filter_by(rid=rid).first()
    r.points = r.points - 1
    id = get_id_from_token(request.get_json()["token"])
    Like.query.filter_by(uid=id, rid=rid).delete()
    
    db.session.commit()
    
    return jsonify()

@app.route("/recipe/is_liked", methods=['GET']) 
def recipe_is_liked():
    # check if the recipe is liked
    #
    # parameter: {token: str,
    #           recipe_id: str}
    
    rid = request.args.get("recipe_id")
    id = get_id_from_token(request.args.get("token"))
    like = Like.query.filter_by(uid=id, rid=rid).first()
    
    if like:
        return jsonify(True)
    return jsonify(False)

@app.route("/recipe/is_owner", methods=['GET']) 
def recipe_is_owner():
    # check if the recipe is owned by the user
    #
    # parameter: {token: str,
    #           recipe_id: str}
    
    rid = request.args.get("recipe_id")
    id = get_id_from_token(request.args.get("token"))
    owner_id = Recipe.query.filter_by(rid=rid).first().uid
    
    if owner_id == id:
        return jsonify(True)
    return jsonify(False)

@app.route("/recipe/delete_recipe", methods=['DELETE'])
def delete_recipe():
    # delete the recipe
    #
    # parameter: {token: string, 
    #           recipe_id: string}
    
    rid = request.get_json()["recipe_id"]
    id = get_id_from_token(request.get_json()["token"])
    recipe = Recipe.query.filter_by(rid=rid).first()
    owner_id = recipe.uid
    
    if owner_id != id:
        abort(400, 'already subscribed')
    
    tags = Tag.query.filter_by(rid=rid)
    for tag in tags:
        db.session.delete(tag)
    db.session.delete(recipe)
    Recipe.query.filter_by(rid=rid).delete()
    
    db.session.commit()

    # delete comments
    Comment.query.filter_by(rid=rid).delete()
    Like.query.filter_by(rid=rid).delete()
    db.session.commit()

    return jsonify()

@app.route("/recipe/edit_recipe", methods=['POST'])
def edit_recipe():
    # parameter: {token:token
    #           recipe_id: int
    #           thumbnail: pic
    #           recipe_name: str,
    #           ingredients: [{amount: int,
    #                           unit: str,
    #                           ingredient: str}],
    #           prep_time: int,
    #           method: str,
    #           meal_type: str,
    #           recipe_pic: pic,
    #           recipe_vid: vid,}
    # return {}
    
    id = get_id_from_token(request.get_json()["token"])
    if id is None: 
        abort(400, 'inv token')
    else: 
        r = Recipe.query.filter_by(rid=request.get_json()["recipe_id"]).first()
        r.uid = id
        r.recipe_images = json.dumps(request.get_json()["recipe_pic"])
        r.thumbnail = str(request.get_json()["thumbnail"])
        r.time = str(request.get_json()["prep_time"])
        r.ingredients = str(request.get_json()["ingredients"])
        r.title = str(request.get_json()["recipe_name"])
        r.method = str(request.get_json()["method"])
     
        # delete all previous tags and add new ones
        d = Tag.query.filter_by(rid=r.rid).all()
        for tag in d:
            db.session.delete(tag)

        # recreate the tags with new ingredients
        json1 = request.get_json()["ingredients"]
        for i in json1:
            j = i.get("ingredient")
            db.session.add(Tag(rid=r.rid, tag=j))
        db.session.add(Tag(rid=r.rid, tag=str(request.get_json()["meal_type"])))

        db.session.commit()
        
    return jsonify()

@app.route("/search/newsfeed", methods=['GET'])
def list_recipe_summaries():
    # list the recipe sumaries posted by users, which token owner subscribed to, 
    # if token is null, return all recipes
    #
    # parameter: {token}
    # return [{  recipe_id: int,
    #           recipe_name: str,
    #           thumbnail: pic}]
    
    # without a valid token, for unregistered users simply return all new recipes
    token = request.args.get('token')
    if (token == None) :
        recipe_l = list_all_recipe_summaries()
        return jsonify(recipe_l)
    
    # if subscribed to nobody return the default of all new recipes
    # somewhat redundant given ranking below but left in for clarity and backup
    id = get_id_from_token(token)
    recipes = db.session.query(
            Recipe
        ).filter(
            Recipe.uid == Sub.contributor
        ).filter(
            Sub.explorer == id
        ).order_by(Recipe.time_created.desc()).all()
    recipe_l = []
    for recipe in recipes:
        recipe_l.append({"recipe_id": recipe.rid, "recipe_name": recipe.title,
                        "thumbnail": recipe.thumbnail})
    if (len(recipe_l) == 0) :
        recipe_l = list_all_recipe_summaries()
        return jsonify(recipe_l)
    
    
    # given that the user has subscribed to someone, 
    # we first sort by subscriptions, then by time updated
    # time is limited to one hour since minute differences are redundant
    ranking = {}
    uid = get_id_from_token(request.args.get('token'))
    n = Recipe.query.all()
    for x in n:
        ranking[x.uid] = 0
    l = Like.query.filter_by(uid=uid).all()
    for i in l:
        r = Recipe.query.filter_by(rid=i.rid).all()
        for k in r:
            if k.uid in ranking:
                ranking[k.uid] += 1
    ret = []
    j = db.session.query(
            Recipe
        ).filter(
            Recipe.uid == Sub.contributor
        ).filter(
            Sub.explorer == id
        ).order_by(Recipe.time_created.desc()).all()
    for i in j: 
        t = (i.time_created).strftime("%Y-%m-%d %H")
        ret.append({"recipe_id": i.rid, "recipe_name": i.title, "thumbnail": i.thumbnail, "ranking": ranking[i.uid], "time": t})
    return jsonify(sorted(ret, key=lambda e: (e['time'], e['ranking']), reverse=True))
    
    
def list_all_recipe_summaries():
    # default sorting by most recently created recipes
    
    recipes = Recipe.query.order_by(Recipe.time_created.desc()).all()
    recipe_l = []
    for recipe in recipes:
        recipe_l.append({"recipe_id": recipe.rid, "recipe_name": recipe.title,
                        "thumbnail": recipe.thumbnail})
    return recipe_l


@app.route("/search/search_recipes", methods = ['GET'])
def search_recipes():
    # list the recipe sumaries which the recipe name match with the query str and 
    # filters match with the tags
    #
    # parameter: {token:token,
    #           queryStr: str,
    #           tags: [str]}
    # return [{  recipe_id,
    #           recipe_name: str,
    #           thumbnail: pic}]
    
    token = request.args.get("token")
    results = []
    
    # search by tag first
    tag = request.args.get("tags")
    if tag != None:
        tag = str(tag)
        if tag:
            t = Tag.query.filter_by(tag=tag).all()
            for i in t:
                j = Recipe.query.filter_by(rid=i.rid).first()
        
                k = {"recipe_id": j.rid, "recipe_name": j.title, "thumbnail": j.thumbnail}
                results.append(k)
            return jsonify(results)

    
    # if no result from search by tag, perform search by name with partial match
    # search bar can search for titles, tag, and ingredients
    rn = str(request.args.get("queryStr")) 
    if rn != None:
        if rn:
            o = Recipe.query.filter(Recipe.title.contains(rn)).all()
            for u in o:
                p = {"recipe_id": u.rid, "recipe_name": u.title, "thumbnail": u.thumbnail}
                if p not in results: 
                    results.append(p)
            l = rn.split()
            for i in l:
                t = Tag.query.filter(Tag.tag.contains(i)).all()
                for j in t:     
                    k = Recipe.query.filter_by(rid=j.rid).first()
                    m = {"recipe_id": k.rid, "recipe_name": k.title, "thumbnail": k.thumbnail}
                    if m not in results: 
                        results.append(m)
            return jsonify(results)
    


@app.route("/search/list_user_recipes", methods=['GET'])
def list_user_recipes():
    # list the recipe sumaries created by user with uid, if u_id is null, list the
    # recipe summaries created by the token owner
    #
    # parameter: {token:token,
    #           user_id: int
    # return [{  recipe_id,
    #           recipe_name: str,
    #           thumbnail: pic}]
    
    token = request.args.get('token')
    id = request.args.get('user_id')
    recipes = db.session.query(Recipe).filter(
            Recipe.uid == id).order_by(Recipe.time_updated.desc()).all()
    recipe_l = []
    for recipe in recipes:
        recipe_l.append({"recipe_id": recipe.rid, "recipe_name": recipe.title,
                        "thumbnail": recipe.thumbnail})

    return jsonify(recipe_l)

    

@app.route("/comment/add", methods=['POST']) 
def comment_add():
    # add a comment to a recipe, if comment_id is given it is not a new thread in recipe
    #
    # parameter: {token: str,
    #           recipe_id: str,
    #           comment_id: str (nullable),}
    #           comment: str,
    #           stars: int,
    #           image:str (nullable)}
    
    id = get_id_from_token(request.get_json()["token"])
    parent = request.get_json()["comment_id"]
    stars = request.get_json()["stars"]
    image = request.get_json()["image"]
    comment = request.get_json()["comment"]
    recipe_id = request.get_json()["recipe_id"]
    
    if parent == "":
        stars = 0
    c = Comment(uid=id, rid=recipe_id, parent=parent, comment=comment, comment_images=image, stars = stars)
    
    db.session.add(c)
    db.session.commit()
    
    return jsonify()

@app.route("/comment/delete", methods=['DELETE'])
def comment_delete():
    # delete a comment
    #
    # parameter: {token: string, 
    #           comment_id: string}
    
    c = Comment.query.filter_by(cid=request.get_json()["comment_id"]).first()
    id = get_id_from_token(request.get_json()["token"])
    if c.uid != id:
        abort(400, 'already subscribed')
    Comment.query.filter_by(cid=request.get_json()["comment_id"]).delete()
    db.session.commit()
    
    return jsonify() 

@app.route("/comment/likes", methods=['POST']) 
def comment_like():
    # like a recipe comment, increase the like count, comments may be liked multiple times by same user
    #
    # parameter: {comment_id: str}
    
    comment = request.get_json()["comment_id"]
    c = Comment.query.filter_by(cid=comment).first()
    if c.upvotes == None:
        c.upvotes = 1
    else:
        c.upvotes = c.upvotes + 1
    db.session.commit()
    
    return jsonify() 



@app.route("/recipe/recommandation", methods=['GET'])
def recommandation():
    # list the recipe sumaries created by user with uid, if u_id is null, list the
    # recipe summaries created by the token owner
    #
    # parameter: {token:token,
    #           recipe_id: int
    # return [{  recipe_id,
    #           recipe_name: str,
    #           thumbnail: pic}]
    
    # pull out parent tags
    uid = request.args.get('token')
    rid = request.args.get('recipe_id')
    parent = []
    z = Tag.query.filter_by(rid=rid).all()
    for i in z:
        parent.append(i.tag)
    cur = []
    ranking = []

    # rank the recipes based on the number of tags they have in common with the recipe
    # exclude generic tags such as lunch dinner dessert etc
    n = Recipe.query.all()
    for i in n:
        if(i.rid != int(rid)):
            t = Tag.query.filter_by(rid=i.rid).all()
            for j in t:
                if(j.tag!='breakfast' and j.tag!='lunch' and j.tag!='dinner' and j.tag!='dessert'):
                    cur.append(j.tag)
            k = list(set(parent).intersection(cur))
            u = {}
            u['ranking'] = len(k)
            u['recipe_id'] = i.rid
            u['recipe_name'] = i.title
            u['thumbnail'] = i.thumbnail
            u['time'] = (i.time_created).strftime("%Y-%m-%d %H %M")
            ranking.append(u)
            cur.clear()

    x = sorted(ranking, key=lambda e: (e['ranking'], e['time']), reverse=True)
    
    while(rec(x)):
        rec(x)
  
    return jsonify(x)

def rec(x):     
    for i in x:
        if(i.get('ranking')==0):
            x.remove(i)
            return True
    return False