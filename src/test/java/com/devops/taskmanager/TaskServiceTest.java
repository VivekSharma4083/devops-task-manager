package com.devops.taskmanager;

import com.devops.taskmanager.dto.CreateTaskRequest;
import com.devops.taskmanager.exception.TaskNotFoundException;
import com.devops.taskmanager.model.Task;
import com.devops.taskmanager.model.TaskStatus;
import com.devops.taskmanager.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TaskServiceTest {

    private TaskService taskService;

    @BeforeEach
    void setUp() {
        taskService = new TaskService();
        taskService.clearAll();
    }

    @Test
    @DisplayName("Create task should assign ID and persist task")
    void createTaskSuccess() {
        CreateTaskRequest request = new CreateTaskRequest("Write Ansible Playbook", "Configure service on target host", TaskStatus.PENDING);
        Task task = taskService.createTask(request);

        assertNotNull(task.getId());
        assertEquals("Write Ansible Playbook", task.getTitle());
        assertEquals("Configure service on target host", task.getDescription());
        assertEquals(TaskStatus.PENDING, task.getStatus());
        assertEquals(1, taskService.getTaskCount());
    }

    @Test
    @DisplayName("Get task by ID should return correct task")
    void getTaskByIdSuccess() {
        CreateTaskRequest request = new CreateTaskRequest("Docker Build", "Build container image", TaskStatus.IN_PROGRESS);
        Task created = taskService.createTask(request);

        Task fetched = taskService.getTaskById(created.getId());
        assertEquals(created.getId(), fetched.getId());
        assertEquals("Docker Build", fetched.getTitle());
    }

    @Test
    @DisplayName("Get task by non-existent ID should throw TaskNotFoundException")
    void getTaskByIdNotFound() {
        assertThrows(TaskNotFoundException.class, () -> taskService.getTaskById(999L));
    }

    @Test
    @DisplayName("Delete task should remove task from store")
    void deleteTaskSuccess() {
        CreateTaskRequest request = new CreateTaskRequest("Temporary Task", "To be deleted", TaskStatus.PENDING);
        Task created = taskService.createTask(request);

        boolean deleted = taskService.deleteTask(created.getId());
        assertTrue(deleted);
        assertEquals(0, taskService.getTaskCount());
    }

    @Test
    @DisplayName("Delete non-existent task should throw TaskNotFoundException")
    void deleteTaskNotFound() {
        assertThrows(TaskNotFoundException.class, () -> taskService.deleteTask(888L));
    }

    @Test
    @DisplayName("Get all tasks should return all created tasks")
    void getAllTasksSuccess() {
        taskService.createTask(new CreateTaskRequest("Task 1", "Desc 1", TaskStatus.PENDING));
        taskService.createTask(new CreateTaskRequest("Task 2", "Desc 2", TaskStatus.COMPLETED));

        List<Task> tasks = taskService.getAllTasks();
        assertEquals(2, tasks.size());
    }
}
