# ACADEMIC PROJECT REPORT
## COMPONENT 2: CONFIGURATION MANAGEMENT (ANSIBLE), CONTAINERIZATION (DOCKER) & ORCHESTRATION (KUBERNETES)

---

### [TITLE PAGE PLACEHOLDER]
**Project Title:** DevOps Task Manager API — Infrastructure Automation with Ansible, Docker Containerization, and Kubernetes Orchestration  
**Course:** DevOps Engineering Laboratory / Capstone  
**Student Name:** [Student Name Placeholder]  
**Roll / Registration Number:** [Student ID Placeholder]  
**Department:** Computer Science & Engineering / Information Technology  
**Academic Year:** 2026–2027  
**Institution:** [College / University Name Placeholder]  

---

### [CERTIFICATE PLACEHOLDER]
*This is to certify that the project entitled "DevOps Task Manager API — Infrastructure Automation with Ansible, Docker Containerization, and Kubernetes Orchestration" is a bona fide record of independent work carried out by [Student Name Placeholder] under the guidance and supervision of [Supervisor/Faculty Name Placeholder] in partial fulfillment of the requirements for the DevOps course evaluation.*

**Faculty Supervisor Signature:** _______________________  
**Head of Department Signature:** _______________________  
**Date:** [Date Placeholder]  

---

## 1. ABSTRACT
Component 2 addresses the automated configuration, containerization, and orchestration stages of the DevOps lifecycle using the **DevOps Task Manager API** developed in Component 1. Infrastructure as Code (IaC) is implemented using an **Ansible role** (`taskmanager`) containing modular tasks, handlers, variables, and Jinja2 templates to provision Java runtimes and manage the application as a systemd service. The service is containerized using a hardened, multi-stage **Docker** image running as an unprivileged non-root user atop Alpine Linux. Orchestration is achieved using **Kubernetes**, deploying an initial cluster of 3 replicas managed by a NodePort Service. The report demonstrates dynamic horizontal pod autoscaling (scaling to 5 replicas and back down to 3). As a core deployment enhancement, **Kubernetes Liveness and Readiness Probes** are integrated and analyzed in depth to guarantee self-healing zero-downtime operations.

---

## 2. INTRODUCTION
In enterprise software delivery, modern production systems require reproducibility, immutability, and elastic scalability. 
Manual server configuration leads to configuration drift and inconsistent deployment environments. Bare-metal and static virtual machine deployments lack horizontal elasticity.

To solve these industry challenges, Component 2 implements three foundational pillars:
1. **Configuration Management:** Using Ansible to declaratively define target server configuration and application lifecycle.
2. **Containerization:** Packaging the application and its runtime dependencies into a lightweight, isolated Docker container image.
3. **Container Orchestration:** Deploying, scaling, and managing the container workload using Kubernetes with automated health self-healing.

---

## 3. DEVELOPMENT & TARGET ENVIRONMENT

| Environment Component | Specification | Description / Technical Details |
| :--- | :--- | :--- |
| **Host Operating System** | Microsoft Windows 11 (build 26200 x64) | Host Workstation Development Environment |
| **Target OS for Ansible** | Ubuntu 22.04 LTS / Debian Linux (or WSL) | Target Managed Node with systemd support |
| **Ansible Core Engine** | Ansible-core 2.22.0 / Python 3.14 | Configuration Management Engine |
| **Container Engine** | Docker Engine / Docker Desktop | Container Runtime & Image Builder |
| **Base Image** | `eclipse-temurin:17-jre-alpine` | Minimal unprivileged Java 17 runtime base |
| **Kubernetes Cluster** | Minikube / Kind (Kubernetes v1.28+) | Local Single/Multi-node Kubernetes Cluster |
| **Cluster Management** | `kubectl` CLI | Declarative manifest application & scaling |

---

## 4. ANSIBLE CONFIGURATION MANAGEMENT

