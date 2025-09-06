// Sidebabr functions
const sidebar = document.getElementById('Sidebar');
const overaly = document.getElementById('Overlay');
const main_contet = document.getElementById('Main_content');
const sidebar_button_rotate = Array.from(document.querySelectorAll('.sidebar_open_btn_img'))

//User Input functions
const user_input = document.getElementById('UserInput')
const send_button = document.getElementById('SendButton')

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

user_input.addEventListener('input', () => {
    user_input.style.height = "auto";
    user_input.style.height = user_input.scrollHeight + "px";
})


function GetData(message) {
    fetch(`http://localhost:3000/test?q=${message}`)
    .then(res => res.json())
    .then(reply => console.log(reply))
}

send_button.addEventListener('click', () => {
    const message = user_input.value;
    GetData(message)
    user_input.value = " ";
})