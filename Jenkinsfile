pipeline {
    agent any

    tools {
        nodejs "node"
    }

    environment {
        SCANNER_HOME = tool 'SonarScanner'
        IMAGE_NAME = "manthesh/node-app-1.0"
    }

    stages {

        stage('Clone Code from GitHub') {
            steps {
                checkout scmGit(
                    branches: [[name: '*/develop']],
                    extensions: [],
                    userRemoteConfigs: [[
                        credentialsId: 'd5a98037-9aae-4de5-a2a9-6e102c36aab7',
                        url: 'git@github.com:Manthesh02/frontend.git'
                    ]]
                )
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh """
                    ${SCANNER_HOME}/bin/sonar-scanner \
                      -Dsonar.projectKey=frontend \
                      -Dsonar.projectName=frontend \
                      -Dsonar.sources=. \
                      -Dsonar.exclusions=node_modules/**,dist/**,build/**
                    """
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }

        stage('Trivy Image Scan') {
            steps {
                sh """
                trivy image \
                  --severity HIGH,CRITICAL \
                  --exit-code 1 \
                  ${IMAGE_NAME}
                """
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub', variable: 'DOCKER_TOKEN')]) {
                    sh '''
                    echo "$DOCKER_TOKEN" | docker login -u manthesh --password-stdin
                    docker push ${IMAGE_NAME}
                    docker logout
                    '''
                }
            }
        }

        stage('Deploy to K3s') {
            steps {
                sh '''
                sudo /usr/local/bin/k3s kubectl \
                --kubeconfig=/home/mant/install/k3s.yaml \
                apply -f app.yaml -n dvlp
                '''
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully."
        }

        failure {
            echo "Pipeline failed. Check SonarQube or Trivy scan results."
        }
    }
}
