# deploy
## first error 
Your user does not have permission to access:
## step 1
sudo systemctl status docker
* if running go on if not 
     sudo systemctl start docker
     sudo systemctl enable docker
## step 2 
sudo usermod -aG docker shuhari
## step 3 
newgrp docker
## step 4 
docker ps
## step 5 start minikube 
minikube start --driver=docker
## error 2 ErrImageNeverPull
imagePullPolicy: Never (or default) but image doesn’t exist in Minikube
## step 1
eval $(minikube docker-env)
## step 2 build product-api image 
docker build -t product-api:latest ./product-api
## setp 3 restart pod 
kubectl delete pod -l app=product-api
kubectl rollout restart deployment product-api
## step 4
kubectl get pods -l app=product-api

# do this same for order-api 
## step 1
eval $(minikube docker-env)
## step 2 Build the order-api image
cd ~/secure-devops-project
docker build -t order-api:test ./order-api
## Step 3: Restart the pod
kubectl delete pod -l app=order-api
kubectl rollout restart deployment order-api
## Step 4: Verify
kubectl get pods -l app=order-api

## After BOTH pods are running
kubectl port-forward --address 0.0.0.0 service/order-api 5002:5002 &
kubectl port-forward --address 0.0.0.0 service/product-api 5001:5001 &






