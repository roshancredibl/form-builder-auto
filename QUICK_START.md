# Quick Start Guide

## Capture All ClickUp List Events (Task Creation, Status Changes, Comments, etc.)

### Step 1: Start the Server

```bash
npm start
```

Server runs on `http://localhost:3000`

### Step 2: Expose to Internet (ngrok)

In a new terminal:
```bash
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abcd1234.ngrok.io`)

### Step 3: Get Your ClickUp Credentials

1. **API Token**: 
   - Go to https://app.clickup.com/settings/apps
   - Click "Generate" to create a new token
   - Copy the token

2. **List ID**:
   - Open your ClickUp list
   - Look at the URL: `https://app.clickup.com/123456/v/l/123456789`
   - The List ID is the number after `/l/` (e.g., `123456789`)

### Step 4: Create the Webhook

Run the setup script:

```bash
CLICKUP_TOKEN=your_token_here \
LIST_ID=your_list_id_here \
WEBHOOK_URL=https://abcd1234.ngrok.io/clickup-webhook \
node setup-webhook.js
```

### Step 5: Test It!

1. Go to your ClickUp list
2. Create a new task
3. Change a task status
4. Add a comment to a task
5. Watch your server console - you'll see all events logged! 🎉

## What Events Are Captured?

✅ Task creation  
✅ Task status changes  
✅ Task comments (new & updated)  
✅ Task updates (any field changes)  
✅ Assignee changes  
✅ Due date changes  
✅ Priority changes  

## Troubleshooting

**Webhook not receiving events?**
- Make sure ngrok is still running
- Verify the webhook URL is correct
- Check that the List ID matches your list
- Ensure your API token has the right permissions

**Need to see the webhook payload structure?**
- Check your server console - it logs everything
- The server formats the output for easy reading

