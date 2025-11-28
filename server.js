import express from "express";

const app = express();

app.use(express.json()); // so we can read JSON body

// Event type mappings for better logging
const eventTypes = {
  'taskCreated': '📝 Task Created',
  'taskUpdated': '✏️  Task Updated',
  'taskDeleted': '🗑️  Task Deleted',
  'taskStatusUpdated': '🔄 Task Status Changed',
  'taskAssigneeUpdated': '👤 Task Assignee Changed',
  'taskDueDateUpdated': '📅 Task Due Date Changed',
  'taskCommentPosted': '💬 Task Comment Posted',
  'taskCommentUpdated': '💬 Task Comment Updated',
  'taskTimeTracked': '⏱️  Time Tracked',
  'taskPriorityUpdated': '⚡ Task Priority Changed',
};

// This is the URL you'll give to ClickUp
app.post("/clickup-webhook", (req, res) => {
  const event = req.body?.event?.type || req.body?.event_type || 'unknown';
  const eventLabel = eventTypes[event] || `📌 ${event}`;
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${eventLabel}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Event Type: ${event}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  
  // Extract key information based on event type
  if (req.body?.task) {
    const task = req.body.task;
    console.log(`Task ID: ${task.id}`);
    console.log(`Task Name: ${task.name}`);
    if (task.status) console.log(`Status: ${task.status.status}`);
    if (task.assignees?.length > 0) {
      console.log(`Assignees: ${task.assignees.map(a => a.username).join(', ')}`);
    }
  }
  
  if (req.body?.comment) {
    const comment = req.body.comment;
    console.log(`Comment ID: ${comment.id}`);
    console.log(`Comment Author: ${comment.user?.username || 'Unknown'}`);
    console.log(`Comment: ${comment.comment_text?.substring(0, 100)}...`);
  }
  
  if (req.body?.history_items) {
    console.log(`\nHistory Items (${req.body.history_items.length}):`);
    req.body.history_items.forEach((item, idx) => {
      console.log(`  ${idx + 1}. ${item.user?.username || 'System'}: ${item.field || 'Unknown field'}`);
    });
  }
  
  console.log(`\nFull Payload:`);
  console.log(JSON.stringify(req.body, null, 2));
  console.log(`${'='.repeat(60)}\n`);

  // TODO: Here you can:
  // - Save data to DB
  // - Send to another API
  // - Trigger workflow
  // - Filter by list ID if needed: req.body.task?.list?.id

  res.sendStatus(200); // Important: reply 2xx so ClickUp knows it succeeded
});

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "ClickUp webhook server is running",
    webhookEndpoint: "/clickup-webhook"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  console.log(`📡 Webhook endpoint: http://localhost:${PORT}/clickup-webhook`);
  console.log(`\n💡 To expose to the internet, use ngrok:`);
  console.log(`   ngrok http ${PORT}`);
});

