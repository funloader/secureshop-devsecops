# 🧩 SecureShop DevSecOps — Debug & Troubleshooting Log

This document captures the **step-by-step debugging process** followed to get the `run-security-scans.sh` script working correctly in a Windows environment using **PowerShell + WSL (Ubuntu)**.

---

## 🪜 Background

The project repository `secureshop-devsecops` includes a security scanning automation script:

```
scripts/run-security-scans.sh
```

The script runs:

1. **Gitleaks** – Secret Scanning
2. **Trivy** – Vulnerability Scanning
3. **Snyk** – Dependency Scanning
4. (Optionally) **SonarQube** – Static Code Analysis

Initially, the script was designed for Linux/macOS, so it required adaptation to run properly on **Windows PowerShell**.

---

## 🧯 Phase 1: Git Push Rejection (Secrets Detection)

### ❌ Problem

When pushing commits to GitHub, the following error appeared:

```
remote: error: GH013: Repository rule violations found for refs/heads/main.
remote: Push cannot contain secrets
remote: —— Stripe API Key ——
remote: path: docs/SECURITY-FINDINGS.md:35
```

### 🧠 Root Cause

GitHub’s **Push Protection** blocked a commit because it detected a possible secret (Stripe API key) inside a markdown file.

### ✅ Fix

1. Removed or redacted the exposed key from the file:

   ```bash
   git add docs/SECURITY-FINDINGS.md
   git commit --amend --no-edit
   git push origin main --force
   ```
2. After this, the push succeeded:

   ```
   To github.com:funloader/secureshop-devsecops.git
      e7c15af..70c33dc  main -> main
   ```

---

## 🧰 Phase 2: PowerShell Script Execution Failure

### ❌ Problem

Running:

```powershell
bash "scripts/run-security-scans.sh"
```

returned:

```
<3>WSL (1416 - Relay) ERROR: CreateProcessCommon: execvpe(/bin/bash) failed: No such file or directory
```

### 🧠 Root Cause

The **Windows Subsystem for Linux (WSL)** was not installed.
PowerShell could not find a valid `bash` interpreter.

### ✅ Fix

Installed WSL using:

```powershell
wsl --install
```

Then configured Ubuntu and created a Linux user (`funloader`).

---

## 🧮 Phase 3: WSL Shell Issues

After installation, running the script inside WSL initially failed:

```bash
bash scripts/run-security-scans.sh
bash: scripts/run-security-scans.sh: No such file or directory
```

### 🧠 Root Cause

The command was executed from the **home directory (`~`)**, not the project folder.

### ✅ Fix

Navigated correctly:

```bash
cd /mnt/c/Users/Hrishikesh/Documents/secureshop-devsecops
bash scripts/run-security-scans.sh
```

---

## 🔍 Phase 4: Missing Security Tools

Running the script produced:

```
gitleaks: command not found
trivy: command not found
```

### ✅ Fix

Installed tools inside WSL Ubuntu:

#### Install Gitleaks

```bash
sudo apt update
sudo apt install -y wget unzip
wget https://github.com/gitleaks/gitleaks/releases/latest/download/gitleaks_$(uname -s)_$(uname -m).tar.gz -O gitleaks.tar.gz
tar -xzf gitleaks.tar.gz
sudo mv gitleaks /usr/local/bin/
gitleaks version
```

#### Install Trivy

```bash
sudo apt install -y wget apt-transport-https gnupg lsb-release
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
echo deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main | sudo tee /etc/apt/sources.list.d/trivy.list
sudo apt update
sudo apt install trivy -y
trivy --version
```

#### Install Snyk (optional)

```bash
curl -s https://static.snyk.io/cli/latest/snyk-linux -o snyk
chmod +x snyk
sudo mv snyk /usr/local/bin/
snyk --version
```

---

## 🧱 Phase 5: Gitleaks “Dubious Ownership” Error

### ❌ Problem

```
fatal: detected dubious ownership in repository at '/mnt/c/Users/Hrishikesh/Documents/secureshop-devsecops'
```

### 🧠 Root Cause

Git flagged the Windows-mounted directory as unsafe due to differing file permissions between Windows and WSL.

### ✅ Fix

Added the directory as a **safe Git directory**:

```bash
git config --global --add safe.directory /mnt/c/Users/Hrishikesh/Documents/secureshop-devsecops
```

This resolved the ownership warning and allowed Gitleaks to scan commits.

---

## 🧪 Phase 6: Successful Script Execution 🎉

After applying all fixes:

```bash
bash scripts/run-security-scans.sh
```

Output:

```
🔐 SecureShop Security Scanner
========================================
📁 Project root: /mnt/c/Users/Hrishikesh/Documents/secureshop-devsecops

[1/4] Running Gitleaks (Secret Scanning)...
✅ No leaks found

[2/4] Running Trivy (Dependency Scanning)...
✅ Vulnerability DB downloaded
✅ Scanning completed

[3/4] Running Snyk (Dependency Scan)...
✅ Authenticated and scan complete
```

---

## 🪄 Optional Improvement: Auto-Fix in Script

You can add this line at the top of your script to **auto-fix the safe-directory issue**:

```bash
git config --global --add safe.directory "$(pwd)" 2>/dev/null
```

This prevents errors on WSL and CI pipelines.

---

## ✅ Final Working Environment Summary

| Tool            | Version / Status          | Installation Path         |
| --------------- | ------------------------- | ------------------------- |
| OS              | Windows 11 + WSL (Ubuntu) | `/mnt/c/...` mounted path |
| Gitleaks        | ✅ Installed               | `/usr/local/bin/gitleaks` |
| Trivy           | ✅ Installed               | `/usr/bin/trivy`          |
| Snyk (optional) | ✅ Installed               | `/usr/local/bin/snyk`     |
| Git Safe Dir    | ✅ Configured              | Global Git Config         |

---

## 🧾 Key Learnings

* WSL is essential for running Linux-based scripts on Windows PowerShell.
* GitHub Push Protection automatically blocks secrets — always verify `.md` or `.env` files.
* WSL paths (`/mnt/c/...`) differ from Windows paths (`C:\...`).
* Always install required binaries **inside** WSL, not on Windows.
* Git’s *dubious ownership* warning is a security safeguard — can be safely overridden with `safe.directory`.

---

**Author:** Hrishikesh (funloader)
**Last Updated:** November 2, 2025
**Purpose:** Document the full debugging process for SecureShop DevSecOps environment setup.
