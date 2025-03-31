FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./
COPY military_ranks.json ./
COPY wars.json ./
RUN pip install --no-cache-dir -r requirements.txt

COPY api ./api
COPY celery_worker ./celery_worker
COPY tg_bot ./tg_bot

CMD ["bash"]
