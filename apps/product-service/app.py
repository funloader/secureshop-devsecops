from flask import Flask, request, jsonify
import sqlite3
import os

app = Flask(__name__)

# INTENTIONALLY VULNERABLE: Hardcoded secret
DEBUG_SECRET = "sk_test_51ABC123XYZ789hardcoded_stripe_key_never_use"
DEBUG_MODE = True  # Production debug enabled!

# INTENTIONALLY VULNERABLE DB
def init_db():
    conn = sqlite3.connect('products.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS products
                 (id INTEGER PRIMARY KEY, name TEXT, price REAL, stock INTEGER)''')
    c.execute("INSERT OR IGNORE INTO products VALUES (1, 'Vulnerable Laptop', 999.99, 10)")
    c.execute("INSERT OR IGNORE INTO products VALUES (2, 'SQLi Target Phone', 599.99, 5)")
    conn.commit()
    conn.close()

@app.route('/')
def health():
    return jsonify({"status": "Product service vulnerable-ready!", "secret_exposed": DEBUG_SECRET[:20]})

@app.route('/products')
def list_products():
    conn = sqlite3.connect('products.db')
    c = conn.cursor()
    c.execute('SELECT * FROM products')
    products = [{"id": row[0], "name": row[1], "price": row[2], "stock": row[3]} for row in c.fetchall()]
    conn.close()
    return jsonify(products)

# INTENTIONALLY VULNERABLE: SQL Injection
@app.route('/products/search')
def search_products():
    name = request.args.get('name', '')
    conn = sqlite3.connect('products.db')
    c = conn.cursor()
    # NO parameterization = SQLi vulnerable!
    c.execute(f"SELECT * FROM products WHERE name LIKE '%{name}%'")
    products = c.fetchall()
    conn.close()
    return jsonify({"vulnerable_search": str(products)})

if __name__ == '__main__':
    init_db()
    app.run(debug=DEBUG_MODE, host='0.0.0.0', port=5000)
