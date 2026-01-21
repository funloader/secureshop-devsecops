# Using an older base image to ensure Trivy finds vulnerabilities later
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

# DANGEROUS: Running as root user (we will fix this later)
EXPOSE 5001
CMD ["python", "app.py"]