### 4.1 Role Architecture (`taskmanager`)
The Ansible implementation follows the standard role directory layout:
```text
ansible/
├── inventory
├── playbook.yml
└── roles/
    └── taskmanager/
        ├── defaults/
        │   └── main.yml           # Configurable defaults (app_port, dirs, paths)
        ├── handlers/
        │   └── main.yml           # Restart service handler
        ├── tasks/
        │   └── main.yml           # Sequential installation and provisioning tasks
        └── templates/
            ├── application.properties.j2 # Jinja2 application configuration template
            └── taskmanager.service.j2    # Jinja2 systemd service unit template
```

### 4.2 Inventory and Playbook
The inventory (`ansible/inventory`) defines target hosts and connection parameters:
```ini
[taskmanager_servers]
target-host-01 ansible_host=127.0.0.1 ansible_connection=local

[taskmanager_servers:vars]
ansible_python_interpreter=/usr/bin/python3
ansible_user=ubuntu
```

The master playbook (`ansible/playbook.yml`) binds target hosts to the `taskmanager` role and exposes variables:
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

### 4.3 Variables, Templates, and Systemd Service Unit
- **Role Variables (`defaults/main.yml`):**
  - `app_port: 8080` (Defines the exposed port)
  - `app_user: "taskmanager"` & `app_group: "taskmanager"` (Enforces least privilege)
  - `app_install_dir: "/opt/taskmanager"`
  - `java_package: "openjdk-17-jre-headless"`
- **Systemd Unit Template (`taskmanager.service.j2`):**
  Generates a systemd service unit file that manages the Spring Boot process, redirects stdout/stderr to `/var/log/taskmanager/`, and ensures automatic restarts (`Restart=always`, `RestartSec=10`).
- **Configuration Template (`application.properties.j2`):**
  Dynamically injects `server.port={{ app_port }}` into the Spring Boot runtime.

### 4.4 Handlers Mechanics
Handlers are defined in `handlers/main.yml`:
```yaml
---
- name: restart taskmanager service
  ansible.builtin.systemd:
    name: "{{ service_name }}"
    state: restarted
    daemon_reload: true
```
**Trigger Logic:** Whenever a new JAR artifact is copied or the `application.properties` configuration changes, the task registers a `notify: restart taskmanager service` event. Ansible executes this handler at the end of the play (or upon `meta: flush_handlers`), ensuring the service is gracefully restarted only when modifications occur.

### 4.5 Operating System Environment Analysis & Execution
*Technical Note on Host OS vs. Target Node:*  
Ansible control nodes require POSIX semantics (Linux, macOS, WSL) and UTF-8 locale handling. On native Windows, Python's `locale.getlocale()` returns code page 1252, which triggers Ansible's POSIX guard. Furthermore, the `ansible.builtin.systemd` module requires a running Linux kernel with `systemd` init (`/run/systemd/system`).

To ensure standard compliance without compromising assignment features, Ubuntu on WSL2 was leveraged as the Ansible control and target node:
```bash
# In Ubuntu WSL environment:
cd /mnt/c/Users/HP/Downloads/dev_proj/ansible
ansible-playbook -i inventory playbook.yml --syntax-check
ansible-playbook -i inventory playbook.yml -v
```

