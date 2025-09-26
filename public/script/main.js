// Sidebabr functions

const sidebar = document.getElementById('Sidebar');
const overaly = document.getElementById('Overlay');
const main_contet = document.getElementById('Main_content');
const sidebar_button_rotate = Array.from(document.querySelectorAll('.sidebar_open_btn_img'))

//User Input functions
const user_input = document.getElementById('UserInput')
const send_button = document.getElementById('SendButton')
const ChatBox = document.getElementById('ChatBox')

//User Options
const user_button = document.getElementById('User')
const user_box = document.getElementById('User_options')

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
        return `<pre class="BotResponse Code"><code class="lang-${lang || 'plain'}">${escapeHTML(code)}</code></pre>`

    })

  return result;
}

async function GetData(message) {
    const API_URL = window.location.hostname === "127.0.0.1" 
                    ? "http://localhost:3000"
                    : "https://chatbot-xmr2.onrender.com"
                
    if(window.location.hostname === "127.0.0.1") {
        console.log("localhost")
    } else {
        console.log("server")
    }
    const res = await fetch(`${API_URL}/test?q=${message}`)
    const reply = await res.json()
    return reply
}

async function MessageHandler() {
    const UserMessage = document.createElement('div')
    const BotMessage = document.createElement('div')

    const message = user_input.value;
    UserMessage.classList.add('message', 'user')
    UserMessage.textContent = message
    ChatBox.appendChild(UserMessage)
    user_input.value = " ";
    
    BotMessage.classList.add('message', 'bot')
    const bot_message = await GetData(message)
    const ParsedData = Parse(bot_message.message)
    BotMessage.innerHTML = `${ParsedData}`
    console.log(BotMessage)
    ChatBox.appendChild(BotMessage)
    hljs.highlightAll();
    
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

// User functions

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


