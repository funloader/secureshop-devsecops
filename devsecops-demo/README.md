You’ll build a small but realistic insecure microservices app and run it locally with Docker Compose on Day 1. Below is everything you need: folders, files, code, commands, and what to expect.

***

## Day 1 – Goal & Folder Structure

You will create a repo like this:

```bash
devsecops-demo/
├─ product-service/        # Python Flask
│  ├─ app.py
│  ├─ requirements.txt
│  └─ Dockerfile
├─ order-service/          # Node.js Express
│  ├─ app.js
│  ├─ package.json
│  └─ Dockerfile
├─ db/
│  └─ init.sql             # (optional for later; today we use SQLite files)
├─ docker-compose.yml
└─ README.md
```

Create the root folder and subfolders:

```bash
mkdir devsecops-demo
cd devsecops-demo

mkdir -p product-service
mkdir -p order-service
mkdir -p db
touch README.md
```

***

## Product Service (Flask, intentionally vulnerable)

### 1. `product-service/requirements.txt`

```txt
Flask==2.0.0
sqlite3-binary==0.0.1  # fake/old style to show "outdated" / suspicious dep
```

This pins an old Flask version and adds a weird dependency to look insecure in scans.

Create the file:

```bash
cd product-service
cat > requirements.txt << 'EOF'
Flask==2.0.0
sqlite3-binary==0.0.1
EOF
cd ..
```

### 2. `product-service/app.py` (vulnerable API)

This service:

- Uses SQLite as a local file.
- Has **SQL injection** via string concatenation.
- Has a **hardcoded secret** in the code.

```python
# product-service/app.py
from flask import Flask, request, jsonify
import sqlite3
import os

app = Flask(__name__)

# Intentionally hardcoded secret (bad practice)
API_SECRET = "SUPER_SECRET_API_KEY_123"

DB_PATH = "products.db"


def init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            price REAL
        )
    """)
    # Seed some data
    cur.execute("INSERT INTO products (name, price) VALUES ('Laptop', 1000.0)")
    cur.execute("INSERT INTO products (name, price) VALUES ('Mouse', 20.0)")
    conn.commit()
    conn.close()


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "product"}), 200


@app.route("/products", methods=["GET"])
def get_products():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("SELECT id, name, price FROM products")
    rows = cur.fetchall()
    conn.close()
    products = [{"id": r[0], "name": r [linkedin](https://www.linkedin.com/posts/saedf_jenkins-is-free-docker-is-free-helm-is-activity-7384199661160505345-ey7J), "price": r [linkedin](https://www.linkedin.com/posts/oluwafemi-adeleye_this-is-spot-on-securing-your-system-doesn-activity-7384680024160821248-1LTS)} for r in rows]
    return jsonify(products), 200


# Intentionally vulnerable: SQL Injection via query param "name"
@app.route("/products/search", methods=["GET"])
def search_products():
    name = request.args.get("name", "")
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # VULNERABLE: never do string concatenation like this in real apps
    query = "SELECT id, name, price FROM products WHERE name LIKE '%" + name + "%';"
    print("Executing query:", query)  # debug

    cur.execute(query)
    rows = cur.fetchall()
    conn.close()
    products = [{"id": r[0], "name": r [linkedin](https://www.linkedin.com/posts/saedf_jenkins-is-free-docker-is-free-helm-is-activity-7384199661160505345-ey7J), "price": r [linkedin](https://www.linkedin.com/posts/oluwafemi-adeleye_this-is-spot-on-securing-your-system-doesn-activity-7384680024160821248-1LTS)} for r in rows]
    return jsonify(products), 200


@app.route("/secret", methods=["GET"])
def secret():
    # Exposes the secret for demo purposes
    return jsonify({"api_secret": API_SECRET}), 200


if __name__ == "__main__":
    if not os.path.exists(DB_PATH):
        init_db()
    app.run(host="0.0.0.0", port=5001)
```

Create it:

