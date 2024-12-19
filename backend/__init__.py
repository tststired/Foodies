from flask_sqlalchemy import SQLAlchemy
from flask import *
from datetime import *

app = Flask(__name__)
app.config['SECRET_KEY'] = 'capstore-project-3900'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///octupus_test.db'
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

from backend import routes
from backend import database 

with app.app_context():
    db.create_all()