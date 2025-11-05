

const SignIn_option = document.getElementById('SignIn_option')
const SignUp_option = document.getElementById('SignUp_option')
const slider_block = document.getElementById('Slider_block')
const signIn = document.getElementById('SignIn_form')
const signUp = document.getElementById('SignUp_form')
const AlertMessage = document.getElementById('Notification')

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


function RequestHandle(res, data) {

    if(AlertMessage.classList.contains('active')) {
        AlertMessage.classList.remove('active')
    } else if(!res.ok) {
            AlertMessage.innerHTML = data.error
            AlertMessage.classList.add('active')
        } else {
            AlertMessage.innerHTML = data.message
            AlertMessage.classList.add('active')
            localStorage.setItem("userToken", data.token)
            console.log(data.token)
            window.location.href = "/index.html"
        }
}
const API_URL = window.location.origin

signUp.addEventListener('submit', async (e) => {
    e.preventDefault()
    const form = e.target
    const data = new FormData(form)
    const body = Object.fromEntries(data.entries())
    
    try {
        fetch(`${API_URL}/SignUp`, {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(body)
    }).then(async (res) => {
        const data = await res.json()
        RequestHandle(res, data)
    })
    } 
    catch (err) {
        console.error(err)
    }
})

signIn.addEventListener('submit', async (e) => {
    e.preventDefault()
    const form = e.target
    const data = new FormData(form)
    const body = Object.fromEntries(data.entries())

    if(AlertMessage.classList.contains('active')) {
        AlertMessage.classList.remove('active')
    }

    try {
        fetch(`${API_URL}/SignIn`, {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify(body)
        }).then(async (res) => {
            const data = await res.json()
            RequestHandle(res, data)
        })
    } catch (err) {
        console.error(err)
    }
})
