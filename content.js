// Set to track processed messages
const processedMessages = new Set();
let isScriptActive = false; // Track the script's active state
let intervalId = null; // Store the interval ID

console.log("Chat Data Extractor script loaded.");

// Extract data from a single message element
function extractDataFromMessage(messageElement) {
  console.log("Extracting data from a message element...");
  const data = {};
  try {
    const htmlContent = messageElement.innerHTML;

    // Use regular expressions to extract text data
    data.status = htmlContent.match(
      /<span style="color:green"><b><u>(.*?)<\/u><\/b><\/span>/
    )?.[1];
    data.requestType = htmlContent.match(
      /<span style="color:navy|color:maroon">(.*?)<\/span>/
    )?.[1];
    data.depositRequest = htmlContent.match(/Request.*?№ <b>(\d+)<\/b>/)?.[1];
    data.agent = htmlContent.match(/Agent: (.*?)<\/span>/)?.[1]?.trim();
    data.paymentNumber = htmlContent.match(
      /Payment number: <b>(\d+)<\/b>/
    )?.[1];
    data.amount = htmlContent
      .match(/Amount: (.*?) BDT/)?.[1]
      ?.replace(/[^0-9.]/g, ""); // Remove separators
    data.customer = htmlContent.match(/Customer: (\d+).*?<\/span>/)?.[1];
    data.comment = htmlContent.match(/BankTransferComment: (.*?)<\/span>/)?.[1];
    data.extTrnId = htmlContent.match(/Ext_trn_id: (.*?)<\/span>/)?.[1];

    console.log("Data extracted successfully:", data);
  } catch (err) {
    console.error("Error extracting data:", err);
  }
  return data;
}

// Process a single message element
function processMessageElement(messageElement) {
  console.log("Processing a single message element...");
  const messageHtml = messageElement.innerHTML;
  const messageId = messageHtml.match(/Request.*?№ <b>(\d+)<\/b>/)?.[1];

  if (!messageId) {
    console.warn("Message ID not found. Skipping message:", messageHtml);
    return;
  }
  if (processedMessages.has(messageId)) {
    console.log(`Message ID ${messageId} already processed. Skipping.`);
    return;
  }

  // Only process messages containing "APPROVED" or "SENT"
  if (!/>(APPROVED|SENT)</.test(messageHtml)) {
    console.log(
      `Message ID ${messageId} does not contain target keywords. Skipping.`
    );
    return;
  }

  const data = extractDataFromMessage(messageElement);
  if (data) {
    console.log("Processed message data:", data);
    processedMessages.add(messageId); // Mark as processed
  }
}

// Process all messages in the chat
function processAllMessages() {
  if (!isScriptActive) {
    console.log("Script is inactive. Skipping processing.");
    return; // Exit if the script is turned off
  }

  console.log("Processing all messages...");
  const messages = document.querySelectorAll(".message__text__content");

  if (messages.length === 0) {
    console.warn("No messages found in the chat.");
    return;
  }

  messages.forEach(processMessageElement);
  console.log("Finished processing all messages.");
}

// Toggle script on/off
function toggleScript() {
  isScriptActive = !isScriptActive;
  const button = document.getElementById("toggle-button");
  button.textContent = isScriptActive ? "Turn Off" : "Turn On";
  console.log(`Script toggled ${isScriptActive ? "ON" : "OFF"}.`);

  if (isScriptActive) {
    console.log("Starting message processing...");
    processAllMessages(); // Process immediately when turned on
    intervalId = setInterval(processAllMessages, 3000); // Run every 3 seconds
  } else {
    console.log("Stopping message processing...");
    clearInterval(intervalId); // Stop the interval
    intervalId = null;
  }
}

// Create On/Off button UI
function createToggleButton() {
  console.log("Creating toggle button...");
  const button = document.createElement("button");
  button.id = "toggle-button";
  button.textContent = "Turn On";
  button.style.position = "fixed";
  button.style.bottom = "20px";
  button.style.right = "20px";
  button.style.zIndex = "1000";
  button.style.padding = "10px 20px";
  button.style.backgroundColor = "#007bff";
  button.style.color = "#fff";
  button.style.border = "none";
  button.style.borderRadius = "5px";
  button.style.cursor = "pointer";
  button.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";

  button.addEventListener("click", toggleScript);
  document.body.appendChild(button);
  console.log("Toggle button created.");
}

// Initialize the script
function initialize() {
  console.log("Initializing Chat Data Extractor...");
  createToggleButton();
  console.log("Script initialized. Ready to process messages.");
}

// Run the initialization
initialize();
