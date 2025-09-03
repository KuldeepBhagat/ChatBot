const sidebar = document.getElementById('Sidebar');
const overaly = document.getElementById('Overlay');
const main_contet = document.getElementById('Main_content');
const sidebar_button_rotate = Array.from(document.querySelectorAll('.sidebar_open_btn_img'))

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