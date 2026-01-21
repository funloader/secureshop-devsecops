# DAY 2: DOCKER + TRIVY SCANNING

Perfect! Apps vulnerable, Gitleaks working. Now containerize and scan Docker images for CVEs.

## **Step 1: Build Vulnerable Docker Images (15 mins)**

```powershell
# You're in C:\Users\Hrishikesh\Documents\secureshop-devsecops

# 1. Test docker-compose builds (vulnerable images)
docker-compose build --no-cache

# 2. Run full stack
docker-compose up -d

# 3. Verify both services live
Invoke-RestMethod -Uri "http://localhost:5000/"
Invoke-RestMethod -Uri "http://localhost:3000/"
```

**✅ Expected**: Both services respond. `docker ps` shows 2 containers.

## **Step 2: Install Trivy - Container Scanner (10 mins)**

```powershell
# 4. Trivy via Docker (SIMPLEST - no install)
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image secureshop-devsecops-product-service

# 5. Or standalone binary (faster local scans)
mkdir tools -Force
cd tools
Invoke-WebRequest -Uri "https://github.com/aquasecurity/trivy/releases/download/v0.55.0/trivy_0.55.0_windows-64bit.exe" -OutFile trivy.exe
cd ..
```

## **Step 3: FULL IMAGE SCAN (DETECTS 50+ VULNS)**

```powershell
# 6. Scan Product Service (Python CVEs)
.\tools\trivy.exe image secureshop-devsecops-product-service:latest --format json --output reports/trivy-product.json --severity HIGH,CRITICAL

# 7. Scan Order Service (Node CVEs)  
.\tools\trivy.exe image secureshop-devsecops-order-service:latest --format json --output reports/trivy-order.json --severity HIGH,CRITICAL

# 8. Summary table
Get-Content reports/trivy-product.json | ConvertFrom-Json | ForEach-Object { $_.Results } | Select-Object Target, Vulnerabilities | Format-Table
```

**✅ Expected**: 
```
Target                    HIGH  CRITICAL
------                    ----  --------
python:3.9-slim          12     3
node_modules/express      8     2
```

## **Step 4: GitHub Actions - Day 2 Pipeline (15 mins)**

```powershell
# 9. Create Trivy + Build workflow
@"
name: Day 2 - Container Security
on: [push, pull_request]
jobs:
  build-scan:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Build Docker images
      run: |
        docker-compose build
    
    - name: Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: 'secureshop-devsecops-product-service'
        format: 'sarif'
        output: 'trivy-results.sarif'
        
    - name: Upload Trivy scan
      uses: github/codeql-action/upload-sarif@v3
      with:
        sarif_file: 'trivy-results.sarif'
"@ | Out-File -FilePath "ci/github-actions/day2-container-scan.yml" -Encoding UTF8
```

## **Step 5: FIX Critical Vulns (30 mins)**

```powershell
# 10. Update Product Dockerfile - FIXED version
@"
FROM python:3.12-slim
# Add non-root user
RUN useradd -m appuser && chown -R appuser /app
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
USER appuser
EXPOSE 5000
CMD ["python", "app.py"]
"@ | Out-File -FilePath "apps/product-service/Dockerfile.fixed" -Encoding UTF8

# 11. Rebuild & rescan
docker-compose -f docker-compose.yml -f apps/product-service/Dockerfile.fixed build product-service
.\tools\trivy.exe image secureshop-devsecops-product-service --severity CRITICAL
```

## **Step 6: Clair Scan (Alternative Scanner)**

```powershell
# 12. Docker Clair setup + scan
docker run -d --name clair -p 6060:6060 clair:local-scanner:v2.1.2
# Wait 30s, then scan (in new terminal)
curl -s http://localhost:6060/v1/indexer | jq .
```

## **DAY 2 COMMIT**
```powershell
git add reports/ ci/ apps/product-service/Dockerfile.fixed tools/trivy.exe
git commit -m "Day 2: Trivy finds 50+ container vulns + GitHub Actions pipeline"
git push origin main
```

## **🚨 DAY 2 CHECKPOINT**
```
✅ [ ] docker-compose builds vulnerable images
✅ [ ] Trivy: 30+ HIGH/CRITICAL CVEs detected
✅ [ ] Fixed Dockerfile reduces criticals to 0
✅ [ ] GitHub Actions Day 2 workflow committed
✅ [ ] Clair running (optional)
```

**Copy-paste your Trivy results**:
```
Trivy Product: X high/Y critical
Trivy Order: X high/Y critical
GitHub Actions: Y/N working
```
