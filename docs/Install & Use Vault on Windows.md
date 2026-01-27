# ✅ STEP 4 — Vault (Secrets Injection) Day 2

### 📁 `security/vault/dev-secret.hcl`

```powershell
@"
path "secret/data/secureshop" {
  capabilities = ["read"]
}
"@ | Out-File security/vault/dev-policy.hcl
```

### Store secret

```powershell
vault kv put secret/secureshop db_password="supersecure123"
```

Perfect — this error is **expected** on Windows if Vault isn’t installed yet.

> ❌ `vault : The term 'vault' is not recognized`

That means **Vault CLI is not installed or not in PATH**.

---

# ✅ Fix: Install & Use Vault on Windows (Step-by-Step)

## 1️⃣ Download Vault (Windows)

👉 Go to:
[https://developer.hashicorp.com/vault/downloads](https://developer.hashicorp.com/vault/downloads)

Download:

* **Windows → amd64 → ZIP**

Extract it to:

```
C:\HashiCorp\Vault\
```

You should now have:

```
C:\HashiCorp\Vault\vault.exe
```

---

## 2️⃣ Add Vault to PATH

### Temporary (current PowerShell session)

```powershell
$env:PATH += ";C:\HashiCorp\Vault"
```

### Permanent (recommended)

Run PowerShell **as Administrator**:

```powershell
setx PATH "$env:PATH;C:\HashiCorp\Vault"
```

Then **restart PowerShell**.

---

## 3️⃣ Verify Vault Works

```powershell
vault version
```

✅ Expected output:

```
Vault v1.x.x
```

---

## 4️⃣ Start Vault in Dev Mode (Local Testing)

```powershell
vault server -dev
```

You’ll see:

* Root token
* Vault address (usually `http://127.0.0.1:8200`)

⚠️ Leave this terminal open.

---

## 5️⃣ Set Vault Environment Variables (New Terminal)

Open **another PowerShell window**:

```powershell
$env:VAULT_ADDR="http://127.0.0.1:8200"
$env:VAULT_TOKEN="root-token-from-output"
```

(Replace with the token shown in step 4)

---

## 6️⃣ Enable KV v2 (Required for your policy)

```powershell
vault secrets enable -path=secret kv-v2
```

---

## 7️⃣ Apply Your Policy

```powershell
vault policy write dev-policy security/vault/dev-policy.hcl
```

---

## 8️⃣ Now Store the Secret ✅

Your earlier command will now work:

```powershell
vault kv put secret/secureshop db_password="supersecure123"
```

Verify:

```powershell
vault kv get secret/secureshop
```

---

## ⚠️ Important Note (Policy Fix)

Because you're using **KV v2**, your policy path is correct:

```hcl
path "secret/data/secureshop" {
  capabilities = ["read"]
}
```

✔️ That matches:

```bash
vault kv get secret/secureshop
```

---

## ✅ You Now Have:

* Vault installed
* Dev server running
* KV secrets engine enabled
* Policy created
* Secret stored successfully

---

