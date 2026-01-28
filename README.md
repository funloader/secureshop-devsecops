### 🚀 End to End Secure Microservices Pipeline

A hands-on DevSecOps implementation focusing on shifting security left.

#### 🛠 Tech Stack

* **Infrastructure:** Docker, Docker-Compose, Kubernetes (Minikube).
* **CI/CD:** GitHub Actions.
* **Security Tools:** * **SCA:** Trivy (Filesystem & Image)
* **SAST:** Gitleaks, SonarQube
* **DAST:** OWASP ZAP
* **Compliance:** Kube-bench (CIS Benchmarks)
* **Policy-as-Code:** OPA (Open Policy Agent)



#### 🛡 Security Milestones

1. **Secrets Management:** Identified hardcoded AWS keys using **Gitleaks**; implemented conceptual remediation via **HashiCorp Vault**.
2. **Vulnerability Management:** Discovered 40+ Critical CVEs in legacy base images using **Trivy**; optimized Dockerfiles for security.
3. **Cluster Auditing:** Performed automated audits of K8s nodes using **Kube-bench** to ensure CIS compliance.
4. **Runtime Analysis:** Conducted automated **DAST** scans using **OWASP ZAP** to identify missing security headers and version disclosure.
