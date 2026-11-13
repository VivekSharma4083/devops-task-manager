package com.devops.taskmanager;

import com.devops.taskmanager.dto.CreateTaskRequest;
import com.devops.taskmanager.model.Task;
import com.devops.taskmanager.model.TaskStatus;
import com.devops.taskmanager.service.TaskService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TaskService taskService;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        taskService.clearAll();
    }

    @Test
    @DisplayName("GET /tasks should return 200 OK and list of tasks")
    void getAllTasksShouldReturnOk() throws Exception {
        taskService.createTask(new CreateTaskRequest("Test CI Pipeline", "Unit test Jenkins setup", TaskStatus.IN_PROGRESS));

        mockMvc.perform(get("/tasks")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Test CI Pipeline")));
    }

    @Test
    @DisplayName("POST /tasks with valid body should return 201 Created")
    void createTaskWithValidBodyShouldReturnCreated() throws Exception {
        CreateTaskRequest request = new CreateTaskRequest("Kubernetes Deployment", "Configure 3 replicas with probes", TaskStatus.PENDING);

        mockMvc.perform(post("/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.title", is("Kubernetes Deployment")))
                .andExpect(jsonPath("$.status", is("PENDING")));
    }

    @Test
    @DisplayName("POST /tasks with blank title should return 400 Bad Request (Validation failure)")
    void createTaskWithBlankTitleShouldReturnBadRequest() throws Exception {
        CreateTaskRequest invalidRequest = new CreateTaskRequest("", "Invalid missing title", TaskStatus.PENDING);

        mockMvc.perform(post("/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error", is("Validation Failed")))
                .andExpect(jsonPath("$.details.title", notNullValue()));
    }

    @Test
    @DisplayName("GET /tasks/{id} with existing ID should return 200 OK")
    void getTaskByIdExistingShouldReturnOk() throws Exception {
        Task created = taskService.createTask(new CreateTaskRequest("Ansible Role Setup", "Organize tasks and handlers", TaskStatus.COMPLETED));

        mockMvc.perform(get("/tasks/" + created.getId())
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(created.getId().intValue())))
                .andExpect(jsonPath("$.title", is("Ansible Role Setup")));
    }

    @Test
    @DisplayName("GET /tasks/{id} with non-existent ID should return 404 Not Found")
    void getTaskByIdNotFoundShouldReturn404() throws Exception {
        mockMvc.perform(get("/tasks/9999")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error", is("Not Found")))
                .andExpect(jsonPath("$.message", containsString("Task not found with ID: 9999")));
    }

    @Test
    @DisplayName("DELETE /tasks/{id} with existing ID should return 200 OK")
    void deleteTaskExistingShouldReturnOk() throws Exception {
        Task created = taskService.createTask(new CreateTaskRequest("Ephemeral Task", "Will be removed", TaskStatus.PENDING));

        mockMvc.perform(delete("/tasks/" + created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.id", is(created.getId().intValue())));
    }

    @Test
    @DisplayName("DELETE /tasks/{id} with non-existent ID should return 404 Not Found")
    void deleteTaskNotFoundShouldReturn404() throws Exception {
        mockMvc.perform(delete("/tasks/9999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error", is("Not Found")));
    }
}
