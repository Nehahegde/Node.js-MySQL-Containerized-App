# Node.js-MySQL-Containerized-App
Backend application built with Node.js and MySQL, containerized using Docker and Docker Compose, with Kubernetes/K3s deployment.

## Tech Stack

* **Node.js** — Backend application
* **MySQL** — Relational database
* **Docker** — Containerization
* **Docker Compose** — Multi-container setup
* **phpMyAdmin** — Database administration UI
* **K3s** — Container orchestration

## Architecture

The application consists of separate containers for the Node.js application, MySQL database, and phpMyAdmin.

```text
                    Docker Network
                 ┌───────────────────┐
                 │                   │
                 │  Node.js App      │
                 │  :3000            │
                 │       │           │
                 │       │ :3306     │
                 │       ▼           │
                 │  MySQL            │
                 │  :3306            │
                 │                   │
                 │  phpMyAdmin       │
                 │  :80              │
                 │                   │
                 └───────────────────┘
```

The Node.js application communicates with MySQL through the Docker network using the MySQL service name.

## Docker

Build the Node.js image:

```bash
docker build -t node-mysql-app .
```

Run the Node.js container:

```bash
docker run --name nodeapp --network app_default -p 3000:3000 node-mysql-app
```

List running containers:

```bash
docker ps
```

List Docker images:

```bash
docker images
```

## Docker Compose

MySQL and phpMyAdmin are configured using Docker Compose.

The services communicate through the Compose network using service names.

Example MySQL connection from Node.js:

```javascript
const db = mysql.createConnection({
  host: "mysqldb",
  port: 3306,
  user: "admin",
  password: process.env.DB_PASSWORD,
  database: "crudDB",
});
```

Here, `mysqldb` is the MySQL service name defined in the Compose configuration.

### Port Mapping

MySQL can be exposed to the host machine using:

```yaml
ports:
  - "3306:3306"
```

This allows access from the host through:

```text
localhost:3306
```

Container-to-container communication uses the Docker network and does not require host port publishing.

## Application Port

The Node.js application runs on:

```text
http://localhost:3000
```

The container port is published using:

```bash
-p 3000:3000
```

## Project Structure

```text
.
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
├── server.js
├── .dockerignore
└── README.md
```

## Kubernetes / K3s

Kubernetes deployment includes:

* Node.js Deployment
* Node.js Service
* MySQL Deployment / StatefulSet
* MySQL Service
* ConfigMap
* Secret
* PersistentVolume
* PersistentVolumeClaim
* Health checks

## Container Architecture

```text
Node.js Application
        │
        ▼
      Docker
        │
        ▼
 Docker Compose
        │
        ├── Node.js
        ├── MySQL
        └── phpMyAdmin
        │
        ▼
   Kubernetes / K3s
```

## License

This project is intended for learning and development purposes.

