// Sidebabr functions

const sidebar = document.getElementById('Sidebar');
const overaly = document.getElementById('Overlay');
const main_contet = document.getElementById('Main_content');
const sidebar_button_rotate = Array.from(document.querySelectorAll('.sidebar_open_btn_img'))

//User Input functions
const user_input = document.getElementById('UserInput')
const send_button = document.getElementById('SendButton')
const ChatBox = document.getElementById('ChatBox')

// Sidebar_functions
function Sidebar_functions() {
    if(sidebar.classList.contains('open')) 
    {

        sidebar.classList.remove('open')
        overaly.classList.remove('active')
        main_contet.classList.remove('sidebar_active')
        sidebar_button_rotate.forEach(btn => {
            btn.classList.remove('rotate')
        }) 
        

    } else {

       sidebar.classList.add('open')
       overaly.classList.add('active')
       main_contet.classList.add('sidebar_active')
       sidebar_button_rotate.forEach(btn => {
            btn.classList.add('rotate')
        })
    }
}

document.querySelectorAll('.sidebar_button').forEach( btn => {
    btn.addEventListener('click', () => Sidebar_functions());
})
overaly.addEventListener('click', () => Sidebar_functions());

// ChatBot functions
const API_URL = window.location.origin

function escapeHTML(str) {
    return str
           .replace(/&/g, "&amp;")
           .replace(/</g, "&lt;")
           .replace(/>/g, "&gt;")
           .replace(/"/g, "&quot;")
           .replace(/'/g, "&#39;")
}

function Parse(rawText) {
    const codeBlock = []
    let codeData = rawText.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        codeBlock.push({lang, code})
        return `_CODEBLOCK_${codeBlock.length -1}_`;
    })

    codeData  = codeData.replace(/^(#{1,6})\s+(.*)$/gm, (match, hashes, text) => {
        return `<h${hashes.length} class="BotResponse Header">${text}</h${hashes.length}>`
    })

    codeData = codeData.replace(/\*\*(.*?)\*\*/g, `<strong class="BotResponse Header2">$1</strong>`)
                       .replace(/\*(.*?)\*/g, `<em class="BotResponse Header3">$1</em>`) 


    codeData = codeData.replace(/(?:^|\n)- (.*)/g, (_, item) => {
        return `<li class="BotResponse List">${item}</li>`;
    });
    
    const result = codeData.replace(/_CODEBLOCK_(\d+)_/g, (_, i) => {
        const {lang, code } = codeBlock[i]
        return `<pre class="BotResponse Code"><code class="lang-${lang || 'plaintext'}">${escapeHTML(code)}</code></pre>`

    })

  return result;
}

async function makeSummary(chat) {
    try {
        const res = await fetch(`${API_URL}/BotResponse`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                message: [
                    {
                        role: "system",
                        content: "You are a system that summarizes conversation history. Return a short summary only."
                    },
                    ...chat,
                    {
                        role: "user",
                        content: "Summarize this conversation."
                    }
                ]
            })
        })

        const data = await res.json()
        return data
    } catch (err) {
        logEvent("error", "failed to create chat summary", {error: err.message, at: "line:82" })
    }
}

