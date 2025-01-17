const { Client } = require("@notionhq/client");
const axios = require("axios");

// Initialize Notion client
const notion = new Client({ auth: "your-notion-integration-token" });

// Replace with your database ID
const databaseId = "ceb6fd5fa1b94772966ebaffda8fd9fb";

// Replace with your Render webhook URL
const webhookUrl = "https://webhook-mnoj.onrender.com";

// Store last checked timestamp
let lastCheckedTime = new Date().toISOString();

// Function to fetch updates from Notion
async function checkForUpdates() {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Last edited time",
        date: {
          after: lastCheckedTime,
        },
      },
    });

    const changes = response.results.map((page) => ({
      id: page.id,
      title: page.properties.Name?.title[0]?.text?.content || "Untitled",
      lastEditedTime: page.last_edited_time,
      url: page.url,
    }));

    if (changes.length > 0) {
      console.log("Changes detected:", changes);
      notifyWebhook(changes); // Send changes to the webhook
    }

    // Update the last checked time
    lastCheckedTime = new Date().toISOString();
  } catch (error) {
    console.error("Error fetching updates:", error);
  }
}

// Function to notify the webhook
async function notifyWebhook(changes) {
  try {
    await axios.post(webhookUrl, { changes });
    console.log("Webhook notified successfully!");
  } catch (error) {
    console.error("Error notifying webhook:", error);
  }
}

// Poll every minute
setInterval(checkForUpdates, 60000);
