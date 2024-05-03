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
                    withCredentials([string(credentialsId: 'dockerhub', variable: 'dockerhub')]) {
                        sh 'docker login -u manthesh -p ${dockerhub}'
                        sh 'docker push manthesh/node-app-1.0'
                    }
                }
            }
        }
        
        // Added 'Deploy to Minikube' stage
        stage('Deploy to Minikube') {
            steps {
                script {
                    // Load kubeconfig as a file credential
                    withCredentials([file(credentialsId: 'kubeconfig', variable: 'kubeconfig')]) {
                        // Ensure that the 'app.yaml' file is present in your repository or Jenkins workspace
                        sh 'kubectl --kubeconfig=$kubeconfig apply -f app.yaml'
                    }
                }
            }
        }
    }
}
