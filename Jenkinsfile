pipeline {
    agent any

    tools {
        nodejs "node"
    }

    environment {
        SCANNER_HOME = tool 'SonarScanner'
    }

    stages {

        stage('Clone code from GitHub') {
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

        stage('Node JS Build') {
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

        stage('Build Node JS Docker Image') {
            steps {
                sh 'docker build -t manthesh/node-app-1.0 .'
            }
        }

        stage('Deploy Docker Image to DockerHub') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub', variable: 'DOCKER_TOKEN')]) {
                    sh '''
                        echo "$DOCKER_TOKEN" | docker login -u manthesh --password-stdin
                        docker push manthesh/node-app-1.0
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy to K3s') {
            steps {
                sh 'sudo /usr/local/bin/k3s kubectl --kubeconfig=/home/mant/install/k3s.yaml apply -f app.yaml -n dvlp'
            }
        }
    }
}
