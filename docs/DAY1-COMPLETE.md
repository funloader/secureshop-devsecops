# ✅ DAY 1 COMPLETE - Source Code Security

**Date Completed:** November 1, 2025  
**Time Spent:** ~6-8 hours  

---

## 🎯 Objectives Achieved

- [x] Built Product Service (Python Flask)
- [x] Built Order Service (Node.js Express)
- [x] Planted intentional vulnerabilities
- [x] Installed 4 security scanning tools
- [x] Generated security findings reports
- [x] Documented all findings
- [x] Created automation scripts
- [x] Pushed to GitHub

---

## 🛠️ Tools Installed & Configured

### 1. Gitleaks (Secret Scanning)
- **Version:** v8.18.4
- **Configuration:** `security/configs/.gitleaks.toml`
- **Command:** `gitleaks detect --config=security/configs/.gitleaks.toml --source=.`
- **Findings:** 5 hardcoded secrets detected

### 2. SonarQube Community (SAST)
- **Version:** Community 10.2
- **Running:** Docker container on port 9000
- **Configuration:** `sonar-project.properties`
- **Access:** http://localhost:9000
- **Credentials:** admin / 

### 3. Trivy (Dependency & Container Scanning)
- **Version:** v0.47.0
- **Scans:** Filesystem + Docker images
- **Command:** `trivy fs .` or `trivy image <image>`

### 4. Snyk (Alternative Dependency Scanner)
- **Version:** v1.1293.0
- **Authenticated:** Yes
- **Command:** `snyk test`

---

## 📊 Security Posture - Baseline

**Total Issues Found:** ~50+

**By Severity:**
- 🔴 Critical: 8
- 🟠 High: 15
- 🟡 Medium: 20
- 🔵 Low: 10+

**By Category:**
- Hardcoded secrets: 5
- SQL injection: 1
- Vulnerable dependencies: 30+
- Misconfigurations: 10+
- Missing security controls: Multiple

---

## 🚀 Quick Commands Reference

### Start All Services

**Product Service:**
```
cd apps/product-service
python3 app.py
```

**Order Service:**
```
cd apps/order-service
npm start
```

**SonarQube:**
docker start sonarqube

### Run Security Scans

**All tools at once:**
```
./scripts/run-security-scans.sh
```

**Individual tools:**

**Gitleaks**
gitleaks detect --config=security/configs/.gitleaks.toml --source=.

**Trivy**
trivy fs --severity HIGH,CRITICAL .

**SonarQube**
sonar-scanner

**Snyk**
snyk test


---
## 📁 Project Structure (Day 1)

```text
secureshop-devsecops/
│
├── README.md                          # Your provided README (commit this first)
├── .gitignore                         # Node modules, Docker images, reports
├── .pre-commit-config.yaml           # Gitleaks hook
├── gitleaks.toml                     # Gitleaks config
│
├── apps/                             # Microservices
│   ├── product-service/              # Python Flask
│   │   ├── app.py                   # Vulnerable Flask app
│   │   ├── requirements.txt         # Outdated deps (CVEs)
│   │   ├── Dockerfile               # Runs as root
│   │   └── tests/                   # Basic tests
│   │
│   └── order-service/               # Node.js Express
│       ├── app.js                   # Hardcoded secrets
│       ├── package.json             # Vulnerable deps
│       ├── Dockerfile               # Multi-stage missing USER
│       └── tests/
│
├── docker-compose.yml               # Local dev (Day 1)
├── k8s/                             # Kubernetes manifests (Day 3-4)
│   ├── base/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── configmap.yaml
│   ├── opa-policies/                # OPA Gatekeeper
│   └── helm/                        # Helm charts
│
├── ci/                              # Pipelines
│   ├── jenkins/                     # Jenkinsfile, agents
│   └── github-actions/
│       ├── build-scan.yml          # Trivy, Sonar, ZAP
│       └── deploy-k8s.yml
│
├── security-tools/                  # Tool configs
│   ├── sonarqube/                  # sonar-project.properties
│   ├── vault/                      # Vault policies
│   ├── falco/                      # Falco rules
│   └── defectdojo/                 # API config
│
├── docs/                            # Day-wise guides
│   ├── DAY1.md                     # Apps + Gitleaks/Sonar
│   ├── DAY2-3.md                   # Docker + Pipeline
│   ├── DAY4.md                     # K8s + OPA/Vault
│   └── DAY5.md                     # Runtime + Demo
│
├── reports/                         # Generated (gitignore)
│   ├── gitleaks-report.json
│   ├── sonar-report.json
│   ├── trivy-results.sarif
│   └── kube-bench.json
│
├── terraform/                       # IaC (optional stretch)
│   └── main.tf
│
└── scripts/                         # PowerShell helpers
    ├── setup.ps1                   # One-click prereqs
    ├── scan-all.ps1                # All tools
    └── deploy-minikube.ps1

```
---

# Step 0: Environment Check & Prereqs (15 mins)
```
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


## 🎓 What We Learned

1. **Secret Scanning** - How hardcoded credentials are easily detected
2. **SAST Analysis** - Finding code-level vulnerabilities before runtime
3. **Dependency Management** - Tracking vulnerable packages in our supply chain
4. **Container Security** - Scanning Docker images for OS & app vulnerabilities
5. **Security Automation** - Running multiple tools efficiently
```

✅ Verify: 9 folders created. `dir` shows complete structure.

### ✅ Correct Fix (Safe & Recommended)
#### Step 1: Pull remote changes with rebase

Run:
```
git pull origin main --rebase
```

This will:
* Fetch GitHub’s commits
* Replay your local commit on top
* Keep history clean (no merge commit)

#### Step 2: Push again
```
git push origin main
```
✅ This should now succeed.

#### Final sanity check (after push)

```
git status
git log --oneline --graph --all
```
You should see:
* Clean working tree
* Local and remote in sync

---

## Step 1: Core Files Setup (20 mins)

```
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

---

## Step 2: Product Service (Flask) - VULNERABLE VERSION (45 mins)

```
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

---

## Step 3: Order Service (Node.js) - VULNERABLE VERSION (45 mins)

```
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

## 🔜 Day 1 Status: READY FOR SCANS

✅ Product Service: SQLi + debug mode + old deps
✅ Order Service: 3 hardcoded secrets + 16 vulns (npm audit)
✅ docker-compose: Full stack works
✅ GitHub: Committed with intentional vulns
🚀 NEXT: Gitleaks detects AWS keys in 5 mins


---

## 💡 Pro Tips

1. Run `./scripts/run-security-scans.sh` before every commit
2. Check SonarQube dashboard regularly
3. Update dependencies when vulnerabilities are found
4. Document new findings as they appear

---

**Status:** ✅ Day 1 Complete - Ready for Day 2!  
**Next Session:** Jenkins Pipeline Setup
