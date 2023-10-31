let mailData = {};
let dataObj;
let composeDiv ='.AD div.nH.Hd';
let recip = "div.afp div.aU4VQc.YxcKdf div.aGb input.agP.aFw"
let sub = "input[name=subjectbox]";
let mes = "table div.Ar.Au div.Am.Al.editable.LW-avf.tS-tW";
let resp = ":kp :jd";
let send = "div.dC div.T-I.J-J5-Ji";
// ".nH.Hd.inboxsdk__compose.inboxsdk__size_fixer.inboxsdk__ensure_link_active"
//let recip = "aIa aFw"; // by classname
//let mes = "#\\:ln";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === "openScrappingPopup") {
    // Create the popup
    createPopup();
  }
});

function createPopup() {
  let mailSubjectString = "";
  let mailMessage = "";
  let newTab;

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
          <label for "subject" style="color: red;">Subject:</label>
          <input type="text" id="subject" placeholder="Enter Subject">
        </div>
        <div id="bottom">
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
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const csvData = e.target.result;
        // Process the CSV data and add it to mailData
        console.log("this is csv file data", csvData);
        processCsvData(csvData);
      };
      reader.readAsText(file);
    }
  });
  
  document
    .getElementById("start-email-scrapping")
    .addEventListener("click", () => {
      // Save the subject and message into variables
      mailSubjectString = document.getElementById("subject").value;
      mailMessage = document.getElementById("messageSend").value;

      // Push the subject and message to the mailData array
      //mailData.push({ subject: mailSubjectString, message: mailMessage });
      mailData.subject = mailSubjectString;
      mailData.message = mailMessage;

      // Log the updated mailData array
      console.log("mailData:", mailData);
      // let links = mailData.split(",");
      // console.log(links)
      dataObj = { emailData: mailData };
      console.log(dataObj);

      chrome.storage.local.set(dataObj, function () {});
      document.getElementById("email-scrapping-popup").remove();
      const desiredUrl = "https://mail.google.com/mail/u/0/#inbox?compose=new";
      newTab = window.open(desiredUrl, "_blank");
      // Check if the new tab has loaded

      newTab.addEventListener("load", function () {
        // Send a message to the new tab's console
        console.log("new Tab loaded");
        //console.log("newtab after something", newTab)
        newTab.postMessage(
          { type: "fromParentTab", msg: "Hello from parent tab!" },
          "https://mail.google.com/mail/*"
        ); // "*" allows sending messages to all origins
      });
    });
}

window.addEventListener("message", async function (event) {
  if (
    event.origin === "https://mail.google.com" &&
    event.data.type === "fromParentTab"
  ) {
    console.log(event.data.msg)
    setTimeout(() => {
      if (
        window.location.href ===
        "https://mail.google.com/mail/u/0/#inbox?compose=new"
      ) {
        let composeDivId = document.querySelector(composeDiv);
        let recipents = document.querySelector(recip);
        let subject = document.querySelector(sub);
        let message = document.querySelector(mes);
        let sendBtn = document.querySelector(send);
        console.log(composeDivId, ">>>>>>>>>", composeDiv, "????",recipents, ">>>>>>", message, ">>>>>>>>>>.", subject);
        if (composeDivId) {
          chrome.storage.local.get(dataObj, function (dataObj) {
            if (recipents) {
              const inner = (recipents.value =
                dataObj.emailData.csvData);
              console.log("inner html>>>> ", inner);
            }else {
              console.log("sorry recipents doesnot exits");
            }
            if (message) {
              const yo = (message.innerHTML = dataObj.emailData.message);
              console.log("message.inner>>>>>>>>>", yo);
            } else {
              console.log("sorry message doesnot exits");
            }
            if (subject) {
                const subjj = (subject.value = dataObj.emailData.subject)
                console.log("inner subject>>>>>", subjj)
            }else {
              console.log("sorry subject  doesnot exits");
            }
            setTimeout(() => {
              if(subject && message && recipents){
                console.log("done");
                 sendBtn.click();
              }else{
                console.log("sorrryy")
              }
            }, 2000);
          });
        }else {
          this.alert("composeDiv does exits")
        }
       
      }
    }, 6000);
  }
});

function processCsvData(csvData) {
  let dd = [];
  const rows = csvData.split("\n");
  for (let i = 1; i < rows.length - 1; i++) {
    const columns = rows[i].split(",");
    dd.push(columns);
  }
  dd = dd.flat(Infinity);
  dd = dd.map((email) => email.replace(/\r/g, ""));
  const mailDataString = dd.join(",");
  mailData.csvData = mailDataString;
  console.log(dd, mailDataString, mailData);
  // mailData.push({ csvData: mailDataString });
  // console.log(mailDataString, "string");
}
