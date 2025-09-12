// Sidebabr functions
const sidebar = document.getElementById('Sidebar');
const overaly = document.getElementById('Overlay');
const main_contet = document.getElementById('Main_content');
const sidebar_button_rotate = Array.from(document.querySelectorAll('.sidebar_open_btn_img'))

//User Input functions
const user_input = document.getElementById('UserInput')
const send_button = document.getElementById('SendButton')
const  ChatBox = document.getElementById('ChatBox')

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
async function GetData(message) {
    const res = await fetch(`http://localhost:3000/test?q=${message}`)
    const reply = await res.json()
    return reply
}

async function MessageHandle() {
    const UserMessage = document.createElement('div')
    const BotMessage = document.createElement('div')

    const message = user_input.value;
    UserMessage.classList.add('message', 'user')
    UserMessage.textContent = message
    ChatBox.appendChild(UserMessage)
    user_input.value = " ";
    
    BotMessage.classList.add('message', 'bot')
    const bot_message = await GetData(message)
    BotMessage.innerHTML = `${bot_message.message}`
    ChatBox.appendChild(BotMessage)
    
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

    MessageHandle()
    InputHandler()
})
user_input.addEventListener('input', () => {
    InputHandler()
})


