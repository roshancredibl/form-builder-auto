# ClickUp Webhook Listener & Initial Sync Utility

A robust Python/Flask application that serves as a real-time ClickUp webhook listener and includes an initial data sync utility.

## Features

- **Webhook Listener**: Receives and validates ClickUp webhook events in real-time
- **Initial Sync**: Fetches all tasks from a specified ClickUp list
- **REST API**: Provides `/api/tasks` endpoint for frontend consumption with CORS support
- **React Frontend**: Dashboard UI that polls the API every 10 seconds for real-time updates
- **Secure**: Uses environment variables for all sensitive configuration
- **Production Ready**: Includes Procfile for easy deployment on Heroku/Render

## Prerequisites

- Python 3.7 or higher
- ClickUp API token
- ClickUp List ID
- ClickUp Webhook Secret

## Environment Variables

The application requires the following environment variables to be set:

### Required Variables

- **`CLICKUP_API_TOKEN`**: Your ClickUp API token. You can generate one in your ClickUp settings under "Apps" → "API Token".
- **`CLICKUP_LIST_ID`**: The ID of the ClickUp list you want to sync tasks from. You can find this in the ClickUp list URL.
- **`CLICKUP_WEBHOOK_SECRET`**: A secret key used to validate incoming webhook requests. This should match the secret you configure in ClickUp when setting up the webhook.
- **`PORT`**: The port number on which the Flask application should run (defaults to 5000 if not set).

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd form-builder-auto
```

2. Create a virtual environment (recommended):
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Configuration

### Setting Environment Variables

#### On macOS/Linux:
```bash
export CLICKUP_API_TOKEN="your_api_token_here"
export CLICKUP_LIST_ID="your_list_id_here"
export CLICKUP_WEBHOOK_SECRET="your_webhook_secret_here"
export PORT=5000
```

#### On Windows (Command Prompt):
```cmd
set CLICKUP_API_TOKEN=your_api_token_here
set CLICKUP_LIST_ID=your_list_id_here
set CLICKUP_WEBHOOK_SECRET=your_webhook_secret_here
set PORT=5000
```

#### On Windows (PowerShell):
```powershell
$env:CLICKUP_API_TOKEN="your_api_token_here"
$env:CLICKUP_LIST_ID="your_list_id_here"
$env:CLICKUP_WEBHOOK_SECRET="your_webhook_secret_here"
$env:PORT=5000
```

#### Using a .env file (recommended for development):

Create a `.env` file in the project root:
```
CLICKUP_API_TOKEN=your_api_token_here
CLICKUP_LIST_ID=your_list_id_here
CLICKUP_WEBHOOK_SECRET=your_webhook_secret_here
PORT=5000
```

Then install `python-dotenv` and load it in your application:
```bash
pip install python-dotenv
```

## Running the Application

### Development Mode

Run the Flask development server:
```bash
python app.py
```

The application will start on the port specified by the `PORT` environment variable (default: 5000).

### Production Mode

For production, use gunicorn:
```bash
gunicorn app:app
```

Or with specific configuration:
```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## API Endpoints

### POST `/webhook_listener`

Receives ClickUp webhook events. Validates the webhook signature using the `CLICKUP_WEBHOOK_SECRET` and logs event details (event type, task ID) to the console.

**Request Headers:**
- `X-Signature`: Webhook signature for validation
- `Content-Type`: application/json

**Response:**
- `200 OK`: Webhook received and processed successfully
- `401 Unauthorized`: Invalid webhook signature
- `500 Internal Server Error`: Server error or missing configuration

### GET `/initial_sync`

Fetches all tasks from the ClickUp list specified by `CLICKUP_LIST_ID` using the `CLICKUP_API_TOKEN`. Prints the full JSON task data to the console.

**Response:**
- `200 OK`: Sync completed successfully (returns "Initial sync complete")
- `500 Internal Server Error`: Error fetching tasks or missing configuration

### GET `/api/tasks`

Retrieves a list of tasks. For this prototype, returns a static list of 5 sample tasks including id, name, status, and last_updated timestamp. Includes CORS headers to allow frontend React application access.

**Response:**
- `200 OK`: Returns JSON object with tasks array
  ```json
  {
    "tasks": [
      {
        "id": "task_001",
        "name": "Design User Dashboard",
        "status": "in_progress",
        "last_updated": "2024-01-15T10:30:00Z"
      },
      ...
    ]
  }
  ```

**CORS**: This endpoint includes CORS headers to allow cross-origin requests from the React frontend.

### GET `/health`

Health check endpoint to verify the application is running.

**Response:**
- `200 OK`: Application is healthy

## Deployment

### Heroku

1. Create a Heroku app:
```bash
heroku create your-app-name
```

2. Set environment variables:
```bash
heroku config:set CLICKUP_API_TOKEN=your_token
heroku config:set CLICKUP_LIST_ID=your_list_id
heroku config:set CLICKUP_WEBHOOK_SECRET=your_secret
heroku config:set PORT=5000
```

3. Deploy:
```bash
git push heroku main
```

### Render

1. Create a new Web Service on Render
2. Connect your repository
3. Set the environment variables in the Render dashboard
4. Render will automatically detect the Procfile and deploy

### VM Deployment (DigitalOcean, AWS, etc.)

This section covers deploying to a Linux VM on cloud providers like DigitalOcean, AWS Free Tier, or similar services.

#### Step 1: GitHub Repository Setup

