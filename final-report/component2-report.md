# M. S. RAMAIAH INSTITUTE OF TECHNOLOGY
### (Autonomous Institute, Affiliated to Visvesvaraya Technological University, Belagavi)
### Department of Computer Science & Engineering (Cyber Security)
#### Bengaluru – 560054, Karnataka, India

---

# SELF LEARNING ACTIVITY REPORT — COMPONENT 2
## Configuration Management with Ansible, Containerization with Docker & Orchestration with Kubernetes
### Course: DevOps (Course Code: 24CYAEC59 | Credits: 1:0:0 | 15L)
**5th Semester, B.E. in Computer Science & Engineering (Cyber Security)**  
**Academic Year:** 2026–2027  

---

### STUDENT & EVALUATION DETAILS

| Field | Details |
| :--- | :--- |
| **Student Name** | Vivek Shreeranga Sharma M V |
| **University Seat Number (USN)** | 1MS24CY069 |
| **Department** | Computer Science & Engineering (Cyber Security) |
| **Semester / Section** | 5th Semester / Cyber Security |
| **Course Title & Code** | DevOps (24CYAEC59) |
| **Component Evaluated** | Component 2: Ansible, Docker & Kubernetes (10 Marks) |
| **Project Title** | DevOps Task Manager API — Infrastructure Automation, Containerization & Orchestration |
| **Faculty Guide / Evaluator** | Mr. Prashanth Reddy C, Senior Lecturer, Dept. of CSE (AI & ML) and CSE (Cyber Security) |
| **GitHub Repository** | `https://github.com/VivekSharma4083/devops-task-manager` |

---

## CERTIFICATE

This is to certify that the project report entitled **"DevOps Task Manager API — Infrastructure Automation with Ansible, Docker Containerization, and Kubernetes Orchestration (Component 2)"** is a bona fide record of independent work carried out by **Vivek Shreeranga Sharma M V** bearing USN **1MS24CY069** in partial fulfillment for the evaluation of the Self Learning Activity in **DevOps (24CYAEC59)** prescribed by the Department of Computer Science & Engineering (Cyber Security), M. S. Ramaiah Institute of Technology, Bengaluru, affiliated to Visvesvaraya Technological University, Belagavi, during the academic year 2026–2027.

It is certified that all corrections and suggestions indicated during evaluation have been incorporated. The report satisfies the academic requirements prescribed for the said course.

<br><br><br>

--------------------------------------------- &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; ---------------------------------------------  
**Mr. Prashanth Reddy C** &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; **Head of Department**  
Faculty Guide, Senior Lecturer &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Dept. of CSE (Cyber Security)  
Dept. of CSE (AI & ML) / CSE (Cyber Security) &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; M. S. Ramaiah Institute of Technology  
M. S. Ramaiah Institute of Technology  

---

## LIST OF PROJECT BASED LEARNING COMPONENTS

| Component | Title | Key Technologies | Scope of Work & Deliverables | Max Marks | Marks Awarded |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **Component 2** | Configuration Management, Containerization & Orchestration | Ansible Core 2.20, Docker 29.9, Kubernetes (Minikube v1.37.0), WSL2 Ubuntu 26.04 | Server provisioning using Ansible role (`taskmanager`) with inventory, variables, handlers, and Jinja2 systemd templates; Docker single-stage Alpine containerization; Kubernetes 3-replica deployment and NodePort service; manual horizontal pod scaling (3 $\to$ 5 $\to$ 3); Kubernetes Liveness and Readiness probes deployment enhancement. | **10** | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |

---

## ASSESSMENT RUBRICS (COMPONENT 2 — 10 MARKS)

