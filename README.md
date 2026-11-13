# DevOps Task Manager API

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Java](https://img.shields.io/badge/Java-17%2B-orange.svg)]()
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.5-brightgreen.svg)]()
[![Maven](https://img.shields.io/badge/Maven-3.9-blue.svg)]()
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)]()
[![Kubernetes](https://img.shields.io/badge/Kubernetes-3%20Replicas-326CE5.svg)]()
[![Ansible](https://img.shields.io/badge/Ansible-Role%20Ready-EE0000.svg)]()

> A robust, lightweight RESTful microservice and complete DevOps automation project implementing Continuous Integration, Infrastructure as Code, Containerization, and Kubernetes Orchestration with Automated Health Self-Healing.

---

## 1. Project Overview

The **DevOps Task Manager API** is an academic and industry-aligned DevOps demonstration project designed to showcase the complete modern software delivery lifecycle across two core components:

* **Component 1 (CI/CD Pipeline):** REST API development using Spring Boot and Java 17, Git feature-branch workflow with non-fast-forward merge history, Apache Maven build automation, Declarative Jenkins Pipeline with automated SCM polling triggers, and an automated JUnit 5 testing enhancement.
* **Component 2 (Ansible + Docker + Kubernetes):** Infrastructure provisioning with an Ansible role (`taskmanager`) containing inventory, playbooks, variables, templates, and restart handlers; production Docker containerization using Alpine Linux and non-root execution; and Kubernetes orchestration featuring 3 initial replicas, NodePort exposure, horizontal scaling to 5 replicas and back down, and high-reliability Liveness & Readiness health probes.

---

## 2. Architecture Diagram

```
+---------------------------------------------------------------------------------+
|                                 DEVELOPER WORKSTATION                           |
|  +--------------------+   git commit/push    +-------------------------------+  |
|  | feature/api-endpts | -------------------> | GitHub Remote Repository      |  |
|  +--------------------+                      +-------------------------------+  |
|            |                                                 |                  |
|       merge --no-ff                                          | SCM Polling /    |
|            v                                                 | Webhook Trigger  |
|  +--------------------+                                      v                  |
|  |    main branch     |                             +-----------------+         |
|  +--------------------+                             | Jenkins CI/CD   |         |
+---------------------------------------------------- | Pipeline Engine | --------+
                                                      +-----------------+
                                                               |
                     +-----------------------------------------+
                     | 1. Checkout SCM
                     | 2. Compile Java
                     | 3. Run JUnit 5 Tests (CI Enhancement)
                     | 4. Package JAR
                     | 5. Archive Artifacts
                     v
+---------------------------------------------------------------------------------+
|                              DEPLOYMENT TARGETS                                 |
|                                                                                 |
|   [Target Server / VM]                          [Container Orchestration]       |
|   +-----------------------+                     +---------------------------+   |
|   | Ansible Provisioning  |                     | Kubernetes Cluster        |   |
|   | - Installs Java 17    |                     | (Minikube / Kind)         |   |
|   | - Copies JAR          |                     |                           |   |
|   | - Systemd Service     |                     | Deployment: 3 Replicas    |   |
|   | - Port 8080 Handler   |                     | Probes: /health           |   |
|   +-----------------------+                     | NodePort Service: 30080   |   |
|               ^                                 +---------------------------+   |
|               |                                               ^                 |
|       ansible-playbook                                        | kubectl apply   |
|               |                                               |                 |
|   +-----------------------+                     +---------------------------+   |
|   | Ansible Role:         |                     | Docker Image:             |   |
|   |   taskmanager         |                     | devops-task-manager:1.0.0 |   |
|   +-----------------------+                     +---------------------------+   |
+---------------------------------------------------------------------------------+
```

---

## 3. Technology Stack

* **Application Framework:** Java 17, Spring Boot 3.3.5 (Spring MVC, Jakarta Bean Validation)
* **Testing:** JUnit 5 (Jupiter), AssertJ, Spring Boot MockMvc, Maven Surefire Plugin
* **Build Automation:** Apache Maven 3.9
* **Version Control:** Git 2.53+, GitHub CLI (`gh`)
* **Continuous Integration:** Jenkins Declarative Pipeline (SCM Polling, JUnit Publisher)
* **Configuration Management:** Ansible 2.16+ (Roles, Playbooks, Jinja2 Templates, Handlers)
* **Containerization:** Docker (Alpine JRE 17 base, non-root `appuser`)
* **Container Orchestration:** Kubernetes (v1.28+, Minikube / Kind, Deployments, Services, Liveness/Readiness Probes)

---

## 4. Project Directory Structure

```text
devops-task-manager/
├── .gitignore
├── pom.xml                                  # Maven project configuration & dependencies
├── Dockerfile                               # Production unprivileged Alpine JRE container
├── Jenkinsfile                              # Declarative CI/CD pipeline definition
├── README.md                                # Comprehensive documentation
├── repo_link.txt                            # Configured repository remote links
├── src/
│   ├── main/
│   │   ├── java/com/devops/taskmanager/
│   │   │   ├── TaskManagerApplication.java  # Main Spring Boot entrypoint
│   │   │   ├── controller/
│   │   │   │   ├── HealthController.java    # /health endpoint (Probes & Monitoring)
│   │   │   │   └── TaskController.java      # /tasks REST endpoints
│   │   │   ├── dto/
│   │   │   │   ├── ApiResponse.java         # Standard response wrapper
│   │   │   │   ├── CreateTaskRequest.java   # Input validation DTO
│   │   │   │   └── HealthResponse.java      # Health check metrics DTO
│   │   │   ├── exception/
│   │   │   │   ├── GlobalExceptionHandler.java # Error handling advice
│   │   │   │   └── TaskNotFoundException.java  # Custom 404 exception
│   │   │   ├── model/
│   │   │   │   ├── Task.java                # In-memory domain entity
│   │   │   │   └── TaskStatus.java          # PENDING, IN_PROGRESS, COMPLETED
│   │   │   └── service/
│   │   │       └── TaskService.java         # Thread-safe in-memory store
│   │   └── resources/
│   │       └── application.properties       # App configuration
│   └── test/java/com/devops/taskmanager/
│       ├── HealthControllerTest.java        # Health endpoint mockMvc test
│       ├── TaskControllerTest.java          # REST API mockMvc test suite
│       ├── TaskManagerApplicationTests.java # Context loading test
│       └── TaskServiceTest.java             # Unit tests for service logic
├── ansible/
│   ├── inventory                            # Target servers & inventory variables
│   ├── playbook.yml                         # Master deployment playbook
│   └── roles/
│       └── taskmanager/                     # Modular Ansible Role
│           ├── defaults/main.yml            # Port, paths, and user defaults
│           ├── handlers/main.yml            # Systemd service restart handler
│           ├── tasks/main.yml               # Provisioning & service setup tasks
│           └── templates/
│               ├── application.properties.j2 # Dynamic properties template
│               └── taskmanager.service.j2    # Systemd service unit template
├── kubernetes/
│   ├── deployment.yaml                      # 3 Replicas, Requests/Limits, Probes
│   └── service.yaml                         # NodePort 30080 Service
├── reports/
│   ├── component1-report.md                 # Academic report for Component 1
│   └── component2-report.md                 # Academic report for Component 2
├── screenshots/
│   └── README.md                            # Guidelines for demonstration evidence
└── scripts/
    ├── verify-ansible.py                    # Ansible syntax & structure validator
    └── verify-k8s.py                        # Kubernetes manifest validator
```

---

## 5. Prerequisites

Before running the tools, ensure the following software is available on your workstation:
* **Java Development Kit:** JDK 17 or newer (`java -version`)
* **Apache Maven:** Maven 3.8+ (`mvn -version`)
* **Git:** Version 2.30+ (`git --version`)
* **GitHub CLI:** Optional for repository push (`gh --version`)
* **Docker:** Docker Desktop or Docker Engine (`docker --version`)
* **Kubernetes:** `kubectl` CLI and a local cluster (`minikube` or `kind`)
* **Ansible:** Available in Linux/WSL environment (`ansible --version`)

---

## 6. Local Installation & Execution

### 6.1 Build and Run with Maven
```powershell
# 1. Compile source files and execute automated tests
mvn clean test

# 2. Package into an executable fat JAR
mvn package

# 3. Run the Spring Boot application
java -jar target/devops-task-manager-1.0.0.jar
```
The application will start on `http://localhost:8080`.

---

## 7. REST API Endpoints & Examples

### Health Check Endpoint
* **Request:** `GET http://localhost:8080/health`
* **Response (HTTP 200):**
```json
{
  "status": "UP",
  "service": "DevOps Task Manager API",
  "version": "1.0.0",
  "timestamp": "2026-11-13T19:07:50.739",
  "details": {
    "storage": "in-memory concurrent hash map",
    "activeTaskCount": 3,
    "jvmMemoryFreeMb": 17,
    "jvmMemoryTotalMb": 42
  }
}
```

### Get All Tasks
* **Request:** `GET http://localhost:8080/tasks`
* **Response (HTTP 200):**
```json
[
  {
    "id": 1,
    "title": "Setup CI/CD Pipeline",
    "description": "Configure automated Jenkins builds with testing",
    "status": "COMPLETED"
  },
  {
    "id": 2,
    "title": "Containerize with Docker",
    "description": "Build lightweight Java 17 container image",
    "status": "IN_PROGRESS"
  }
]
```

### Create a New Task
* **Request:** `POST http://localhost:8080/tasks`
* **Headers:** `Content-Type: application/json`
* **Body:**
```json
{
  "title": "Configure Kubernetes Probes",
  "description": "Add liveness and readiness checks to deployment.yaml",
  "status": "PENDING"
}
```
* **Response (HTTP 201 CREATED):**
```json
{
  "id": 4,
  "title": "Configure Kubernetes Probes",
  "description": "Add liveness and readiness checks to deployment.yaml",
  "status": "PENDING",
  "createdAt": "2026-11-13T19:08:02.756",
  "updatedAt": "2026-11-13T19:08:02.756"
}
```

### Get Task by ID
* **Request:** `GET http://localhost:8080/tasks/1`
* **Response (HTTP 200 OK):**
```json
{
  "id": 1,
  "title": "Setup CI/CD Pipeline",
  "description": "Configure automated Jenkins builds with testing",
  "status": "COMPLETED"
}
```

### Delete Task by ID
* **Request:** `DELETE http://localhost:8080/tasks/1`
* **Response (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "id": 1
}
```

---

## 8. Git Branching & Workflow

The repository was initialized and structured following a trunk-and-feature branching model:
```bash
# View all branches
git branch -a

# View commit tree demonstrating branch and non-fast-forward merge
git log --graph --oneline --all
```
**Sample Tree Output:**
```text
* d92eb81 (HEAD -> main) feat(ops): add production Dockerfile, Ansible roles, and Kubernetes manifests with probes
*   27ba223 Merge branch 'feature/api-endpoints' into main
|\  
| * ec0d6b0 (feature/api-endpoints) ci: add Jenkins declarative pipeline with SCM polling and JUnit test reporting
| * 8202388 feat: implement Task Manager REST API endpoints and JUnit 5 test suite
|/  
* f46d666 feat: initial project setup with Maven POM, .gitignore and repo config
```

---

## 9. Jenkins CI/CD Pipeline Setup

1. Open Jenkins at `http://localhost:8085`.
2. Click **New Item** > Name: `devops-task-manager-pipeline` > Select **Pipeline**.
3. Under **Build Triggers**, enable **Poll SCM** with schedule: `H/5 * * * *`.
4. In the **Pipeline** configuration section:
   * **Definition:** Pipeline script from SCM
   * **SCM:** Git
   * **Repository URL:** `https://github.com/VivekSharma4083/devops-task-manager.git`
   * **Branch:** `*/main`
   * **Script Path:** `Jenkinsfile`
5. Click **Save** and **Build Now**.
6. The pipeline executes the 5 stages:
   * `Checkout` -> `Build` -> `Test` -> `Package` -> `Archive Artifacts`
7. The **JUnit Test Result** step parses `target/surefire-reports/*.xml`, displays a trend chart, and fails the build if any test fails. Both Build #1 and automated Build #2 completed with 100% green status.

---

## 10. Ansible Server Configuration

The `ansible/` folder contains a complete Ansible role (`taskmanager`) designed for Debian/Ubuntu target hosts.

### Execution Commands (inside Linux / WSL):
```bash
cd ansible/

# 1. Verify syntax
ansible-playbook -i inventory playbook.yml --syntax-check

# 2. Run playbook to provision server and start service
ansible-playbook -i inventory playbook.yml

# 3. Override application port variable if needed
ansible-playbook -i inventory playbook.yml -e "app_port=8081"
```

### Structural Verification (on Windows / Host):
```powershell
py scripts/verify-ansible.py
```

---

## 11. Docker Containerization

### Build Image:
```bash
docker build -t devops-task-manager:1.0.0 .
```

### Run Container:
```bash
docker run -d --name taskmanager-app -p 8080:8080 devops-task-manager:1.0.0
```

### Verify Container Health:
```bash
docker ps
curl http://localhost:8080/health
curl http://localhost:8080/tasks
```

---

## 12. Kubernetes Deployment & Scaling Demonstration

### 12.1 Deploy Manifests:
```bash
# 1. Apply deployment (3 initial replicas) and service (NodePort 30080)
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml

# 2. Check pod and service status
kubectl get pods -l app=taskmanager
kubectl get svc taskmanager-service
```

### 12.2 Scaling Demonstration:
```bash
# Scale up from 3 to 5 replicas
kubectl scale deployment taskmanager --replicas=5
kubectl get pods -l app=taskmanager

# Scale back down from 5 to 3 replicas
kubectl scale deployment taskmanager --replicas=3
kubectl get pods -l app=taskmanager
```

### 12.3 Inspect Health Probes:
```bash
kubectl describe pod <pod-name>
```
Look for `Liveness: http-get http://:8080/health` and `Readiness: http-get http://:8080/health`.

---

## 13. Verification Evidence & Visual Screenshots

All execution stages are backed by both raw terminal evidence logs (`screenshots/*.txt`) and real browser viewport screenshots (`screenshots/visual/*.png`):

### 13.1 Visual Screenshots (`screenshots/visual/`)
* `c1-01-github-repository-main.png`: Web browser view of GitHub repository overview on branch `main`.
* `c1-01-github-commits-history.png`: Web browser view of Git commit history showing non-fast-forward merge.
* `c1-04-jenkins-dashboard.png`: Jenkins home dashboard showing `devops-task-manager-pipeline` with green checkmark status and Build #2 execution duration (52 sec).
* `c1-04-jenkins-pipeline-stageview.png`: Jenkins pipeline project view showing green checkmarks for all builds, latest test result, and 15 passed test trend.
* `c1-05-jenkins-junit-test-report.png`: Interactive Jenkins test report showing all 15 passing JUnit tests (0 failures, 0 skipped).
* `c1-06-jenkins-archived-artifact.png`: Jenkins Build #2 detail view confirming archived artifact `devops-task-manager-1.0.0.jar` (20.62 MiB).
* `c2-05-k8s-service-health-browser.png`: Live browser response querying `/health` through the Kubernetes NodePort service forwarding.

### 13.2 Raw Terminal Logs (`screenshots/`)
* `c1-01-git-branch-merge.txt`: Git branch log displaying non-fast-forward merge graph.
* `c1-02-maven-build-success.txt`: Terminal output of `mvn clean test package` confirming `BUILD SUCCESS`.
* `c1-03-rest-api-tests.txt`: Terminal JSON response bodies for `/tasks`, `/tasks/{id}`, and `/health`.
* `c1-04-jenkins-pipeline-build-console.txt`: Complete 20 KB raw console text of Jenkins Build #2.
* `c1-05-jenkins-junit-test-report.txt`: Automated JUnit test execution summary.
* `c1-06-archived-jar-artifact.txt`: SHA256 checksum and metadata of archived JAR.
* `c2-01-ansible-execution-wsl.txt`: Full raw Ansible playbook execution log in Ubuntu WSL2 showing `PLAY RECAP` with 14 tasks (`ok=14, changed=8, failed=0`).
* `c2-02-docker-build-and-run.txt`: Docker image inspect, container execution, logs, and Docker container healthcheck verification.
* `c2-03-k8s-deployment-and-service.txt`: Kubernetes cluster nodes, deployment (3 replicas), NodePort service (30080), and running pods.
* `c2-04-k8s-scaling-evidence.txt`: Scaling demonstration terminal output (3 to 5 replicas, and 5 back down to 3 replicas) and `kubectl describe deployment taskmanager` showing Liveness and Readiness probes.

---

## 14. Troubleshooting Guide

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| `JAVA_HOME not set` | Missing environment variable | Run `$env:JAVA_HOME = "C:\Users\HP\.tools\jdk-17"` before calling Maven. |
| `Port 8080 already in use` | Another process is bound to port 8080 | Identify PID using `netstat -ano \| findstr :8080` and stop the conflicting process. |
| `Ansible locale error on Windows` | Ansible control node requires POSIX / UTF-8 | Execute Ansible commands inside WSL or an Ubuntu VM. |
| `ImagePullBackOff in Kubernetes` | Kubernetes cannot find local image | For Minikube: Run `minikube image load devops-task-manager:1.0.0`. For Kind: Run `kind load docker-image devops-task-manager:1.0.0`. |
| `Pod not ready in Kubernetes` | Initial delay seconds for readiness check | Allow 15–20 seconds for Spring Boot JVM startup and warm-up. |

---

## 15. Repository Link & Credits

* **Target GitHub Repository:** [https://github.com/VivekSharma4083/devops-task-manager](https://github.com/VivekSharma4083/devops-task-manager)
* **Author:** Vivek Sharma
* **License:** MIT License
