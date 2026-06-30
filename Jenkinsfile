pipeline {
    agent any

    tools {
        nodejs "node"
    }

    stages {
        stage('Clone code from GitHub') {
            steps {
                script {
                    checkout scmGit(branches: [[name: '*/develop']], extensions: [], userRemoteConfigs: [[credentialsId: 'd5a98037-9aae-4de5-a2a9-6e102c36aab7', url: 'git@github.com:Manthesh02/frontend.git']])
                }
            }
        }

        stage('Node JS Build') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Node JS Docker Image') {
            steps {
                script {
                    sh 'docker build -t manthesh/node-app-1.0 .'
                }
            }
        }

        stage('Deploy Docker Image to DockerHub') {
            steps {
                script {
                    withCredentials([string(credentialsId: 'dockerhub', variable: 'DOCKER_TOKEN')]) {
                        sh '''
                            echo "$DOCKER_TOKEN" | docker login -u manthesh --password-stdin
                            docker push manthesh/node-app-1.0
                            docker logout
                        '''
                    }
                }
            }
        }

        stage('Deploy to K3s') {
            steps {
                script {
                    sh 'sudo /usr/local/bin/k3s kubectl --kubeconfig=/home/mant/install/k3s.yaml apply -f app.yaml -n dvlp'
                }
            }
        }
    }
}