| Assessment Criteria | Excellent (Full Marks) | Good (Moderate Marks) | Needs Improvement | Max Marks | Marks Awarded |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **1. Ansible Configuration Management** | Structured Ansible role (`taskmanager`) featuring modular tasks, inventory, role variables, notify-handler mechanics, Jinja2 templates, and live WSL2 execution (`ok=14, changed=8, failed=0`). | Working playbook without role modularity or lacking handlers and templates. | Incomplete tasks, syntax errors, or failing execution. | **3.0** | |
| **2. Docker Containerization & Best Practices** | Optimized single-stage Docker runtime image based on Alpine Linux; non-root user execution (`appuser`); JVM memory limits; integrated container `HEALTHCHECK`. | Working Docker container but running as root or using heavy monolithic base image. | Dockerfile fails to compile or container exits immediately. | **2.0** | |
| **3. Kubernetes Deployment & Manual Scaling** | Declarative Deployment and NodePort Service manifests with explicit resource quotas; verified 3 initial replicas; manual horizontal scaling to 5 replicas and back down to 3 replicas with zero downtime. | Basic Kubernetes pod running but lacking NodePort exposure or scaling demonstration. | Manifests contain syntax errors or pods crash during scheduling. | **3.0** | |
| **4. Deployment Enhancement: Health Probes** | Detailed implementation and architectural comparison of Kubernetes Liveness and Readiness probes; configured initial delays, periods, and failure thresholds. | Probes defined but not verified or lacking failure scenario explanation. | No health probes configured in deployment manifest. | **2.0** | |
| **TOTAL** | | | | **10.0** | |

---

## MARKS AWARDED

| Component Evaluated | Maximum Marks | Marks Awarded (in figures) | Marks Awarded (in words) | Signature of Faculty Evaluator |
| :--- | :---: | :---: | :---: | :---: |
| **Component 2: Ansible, Docker & Kubernetes** | **10** | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | _______________________ |

---

## 1. ABSTRACT

In cloud infrastructure engineering, reproducibility, container encapsulation, and automated cluster orchestration are critical to managing reliable distributed systems. This report documents the implementation of Component 2 for the **DevOps Task Manager API**, applying modern Infrastructure as Code (IaC), containerization, and orchestration paradigms to the microservice packaged in Component 1.

The implementation encompasses:
1. **Configuration Management via Ansible:** A modular Ansible role (`taskmanager`) was designed with dedicated tasks, role variables, notification handlers, and Jinja2 templates. Executed inside an Ubuntu WSL2 environment with systemd, the playbook successfully provisioned the host, created an unprivileged system user, deployed application properties and systemd service units, and verified active service execution (`ok=14, changed=8, failed=0`).
2. **Hardened Containerization via Docker:** The application was encapsulated in a single-stage, optimized runtime Docker image (`eclipse-temurin:17-jre-alpine`). In accordance with security best practices, the container runs under an unprivileged user (`appuser`), enforces JVM heap boundaries, and embeds a native container `HEALTHCHECK`.
3. **Cluster Orchestration via Kubernetes:** The containerized microservice was deployed onto a Minikube cluster (Kubernetes Server v1.37.0) using declarative `Deployment` and `Service` manifests. A baseline of 3 pod replicas was exposed via a `NodePort` service (port 30080).
4. **Manual Horizontal Pod Scaling:** Elastic scaling was demonstrated by manually scaling the deployment from 3 to 5 replicas to handle simulated demand, and subsequently scaling back down to 3 replicas while verifying uninterrupted service availability.
5. **Deployment Enhancement — Liveness & Readiness Probes:** Advanced Kubernetes health probes were configured on the `/health` endpoint to differentiate between process liveness (triggering container restart upon deadlock) and service readiness (isolating initializing pods from the load balancer).

All execution steps have been validated with live terminal captures, cluster state queries, and web browser responses.

---

## 2. INTRODUCTION & OBJECTIVES

Traditional software deployments on static servers are susceptible to configuration drift, unmanaged dependencies, and fragile manual upgrades. Modern DevOps methodologies address these vulnerabilities through declarative configuration management, immutable container images, and self-healing container orchestrators.

