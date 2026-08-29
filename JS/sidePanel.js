const panel = document.getElementById('sidePanel');
const overlay = document.getElementById('overlay');
const cartBtn = document.getElementById('cart-btn');
const shopBtn = document.getElementById('shop-cart');

let cart = [];

document.querySelectorAll('.food-card').forEach(card=>{
  const variants = JSON.parse(card.dataset.variants);
  const pricesContainer = card.querySelector('.prices');

  function renderPrices(priceList) {
  pricesContainer.innerHTML = ''; // clear whatever was there before

  priceList.forEach((item) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'price-btn';
    btn.textContent = '₦' + item.price.toLocaleString();

    btn.addEventListener('click', () => {
      pricesContainer.querySelectorAll('.price-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      card.dataset.selectedPrice = item.price;
      card.querySelector('.write-up').textContent = item.desc;
    });

    pricesContainer.appendChild(btn);
  });

  // auto-select the first one by default
  pricesContainer.querySelector('.price-btn').classList.add('selected');
  card.dataset.selectedPrice = priceList[0].price;
  card.querySelector('.write-up').textContent = priceList[0].desc;
}

  
  card.querySelector('.sizes').classList.add('active');

  const firstSize = Object.keys(variants)[0];
  renderPrices(variants[firstSize].prices);

  card.querySelectorAll('.sizes').forEach(chip =>{
    chip.addEventListener('click', ()=>{

      card.querySelectorAll('.sizes').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const data = variants[chip.textContent];
      card.querySelector('.food-img img').src = data.img;
    
      renderPrices(data.prices);

      card.dataset.currentType = chip.textContent;
    })
  })
})

let currentBasePrice = 0;

document.getElementById('panelAdditions').addEventListener('change', (e) => {
  if (e.target.matches('input[type="checkbox"]')){
    updateSubtotal(currentBasePrice);
  }
})

document.querySelectorAll('.customize').forEach(btn =>{
  btn.addEventListener('click', () =>{
    const card = btn.closest('.food-card');
    const variants = JSON.parse(card.dataset.variants);
    const currentType = card.dataset.currentType || Object.keys(variants)[0];
    const data = variants[currentType];
    const basePrice = Number(card.dataset.selectedPrice);

    currentBasePrice = Number(card.dataset.selectedPrice);

    document.getElementById('panelName').textContent = currentType;
    document.getElementById('panelImg').src = data.img;
  
    const container = document.getElementById('panelAdditions');
    container.innerHTML = '';
    data.additions.forEach(item => {
      container.innerHTML += `
        <div class="add-item">
          <label><input type="checkbox" data-price="${item.price}">${item.label}</label>
          <span>+₦${item.price}</span>
        </div>`;
    });

    
    updateSubtotal(currentBasePrice);

    panel.classList.add('open');
    overlay.classList.add('open');


    const confirmBtn = document.getElementById('confirmAddBtn');
    confirmBtn.onclick = () => {
      const checkedBoxes = container.querySelectorAll('input[type="checkbox"]:checked');
      const chosenAdditions = Array.from(checkedBoxes).map(box => ({
        label: box.closest('.add-item').querySelector('label').textContent.trim(),
        price: Number(box.dataset.price)
      }));

      addToCart(currentType, card.querySelector('h2, h3')?.textContent || currentType, basePrice, chosenAdditions);

      closePanel()
      cartBtn.classList.add('open');
      overlay.classList.add('open');
    };
  })
})

function updateSubtotal(basePrice){
  const container = document.getElementById('panelAdditions');
  const checkedBoxes = container.querySelectorAll('input[type="checkbox"]:checked');
  let total = basePrice;
  checkedBoxes.forEach(box => total += Number(box.dataset.price));
  document.getElementById('panelTotal').textContent = 'N' + total.toLocaleString();
}

function addToCart(name, type, basePrice, additions){
  const item = {
    name: name,
    type:type,
    basePrice:basePrice,
    additions:additions,
    total:basePrice + additions.reduce((sum, a) => sum + a.price, 0)
  };

  cart.push(item);
  renderCart();
}

function renderCart(){
  const cartItemsE1 = document.getElementById('cartItems');
  cartItemsE1.innerHTML = '';

  let grandTotal = 0;

  cart.forEach((item, index) => {
    grandTotal += item.total;

    const additionsText = item.additions.length > 0
    ? item.additions.map(a => a.label).join(',')
    : 'No extras';

    cartItemsE1.innerHTML += `
    <div class="cart-items-container">
      <div class="cart-item">
        <div class="cart-item-info">
          <strong> ${item.name} (${item.type})</strong>
          <span class="cart-item-additins">${additionsText}</span>
        </div>
        <div class="cart-item-price">₦${item.total.toLocaleString()}</div>
        <button class="cart-remove-btn" title="Remove" data-index="${index}">✕</button>
      </div>;
    </div>`;
  });

  document.getElementById('cartTotal').textContent = 'N' + grandTotal.toLocaleString();
}


document.getElementById('cartItems').addEventListener('click', (e) => {
  if (e.target.matches('.cart-remove-btn')){
    const index = Number(e.target.dataset.index);
    cart.splice(index, 1);
    renderCart();
  }
});

// Close when clicking the X or the dark overlay
document.getElementById('closePanel').addEventListener('click', closePanel);
overlay.addEventListener('click', closePanel);

function closePanel() {
  panel.classList.remove('open');
  overlay.classList.remove('open');
}

const switchMethod = document.querySelectorAll('.del-types');
const deliveryGroup = document.getElementById('deliverygroup');
const reserveGroup = document.getElementById('reservationgroup');

document.querySelectorAll('.cart').forEach(btn => {
  btn.addEventListener('click', () => {
    cartBtn.classList.add('open');
    overlay.classList.add('open');

    switchMethod.forEach(btn =>{
    btn.addEventListener('click', () => {
        switchMethod.forEach(b => b.classList.remove('current'));

        btn.classList.add('current');

        if(btn.dataset.target === 'delivery'){
            deliveryGroup.style.display = "block";
            reserveGroup.style.display ="none";
        }
        else{
            deliveryGroup.style.display = "none";
            reserveGroup.style.display = "block";
        }
     });
    });
  })
})

function closeCartPanel(){
  cartBtn.classList.remove('open');
  overlay.classList.remove('open');
}
document.getElementById('closecart').addEventListener('click', closeCartPanel);
overlay.addEventListener('click', closeCartPanel);

const  menuList = document.querySelectorAll('.menu-list');

menuList.forEach(btn => {
  btn.addEventListener('click', () => {
    menuList.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');

    const target = document.getElementById(btn.dataset.target);
    if (target){
      target.scrollIntoView({behavior:'smooth'});
    }
  })

})

const sections = document.querySelectorAll('.food-card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const matchingBtn = document.querySelector(`.menu-list[data-target="${entry.target.id}"]`);
      if (matchingBtn){
        menuList.forEach(b => b.classList.remove('selected'));
        matchingBtn.classList.add('selected');
      }
    }
  });
}, {threshold: 0.5});
sections.forEach(section => observer.observe(section));