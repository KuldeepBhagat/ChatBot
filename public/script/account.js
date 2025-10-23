

const SignIn_option = document.getElementById('SignIn_option')
const SignUp_option = document.getElementById('SignUp_option')
const slider_block = document.getElementById('Slider_block')
const signIn = document.getElementById('SignIn_form')
const signUp = document.getElementById('SignUp_form')

const params = new URLSearchParams(location.search)
const mode = params.get('mode')

if (mode == 'signin') {
    signIn.style.display = "flex"
}
else if (mode == 'signup') {
    signUp.style.display = "flex"
    slider_block.style.transform = "translateX(80px)"
    slider_block.style.width = "150px"

}

SignIn_option.addEventListener('click', () => {
    slider_block.style.transform = "translateX(0px)"
    slider_block.style.width = "60px"

    signIn.style.display = "flex"
    signUp.style.display = "none"
})
SignUp_option.addEventListener('click', () => {
    slider_block.style.transform = "translateX(80px)"
    slider_block.style.width = "150px"
    
    signIn.style.display = "none"
    signUp.style.display = "flex"
})


function FormRouteHandle() {
    const API_URL = window.location.origin
    signIn.action = API_URL + "/SignIn"
    signUp.action = API_URL + "/SignUp"
}
FormRouteHandle()