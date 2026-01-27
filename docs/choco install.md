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
