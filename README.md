
Please take your time to carefully read and understand the provided system requirements.

Design a high-level architecture for the parking lot system, highlighting components, interactions, and data flow.

### Propose data structures and classes, explaining their relationships and responsibilities.
- Payment: handles payments
- Parking: checks availability and manages parking space.
- Notification: notifies users with real-time updates of parking spot availability for each level. (continuous polling) Integrates with the physical interface of the parking management system. Can push updates to web console as well.

###  Describe how you would handle concurrent transactions, payment processing, and real-time updates of parking spot availability.
- Use RabbitMQ to queue the transactions
- Docker to scale the number of instances processing the transactions
- Subscribe to a separate notification service that polls `parking` for availability

### Outline the steps you would take to ensure the reliability, security, and scalability of the parking system.
- Adopt Microservice architecture to ensure that each service adopts a single repsonsibility
- Secure service behind an API Gateway, and include an auth layer there
- Introduce queuing system with Rabbiq MQ: Horizontal Scaling, Able to Queue hundreds of transactions so that parking service not dependent on payment service to succeed, asynchronous processing of payments using RabbitMQ.

### Discuss how you would structure the parking system as microservices. Explain the benefits of using microservices for this scenario and how communication between microservices would be managed.
- service failures not dependent on one another
- you can scale a particular service without scaling the rest of the services as in a monolithic architecture, therefore saving costs.
- you can adopt different scaling methods. Heavier compute applications can have a more aggressive scaling strategy.
- Communication to be handled by a central queuing system: RabbitMQ


### Develop a set of test cases that cover various scenarios and aspects of the system. Include unit tests, integration tests, and any other relevant tests that ensure the correctness and robustness of the system.

### Describe how you would containerize the microservices using a technology like Docker. Explain the advantages of containerization and how it would simplify deployment and scaling.
- Developer experience - consistent environment for testing and troubleshooting
- Able to scale the # of containers to improve service reliability
- Infrastructure as code to document that exact working environemnt
- Allow roll-backs to previous working environment
- Can be used to test new changes (for example, some containers still using older versions of the code.)
