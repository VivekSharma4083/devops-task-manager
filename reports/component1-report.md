# ACADEMIC PROJECT REPORT
## COMPONENT 1: AUTOMATED CI/CD PIPELINE & REST API DEVELOPMENT

---

### [TITLE PAGE PLACEHOLDER]
**Project Title:** DevOps Task Manager REST API — Continuous Integration & Continuous Delivery (CI/CD) Pipeline  
**Course:** DevOps Engineering Laboratory / Capstone  
**Student Name:** [Student Name Placeholder]  
**Roll / Registration Number:** [Student ID Placeholder]  
**Department:** Computer Science & Engineering / Information Technology  
**Academic Year:** 2026–2027  
**Institution:** [College / University Name Placeholder]  

---

### [CERTIFICATE PLACEHOLDER]
*This is to certify that the project entitled "DevOps Task Manager REST API — Continuous Integration & Continuous Delivery Pipeline" is a bona fide record of independent work carried out by [Student Name Placeholder] under the guidance and supervision of [Supervisor/Faculty Name Placeholder] in partial fulfillment of the requirements for the DevOps course evaluation.*

**Faculty Supervisor Signature:** _______________________  
**Head of Department Signature:** _______________________  
**Date:** [Date Placeholder]  

---

## 1. ABSTRACT
This report presents the design, architectural implementation, and automated continuous integration pipeline for the **DevOps Task Manager API**, an enterprise-standard lightweight microservice built using Java 17, Spring Boot 3.3.5, and Apache Maven. The objective of Component 1 is to demonstrate modern software configuration management and automated CI/CD practices. The project employs Git for branching and merging strategies (demonstrating feature branch workflows), Maven for dependency resolution and build lifecycle management, and Jenkins for declarative pipeline automation. As a primary CI enhancement, an automated JUnit 5 testing and surefire verification stage is integrated directly into the Jenkins pipeline to enforce quality gates and prevent regression before artifact packaging and archiving.

---

## 2. INTRODUCTION
In modern DevOps practices, Continuous Integration (CI) is foundational for delivering high-quality, reliable software rapidly. Manual builds and ad-hoc deployments often lead to configuration drift, undetected regression defects, and deployment bottlenecks.

The primary objectives of Component 1 are:
1. Engineer a clean, robust REST API adhering to HTTP semantics and standardized JSON messaging.
2. Maintain strict version control using Git, demonstrating non-fast-forward branch integration (`feature/api-endpoints` into `main`).
3. Standardize compilation, packaging, and execution using Apache Maven 3.9 and Java 17.
4. Define a fully automated Declarative Jenkinsfile pipeline with automated SCM polling triggers.
5. Implement automated unit and integration testing using JUnit 5 as a CI enhancement to block defective code from progression.

---

## 3. DEVELOPMENT ENVIRONMENT
The development, build, and verification environment specifications are detailed below:

| Component | Specification / Version | Role in Project |
| :--- | :--- | :--- |
| **Operating System** | Microsoft Windows 11 (build 26200 x64) | Host Operating System |
| **Java Development Kit** | Eclipse Adoptium OpenJDK 17.0.14+7 (HotSpot 64-bit) | Application Runtime & Compiler |
| **Build Automation** | Apache Maven 3.9.9 | Lifecycle, Dependency & Package Management |
| **Version Control** | Git 2.53.0 / GitHub CLI 2.104.0 | Distributed SCM & Remote Repository Management |
| **Application Framework**| Spring Boot 3.3.5 (Spring Framework 6.1.14) | Embedded Servlet & REST Controller Framework |
| **Unit Testing Framework**| JUnit 5 (Jupiter), AssertJ, MockMvc | Test Automation & Regression Suite |
| **CI Automation** | Jenkins Declarative Pipeline | Continuous Integration Engine |

---

## 4. APPLICATION DESIGN & IMPLEMENTATION

### 4.1 Architecture and Domain Model
The DevOps Task Manager is a RESTful API designed with zero external database dependencies to ensure rapid portability and deterministic execution across local and containerized environments. State is maintained in-memory using a thread-safe `ConcurrentHashMap<Long, Task>` coordinated by an `AtomicLong` identifier sequence.

