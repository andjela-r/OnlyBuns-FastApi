# app/workers/receive_bunny_locations.py
import json
import os
import threading
import pika
import httpx
from loguru import logger

RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_USER = os.getenv("RABBITMQ_USER", "admin")
RABBITMQ_PASS = os.getenv("RABBITMQ_PASS", "admin")
QUEUE_NAME    = os.getenv("BUNNY_LOCATIONS_QUEUE", "bunny_locations")
API_BASE_URL  = os.getenv("API_BASE_URL", "http://localhost:8000")

_consumer_thread = None

def _handle_message(raw: bytes) -> None:
    data = json.loads(raw)
    # expected: {"id": 123, "name": "Vet XYZ", "latitude": 44.80, "longitude": 20.50}

    try:
        # Create bunny care data for the API request
        bunny_care_data = {
            "name": data.get("name"),
            "latitude": data.get("latitude"),
            "longitude": data.get("longitude")
        }
        
        # Make HTTP request to the bunny care creation endpoint
        with httpx.Client() as client:
            response = client.post(
                f"{API_BASE_URL}/bunny-care/",
                json=bunny_care_data,
                timeout=30.0
            )
            
            if response.status_code == 201:
                logger.info(f"Successfully created bunny care: {data.get('name')}")
            elif response.status_code == 400:
                # Bunny care already exists (based on coordinates or name)
                logger.info(f"Bunny care already exists: {data.get('name')}")
            else:
                logger.error(f"Failed to create bunny care: {response.status_code} - {response.text}")
                
    except httpx.RequestError as e:
        logger.error(f"HTTP request error creating bunny care: {e}")
    except Exception as e:
        logger.error(f"Error creating bunny care: {e}")

def _consume() -> None:
    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)
    params = pika.ConnectionParameters(host=RABBITMQ_HOST, credentials=credentials)
    connection = pika.BlockingConnection(params)
    channel = connection.channel()

    # direct queue (no exchange needed) and make it durable
    channel.queue_declare(queue=QUEUE_NAME, durable=True)
    channel.basic_qos(prefetch_count=1)

    def _callback(ch, method, properties, body):
        _handle_message(body)
        ch.basic_ack(delivery_tag=method.delivery_tag)

    channel.basic_consume(queue=QUEUE_NAME, on_message_callback=_callback)
    logger.info(f"[*] Bunny care receiver listening on '{QUEUE_NAME}' at {RABBITMQ_HOST}")
    channel.start_consuming()

def start_consumer_in_background() -> None:
    global _consumer_thread
    if _consumer_thread and _consumer_thread.is_alive():
        return
    _consumer_thread = threading.Thread(target=_consume, name="bunny-rabbitmq-consumer", daemon=True)
    _consumer_thread.start()