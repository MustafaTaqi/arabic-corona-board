#!/bin/bash
set -o xtrace

INFRA_STACK_NAME='eks-coroana-infra'
CONTROL_PLANE_STACK_NAME="eks-corona-control-plane"
NODEGROUP_STACK_NAME="eks-corona-nodegroup"

echo "Creating ${INFRA_STACK_NAME} stack"
./create_stack.sh $INFRA_STACK_NAME eks-infra.yaml eks-infra-params.json
echo "Wait for ${INFRA_STACK_NAME} stack to complete"
aws cloudformation wait stack-create-complete --stack-name $INFRA_STACK_NAME
echo "${INFRA_STACK_NAME} stack completed"
echo

echo "Creating ${CONTROL_PLANE_STACK_NAME} stack"
./create_stack.sh $CONTROL_PLANE_STACK_NAME eks-control-plane.yaml eks-control-plane-params.json
echo "Wait for ${CONTROL_PLANE_STACK_NAME} stack to complete"
aws cloudformation wait stack-create-complete --stack-name $CONTROL_PLANE_STACK_NAME
echo "${CONTROL_PLANE_STACK_NAME} stack completed"
echo

echo "Creating ${NODEGROUP_STACK_NAME} stack"
./create_stack.sh $NODEGROUP_STACK_NAME eks-nodegroup.yaml eks-nodegroup-params.json 
echo "Wait for ${NODEGROUP_STACK_NAME} stack to complete"
aws cloudformation wait stack-create-complete --stack-name $NODEGROUP_STACK_NAME
echo "${NODEGROUP_STACK_NAME} stack completed"
echo

echo "Configure kubectl so that it connects to ${CONTROL_PLANE_STACK_NAME} EKS cluster"
CLUSTER_NAME=$(aws cloudformation describe-stacks --stack-name ${CONTROL_PLANE_STACK_NAME} --query "Stacks[0].Outputs[?OutputKey=='EKSClusterName'].OutputValue" --output text)
aws eks update-kubeconfig --name $CLUSTER_NAME

awsauthcm="apiVersion: v1
kind: ConfigMap
metadata:
  name: aws-auth
  namespace: kube-system
data:
  mapRoles: |
    - rolearn: $(aws cloudformation describe-stacks --stack-name ${NODEGROUP_STACK_NAME} --query "Stacks[0].Outputs[?OutputKey=='NodeInstanceRole'].OutputValue" --output text)
      username: system:node:{{EC2PrivateDNSName}}
      groups:
        - system:bootstrappers
        - system:nodes
"
echo " Apply ConfigMap so that nodegroup workers can join to the EKS cluster "
echo "$awsauthcm" | kubectl apply -f -
kubectl apply -f ./k8s_corona_latest.yaml
kubectl get services corona