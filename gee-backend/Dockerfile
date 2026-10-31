# AgriEye Google Earth Engine Backend — Dockerfile for Google Cloud Run
FROM python:3.11-slim

ENV PYTHONUNBUFFERED=True \
    PORT=8080

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8080

CMD exec uvicorn main:app --host 0.0.0.0 --port ${PORT}
