import os
import hmac
import hashlib
import json
import logging
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
# Enable CORS for all routes to allow frontend access
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def validate_webhook_signature(payload, signature, secret):
    """
    Validate ClickUp webhook signature using HMAC SHA256.
    
    Args:
        payload: The raw request body as bytes
        signature: The signature from the X-Signature header
        secret: The webhook secret from environment variable
    
    Returns:
        bool: True if signature is valid, False otherwise
    """
    if not secret or not signature:
        return False
    
    expected_signature = hmac.new(
        secret.encode('utf-8'),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(expected_signature, signature)


@app.route('/webhook_listener', methods=['POST'])
def webhook_listener():
    """
    ClickUp webhook listener endpoint.
    Validates webhook signature and logs event details.
    """
    webhook_secret = os.getenv('CLICKUP_WEBHOOK_SECRET')
    
    if not webhook_secret:
        logger.error("CLICKUP_WEBHOOK_SECRET environment variable not set")
        return jsonify({"error": "Webhook secret not configured"}), 500
    
    # Get the signature from headers
    signature = request.headers.get('X-Signature', '')
    
    # Get raw payload for signature validation
    raw_payload = request.get_data()
    
    # Validate webhook signature
    if not validate_webhook_signature(raw_payload, signature, webhook_secret):
        logger.warning("Invalid webhook signature")
        return jsonify({"error": "Invalid signature"}), 401
    
    try:
        # Parse JSON payload
        event_data = request.get_json()
        
        # Extract event type and task ID
        event_type = event_data.get('event', {}).get('type', 'unknown')
        task_id = event_data.get('event', {}).get('task_id', 'unknown')
        
        # Log event details
        logger.info(f"ClickUp Webhook Event Received:")
        logger.info(f"  Event Type: {event_type}")
        logger.info(f"  Task ID: {task_id}")
        logger.info(f"  Full Event Data: {json.dumps(event_data, indent=2)}")
        
        return jsonify({"status": "success", "message": "Webhook received"}), 200
    
    except Exception as e:
        logger.error(f"Error processing webhook: {str(e)}")
        return jsonify({"error": "Error processing webhook"}), 500


@app.route('/initial_sync', methods=['GET'])
def initial_sync():
    """
    Initial sync endpoint to fetch all tasks from a ClickUp list.
    Uses CLICKUP_API_TOKEN and CLICKUP_LIST_ID environment variables.
    """
    api_token = os.getenv('CLICKUP_API_TOKEN')
    list_id = os.getenv('CLICKUP_LIST_ID')
    
    if not api_token:
        logger.error("CLICKUP_API_TOKEN environment variable not set")
        return jsonify({"error": "API token not configured"}), 500
    
    if not list_id:
        logger.error("CLICKUP_LIST_ID environment variable not set")
        return jsonify({"error": "List ID not configured"}), 500
    
    try:
        # ClickUp API endpoint for getting tasks in a list
        url = f"https://api.clickup.com/api/v2/list/{list_id}/task"
        
        headers = {
            "Authorization": api_token,
            "Content-Type": "application/json"
        }
        
        # Make API request
        logger.info(f"Fetching tasks from ClickUp list: {list_id}")
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        tasks_data = response.json()
        
        # Print full JSON task data to console
        logger.info("Full Task Data from ClickUp:")
        print(json.dumps(tasks_data, indent=2))
        
        return jsonify({"status": "success", "message": "Initial sync complete"}), 200
    
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching tasks from ClickUp: {str(e)}")
        if hasattr(e, 'response') and e.response is not None:
            logger.error(f"Response status: {e.response.status_code}")
            logger.error(f"Response body: {e.response.text}")
        return jsonify({"error": "Error fetching tasks from ClickUp"}), 500
    
    except Exception as e:
        logger.error(f"Unexpected error during initial sync: {str(e)}")
        return jsonify({"error": "Unexpected error during sync"}), 500


@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """
    API endpoint to retrieve tasks.
    For this prototype, returns a static list of 5 sample tasks.
    Includes CORS headers to allow frontend React application access.
    """
    # Static sample tasks data (mimicking database query)
    sample_tasks = [
        {
            "id": "task_001",
            "name": "Design User Dashboard",
            "status": "in_progress",
            "last_updated": "2024-01-15T10:30:00Z"
        },
        {
            "id": "task_002",
            "name": "Implement Authentication",
            "status": "complete",
            "last_updated": "2024-01-14T15:45:00Z"
        },
        {
            "id": "task_003",
            "name": "Write API Documentation",
            "status": "pending",
            "last_updated": "2024-01-13T09:20:00Z"
        },
        {
            "id": "task_004",
            "name": "Setup CI/CD Pipeline",
            "status": "in_progress",
            "last_updated": "2024-01-15T11:15:00Z"
        },
        {
            "id": "task_005",
            "name": "Performance Testing",
            "status": "pending",
            "last_updated": "2024-01-12T14:00:00Z"
        }
    ]
    
    logger.info("API request received for /api/tasks")
    return jsonify({"tasks": sample_tasks}), 200


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy"}), 200


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)

