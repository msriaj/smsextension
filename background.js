chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "sendToApi") {
    const apiEndpoint = "https://example.com/api"; // Replace with your API endpoint
    fetch(apiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message.data),
    })
      .then((response) => response.json())
      .then((result) => sendResponse({ success: true, result }))
      .catch((error) => sendResponse({ success: false, error }));
    return true; // Keep the message channel open for async response
  }
});
