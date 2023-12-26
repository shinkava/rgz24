from flask import Flask, request, flash, render_template, redirect
from rgz import rgz
from flask_login import LoginManager, UserMixin, login_user, current_user, login_required, logout_user

app = Flask(__name__)
app.secret_key = "123"
app.register_blueprint(rgz)

login_manager = LoginManager()
login_manager.init_app(app)

class User(UserMixin):
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

    def __repr__(self):
        return f'<User {self.username}>'
    
users = {
    1: User(1, 'user1', 'password1')
}


@login_manager.user_loader
def load_user(user_id):
    return users.get(int(user_id))

@login_manager.unauthorized_handler
def unauthorized():
    return redirect('/login')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        for u in users.values():
            if u.username == username and u.password == password:
                user = u
                break
        if user:
            login_user(user)
            return redirect('/')
        return redirect('/login')
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect('/login')

