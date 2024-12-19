import pytest
from backend import auth
from backend.database import *
from backend import routes
from backend import app as a

recipe = {'token': None,
        'thumbnail': None,
        'recipe_name': 'Seafood salad',
        'ingredients': [{'amount': 1,
                        'unit': 'kg',
                        'ingredient': 'dead fish'}],
        'prep_time': 1,
        'method': 'eat raw',
        'meal_type': 'salad',
        'recipe_pic': None,
}

recipe2 = {'token': None,
        'thumbnail': None,
        'recipe_name': '???',
        'ingredients': [{'amount': 1,
                        'unit': 't',
                        'ingredient': 'deads'}],
        'prep_time': 1,
        'method': '???',
        'meal_type': '???',
        'recipe_pic': None,
}

@pytest.fixture()
def app():
    app = a
    app.app_context().push()
    with app.app_context():   
        db.create_all()
        yield app  
        db.session.remove()  
        db.drop_all()
        auth.session = {}

@pytest.fixture()
def client(app):
    return app.test_client()

@pytest.fixture()
def runner(app):
    return app.test_cli_runner()

def test_request_example(client):
    response = client.get("/check")
    print(response.data)


def test_subscribe(client):
    u1 = auth.auth_register('emaildada', 'pw', 'nameadwd')
    u2 = auth.auth_register('email1daw', 'pw1', 'nadawme1')
    j = {
        "token": u1['token'],
        "user_id": u2['u_id'],
    }
    r = client.post("/profile/subscribe", json=j)
    relation = Sub.query.first()
    assert relation is not None
    assert r.status_code == 200

def test_unsubscribe(client):
    u1 = auth.auth_register('emaildada', 'pw', 'nameadwd')
    u2 = auth.auth_register('email1daw', 'pw1', 'nadawme1')
    j = {
        "token": u1['token'],
        "user_id": u2['u_id'],
    }
    client.post("/profile/subscribe", json=j)
    r = client.post("/profile/unsubscribe", json=j)
    relation = Sub.query.first()
    assert relation is None
    assert r.status_code == 200

def test_is_subscribed(client):
    u1 = auth.auth_register('emaildada', 'pw', 'nameadwd')
    u2 = auth.auth_register('email1daw', 'pw1', 'nadawme1')
    j = {
        "token": u1['token'],
        "user_id": u2['u_id'],
    }
    client.post("/profile/subscribe", json=j)
    r = client.post("/profile/is_subscribed", json=j)
    assert r.json == True
    assert r.status_code == 200

def test_add_recipe(client):
    u1 = auth.auth_register('emaildada', 'pw', 'nameadwd')
    recipe['token'] = u1['token']
    r = client.post("/recipe/add_recipe", json=recipe)
    assert Recipe.query.first() is not None
    assert r.status_code == 200

def test_get_recipe(client):
    u1 = auth.auth_register('emaildada', 'pw', 'nameadwd')
    recipe['token'] = u1['token']
    r = client.post("/recipe/add_recipe", json=recipe)
    j = {
        'token': u1['token'],
        'recipe_id': Recipe.query.first().rid,
    }
    r = client.get("/recipe/get_recipe", query_string=j)

    assert r.status_code == 200
    assert r.json['recipe_name'] == recipe['recipe_name']

def test_recipe_likes(client):
    u1 = auth.auth_register('emaildada', 'pw', 'nameadwd')
    recipe['token'] = u1['token']
    r = client.post("/recipe/add_recipe", json=recipe)
    j = {
        "token": u1['token'],
        "recipe_id": Recipe.query.first().rid,
    }
    r = client.post("/recipe/likes", json=j)

    assert r.status_code == 200
    assert Like.query.filter_by(uid=u1['u_id']).first() is not None

def test_recipe_unlikes(client):
    u1 = auth.auth_register('emaildada', 'pw', 'nameadwd')
    recipe['token'] = u1['token']
    r = client.post("/recipe/add_recipe", json=recipe)
    j = {
        "token": u1['token'],
        "recipe_id": Recipe.query.first().rid,
    }
    r = client.post("/recipe/likes", json=j)
    r = client.post("/recipe/unlikes", json=j)

    assert r.status_code == 200
    assert Like.query.filter_by(uid=u1['u_id']).first() is None

def test_is_liked(client):
    u1 = auth.auth_register('emaildada', 'pw', 'nameadwd')
    recipe['token'] = u1['token']
    r = client.post("/recipe/add_recipe", json=recipe)
    j = {
        "token": u1['token'],
        "recipe_id": Recipe.query.first().rid,
    }
    r = client.post("/recipe/likes", json=j)
    r = client.get("/recipe/is_liked", query_string=j)

    assert r.status_code == 200
    assert r.json == True

def test_delete_recipe(client):
    u1 = auth.auth_register('emaildada', 'pw', 'nameadwd')
    recipe['token'] = u1['token']
    r = client.post("/recipe/add_recipe", json=recipe)
    j = {
        "token": u1['token'],
        "recipe_id": Recipe.query.first().rid,
    }
    r = client.delete("/recipe/delete_recipe", json=j)
    assert r.status_code == 200
    assert Recipe.query.first() is None
 
