const panel = document.getElementById('sidePanel');
const overlay = document.getElementById('overlay');


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
  })
})

function updateSubtotal(basePrice){
  const container = document.getElementById('panelAdditions');
  const checkedBoxes = container.querySelectorAll('input[type="checkbox"]:checked');
  let total = basePrice;
  checkedBoxes.forEach(box => total += Number(box.dataset.price));
  document.getElementById('panelTotal').textContent = 'N' + total.toLocaleString();
}

// Close when clicking the X or the dark overlay
document.getElementById('closePanel').addEventListener('click', closePanel);
overlay.addEventListener('click', closePanel);

function closePanel() {
  panel.classList.remove('open');
  overlay.classList.remove('open');
}



// const editButtons = document.querySelectorAll('.customize');


// editButtons.forEach(btn => {
//   btn.addEventListener('click', () => {
//     // Read the data-* attributes off the button that was clicked
//     const name = btn.dataset.name;
//     const img = btn.dataset.img;
//     const price = btn.dataset.price;

//     // Push that info into the panel's content
//     document.getElementById('panelName').textContent = currentType;
//     document.getElementById('panelImg').src = data.img;

//     // const additions = JSON.parse(btn.dataset.additions);
//     const container = document.getElementById('panelAdditions');
//     container.innerHTML = ''; // clear old items first

//     additions.forEach(item => {
//       container.innerHTML += `
//         <div class="add-item">
//             <label><input type="checkbox"> ${item.label}</label>
//             <span>+₦${item.price}</span>
//         </div>
//       `;
//     });

//     // Open the panel
//     panel.classList.add('open');
//     overlay.classList.add('open');
//   });
// });


