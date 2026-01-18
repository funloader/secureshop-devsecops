#!/bin/bash

# Security Scan Runner for SecureShop
# Runs all Day 1 security tools

set -e  # Exit on error

echo "🔐 SecureShop Security Scanner"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Navigate to project root
cd "$(dirname "$0")/.."

echo "📁 Project root: $(pwd)"
echo ""

# 1. Gitleaks
echo -e "${YELLOW}[1/4] Running Gitleaks (Secret Scanning)...${NC}"
if gitleaks detect --config=security/configs/.gitleaks.toml --source=. --report-path=gitleaks-report.json --verbose; then
    echo -e "${GREEN}✅ Gitleaks: No secrets detected${NC}"
else
    echo -e "${RED}⚠️  Gitleaks: Secrets found! Check gitleaks-report.json${NC}"
fi
echo ""

# 2. Trivy Filesystem
echo -e "${YELLOW}[2/4] Running Trivy (Dependency Scanning)...${NC}"
trivy fs --format json --output trivy-fs-report.json .
trivy fs --severity HIGH,CRITICAL .
echo -e "${GREEN}✅ Trivy filesystem scan complete${NC}"
echo ""

# 3. Trivy Container (if images exist)
echo -e "${YELLOW}[3/4] Running Trivy (Container Scanning)...${NC}"
if docker images | grep -q "secureshop/product-service"; then
    trivy image --format json --output trivy-container-product.json secureshop/product-service:latest
    trivy image --severity HIGH,CRITICAL secureshop/product-service:latest
    echo -e "${GREEN}✅ Product Service container scanned${NC}"
else
    echo -e "${YELLOW}⚠️  Product Service image not found. Build with: docker build -t secureshop/product-service:latest apps/product-service/${NC}"
fi

if docker images | grep -q "secureshop/order-service"; then
    trivy image --format json --output trivy-container-order.json secureshop/order-service:latest
    trivy image --severity HIGH,CRITICAL secureshop/order-service:latest
    echo -e "${GREEN}✅ Order Service container scanned${NC}"
else
    echo -e "${YELLOW}⚠️  Order Service image not found. Build with: docker build -t secureshop/order-service:latest apps/order-service/${NC}"
fi
echo ""

# 4. SonarQube
echo -e "${YELLOW}[4/4] Running SonarQube Analysis...${NC}"
if docker ps | grep -q "sonarqube"; then
    sonar-scanner
    echo -e "${GREEN}✅ SonarQube scan complete. View at http://localhost:9000${NC}"
else
    echo -e "${RED}⚠️  SonarQube not running. Start with: docker start sonarqube${NC}"
fi
echo ""

echo "========================================"
echo -e "${GREEN}🎉 All security scans complete!${NC}"
echo ""
echo "📊 View reports:"
echo "   - Gitleaks: gitleaks-report.json"
echo "   - Trivy: trivy-*-report.json"
echo "   - SonarQube: http://localhost:9000"
echo ""
echo "📄 Full findings: docs/SECURITY-FINDINGS.md"

