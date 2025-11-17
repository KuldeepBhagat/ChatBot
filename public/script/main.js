// Sidebabr functions

const sidebar = document.getElementById('Sidebar');
const overaly = document.getElementById('Overlay');
const main_contet = document.getElementById('Main_content');
const sidebar_button_rotate = Array.from(document.querySelectorAll('.sidebar_open_btn_img'))
const sessionFade = document.getElementById('userSsession_parent')
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
        sessionFade.classList.remove('active')
        main_contet.classList.remove('sidebar_active')
        sidebar_button_rotate.forEach(btn => {
            btn.classList.remove('rotate')
        }) 
        

    } else {

       sidebar.classList.add('open')
       overaly.classList.add('active')
       sessionFade.classList.add('active')
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
        const sessionID = getSessionString("active");

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
            }],
            sessionID
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
        const sessionID = getSessionString('active')
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
            }],
            sessionID
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
        const sessionID = getSessionString('active')
        await fetch(`${API_URL}/mem/summarySave`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            message: [{
                text: message
            }],
            sessionID
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

async function makeSession() {
    try {
        const token = localStorage.getItem('userToken')
        await fetch(`${API_URL}/ses/newSession`, {
            method: "POST",
            headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
            }
        }).then(async res => {
            const data = await res.json();
            return {data, res}
        }).then(Data => {
            if(!Data.res.ok) {
                logEvent("error", Data.data.error, {route: Data.data.route})
            }
        })
    } catch(err) {
        logEvent("error", "failed to make session", {error: err, at: "line:211"})
    }
} 

async function sessionFetch() {
    try {
        const token = localStorage.getItem('userToken')
        const res = await fetch(`${API_URL}/ses/fetchSession`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${token}`
            }
        })

        const data = await res.json()
        if(!res.ok) {
            logEvent("error", data.error, {route: data.route})
        }
        
        return data
        
    } catch(err) {
        logEvent("error", "failed to fetch session", {error: err.message, at: "line:208"})
    }
}

async function ChatData_fetch() {
    try {
        const token =  localStorage.getItem('userToken');
        const sessionID = getSessionString('active')
        if(!token) {
            return {status: "none"};
        }

        const res = await fetch(`${API_URL}/auth/FetchChat`, {
            method: "POST",
            headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({sessionID})
        })

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
        const sessionID = getSessionString('active')
        const data = await fetch(`${API_URL}/mem/summaryFetch`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({sessionID})
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
        const sessionID = getSessionString('active')

        await fetch(`${API_URL}/mem/clearMemory`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({sessionID})
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
        const sessionID = getSessionString('active')

        const res = await fetch(`${API_URL}/mem/memoryFetch`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({sessionID})
        })

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

async function FetchUserData() {
    try {
        const token = localStorage.getItem('userToken')
        
        const res = await fetch(`${API_URL}/data/userData`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${token}`
            }
        })

        const data = await res.json()
        if(!res.ok) {
            logEvent("error", data.error, {route: data.route})
            return false
        }

        return data
    } catch(err) {
        logEvent("error", "failed to get FetchUserData", {error: err, at: "line:402"})
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
const user_account_logo = document.getElementById('User')
const user_box = document.getElementById('User_options')
const signIn = document.getElementById('SignIn_button')
const signUp = document.getElementById('SignUp_button')
const userOverlay = document.getElementById('User_options_overlay')
const profile_container = document.getElementById('Profile')

// User functions
function user_options_box({status, data}) { 
    
    if(status) {
        const Data = data
        for(chat of Data) {
            const userMessage = document.createElement('div')
            const botMessage = document.createElement('div')
            if(chat.sender === "user") {
              userMessage.classList.add('message', 'user')
              userMessage.textContent = chat.text
              ChatBox.appendChild(userMessage)
            } else if(chat.sender === "bot") {
              botMessage.classList.add("message", "bot")
              const botChat = Parse(chat.text)
              botMessage.innerHTML = botChat
              ChatBox.appendChild(botMessage)
              
            }
        }
        hljs.highlightAll();        
    }else if(!status) {
        console.log("enterd false", status)
        user_box.classList.add('active')
        userOverlay.classList.add('active')
    }
}

signIn.addEventListener('click', () => {
    window.location.href = `/Account.html?mode=signin`;
})
signUp.addEventListener('click', () => {
    window.location.href = `/Account.html?mode=signup`;
})
user_account_logo.addEventListener('click', (e) => {
    e.stopPropagation()
    profile_container.classList.toggle('show')
})
document.addEventListener('click', (e) => {
    if(!profile_container.contains(e.target)) {
        profile_container.classList.remove('show')
    }
})

function setupProfile(userData) {
    const {firstName, lastName, email} = userData
    const logo = firstName.charAt(0).toUpperCase()

    const logo_container = document.createElement('div')
    logo_container.classList.add('profile_picture')
    logo_container.innerHTML = `<h1>${logo}</h1>`

    const mail_container = document.createElement('div')
    mail_container.classList.add('user_mail')
    mail_container.innerHTML = `<h5>${email}</h5>`

    const logout_container = document.createElement('div')
    logout_container.classList.add('log_out')
    logout_container.innerHTML = `<h2>Hello, ${firstName}!</h2>`

    const button = document.createElement('button')
    button.classList.add('logout_button')
    button.innerHTML = `<img 
                src="https://img.icons8.com/?size=100&id=vcvBMGD6n6ZL&format=png&color=000000"
                alt="logout">
                Logout`
    button.addEventListener('click', () => {
        localStorage.removeItem('userToken')
        localStorage.removeItem('userSession')
        location.reload()
    })

    logout_container.appendChild(button)

    profile_container.append(logo_container, mail_container, logout_container)
}


// Session functions
const sessionContainer = document.getElementById('UserSession')
const newSessionButton = document.getElementById('NewSessionButton')

function sessionContainerFill() {
    const session = getSessionString(('sessions'))
    const active = getSessionString('active')
    session.forEach((value, index) => {
        
        const div = document.createElement('div')
        div.classList.add('session_options_container')

        const opt_button = document.createElement('button')
        opt_button.classList.add('session_buttons_options')
        opt_button.textContent = "⋮"

        const session_opt_window = document.createElement('div')
        session_opt_window.classList.add('session_buttons_options_window', 'hidden')

        const dlt_button = document.createElement('button')
        dlt_button.innerHTML = `<img src="https://img.icons8.com/?size=100&id=102350&format=png&color=000000"
                                    alt="delete">
                                    Delete`

        session_opt_window.appendChild(dlt_button)

        const button = document.createElement('button')
        button.textContent = `session ${index + 1}`
        button.dataset.id = value
        button.classList.add('session_buttons')
        if(value === active) {
            button.classList.add('active')
        }

        button.addEventListener('click', async () => {
            await switchSession(button.dataset.id)
            location.reload()
        })

        opt_button.addEventListener('click', (e) => {

            e.stopPropagation()

            document.querySelectorAll('.session_buttons_options_window').forEach((c) => {
                if(!c.classList.contains('hidden')) c.classList.add('hidden') 
            })

            session_opt_window.classList.toggle('hidden')
        })

        dlt_button.addEventListener('click', async () => {
            await deleteSession(value)
            location.reload()
        })

        div.appendChild(button)
        div.appendChild(opt_button)
        div.appendChild(session_opt_window)
        sessionContainer.appendChild(div)

    })
}

document.addEventListener('click', (e) => {
    document.querySelectorAll('.session_buttons_options_window').forEach((c) => {
                c.classList.add('hidden') 
            })
    
})

async function switchSession(id) {
    try {
        const token = localStorage.getItem(('userToken'))
        await fetch(`${API_URL}/ses/switchSession`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({id})
        }).then(async res => {
            const data = res.json()
            return {data, res}
        }).then(Data => {
            if(!Data.res.ok) {
                logEvent("error", Data.data.error, {route: Data.data.route})
                return false
            }
        })
    } catch(err) {
        logEvent("error", "failed to switch session", {error: err, at: "line:605"})
    }
}