def test_edit_recipe(client):
    u1 = auth.auth_register('emaildada', 'pw', 'nameadwd')
    recipe['token'] = u1['token']
    r = client.post("/recipe/add_recipe", json=recipe)
    recipe['recipe_id'] = Recipe.query.first().rid
    recipe['recipe_name'] = 'xx'
    r = client.post("/recipe/edit_recipe", json=recipe)

    assert r.status_code == 200
    assert Recipe.query.first().title == 'xx'


def test_newsfeed(client):
    # u2 subscribes u1, u1 posts a recipe, then check u2's newsfeed
    u1 = auth.auth_register('emaildada', 'pw', 'nameadwd')
    u2 = auth.auth_register('email1daw', 'pw1', 'nadawme1')
    j = {
        "token": u1['token'],
        "user_id": u2['u_id'],
    }
    client.post("/profile/subscribe", json=j)
    recipe['token'] = u1['token']
    r = client.post("/recipe/add_recipe", json=recipe)
    r = client.get("/search/newsfeed", query_string=u1['token'])
    assert r.status_code == 200
    assert r.json[0]['recipe_name'] == recipe['recipe_name']
    

def test_search_name(client):
    u1 = auth.auth_register('emaildada', 'pw', 'nameadwd')
    recipe['token'] = u1['token']
    recipe['recipe_name'] = 'Seafood salad'
    client.post("/recipe/add_recipe", json=recipe)
    recipe2['token'] = u1['token']
    client.post("/recipe/add_recipe", json=recipe2)
    j = {
        'token': u1['token'],
        'user_id': u1['u_id'],
    }

    r = client.get("/search/list_user_recipes", query_string=j)
    print(r.json)
    j = {
        'token': u1['token'],
        'queryStr': 'salad',
        'tags': None
    }

    r = client.get("/search/search_recipes", query_string=j)
    assert r.status_code == 200
    print(r.json)
    assert len(r.json) == 1
    
def test_search_tag(client):
    u1 = auth.auth_register('emaildada', 'pw', 'nameadwd')
    recipe['token'] = u1['token']
    recipe['recipe_name'] = 'Seafood salad'
    client.post("/recipe/add_recipe", json=recipe)
    client.post("/recipe/add_recipe", json=recipe2)
    
    j = {
        'token': u1['token'],
        'queryStr': None,
        'tags': 'salad'
    }
    r = client.get("/search/search_recipes", query_string=j)
    assert r.status_code == 200
    print(r.json)
    assert len(r.json) == 1

def test_list_user_recipes(client):
    u1 = auth.auth_register('emaildada', 'pw', 'nameadwd')
    recipe['token'] = u1['token']
    client.post("/recipe/add_recipe", json=recipe)
    recipe2['token'] = u1['token']
    client.post("/recipe/add_recipe", json=recipe2)
    
    j = {
        'token': u1['token'],
        'user_id': u1['u_id'],
    }
    r = client.get("/search/list_user_recipes", query_string=j)
    assert r.status_code == 200
    assert len(r.json) == 2

def test_add_comment(client):
    u1 = auth.auth_register('emaildada', 'pw', 'nameadwd')
    recipe['token'] = u1['token']
    r = client.post("/recipe/add_recipe", json=recipe)
    j = {
        'token': u1['token'],
        'stars': 0,
        'recipe_id': Recipe.query.first().rid,
        'comment_id': None,
        'comment': 'Tastes like [DATA REDACTED]',
        'image': None
    }
    r = client.post("/comment/add", json=j)
    assert r.status_code == 200
    assert Comment.query.first() is not None

def test_delete_comment(client):
    u1 = auth.auth_register('emaildada', 'pw', 'nameadwd')
    recipe['token'] = u1['token']
    r = client.post("/recipe/add_recipe", json=recipe)
    j = {
        'token': u1['token'],
        'stars': 0,
        'recipe_id': Recipe.query.first().rid,
        'comment_id': None,
        'comment': 'Tastes like [DATA REDACTED]',
        'image': None
    }
    r = client.post("/comment/add", json=j)
    j = {
        'token': u1['token'],
        'comment_id': Comment.query.first().cid
    }
    r = client.delete("/comment/delete", json=j)
    assert r.status_code == 200
    assert Comment.query.first() is None

def test_like_comment(client):
    u1 = auth.auth_register('emaildada', 'pw', 'nameadwd')
    recipe['token'] = u1['token']
    r = client.post("/recipe/add_recipe", json=recipe)
    j = {
        'token': u1['token'],
        'stars': 0,
        'recipe_id': Recipe.query.first().rid,
        'comment_id': None,
        'comment': 'Tastes like [DATA REDACTED]',
        'image': None
    }
    r = client.post("/comment/add", json=j)
    j = {
        'comment_id': Comment.query.first().cid
    }
    r = client.post("/comment/likes", json=j)
    assert r.status_code == 200
    assert Comment.query.first().upvotes == 1
   