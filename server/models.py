from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.exc import NoResultFound
from config import db

# Models go here!

class User (db.Model, SerializerMixin, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(), unique=True, nullable=False)
    _password_hash = db.Column(db.String(), nullable=False)

    favorites = db.relationship('Favorite', back_populates='user')
    notes = db.relationship('Note', back_populates='user')


    serialize_rules = ('-favorites.user, -notes.user')


@validates("username")
def validate_username(self, key, value):
    usernames: User.query.all()
    if not value and value in usernames:
        raise ValueError("Username already taken")
        
    return value

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

# def authenticate_user (username, password):
#     try:
#         user = User.query.filter_by(username=username).one()
#         if not user.auth(password=password):
#             return False
#         login_user(user, remember=True)
#     except NoResultFound:
#         return False
# # @hybrid_property
# def password_hash(self):
#     raise Exception("password_hash may not be viewed")

# @password_hash.setter
# def password_hash(self, password):
#     password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
#     self._password_hash = password_hash.decode('utf-8')

# def authenticate(self, password):
#     return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

class Article (db.Model, SerializerMixin):
    __tablename__ = 'articles'

    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String())
    title = db.Column(db.String())
    image_url = db.Column(db.String())
    key_facts = db.Column(db.String())
    description = db.Column(db.String())
    article_url = db.Column(db.String())

    notes = db.relationship('Note', back_populates='article')


@hybrid_property
def is_current_user_note(self):

    notes = Article.query.filter(Article.id == self.id).notes.all()
    if notes:
        current_user = User.query.filter_by(id=current_user.id).first()
        current_user_notes = self.notes.filter_by(user_id=current_user.id)
        return current_user_notes
    else:
        current_user_notes = None

class Note (db.Model, SerializerMixin):
    __tablename__ = 'notes'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    article_id = db.Column(db.Integer, db.ForeignKey('articles.id'))
    title = db.Column(db.String())
    text = db.Column(db.String())

    article = db.relationship('Article', back_populates='notes')
    user = db.relationship('User', back_populates='notes')



class Favorite (db.Model, SerializerMixin):
    __tablename__ = 'favorites'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    article_id = db.Column(db.Integer, db.ForeignKey('articles.id'))
    category = db.Column(db.String)
    
    user = db.relationship('User', back_populates='favorites')
    article = db.relationship('Article', back_populates='favorites')
   
    

    
    


