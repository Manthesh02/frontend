pipeline {
    agent any
  
    tools {
        nodejs "node"
    }
    
    stages {
        stage("Clone code from GitHub") {
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
                        sh 'docker login -u manthesh -p ${docker}'
                        sh 'docker push manthesh/node-app-1.0'
                    }
                }
            }
        }
         
        stage('Deploying Node App to Kubernetes') {
            steps {
                script {
                    kubernetesDeploy configs: 'app.yaml', kubeconfigId: 'Kubeconfig'
                }
            }
        }
    }
}
