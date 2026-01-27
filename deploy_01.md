# Moving from the Windows/Docker Desktop environment to a **Debian 13 (Trixie)** VM in VirtualBox. 


It moves you closer to how production servers actually operate—usually on bare-metal or virtualized Linux.

Since Debian 13 is the cutting-edge version (Trixie), we'll ensure the setup is robust.

---

## 🖥️ Phase 1: VirtualBox VM Preparation

Before you even touch the command line, make sure your VM is "beefy" enough to handle Kubernetes:

* **CPU:** At least **2 Cores** (Minikube will fail with only 1).
* **RAM:** At least **4GB** (8GB is preferred for a smooth experience).
* **Network:** Set to **Bridged Adapter** (if you want to access the APIs from your Windows browser) or **NAT with Port Forwarding**.

---

## 🛠️ Phase 2: Debian OS Initial Setup

Once you've installed Debian 13 and logged in, run these commands to prepare the environment:

```bash
# 1. Update the system
sudo apt update && sudo apt upgrade -y

# 2. Install essential tools
sudo apt install -y curl wget git apt-transport-https ca-certificates gnupg lsb-release

```

---

## 🐳 Phase 3: Install Docker Engine

On Linux, we don't use Docker Desktop. We install the high-performance **Docker Engine**.

```bash
# Add Docker’s official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 3. Add your user to the docker group (so you don't have to type 'sudo' every time)
sudo usermod -aG docker $USER
# IMPORTANT: Log out and log back in for this to take effect!

```

---

## ☸️ Phase 4: Install Minikube & Kubectl

Now we bring the orchestration layer to Debian.

```bash
# Install Kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Start Minikube using the Docker driver
minikube start --driver=docker

```

---

## 📥 Phase 5: Migrating Your Project

Now, pull the code you pushed to GitHub earlier.

```bash
# Clone your repo
git clone https://github.com/funloader/secure-devops-project.git
cd secure-devops-project

# Rebuild the images inside the Minikube environment
eval $(minikube docker-env)
docker compose build

# Apply your K8s manifests
kubectl apply -f k8s/

```

---

## 🌍 Phase 6: Accessing the APIs from Windows

Since the app is now inside a VM, `localhost` on your Windows machine won't work anymore.

1. **Find the VM's IP:** Run `ip addr` in the Debian terminal (look for `enp0s3` or similar). Let's say it's `192.168.1.50`.
2. **Expose the Service:**

```bash
kubectl port-forward --address 0.0.0.0 service/product-api 5001:5001 &

```

3. **On Windows:** Open your browser and go to `http://192.168.1.50:5001/product?id=1`.

---

### 💡 Why this is a "Pro" move:

Interviewers love to see that you aren't just a "Windows User." By running this on Debian 13, you have:

* **Handled Linux Package Management** (`apt`, GPG keys).
* **Managed Linux Permissions** (Groups and `sudo`).
* **Optimized Resource Usage** (No Docker Desktop overhead).
* **Mastered Linux Networking** (Port forwarding across VM boundaries).

**Would you like me to show you how to set up an SSH connection from VS Code on Windows to this Debian VM so you can edit code easily?**
