from flask import Flask, request
import sqlite3

app = Flask(__name__)

# INTENTIONAL VULNERABILITY: Hardcoded Secret
SECRET_KEY = "DEV_SECRET_KEY_12345"

def init_db():
    conn = sqlite3.connect('products.db')
    conn.execute('CREATE TABLE IF NOT EXISTS products (id INTEGER, name TEXT)')
    # Clean and re-insert to ensure fresh data
    conn.execute('DELETE FROM products')
    conn.execute('INSERT INTO products VALUES (1, "Laptop"), (2, "Phone")')
    conn.commit()

@app.route('/product')
def get_product():
    # INTENTIONAL VULNERABILITY: Raw SQL Injection point
    product_id = request.args.get('id')
    conn = sqlite3.connect('products.db')
    cursor = conn.cursor()
    # DANGEROUS: String formatting in queries leads to SQLi
    query = f"SELECT name FROM products WHERE id = {product_id}"
    cursor.execute(query)
    result = cursor.fetchone()
    return {"product": result[0] if result else "Not Found"}

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5001)
