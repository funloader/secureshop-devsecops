**Day 1 Start: Complete PowerShell Setup (4 hours total)**

Open PowerShell as Administrator in your project root. Copy-paste these commands exactly as shown. Each step includes verification.

## Step 0: Environment Check & Prereqs (15 mins)

```powershell
# 1. Navigate to your repo (replace with your actual path)
cd "C:\Users\Hrishikesh\Documents\secureshop-devsecops"
pwd

# 2. Check Docker Desktop running
docker --version
docker ps  # Should show no errors

# 3. Check Node/Python
node --version
python --version
npm --version

# 4. Create full folder structure
New-Item -ItemType Directory -Force -Path @("apps/product-service","apps/order-service","ci/github-actions","k8s/base","security-tools","docs","scripts","reports")
```

**✅ Verify**: 9 folders created. `dir` shows complete structure.

## Step 1: Core Files Setup (20 mins)

```powershell
# 5. Create .gitignore
@"
# OS
.DS_Store
Thumbs.db

# Node
node_modules/
npm-debug.log

# Python
__pycache__/
*.pyc
.env
.venv/

# Docker
*.log
docker-compose.override.yml

# Reports (generated)
reports/
*.sarif
*.json
sonarqube/

# IDE
.vscode/
.idea/
"@ | Out-File -FilePath .gitignore -Encoding UTF8

# 6. Copy your README.md here (you already have it)
# 7. Create initial commit
git add .
git commit -m "Initial SecureShop structure with README"
git push origin main
```

**✅ Verify**: GitHub shows repo with structure + README.

## Step 2: Product Service (Flask) - VULNERABLE VERSION (45 mins)

```powershell
# 8. Create vulnerable Flask app
cd apps/product-service
@"
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
    products = [{"id": row[0], "name": row [linkedin](https://www.linkedin.com/pulse/automating-windows-security-audits-powershell-tool-bhutto-xjn8f), "price": row [cloudthat](https://www.cloudthat.com/resources/blog/unleashing-the-power-of-powershell-automation-security-and-devops/), "stock": row [azure.microsoft](https://azure.microsoft.com/en-in/solutions/devsecops)} for row in c.fetchall()]
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
"@ | Out-File -FilePath app.py -Encoding UTF8

# 9. Vulnerable requirements.txt (old versions with CVEs)
@"
Flask==2.0.3    # Old version with vulns
Werkzeug==2.0.3 # Known issues
"@ | Out-File -FilePath requirements.txt -Encoding UTF8

# 10. Test it works
pip install -r requirements.txt
python app.py
```

**New PowerShell tab**: Test the SQLi + secret exposure:
```powershell
# Terminal 2: Test vulnerable endpoints
curl http://localhost:5000/
curl "http://localhost:5000/products/search?name=laptop"
curl "http://localhost:5000/products/search?name=%; DROP TABLE products;--"
```

**Stop Flask** (Ctrl+C) after seeing responses.

**✅ Checkpoint 1**: App runs, SQLi works, secret partially exposed.

## Step 3: Order Service (Node.js) - VULNERABLE VERSION (45 mins)

```powershell
# 11. Back to product-service parent, create Node app
cd ..\order-service

# 12. package.json with hardcoded secrets + old deps
@"
{
  "name": "secureshop-order-service",
  "version": "1.0.0",
  "description": "Vulnerable Node.js order service",
  "main": "app.js",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.17.1",
    "sqlite3": "^5.0.2",
    "jsonwebtoken": "^8.5.1"
  }
}
"@ | Out-File -FilePath package.json -Encoding UTF8

# 13. Vulnerable app.js
@"
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
  db.run(`CREATE TABLE orders (
    id INTEGER PRIMARY KEY,
    customer_name TEXT,
    customer_email TEXT,
    product_id INTEGER,
    quantity INTEGER
  )`);
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
  db.run(`INSERT INTO orders (customer_name, customer_email, product_id, quantity) 
          VALUES (?, ?, ?, ?)`, 
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
"@ | Out-File -FilePath app.js -Encoding UTF8

# 14. Install & test
npm install
npm start
```

**New PowerShell tab**: Test it:
```powershell
curl http://localhost:3000/
curl -X POST http://localhost:3000/orders -H "Content-Type: application/json" -d "{\"customer_name\":\"Hrishikesh\",\"product_id\":1,\"quantity\":2}"
curl http://localhost:3000/orders
```

**✅ Checkpoint 2**: Both services run with intentional vulns visible.

## Step 4: docker-compose.yml for Local Testing (15 mins)

```powershell
# 15. Back to repo root
cd ..\..

# 16. Vulnerable docker-compose.yml
@"
version: '3.8'
services:
  product-service:
    build: ./apps/product-service
    ports:
      - "5000:5000"
    # INTENTIONALLY VULNERABLE: runs as root

  order-service:
    build: ./apps/order-service  
    ports:
      - "3000:3000"
    # No healthcheck, no securityContext
"@ | Out-File -FilePath docker-compose.yml -Encoding UTF8

# 17. Test full stack
docker-compose up --build
```

**New tab test**:
```powershell
curl http://localhost:5000/products
curl -X POST http://localhost:3000/orders -H "Content-Type: application/json" -d "{\"customer_name\":\"Test\",\"product_id\":1,\"quantity\":3}"
```

## Day 1 Checkpoint: Security Scans (60 mins)

**Type this exactly after docker-compose stops**:

```
Day 1 scans ready
```

**Current Status**: 
- ✅ Apps built with 8 intentional vulns
- ✅ docker-compose works 
- ✅ Secrets/SQLi exposed for Day 1 scans
- ⏳ Gitleaks/SonarQube/Trivy next