The core domain model `Task` consists of:
- `id` (Long): Unique monotonic identifier.
- `title` (String): Mandatory task summary (validated 3–100 characters).
- `description` (String): Optional context (up to 500 characters).
- `status` (Enum): `PENDING`, `IN_PROGRESS`, `COMPLETED`.
- `createdAt` / `updatedAt` (LocalDateTime): Timestamps tracking task lifecycle.

### 4.2 API Endpoints Specification

| Method | Endpoint | Request Body | Status Code | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | None | `200 OK` | Health check endpoint returning runtime memory and service state. |
| `GET` | `/tasks` | None | `200 OK` | Retrieves an array of all active tasks. |
| `POST` | `/tasks` | `CreateTaskRequest` (JSON) | `201 CREATED` | Validates input and persists a new task. |
| `GET` | `/tasks/{id}` | None | `200 OK` / `404 NOT FOUND` | Retrieves a specific task by identifier. |
| `DELETE`| `/tasks/{id}` | None | `200 OK` / `404 NOT FOUND` | Deletes a task from the in-memory store. |

### 4.3 Validation and Exception Handling
Input validation is enforced using Jakarta Bean Validation (`@NotBlank`, `@Size`). When invalid payloads are posted (e.g., an empty title), the `GlobalExceptionHandler` intercepts the `MethodArgumentNotValidException` and produces a structured HTTP 400 response:
```json
{
  "timestamp": "2026-11-13T19:08:06.840",
  "status": 400,
  "error": "Validation Failed",
  "message": "Input validation failed on one or more fields",
  "details": {
    "title": "Title is mandatory and cannot be blank"
  }
}
```
Similarly, accessing or deleting a non-existent task yields an HTTP 404 with standard RFC 7807 compliant error messaging.

---

## 5. GIT VERSION CONTROL & BRANCHING WORKFLOW

### 5.1 Branching Strategy
To emulate professional trunk-based and feature-branch workflows, development followed this explicit process:
1. `main`: Stable release branch containing baseline configuration (`pom.xml`, `.gitignore`).
2. `feature/api-endpoints`: Isolated feature branch where all REST API controllers, domain entities, service classes, and unit tests were authored and committed.
3. **Merge Execution:** A non-fast-forward merge (`git merge --no-ff`) was executed from `feature/api-endpoints` into `main`, creating a distinct merge commit that documents feature integration.

### 5.2 Git Verification Log
The actual Git graph generated during project initialization confirms genuine branch separation and merge history:

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

## 6. MAVEN BUILD & ARTIFACT PACKAGING

The project build lifecycle is governed by Apache Maven (`pom.xml`). The build configures:
- Java 17 source and target compilation bytecode.
- `spring-boot-maven-plugin` to assemble an executable self-contained fat JAR containing all embedded Tomcat dependencies.
- `maven-surefire-plugin` (version 3.2.5) to run automated unit tests and generate XML reports.

### Build Verification Command:
```powershell
mvn clean test package
```
**Outcome:**
- `BUILD SUCCESS` achieved in 01:11 min.
- Executable JAR generated: `target/devops-task-manager-1.0.0.jar` (Size: ~18.5 MB).

---

## 7. AUTOMATED TESTING ENHANCEMENT (CI ENHANCEMENT)

### 7.1 Test Strategy & Test Suite Architecture
As the mandatory CI enhancement, automated unit and integration tests were developed using JUnit 5, AssertJ, and Spring Boot's `MockMvc` framework:
1. `HealthControllerTest`: Verifies the `/health` endpoint produces HTTP 200 and `"status": "UP"`.
2. `TaskControllerTest`: Verifies all REST endpoints under positive and negative conditions (200 OK, 201 Created, 400 Bad Request on invalid payloads, 404 Not Found on missing IDs).
3. `TaskServiceTest`: Unit tests business logic and thread-safe store mutations.
4. `TaskManagerApplicationTests`: Validates Spring ApplicationContext bootstrapping.

### 7.2 Execution Results
Execution of `mvn test` produced 15 successful test cases with zero failures:
```text
-------------------------------------------------------------------------------
Test set: com.devops.taskmanager.HealthControllerTest
Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 6.668 s
-------------------------------------------------------------------------------
Test set: com.devops.taskmanager.TaskControllerTest
Tests run: 7, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.522 s
-------------------------------------------------------------------------------
Test set: com.devops.taskmanager.TaskManagerApplicationTests
Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.653 s
-------------------------------------------------------------------------------
Test set: com.devops.taskmanager.TaskServiceTest
Tests run: 6, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.042 s
-------------------------------------------------------------------------------
Total Tests: 15 | Failures: 0 | Errors: 0 | Skipped: 0
```

