# ✅ STEP 7 — Runtime Security (Falco) Day 2

Already created earlier.
To deploy:

```powershell
helm repo add falcosecurity https://falcosecurity.github.io/charts
helm install falco falcosecurity/falco
```

The main issue now is that your previous install attempt failed because **Chocolatey needs Administrator privileges**. You are currently in `C:\WINDOWS\system32`, which is already an elevated folder, but it looks like your PowerShell session itself wasn’t running as Administrator.

Here’s what to do next:

---

### **1️⃣ Open a truly elevated PowerShell**

* Press `Win`.
* Type `PowerShell`.
* Right-click **Windows PowerShell** → **Run as Administrator**.
* Confirm the UAC prompt.
* The title bar should say: **Administrator: Windows PowerShell**.

---

### **2️⃣ Install Helm**

In that elevated PowerShell, run:

```powershell
choco install kubernetes-helm -y
```

* The `-y` automatically accepts the license.
* This should complete successfully without permission errors.

---

### **3️⃣ Verify Helm**

After installation, still in the same Admin PowerShell:

```powershell
helm version
```

You should see Helm’s client version output.

---

Once Helm works, your original commands will succeed:

```powershell
helm repo add falcosecurity https://falcosecurity.github.io/charts
helm install falco falcosecurity/falco
```

---

💡 **Tip:** Chocolatey often fails silently if not running as Admin, even if you’re in `C:\Windows\System32`. Always open a **new Admin session**.

---

Ah! This is exactly the same **permissions problem** we saw with Helm. The key lines:

```
Chocolatey detected you are not running from an elevated command shell
Access to the path 'C:\ProgramData\chocolatey\lib-bad' is denied.
```

💡 Chocolatey **cannot install system-wide packages without Administrator privileges**. That’s why `minikube` and `kubernetes-cli` are failing.

---

you’ll be running PowerShell **as a normal user**, so any attempt to install Minikube via Chocolatey will fail.

---

### **Two ways to fix this**

#### **1️⃣ Run PowerShell as Administrator (recommended)**

1. Close your current PowerShell.
2. Press `Win`.
3. Type `PowerShell`.
4. Right-click **Windows PowerShell** → **Run as Administrator**.
5. Confirm UAC prompt.
6. Install Minikube:

```powershell
choco install minikube -y
```

7. Start the cluster:

```powershell
minikube start
kubectl get nodes
helm install falco falcosecurity/falco
```

This is the standard way on Windows.

---

#### **2️⃣ Install Minikube without Admin rights**

If you **cannot get admin access**, you can install Minikube manually in your user folder:

1. Download the **Windows Minikube binary** from the [Minikube releases page](https://github.com/kubernetes/minikube/releases/latest).

   * Get `minikube-windows-amd64.exe`.
2. Rename it to `minikube.exe`.
3. Put it somewhere in your user PATH (e.g., `C:\Users\Hrishikesh\bin\` — you may need to create this folder).
4. Add that folder to your **user PATH**:

   * `Win + X → System → Advanced system settings → Environment Variables → User variables → Path → Edit → New → C:\Users\Hrishikesh\bin`
5. Open a **new PowerShell** and test:

```powershell
minikube version
minikube start --driver=hyperv   # or docker if you have Docker installed
kubectl get nodes
```

Once Minikube is running, Helm will work normally.

---

✅ **Summary:**

* The Chocolatey errors are **not Helm/Minikube issues**, they are **Windows permissions issues**.
* You **must run PowerShell as Administrator** for system-wide Chocolatey installs.
* Or manually install Minikube/Helm in your user folder to bypass admin rights.

