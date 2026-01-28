**cleanly and correctly on Debian 12**.

---

## 🔴 Problem (in simple words)

Minikube uses **Docker** as its driver.
Your user **does not have permission** to access:

```
/var/run/docker.sock
```

So Docker commands fail unless you use `sudo`.

---

## ✅ FIX for Debian 12 (Recommended Way)

### **Step 1: Make sure Docker is running**

```bash
sudo systemctl status docker
```

If not running:

```bash
sudo systemctl start docker
sudo systemctl enable docker
```

---

### **Step 2: Add your user to docker group**

Run **exactly this**:

```bash
sudo usermod -aG docker shuhari
```

(or generic)

```bash
sudo usermod -aG docker $USER
```

---

### **Step 3: Refresh group membership (VERY IMPORTANT)**

Choose **one**:

#### Option A (fast, no logout)

```bash
newgrp docker
```

#### Option B (most reliable)

```bash
logout
# then login again
```

---

### **Step 4: Verify Docker access (no sudo!)**

```bash
docker ps
```

✅ If this works **without sudo**, permission issue is fixed.

---

### **Step 5: Start Minikube again**

```bash
minikube start --driver=docker
```

🎉 It should work now.

---

## 🔍 If it STILL fails (rare on Debian 12)

### Check socket permissions

```bash
ls -l /var/run/docker.sock
```

Expected output:

```
srw-rw---- 1 root docker ...
```

If group is NOT `docker`, fix it:

```bash
sudo chown root:docker /var/run/docker.sock
sudo chmod 660 /var/run/docker.sock
```

Restart Docker:

```bash
sudo systemctl restart docker
```

---

## 🧪 Quick sanity test

```bash
docker run hello-world
```

If this runs → Minikube will run ✅

---

## 🧠 Why Debian 12 users hit this more often?

* Debian doesn’t auto-add users to the `docker` group
* Minikube Docker driver **requires non-root docker access**
* Fresh installs = missing group permissions

---
Yep 👍 let’s **check + validate** that command properly.

---

## ✅ Your command

```bash
kubectl port-forward --address 0.0.0.0 service/product-api 5001:5001 &
```

### ✔️ Syntax check

✅ **Command is syntactically correct**

---

## 🔍 What this command actually does

| Part                   | Meaning                                                      |
| ---------------------- | ------------------------------------------------------------ |
| `kubectl port-forward` | Forwards traffic from local machine to a Kubernetes resource |
| `--address 0.0.0.0`    | Listen on **all network interfaces** (not just localhost)    |
| `service/product-api`  | Target is a **Kubernetes Service** named `product-api`       |
| `5001:5001`            | `LOCAL_PORT : SERVICE_PORT`                                  |
| `&`                    | Runs command in **background**                               |

So this exposes:

```
http://<NODE-IP>:5001  →  product-api service → pods
```

---

## ⚠️ Important things to verify (very common mistakes)

### **1️⃣ Service must expose port 5001**

Check:

```bash
kubectl get svc product-api
```

or detailed:

```bash
kubectl describe svc product-api
```

You should see something like:

```
Port: 5001/TCP
TargetPort: 5001
```

❌ If service port ≠ 5001 → port-forward will fail or not respond.

---

### **2️⃣ Pod must be running**

```bash
kubectl get pods -l app=product-api
```

Pods must be:

```
STATUS: Running
READY: 1/1
```

---

### **3️⃣ Security note about `0.0.0.0` (IMPORTANT)**

`--address 0.0.0.0` means:

> Anyone who can reach your machine IP can access the service.

✔️ Good for:

* VM access
* LAN testing
* Docker / Minikube VM access

❌ Bad for:

* Production
* Public servers

If you only need local access, safer command:

```bash
kubectl port-forward service/product-api 5001:5001
```

---

## 🧪 How to confirm it’s working

### **Check background job**

```bash
jobs
```

### **Check listening port**

```bash
ss -tulnp | grep 5001
```

### **Test locally**

```bash
curl http://localhost:5001
```

