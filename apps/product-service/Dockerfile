FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
# VULNERABLE: Runs as root, no securityContext
CMD ["python", "app.py"]