**Reply "Day 1 scans ready"** → Get Gitleaks + SonarQube setup catching your secrets immediately.

**Total time so far: 3 hours. Perfect pacing! 🚀**


**Day 1 Scans: Gitleaks + SonarQube + Snyk (60 mins)**

Perfect! Apps are vulnerable and ready. Now we'll install security tools and watch them catch your intentional issues. Continue in **same PowerShell window** (repo root).

## Step 5: Gitleaks - Secret Scanning (15 mins)

```powershell
# 18. Install Gitleaks (Windows binary)
cd C:\Users\Hrishikesh\Documents\secureshop-devsecops
winget install gitleaks.gitleaks  # OR download from GitHub releases

# 19. Create Gitleaks config
@"
title = "SecureShop Secret Patterns"
[[rules]]
id = "stripe-secrets"
description = "Stripe API keys"
regex = '''sk_live_....|sk_test_....'''
entropy = 4.1
[[rules]]
id = "aws-keys"
description = "AWS Access Key ID"
regex = '''AKIA[0-9A-Z]{16}'''
[[rules]]
id = "jwt-secrets"
description = "JWT Secret Keys"
regex = '''(?i)(secret|key|token)([-_]?phrase|=|"|`'){1}["]?[^"\r\n]{8,}["]'''
"@ | Out-File -FilePath gitleaks.toml -Encoding UTF8

# 20. SCAN - Should find 3 secrets immediately!
gitleaks detect --source . --report-format json --report-path reports/gitleaks-report.json --verbose

# 21. View results
Get-Content reports/gitleaks-report.json | ConvertFrom-Json | Format-Table Description, File, Line, Match
```

**✅ Expected**: Finds `STRIPE_SECRET`, `AWS_ACCESS_KEY`, `JWT_SECRET`. Screenshot this!

## Step 6: SonarQube Community - SAST (25 mins)

```powershell
# 22. Download SonarScanner (if not from prior work)
mkdir sonarqube -Force
cd sonarqube
Invoke-WebRequest -Uri "https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-windows.zip" -OutFile sonar-scanner.zip
Expand-Archive sonar-scanner.zip -DestinationPath .
cd ..

# 23. Sonar project config
@"
sonar.projectKey=secureshop-devsecops
sonar.projectName=SecureShop DevSecOps Demo
sonar.sources=apps
sonar.exclusions=**/node_modules/**,**/tests/**
sonar.python.version=3.9
sonar.nodejs.executable=nodejs
"@ | Out-File -FilePath sonar-project.properties -Encoding UTF8

# 24. START SONARQUBE (new PowerShell Admin tab)
# Terminal 2: Start SonarQube
cd sonarqube\sonarqube-10.4.0.12330\bin\windows-x86-64
Start-Process -FilePath .\StartSonar.bat

# 25. Wait 2 mins, then test localhost:9000 → admin/admin → Create project "secureshop-devsecops"
# Back to main terminal after setup:
cd C:\Users\Hrishikesh\Documents\secureshop-devsecops
.\sonarqube\sonar-scanner-5.0.1.3006-windows\bin\sonar-scanner.bat
```

**✅ Expected**: 
- `localhost:9000` shows SAST issues: SQLi in Flask, debug mode, missing validation
- 15+ issues across Python/Node
- Quality Gate FAIL (perfect for demo!)

## Step 7: Snyk OSS - Dependency Scanning (15 mins)

```powershell
# 26. Install Snyk CLI
npm install -g snyk
snyk auth  # Follow browser link, paste token

# 27. Scan both services
cd apps\product-service
snyk test --json-file=../../reports/snyk-product.json
cd ..\order-service
snyk test --json-file=../../reports/snyk-order.json
cd ..\..

# 28. View high/critical vulns
Get-Content reports\snyk-product.json | ConvertFrom-Json | Select-Object -ExpandProperty vulnerabilities | Where-Object severity -in @("high","critical") | Format-Table id, title, severity
```

**✅ Expected**: 
- Flask/Werkzeug CVEs in product-service
- Express/sqlite3 CVEs in order-service
- 8+ vulnerabilities total

## Step 8: GitHub Actions Workflow (5 mins)

```powershell
# 29. Create first workflow
mkdir ci\github-actions -Force
@"
name: Day 1 - Source Code Security
on: [push, pull_request]
jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Gitleaks Scan
      uses: gitleaks/gitleaks-action@v2
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        
    - name: SonarQube Scan
      uses: sonarsource/sonarqube-scan-action@v1
      with:
        args: >
          -Dsonar.projectKey=secureshop-devsecops
          -Dsonar.organization=your-org
          -Dsonar.host.url=https://sonarcloud.io
      
    - name: Snyk Dependency Scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      with:
        args: --severity-threshold=high
"@ | Out-File -FilePath ci\github-actions\day1-scans.yml -Encoding UTF8

# 30. Commit everything
git add .
git commit -m "Day 1: Vulnerable apps + Gitleaks/SonarQube/Snyk scans complete"
git push origin main
```

## 🚨 **Day 1 MASTER CHECKPOINT** (Verify ALL):

```
✅ [ ] Gitleaks found 3 secrets (screenshot)
✅ [ ] SonarQube localhost:9000 shows 15+ issues  
✅ [ ] Snyk found 8+ dependency vulns
✅ [ ] docker-compose up works (both APIs)
✅ [ ] GitHub Actions workflow in repo
✅ [ ] Repo structure matches checklist
```

**Copy-paste your results**:
```
Gitleaks: X secrets found
SonarQube: XX issues (X critical)
Snyk: X high/critical vulns
docker-compose: Y/N working
```

**Reply with your results** → **Day 2: Docker + Trivy** automatically starts! 

**Time check**: 4 hours total. You're crushing it! 🚀
