#!/usr/bin/env python3

# Standard library imports
from random import random, randint, choice

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Article, Note, Favorite

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!

        print("Deleting data...")
        db.drop_all()
        db.create_all()
        db.session.commit()

        print("Seeding Users...")
        users = []
        for _ in range (10):
            password =fake.sentence()
            user = User(
                username = fake.user_name(),
            )
            user.password_hash = "123s"
            db.session.add(user)
            db.session.commit()
            users.append(user)

        print("Seeding Articles...")
        articles = []
        categories = ['Culture', 'Geography', 'Health', 'History', 'Human Activities', 'Mathematics', 'Natural Sciences', 'People', 'Philosophy', 'Religion', 'Social Sciences', 'Technology']
        for _ in range (50):
            article = Article(
                title = fake.sentence(),
                category = choice(categories),
                image_url = fake.image_url(),
                key_facts = fake.text(),
                description = fake.paragraph(),
                article_url = fake.url(),
            )
            db.session.add(article)
            db.session.commit()
            articles.append(article)

        print("Seeding Notes...")
        notes = []
        for _ in range (100):
            note = Note(
                title = fake.sentence(),
                text = fake.sentence(),
                user_id = choice(users).id,
                article_id = choice(articles).id,
            )
            db.session.add(note)
            db.session.commit()
            notes.append(note)
        
        print("Seeding Favorites...")
        favorites = [] 
        # categories = ['Culture', 'Geography', 'Health', 'History', 'Human Activities', 'Mathematics', 'Natural Sciences', 'People', 'Philosophy', 'Religion', 'Social Sciences', 'Technology']       
        for _ in range (100):
            favorite = Favorite(
                user_id = choice(users).id,
                article_id = choice(articles).id,
                # category = choice(categories),
            )
            db.session.add(favorite)
            db.session.commit()
            favorites.append(favorite)