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

function showError(inputE1, errorE1, message){
    inputE1.classList.add('invalid');
    inputE1.classList.remove('valid');
    errorE1.querySelector('.error-text').textContent = message;
    errorE1.classList.add('show');
}
function clearError(inputE1, errorE1){
    inputE1.classList.remove('invalid');
    errorE1.textContent = "";
    errorE1.classList.remove('show');
}

const emailInput = document.getElementById('email');
const emailError = document.getElementById('emailError');

emailInput.addEventListener('input', () => {
    const value = emailInput.value.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if(value.length === 0){
        clearError(emailInput, emailError);
    }else if(!isValid){
        showError(emailInput, emailError, 'Enter a Valid Email Address');
    }else {
        clearError(emailInput, emailError);
        emailInput.classList.add('valid');
    }
});

const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const enteredEmail = loginForm.querySelector('input[type="email"]').value.trim();
    const enteredPassword = loginForm.querySelector('input[type="password"]').value;


    const correctEmail = "test@vivits.com";
    const correctpassword = "password123";

    if (enteredEmail === correctEmail && enteredPassword === correctpassword){
        loginError.classList.remove('show');
        window.location.href = loginForm.action;

    }else{
        loginError.classList.add('show');
    }
})