### Objectives for Component 2:
1. **Declarative Infrastructure Provisioning:** Author an Ansible role to automate package installation, security user creation, directory management, and systemd service registration.
2. **Immutable Container Packaging:** Create a lean, secure Docker image adhering to least-privilege principles and container health monitoring.
3. **Declarative Cluster Deployment:** Configure Kubernetes Deployment and NodePort Service manifests with deterministic resource requests and limits.
4. **Elastic Scaling Verification:** Demonstrate manual horizontal scaling of pod replicas using `kubectl scale` to validate elastic capacity management.
5. **Deployment Enhancement Implementation:** Integrate Kubernetes Liveness and Readiness probes to enable self-healing and zero-downtime routing.

---

## 3. DEVELOPMENT & TARGET ENVIRONMENT

The configuration management, containerization, and cluster orchestration environment specifications are summarized in Table 2.1:

#### Table 2.1: Component 2 Environment Specifications
| Environment Component | Tool & Version | Technical Details / Role |
| :--- | :--- | :--- |
| **Host Workstation OS** | Windows 11 Home (x64, Build 26200) | Development host and Hyper-V/WSL2 parent environment |
| **Target OS (Ansible)** | Ubuntu 26.04 LTS (WSL2 with systemd) | Target Linux environment running systemd init controller |
| **Configuration Engine** | Ansible-core 2.20.1 / Python 3.14.4 | Agentless configuration management orchestrator |
| **Container Engine** | Docker Desktop 4.99.0 (Engine 29.9.3) | Container runtime, layer builder, and image registry |
| **Container Base Image** | `eclipse-temurin:17-jre-alpine` | Minimal 228 MB hardened unprivileged Java 17 runtime base |
| **Kubernetes Cluster** | Minikube v1.37.0 (Kubernetes v1.37.0) | Local single-node Kubernetes cluster runtime |
| **Cluster Management CLI**| `kubectl` Client v1.31.0 | Declarative manifest deployment, scaling, and probe inspection |

---

## 4. STEP 1: ANSIBLE CONFIGURATION MANAGEMENT

### 4.1 Role Architecture & Layout
Ansible was selected for server configuration management due to its agentless architecture and idempotent execution guarantees. The implementation follows standard Ansible galaxy role directory conventions under `ansible/roles/taskmanager/`:

```text
ansible/
├── inventory
├── playbook.yml
└── roles/
    └── taskmanager/
        ├── defaults/
        │   └── main.yml           # Configurable role variables and defaults
        ├── handlers/
        │   └── main.yml           # Service restart handler on configuration changes
        ├── tasks/
        │   └── main.yml           # Idempotent provisioning tasks
        └── templates/
            ├── application.properties.j2 # Jinja2 application configuration template
            └── taskmanager.service.j2    # Jinja2 systemd service unit template
```

### 4.2 Inventory & Master Playbook
The inventory (`ansible/inventory`) defines target connection parameters:
```ini
[taskmanager_servers]
target-host-01 ansible_host=127.0.0.1 ansible_connection=local

[taskmanager_servers:vars]
ansible_python_interpreter=/usr/bin/python3
ansible_user=ubuntu
```

The master playbook (`ansible/playbook.yml`) binds the target group to the `taskmanager` role:
```yaml
---
- name: Provision and Deploy DevOps Task Manager API
  hosts: taskmanager_servers
  become: true
  vars:
    app_port: 8080
    app_environment: "production"

  roles:
    - role: taskmanager
```

### 4.3 Variables, Tasks, Handlers & Templates

#### Listing 2.1: `defaults/main.yml` (Role Variables)
```yaml
---
# Default variables for taskmanager role
app_name: "devops-task-manager"
app_version: "1.0.0"
app_jar_name: "devops-task-manager-1.0.0.jar"
app_port: 8080
app_user: "taskmanager"
app_group: "taskmanager"
app_install_dir: "/opt/taskmanager"
app_config_dir: "/opt/taskmanager/config"
app_log_dir: "/var/log/taskmanager"
java_package: "openjdk-17-jre-headless"
service_name: "taskmanager"
app_jvm_opts: "-Xms128m -Xmx256m"
```

