import { Construct } from 'constructs';
import { App, Chart, ChartProps} from 'cdk8s';
import {
  Kafka,
  KafkaBridge,
  KafkaSpecKafkaListenersType,
  KafkaSpecKafkaStorageType,
  KafkaSpecKafkaStorageVolumesType,
  KafkaSpecZookeeperStorageType
} from "./imports/kafka.strimzi.io";

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);

    new Kafka(this, 'Kafka', {
      metadata: {
        name: 'kafka'
      },
      spec: {
        kafka: {
          replicas: 1,
          listeners: [{
            name: 'plain',
            port: 9092,
            type: KafkaSpecKafkaListenersType.INTERNAL,
            tls: false,
            configuration: {
              useServiceDnsDomain: true
            }
          }, {
            name: 'tls',
            port: 9093,
            type: KafkaSpecKafkaListenersType.INTERNAL,
            tls: true,
            configuration: {
              useServiceDnsDomain: true
            }
          }],
          resources: {
            requests: {
              cpu: '10m',
              memory: '735Mi'
            }
          },
          template: {
            persistentVolumeClaim: {
              metadata: {
                labels: {
                  'app': 'kafka'
                }
              }
            }
          },
          storage: {
            type: KafkaSpecKafkaStorageType.JBOD,
            class: 'standard',
            volumes: [{
              id: 0,
              type: KafkaSpecKafkaStorageVolumesType.PERSISTENT_HYPHEN_CLAIM,
              size: '4Gi',
              deleteClaim: false
            }]
          },
          config: {
            'max.message.bytes': '209715200',
            'message.max.bytes': '209715200',
            'replica.fetch.max.bytes': '209715200',
            'offsets.topic.replication.factor': 1,
            'transaction.state.log.replication.factor': 1,
            'transaction.state.log.min.isr': 1,
            'default.replication.factor': 1,
            'min.insync.replicas': 1
          }
        },
        zookeeper: {
          replicas: 1,
          resources: {
            requests: {
              cpu: '10m',
              memory: '330Mi'
            }
          },
          template: {
            persistentVolumeClaim: {
              metadata: {
                labels: {
                  'app': 'zookeeper'
                }
              }
            }
          },
          storage: {
            type: KafkaSpecZookeeperStorageType.PERSISTENT_HYPHEN_CLAIM,
            class: 'standard',
            size: '4Gi',
            deleteClaim: false
          }
        },
        entityOperator: {
          topicOperator: {
            resources: {
              requests: {
                cpu: "10m",
                memory: "512Mi"
              },
              limits: {
                memory: "524Mi"
              }
            }
          },
          userOperator: {}
        }
      }
    });

    new KafkaBridge(this, 'KafkaBridge', {
      metadata: {
        name: 'kafka-bridge'
      },
      spec: {
        replicas: 1,
        bootstrapServers: 'kafka-kafka-bootstrap:9092',
        resources: {
          requests: {
            cpu: '10m',
            memory: '330Mi'
          }
        },
        http: {
          port: 8080
        }
      }
    })

  }
}

const app = new App();
new MyChart(app, 'kafka');
app.synth();
