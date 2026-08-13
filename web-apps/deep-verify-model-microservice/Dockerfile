FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    HF_HOME=/home/app/.cache/huggingface

RUN useradd --create-home --uid 1000 app
WORKDIR /home/app

COPY --chown=app:app requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --chown=app:app deepverify ./deepverify

USER app
EXPOSE 8000

# Warm the weights into the image layer so the first request is not a 607MB download.
RUN python -c "from deepverify.detector import get_detector; get_detector()"

HEALTHCHECK --interval=30s --timeout=10s --start-period=90s \
    CMD python -c "import urllib.request;urllib.request.urlopen('http://localhost:8000/health')"

CMD ["uvicorn", "deepverify.api:app", "--host", "0.0.0.0", "--port", "8000"]