1. **Create Repository**: Create a new, private repository on GitHub (e.g., `clickup-realtime-listener`)
2. **Add Files**: Ensure all files (`app.py`, `requirements.txt`, `Procfile`, `README.md`) are in your repository
3. **Commit and Push**: Commit these files and push them to your GitHub repository:
   ```bash
   git add .
   git commit -m "Initial commit: ClickUp webhook listener"
   git push origin main
   ```

#### Step 2: Prepare the VM / Free Cloud Hosting

You need a public address. This example assumes a generic Linux VM (like DigitalOcean's smallest tier, AWS Free Tier, or a similar cloud provider).

**A. Install Python/Git**

Log into your VM via SSH and install Python 3 and Git if they are not already present:

```bash
# On Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip python3-venv git -y

# On CentOS/RHEL
sudo yum update -y
sudo yum install python3 python3-pip git -y

# Verify installation
python3 --version
git --version
```

**B. Clone Repo**

Clone your GitHub repository onto the VM:

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

**C. Set Environment Variables**

This is the most crucial security step. Create a `.env` file to store the sensitive values securely:

```bash
# Create .env file
nano .env
```

Add the following content (replace with your actual values):
```
CLICKUP_API_TOKEN=your_api_token_here
CLICKUP_LIST_ID=your_list_id_here
CLICKUP_WEBHOOK_SECRET=your_webhook_secret_here
PORT=5000
```

Save and exit (Ctrl+X, then Y, then Enter in nano).

**Alternative: Export in Shell Session**

If you prefer to export them manually:
```bash
export CLICKUP_API_TOKEN="your_api_token_here"
export CLICKUP_LIST_ID="your_list_id_here"
export CLICKUP_WEBHOOK_SECRET="your_webhook_secret_here"
export PORT=5000
```

**D. Install Dependencies**

Navigate to the repo directory and install dependencies:

```bash
# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**E. Open Firewall**

Configure the VM's firewall to allow inbound traffic on the port your application will use:

```bash
# For Ubuntu/Debian (ufw)
sudo ufw allow 5000/tcp
sudo ufw status

# For CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-port=5000/tcp
sudo firewall-cmd --reload

# For AWS/Azure/GCP: Also configure Security Groups/Network Security Groups
# to allow inbound traffic on port 5000 (or your chosen PORT)
```

#### Step 3: Deployment and Public URL

**Run the Server**

Start the Flask application:

```bash
# Development mode (for testing)
python3 app.py

# Production mode (recommended - run in background)
gunicorn -w 4 -b 0.0.0.0:5000 app:app

# Or run in background with nohup
nohup gunicorn -w 4 -b 0.0.0.0:5000 app:app > app.log 2>&1 &
```

**Find Public IP/DNS**

Note the public IP address or DNS name of your VM:

```bash
# Get public IP
curl ifconfig.me
# Or check your cloud provider's dashboard
```

**Get the Webhook URL**

Your final webhook URL will be the VM's public address combined with the port and route:

```
http://[Your VM Public IP]:[Port defined by $PORT]/webhook_listener
```

Example:
```
http://123.45.67.89:5000/webhook_listener
```

**Optional: Set Up as a System Service**

For production, you may want to run the application as a systemd service:

1. Create a service file:
```bash
sudo nano /etc/systemd/system/clickup-webhook.service
```

2. Add the following content (adjust paths as needed):
```ini
[Unit]
Description=ClickUp Webhook Listener
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/home/your-username/your-repo-name
Environment="PATH=/home/your-username/your-repo-name/venv/bin"
ExecStart=/home/your-username/your-repo-name/venv/bin/gunicorn -w 4 -b 0.0.0.0:5000 app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

3. Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable clickup-webhook
sudo systemctl start clickup-webhook
sudo systemctl status clickup-webhook
```

## Security Notes

- Never commit your `.env` file or expose your API tokens in version control
- Use strong, unique secrets for `CLICKUP_WEBHOOK_SECRET`
- Keep your ClickUp API token secure and rotate it periodically
- The webhook listener validates all incoming requests using HMAC SHA256 signature verification

## Troubleshooting

- **"Webhook secret not configured"**: Ensure `CLICKUP_WEBHOOK_SECRET` is set in your environment
- **"API token not configured"**: Ensure `CLICKUP_API_TOKEN` is set in your environment
- **"List ID not configured"**: Ensure `CLICKUP_LIST_ID` is set in your environment
- **Invalid signature errors**: Verify that the webhook secret in ClickUp matches your `CLICKUP_WEBHOOK_SECRET` environment variable

## Frontend Application

This repository includes a React TypeScript frontend application located in the `frontend/` directory. The frontend provides a real-time dashboard that displays tasks fetched from the Flask API.

### Frontend Setup

See the [Frontend README](frontend/README.md) for detailed setup and deployment instructions.

### Quick Start (Frontend)

```bash
cd frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000` and will automatically connect to the Flask API.

### Frontend Deployment

The frontend is a static React application that can be deployed to:
- **Netlify** (recommended for simplicity)
- **Vercel**
- **GitHub Pages**

Build the frontend:
```bash
cd frontend
npm run build
```

Then deploy the `build` folder to your chosen static hosting service.

### Communication Flow

```
ClickUp → Webhook → Flask Server (Writes to DB)
Browser → React App → Calls Flask Server /api/tasks (Reads from DB)
Flask → Returns latest data → React App updates the UI
```

## License

This project is part of the Form Builder (Low Code) repository.
