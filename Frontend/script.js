const sendBtn = document.getElementById("send-btn");
const userInput = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

//Event associated with Send button
sendBtn.addEventListener("click", () => 
{
    const text = userInput.value.trim();
    if (!text) 
        return;

    addMessage("user", text);
    userInput.value = "";
    sendToBackend(text);
});

//Integrated Keypress event for enter key that propagate same as Send button
userInput.addEventListener("keypress", (e) => 
{
    if (e.key === "Enter") 
    {
        e.preventDefault(); 
        sendBtn.click();   
    }
});

//Imporant function that writes output message on bot reply box
function addMessage(sender, text, isTyping = false) 
{
    const msg = document.createElement("div");
    msg.classList.add("message", sender);

    if (isTyping && sender === "bot") 
    {
    
        const formatted = text
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br>");

        let i = 0;
        msg.innerHTML = "";
        const interval = setInterval(() => { //Making bot to type animated way
        msg.innerHTML = formatted.slice(0, i);
        i++;
        if (i > formatted.length) 
            clearInterval(interval);
        chatBox.scrollTop = chatBox.scrollHeight;
        }, 10);
    } 
    else 
    {
        msg.innerHTML = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br>");
    }

    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function sendToBackend(dreamText) 
{
    // Loading message
    addMessage("bot", "Interpreting your dream...", false); 

    fetch("http://127.0.0.1:5000/interpret", 
    {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ dream: dreamText })
    })
    .then(res => res.json())
    .then(data => {
      
        const botMsgs = document.querySelectorAll(".bot");
        if (botMsgs.length > 0) 
        {
            chatBox.removeChild(botMsgs[botMsgs.length - 1]);
        }

        addMessage("bot", data.interpretation, true); // Typing effect
    })
    .catch(err => {
      addMessage("bot", "Oops! Something went wrong.");
      console.error(err);
    });
}
const journalBtn = document.getElementById("journal-btn");
const journalView = document.getElementById("journal-view");

journalBtn.addEventListener("click", () => {
  fetch("http://127.0.0.1:5000/journal")
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        journalView.innerHTML = "Failed to load journal.";
        return;
      }

      if (data.length === 0) {
        journalView.innerHTML = "No dreams saved yet.";
      } else {
        journalView.innerHTML = data.map(entry => `
          <div class="journal-entry">
            <strong>Dream:</strong> ${entry.dream}<br>
            <strong>Interpretation:</strong> ${entry.interpretation.replace(/\n/g, "<br>")}
          </div>
        `).join("");
      }

      journalView.style.display = "block";
    })
    .catch(err => {
      journalView.innerHTML = "Error loading journal.";
      console.error(err);
    });
});
