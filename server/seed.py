#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Article, Note

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
            user = User (
                username = fake.user_name(),
                password = fake.password(),
            )
            db.session.add(user)
            db.session.commit()
            users.append(user)

        print("Seeding Articles...")
