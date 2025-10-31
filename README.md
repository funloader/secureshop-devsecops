# 🔐 SecureShop - DevSecOps Security Showcase

> End-to-End Security Pipeline with 18 Open-Source Tools

## 📋 Project Overview

A complete DevSecOps demonstration featuring a microservices e-commerce application with security scanning at every stage - from code commit to runtime monitoring.

## 🏗️ Architecture

- **Product Service** (Python Flask) - Product catalog & inventory management
- **Order Service** (Node.js Express) - Order processing & customer management
- **Database** - SQLite (embedded)

## 🛠️ Security Tools Integrated

### Source Code Security
- ✅ Gitleaks - Secret scanning
- ✅ SonarQube Community - SAST
- ✅ Snyk - Dependency scanning
- ✅ Trivy - Filesystem scanning

### CI/CD Security
- ✅ Jenkins - Pipeline orchestration
- ✅ GitHub Actions - Alternative pipeline
- ✅ Docker - Containerization
- ✅ Trivy - Container scanning
- ✅ Clair - Container vulnerability analysis
- ✅ Sigstore/Cosign - Image signing
- ✅ Open Policy Agent - Policy enforcement

### Infrastructure Security
- ✅ Terraform - Infrastructure as Code
- ✅ Kubernetes/Minikube - Container orchestration
- ✅ Helm - Package management
- ✅ Kube-bench - K8s security audit
- ✅ HashiCorp Vault - Secrets management
- ✅ Ansible - Configuration management

### Runtime Security
- ✅ Falco - Runtime threat detection
- ✅ OWASP ZAP - API security testing
- ✅ DefectDojo - Vulnerability management
- ✅ OSQuery - Infrastructure monitoring
- ✅ Anchore - Policy-based container analysis

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Python 3.9+
- Node.js 14+
- Git
- 8GB RAM minimum

### Run Locally

#### Product Service

Navigate to product service directory:

    cd apps/product-service

Install dependencies:

    pip install -r requirements.txt

Run the service:

    python app.py

Service runs on: http://localhost:5000

#### Order Service

Navigate to order service directory:

    cd apps/order-service

Install dependencies:

    npm install

Start the service:

    npm start

Service runs on: http://localhost:3000

## 📊 API Endpoints

### Product Service

- `GET /` - Health check
- `GET /products` - List all products
- `GET /products/<id>` - Get single product
- `GET /products/search?name=<term>` - Search products
- `POST /products` - Create product
- `PUT /products/<id>` - Update product stock

### Order Service

- `GET /` - Health check
- `GET /orders` - List all orders
- `GET /orders/<id>` - Get single order
- `POST /orders` - Create new order
- `DELETE /orders/<id>` - Cancel order

## 🧪 Testing the APIs

### Create a test order

    curl -X POST http://localhost:3000/orders \
      -H "Content-Type: application/json" \
      -d '{"customer_name": "John Doe", "customer_email": "john@example.com", "product_id": 1, "quantity": 2}'

### Get all products

    curl http://localhost:5000/products

### Search for a product

    curl "http://localhost:5000/products/search?name=laptop"

## 🔒 Intentional Vulnerabilities

This project includes **intentional security issues** for demonstration purposes:

1. **Hardcoded secrets** - API keys and passwords in source code
2. **SQL injection** - Vulnerable search endpoint in Product Service
3. **Outdated dependencies** - Old package versions with known CVEs
4. **Debug mode enabled** - Flask debug=True in production
5. **Running containers as root** - No USER directive in Dockerfiles
6. **No input validation** - Missing email format checks
7. **Stack trace exposure** - Detailed error messages in responses
8. **No rate limiting** - APIs vulnerable to abuse
9. **Missing authentication** - No auth/authorization mechanisms

**These will be detected by our security tools!**

## 📚 Documentation

- [Day 1: Application Setup](docs/DAY1.md)
- [Day 2-3: CI/CD Pipeline](docs/DAY2-3.md)
- [Day 4: Infrastructure Security](docs/DAY4.md)
- [Day 5: Runtime Security](docs/DAY5.md)

## 🎯 Project Status

- [x] Day 1: Applications built
- [ ] Day 2: Jenkins pipeline
- [ ] Day 3: Security scanning
- [ ] Day 4: Kubernetes deployment
- [ ] Day 5: Runtime monitoring

## 🏆 Learning Outcomes

After completing this project, you will understand:

- How to integrate security tools into CI/CD pipelines
- Source code security scanning (SAST, SCA)
- Container security best practices
- Infrastructure as Code security
- Runtime threat detection
- Policy enforcement automation
- Vulnerability management workflows

## 🤝 Contributing

This is a learning project! Feel free to:

- Report issues
- Suggest improvements
- Add more security tools
- Enhance documentation

## 👤 Author

**funloader**

- GitHub: [@funloader](https://github.com/funloader)
- LinkedIn: [Hrishikesh Bhuskade](https://linkedin.com/in/bnhrishikesh)

## 📄 License

MIT License - Feel free to use for learning!

## 🙏 Acknowledgments

Built with free and open-source security tools:

- Jenkins, Docker, Kubernetes, Helm
- Trivy, Falco, OPA, Vault
- SonarQube, Gitleaks, OWASP ZAP
- And many more amazing FOSS projects!

---

⭐ **Star this repo** if you find it helpful for learning DevSecOps!

💬 **Questions?** Open an issue - happy to help!
