pipeline {
    agent any

    // Trigger build automatically using SCM Polling every 5 minutes
    // Can also be triggered via GitHub Webhook (http://<jenkins-url>/github-webhook/)
    triggers {
        pollSCM('H/5 * * * *')
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        APP_NAME = 'devops-task-manager'
        JAR_NAME = 'devops-task-manager-1.0.0.jar'
    }

    stages {
        stage('Checkout') {
            steps {
                echo "=========================================="
                echo "Stage 1: Checking out code from SCM"
                echo "=========================================="
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo "=========================================="
                echo "Stage 2: Compiling Java Source Files"
                echo "=========================================="
                // Supports both Windows (bat) and Linux/Unix (sh) Jenkins nodes
                script {
                    if (isUnix()) {
                        sh 'mvn clean compile'
                    } else {
                        bat 'mvn clean compile'
                    }
                }
            }
        }

        stage('Test') {
            steps {
                echo "=========================================="
                echo "Stage 3: Executing Automated JUnit 5 Unit Tests"
                echo "=========================================="
                script {
                    if (isUnix()) {
                        sh 'mvn test'
                    } else {
                        bat 'mvn test'
                    }
                }
            }
        }

        stage('Package') {
            steps {
                echo "=========================================="
                echo "Stage 4: Packaging Application into Runnable Fat JAR"
                echo "=========================================="
                script {
                    if (isUnix()) {
                        sh 'mvn package -DskipTests'
                    } else {
                        bat 'mvn package -DskipTests'
                    }
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                echo "=========================================="
                echo "Stage 5: Archiving Generated JAR Artifact"
                echo "=========================================="
                archiveArtifacts artifacts: 'target/*.jar', fingerprint: true, allowEmptyArchive: false
            }
        }
    }

    post {
        always {
            echo "=========================================="
            echo "CI Enhancement: Collecting JUnit Test Results"
            echo "=========================================="
            // CI Enhancement: Parse and publish JUnit XML test reports
            // Fails or marks the build unstable if tests fail
            junit testResults: 'target/surefire-reports/*.xml', allowEmptyResults: false
        }
        success {
            echo "CI/CD Pipeline Build SUCCESSFUL! Artifacts archived."
        }
        failure {
            echo "CI/CD Pipeline Build FAILED! Check console log for details."
        }
    }
}