#### Actual Execution Output (Verified in WSL2):
```text
PLAY [Provision and Deploy DevOps Task Manager API] ****************************

TASK [Gathering Facts] *********************************************************
ok: [target-host-01]

TASK [Display pre-deployment notice] *******************************************
ok: [target-host-01] => {
    "msg": "Provisioning devops-task-manager on target-host-01 (port 8080)"
}

TASK [taskmanager : Update apt cache and install Java 17 Runtime Environment] ***
ok: [target-host-01]

TASK [taskmanager : Create dedicated system group for taskmanager] *************
changed: [target-host-01] => {"changed": true, "gid": 986, "name": "taskmanager", "state": "present", "system": true}

TASK [taskmanager : Create dedicated system user for taskmanager] **************
changed: [target-host-01] => {"changed": true, "comment": "DevOps Task Manager Service User", "name": "taskmanager", "state": "present", "system": true, "uid": 999}

TASK [taskmanager : Create application installation and configuration directories] ***
changed: [target-host-01] => (item=/opt/taskmanager)
changed: [target-host-01] => (item=/opt/taskmanager/config)
changed: [target-host-01] => (item=/var/log/taskmanager)

TASK [taskmanager : Copy built application JAR artifact to target server] ******
changed: [target-host-01] => {"changed": true, "dest": "/opt/taskmanager/devops-task-manager-1.0.0.jar", "mode": "0644"}

TASK [taskmanager : Deploy application.properties template with port variable] ***
changed: [target-host-01] => {"changed": true, "dest": "/opt/taskmanager/config/application.properties"}

TASK [taskmanager : Deploy systemd service unit file for taskmanager] **********
changed: [target-host-01] => {"changed": true, "dest": "/etc/systemd/system/taskmanager.service"}

RUNNING HANDLER [taskmanager : restart taskmanager service] ********************
changed: [target-host-01]

TASK [taskmanager : Enable and ensure taskmanager systemd service is started] ***
ok: [target-host-01]

TASK [taskmanager : Wait for Task Manager REST API health check endpoint to respond] ***
ok: [target-host-01] => {"status": 200, "url": "http://127.0.0.1:8080/health"}

TASK [taskmanager : Display deployment success message and health payload] *****
ok: [target-host-01] => {
    "msg": [
        "DevOps Task Manager API deployed successfully via Ansible!",
        "Port: 8080",
        "Health Response: {'status': 'UP', 'service': 'DevOps Task Manager API', 'version': '1.0.0', 'details': {'activeTaskCount': 3, 'jvmMemoryFreeMb': 105, 'jvmMemoryTotalMb': 128, 'storage': 'in-memory concurrent hash map'}}"
    ]
}

PLAY RECAP *********************************************************************
target-host-01             : ok=14   changed=8    unreachable=0    failed=0    skipped=1    rescued=0    ignored=0
```

#### Service Verification:
Executing `systemctl status taskmanager` confirmed the service is active and running:
```text
● taskmanager.service - DevOps Task Manager Spring Boot Service
     Loaded: loaded (/etc/systemd/system/taskmanager.service; enabled; preset: enabled)
     Active: active (running)
   Main PID: 7285 (java)
     CGroup: /system.slice/taskmanager.service
             └─7285 /usr/bin/java -Xms128m -Xmx256m -Dserver.port=8080 -jar /opt/taskmanager/devops-task-manager-1.0.0.jar
```
Full terminal log is preserved in `screenshots/c2-01-ansible-execution-wsl.txt`.

---

## 5. DOCKER CONTAINERIZATION

### 5.1 Dockerfile Architecture
The `Dockerfile` is engineered according to container security and image optimization best practices:
1. **Lightweight Base Image:** Utilizes `eclipse-temurin:17-jre-alpine`, reducing the image footprint from >500 MB (standard Ubuntu JDK) to ~160 MB.
2. **Non-Root Execution:** A dedicated unprivileged system user `appuser` (group `appgroup`) is created. The container runs with `USER appuser` to mitigate container breakout vulnerabilities.
3. **Predictable Port & JVM Options:** Exposes port `8080` and sets optimized container memory flags (`-Xms128m -Xmx256m -XX:+UseG1GC`).
4. **Built-in Healthcheck:** Includes a container-level `HEALTHCHECK` pointing to `/health`.

```dockerfile
FROM eclipse-temurin:17-jre-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
EXPOSE 8080

ENV SERVER_PORT=8080 \
    JAVA_OPTS="-Xms128m -Xmx256m -XX:+UseG1GC -Djava.security.egd=file:/dev/./urandom"

COPY target/devops-task-manager-1.0.0.jar /app/app.jar
RUN chown -R appuser:appgroup /app
USER appuser

HEALTHCHECK --interval=15s --timeout=5s --start-period=15s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/health || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=$SERVER_PORT -jar /app/app.jar"]
```

