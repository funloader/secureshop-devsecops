/**
 * Order Service - Node.js Express API
 * Intentionally includes security issues for scanning tools to detect
 */

const express = require('express');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(express.json());

// 🔴 INTENTIONAL SECURITY ISSUE #1: Hardcoded credentials (for Gitleaks)
const AWS_ACCESS_KEY = "AKIAIOSFODNN7EXAMPLE";  // Fake AWS key
const AWS_SECRET_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";
const DB_PASSWORD = "password123";

// 🔴 INTENTIONAL SECURITY ISSUE #2: Hardcoded service URL (should be env var)
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:5000';

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

// Create orders table
db.serialize(() => {
    db.run(`
        CREATE TABLE orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT NOT NULL,
            customer_email TEXT NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            total_price REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('✅ Database initialized successfully');
});

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        service: 'Order Service',
        status: 'running',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Get all orders
app.get('/orders', (req, res) => {
    db.all('SELECT * FROM orders ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                error: err.message 
            });
        }
        res.json({
            success: true,
            count: rows.length,
            orders: rows
        });
    });
});

// Get single order
app.get('/orders/:id', (req, res) => {
    const { id } = req.params;
    
    db.get('SELECT * FROM orders WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                error: err.message 
            });
        }
        if (!row) {
            return res.status(404).json({ 
                success: false, 
                error: 'Order not found' 
            });
        }
        res.json({
            success: true,
            order: row
        });
    });
});

// Create new order
app.post('/orders', async (req, res) => {
    const { customer_name, customer_email, product_id, quantity } = req.body;
    
    // Validation
    if (!customer_name || !customer_email || !product_id || !quantity) {
        return res.status(400).json({
            success: false,
            error: 'Missing required fields: customer_name, customer_email, product_id, quantity'
        });
    }
    
    try {
        // 🔴 INTENTIONAL SECURITY ISSUE #3: No input validation on email
        // 🔴 INTENTIONAL SECURITY ISSUE #4: No SSL verification (in production)
        
        // Verify product exists and get price
        const productResponse = await axios.get(
            `${PRODUCT_SERVICE_URL}/products/${product_id}`,
            { timeout: 5000 }
        );
        
        if (!productResponse.data.success) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
        
        const product = productResponse.data.product;
        
        // Check stock availability
        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                error: `Insufficient stock. Available: ${product.stock}`
            });
        }
        
        // Calculate total
        const total_price = product.price * quantity;
        
        // Create order
        db.run(
            `INSERT INTO orders (customer_name, customer_email, product_id, quantity, total_price, status) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [customer_name, customer_email, product_id, quantity, total_price, 'confirmed'],
            function(err) {
                if (err) {
                    return res.status(500).json({ 
                        success: false, 
                        error: err.message 
                    });
                }
                
                // Update product stock
                axios.put(
                    `${PRODUCT_SERVICE_URL}/products/${product_id}`,
                    { stock: product.stock - quantity }
                ).catch(updateErr => {
                    console.error('Failed to update product stock:', updateErr.message);
                });
                
                res.status(201).json({
                    success: true,
                    message: 'Order created successfully',
                    order_id: this.lastID,
                    total_price: total_price,
                    product_name: product.name
                });
            }
        );
        
    } catch (error) {
        // 🔴 INTENTIONAL SECURITY ISSUE #5: Exposing internal error details
        res.status(500).json({
            success: false,
            error: error.message,
            stack: error.stack  // Exposing stack trace
        });
    }
});

// Cancel order
app.delete('/orders/:id', (req, res) => {
    const { id } = req.params;
    
    db.run('UPDATE orders SET status = ? WHERE id = ?', ['cancelled', id], function(err) {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                error: err.message 
            });
        }
        if (this.changes === 0) {
            return res.status(404).json({ 
                success: false, 
                error: 'Order not found' 
            });
        }
        res.json({
            success: true,
            message: 'Order cancelled successfully'
        });
    });
});

// 🔴 INTENTIONAL SECURITY ISSUE #6: No rate limiting
// 🔴 INTENTIONAL SECURITY ISSUE #7: No authentication/authorization

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Order Service running on http://localhost:${PORT}`);
    console.log(`📦 Connected to Product Service at ${PRODUCT_SERVICE_URL}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    db.close();
    process.exit(0);
});
