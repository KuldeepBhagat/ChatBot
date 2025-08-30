const sidebar = document.getElementById('Sidebar');
const sidebar_button = document.getElementById('Sidebar_button');
const sidebar_button_mobile = document.getElementById('Sidebar_button_mobile');
const overaly = document.getElementById('Overlay');
const main_contet = document.getElementById('Main_content');

function Sidebar_functions() {
    if(sidebar.classList.contains('open')) 
    {
        sidebar.classList.remove('open')
        overaly.classList.remove('active')
        main_contet.classList.remove('sidebar_active')
    } else {
       sidebar.classList.add('open')
       overaly.classList.add('active')
       main_contet.classList.add('sidebar_active')
    }
}
sidebar_button.addEventListener('click', () => Sidebar_functions());
overaly.addEventListener('click', () => Sidebar_functions());