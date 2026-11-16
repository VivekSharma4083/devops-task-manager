# ==============================================================================
# Production Dockerfile for DevOps Task Manager REST API
# Multi-stage / lightweight Alpine-based Java 17 JRE
# ==============================================================================

FROM eclipse-temurin:17-jre-alpine

# Metadata labels
LABEL maintainer="DevOps Team" \
      app.name="devops-task-manager" \
      app.version="1.0.0" \
      description="Production container image for DevOps Task Manager REST API"

# Create dedicated non-root user and group for secure execution
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set application working directory
WORKDIR /app

# Expose container port (matches Spring Boot server.port)
EXPOSE 8080

# Configure JVM runtime flags and default port
ENV SERVER_PORT=8080 \
    JAVA_OPTS="-Xms128m -Xmx256m -XX:+UseG1GC -Djava.security.egd=file:/dev/./urandom"

# Copy generated executable fat JAR from target directory
COPY target/devops-task-manager-1.0.0.jar /app/app.jar

# Enforce non-root ownership on application files
RUN chown -R appuser:appgroup /app

# Switch to unprivileged non-root user
USER appuser

# Container-level health check instruction
HEALTHCHECK --interval=15s --timeout=5s --start-period=15s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/health || exit 1

# Run the Spring Boot application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=$SERVER_PORT -jar /app/app.jar"]
