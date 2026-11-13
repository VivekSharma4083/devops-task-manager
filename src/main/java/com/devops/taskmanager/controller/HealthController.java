package com.devops.taskmanager.controller;

import com.devops.taskmanager.dto.HealthResponse;
import com.devops.taskmanager.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Health check endpoint used by monitoring systems, CI/CD pipelines,
 * and Kubernetes Liveness and Readiness probes.
 */
@RestController
@RequestMapping("/health")
public class HealthController {

    private final TaskService taskService;

    public HealthController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * GET /health - Return application health status.
     */
    @GetMapping
    public ResponseEntity<HealthResponse> getHealth() {
        Map<String, Object> details = Map.of(
                "jvmMemoryFreeMb", Runtime.getRuntime().freeMemory() / (1024 * 1024),
                "jvmMemoryTotalMb", Runtime.getRuntime().totalMemory() / (1024 * 1024),
                "activeTaskCount", taskService.getTaskCount(),
                "storage", "in-memory concurrent hash map"
        );

        HealthResponse health = new HealthResponse(
                "UP",
                "DevOps Task Manager API",
                "1.0.0",
                details
        );

        return ResponseEntity.ok(health);
    }
}
