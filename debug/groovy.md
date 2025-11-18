## ⚠️ Jenkins Pipeline Deletion via Groovy Script Console

This script provides a powerful and immediate way to permanently delete a Jenkins job (Pipeline) and all its associated build history.

### 🚨 Warning: This action is permanent and cannot be undone. You must have Administer permissions on your Jenkins instance to use the Script Console.

### 1. Access the Script Console

 Navigate to your ``Jenkins Dashboard`` 
 ```
 http://your-jenkins-url:8080/
```

Go to ``Manage Jenkins`` > Click on ``Script Console``

### 2. Groovy Script to Delete a Job

Copy the entire script below and paste it directly into the ``Script Console`` text area.
Change ``"Your Job Name"`` to your actual job name.
Paste the following script, ensuring the job name matches exactly:
```
def jobName = "Your Job Name"
def job = Jenkins.instance.getItem(jobName)

if (job != null) {
    job.delete()
    println "SUCCESS: Job '${jobName}' has been permanently deleted."
} else {
    println "ERROR: Job '${jobName}' not found."
}
```

### 3. Execution

Click the ``Run button`` in the Script Console.

Check the output box below the script console for the ``SUCCESS`` or ``ERROR`` message.

Navigate back to the Jenkins Dashboard to confirm the SecureShop-CI pipeline is gone.