function ChatData_Save(message, role) {  
    try {
        const token =  localStorage.getItem('userToken');
        if(!token) {
            logEvent("error", "token doesn't exists", {at: "line:85"});
            
        }
        
        fetch(`${API_URL}/auth/StoreChat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                message: [{
                      sender: role,
                      text: message,
                      Timestamp: Date.now()
            }]
        })
        }).then(async res => {
            const data = await res.json()
            return {res, data}
        }        
        ).then(Data => {
            const data = Data.data
            const res = Data.res

            if(!res.ok) {
                logEvent("error", data.error, {route: data.route})
            }
        })

    } catch (err) {
        logEvent("error", "failed to store chatData", {error: err.message, at: "line:84"})
    }
    
}
async function memoryData_save(message, role) {
    try {
        const token = localStorage.getItem('userToken');
        await fetch(`${API_URL}/mem/memorySave`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
            message: [{
                sender: role,
                text: message
            }]
        })
    }).then(async res => {
            const data = await res.json()
            return {res, data}
        }).then(Data => {
            if(!Data.res.ok) {
                logEvent("'error", Data.data.error, {route: Data.data.route})
            }
        })
    } catch(err) { 
        logEvent("error", "failed to store memory", {error: err.message, at: "line:152"})
    }
}
async function summarySave(message) {
    try {
        const token = localStorage.getItem('userToken');
        await fetch(`${API_URL}/mem/summarySave`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            message: [{
                text: message
            }]
        })
    }).then( async res => {
            const data = await res.json()
            return {res, data}
        }).then(Data => {
            if(!Data.res.ok) {
                logEvent("error", Data.data.error, {route: Data.data.route})
            }
        })
    } catch(err) {
        logEvent("error", "failed to store summary", {error: err.message, at: "line:180"})
    }
}

async function ChatData_fetch() {
    try {
        const token =  localStorage.getItem('userToken');
        if(!token) {
            return {status: "none"};
        }
    
        const res = await fetch(`${API_URL}/auth/FetchChat`, {
            method: "POST",
            headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
            },})

        const data = await res.json()

        if(res.status == 401 || res.status == 403) {
            localStorage.removeItem('userToken')
            return {status: false}
        } else if(!res.ok) {
            logEvent("error", data.error, {route: data.route})
            return 0
        }
        return {status: true, data: data.chat}

    } catch (err) {
        logEvent("error", "failed to fetch chatData", {error: err.message, at: "line:141"})
    }
}

async function summaryFetch() {
    try{
        const token = localStorage.getItem('userToken')
        const data = await fetch(`${API_URL}/mem/summaryFetch`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${token}`
            }
        }).then(async res => {
                const data = await res.json()
                return {data, res}
            }).then(Data => {
                if(!Data.res.ok) {
                    logEvent("error", Data.data.error, {route: Data.data.route})
                    return null;
                }

                if(!Data.data.exists) {
                    return false
                }
                return Data.data.message
            })

        return data
    } catch(err) {
        logEvent("error", "failed to fetch summary", {error: err.message, at: "line:234"})
    }
}
async function clearMemory() {
    try {
        const token = localStorage.getItem('userToken')
        await fetch(`${API_URL}/mem/clearMemory`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${token}`
            },
        }).then(async res => {
            const data = await res.json()
            return {res, data}
        }).then(Data => {
            if(!Data.res.ok) {
                logEvent("error", Data.data.error, {route: Data.data.route})
            }
          })
    } catch(err) {
        logEvent("error", "failed to clear memory", {error: err.message,  at: "line:234"})
    }
}

async function memoryFetch() {
    try {
        const token = localStorage.getItem('userToken')
        const res = await fetch(`${API_URL}/mem/memoryFetch`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${token}`
            }})

        const data = await res.json()
        if(!res.ok) {
            logEvent("error", data.error, {route: data.route})
            throw new Error(data.error || "failed to fetch memory")
        }
        const chat = data.chat
        const Memoryformat = chat.map(m => ({
            role: m.sender === "bot" ? "assistant" : "user",
            content: m.text
        }))
        
        if(chat.length > 10) {
            const summary = await makeSummary(Memoryformat)
            
            if(!summary) {
                throw new Error("summary is empty")
            }

            summarySave(summary.message)
            clearMemory()

        }

        const summary = await summaryFetch()

        if(summary) {

            if(summary.length > 10) {
            console.log("hit the limit")
            }

            const Summaryformat = summary.map(m => ({
            role: "system",
            content: m.text
            }))

            const message = [
                ...Summaryformat,
                ...Memoryformat
                ]
            return message
        }

        const message = [
            ...Memoryformat
        ]
        return message
    } catch (err) {
        logEvent("error", "failed to fetch memory", {error: err.message, at: "line:170"})
    }
}

function liveEvent(Event = {}) {
    console.log(Event.message)
}