```bash
cd product-service
cat > app.py << 'EOF'
from flask import Flask, request, jsonify
import sqlite3
import os

app = Flask(__name__)

API_SECRET = "SUPER_SECRET_API_KEY_123"

DB_PATH = "products.db"


def init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            price REAL
        )
    """)
    cur.execute("INSERT INTO products (name, price) VALUES ('Laptop', 1000.0)")
    cur.execute("INSERT INTO products (name, price) VALUES ('Mouse', 20.0)")
    conn.commit()
    conn.close()


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "product"}), 200


@app.route("/products", methods=["GET"])
def get_products():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute("SELECT id, name, price FROM products")
    rows = cur.fetchall()
    conn.close()
    products = [{"id": r[0], "name": r [linkedin](https://www.linkedin.com/posts/saedf_jenkins-is-free-docker-is-free-helm-is-activity-7384199661160505345-ey7J), "price": r [linkedin](https://www.linkedin.com/posts/oluwafemi-adeleye_this-is-spot-on-securing-your-system-doesn-activity-7384680024160821248-1LTS)} for r in rows]
    return jsonify(products), 200


@app.route("/products/search", methods=["GET"])
def search_products():
    name = request.args.get("name", "")
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    query = "SELECT id, name, price FROM products WHERE name LIKE '%" + name + "%';"
    print("Executing query:", query)

    cur.execute(query)
    rows = cur.fetchall()
    conn.close()
    products = [{"id": r[0], "name": r [linkedin](https://www.linkedin.com/posts/saedf_jenkins-is-free-docker-is-free-helm-is-activity-7384199661160505345-ey7J), "price": r [linkedin](https://www.linkedin.com/posts/oluwafemi-adeleye_this-is-spot-on-securing-your-system-doesn-activity-7384680024160821248-1LTS)} for r in rows]
    return jsonify(products), 200


@app.route("/secret", methods=["GET"])
def secret():
    return jsonify({"api_secret": API_SECRET}), 200


if __name__ == "__main__":
    if not os.path.exists(DB_PATH):
        init_db()
    app.run(host="0.0.0.0", port=5001)
EOF
cd ..
```

### 3. `product-service/Dockerfile`

```dockerfile
# product-service/Dockerfile
FROM python:3.9-slim

# Intentionally use root user (bad practice)
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

EXPOSE 5001

CMD ["python", "app.py"]
```

Create it:

```bash
cd product-service
cat > Dockerfile << 'EOF'
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

EXPOSE 5001

CMD ["python", "app.py"]
EOF
cd ..
```

***

## Order Service (Node.js, intentionally vulnerable)

### 1. `order-service/package.json`

The dependency on an old Express version is intentional.

```json
{
  "name": "order-service",
  "version": "1.0.0",
  "description": "Insecure Order API for DevSecOps demo",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "4.17.1",
    "sqlite3": "5.0.0"
  }
}
```

Create:

```bash
cd order-service
cat > package.json << 'EOF'
{
  "name": "order-service",
  "version": "1.0.0",
  "description": "Insecure Order API for DevSecOps demo",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "4.17.1",
    "sqlite3": "5.0.0"
  }
}
EOF
cd ..
```

### 2. `order-service/app.js`

This service:

- Uses SQLite as a file.
- Has **SQL injection** using string concatenation.
- Has a **hardcoded JWT secret** and **API key** in env-like variables.

