#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, render_template, make_response
from flask_restful import Api, Resource
from flask_restful import Resource

# Local imports
# from config import app, db, api
# Add your model imports
from config import app, db, api
# from models import *

# api = Api(app)
# Views go here! use either route!
# @app.errorhandler(404)
# def not_found(e):
#     return render_template("index.html")

@app.route('/')
def index():
    return '<h1>Phase 4 Project Server</h1>'

# class Home(Resource):
#     def get(self):
#         return '<h1>Phase 4 Project Server</h1>'


# api.add_resource(Home, '/')


# @app.route('/', defaults={'path': ''})
# @app.route('/<path:path>')
# def catch_all(path):
#     return render_template("index.html")


if __name__ == '__main__':
    app.run(port=5555, debug=True)