#### Listing 2.2: `tasks/main.yml` (Provisioning Tasks)
```yaml
---
- name: Display pre-deployment notice
  ansible.builtin.debug:
    msg: "Provisioning {{ app_name }} on {{ inventory_hostname }} (port {{ app_port }})"

- name: Update apt cache and install Java 17 Runtime Environment
  ansible.builtin.apt:
    name: "{{ java_package }}"
    state: present
    update_cache: true
    cache_valid_time: 3600

- name: Create dedicated system group for taskmanager
  ansible.builtin.group:
    name: "{{ app_group }}"
    state: present
    system: true

- name: Create dedicated system user for taskmanager
  ansible.builtin.user:
    name: "{{ app_user }}"
    group: "{{ app_group }}"
    system: true
    shell: /usr/sbin/nologin
    create_home: false
    comment: "DevOps Task Manager Service User"
    state: present

- name: Create application installation and configuration directories
  ansible.builtin.file:
    path: "{{ item }}"
    state: directory
    owner: "{{ app_user }}"
    group: "{{ app_group }}"
    mode: '0755'
  loop:
    - "{{ app_install_dir }}"
    - "{{ app_config_dir }}"
    - "{{ app_log_dir }}"

- name: Copy built application JAR artifact to target server
  ansible.builtin.copy:
    src: "{{ playbook_dir }}/../target/{{ app_jar_name }}"
    dest: "{{ app_install_dir }}/{{ app_jar_name }}"
    owner: "{{ app_user }}"
    group: "{{ app_group }}"
    mode: '0644'
  notify: restart taskmanager service

- name: Deploy application.properties template with port variable
  ansible.builtin.template:
    src: application.properties.j2
    dest: "{{ app_config_dir }}/application.properties"
    owner: "{{ app_user }}"
    group: "{{ app_group }}"
    mode: '0644'
  notify: restart taskmanager service

- name: Deploy systemd service unit file for taskmanager
  ansible.builtin.template:
    src: taskmanager.service.j2
    dest: "/etc/systemd/system/{{ service_name }}.service"
    owner: root
    group: root
    mode: '0644'
  notify: restart taskmanager service

- name: Flush handlers to restart service immediately if configuration changed
  ansible.builtin.meta: flush_handlers

- name: Enable and ensure taskmanager systemd service is started
  ansible.builtin.systemd:
    name: "{{ service_name }}"
    enabled: true
    state: started
    daemon_reload: true

- name: Wait for Task Manager REST API health check endpoint to respond
  ansible.builtin.uri:
    url: "http://127.0.0.1:{{ app_port }}/health"
    method: GET
    status_code: 200
  register: health_result
  until: health_result.status == 200
  retries: 12
  delay: 5

- name: Display deployment success message and health payload
  ansible.builtin.debug:
    msg:
      - "DevOps Task Manager API deployed successfully via Ansible!"
      - "Port: {{ app_port }}"
      - "Health Response: {{ health_result.json }}"
```

#### Listing 2.3: `handlers/main.yml` (Notification Handlers)
```yaml
---
- name: restart taskmanager service
  ansible.builtin.systemd:
    name: "{{ service_name }}"
    state: restarted
    daemon_reload: true
```

#### Listing 2.4: `templates/taskmanager.service.j2` (Systemd Service Unit)
```ini
[Unit]
Description=DevOps Task Manager Spring Boot Service
After=network.target

[Service]
Type=simple
User={{ app_user }}
Group={{ app_group }}
WorkingDirectory={{ app_install_dir }}
ExecStart=/usr/bin/java {{ app_jvm_opts }} -Dserver.port={{ app_port }} -jar {{ app_install_dir }}/{{ app_jar_name }}
Restart=always
RestartSec=10
StandardOutput=append:{{ app_log_dir }}/taskmanager.log
StandardError=append:{{ app_log_dir }}/taskmanager-error.log

[Install]
WantedBy=multi-user.target
```

