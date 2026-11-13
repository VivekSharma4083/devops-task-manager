package com.devops.taskmanager.exception;

/**
 * Custom runtime exception thrown when a task cannot be found by ID.
 */
public class TaskNotFoundException extends RuntimeException {

    public TaskNotFoundException(Long id) {
        super("Task not found with ID: " + id);
    }

    public TaskNotFoundException(String message) {
        super(message);
    }
}