```javascript
// order-service/app.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const DB_PATH = path.join(__dirname, "orders.db");

// Intentionally hardcoded secrets (bad practice)
const JWT_SECRET = "MY_JWT_SECRET_456";
const PAYMENT_API_KEY = "PAYMENT_API_KEY_ABC";

function initDb() {
  const dbExists = fs.existsSync(DB_PATH);
  const db = new sqlite3.Database(DB_PATH);

  if (!dbExists) {
    db.serialize(() => {
      db.run(
        "CREATE TABLE orders (id INTEGER PRIMARY KEY AUTOINCREMENT, product_name TEXT, quantity INTEGER)"
      );
      db.run(
        "INSERT INTO orders (product_name, quantity) VALUES ('Laptop', 1)"
      );
      db.run(
        "INSERT INTO orders (product_name, quantity) VALUES ('Mouse', 2)"
      );
    });
  }

  db.close();
}

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "order" });
});

app.get("/orders", (req, res) => {
  const db = new sqlite3.Database(DB_PATH);
  db.all("SELECT id, product_name, quantity FROM orders", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "DB error" });
    }
    res.json(rows);
  });
  db.close();
});

// Intentionally vulnerable: SQL Injection via "product" query param
app.get("/orders/search", (req, res) => {
  const product = req.query.product || "";
  const db = new sqlite3.Database(DB_PATH);

  // VULNERABLE: direct concatenation
  const query =
    "SELECT id, product_name, quantity FROM orders WHERE product_name LIKE '%" +
    product +
    "%';";

  console.log("Executing query:", query);

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "DB error" });
    }
    res.json(rows);
  });

  db.close();
});

// Endpoint that leaks secrets (for demo)
app.get("/debug-secrets", (req, res) => {
  res.json({
    jwt_secret: JWT_SECRET,
    payment_api_key: PAYMENT_API_KEY
  });
});

const PORT = process.env.PORT || 5002;

initDb();
app.listen(PORT, () => {
  console.log(`Order service listening on port ${PORT}`);
});
```

Create:

```bash
cd order-service
cat > app.js << 'EOF'
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const DB_PATH = path.join(__dirname, "orders.db");

const JWT_SECRET = "MY_JWT_SECRET_456";
const PAYMENT_API_KEY = "PAYMENT_API_KEY_ABC";

function initDb() {
  const dbExists = fs.existsSync(DB_PATH);
  const db = new sqlite3.Database(DB_PATH);

  if (!dbExists) {
    db.serialize(() => {
      db.run(
        "CREATE TABLE orders (id INTEGER PRIMARY KEY AUTOINCREMENT, product_name TEXT, quantity INTEGER)"
      );
      db.run(
        "INSERT INTO orders (product_name, quantity) VALUES ('Laptop', 1)"
      );
      db.run(
        "INSERT INTO orders (product_name, quantity) VALUES ('Mouse', 2)"
      );
    });
  }

  db.close();
}

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "order" });
});

app.get("/orders", (req, res) => {
  const db = new sqlite3.Database(DB_PATH);
  db.all("SELECT id, product_name, quantity FROM orders", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "DB error" });
    }
    res.json(rows);
  });
  db.close();
});

app.get("/orders/search", (req, res) => {
  const product = req.query.product || "";
  const db = new sqlite3.Database(DB_PATH);

  const query =
    "SELECT id, product_name, quantity FROM orders WHERE product_name LIKE '%" +
    product +
    "%';";

  console.log("Executing query:", query);

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "DB error" });
    }
    res.json(rows);
  });

  db.close();
});

app.get("/debug-secrets", (req, res) => {
  res.json({
    jwt_secret: JWT_SECRET,
    payment_api_key: PAYMENT_API_KEY
  });
});

const PORT = process.env.PORT || 5002;

initDb();
app.listen(PORT, () => {
  console.log(`Order service listening on port ${PORT}`);
});
EOF
cd ..
```

### 3. `order-service/Dockerfile`

```dockerfile
# order-service/Dockerfile
FROM node:14

# Intentionally no non-root user
WORKDIR /app

COPY package.json .
RUN npm install

COPY app.js .

EXPOSE 5002

CMD ["npm", "start"]
```

Create it:

```bash
cd order-service
cat > Dockerfile << 'EOF'
FROM node:14

WORKDIR /app

COPY package.json .
RUN npm install

COPY app.js .

EXPOSE 5002

CMD ["npm", "start"]
EOF
cd ..
```

