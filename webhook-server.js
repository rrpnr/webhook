const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

// Webhook endpoint
app.post("/webhook", (req, res) => {
  const changes = req.body.changes;

  // Log changes to a file
  fs.appendFileSync(
    "changes_log.txt",
    `${new Date().toISOString()} - ${JSON.stringify(changes, null, 2)}\n\n`
  );

  console.log("Webhook received changes:", changes);
  res.sendStatus(200);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