### **Test from another machine (LAN)**

```bash
curl http://<your-ip>:5001
```

---

## ❌ Common errors & fixes

### Error: `error: unable to forward port`

👉 Pod not ready or wrong port

### Error: `bind: address already in use`

👉 Something already using port 5001
Fix:

```bash
sudo lsof -i :5001
```

---
Alright, this output tells us **exactly** what’s wrong 👀
Your `kubectl port-forward` command is fine — **the problem is the pod itself**.

---

## 🔴 Issue Identified

```
STATUS: ErrImageNeverPull
READY: 0/1
```

This means:

> Kubernetes is trying to start the `product-api` pod,
> but it **cannot find the Docker image** on the node and is **not allowed to pull it**.

So the pod never starts → no container → no port to forward.

---

## 🧠 Why this happens (very common with Minikube)

You are using **Minikube with Docker driver**.

Typical causes:

1. Image was built **on host Docker**, not inside Minikube
2. Image name/tag mismatch in Deployment
3. `imagePullPolicy: Never` (or default) but image doesn’t exist in Minikube

---

## 🔍 Step 1: Check pod events (confirm root cause)

Run:

```bash
kubectl describe pod product-api-7559d89649-tjcr7
```

Near the bottom you’ll see something like:

```
Failed to pull image "product-api:latest": image not found
```

---

## ✅ FIX OPTION 1 (BEST & CLEAN) – Build image inside Minikube

### **Step 1: Switch Docker context to Minikube**

```bash
eval $(minikube docker-env)
```

👉 This makes `docker build` run **inside Minikube’s Docker daemon**

Verify:

```bash
docker info | grep -i minikube
```

---

### **Step 2: Build the product-api image**

From your project directory:

```bash
docker build -t product-api:latest ./product-api
```

(or wherever your Dockerfile is)

Check:

```bash
docker images | grep product-api
```

---

### **Step 3: Restart the pod**

```bash
kubectl delete pod -l app=product-api
```

or:

```bash
kubectl rollout restart deployment product-api
```

---

### **Step 4: Verify**

```bash
kubectl get pods -l app=product-api
```

Expected:

```
READY   STATUS    AGE
1/1     Running
```

---

## ✅ FIX OPTION 2 – Allow pulling from Docker Hub (if image is pushed)

If your image exists on Docker Hub:

```yaml
image: username/product-api:latest
imagePullPolicy: Always
```

Then:

```bash
kubectl apply -f product-api-deployment.yaml
```

⚠️ Requires internet + public repo.

---

## ❌ What NOT to do

* ❌ Don’t use `sudo kubectl`
* ❌ Don’t rebuild image on host Docker without `eval $(minikube docker-env)`
* ❌ Don’t port-forward when pod is not `Running`

---

## 🔁 After pod is RUNNING → port-forward will work

```bash
kubectl port-forward --address 0.0.0.0 service/product-api 5001:5001 &
```

---

## 🧪 Quick health checklist

```bash
kubectl get pods
kubectl get svc product-api
docker images | grep product-api
```

---
Perfect — this output makes the root cause **100% clear**. Nice debugging 👍

---

## 🔴 EXACT PROBLEM (confirmed)

From your pod description:

```
Image:          product-api:test
Reason:         ErrImageNeverPull
Message:        image "product-api:test" is not present with pull policy of Never
```

### Meaning:

* Kubernetes is told **NOT to pull** the image (`imagePullPolicy: Never`)
* BUT the image **does not exist inside Minikube’s Docker**
* So the pod can never start → always Pending

This is **expected behavior**, not a Kubernetes bug.

---

## ✅ THE CORRECT FIX (Minikube + Local Image)

You must build the image **inside Minikube’s Docker daemon**.

---

## 🛠️ STEP-BY-STEP FIX (Do this exactly)

### **Step 1: Point Docker to Minikube**

```bash
eval $(minikube docker-env)
```

Verify (optional):

```bash
docker info | grep -i minikube
```

---

