package com.devops.taskmanager.service;

import com.devops.taskmanager.dto.CreateTaskRequest;
import com.devops.taskmanager.exception.TaskNotFoundException;
import com.devops.taskmanager.model.Task;
import com.devops.taskmanager.model.TaskStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Service managing thread-safe in-memory storage of tasks.
 */
@Service
public class TaskService {

    private final Map<Long, Task> taskStore = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    public TaskService() {
        // Initialize with default sample tasks for demonstration
        createInitialSampleData();
    }

    private void createInitialSampleData() {
        createTask(new CreateTaskRequest("Setup CI/CD Pipeline", "Configure automated Jenkins builds with testing", TaskStatus.COMPLETED));
        createTask(new CreateTaskRequest("Containerize with Docker", "Build lightweight Java 17 container image", TaskStatus.IN_PROGRESS));
        createTask(new CreateTaskRequest("Deploy to Kubernetes", "Deploy with 3 replicas and liveness/readiness probes", TaskStatus.PENDING));
    }

    public List<Task> getAllTasks() {
        return new ArrayList<>(taskStore.values());
    }

    public Task getTaskById(Long id) {
        Task task = taskStore.get(id);
        if (task == null) {
            throw new TaskNotFoundException(id);
        }
        return task;
    }

    public Task createTask(CreateTaskRequest request) {
        Long id = idGenerator.getAndIncrement();
        TaskStatus status = request.getStatus() != null ? request.getStatus() : TaskStatus.PENDING;
        Task task = new Task(id, request.getTitle(), request.getDescription(), status);
        taskStore.put(id, task);
        return task;
    }

    public boolean deleteTask(Long id) {
        if (!taskStore.containsKey(id)) {
            throw new TaskNotFoundException(id);
        }
        taskStore.remove(id);
        return true;
    }

    public long getTaskCount() {
        return taskStore.size();
    }

    public void clearAll() {
        taskStore.clear();
        idGenerator.set(1);
    }
}