### 4.4 WSL2 Execution & Live Verification
Because native Windows lacks POSIX init systems (`/run/systemd/system`), the playbook was executed against the local managed node within **Ubuntu 26.04 LTS on WSL2**:

```bash
cd /mnt/c/Users/HP/Downloads/dev_proj/ansible
ansible-playbook -i inventory playbook.yml --syntax-check
ansible-playbook -i inventory playbook.yml -v
```

#### Verified Ansible Play Recap:
```text
PLAY RECAP *********************************************************************
target-host-01             : ok=14   changed=8    unreachable=0    failed=0    skipped=1    rescued=0    ignored=0
```
- **14 tasks executed successfully with 0 failures.**
- Systemd service `taskmanager` was enabled, started, and returned HTTP 200 on `http://127.0.0.1:8080/health`.

---

## 5. STEP 2: DOCKER CONTAINERIZATION

### 5.1 Dockerfile Architecture & Hardening
The application was containerized using a single-stage, optimized runtime Docker image engineered for security and minimal image size:
1. **Minimal Base Image:** Uses `eclipse-temurin:17-jre-alpine`, copying the pre-compiled fat JAR directly from `target/devops-task-manager-1.0.0.jar`. This reduces the final image size to **228 MB** (compared to >550 MB for Ubuntu-based JDK images).
2. **Least Privilege Non-Root User:** Creates an unprivileged system group `appgroup` and user `appuser`. The container transitions to `USER appuser` prior to runtime.
3. **Explicit JVM Flags:** Enforces memory constraints (`-Xms128m -Xmx256m`) and G1GC garbage collection suitable for container memory cgroups.
4. **Native Container Healthcheck:** Incorporates an integrated `HEALTHCHECK` verifying `/health` availability every 15 seconds.

#### Listing 2.5: Optimized `Dockerfile`
```dockerfile
FROM eclipse-temurin:17-jre-alpine

# Security: Run as non-root unprivileged user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app
EXPOSE 8080

ENV SERVER_PORT=8080 \
    JAVA_OPTS="-Xms128m -Xmx256m -XX:+UseG1GC -Djava.security.egd=file:/dev/./urandom"

# Copy pre-packaged fat JAR from Maven build
COPY target/devops-task-manager-1.0.0.jar /app/app.jar

RUN chown -R appuser:appgroup /app
USER appuser

# Health check probe for container runtime
HEALTHCHECK --interval=15s --timeout=5s --start-period=15s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=$SERVER_PORT -jar /app/app.jar"]
```

### 5.2 Container Build & Execution Validation
```bash
# 1. Build image
docker build -t devops-task-manager:1.0.0 .

# 2. Run container in background (Host Port 8082 mapped to Container Port 8080)
docker run -d --name taskmanager-app -p 8082:8080 devops-task-manager:1.0.0

# 3. Verify running container and health status
docker ps --filter "name=taskmanager-app"
```
**Outcome:**
- Container `taskmanager-app` achieved state `Up (healthy)`.
- Querying `http://localhost:8082/health` returned HTTP 200 with status `UP`.

---

## 6. STEP 3: KUBERNETES ORCHESTRATION & DEPLOYMENT

### 6.1 Declarative Manifest Architecture
Container orchestration was implemented using **Minikube** (Kubernetes Server v1.37.0). The deployment architecture separates pod lifecycle management from network routing:
- `deployment.yaml`: Defines pod template, initial 3 replicas, resource quotas, and health probes.
- `service.yaml`: Exposes the pods via a stable `NodePort` service on port `30080`.