---

## 8. JENKINS PIPELINE SPECIFICATION

### 8.1 Declarative Pipeline Structure
The `Jenkinsfile` defines a 5-stage declarative pipeline with automated SCM polling triggers and post-execution quality gates:

```groovy
pipeline {
    agent any

    triggers {
        pollSCM('H/5 * * * *') // Poll SCM every 5 minutes for new commits
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Build') {
            steps {
                script {
                    if (isUnix()) { sh 'mvn clean compile' }
                    else { bat 'mvn clean compile' }
                }
            }
        }
        stage('Test') {
            steps {
                script {
                    if (isUnix()) { sh 'mvn test' }
                    else { bat 'mvn test' }
                }
            }
        }
        stage('Package') {
            steps {
                script {
                    if (isUnix()) { sh 'mvn package -DskipTests' }
                    else { bat 'mvn package -DskipTests' }
                }
            }
        }
        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'target/*.jar', fingerprint: true, allowEmptyArchive: false
            }
        }
    }

    post {
        always {
            // CI Quality Gate: Parse test results; fail pipeline if tests fail
            junit testResults: 'target/surefire-reports/*.xml', allowEmptyResults: false
        }
    }
}
```

### 8.2 Jenkins Server Configuration & Live Execution
The Jenkins LTS server was deployed and executed locally on port 8085 (`http://localhost:8085/`) using Eclipse Adoptium OpenJDK 21.0.6. The pipeline job `devops-task-manager-pipeline` was configured with Pipeline script from SCM (`https://github.com/VivekSharma4083/devops-task-manager.git`, branch `*/main`, script path `Jenkinsfile`) and automated SCM polling (`H/5 * * * *`).

#### Verified Pipeline Builds Summary:
| Build # | Trigger Cause | Execution State | Duration | JUnit Tests | Archived Artifacts |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **#1** | Manual Trigger | `SUCCESS` | 78.54s | 15 / 15 Passed (0 Failed) | `devops-task-manager-1.0.0.jar` (18.48 MB) |
| **#2** | Automated SCM Polling (`H/5 * * * *`) | `SUCCESS` | 52.97s | 15 / 15 Passed (0 Failed) | `devops-task-manager-1.0.0.jar` (18.48 MB) |

#### Verified Build Stages:
1. **Stage 1 (Checkout):** Cloned remote Git repository from `https://github.com/VivekSharma4083/devops-task-manager.git` at commit on `main`.
2. **Stage 2 (Build):** Executed `mvn clean compile` with `BUILD SUCCESS`.
3. **Stage 3 (Test):** Executed `mvn test` running all 15 automated JUnit 5 tests.
4. **Stage 4 (Package):** Executed `mvn package -DskipTests` assembling the executable JAR.
5. **Stage 5 (Archive Artifacts):** Archived `target/devops-task-manager-1.0.0.jar` with SHA256 fingerprinting.
6. **Post Actions (JUnit Quality Gate):** Collected XML test reports from `target/surefire-reports/*.xml`, published test results trend, and marked pipeline 100% green.

---

## 9. RESULTS & VERIFICATION EVIDENCE

### 9.1 Local API Execution Results
The packaged JAR was executed locally and verified:
- **`GET /health`:**
  ```json
  {
    "status": "UP",
    "service": "DevOps Task Manager API",
    "version": "1.0.0",
    "details": {
      "storage": "in-memory concurrent hash map",
      "activeTaskCount": 3,
      "jvmMemoryFreeMb": 108,
      "jvmMemoryTotalMb": 128
    }
  }
  ```
- **`GET /tasks`:** Successfully returned initial in-memory seed tasks.
- **`POST /tasks`:** Created task ID 4 (`Automate with Jenkins`).
- **`DELETE /tasks/4`:** Successfully removed task with confirmation response.

