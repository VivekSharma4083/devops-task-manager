#!/usr/bin/env python3
"""
Ansible Project Syntax and Structural Validator.
Verifies inventory, playbook, role tasks, handlers, templates, and variable definitions.
"""
import os
import sys
import yaml
import configparser

def validate_yaml(file_path):
    print(f"[*] Validating YAML: {file_path}")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
            if data is None:
                raise ValueError("File is empty or invalid YAML")
        print(f"    [OK] Valid YAML syntax.")
        return True, data
    except Exception as e:
        print(f"    [FAIL] {e}")
        return False, None

def validate_inventory(file_path):
    print(f"[*] Validating Inventory: {file_path}")
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            lines = [l.strip() for l in f if l.strip() and not l.startswith("#")]
        has_hosts = any("[" in l for l in lines)
        if not has_hosts:
            raise ValueError("No host groups found in inventory")
        print(f"    [OK] Inventory verified ({len(lines)} configuration directives).")
        return True
    except Exception as e:
        print(f"    [FAIL] {e}")
        return False

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    ansible_dir = os.path.join(base_dir, "ansible")
    
    files_to_check = [
        os.path.join(ansible_dir, "playbook.yml"),
        os.path.join(ansible_dir, "roles", "taskmanager", "defaults", "main.yml"),
        os.path.join(ansible_dir, "roles", "taskmanager", "tasks", "main.yml"),
        os.path.join(ansible_dir, "roles", "taskmanager", "handlers", "main.yml"),
    ]
    
    all_ok = True
    for yf in files_to_check:
        ok, _ = validate_yaml(yf)
        if not ok:
            all_ok = False

    inv_ok = validate_inventory(os.path.join(ansible_dir, "inventory"))
    if not inv_ok:
        all_ok = False

    # Check templates
    service_template = os.path.join(ansible_dir, "roles", "taskmanager", "templates", "taskmanager.service.j2")
    prop_template = os.path.join(ansible_dir, "roles", "taskmanager", "templates", "application.properties.j2")
    for tpl in [service_template, prop_template]:
        if os.path.exists(tpl) and os.path.getsize(tpl) > 0:
            print(f"[OK] Template verified: {os.path.basename(tpl)} ({os.path.getsize(tpl)} bytes)")
        else:
            print(f"[FAIL] Missing or empty template: {tpl}")
            all_ok = False

    if all_ok:
        print("\n>>> ALL ANSIBLE ARTIFACTS VALIDATED SUCCESSFULLY! <<<")
        sys.exit(0)
    else:
        print("\n>>> ANSIBLE VALIDATION FAILED! <<<")
        sys.exit(1)

if __name__ == "__main__":
    main()
