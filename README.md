# Deployment of kafka-zookeeper on kubernetes cluster

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
#### Deploy Apache kafka and zookeeper with below single cmd.
```
helm install --name kafkazk .
```
#### To Delete kafka-zookeeper
```
helm delete --purge kafkazk
```
