chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "openScrappingPopup") {
      console.log("Received the message from the popup.");
      // Your code to handle the message goes here
    }
  });