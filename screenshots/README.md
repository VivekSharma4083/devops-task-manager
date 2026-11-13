# Screenshots and Demonstration Evidence

This folder stores screenshots, console transcripts, and visual verification artifacts for Component 1 and Component 2 of the DevOps Assignment.

## Recommended Screenshots to Place in this Directory:

### Component 1 (CI/CD Pipeline):
1. `c1-01-git-branch-merge.png`: Terminal output showing `git branch -a`, `git log --graph --oneline --all` demonstrating branches and non-fast-forward merge.
2. `c1-02-maven-build-success.png`: Console output of `mvn clean test package` displaying `BUILD SUCCESS` and 15 passed tests.
3. `c1-03-rest-api-tests.png`: Terminal or Postman showing successful responses for `GET /tasks`, `POST /tasks`, `GET /health`.
4. `c1-04-jenkins-pipeline-stageview.png`: Jenkins UI showing all 5 pipeline stages (Checkout, Build, Test, Package, Archive Artifacts) in Green.
5. `c1-05-jenkins-junit-trend.png`: Jenkins Test Result Trend graph showing JUnit 5 test reports and pass history.
6. `c1-06-jenkins-archived-artifact.png`: Jenkins build page displaying archived `devops-task-manager-1.0.0.jar`.

### Component 2 (Ansible, Docker, Kubernetes):
1. `c2-01-ansible-playbook-run.png`: Output of `ansible-playbook -i inventory playbook.yml` showing `changed`, `ok`, and handler trigger.
2. `c2-02-docker-build.png`: Output of `docker build -t devops-task-manager:1.0.0 .`.
3. `c2-03-docker-run-health.png`: Container running and `curl http://localhost:8080/health` output.
4. `c2-04-k8s-3-replicas.png`: Output of `kubectl get pods -l app=taskmanager` showing 3 Running pods.
5. `c2-05-k8s-scale-up-5.png`: Output of `kubectl scale deployment taskmanager --replicas=5` and `kubectl get pods` showing 5 running pods.
6. `c2-06-k8s-scale-down-3.png`: Output of `kubectl scale deployment taskmanager --replicas=3` showing scaling back down.
7. `c2-07-k8s-probes-describe.png`: Output of `kubectl describe pod <pod-name>` showing Liveness and Readiness probe configuration.