***

## Docker Compose Setup

Create `docker-compose.yml` in the **root** (`devsecops-demo/`):

```yaml
version: "3.8"

services:
  product-service:
    build: ./product-service
    container_name: product-service
    ports:
      - "5001:5001"
    volumes:
      - ./product-service:/app
    environment:
      - FLASK_ENV=development

  order-service:
    build: ./order-service
    container_name: order-service
    ports:
      - "5002:5002"
    volumes:
      - ./order-service:/app
    environment:
      - NODE_ENV=development
```

Create it:

```bash
cat > docker-compose.yml << 'EOF'
version: "3.8"

services:
  product-service:
    build: ./product-service
    container_name: product-service
    ports:
      - "5001:5001"
    volumes:
      - ./product-service:/app
    environment:
      - FLASK_ENV=development

  order-service:
    build: ./order-service
    container_name: order-service
    ports:
      - "5002:5002"
    volumes:
      - ./order-service:/app
    environment:
      - NODE_ENV=development
EOF
```

***

## Run and Test the APIs

### 1. Build and start services

From root folder `devsecops-demo/`:

```bash
docker-compose build
docker-compose up
```

Expected output (high level):

- Logs showing Python installing requirements.
- Logs showing Node installing packages.
- Lines like:
  - `* Running on http://0.0.0.0:5001` for product-service.
  - `Order service listening on port 5002` for order-service.

Keep this running in one terminal.

### 2. Test Product Service

Open a new terminal and run:

```bash
curl http://localhost:5001/health
```

Expected output:

```json
{"service":"product","status":"ok"}
```

List products:

```bash
curl http://localhost:5001/products
```

Expected output (order may vary):

```json
[
  {"id":1,"name":"Laptop","price":1000.0},
  {"id":2,"name":"Mouse","price":20.0}
]
```

Search products (normal use):

```bash
curl "http://localhost:5001/products/search?name=Lap"
```

Expected:

```json
[
  {"id":1,"name":"Laptop","price":1000.0}
]
```

Check exposed secret:

```bash
curl http://localhost:5001/secret
```

Expected:

```json
{"api_secret":"SUPER_SECRET_API_KEY_123"}
```

### 3. Test Order Service

Health:

```bash
curl http://localhost:5002/health
```

Expected:

```json
{"service":"order","status":"ok"}
```

List orders:

```bash
curl http://localhost:5002/orders
```

Expected:

```json
[
  {"id":1,"product_name":"Laptop","quantity":1},
  {"id":2,"product_name":"Mouse","quantity":2}
]
```

Search orders:

```bash
curl "http://localhost:5002/orders/search?product=Laptop"
```

Expected:

```json
[
  {"id":1,"product_name":"Laptop","quantity":1}
]
```

View leaked secrets:

```bash
curl http://localhost:5002/debug-secrets
```

Expected:

```json
{
  "jwt_secret": "MY_JWT_SECRET_456",
  "payment_api_key": "PAYMENT_API_KEY_ABC"
}
```

### 4. Demonstrate SQL Injection (manually, just to understand)

Do **not** fix it yet; you want something for scanners to find later.

Example payload (you might see an error or unexpected behavior):

```bash
curl "http://localhost:5001/products/search?name=' OR 1=1 -- "
```

The query will log in container output (in the `docker-compose up` terminal), showing concatenated SQL, which is bad.

***

## Minimal README Seed

Create a simple README scaffold to expand later:

```bash
cat > README.md << 'EOF'
# DevSecOps Demo - Insecure Microservices

This repository contains a deliberately vulnerable microservices application:

- Python Flask Product Service (port 5001)
- Node.js Order Service (port 5002)
```
Run locally:

```bash
docker-compose up --build
```

Then:

- Product health: http://localhost:5001/health
- Order health:   http://localhost:5002/health
EOF

***

If everything works (both services up, curl commands returning the expected JSON), Day 1 is complete.  
