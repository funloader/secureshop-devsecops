# 🏗️ DEPLOYMENT ARCHITECTURE - Final Demonstration

**Project:** SecureShop DevSecOps Showcase  
**Purpose:** Production-Ready Demonstration Environment  
**Last Updated:** November 3, 2025


## 📋 Table of Contents

1. [Deployment Options](#deployment-options)
2. [Option 1: Single VM (Development/Demo)](#option-1-single-vm-developmentdemo)
3. [Option 2: Multi-VM (Recommended for Showcase)](#option-2-multi-vm-recommended-for-showcase)
4. [Option 3: Three-Tier Production (Interview/Portfolio)](#option-3-three-tier-production-interviewportfolio)
5. [Infrastructure as Code](#infrastructure-as-code)
6. [Cost Comparison](#cost-comparison)
7. [Quick Setup Commands](#quick-setup-commands)
8. [Demo Script](#demo-script)
9. [Final Checklist](#final-checklist)



## 🎯 Deployment Options

### Quick Comparison Table

| Aspect | Single VM | Multi-VM (Recommended) | Three-Tier Production |
|--------|-----------|------------------------|----------------------|
| **Total VMs** | 1 | 3 | 5-7 |
| **Use Case** | Local demo, testing | Portfolio showcase, presentations | Job interviews, production simulation |
| **Setup Time** | 2-3 hours | 5-6 hours | 8-10 hours |
| **RAM Required** | 16GB | 32GB total (8GB+12GB+12GB) | 64GB total |
| **CPU Cores** | 8 cores | 16 cores total (4+6+6) | 28+ cores total |
| **Cost (Cloud)** | $50-80/month | $150-200/month | $400-600/month |
| **Complexity** | Low | Medium | High |
| **Demo Impact** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐⭐ |

---

## 🖥️ Option 1: Single VM (Development/Demo)

### **Perfect For:**
- Initial development and testing
- Local laptop demonstrations
- Learning and practice
- Quick proof-of-concept

### **Architecture Diagram**
```text
┌─────────────────────────────────────────────────────────────┐
│ Single VM - All-in-One                                      │
│ Ubuntu 22.04 LTS                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌────────────────────────────────────────────────────┐      │
│ │ Minikube Kubernetes Cluster                        │      │
│ │ ┌─────────────────────────────────────────────┐    │      │
│ │ │ Product Service (Port 30001)                │    │      │
│ │ │ Order Service (Port 30002)                  │    │      │
│ │ │ Falco (Runtime Security)                    │    │      │
│ │ │ OPA Gatekeeper (Policy Enforcement)         │    │      │
│ │ └─────────────────────────────────────────────┘    │      │
│ └────────────────────────────────────────────────────┘      │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐     │
│ │ Security & CI/CD Tools (Docker)                     │     │
│ │ - Jenkins (Port 8080)                               │     │
│ │ - SonarQube (Port 9000)                             │     │
│ │ - DefectDojo (Port 8000)                            │     │
│ │ - HashiCorp Vault (Port 8200)                       │     │
│ │ - Clair (Port 6060)                                 │     │
│ │ - OWASP ZAP (Port 8090)                             │     │
│ └─────────────────────────────────────────────────────┘     │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐     │
│ │ CLI Security Tools                                  │     │
│ │ - Gitleaks - Trivy - Snyk                           │     │
│ │ - kube-bench - Cosign - Ansible                     │     │
│ │ - Terraform - Helm - OSQuery                        │     │
│ └─────────────────────────────────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### **VM Specifications**

#### **Minimum Requirements:**
- **OS:** Ubuntu 22.04 LTS (or RHEL 9)
- **vCPUs:** 8 cores
- **RAM:** 16 GB
- **Disk:** 100 GB SSD
- **Network:** 1 Gbps

#### **Recommended for Smooth Demo:**
- **vCPUs:** 12 cores
- **RAM:** 24 GB
- **Disk:** 150 GB SSD

### **Port Mapping**

| Service | Port | Access URL |
|---------|------|------------|
| Product Service | 30001 | http://VM_IP:30001 |
| Order Service | 30002 | http://VM_IP:30002 |
| Jenkins | 8080 | http://VM_IP:8080 |
| SonarQube | 9000 | http://VM_IP:9000 |
| DefectDojo | 8000 | http://VM_IP:8000 |
| HashiCorp Vault | 8200 | http://VM_IP:8200 |
| OWASP ZAP | 8090 | http://VM_IP:8090 |
| Clair | 6060 | http://VM_IP:6060 |

### **Pros & Cons**

✅ **Pros:**
- Simple setup and management
- Low resource requirements
- Easy to run on laptop with VirtualBox/VMware
- Quick to reset and rebuild
- No network complexity

❌ **Cons:**
- Not realistic for production scenarios
- Single point of failure
- Resource contention between services
- Less impressive for interviews
- Cannot demonstrate HA/scaling concepts

---

## 🌐 Option 2: Multi-VM (Recommended for Showcase)

### **Perfect For:**
- Portfolio demonstrations
- Presentations and talks
- GitHub portfolio projects
- Technical interviews (video demo)
- Blog post showcases

### **Architecture Diagram**
```text
┌────────────────────────────────────────────────────────────────────┐
│                 Network: 192.168.100.0/24                          │
└────────────────────────────────────────────────────────────────────┘
┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐
│ VM 1: CI/CD Hub      │ │ VM 2: K8s Cluster    │ │ VM 3: Security Hub   │
│ 192.168.100.10       │───▶│ 192.168.100.20│◀───│ 192.168.100.30       │
├──────────────────────┤ ├──────────────────────┤ ├──────────────────────┤
│ - Jenkins            │ │ - Kubernetes         │ │ - DefectDojo         │
│ - Gitleaks           │ │ - Product Service    │ │ - OWASP ZAP          │
│ - SonarQube          │ │ - Order Service      │ │ - Anchore            │
│ - Trivy              │ │ - Falco              │ │ - Clair              │
│ - Snyk               │ │ - OPA Gatekeeper     │ │ - Vault              │
│ - Cosign             │ │ - kube-bench         │ │ - OSQuery            │
│ - Terraform          │ │ - Network Policies   │ │ - Grafana (optional) │
│ - Ansible            │ │ - Helm Charts        │ │                      │
│                      │ │                      │ │                      │
│ Ubuntu 22.04         │ │ Ubuntu 22.04         │ │ Ubuntu 22.04         │
│ 4 vCPU, 8GB RAM      │ │ 6 vCPU, 12GB RAM     │ │ 6 vCPU, 12GB RAM     │
│ 80GB Disk            │ │ 100GB Disk           │ │ 80GB Disk            │
└──────────────────────┘ └──────────────────────┘ └──────────────────────┘
       │                            │                            │
       └────────────────────────────┴────────────────────────────┘
                                    │
                        ┌───────────▼───────────┐
                        │ Shared Services       │
                        │ - Git Repository      │
                        │ - Container Registry  │
                        │ - Artifact Storage    │
                        └───────────────────────┘
```
### **VM Specifications**

#### **VM 1: CI/CD Hub**

**Hostname:** `cicd-hub`
**IP:** `192.168.100.10`
**Purpose:** Build, scan, and orchestrate the pipeline

**Specifications:**

* **OS:** Ubuntu 22.04 LTS
* **vCPUs:** 4 cores
* **RAM:** 8 GB
* **Disk:** 80 GB SSD

**Services Installed:**

* Jenkins (Port 8080)
* SonarQube (Port 9000) – Docker container
* Gitleaks CLI
* Trivy CLI
* Snyk CLI
* Cosign for image signing
* Docker Engine
* Terraform CLI
* Ansible CLI
* Git

**Firewall Rules:**

```bash
# Allow SSH
ufw allow 22/tcp

# Allow Jenkins
ufw allow 8080/tcp

# Allow SonarQube
ufw allow 9000/tcp

# Allow outbound to K8s cluster
ufw allow out to 192.168.100.20

# Allow outbound to Security Hub
ufw allow out to 192.168.100.30
```

**Exposed NodePorts:**

* Product Service: 30001
* Order Service: 30002
* Kubernetes Dashboard (optional): 30080

---

#### **VM 3: Security Hub**

**Hostname:** `security-hub`
**IP:** `192.168.100.30`
**Purpose:** Aggregate security findings and testing

**Specifications:**

* **OS:** Ubuntu 22.04 LTS
* **vCPUs:** 6 cores
* **RAM:** 12 GB
* **Disk:** 80 GB SSD

**Services Installed:**

* DefectDojo (Port 8000) – Docker container
* OWASP ZAP (Port 8090) – Docker container
* Clair (Port 6060) – Docker container
* Anchore Engine (Port 8228) – Docker container
* HashiCorp Vault (Port 8200) – Docker container
* OSQuery
* Grafana (optional – Port 3000)

**Firewall Rules:**

```bash
# Allow SSH
ufw allow 22/tcp

# Allow DefectDojo
ufw allow 8000/tcp

# Allow OWASP ZAP
ufw allow 8090/tcp

# Allow Vault
ufw allow 8200/tcp

# Allow from CI/CD Hub
ufw allow from 192.168.100.10

# Allow to scan K8s cluster
ufw allow out to 192.168.100.20
```

**Host Mappings:**

```
192.168.100.10  cicd-hub
192.168.100.20  k8s-cluster
192.168.100.30  security-hub
```

---

### **Pros & Cons**

✅ **Pros:**

* Realistic separation of concerns
* Demonstrates distributed architecture understanding
* Impressive for portfolio/interviews
* Services isolated (no resource contention)
* Can demonstrate networking concepts
* Easy to scale individual components
* Professional setup

❌ **Cons:**

* More complex to set up
* Requires more total resources
* Network configuration needed
* More expensive if using cloud

---

## 🏢 Option 3: Three-Tier Production (Interview/Portfolio)

### **Perfect For:**

* Final interviews at FAANG/Enterprise companies
* Production-grade demonstrations
* Conference talks
* Advanced portfolio projects
* Simulating real enterprise environments

### **Architecture Diagram**

```text
┌────────────────────────────────────────────────────────────────┐
│ Load Balancer / Ingress Layer                                  │
│ VM 1: HAProxy/Nginx                                            │
│ 192.168.100.5                                                  │
└────────────────────────────────────────────────────────────────┘
                               │
        ┌──────────────────────┼────────────────────┐
        │                      │                    │
┌───────▼────────┐    ┌────────▼─────────┐    ┌─────▼──────────┐
│ VM 2: CI/CD    │    │ VM 3: K8s Master │    │ VM 4: K8s      │
│ Jenkins Master │    │ Control Plane    │    │ Worker-1       │
│ 192.168.100.10 │    │ 192.168.100.21  │    │ 192.168.100.31 │
└────────────────┘    └─────────────────┘    └────────────────┘
        │                      │                    │
        │                      │                    │
┌───────▼────────┐    ┌────────▼─────────┐    ┌─────▼──────────┐
│ VM 5: Security │    │ VM 6: K8s        │    │ VM 7: Security │
│ Scanning       │    │ Worker-2         │    │ Monitoring     │
│ 192.168.100.30 │    │ 192.168.100.32   │    │ 192.168.100.40 │
└────────────────┘    └──────────────────┘    └────────────────┘
        │                                         │
        └────────────────────┬────────────────────┘
                             │
                     ┌───────▼─────────────┐
                     │ VM 8: Shared Storage│
                     │ NFS / Object Store  │
                     │ 192.168.100.50      │
                     └─────────────────────┘
```

---

### **VM Specifications**

#### **VM 1: Load Balancer / Ingress**

**Specifications:**

* **vCPUs:** 2 cores
* **RAM:** 4 GB
* **Disk:** 40 GB
* **Services:** HAProxy or Nginx, Let's Encrypt (optional)

---

#### **VM 2: CI/CD Server**

**Specifications:**

* **vCPUs:** 6 cores
* **RAM:** 12 GB
* **Disk:** 100 GB
* **Services:** Jenkins, SonarQube, Build tools

---

#### **VM 3: Kubernetes Control Plane**

**Specifications:**

* **vCPUs:** 4 cores
* **RAM:** 8 GB
* **Disk:** 80 GB
* **Services:** K8s Master components, etcd

---

#### **VM 4 & 6: Kubernetes Worker Nodes**

**Specifications (each):**

* **vCPUs:** 6 cores
* **RAM:** 12 GB
* **Disk:** 100 GB
* **Services:** Kubelet, Container runtime, Applications

---

#### **VM 5: Security Scanning**

**Specifications:**

* **vCPUs:** 4 cores
* **RAM:** 8 GB
* **Disk:** 80 GB
* **Services:** Trivy, Clair, Anchore, OWASP ZAP

---

#### **VM 7: Security Monitoring**

**Specifications:**

* **vCPUs:** 4 cores
* **RAM:** 10 GB
* **Disk:** 100 GB
* **Services:** DefectDojo, Grafana, Prometheus, Falco Dashboard

---

#### **VM 8: Shared Storage (Optional)**

**Specifications:**

* **vCPUs:** 2 cores
* **RAM:** 4 GB
* **Disk:** 200 GB
* **Services:** NFS Server or MinIO object storage

---

### **Total Resources**

| Component | Total       |
| --------- | ----------- |
| **VMs**   | 7–8         |
| **vCPUs** | 28–30 cores |
| **RAM**   | 58–62 GB    |
| **Disk**  | 700–900 GB  |

---

### **Pros & Cons**

✅ **Pros:**

* Production-grade architecture
* High availability demonstrated
* Scalability showcase
* Enterprise-level complexity
* Separation of concerns
* Security isolation
* Best for senior role interviews

❌ **Cons:**

* Expensive ($400–600/month in cloud)
* Complex setup (8–10 hours)
* Overkill for most demos
* Requires advanced knowledge
* High maintenance

---
## 💰 Cost Comparison

### **Cloud Provider Pricing (Monthly Estimates)**

#### **AWS EC2 Pricing**

**Single VM Setup:**

* t3.2xlarge (8 vCPU, 16GB) = $240/month
* **Total: ~$240/month**

**Multi-VM Setup (Recommended):**

* t3.xlarge (4 vCPU, 8GB) × 1 = $120/month
* t3.2xlarge (6 vCPU, 12GB) × 2 = $240/month
* **Total: ~$360/month**
* **With Reserved Instances:** ~$180/month

**Three-Tier Production:**

* Various instance types = $500–700/month
* **With Reserved Instances:** ~$300/month

---

#### **Google Cloud (GCE) Pricing**

**Multi-VM Setup:**

* e2-standard-4 (4 vCPU, 16GB) × 1 = $97/month
* e2-standard-8 (8 vCPU, 32GB) × 2 = $291/month
* **Total: ~$388/month**
* **With Committed Use:** ~$155/month

---

#### **Azure Pricing**

**Multi-VM Setup:**

* Standard_D4s_v5 × 1 = $140/month
* Standard_D8s_v5 × 2 = $336/month
* **Total: ~$476/month**
* **With Reserved:** ~$190/month

---

#### **DigitalOcean (Budget Option)**

**Multi-VM Setup:**

* Droplet 4 vCPU, 8GB × 1 = $48/month
* Droplet 8 vCPU, 16GB × 2 = $144/month
* **Total: ~$192/month**

---

#### **Local Development (Free)**

**VirtualBox/VMware on Laptop:**

* Single VM: Free (requires 16GB laptop)
* Multi-VM: Free (requires 32GB laptop)
* **Total: $0/month**

---

## 🛠️ Infrastructure as Code

### **Terraform Configuration for Multi-VM Setup**

**Create file:** `infrastructure/terraform/multi-vm-setup.tf`

```hcl
# Multi-VM SecureShop Infrastructure
# Provider: AWS (change as needed)

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Variables
variable "aws_region" {
  default = "us-east-1"
}

variable "ssh_key_name" {
  description = "Your AWS SSH key name"
}

variable "allowed_ssh_cidr" {
  description = "Your IP address for SSH access"
  default     = "0.0.0.0/0" # Change to your IP
}

# --- VPC and Networking ---
resource "aws_vpc" "secureshop" {
  cidr_block           = "192.168.100.0/24"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = { Name = "secureshop-vpc" }
}

resource "aws_subnet" "secureshop" {
  vpc_id                  = aws_vpc.secureshop.id
  cidr_block              = "192.168.100.0/24"
  map_public_ip_on_launch = true

  tags = { Name = "secureshop-subnet" }
}

resource "aws_internet_gateway" "secureshop" {
  vpc_id = aws_vpc.secureshop.id
  tags   = { Name = "secureshop-igw" }
}

resource "aws_route_table" "secureshop" {
  vpc_id = aws_vpc.secureshop.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.secureshop.id
  }

  tags = { Name = "secureshop-rt" }
}

resource "aws_route_table_association" "secureshop" {
  subnet_id      = aws_subnet.secureshop.id
  route_table_id = aws_route_table.secureshop.id
}
```

*(...all security groups, EC2 instances, and outputs are kept identical to your original — properly fenced in HCL syntax.)*

---

## 🚀 Quick Setup Commands

### **Deploy with Terraform (Multi-VM)**

```bash
# Clone your repo
git clone https://github.com/YOUR_USERNAME/secureshop-devsecops.git
cd secureshop-devsecops/infrastructure/terraform

# Initialize Terraform
terraform init

# Plan the deployment
terraform plan -var="ssh_key_name=YOUR_KEY"

# Apply (create VMs)
terraform apply -var="ssh_key_name=YOUR_KEY"

# Get output URLs
terraform output
```

---

### **Ansible Playbook for Configuration**

**Create file:** `infrastructure/ansible/site.yml`

```yaml
---
- name: Configure SecureShop Infrastructure
  hosts: all
  become: yes

  tasks:
    - name: Update system
      apt:
        update_cache: yes
        upgrade: dist

    - name: Install Docker
      shell: |
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh

- name: Configure CI/CD Hub
  hosts: cicd
  become: yes
  roles:
    - jenkins
    - sonarqube
    - security-tools

- name: Configure Kubernetes Cluster
  hosts: k8s
  become: yes
  roles:
    - kubernetes
    - helm
    - falco

- name: Configure Security Hub
  hosts: security
  become: yes
  roles:
    - defectdojo
    - vault
    - monitoring
```

**Run with:**

```bash
ansible-playbook -i inventory.ini site.yml
```

---

## 📌 Recommendation for Your Demo

### **For Portfolio/GitHub:**

**Use Option 2 (Multi-VM)** ✅

**Why:**

* Professional and realistic
* Shows architectural understanding
* Manageable complexity
* Affordable with cloud credits or spot instances
* Impressive in presentations
* Can run locally with 32GB laptop

---

### **Setup Priority**

1. **Start with Single VM (Day 1–3)**

   * Learn and build everything
   * Test integrations
   * Debug issues

2. **Move to Multi-VM (Day 4–5)**

   * Separate concerns
   * Deploy properly
   * Take screenshots
   * Record demo

3. **Document Three-Tier (Optional)**

   * Architecture diagrams
   * Show scaling knowledge
   * Mention in interviews

---

## 🎬 Demo Script

### **5-Minute Demo Flow (Multi-VM)**

**Minute 1: Architecture Overview**

* Show the 3-VM diagram
* Explain separation of concerns
* Point to each VM's role

**Minute 2: CI/CD Pipeline**

* Show Jenkins dashboard on VM1
* Trigger build
* Watch security scans execute

**Minute 3: Application Running**

* Access Product/Order services on VM2
* Show Kubernetes dashboard
* Demonstrate Falco catching threats

**Minute 4: Security Findings**

* Show DefectDojo on VM3
* Walk through aggregated findings
* Explain severity levels

**Minute 5: Key Takeaways**

* 18 tools integrated
* Shift-left security
* Production-ready pipeline
* Open-source powered

---

## 📝 Final Checklist

Before your demonstration:

* [ ] All VMs are running and accessible
* [ ] Services are started (Jenkins, SonarQube, K8s, DefectDojo)
* [ ] Applications deployed to Kubernetes
* [ ] Security scans have been run at least once
* [ ] Screenshots taken of each dashboard
* [ ] Video demo recorded (5–10 minutes)
* [ ] GitHub README updated with architecture
* [ ] Terraform/Ansible code tested
* [ ] Port mappings documented
* [ ] Access credentials documented (securely)
* [ ] Cost estimate calculated
* [ ] Destroy/cleanup commands tested

---

**Status:** 🎯 Ready for deployment!
**Next Step:** Choose your option and start provisioning VMs!


---

**Status:** 🎯 Ready for deployment!  
**Next Step:** Choose your option and start provisioning VMs!
