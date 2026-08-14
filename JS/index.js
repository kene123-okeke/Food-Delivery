const logoutButton = document.querySelectorAll('.login-btn');
const logoutBox = document.getElementById('logout-box');
const cancel = document.querySelectorAll('.cancel-btn');
const overLay = document.getElementById('overlay');
const overlayPanel = document.querySelectorAll('.overlay')

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