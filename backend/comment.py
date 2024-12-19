from flask import request, make_response, jsonify, abort
from backend import db
from backend.database import Comment, Recipe, User, Sub

#parameter: {token: str,
#           recipe_id: str}
#return:    comment: [{uid:str, 
#           username: str, 
#           profile_images: str,                                 
#           comment:str,
#           comment_id:str,
#           upvotes:int,
#           time_updated: str}]

# dummy data for testing 
# # open db copy paste below remove the hashtags
# INSERT INTO Comment 
# Values (NULL, NULL, '1', '1', 'ImageA', 'msgA', NULL, NULL, NULL);
# INSERT INTO Comment 
# Values (NULL, '1', '1', '1', 'Commentbaby1', 'msgC', NULL, NULL, NULL);
# INSERT INTO Comment 
# Values (NULL, '1', '1', '1', 'Commentbaby2', 'msgD', NULL, NULL, NULL);
# INSERT INTO Comment 
# Values (NULL, '3', '1', '1', 'babybaby1', 'msgE', NULL, NULL, NULL);
# INSERT INTO Comment 
# Values (NULL, '3', '1', '1', 'babybaby2', 'msgF', NULL, NULL, NULL);

def tree(rid):
    c = Comment.query.filter_by(rid=rid).all()
    children = []   
    for i in c: 
        if(i.parent==None):
            children.append(paste(i))
    for i in children:
        child(i['comment_id'], i)
    return children

def child(cid, index):
    c = Comment.query.filter_by(parent=cid).all()
    for x in c: 
        index['children'].append(paste(x))
    for x in index['children']:
        child(x['comment_id'], x)
        
def paste(index):
    t = {}
    t['uid']= index.uid
    u = User.query.filter_by(uid=index.uid).first()
    t['username']= u.username
    t['profile_images']= u.profile_images
    t['comment']= index.comment
    t['comment_id']= index.cid
    t['comment_images'] = index.comment_images
    t['upvotes']= index.upvotes
    t['stars'] = index.stars
    t['time_updated']= index.time_updated
    t['time_created']= index.time_created
    t['children'] = []
    t['upvotes'] = index.upvotes
    return t