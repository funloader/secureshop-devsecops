// INTENTIONALLY VULNERABLE Order Service
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

// HARDCODED SECRETS - Gitleaks will find these!
const STRIPE_SECRET = 'sk_live_51ABC123fake_aws_access_key_12345';
const AWS_ACCESS_KEY = 'AKIAIOSFODNN7EXAMPLE';
const JWT_SECRET = 'super-secret-jwt-key-change-me';

const app = express();
app.use(express.json());

// SQLite setup
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
  db.run(CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    customer_name TEXT,
    customer_email TEXT,
    product_id INTEGER,
    quantity INTEGER
  ));
});

app.get('/', (req, res) => {
  res.json({ 
    status: 'Order service vulnerable!',
    exposed_secret: STRIPE_SECRET.substring(0, 15) + '...',
    version: '1.0.0-vulnerable'
  });
});

app.post('/orders', express.json(), (req, res) => {
  const { customer_name, customer_email, product_id, quantity } = req.body;
  // NO VALIDATION = vulnerable to injection/malformed data
  db.run(INSERT INTO orders (customer_name, customer_email, product_id, quantity) 
          VALUES (?, ?, ?, ?), 
         [customer_name, customer_email, product_id, quantity], 
         function(err) {
    if (err) return res.status(500).json({error: err.message});
    res.json({order_id: this.lastID});
  });
});

app.get('/orders', (req, res) => {
  db.all('SELECT * FROM orders', [], (err, rows) => {
    res.json(rows);
  });
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Order service running on http://localhost:3000');
  console.log('Vulnerable secrets loaded:', {STRIPE_SECRET: 'HIDDEN', AWS_ACCESS_KEY: 'HIDDEN'});
});
