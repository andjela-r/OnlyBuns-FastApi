# Dockerfile
FROM python:3.10-slim

# set working dir
WORKDIR /app

# install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy app code
COPY . .

# default command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
