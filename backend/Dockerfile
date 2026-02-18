# Use an official lightweight Python image.
# https://hub.docker.com/_/python
FROM python:3.11-slim

# Install system dependencies
# ffmpeg is required for yt-dlp audio processing
# git is often needed for installing dependencies from git repos
RUN apt-get update && apt-get install -y \
    ffmpeg \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory to /app
WORKDIR /app

# Copy requirements file (ensure this file exists in your backend folder)
COPY requirements.txt ./

# Install production dependencies.
# --no-cache-dir keeps the image smaller
RUN pip install --no-cache-dir -r requirements.txt

# Copy local code to the container image.
COPY . .

# Run the web service on container startup.
# Cloud Run expects the app to listen on PORT environment variable (default 8080)
# We use uvicorn explicitly binding the host to 0.0.0.0
CMD exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}
