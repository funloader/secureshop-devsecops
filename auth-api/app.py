from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
db = SQLAlchemy(app)

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)  # Plaintext!

# Create tables
with app.app_context():
    db.create_all()

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    # SQL INJECTION VULNERABLE!
    username = data.get('username')
    password = data.get('password')
    
    # DANGEROUS: Direct string injection
    query = f"INSERT INTO user (username, password) VALUES ('{username}', '{password}')"
    try:
        db.engine.execute(query)
        return jsonify({"message": "User created"}), 201
    except:
        return jsonify({"error": "User exists"}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    # SQL INJECTION VULNERABLE!
    query = f"SELECT * FROM user WHERE username='{username}' AND password='{password}'"
    result = db.engine.execute(query).fetchall()
    
    if result:
        return jsonify({"message": "Login success", "user_id": result[0][0]})
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/admin/users', methods=['GET'])
def admin_users():
    # SQL INJECTION VULNERABLE - Admin can see all users
    query = f"SELECT id, username FROM user"  # Passwords hidden for admin
    users = db.engine.execute(query).fetchall()
    return jsonify([{"id": u[0], "username": u[1]} for u in users])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003, debug=True)
