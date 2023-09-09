#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, render_template, make_response, flash, jsonify
from flask_restful import Resource
from flask_login import current_user, login_user, logout_user, login_required, UserMixin
from sqlalchemy.orm.exc import NoResultFound

# Local imports
# from config import app, db, api
# Add your model imports
from config import app, db, api, login_manager
from models import *

# api = Api(app)
# Views go here! use either route!
# @app.errorhandler(404)
# def not_found(e):
#     return render_template("index.html")


class Users(Resource, UserMixin):
    def get(self):
        users = [u.to_dict() for u in User.query.all()]
        return users, 200

    def post(self):
        username = request.get_json()['username']
        password = request.get_json()['password']
        password_confirmation = request.get_json()['password_confirmation']


        if username and password == password_confirmation:
            newUser = User(username=username)
            newUser.password_hash = password

        db.session.add(newUser)
        db.session.commit()
        return newUser.to_dict(), 201

class UsersByID(Resource):
    # user_id = User.get_id()
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if user:
            return user.to_dict(), 200
        else:
            return {'error' : 'Could not find user'}, 404
    def patch(self, id):
        user = User.query.filter_by(id=id).first()
        if user:
            try:
                user.username = request.get_json()['username']
                user.password = request.get_json()['password']
                user.password_confirmation = request.get_json()['password_confirmation']
                db.session.add(user)
                db.session.commit()
                return user.to_dict(), 200
            except:
                return {'error' : 'Could not update user'}, 422
        else:
            return {'error' : 'Could not find user'}, 404
    def delete(self, id):
        user = User.query.filter_by(id=id).first()
        if user:
            db.session.delete(user)
            db.session.commit()
            return '', 204
        else:
            return {'error' : 'Could not find user'}, 404

@app.route('/')
def index():
    return '<h1>Phase 4 Project Server</h1>'

class Login(Resource):
    # @login_manager.user_loader
    # def load_user(user_id):
    #     try:
    #         return User.get(int(user_id))
    #     except NoResultFound:
    #         return None
    def post(self):
        if current_user.is_authenticated:
            return make_response(jsonify({'message' : 'You are already logged in'}), 400)
        username = request.get_json()['username']
        password = request.get_json()['password']

        user = User.query.filter_by(username=username).first()
        if user and  user.authenticate(password):
            login_user(user, remember=True)
            flash('Logged in Successfully')
            print('Logged in Successfully')
            return {'message' : 'Logged in Successfully'}, 200
        else:
            return ('Invalid username or password'), 401
        
@login_manager.user_loader
def load_user(id):
    try:
        return (User.query.get(int(id)))
    except NoResultFound:
        return None, print('user not found')

class Logout(Resource):
    def delete(self):
        logout_user()
        return ({'success': 'logged out'}), 204
    
class Favorites(Resource):
    def get(self):
        favorites = [favorite.to_dict() for favorite in Favorite.query.all()]
        return favorites, 200
    def post(self):
        category = request.get_json()['category']
        article_id = request.get_json()['article_id']
        user_id = current_user.get_id()
        if user_id is not None and (article_id or category):
            newFavorite = Favorite(category=category, article_id=article_id, user_id=user_id)
            db.session.add(newFavorite)
            db.session.commit()
            return newFavorite.to_dict(), 201
        else:
            return {'error': 'You must login to add a favorite'}, 401
            # implement a redirect to the login page
class FavoritesByID(Resource):
    def get(self, id):
        favorite = Favorite.query.filter_by(id=id).first()
        if favorite:
            return favorite.to_dict(), 200
        else:
            return {'error' : 'Could not find favorite'}, 404
    def delete(self, id):
        favorite = Favorite.query.filter_by(id=id).first()
        if favorite:
            db.session.delete(favorite)
            db.session.commit()
            return '', 204
        else:
            return {'error' : 'Could not find favorite'}, 404
        
class Notes(Resource):
    def get (self):
        notes = [note.to_dict() for note in Note.query.all()]
        return notes, 200
    def post(self):
        user_id = current_user.get_id()
        data = request.get_json()
        text = data['text']
        title = data['title'] or 'Untitled'
        article_id = data['article_id']
        if user_id is not None and text is not None:
            newNote = Note(
                title=title,
                text=text, 
                user_id=user_id,
                article_id=article_id
                )
            db.session.add(newNote)
            db.session.commit()
            return newNote.to_dict(), 201
        else:
            return make_response(jsonify({'message' : 'You must login to add a note'}), 401)
            # implement a redirect to the login page
class NotesByID(Resource):
    def get(self, id):
        note = Note.query.filter_by(id=id).first()
        if note:
            return note.to_dict(), 200
        else:
            return {'error' : 'Could not find note'}, 404
    def patch(self, id):
        note = Note.query.filter_by(id=id).first()
        if note:
            try:
                if note.text is not None:
                    note.title = request.get_json()['title'] or 'Untitled'
                    note.text = request.get_json()['text']
                    db.session.add(note)
                    db.session.commit()
                    return note.to_dict(), 200
                else:
                    return {'error' : 'You must add text to the note'}, 401
            except:
                return {'error' : 'Could not update note'}, 422
        else:
            return {'error' : 'Could not find note'}, 404
    def delete(self, id):
        note = Note.query.filter_by(id=id).first()
        if note:
            db.session.delete(note)
            db.session.commit()
            return '', 204
        else:
            return {'error' : 'Could not find note'}, 404
        
        

api.add_resource(Users, '/api/users')
api.add_resource(UsersByID, '/api/users/<int:id>')
api.add_resource(Notes, '/api/notes')
api.add_resource(NotesByID, '/api/notes/<int:id>')
api.add_resource(Favorites, '/api/favorites')
api.add_resource(FavoritesByID, '/api/favorites/<int:id>')
api.add_resource(Login, '/api/login')
api.add_resource(Logout, '/api/logout')

# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def catch_all(path):
#     return render_template("index.html")


if __name__ == '__main__':
    app.run(port=5555, debug=True)

