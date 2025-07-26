const sidebar = document.getElementById('sidebar')
const sidebar_button = document.getElementById('sidebar_button')
const sidebar_button_mobile = document.getElementById('sidebar_button_mobile')

sidebar_button.addEventListener('click', () => {
    sidebar.classList.add('open')
})
sidebar_button_mobile.addEventListener('click', () => {
    sidebar.classList.add('open')
})