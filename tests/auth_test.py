import pytest
from backend import auth
from backend.database import *
from backend import routes
from backend import app as a


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

def test_register_session(client):
    auth.auth_register('email1', 'pw', 'name1')
    assert len(auth.session) == 1

    auth.auth_register('e', 'pw', 'n1')
    assert len(auth.session) == 2

def test_register_db(client):
    auth.auth_register('email', 'pw', 'name')
    user = User.query.filter_by(email='email', password='pw', username='name').first()
    assert user is not None

def test_logout(client):
    res = auth.auth_register('email', 'pw', 'name')
    auth.auth_logout(res['token'])
    assert len(auth.session) == 0

def test_login(client):
    res = auth.auth_register('email', 'pw', 'name')
    auth.auth_logout(res['token'])
    auth.auth_login('email', 'pw')
    assert len(auth.session) == 1

def test_detail(client):
    res = auth.auth_register('email', 'pw', 'name')
    detail = auth.auth_details(res['token'], res['u_id'])
    assert detail['email'] == 'email'
    assert detail['u_id'] == res['u_id']
    assert detail['username'] == 'name'

def test_update_detail(client):
    res = auth.auth_register('email', 'pw', 'name')
    auth.auth_update(res['token'], 'pw', 'newname', 'nomail', None)
    detail = auth.auth_details(res['token'], res['u_id'])

    assert detail['email'] == 'nomail'
    assert detail['username'] == 'newname'