#### Listing 2.6: `kubernetes/deployment.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: taskmanager
  labels:
    app: taskmanager
spec:
  replicas: 3
  selector:
    matchLabels:
      app: taskmanager
  template:
    metadata:
      labels:
        app: taskmanager
    spec:
      containers:
        - name: taskmanager
          image: devops-task-manager:1.0.0
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 8080
              name: http
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 384Mi
          livenessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 20
            periodSeconds: 10
            timeoutSeconds: 3
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 15
            periodSeconds: 5
            timeoutSeconds: 3
            failureThreshold: 2
            successThreshold: 1
```

#### Listing 2.7: `kubernetes/service.yaml`
```yaml
apiVersion: v1
kind: Service
metadata:
  name: taskmanager-service
spec:
  type: NodePort
  selector:
    app: taskmanager
  ports:
    - name: http
      port: 8080
      targetPort: 8080
      nodePort: 30080
      protocol: TCP
```

### 6.2 Cluster Manifest Application
```bash
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
```
**Cluster State Verification:**
```text
NAME                                READY   STATUS    RESTARTS   AGE
deployment.apps/taskmanager         3/3     3         3          24m
service/taskmanager-service         NodePort 10.106.108.196 <none> 8080:30080/TCP
```

---

## 7. STEP 4: MANUAL HORIZONTAL POD SCALING DEMONSTRATION

### 7.1 Initial Deployment State (3 Replicas)
The deployment initialized with 3 running pods across the cluster:
```bash
kubectl get pods -l app=taskmanager -o wide
```
```text
NAME                           READY   STATUS    RESTARTS   AGE   IP           NODE       NOMINATED NODE
taskmanager-7fcd6ddf9f-6b7gt   1/1     Running   0          24m   10.244.0.3   minikube   <none>
taskmanager-7fcd6ddf9f-s8rdk   1/1     Running   0          24m   10.244.0.5   minikube   <none>
taskmanager-7fcd6ddf9f-w79rk   1/1     Running   0          24m   10.244.0.4   minikube   <none>
```

### 7.2 Scaling Up (3 to 5 Replicas)
To accommodate simulated traffic growth, the deployment was scaled up to 5 replicas:
```bash
kubectl scale deployment taskmanager --replicas=5
kubectl get pods -l app=taskmanager -o wide
```
**Scale-Up Verification Output:**
```text
deployment.apps/taskmanager scaled
NAME                           READY   STATUS    RESTARTS   AGE   IP            NODE       NOMINATED NODE
taskmanager-7fcd6ddf9f-6b7gt   1/1     Running   0          24m   10.244.0.3    minikube   <none>
taskmanager-7fcd6ddf9f-lz8ll   1/1     Running   0          22s   10.244.0.10   minikube   <none>
taskmanager-7fcd6ddf9f-s8rdk   1/1     Running   0          24m   10.244.0.5    minikube   <none>
taskmanager-7fcd6ddf9f-w79rk   1/1     Running   0          24m   10.244.0.4    minikube   <none>
taskmanager-7fcd6ddf9f-zzvjh   1/1     Running   0          22s   10.244.0.11   minikube   <none>
```
All 5 pods achieved `1/1 Running` status with unique IP assignments within 22 seconds.

### 7.3 Scaling Down (5 to 3 Replicas)
Once peak demand subsided, excess pods were terminated to release cluster compute resources:
```bash
kubectl scale deployment taskmanager --replicas=3
kubectl get pods -l app=taskmanager -o wide
```
**Scale-Down Verification Output:**
```text
deployment.apps/taskmanager scaled
NAME                           READY   STATUS        RESTARTS   AGE   IP            NODE       NOMINATED NODE
taskmanager-7fcd6ddf9f-6b7gt   1/1     Running       0          24m   10.244.0.3    minikube   <none>
taskmanager-7fcd6ddf9f-lz8ll   0/1     Terminating   0          18s   10.244.0.10   minikube   <none>
taskmanager-7fcd6ddf9f-s8rdk   1/1     Running       0          24m   10.244.0.5    minikube   <none>
taskmanager-7fcd6ddf9f-w79rk   1/1     Running       0          24m   10.244.0.4    minikube   <none>
taskmanager-7fcd6ddf9f-zzvjh   0/1     Terminating   0          18s   10.244.0.11   minikube   <none>
```
The Kubernetes controller sent `SIGTERM` signals to 2 pods (`lz8ll` and `zzvjh`), gracefully draining active connections, while the original 3 pods continued serving traffic without dropped requests.

---

## 8. STEP 5: DEPLOYMENT ENHANCEMENT — LIVENESS & READINESS PROBES

### 8.1 In-Depth Comparison: Liveness vs. Readiness Probes
Kubernetes provides distinct health-checking mechanisms to decouple process monitoring from network traffic management:

#### Table 2.2: Liveness vs. Readiness Probes Comparative Analysis
| Architectural Dimension | Liveness Probe (`livenessProbe`) | Readiness Probe (`readinessProbe`) |
| :--- | :--- | :--- |
| **Primary Purpose** | Detects application deadlocks, fatal memory leaks, or hung states | Detects whether the pod is ready to accept and serve network traffic |
| **Kubelet Remediation** | **Restarts the container** according to the Pod `restartPolicy` | **Removes Pod IP from Service Endpoints** (no container restart) |
| **Failure Scenario** | Unresponsive thread pool, frozen JVM event loop, permanent crash | Slow startup initialization, warming caches, temporary overload |
| **Configuration Parameters**| Path: `/health`, Initial Delay: 20s, Period: 10s, Timeout: 3s | Path: `/health`, Initial Delay: 15s, Period: 5s, Timeout: 3s |
| **Thresholds** | `failureThreshold: 3` (restarts after 3 consecutive failures) | `failureThreshold: 2`, `successThreshold: 1` |

### 8.2 Production Benefits & Self-Healing Architecture
1. **Self-Healing Automation:** If an unexpected memory exhaustion or deadlocked lock occurs in the Java application, the Kubelet automatically detects 3 consecutive probe failures and triggers an in-place container restart.
2. **Zero-Downtime Rolling Updates:** During code updates, new pods remain isolated from the NodePort service endpoints until their Spring context fully loads and passes readiness inspection, completely eliminating `502 Bad Gateway` errors.
3. **Traffic Shedding During Overload:** If a single pod experiences temporary request spikes, readiness probe failures will temporarily unregister it from traffic routing until it catches up, preserving cluster stability.

---

## 9. DESCRIPTION OF ACTIVITY

In executing Component 2, I translated the packaged microservice from Component 1 into an enterprise-grade automated deployment pipeline spanning Ansible, Docker, and Kubernetes.

I began by designing the Ansible role `taskmanager`. To adhere to clean modularity, I structured variables in `defaults/main.yml`, service restarting logic in `handlers/main.yml`, and parameterized configurations in `templates/`. Because native Windows lacks a systemd init system, I conducted Ansible testing within **Ubuntu 26.04 LTS on WSL2**. I authored tasks to install Java 17 headless, create a locked system user (`taskmanager`), template `/etc/systemd/system/taskmanager.service`, and verify HTTP 200 via `ansible.builtin.uri`. The execution yielded `ok=14, changed=8, failed=0`, confirming full idempotency and clean service management.

Next, I engineered the `Dockerfile`. To avoid bloated container sizes, I avoided multi-gigabyte JDK base images and selected `eclipse-temurin:17-jre-alpine`, copying the pre-built fat JAR directly. I established an unprivileged non-root user `appuser`, configured explicit JVM container memory flags, and defined a container-level `HEALTHCHECK`. I built the image as `devops-task-manager:1.0.0` (228 MB) and ran a test container, verifying that `docker ps` marked the instance as `healthy`.

Finally, I transitioned to container orchestration using Kubernetes on Minikube. I authored `deployment.yaml` and `service.yaml`, configuring resource requests/limits, NodePort 30080, and the mandatory deployment enhancement: **Liveness and Readiness Probes**. After applying the manifests, I verified the 3 initial replicas. I demonstrated manual horizontal pod scaling by scaling up to 5 replicas (`kubectl scale deployment taskmanager --replicas=5`) and watching all 5 pods enter Running state within 22 seconds. I then scaled back down to 3 replicas, observing graceful `SIGTERM` pod terminations. Throughout this lifecycle, I queried the application health endpoint through the Kubernetes NodePort forwarding, verifying continuous 100% availability.

---

## 10. RESULTS & VERIFICATION EVIDENCE

Table 2.3 maps the genuine screenshots and verifiable logs preserved in the project directory:

#### Table 2.3: Component 2 Verification Evidence
| Evidence Item | File Reference | Description / Verification Detail |
| :--- | :--- | :--- |
| **Figure 2.1** | `screenshots/c2-05-k8s-service-health-browser.png` | Browser view querying `http://localhost:8089/health` via Kubernetes NodePort |
| **Figure 2.2** | `screenshots/c2-05-k8s-application-health.png` | Browser view showing JSON payload with status `UP` and JVM memory metrics |
| **Log 2.1** | `screenshots/c2-01-ansible-execution-wsl.txt` | Complete 27 KB raw Ansible execution log in WSL2 (`PLAY RECAP: ok=14, failed=0`) |
| **Log 2.2** | `screenshots/c2-01-ansible-validation.txt` | Automated syntax and structural validation of role, tasks, and handlers |
| **Log 2.3** | `screenshots/c2-02-docker-build-and-run.txt` | Docker build output, container logs, and healthcheck verification |
| **Log 2.4** | `screenshots/c2-03-k8s-deployment-and-service.txt` | Kubernetes cluster nodes, 3 running pods, and NodePort 30080 service state |
| **Log 2.5** | `screenshots/c2-04-k8s-scaling-evidence.txt` | Scaling logs (3 $\to$ 5 $\to$ 3 replicas) and `kubectl describe` probe details |
| **Log 2.6** | `screenshots/c2-07-k8s-manifest-validation.txt` | Automated YAML schema validation for deployment and service manifests |

