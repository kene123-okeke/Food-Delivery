const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', ()=>{
    if (window.scrollY > 400){
        backToTop.style.display = 'flex';
    } else{
        backToTop.style.display = 'none';
    }
});
backToTop.addEventListener('click',()=>{
    window.scrollTo({ top:0, behavior: 'smooth'});
});