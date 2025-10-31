# 🔴 INTENTIONAL: Using older Python version for vulnerability demonstration
FROM python:3.9-slim

WORKDIR /app

# Copy requirements first (for Docker layer caching)
COPY requirements.txt .

# 🔴 INTENTIONAL: Running as root (bad practice)
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app.py .

# Expose port
EXPOSE 5000

# 🔴 INTENTIONAL: No health check defined
CMD ["python", "app.py"]
