/**
 * Script to create a ClickUp webhook via their API
 * 
 * This creates a webhook that listens to multiple event types on a specific list.
 * 
 * Usage:
 * 1. Get your ClickUp API token from: https://app.clickup.com/settings/apps
 * 2. Get your List ID from the ClickUp URL (e.g., list/123456789)
 * 3. Set your webhook URL (e.g., from ngrok: https://abcd1234.ngrok.io/clickup-webhook)
 * 4. Run: CLICKUP_TOKEN=your_token LIST_ID=your_list_id WEBHOOK_URL=your_url node setup-webhook.js
 */

const CLICKUP_TOKEN = process.env.CLICKUP_TOKEN;
const LIST_ID = process.env.LIST_ID;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

if (!CLICKUP_TOKEN || !LIST_ID || !WEBHOOK_URL) {
  console.error('❌ Missing required environment variables!');
  console.log('\nUsage:');
  console.log('  CLICKUP_TOKEN=your_token LIST_ID=your_list_id WEBHOOK_URL=your_url node setup-webhook.js');
  console.log('\nWhere:');
  console.log('  CLICKUP_TOKEN: Your ClickUp API token (get from https://app.clickup.com/settings/apps)');
  console.log('  LIST_ID: The ID of the list you want to monitor (from ClickUp URL)');
  console.log('  WEBHOOK_URL: Your public webhook URL (e.g., https://abcd1234.ngrok.io/clickup-webhook)');
  process.exit(1);
}

// All the event types you want to listen to
const EVENT_TYPES = [
  'taskCreated',           // Task creation
  'taskUpdated',           // Task updates
  'taskDeleted',           // Task deletion
  'taskStatusUpdated',     // Status changes
  'taskAssigneeUpdated',   // Assignee changes
  'taskDueDateUpdated',    // Due date changes
  'taskCommentPosted',     // New comments
  'taskCommentUpdated',    // Comment updates
  'taskPriorityUpdated',   // Priority changes
  'taskTimeTracked',       // Time tracking
];

async function createWebhook() {
  const url = `https://api.clickup.com/api/v2/list/${LIST_ID}/webhook`;
  
  const payload = {
    endpoint: WEBHOOK_URL,
    client_id: CLICKUP_TOKEN, // Note: ClickUp uses client_id field for the token
    events: EVENT_TYPES,
    task_id: null, // null means all tasks in the list
    space_id: null,
    folder_id: null,
    list_id: LIST_ID,
    health: {
      status: 'active',
      fail_count: 0,
    },
  };

  try {
    console.log('🚀 Creating ClickUp webhook...');
    console.log(`   List ID: ${LIST_ID}`);
    console.log(`   Webhook URL: ${WEBHOOK_URL}`);
    console.log(`   Events: ${EVENT_TYPES.length} event types`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': CLICKUP_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('\n✅ Webhook created successfully!');
      console.log(`   Webhook ID: ${data.webhook?.id || data.id}`);
      console.log(`\n📋 Listening for these events:`);
      EVENT_TYPES.forEach(event => {
        console.log(`   - ${event}`);
      });
      console.log('\n💡 Now test it by creating/updating a task in your ClickUp list!');
    } else {
      console.error('\n❌ Failed to create webhook:');
      console.error(JSON.stringify(data, null, 2));
      if (data.err) {
        console.error(`\nError: ${data.err}`);
      }
    }
  } catch (error) {
    console.error('\n❌ Error creating webhook:');
    console.error(error.message);
  }
}

createWebhook();