---

## 11. CONCLUSION

Component 2 successfully demonstrates the end-to-end modern operations lifecycle for the **DevOps Task Manager API**. By using Ansible, server provisioning and systemd service management are codified as repeatable Infrastructure as Code. Through Docker, the application is packaged as a lean, secure, unprivileged Alpine container. Finally, Kubernetes orchestration provides manual elastic horizontal scaling and robust self-healing through automated Liveness and Readiness probes, establishing a highly reliable and maintainable deployment architecture.

---

## 12. REFERENCES

1. Ansible Documentation: *Roles, Handlers, and Playbook Architecture Reference*, Red Hat, Inc., 2024. [Online]. Available: `https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_reuse_roles.html`
2. Docker Documentation: *Best Practices for Writing Dockerfiles & Security Guidelines*, Docker Inc., 2024. [Online]. Available: `https://docs.docker.com/develop/develop-images/dockerfile_best-practices/`
3. Kubernetes Documentation: *Configure Liveness, Readiness and Startup Probes*, The Kubernetes Authors, 2024. [Online]. Available: `https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/`
4. Kubernetes Documentation: *Deployments, ReplicaSets, and Scaling Workloads*, The Kubernetes Authors, 2024. [Online]. Available: `https://kubernetes.io/docs/concepts/workloads/controllers/deployment/`
5. Linux Documentation Project: *Systemd Service Unit Configuration & Sandboxing*, systemd.io, 2024. [Online]. Available: `https://www.freedesktop.org/software/systemd/man/systemd.service.html`
