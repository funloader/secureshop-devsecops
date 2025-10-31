"""
Product Service - Flask REST API
Intentionally includes security issues for scanning tools to detect
"""

from flask import Flask, request, jsonify
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)

# 🔴 INTENTIONAL SECURITY ISSUE #1: Hardcoded secret (for Gitleaks to catch)
API_KEY = "sk_live_fake_placeholder_for_demo_only"  # Fake key placeholder
DATABASE_PASSWORD = "admin123"  # Hardcoded password

# 🔴 INTENTIONAL SECURITY ISSUE #2: SQL Injection vulnerability
def init_db():
    """Initialize SQLite database"""
    conn = sqlite3.connect('products.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            stock INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Add sample data
    cursor.execute("SELECT COUNT(*) FROM products")
    if cursor.fetchone()[0] == 0:
        sample_products = [
            ('Laptop', 999.99, 50),
            ('Mouse', 29.99, 200),
            ('Keyboard', 79.99, 150),
            ('Monitor', 299.99, 75),
            ('Headphones', 149.99, 100)
        ]
        cursor.executemany(
            'INSERT INTO products (name, price, stock) VALUES (?, ?, ?)',
            sample_products
        )
    
    conn.commit()
    conn.close()
    print("✅ Database initialized successfully")


@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({
        'service': 'Product Service',
        'status': 'running',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat()
    })


@app.route('/products', methods=['GET'])
def get_products():
    """Get all products"""
    try:
        conn = sqlite3.connect('products.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM products')
        products = [dict(row) for row in cursor.fetchall()]
        
        conn.close()
        return jsonify({
            'success': True,
            'count': len(products),
            'products': products
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get single product by ID"""
    try:
        conn = sqlite3.connect('products.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM products WHERE id = ?', (product_id,))
        product = cursor.fetchone()
        
        conn.close()
        
        if product:
            return jsonify({
                'success': True,
                'product': dict(product)
            })
        else:
            return jsonify({'success': False, 'error': 'Product not found'}), 404
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/products/search', methods=['GET'])
def search_products():
    """
    Search products by name
    🔴 INTENTIONAL VULNERABILITY: SQL Injection
    """
    search_term = request.args.get('name', '')
    
    try:
        conn = sqlite3.connect('products.db')
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # 🔴 VULNERABLE: String formatting instead of parameterized query
        query = f"SELECT * FROM products WHERE name LIKE '%{search_term}%'"
        cursor.execute(query)  # SQL Injection possible here!
        
        products = [dict(row) for row in cursor.fetchall()]
        conn.close()
        
        return jsonify({
            'success': True,
            'search_term': search_term,
            'count': len(products),
            'products': products
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/products', methods=['POST'])
def create_product():
    """Create a new product"""
    data = request.get_json()
    
    # Basic validation
    if not data or 'name' not in data or 'price' not in data or 'stock' not in data:
        return jsonify({
            'success': False,
            'error': 'Missing required fields: name, price, stock'
        }), 400
    
    try:
        conn = sqlite3.connect('products.db')
        cursor = conn.cursor()
        
        cursor.execute(
            'INSERT INTO products (name, price, stock) VALUES (?, ?, ?)',
            (data['name'], data['price'], data['stock'])
        )
        
        product_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Product created successfully',
            'product_id': product_id
        }), 201
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """Update product stock"""
    data = request.get_json()
    
    if not data or 'stock' not in data:
        return jsonify({
            'success': False,
            'error': 'Missing required field: stock'
        }), 400
    
    try:
        conn = sqlite3.connect('products.db')
        cursor = conn.cursor()
        
        cursor.execute(
            'UPDATE products SET stock = ? WHERE id = ?',
            (data['stock'], product_id)
        )
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({'success': False, 'error': 'Product not found'}), 404
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Product updated successfully'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# 🔴 INTENTIONAL SECURITY ISSUE #3: Debug mode in production
if __name__ == '__main__':
    init_db()
    # Debug=True exposes sensitive information
    app.run(host='0.0.0.0', port=5000, debug=True)
