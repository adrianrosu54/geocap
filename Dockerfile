# frontend build
FROM node:24-alpine AS frontend-builder

WORKDIR /app/frontend

# layer caching
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./

ENV NODE_ENV="production"

RUN npm run build


# python dependencies
FROM python:3.14-slim AS backend-builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /usr/local/bin/

COPY backend/pyproject.toml backend/uv.lock ./

RUN uv sync --frozen --no-install-project --no-dev


# final runtime
FROM python:3.14-slim AS runtime

ARG UID=1000
ARG GID=1000

WORKDIR /app

RUN groupadd -g ${GID} geocap \
    && useradd -l -u ${UID} -g ${GID} --shell /bin/bash geocap

COPY --from=backend-builder /app/.venv /app/.venv
COPY backend/ ./

COPY --from=frontend-builder /app/frontend/dist ./dist

ENV PATH=/app/.venv/bin:$PATH \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    ENVIRONMENT=production

RUN chown -R geocap:geocap /app
USER geocap

EXPOSE 8000

CMD [ "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000" ]
