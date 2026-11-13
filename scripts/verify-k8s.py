#!/usr/bin/env python3
"""
Kubernetes Manifest Validator.
Validates deployment.yaml and service.yaml against Kubernetes schema specs.
"""
import os
import sys
import yaml

def validate_manifest(path):
    print(f"[*] Validating Kubernetes Manifest: {path}")
    try:
        with open(path, "r", encoding="utf-8") as f:
            docs = list(yaml.safe_load_all(f))
        for doc in docs:
            if not doc:
                continue
            kind = doc.get("kind")
            api_version = doc.get("apiVersion")
            name = doc.get("metadata", {}).get("name")
            print(f"    [OK] Resource: {kind} ({api_version}), Name: '{name}'")
            
            if kind == "Deployment":
                replicas = doc.get("spec", {}).get("replicas")
                containers = doc.get("spec", {}).get("template", {}).get("spec", {}).get("containers", [])
                print(f"         Initial Replicas: {replicas}")
                for c in containers:
                    print(f"         Container: {c.get('name')}, Image: {c.get('image')}, Port: {c.get('ports')[0].get('containerPort')}")
                    liveness = c.get("livenessProbe", {}).get("httpGet", {}).get("path")
                    readiness = c.get("readinessProbe", {}).get("httpGet", {}).get("path")
                    print(f"         Liveness Probe Path: {liveness}")
                    print(f"         Readiness Probe Path: {readiness}")
                    assert liveness == "/health", "Liveness probe must point to /health"
                    assert readiness == "/health", "Readiness probe must point to /health"
            elif kind == "Service":
                svc_type = doc.get("spec", {}).get("type")
                ports = doc.get("spec", {}).get("ports", [])
                print(f"         Service Type: {svc_type}, Ports: {ports}")
        return True
    except Exception as e:
        print(f"    [FAIL] {e}")
        return False

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    k8s_dir = os.path.join(base_dir, "kubernetes")
    dep_path = os.path.join(k8s_dir, "deployment.yaml")
    svc_path = os.path.join(k8s_dir, "service.yaml")
    
    ok1 = validate_manifest(dep_path)
    ok2 = validate_manifest(svc_path)
    
    if ok1 and ok2:
        print("\n>>> ALL KUBERNETES MANIFESTS VALIDATED SUCCESSFULLY! <<<")
        sys.exit(0)
    else:
        print("\n>>> KUBERNETES VALIDATION FAILED! <<<")
        sys.exit(1)

if __name__ == "__main__":
    main()
