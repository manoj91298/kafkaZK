# Deployment of kafka-zookeeper on kubernetes cluster

## Prerequisite:

Kubernetes v1.21.4

HELM v2.17

Docker 20.10.2

#### Create NFS Server setup on kubernetes cluster  - watch my Deploy dynamic NFS provisioning video for more details.
#### Create mount points in NFS server as below mentioned.
```
[centos@k8smaster ~]$ tree /mnt/k8sMount/
/mnt/k8sMount/
├── kafka
│   ├── kafkaOut-0
│   ├── kafkaOut-1
│   └── kafkaOut-2
└── ZK
    ├── zkOut-0
    ├── zkOut-1
    └── zkOut-2
```
#### Make sure HELM 2.x or 3 is installed in kubernetes 
```
[centos@k8smaster ~]$ helm version
Client: &version.Version{SemVer:"v2.17.0", GitCommit:"a690bad98af45b015bd3da1a41f6218b1a451dbe", GitTreeState:"clean"}
Server: &version.Version{SemVer:"v2.17.0", GitCommit:"a690bad98af45b015bd3da1a41f6218b1a451dbe", GitTreeState:"clean"}
```
#### Change the NFS Server IP in values.yaml file.
#### Deploy Apache kafka and zookeeper with below single cmd.
```
helm install --name kafkazk .
```
#### Verify Pod and Service status.
```
kubectl get all -n msgbus
```
#### Create a test-demo topic and receive message from the other end with verification.
```
kubectl -n msgbus exec -ti testclient -- ./bin/kafka-console-producer.sh --broker-list kafka-svc.msgbus:9093 --topic test-demo

kubectl -n msgbus exec -ti testclient -- ./bin/kafka-console-consumer.sh --bootstrap-server kafka-svc.msgbus:9093 --topic test-demo --from-beginning
```

#### To Delete kafka-zookeeper
```
helm delete --purge kafkazk
```

