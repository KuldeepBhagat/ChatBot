const login_option_button = document.getElementById('Login_option_button')
const create_acc_option_button = document.getElementById('Create_acc_option_button')
const slider_block = document.getElementById('Slider_block')
const login_form = document.getElementById('SignIn_form')
const account_form = document.getElementById('SignUp_form')

create_acc_option_button.addEventListener('click', () => {
    slider_block.style.transform = "translateX(100px)"
    slider_block.style.width = "140px"
    
    login_form.style.display = "none"
    account_form.style.display = "flex"
})
login_option_button.addEventListener('click', () => {
    slider_block.style.transform = "translateX(0px)"
    slider_block.style.width = "60px"

    login_form.style.display = "flex"
    account_form.style.display = "none"
})

function FormRouteHandle() {
    const API_URL = window.location.hostname === "127.0.0.1" 
                    ? "http://localhost:3000"
                    : "https://chatbot-xmr2.onrender.com"
    login_form.action = API_URL + "/SignIn"
    account_form.action = API_URL + "/SignUp"
}
FormRouteHandle()