### 9.2 Jenkins Automated CI Results
- **Job Name:** `devops-task-manager-pipeline`
- **Build Status:** `SUCCESS` across all builds (Build #1 and Build #2).
- **Trigger Verification:** Build #2 was triggered automatically by the SCM polling scheduler (`Started by an SCM change`).
- **Console Log Evidence:** Saved in `screenshots/c1-04-jenkins-pipeline-build-console.txt` (20,572 bytes).
- **JUnit Report Evidence:** Saved in `screenshots/c1-05-jenkins-junit-test-report.txt` (15/15 tests passed across 4 test classes).
- **Archived Artifact:** `target/devops-task-manager-1.0.0.jar` (verified in `screenshots/c1-06-archived-jar-artifact.txt`).

---

## 10. SCREENSHOTS & DEMONSTRATION EVIDENCE

Both live terminal logs (`.txt`) and genuine visual browser screenshots (`.png`) in `screenshots/visual/` are provided:

### 10.1 Visual Browser Screenshots (`screenshots/visual/`):
* **Figure 1.1A:** GitHub Repository Overview  
  *Path:* `screenshots/visual/c1-01-github-repository-main.png`  
  *Description:* Web browser view of the public GitHub repository showing project files, branches, and commit count on `main`.

* **Figure 1.1B:** GitHub Commit History & Merge Demonstration  
  *Path:* `screenshots/visual/c1-01-github-commits-history.png`  
  *Description:* Web browser view of the Git commit history showing non-fast-forward merge and feature commits.

* **Figure 1.2:** Jenkins Pipeline Dashboard  
  *Path:* `screenshots/visual/c1-04-jenkins-dashboard.png`  
  *Description:* Jenkins home dashboard showing `devops-task-manager-pipeline` with green checkmark status, sunny weather report, and Build #2 execution duration (52 sec).

* **Figure 1.3:** Jenkins Pipeline Overview & Stage History  
  *Path:* `screenshots/visual/c1-04-jenkins-pipeline-stageview.png`  
  *Description:* Pipeline project view showing green checkmarks for all builds, latest test result (no failures), 15 passed test trend, and permalinks.

* **Figure 1.4:** Jenkins JUnit 5 Test Report  
  *Path:* `screenshots/visual/c1-05-jenkins-junit-test-report.png`  
  *Description:* Interactive Jenkins test result report displaying "All tests are passing! (15/15 tests passing)" with 0 failures and 0 skipped.

* **Figure 1.5:** Jenkins Archived Fat JAR Artifact  
  *Path:* `screenshots/visual/c1-06-jenkins-archived-artifact.png`  
  *Description:* Build #2 detail view confirming archived artifact `devops-task-manager-1.0.0.jar` (20.62 MiB), SCM polling cause, and commit revision.

### 10.2 Verifiable Terminal Logs (`screenshots/`):
* `screenshots/c1-01-git-branch-merge.txt`: Git branch log displaying non-fast-forward merge graph.
* `screenshots/c1-02-maven-build-success.txt`: Terminal output of `mvn clean test package` confirming `BUILD SUCCESS`.
* `screenshots/c1-03-rest-api-tests.txt`: Terminal JSON response bodies for `/tasks`, `/tasks/{id}`, and `/health`.
* `screenshots/c1-04-jenkins-pipeline-build-console.txt`: Complete 20 KB raw console text of Jenkins Build #2.
* `screenshots/c1-05-jenkins-junit-test-report.txt`: Automated JUnit test execution summary.
* `screenshots/c1-06-archived-jar-artifact.txt`: SHA256 checksum and metadata of archived JAR.

---

## 11. CONCLUSION
Component 1 successfully delivers a production-grade REST API backend configured with full SCM versioning, automated testing, and CI pipeline automation. By incorporating JUnit 5 test reporting as an automated quality gate inside the Jenkinsfile, the pipeline guarantees that broken code cannot progress to artifact packaging or deployment stages.

---

## 12. REFERENCES
1. Spring Boot Documentation: *Building a RESTful Web Service* (https://spring.io/guides/gs/rest-service/)
2. Apache Maven Documentation: *Maven Surefire Plugin & Build Lifecycle* (https://maven.apache.org/)
3. Jenkins User Documentation: *Pipeline Syntax & SCM Polling Triggers* (https://www.jenkins.io/doc/book/pipeline/)
4. JUnit 5 User Guide: *Jupiter Test Engine and Assertions* (https://junit.org/junit5/docs/current/user-guide/)
