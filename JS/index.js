const logoutButton = document.querySelectorAll('.login-btn');
const logoutBox = document.getElementById('logout-box');
const cancel = document.querySelectorAll('.cancel-btn');
const overLay = document.getElementById('overlay');
const overlayPanel = document.querySelectorAll('.overlay');
const searchBar = document.getElementById('search-bar-box');
const searchIcon = document.querySelectorAll('.search-icon');

function closeBox(){
    logoutBox.style.display = "none";
    overLay.style.display = "none";
}
logoutButton.forEach(btn => {
    btn.addEventListener('click', () =>{
        logoutBox.style.display = "block";
        overLay.style.display = "flex";

        cancel.forEach(b => {
            b.addEventListener('click', () => {
                logoutBox.style.display = "none";
                overLay.style.display = "none";
            });
        });

        overlayPanel.forEach(b => {
            b.addEventListener('click', closeBox)
        });
    });
});

searchIcon.forEach(icon => {
    icon.addEventListener('click', () => { 
        document.querySelector('.second-search').style.display = "flex";
        overLay.style.display = "flex";

        overlayPanel.forEach(panel => {
            panel.addEventListener('click', () => {
                document.querySelector('.second-search').style.display = "none";
                overLay.style.display = "none";
            });
        })
    });
});