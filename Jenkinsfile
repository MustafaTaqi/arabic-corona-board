pipeline {
   agent any
   stages {
        stage('Check if the current tag is Release*') {
            steps {
                git credentialsId: 'git-ssh-demo', url: 'git@github.com:MustafaTaqi/arabic-corona-board.git'
                script {
                GIT_TAG = sh returnStdout: true, script: '''git tag --points-at HEAD| head -n1 '''
                GIT_TAG = GIT_TAG.trim();
                echo "GIT_TAG is ${GIT_TAG}"
                GIT_COMMIT = sh returnStdout: true, script: '''git rev-parse HEAD'''
                GIT_COMMIT = GIT_COMMIT.trim();
                echo "GIT_COMMIT is ${GIT_COMMIT}"

                }
            }
        }
      
        stage('Lint Dockerfile'){
            when {
                expression {
                    GIT_TAG?.startsWith("Stable");
                }
            }
            steps {
                script {
                    sh 'docker run --rm -i hadolint/hadolint < Dockerfile'
                }
            }
        }

        stage('Build Docker Image'){
            when {
                expression {
                    GIT_TAG?.startsWith("Stable");
                }
            }
            steps {
                script {
                    sh "sed -i s/CORONA_APP_VERSION/${GIT_TAG}/g ./src/components/base/DrawerMenu.js" 
                    echo "Building docker image with GIT TAG ${GIT_TAG}"
                    app = docker.build("mtaqi84/arabic-corona-board")
                    app = docker.build("mtaqi84/arabic-corona-board:${GIT_TAG}")
                }
            }
        }
        stage('Push Docker Image'){
            when {
                expression {
                    GIT_TAG?.startsWith("Stable");
                }
            }
            steps {
                script {
                    app = docker.build("mtaqi84/arabic-corona-board")
                }
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker_hub_login'){
                        app.push("latest")
                        app.push(GIT_TAG)
                        app.push(GIT_COMMIT)
                    }
                }
            }
        }
        stage('Clean docker image'){
            when {
                expression {
                    GIT_TAG?.startsWith("Stable");
                }
            }
            steps{
                sh returnStdout: true, script: '''docker rmi mtaqi84/arabic-corona-board'''
            }
        }
        stage('Connect to EKS Cluster and deploy the App'){
            when {
                expression {
                    GIT_TAG?.startsWith("Stable");
                }
            }
            steps{
                withAWS(region:'us-west-2',credentials:'udacityprgaccs'){
                    script {
                        NODEGROUP_STACK_NAME="eks-corona-nodegroup"
                        CONTROL_PLANE_STACK_NAME="eks-corona-control-plane"
                        CLUSTER_NAME = sh returnStdout: true, script: '''echo $(aws cloudformation describe-stacks --stack-name ''' + CONTROL_PLANE_STACK_NAME + ''' --query "Stacks[0].Outputs[?OutputKey=='EKSClusterName'].OutputValue" --output text)'''
sh '''
                        aws eks update-kubeconfig --name  ''' + CLUSTER_NAME + '''
                        awsauthcm="apiVersion: v1
kind: ConfigMap
metadata:
  name: aws-auth
  namespace: kube-system
data:
  mapRoles: |
    - rolearn: $(aws cloudformation describe-stacks --stack-name ''' + NODEGROUP_STACK_NAME + ''' --query "Stacks[0].Outputs[?OutputKey=='NodeInstanceRole'].OutputValue" --output text)
      username: system:node:{{EC2PrivateDNSName}}
      groups:
        - system:bootstrappers
        - system:nodes
"
echo "Connecting the nodegroup to the EKS cluster "
echo "$awsauthcm" | kubectl apply -f -
'''
                        sh "sed -i s/CORONA_APP_VERSION/${GIT_TAG}/g ./cloudformation/k8s_corona.yaml"
                        sh "kubectl apply -f ./cloudformation/k8s_corona.yaml"
                    }
                }

            }
        }

   }
}