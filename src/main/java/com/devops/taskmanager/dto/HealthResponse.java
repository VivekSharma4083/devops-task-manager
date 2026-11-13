package com.devops.taskmanager.dto;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * DTO representing health status for Kubernetes probes and monitoring.
 */
public class HealthResponse {

    private String status;
    private String service;
    private String version;
    private LocalDateTime timestamp;
    private Map<String, Object> details;

    public HealthResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public HealthResponse(String status, String service, String version, Map<String, Object> details) {
        this.status = status;
        this.service = service;
        this.version = version;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Map<String, Object> getDetails() {
        return details;
    }

    public void setDetails(Map<String, Object> details) {
        this.details = details;
    }
}
