FROM python:3.11-bookworm

WORKDIR /app

RUN apt update && apt install -y xpdf

# Copy the requirements file into the container
COPY requirements.txt .

RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "master.py", "--root", "./"]
