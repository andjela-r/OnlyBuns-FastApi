import json
import pika

# RabbitMQ credentials and connection
credentials = pika.PlainCredentials("admin", "admin")

connection = pika.BlockingConnection(
    pika.ConnectionParameters(
        host="localhost",
        port=5672,
        virtual_host="/",
        credentials=credentials,
    )
)
channel = connection.channel()

# Use the same queue name your receiver listens to
queue_name = "bunny_locations"
channel.queue_declare(queue=queue_name, durable=True)

# Example message — the organization sends info about a care location
# Create 5 different messages
messages = [
    {
        "id": 1,
        "name": "Happy Bunny Vet Clinic",
        "latitude": 44.25464626242822,
        "longitude": 20.67858682287908,
    },
    {
        "id": 2,
        "name": "Fluffy Friends Shelter",
        "latitude": 44.8132,
        "longitude": 20.4607,
    },
    {
        "id": 3,
        "name": "Carrot Care Center",
        "latitude": 45.2396,
        "longitude": 19.8227,
    },
    {
        "id": 4,
        "name": "Hoppy Health Hub",
        "latitude": 43.3209,
        "longitude": 21.8958,
    },
    {
        "id": 5,
        "name": "Snuggle Bunny Clinic",
        "latitude": 44.0165,
        "longitude": 21.0059,
    },
]

for msg in messages:
    channel.basic_publish(
        exchange="",
        routing_key=queue_name,
        body=json.dumps(msg),
        properties=pika.BasicProperties(
            delivery_mode=2,  # make message persistent
            content_type="application/json",
        ),
    )
    print(f" [x] Sent message: {msg}")

connection.close()
print(" [✓] All messages sent successfully.")