// // var queryParams = window.location.search;
// const desiredUrl = "https://mail.google.com/mail/u/0/#inbox?compose=new";
// console.log("out");

// chrome.runtime.onMessage.addListener(async function (
//   request,
//   sender,
//   sendResponse
// ) {
//   if (request.type == "openScrappingPopup") {
//     if (window.location.href === desiredUrl) {
//       console.log("hello");
//       sendResponse({ type: "response for new popup" });
//       // if (document.getElementById("linkedIn-scrapping-popup")) {
//       //   document
//       //     .getElementById("start-linkedIn-scrapping")
//       //     .removeEventListener("click", startDataScrappping);
//       //   document
//       //     .getElementById("linkedIn-scrapping-popup-overlay")
//       //     .removeEventListener("click", closepopup);
//       //   document.getElementById("linkedIn-scrapping-popup").remove();
//       // }
//       let popupHTML = "";
//       let nodeDiv = document.createElement("div");
//       nodeDiv.class = "linkedIn-scrapping-popup";
//       nodeDiv.id = "linkedIn-scrapping-popup";
//       document.getElementsByTagName("body")[0].appendChild(nodeDiv);
//       popupHTML =
//         '<div id="linkedIn-scrapping-popup-overlay" class="linkedIn-scrapping-popup-overlay"></div>\n\
//       <div class="linkedIn-scrapping-popup-inner">\n\
//           <div class="linkedIn-scrapping-popup-head">\n\
//               <span>Send multiple Mails</span>\n\
//           </div>\n\
//           <div class="linkedIn-scrapping-popup-body">\n\
//               <label for="uploadfile" style= "color= red;">Csv File:<label>\n\
//               <input type="file" id="uploadfile" accept=".csv"  style= "width=220px"><br>\n\
//               <button id="uploadconfirm">Upload</button><br>\n\
//               <label for="subject" style= "color= red; padding-right = 30px">Subject</label>\n\
//               <input type="text" id="subject"><br>\n\
//               <label for = "linkedIn-profile-links" style= "color= red;">Message</label>\n\
//               <textarea id="linkedIn-profile-links" placeholder="Enter Message"></textarea>\n\
//           </div>\n\
//           <div class="linkedIn-scrapping-popup-footer">\n\
//               <button id="start-linkedIn-scrapping">Start Scrapping</button>\n\
//           </div>\n\
//       </div>';
//       // popup HTML is added to DOM
      
//        document.getElementById("linkedIn-scrapping-popup").innerHTML = popupHTML;
//        const uploadconfirm = document.getElementById('uploadconfirm').addEventListener("click", function(){
//        papa.parse(document.getElementById('uploadfile').files[0],{
//         download: true,
//         header:true,
//         skipEmptyLines: true,
//         complete: function(results){
//           console.log(results)
//         }
//        }) 
//        })
//       // document
//       //   .getElementById("start-linkedIn-scrapping")
//       //   .addEventListener("click", startDataScrappping);
//       // document
//       //   .getElementById("linkedIn-scrapping-popup-overlay")
//       //   .addEventListener("click", closepopup);
//     }
//   }
// });

let mailData = [];

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "openScrappingPopup") {
    // Create the popup
    createPopup();
  }
});

function createPopup() {
  let mailSubjectString = [];
  let mailMessage = [];
  // Check if the popup already exists, and remove it if it does
  const existingPopup = document.getElementById("email-scrapping-popup");
  if (existingPopup) {
    existingPopup.remove();
  }

  // Create a new popup
  const popupHTML = `
    <div id="email-scrapping-popup-overlay" class="email-scrapping-popup-overlay"></div>
    <div class="email-scrapping-popup-inner">
      <div class="linkedIn-scrapping-popup-head">
        <span>Send multiple Mails</span>
      </div>
      <div class="linkedIn-scrapping-popup-body">
       <div id="top">
        <label for="uploadfile" style="color: red;">Csv File:</label>
        <input type="file" id="uploadfile" accept=".csv" style="width:220px"><br>
        <button id="uploadcsv">Upload</button>
       </div> 
       <div id="mid">
        <label for="subject" style="color: red;">Subject:</label>
        <input type="text" id="subject" placeholder="Enter Subject">
        </div> 
        <div id="bottm">
        <label for="messageSend" style="color: red;">Message:</label>
        <textarea id="messageSend" placeholder="Enter Message" rows="10" cols="25"></textarea>
        </div> 
      </div>
      <div class="email-scrapping-popup-footer">
        <button id="start-email-scrapping">Start Scrapping</button>
      </div>
    </div>`;

  const nodeDiv = document.createElement("div");
  nodeDiv.className = "email-scrapping-popup";
  nodeDiv.id = "email-scrapping-popup";
  nodeDiv.innerHTML = popupHTML;
  document.body.appendChild(nodeDiv);
  const uploadcsv = document.getElementById("uploadcsv");
  uploadcsv.addEventListener("click", () => {
    const fileInput = document.getElementById("uploadfile");
    mailData = [];
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const csvData = e.target.result;
        // Process the CSV data as needed
        console.log("this is csv file data", csvData)
        processCsvData(csvData);
      };
      reader.readAsText(file);
    }
  });
  document.getElementById('subject').addEventListener('blur', (e) => {
    
    const subject2 = e.target.value;
    //console.log("Input Value:", subject2);
    mailSubjectString.push(subject2);
    console.log("inside Event: sub:", mailSubjectString);
    processMailSubject(mailSubjectString);
    mailSubjectString = [];
  });
 
  document.getElementById('messageSend').addEventListener('blur', (e) => {
    const messageSend = e.target.value;
    mailMessage.push(messageSend);
    console.log("inside Event mesgg:", mailMessage);
    processMailMessage(mailMessage);
    mailMessage = [];
  });
  

}
function processCsvData(csvData) { 
  const rows = csvData.split("\n");
  console.log("2 in the form of array", rows)
  console.log("length of row", rows.length)
  for (let i = 1; i < rows.length - 1; i++) {
    const columns = rows[i].split(",");
    mailData.push(columns)
    //console.log("3", columns)
  }
  mailData = mailData.flat(Infinity);
  mailData = mailData.map(email => email.replace(/\r/g, ''));
  mailDataString = mailData.join(",")
  console.log(mailData)
  console.log(mailDataString,"string")
  console.log(mailData.length)
}
function processMailMessage(mailMessage){
  console.log("Outside Listener messg:", mailMessage);
}
function processMailSubject(mailSubjectString){
  console.log("Outside Listener: sub :", mailSubjectString);
}