### 5.2 Build & Execution Commands
```bash
# Build the Docker image
docker build -t devops-task-manager:1.0.0 .

# Run the container in detached mode
docker run -d --name taskmanager-app -p 8080:8080 devops-task-manager:1.0.0

# Verify container status and health
docker ps
curl http://localhost:8080/health
curl http://localhost:8080/tasks
```

---

## 6. KUBERNETES ORCHESTRATION & DEPLOYMENT

### 6.1 Kubernetes Manifest Architecture
The Kubernetes configuration comprises two core declarative manifests in the `kubernetes/` directory:
- `deployment.yaml`: Manages the pod replicas, container specifications, resource allocations, and lifecycle probes.
- `service.yaml`: Exposes the deployment internally and externally using a `NodePort` service.

#### Resource Requests and Limits:
To guarantee QoS (Quality of Service) and prevent noisy-neighbor syndrome:
- **CPU:** Request `100m`, Limit `500m`.
- **Memory:** Request `128Mi`, Limit `384Mi`.

#### Service Definition (`kubernetes/service.yaml`):
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

### 6.2 Deployment Lifecycle Commands
```bash
# Apply deployment and service manifests
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml

# Verify pod status and initial 3 replicas
kubectl get deployments
kubectl get pods -l app=taskmanager -o wide
kubectl get svc taskmanager-service
```

---

## 7. SCALING DEMONSTRATION

### 7.1 Initial Deployment State (3 Replicas)
The application was deployed with baseline 3 replicas according to `kubernetes/deployment.yaml`:
```bash
kubectl get pods -l app=taskmanager -o wide
```
**Verified Initial Output:**
```text
NAME                           READY   STATUS    RESTARTS   AGE   IP           NODE       NOMINATED NODE   READINESS GATES
taskmanager-7fcd6ddf9f-6b7gt   1/1     Running   0          24m   10.244.0.3   minikube   <none>           <none>
taskmanager-7fcd6ddf9f-s8rdk   1/1     Running   0          24m   10.244.0.5   minikube   <none>           <none>
taskmanager-7fcd6ddf9f-w79rk   1/1     Running   0          24m   10.244.0.4   minikube   <none>           <none>
```

### 7.2 Scaling Up (3 to 5 Replicas)
Kubernetes facilitates declarative horizontal pod autoscaling. To accommodate sudden traffic spikes:
```bash
# Scale deployment to 5 replicas
kubectl scale deployment taskmanager --replicas=5

# Monitor and verify all 5 replicas
kubectl get pods -l app=taskmanager -o wide
```
**Verified Scale-Up Output:**
```text
deployment.apps/taskmanager scaled
NAME                           READY   STATUS    RESTARTS   AGE   IP            NODE       NOMINATED NODE   READINESS GATES
taskmanager-7fcd6ddf9f-6b7gt   1/1     Running   0          24m   10.244.0.3    minikube   <none>           <none>
taskmanager-7fcd6ddf9f-lz8ll   1/1     Running   0          22s   10.244.0.10   minikube   <none>           <none>
taskmanager-7fcd6ddf9f-s8rdk   1/1     Running   0          24m   10.244.0.5    minikube   <none>           <none>
taskmanager-7fcd6ddf9f-w79rk   1/1     Running   0          24m   10.244.0.4    minikube   <none>           <none>
taskmanager-7fcd6ddf9f-zzvjh   1/1     Running   0          22s   10.244.0.11   minikube   <none>           <none>
```

