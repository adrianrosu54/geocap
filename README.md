# GeoCap

Full stack web application enabling you to capture and store pictures along
with their location data.

It covers registration, login and offers a dashboard page that lists all of
the user's image captures, with timestamps and location information.

It can easily be self hosted as it is contained
in **a single Docker container**. It should be placed behind a reverse proxy
(such as _NGINX_ or _Traefik_) for TLS and to enable geolocation functionality.

## Tech stack

- Backend:
  - [FastAPI](https://github.com/fastapi/fastapi) - API routing and input
    validation in **Python**
  - [SQLModel](https://github.com/fastapi/sqlmodel) - ORM
  - [SQLite](https://github.com/sqlite/sqlite) - Embedded SQL Database
  - **JWT** authentication
- Frontend:
  - [React](https://github.com/react/react) - components and rendering for
    **TypeScript**, built with [Vite](https://github.com/vitejs/vite)
  - [TanStack Router](https://github.com/TanStack/router) - Type-safe routing
    for multi-page applications

## Build and run

Build with docker:

```bash
git clone ...
cd geocap
docker build -t geocap:1.0.0 .
```

Run as a docker container:

```bash
docker run \
    -v ./database:/app/data \
    -v ./images:/app/images \
    -p 8000:8000\
    geocap:1.0.0
```

## Development

### Backend

```bash
cd backend
uv sync
```

Environment setup:

```bash
JWT_SECRET=... # generated with openssl rand -hex 64
ENVIROMENT="development"
```

Run:

```bash
uv run fastapi dev
uv run pytest # run tests
```

### Frontend

```bash
cd frontend
npm install
```

Environment:

```bash
VITE_API_URL="http://localhost:8000"
NODE_ENV="development"
```

Run:

```bash
npm run dev
npm run test # run tests
```

## License

Copyright (C) 2026 Adrian Laurențiu Roșu

This project is licensed under the [GNU Affero General Public License v3.0 (AGPL-3.0)](https://opensource.org).
Permissions of this strong copyleft license are conditioned on making available
complete source code of licensed works and modifications, which includes larger
works using the licensed work, under the same license.