async function GetData({maxRetries = 3, baseDelay = 4000}) {
    try {
        
        function delay(ms) {
            return new Promise(r => setTimeout(r, ms))
        }

        const message = await memoryFetch()
        for(let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                
                if(attempt > 0) liveEvent({message: `retrying(${attempt})`})

                const res = await fetch(`${API_URL}/BotResponse`, {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({message})
            })

            if(res.status === 429) {
                if(attempt === 0) liveEvent({message: "error: rate limit"})
                    if(attempt > 0) liveEvent({message: "failed"})
                delay(baseDelay)
                continue;
            }
            if(res.status === 500) {
                liveEvent({message: "internal server error"})
                return false
            }
            if(!res.ok) {
                const reply = await res.json()
                liveEvent({message: "something went wrong"})
                return false
            }

            const reply = await res.json()
            return reply

        } catch(err) {
            logEvent("error", err, {at: "line:351"})
            }
            return false
        }
    } catch (err) {
        logEvent("error", "failed to get bot response", {error: err.message, at: "line:209"})
        alert(err.message)
    }
}

async function MessageHandler() {
    const UserMessage = document.createElement('div')
    const BotMessage = document.createElement('div')

    const message = user_input.value;

    ChatData_Save(message, "user")
    await memoryData_save(message, "user")
    
    UserMessage.classList.add('message', 'user')
    UserMessage.textContent = message
    ChatBox.appendChild(UserMessage)
    user_input.value = " ";
    
    BotMessage.classList.add('message', 'bot')
    const bot_message = await GetData(message)
    const ParsedData = Parse(bot_message.message)
    
    ChatData_Save(bot_message.message, "bot")
    memoryData_save(bot_message.message, "bot")

    BotMessage.innerHTML = `${ParsedData}`
    ChatBox.appendChild(BotMessage)
    highlightNewBlocks()
}

// Input Functions

function InputHandler() {
    if(user_input.value.trim() === "") {
        user_input.style.height = "auto"
    } else {
        user_input.style.height = "auto";
        user_input.style.height = user_input.scrollHeight + "px";
    }
}

send_button.addEventListener('click', () => {

    if(user_input.value.trim() === "") return;

    MessageHandler()
    InputHandler()
})
user_input.addEventListener('input', () => {
    InputHandler()
})
user_input.addEventListener('keydown', function(event) {
    if(event.key == "Enter" && !event.shiftKey) {
        event.preventDefault()
        MessageHandler()
        InputHandler()   
    }
})

//User Options
const user_button = document.getElementById('User')
const user_box = document.getElementById('User_options')
const signIn = document.getElementById('SignIn_button')
const signUp = document.getElementById('SignUp_button')

// User functions
const userStatus = false
function user_options_box() { 
    if(user_box.classList.contains('active')) {
        user_box.classList.remove('active')
    } else {
        user_box.classList.add('active')
    }
}
user_button.addEventListener('click', (e) => {
    e.stopPropagation()
    user_options_box()
})

document.addEventListener('click', (event) => {
    if(!user_box.contains(event.target)) {
        user_box.classList.remove('active')
    }
})

signIn.addEventListener('click', () => {
    window.location.href = `/Account.html?mode=signin`;
})
signUp.addEventListener('click', () => {
    window.location.href = `/Account.html?mode=signup`;
})

function logEvent(type, message, meta = {}) {
    fetch(`${API_URL}/log`, {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify({
            type,
            message,
            meta
        })
    })
}

function highlightNewBlocks() {
  document.querySelectorAll('pre code').forEach(block => {
    if (!block.dataset.highlighted) {
      hljs.highlightElement(block);
      block.dataset.highlighted = "true";
    }
  });
}

window.addEventListener("DOMContentLoaded", async () => {
    const ChatHistory = await ChatData_fetch()
    if(!ChatHistory) {
        logEvent("error", "chat data fetch failed", {status: "ChatHistory variable unavailable"})
    }else if(ChatHistory.status == "none") {
        logEvent("error", "token not found", {status: "token isn't stored in localStorage"})
    }
    else if(ChatHistory.status == false) {
        logEvent("error", "token expired", {status: "403"})
    }else if(ChatHistory.status == true) {
        const Data = ChatHistory.data
        for(chat of Data) {
            const userMessage = document.createElement('div')
            const botMessage = document.createElement('div')
            if(chat.sender == "user") {
              userMessage.classList.add('message', 'user')
              userMessage.textContent = chat.text
              ChatBox.appendChild(userMessage)
            } else if(chat.sender == "bot") {
              botMessage.classList.add("message", "bot")
              const botChat = Parse(chat.text)
              botMessage.innerHTML = botChat
              ChatBox.appendChild(botMessage)
              
        }
        }
        hljs.highlightAll();
    }
 
})