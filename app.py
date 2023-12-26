from flask import Flask
from rgz import rgz
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

app = Flask(__name__)
app.secret_key = "123"
app.register_blueprint(rgz)
