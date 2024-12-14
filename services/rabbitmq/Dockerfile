# Use the official RabbitMQ image with management plugin
FROM rabbitmq:3.12-management

# Expose RabbitMQ default ports
EXPOSE 5672 15672

# Enable the management plugin
RUN rabbitmq-plugins enable --offline rabbitmq_management
