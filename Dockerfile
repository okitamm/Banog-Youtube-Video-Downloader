# 1. Use a lightweight Python operating system
FROM python:3.9-slim

# 2. Install FFmpeg into this virtual operating system
RUN apt-get update && apt-get install -y ffmpeg

# 3. Set up our working directory
WORKDIR /app

# 4. Copy our requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy the rest of our application code
COPY . .

# 6. Expose the port Render expects
EXPOSE 5000

# 7. Start the production server
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--timeout", "120", "app:app"]