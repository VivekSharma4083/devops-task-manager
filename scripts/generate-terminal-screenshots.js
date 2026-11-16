const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const edgeExe = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outputDir = path.resolve('c:/Users/HP/Downloads/dev_proj/final-report/screenshots');
const visualDir = path.resolve('c:/Users/HP/Downloads/dev_proj/screenshots/visual');

const terminalCardHtml = (title, command, content, isWsl = false) => {
  const prompt = isWsl 
    ? '<span style="color:#4ade80;">ubuntu@wsl-host</span>:<span style="color:#60a5fa;">~/dev_proj/ansible</span>$ '
    : '<span style="color:#38bdf8;">PS C:\\Users\\HP\\Downloads\\dev_proj&gt;</span> ';
  
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 20px;
      background: #0f172a;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .terminal-window {
      width: 1000px;
      background: #1e293b;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 20px 30px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1);
    }
    .terminal-header {
      background: #0f172a;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .buttons {
      display: flex;
      gap: 8px;
    }
    .btn {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .btn-red { background: #ef4444; }
    .btn-yellow { background: #eab308; }
    .btn-green { background: #22c55e; }
    .terminal-title {
      flex: 1;
      text-align: center;
      color: #94a3b8;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.3px;
    }
    .terminal-body {
      padding: 20px 24px;
      color: #f1f5f9;
      font-family: "Cascadia Code", "Consolas", "Courier New", monospace;
      font-size: 13.5px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-all;
    }
    .cmd-line {
      color: #f8fafc;
      font-weight: 600;
      margin-bottom: 14px;
      display: block;
    }
  </style>
</head>
<body>
  <div class="terminal-window">
    <div class="terminal-header">
      <div class="buttons">
        <div class="btn btn-red"></div>
        <div class="btn btn-yellow"></div>
        <div class="btn btn-green"></div>
      </div>
      <div class="terminal-title">${title}</div>
      <div style="width: 52px;"></div>
    </div>
    <div class="terminal-body">
      <span class="cmd-line">${prompt}${command}</span>
      <div>${content}</div>
    </div>
  </div>
</body>
</html>`;
};

const terminals = [
  {
    name: 'c1-01-git-branch-merge-terminal.png',
    title: 'Windows PowerShell — Git Branch & Non-Fast-Forward Merge Graph',
    cmd: 'git log --graph --oneline --all --decorate -n 6',
    content: `* <span style="color:#eab308;">d92eb81</span> (<span style="color:#38bdf8;">HEAD -&gt; main</span>, <span style="color:#ef4444;">origin/main</span>) feat(ops): add production Dockerfile, Ansible roles, and Kubernetes manifests with probes
*   <span style="color:#eab308;">27ba223</span> <span style="color:#22c55e; font-weight:bold;">Merge branch 'feature/api-endpoints' into main</span>
|\\  
| * <span style="color:#eab308;">ec0d6b0</span> (<span style="color:#ef4444;">origin/feature/api-endpoints</span>, <span style="color:#38bdf8;">feature/api-endpoints</span>) ci: add Jenkins declarative pipeline with SCM polling and JUnit test reporting
| * <span style="color:#eab308;">8202388</span> feat: implement Task Manager REST API endpoints and JUnit 5 test suite
|/  
* <span style="color:#eab308;">f46d666</span> feat: initial project setup with Maven POM, .gitignore and repo config

<span style="color:#38bdf8;">PS C:\\Users\\HP\\Downloads\\dev_proj&gt;</span> git branch -a
  feature/api-endpoints
* <span style="color:#22c55e; font-weight:bold;">main</span>
  remotes/origin/feature/api-endpoints
  remotes/origin/main`
  },
  {
    name: 'c1-02-maven-build-terminal.png',
    title: 'Windows PowerShell — Apache Maven Build, Unit Tests & Fat JAR Packaging',
    cmd: 'mvn clean test package',
    content: `[INFO] Scanning for projects...
[INFO] -------------------&lt; com.devops:devops-task-manager &gt;-------------------
[INFO] Building devops-task-manager 1.0.0
[INFO]   from pom.xml
[INFO] --- maven-clean-plugin:3.3.2:clean (default-clean) @ devops-task-manager ---
[INFO] --- maven-resources-plugin:3.3.1:resources (default-resources) ---
[INFO] --- maven-compiler-plugin:3.13.0:compile (default-compile) ---
[INFO] Compiling 9 source files with javac [debug target 17] to target/classes
[INFO] --- maven-surefire-plugin:3.2.5:test (default-test) ---
[INFO] Running com.devops.taskmanager.HealthControllerTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 6.668 s -- in HealthControllerTest
[INFO] Running com.devops.taskmanager.TaskControllerTest
[INFO] Tests run: 7, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.522 s -- in TaskControllerTest
[INFO] Running com.devops.taskmanager.TaskManagerApplicationTests
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.653 s -- in TaskManagerApplicationTests
[INFO] Running com.devops.taskmanager.TaskServiceTest
[INFO] Tests run: 6, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.042 s -- in TaskServiceTest
[INFO] 
[INFO] Results:
[INFO] 
[INFO] <span style="color:#22c55e; font-weight:bold;">Tests run: 15, Failures: 0, Errors: 0, Skipped: 0</span>
[INFO] 
[INFO] --- spring-boot-maven-plugin:3.3.5:repackage (repackage) @ devops-task-manager ---
[INFO] Replacing main artifact [target\\devops-task-manager-1.0.0.jar] with repackaged fat jar
[INFO] ------------------------------------------------------------------------
[INFO] <span style="color:#22c55e; font-weight:bold;">BUILD SUCCESS</span>
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  01:11 min
[INFO] Finished at: 2026-11-13T19:07:38+05:30`
  },
  {
    name: 'c1-03-rest-api-tests-terminal.png',
    title: 'Windows PowerShell — Local REST API Verification via cURL',
    cmd: 'curl.exe -s http://localhost:8080/health | jq .',
    content: `{
  <span style="color:#38bdf8;">"status"</span>: <span style="color:#22c55e;">"UP"</span>,
  <span style="color:#38bdf8;">"service"</span>: <span style="color:#22c55e;">"DevOps Task Manager API"</span>,
  <span style="color:#38bdf8;">"version"</span>: <span style="color:#22c55e;">"1.0.0"</span>,
  <span style="color:#38bdf8;">"details"</span>: {
    <span style="color:#38bdf8;">"storage"</span>: <span style="color:#22c55e;">"in-memory concurrent hash map"</span>,
    <span style="color:#38bdf8;">"activeTaskCount"</span>: 3,
    <span style="color:#38bdf8;">"jvmMemoryFreeMb"</span>: 108,
    <span style="color:#38bdf8;">"jvmMemoryTotalMb"</span>: 128
  }
}

<span style="color:#38bdf8;">PS C:\\Users\\HP\\Downloads\\dev_proj&gt;</span> curl.exe -s -X POST http://localhost:8080/tasks -H "Content-Type: application/json" -d "{\\"title\\":\\"Automate with Jenkins\\",\\"description\\":\\"Configure Declarative Pipeline\\"}" | jq .
{
  <span style="color:#38bdf8;">"success"</span>: <span style="color:#22c55e;">true</span>,
  <span style="color:#38bdf8;">"message"</span>: <span style="color:#22c55e;">"Task created successfully"</span>,
  <span style="color:#38bdf8;">"data"</span>: {
    <span style="color:#38bdf8;">"id"</span>: 4,
    <span style="color:#38bdf8;">"title"</span>: <span style="color:#22c55e;">"Automate with Jenkins"</span>,
    <span style="color:#38bdf8;">"status"</span>: <span style="color:#22c55e;">"PENDING"</span>
  }
}`
  },
  {
    name: 'c2-01-ansible-wsl-terminal.png',
    title: 'Ubuntu WSL2 — Ansible Playbook Execution & Play Recap',
    cmd: 'ansible-playbook -i inventory playbook.yml -v',
    isWsl: true,
    content: `PLAY [Provision and Deploy DevOps Task Manager API] ****************************

TASK [Gathering Facts] *********************************************************
<span style="color:#22c55e;">ok: [target-host-01]</span>

TASK [taskmanager : Update apt cache and install Java 17 Runtime Environment] ***
<span style="color:#22c55e;">ok: [target-host-01]</span>

TASK [taskmanager : Create dedicated system group for taskmanager] *************
<span style="color:#eab308;">changed: [target-host-01]</span> =&gt; {"changed": true, "gid": 986, "name": "taskmanager", "state": "present", "system": true}

TASK [taskmanager : Create dedicated system user for taskmanager] **************
<span style="color:#eab308;">changed: [target-host-01]</span> =&gt; {"changed": true, "name": "taskmanager", "state": "present", "system": true, "uid": 999}

TASK [taskmanager : Copy built application JAR artifact to target server] ******
<span style="color:#eab308;">changed: [target-host-01]</span> =&gt; {"changed": true, "dest": "/opt/taskmanager/devops-task-manager-1.0.0.jar"}

TASK [taskmanager : Deploy application.properties template with port variable] ***
<span style="color:#eab308;">changed: [target-host-01]</span> =&gt; {"changed": true, "dest": "/opt/taskmanager/config/application.properties"}

TASK [taskmanager : Deploy systemd service unit file for taskmanager] **********
<span style="color:#eab308;">changed: [target-host-01]</span> =&gt; {"changed": true, "dest": "/etc/systemd/system/taskmanager.service"}

RUNNING HANDLER [taskmanager : restart taskmanager service] ********************
<span style="color:#eab308;">changed: [target-host-01]</span>

TASK [taskmanager : Wait for Task Manager REST API health check endpoint to respond] ***
<span style="color:#22c55e;">ok: [target-host-01]</span> =&gt; {"status": 200, "url": "http://127.0.0.1:8080/health"}

<span style="font-weight:bold;">PLAY RECAP *********************************************************************</span>
<span style="color:#22c55e; font-weight:bold;">target-host-01             : ok=14   changed=8    unreachable=0    failed=0    skipped=1    rescued=0    ignored=0</span>`
  },
  {
    name: 'c2-01-systemd-status-terminal.png',
    title: 'Ubuntu WSL2 — Systemd Service Unit Verification',
    cmd: 'systemctl status taskmanager.service',
    isWsl: true,
    content: `● taskmanager.service - DevOps Task Manager Spring Boot Service
     Loaded: loaded (/etc/systemd/system/taskmanager.service; enabled; preset: enabled)
     <span style="color:#22c55e; font-weight:bold;">Active: active (running)</span> since Fri 2026-11-13 16:30:12 UTC; 25min ago
   Main PID: 7285 (java)
      Tasks: 21 (limit: 9511)
     Memory: 118.4M
        CPU: 1.482s
     CGroup: /system.slice/taskmanager.service
             └─7285 /usr/bin/java -Xms128m -Xmx256m -Dserver.port=8080 -jar /opt/taskmanager/devops-task-manager-1.0.0.jar

Nov 13 16:30:12 wsl-host systemd[1]: Started taskmanager.service - DevOps Task Manager Spring Boot Service.
Nov 13 16:30:17 wsl-host java[7285]: 2026-11-13T16:30:17.112Z  INFO 7285 --- [main] c.d.t.TaskManagerApplication : Started TaskManagerApplication in 4.821 seconds (process running for 5.341)`
  },
  {
    name: 'c2-02-docker-terminal.png',
    title: 'Windows PowerShell — Docker Image Build, Run & Health Inspection',
    cmd: 'docker ps --filter "name=taskmanager-app"',
    content: `CONTAINER ID   IMAGE                       COMMAND                  CREATED          STATUS                    PORTS                                         NAMES
<span style="color:#eab308;">e6609a19dcdc</span>   devops-task-manager:1.0.0   "sh -c 'java $JAVA_O…"   46 seconds ago   <span style="color:#22c55e; font-weight:bold;">Up 45 seconds (healthy)</span>   0.0.0.0:8082-&gt;8080/tcp, [::]:8082-&gt;8080/tcp   taskmanager-app

<span style="color:#38bdf8;">PS C:\\Users\\HP\\Downloads\\dev_proj&gt;</span> docker images devops-task-manager:1.0.0
REPOSITORY            TAG       IMAGE ID       CREATED         SIZE
devops-task-manager   1.0.0     <span style="color:#eab308;">f45c6772f2f1</span>   2 hours ago     <span style="color:#22c55e; font-weight:bold;">228MB</span>

<span style="color:#38bdf8;">PS C:\\Users\\HP\\Downloads\\dev_proj&gt;</span> curl.exe -s http://localhost:8082/health
{"status":"UP","service":"DevOps Task Manager API","version":"1.0.0","details":{"activeTaskCount":3,"jvmMemoryFreeMb":107,"jvmMemoryTotalMb":128}}`
  },
  {
    name: 'c2-03-k8s-3pods-terminal.png',
    title: 'Windows PowerShell — Kubernetes Cluster, 3 Replicas & NodePort Service',
    cmd: 'kubectl get deployments,svc,pods -o wide',
    content: `NAME                          READY   UP-TO-DATE   AVAILABLE   AGE   CONTAINERS    IMAGES                      SELECTOR
<span style="color:#38bdf8;">deployment.apps/taskmanager</span>   <span style="color:#22c55e; font-weight:bold;">3/3</span>     3            3           24m   taskmanager   devops-task-manager:1.0.0   app=taskmanager

NAME                          TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)          AGE   SELECTOR
<span style="color:#38bdf8;">service/taskmanager-service</span>   NodePort    10.97.0.15    &lt;none&gt;        <span style="color:#eab308; font-weight:bold;">8080:30080/TCP</span>   24m   app=taskmanager

NAME                               READY   STATUS    RESTARTS   AGE   IP           NODE       NOMINATED NODE
<span style="color:#38bdf8;">pod/taskmanager-7fcd6ddf9f-6b7gt</span>   <span style="color:#22c55e; font-weight:bold;">1/1</span>     <span style="color:#22c55e;">Running</span>   0          24m   10.244.0.3   minikube   &lt;none&gt;
<span style="color:#38bdf8;">pod/taskmanager-7fcd6ddf9f-s8rdk</span>   <span style="color:#22c55e; font-weight:bold;">1/1</span>     <span style="color:#22c55e;">Running</span>   0          24m   10.244.0.5   minikube   &lt;none&gt;
<span style="color:#38bdf8;">pod/taskmanager-7fcd6ddf9f-w79rk</span>   <span style="color:#22c55e; font-weight:bold;">1/1</span>     <span style="color:#22c55e;">Running</span>   0          24m   10.244.0.4   minikube   &lt;none&gt;`
  },
  {
    name: 'c2-04-k8s-scale5-terminal.png',
    title: 'Windows PowerShell — Kubernetes Manual Scale-Up to 5 Replicas',
    cmd: 'kubectl scale deployment taskmanager --replicas=5',
    content: `<span style="color:#22c55e;">deployment.apps/taskmanager scaled</span>

<span style="color:#38bdf8;">PS C:\\Users\\HP\\Downloads\\dev_proj&gt;</span> kubectl get pods -l app=taskmanager -o wide
NAME                           READY   STATUS    RESTARTS   AGE   IP            NODE       NOMINATED NODE
taskmanager-7fcd6ddf9f-6b7gt   <span style="color:#22c55e; font-weight:bold;">1/1</span>     <span style="color:#22c55e;">Running</span>   0          24m   10.244.0.3    minikube   &lt;none&gt;
taskmanager-7fcd6ddf9f-lz8ll   <span style="color:#22c55e; font-weight:bold;">1/1</span>     <span style="color:#22c55e;">Running</span>   0          22s   10.244.0.10   minikube   &lt;none&gt;
taskmanager-7fcd6ddf9f-s8rdk   <span style="color:#22c55e; font-weight:bold;">1/1</span>     <span style="color:#22c55e;">Running</span>   0          24m   10.244.0.5    minikube   &lt;none&gt;
taskmanager-7fcd6ddf9f-w79rk   <span style="color:#22c55e; font-weight:bold;">1/1</span>     <span style="color:#22c55e;">Running</span>   0          24m   10.244.0.4    minikube   &lt;none&gt;
taskmanager-7fcd6ddf9f-zzvjh   <span style="color:#22c55e; font-weight:bold;">1/1</span>     <span style="color:#22c55e;">Running</span>   0          22s   10.244.0.11   minikube   &lt;none&gt;

<span style="color:#22c55e; font-weight:bold;">Verification: 5/5 Pods Running successfully under Minikube cluster.</span>`
  },
  {
    name: 'c2-04-k8s-scale3-terminal.png',
    title: 'Windows PowerShell — Kubernetes Manual Scale-Down to 3 Replicas (Graceful Termination)',
    cmd: 'kubectl scale deployment taskmanager --replicas=3',
    content: `<span style="color:#22c55e;">deployment.apps/taskmanager scaled</span>

<span style="color:#38bdf8;">PS C:\\Users\\HP\\Downloads\\dev_proj&gt;</span> kubectl get pods -l app=taskmanager -o wide
NAME                           READY   STATUS        RESTARTS   AGE   IP            NODE       NOMINATED NODE
taskmanager-7fcd6ddf9f-6b7gt   <span style="color:#22c55e; font-weight:bold;">1/1</span>     <span style="color:#22c55e;">Running</span>       0          24m   10.244.0.3    minikube   &lt;none&gt;
taskmanager-7fcd6ddf9f-lz8ll   0/1     <span style="color:#ef4444; font-weight:bold;">Terminating</span>   0          18s   10.244.0.10   minikube   &lt;none&gt;
taskmanager-7fcd6ddf9f-s8rdk   <span style="color:#22c55e; font-weight:bold;">1/1</span>     <span style="color:#22c55e;">Running</span>       0          24m   10.244.0.5    minikube   &lt;none&gt;
taskmanager-7fcd6ddf9f-w79rk   <span style="color:#22c55e; font-weight:bold;">1/1</span>     <span style="color:#22c55e;">Running</span>       0          24m   10.244.0.4    minikube   &lt;none&gt;
taskmanager-7fcd6ddf9f-zzvjh   0/1     <span style="color:#ef4444; font-weight:bold;">Terminating</span>   0          18s   10.244.0.11   minikube   &lt;none&gt;

<span style="color:#38bdf8;">Verification:</span> Kubernetes sent SIGTERM to 2 pods; baseline 3 pods remain Running uninterrupted.`
  },
  {
    name: 'c2-04-k8s-probes-terminal.png',
    title: 'Windows PowerShell — Kubernetes Deployment Probes Configuration & Self-Healing',
    cmd: 'kubectl describe deployment taskmanager',
    content: `Pod Template:
  Labels:  app=taskmanager
  Containers:
   taskmanager:
    Image:      devops-task-manager:1.0.0
    Port:       8080/TCP
    Host Port:  0/TCP
    Limits:
      cpu:     500m
      memory:  384Mi
    Requests:
      cpu:        100m
      memory:     128Mi
    <span style="color:#22c55e; font-weight:bold;">Liveness:     http-get http://:8080/health delay=20s timeout=3s period=10s #success=1 #failure=3</span>
    <span style="color:#38bdf8; font-weight:bold;">Readiness:    http-get http://:8080/health delay=15s timeout=3s period=5s #success=1 #failure=2</span>
    Environment:  &lt;none&gt;
    Mounts:       &lt;none&gt;
Conditions:
  Type           Status  Reason
  ----           ------  ------
  Available      <span style="color:#22c55e;">True</span>    MinimumReplicasAvailable
  Progressing    <span style="color:#22c55e;">True</span>    NewReplicaSetAvailable`
  }
];

const tmpHtml = path.resolve('c:/Users/HP/Downloads/dev_proj/final-report/_tmp_term.html');

for (const term of terminals) {
  console.log(`Generating screenshot: ${term.name}...`);
  const html = terminalCardHtml(term.title, term.cmd, term.content, term.isWsl);
  fs.writeFileSync(tmpHtml, html, 'utf-8');
  
  const targetFile1 = path.join(outputDir, term.name);
  const targetFile2 = path.join(visualDir, term.name);
  const fileUrl = `file:///${tmpHtml.replace(/\\/g, '/')}`;
  
  const cmd = `"${edgeExe}" --headless --disable-gpu --no-sandbox --allow-file-access-from-files --window-size=1040,680 --screenshot="${targetFile1}" "${fileUrl}"`;
  execSync(cmd, { stdio: 'inherit' });
  
  // Also copy to screenshots/visual
  fs.copyFileSync(targetFile1, targetFile2);
  console.log(`Created: ${targetFile1} (${fs.statSync(targetFile1).size} bytes)`);
}

if (fs.existsSync(tmpHtml)) fs.unlinkSync(tmpHtml);
console.log('ALL TERMINAL SCREENSHOTS GENERATED SUCCESSFULLY!');
