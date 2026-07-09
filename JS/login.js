const switchButton = document.querySelectorAll('.switch-btn');
const logIn = document.getElementById('login');
const signUp = document.getElementById('signup');
const heading = document.getElementById('heading');
const subHeading = document.getElementById('subheading');
const passWordShow = document.querySelectorAll('.eye-btn')

switchButton.forEach(btn =>{
    btn.addEventListener('click', () => {
        switchButton.forEach(b => b.classList.remove('active'));

        btn.classList.add('active');

        if(btn.dataset.target === 'login'){
            logIn.style.display = "block";
            signUp.style.display ="none";
            heading.textContent = "Welcome Back";
            subHeading.textContent = "Sign into your Account";
        }
        else{
            logIn.style.display = "none";
            signUp.style.display = "block";
            heading.textContent = "Create your Account";
            subHeading.textContent = "Join Vivit's Treats & Chops Today";
        }


    });
});

passWordShow.forEach(btn => {
    btn.addEventListener('click', () => {

        const passwordInput = btn.closest('.password-entry').querySelector('input');
        const icon = btn.querySelector('i');

        const ishidden = passwordInput.type === 'password';
        passwordInput.type = ishidden ? 'text':'password';

        icon.classList.toggle('fa-eye', !ishidden);
        icon.classList.toggle('fa-eye-slash', ishidden);
    })
})