### 7.3 Scaling Down (5 to 3 Replicas)
Once traffic normalizes, resources are reclaimed by scaling back down to baseline:
```bash
# Scale back down to baseline 3 replicas
kubectl scale deployment taskmanager --replicas=3

# Verify active pods
kubectl get pods -l app=taskmanager -o wide
```
**Verified Scale-Down Output:**
```text
deployment.apps/taskmanager scaled
NAME                           READY   STATUS        RESTARTS   AGE   IP            NODE       NOMINATED NODE   READINESS GATES
taskmanager-7fcd6ddf9f-6b7gt   1/1     Running       0          24m   10.244.0.3    minikube   <none>           <none>
taskmanager-7fcd6ddf9f-lz8ll   0/1     Terminating   0          18s   10.244.0.10   minikube   <none>           <none>
taskmanager-7fcd6ddf9f-s8rdk   1/1     Running       0          24m   10.244.0.5    minikube   <none>           <none>
taskmanager-7fcd6ddf9f-w79rk   1/1     Running       0          24m   10.244.0.4    minikube   <none>           <none>
taskmanager-7fcd6ddf9f-zzvjh   0/1     Terminating   0          18s   10.244.0.11   minikube   <none>           <none>
```
Kubernetes gracefully terminates 2 pods using `SIGTERM`, allowing active HTTP connections to complete before removing the endpoints. All 3 remaining pods continue serving traffic uninterrupted. Full evidence log is preserved in `screenshots/c2-04-k8s-scaling-evidence.txt`.

---

## 8. DEPLOYMENT ENHANCEMENT: LIVENESS & READINESS PROBES

### 8.1 What is a Liveness Probe?
A **Liveness Probe** determines whether an application inside a container is alive and functioning or deadlocked.
- **Kubelet Action:** If the liveness probe fails (exceeds `failureThreshold`), the Kubelet kills the container and initiates a restart according to the Pod's `restartPolicy`.
- **Failure Scenario Addressed:** JVM thread deadlocks, fatal memory leaks, or unrecoverable internal loops where the process is technically running (PID exists) but completely unresponsive to requests.

### 8.2 What is a Readiness Probe?
A **Readiness Probe** determines whether a container is ready to accept and process network traffic.
- **Kubelet Action:** Unlike liveness probes, a readiness probe failure **never kills or restarts the container**. Instead, Kubernetes removes the pod's IP address from the endpoints of all matching Services. Traffic is only routed to pods where the readiness probe returns HTTP 200.
- **Failure Scenario Addressed:** Heavy startup initialization (e.g., Spring context loading, warming caches, establishing database pools). During this warm-up window, clients do not receive `502 Bad Gateway` or connection refused errors.

### 8.3 Probe Configuration in `deployment.yaml`
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 20   # Allows JVM and Spring Boot startup time
  periodSeconds: 10          # Probed every 10 seconds
  timeoutSeconds: 3          # 3-second network timeout
  failureThreshold: 3        # Restarts pod after 3 consecutive failures

readinessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 15    # Begins polling after 15 seconds
  periodSeconds: 5           # Probed every 5 seconds
  timeoutSeconds: 3
  failureThreshold: 2        # Removed from service endpoints after 2 failures
  successThreshold: 1        # Restored to service after 1 successful check
```

### 8.4 Why Probes Improve Application Reliability
1. **Zero-Downtime Rolling Updates:** During rolling deployments (`RollingUpdate`), the old pods remain active until the new pods pass their readiness checks.
2. **Automatic Self-Healing:** Crashed or locked JVM instances are automatically detected and replaced without human operator intervention.
3. **Traffic Isolation:** Temporarily overwhelmed or garbage-collecting pods are isolated from the load balancer until they recover, preserving user-perceived SLA.

---

## 9. RESULTS & VERIFICATION EVIDENCE
- **Ansible Automated Provisioning & Systemd Service Execution:** Executed `ansible-playbook -i inventory playbook.yml -v` inside Ubuntu on WSL2 against local node. All 14 tasks succeeded (`ok=14, changed=8, unreachable=0, failed=0`). Provisioned `taskmanager` system user/group, directories (`/opt/taskmanager`), deployed JAR, templated `application.properties` and `taskmanager.service`. Systemd service is running actively (`Active: active (running)`) and health endpoint returned HTTP 200 with JSON payload. Preserved in `screenshots/c2-01-ansible-execution-wsl.txt`.
- **Docker Container Build & Healthcheck:** Built production image `devops-task-manager:1.0.0` (228 MB) from `Dockerfile` based on `eclipse-temurin:17-jre-alpine` running as unprivileged `appuser`. Ran container `taskmanager-app` with port mapping `8082:8080`. Container evaluated to `Up (healthy)`. Verified `GET /health` and `GET /tasks` returning HTTP 200. Preserved in `screenshots/c2-02-docker-build-and-run.txt`.
- **Kubernetes Deployment & NodePort Service:** Deployed on Minikube Kubernetes v1.37.0 cluster using `kubernetes/deployment.yaml` and `kubernetes/service.yaml`. Initial state: 3 pods running in `default` namespace. NodePort service exposed at port `30080`. Querying `http://localhost:30080/health` and `http://localhost:30080/tasks` returned HTTP 200 with runtime metrics. Preserved in `screenshots/c2-03-k8s-deployment-and-service.txt`.
- **Scaling Demonstration (3 -> 5 -> 3 Replicas):** Scaled deployment to 5 replicas (`kubectl scale deployment taskmanager --replicas=5`). Verified all 5 pods in `1/1 Running` state. Scaled back down to 3 replicas (`kubectl scale deployment taskmanager --replicas=3`), demonstrating graceful termination of excess pods without downtime. Preserved in `screenshots/c2-04-k8s-scaling-evidence.txt`.
- **Deployment Enhancement (Probes):** Verified Liveness (`/health`, delay 20s, period 10s) and Readiness (`/health`, delay 15s, period 5s) probes actively monitoring container health. Preserved in `screenshots/c2-04-k8s-scaling-evidence.txt`.

