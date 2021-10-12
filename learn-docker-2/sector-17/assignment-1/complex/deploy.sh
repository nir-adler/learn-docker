docker build -t dogliy/multi-client:latest -t dogliy/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t dogliy/multi-server:latest -t dogliy/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t dogliy/multi-worker:latest -t dogliy/multi-worker:$SHA -f ./worker/Dockerfile ./worker
docker push dogliy/multi-client:latest
docker push dogliy/multi-server:latest
docker push dogliy/multi-worker:latest

docker push dogliy/multi-client:$SHA
docker push dogliy/multi-server:$SHA
docker push dogliy/multi-worker:$SHA

kubectl apply -f./k8s
kubectl set image deployments/server-deployment server=dogliy/multi-server:$SHA
kubectl set image deployments/client-deployment client=dogliy/multi-client:$SHA
kubectl set image deployments/worker-deployment worker=dogliy/multi-worker:$SHA