async function deleteSession(id) {
    try {
        const token = localStorage.getItem('userToken')

        await fetch(`${API_URL}/ses/DeleteSession`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({id})
        }).then(async res => {
            const data = res.json()
            return {data, res}
        }).then(Data => {
            if(!Data.res.ok) {
                logEvent("error", Data.data.error, {route: Data.data.route})
                return false
            }
        })

        await fetch(`${API_URL}/auth/DeleteChat`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({sessionID: id})
        }).then(async res => {
            const data = res.json()
            return {data, res}
        }).then(Data => {
            if(!Data.res.ok) {
                logEvent("error", Data.data.error, {route: Data.data.route})
                return false
            }
        })

        await fetch(`${API_URL}/mem/DeleteMemory`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({sessionID: id})
        }).then(async res => {
            const data = res.json()
            return {data, res}
        }).then(Data => {
            if(!Data.res.ok) {
                logEvent("error", Data.data.error, {route: Data.data.route})
                return false
            }
        })

    } catch(err) {
        logEvent("error", "failed to delete session", {error: err, at: "line:672"})
    }
}

function getSessionString(field) {
    try {
        const sessionString = localStorage.getItem('userSession')
        const sessionData = JSON.parse(sessionString)
        return sessionData[field]
    } catch(err) {
        logEvent("error", "no session found", {at: "line:582"})
    }
}

newSessionButton.addEventListener('click', async () => {
    await makeSession()
    const session = await sessionFetch()
    localStorage.setItem('userSession', JSON.stringify(session))
    location.reload()
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
    const token = localStorage.getItem('userToken')
    if(token) {
        const session = await sessionFetch()
        localStorage.setItem("userSession", JSON.stringify(session))
        sessionContainerFill()

        const userData = await FetchUserData()
        setupProfile(userData)
    }
    const ChatHistory = await ChatData_fetch()
    if(!ChatHistory) {
        logEvent("error", "chat data fetch failed", {status: "ChatHistory variable unavailable"})
    }else if(ChatHistory.status === "none" || ChatHistory.status === false) {
        user_options_box({status: false, data: []})
    }else if(ChatHistory.status === true) {
        user_options_box({status: true, data: ChatHistory.data})
    }
})