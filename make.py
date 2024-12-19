import os
from backend import db, app
from backend.database import User, Recipe, Comment, Tag, Like, test

if os.path.exists("instance/octupus_test.db"):
    os.remove("instance/octupus_test.db")
    print("del old db")

with app.app_context():
    db.create_all()
    db.session.commit()