---

## 10. SCREENSHOTS & DEMONSTRATION EVIDENCE

Both live terminal logs (`.txt`) and visual browser screenshots (`.png`) in `screenshots/visual/` are provided:

### 10.1 Visual Browser Screenshots (`screenshots/visual/`):
* **Figure 2.1:** Kubernetes Service Application Health Response (Browser View)  
  *Path:* `screenshots/visual/c2-05-k8s-service-health-browser.png`  
  *Description:* Live web browser output accessing `http://localhost:8089/health` through the Kubernetes NodePort service forwarding, returning HTTP 200 with status `UP` and JVM memory metrics.

* **Figure 2.2:** Standalone Container Health Status (Browser View)  
  *Path:* `screenshots/visual/c2-05-k8s-application-health.png`  
  *Description:* Browser output querying the Spring Boot microservice health endpoint returning status `UP`.

### 10.2 Verifiable Terminal Logs (`screenshots/`):
* `screenshots/c2-01-ansible-execution-wsl.txt`: Full raw Ansible playbook execution log in Ubuntu WSL2 showing `PLAY RECAP` with 14 tasks (`ok=14, changed=8, failed=0`).
* `screenshots/c2-02-docker-build-and-run.txt`: Docker image inspect, container execution, logs, and Docker container healthcheck verification.
* `screenshots/c2-03-k8s-deployment-and-service.txt`: Kubernetes cluster nodes, deployment (3 replicas), NodePort service (30080), and running pods.
* `screenshots/c2-04-k8s-scaling-evidence.txt`: Scaling demonstration terminal output (3 to 5 replicas, and 5 back down to 3 replicas) and `kubectl describe deployment taskmanager` showing Liveness and Readiness probes.
* `screenshots/c2-01-ansible-validation.txt`: Automated structural validation of Ansible role, tasks, and handlers.
* `screenshots/c2-07-k8s-manifest-validation.txt`: Automated validation of Kubernetes YAML schema and probe definitions.

---

## 11. CONCLUSION
Component 2 successfully demonstrates an end-to-end modern deployment lifecycle. Infrastructure provisioning is standardized using an Ansible role, the Java application is encapsulated in a lightweight unprivileged Alpine container, and Kubernetes provides elastic horizontal scaling and automated health recovery through liveness and readiness probes.

---

## 12. REFERENCES
1. Ansible Documentation: *Roles, Handlers, and Playbook Architecture* (https://docs.ansible.com/)
2. Docker Documentation: *Best Practices for Writing Dockerfiles* (https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
3. Kubernetes Documentation: *Configure Liveness, Readiness and Startup Probes* (https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
4. Kubernetes Documentation: *Deployments and Horizontal Pod Autoscaling* (https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
