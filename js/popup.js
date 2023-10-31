let emailScrapData = document.getElementById("email-scrapdata"); // Button element object

if (emailScrapData) {
  emailScrapData.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // Sending request to content script to create the popup
      chrome.tabs.sendMessage(tabs[0].id, {
        type: "openScrappingPopup",
      });
    });
  });
}


// let emailScrapData = document.getElementById("email-scrapdata"); //Button element object 

// if(emailScrapData)
// {
//   emailScrapData.addEventListener("click", async () => {
//     console.log('click')
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) 
//     {
//         console.log('clicked')
//       // Sending request to content script to further handle the report process
//       chrome.tabs.sendMessage(tabs[0].id, 
//       {
//           type: "openScrappingPopup"
//       }, function(response){
//         if(response.type === "response for new popup"){
//           console.log(response.type)
//           window.close();
//         }
//       });
//       // sending message to background.js
//       chrome.runtime.sendMessage({
//         type: "openScrappingPopup", // Specify the message type
//       });
//       //window.close(); // to close popup window
//     });
//   });




// }

// let emailScrapData = document.getElementById("email-scrapdata"); // Button element object

// if (emailScrapData) {
//   emailScrapData.addEventListener("click", async () => {
//     // Create and open a new popup
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//       // Sending a message to content.js to handle the report process
//       chrome.tabs.sendMessage(tabs[0].id, {
//         type: "openScrappingPopup",
//       });
  
//       // Close the current popup
     
//     });
//     openNewPopup();
   
//   });
// }

// function openNewPopup() {
//   // window.close();
//   //window.open("https://www.google.com", "Google", "width=800, height=600, resizable=yes, scrollbars=yes");

//   const newPopup = document.getElementById("new-popup");
//   const newInput = document.getElementById("new-input");
  
//   // Show the new popup
//   newPopup.style.display = "block";

  
// }