### **Step 2: Build the image with the SAME name**

Your pod expects:

```
product-api:test
```

So build it like this:

```bash
cd ~/secure-devops-project
docker build -t product-api:test ./product-api
```

⚠️ Folder must contain the `Dockerfile`.

Verify:

```bash
docker images | grep product-api
```

Expected:

```
product-api   test   <image-id>
```

---

### **Step 3: Restart the pod**

```bash
kubectl delete pod product-api-7559d89649-tjcr7
```

(or cleaner)

```bash
kubectl rollout restart deployment product-api
```

---

### **Step 4: Confirm pod is running**

```bash
kubectl get pods -l app=product-api
```

Expected:

```
READY   STATUS    RESTARTS
1/1     Running   0
```

---

## ✅ Now your port-forward WILL work

```bash
kubectl port-forward --address 0.0.0.0 service/product-api 5001:5001 &
```

Test:

```bash
curl http://localhost:5001
```

---

## 🧠 Why this happened (important concept)

| Component                | Reality                               |
| ------------------------ | ------------------------------------- |
| Host Docker              | ❌ Not used by Minikube                |
| Minikube Docker          | ✅ Used by kubelet                     |
| `imagePullPolicy: Never` | Kubernetes will ONLY use local images |
| Image missing            | Pod fails immediately                 |

👉 **Local image + Minikube = build inside Minikube**

---

## 🧪 Optional sanity checks

```bash
kubectl get svc product-api
kubectl describe deployment product-api
docker images
```

---

## 🔐 Best practice for DevOps projects

For **local dev**:

```yaml
imagePullPolicy: Never
```

For **CI/CD / prod**:

```yaml
imagePullPolicy: Always
image: dockerhub_user/product-api:tag
```

---
Yep — **same root cause, same fix** 👍
Your **order-api** is failing for **exactly the same reason** as `product-api`.

Let’s fix it cleanly (2 minutes max).

---

## 🔴 Problem (confirmed)

```
order-api-595c6d5b78-nslf6
STATUS: ErrImageNeverPull
```

Which means:

* Image **does not exist inside Minikube**
* `imagePullPolicy: Never`
* Kubernetes refuses to pull

---

## 🔍 Step 1: Confirm image name (quick check)

Run:

```bash
kubectl describe pod order-api-595c6d5b78-nslf6
```

You’ll see something like:

```
Image: order-api:test
```

👉 **Remember this exact image name**.

---

## ✅ FIX (do this in order)

### **Step 1: Switch Docker to Minikube**

(If already done earlier, still run it to be safe)

```bash
eval $(minikube docker-env)
```

---

### **Step 2: Build the order-api image**

Use the **exact same name & tag** as in the pod:

Example:

```bash
cd ~/secure-devops-project
docker build -t order-api:test ./order-api
```

Verify:

```bash
docker images | grep order-api
```

---

### **Step 3: Restart the pod**

```bash
kubectl delete pod -l app=order-api
```

or:

```bash
kubectl rollout restart deployment order-api
```

---

### **Step 4: Verify**

```bash
kubectl get pods -l app=order-api
```

Expected:

```
1/1   Running
```

---

## 🧪 After BOTH pods are running

You can safely expose them:

```bash
kubectl port-forward --address 0.0.0.0 service/order-api 5002:5002 &
kubectl port-forward --address 0.0.0.0 service/product-api 5001:5001 &
```

---

## 🚨 Common mistake (don’t fall into this)

❌ Building images **before** running:

```bash
eval $(minikube docker-env)
```

If you forget that step → images go to **host Docker**, not Minikube.

---

## 🧠 Pro DevOps Tip

For multi-service projects, run once:

```bash
eval $(minikube docker-env)
```

Then build **all** services:

```bash
docker build -t product-api:test ./product-api
docker build -t order-api:test ./order-api
```

---

## ✅ Final health check

```bash
kubectl get pods
kubectl get svc
```

---

If you want, paste:

```bash
kubectl describe pod order-api-595c6d5b78-nslf6
```
