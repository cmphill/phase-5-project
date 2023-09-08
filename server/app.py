#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, render_template, make_response, flash
from flask_restful import Resource
from flask_login import login_user, logout_user, login_required, UserMixin

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
    def get(self, user_id):
        user = User.query.filter_by(id=user_id).first()
        return user.to_dict(), 200
   
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
        username = request.get_json()['username']
        password = request.get_json()['password']

        user = User.query.filter_by(username=username).first()
        if user and user.password == password:
            login_user(user, remember=True)
            flash('Logged in Successfully')
        else:
            return ('Invalid username or password'), 401
    @login_manager.user_loader
    def load_user(self, user_id):
        try:
            return self.get(user_id)
        except:
            return None, print('user not found')

class Logout(Resource):
    def delete(self):
        logout_user()
        return make_response({'success': 'logged out'}), 204



api.add_resource(Login, '/api/login')
api.add_resource(Logout, '/api/logout')
api.add_resource(Users, '/api/users')
# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def catch_all(path):
#     return render_template("index.html")


if __name__ == '__main__':
    app.run(port=5555, debug=True)

