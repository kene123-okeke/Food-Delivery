const panel = document.getElementById('sidePanel');
const overlay = document.getElementById('overlay');

document.querySelectorAll('.food-card').forEach(card=>{
  const variants = JSON.parse(card.dataset.variants);
  card.querySelector('.sizes').classList.add('active');
  card.querySelectorAll('.sizes').forEach(chip =>{
    chip.addEventListener('click', ()=>{

      card.querySelectorAll('.sizes').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const data = variants[chip.textContent];

      card.querySelector('.write-up').textContent = data.desc;
      card.querySelector('.food-img img').src = data.img;
      card.querySelector('.price-btn').textContent = '₦'+' '+ data.price.toLocaleString();

      card.dataset.currentType = chip.textContent;
    })
  })
})

document.querySelectorAll('.customize').forEach(btn =>{
  btn.addEventListener('click', () =>{
    const card = btn.closest('.food-card');
    const variants = JSON.parse(card.dataset.variants);
    const currentType = card.dataset.currentType || Object.keys(variants)[0];
    const data = variants[currentType];

    document.getElementById('panelName').textContent = currentType;
    document.getElementById('panelImg').src = data.img;

    const container = document.getElementById('panelAdditions');
    container.innerHTML = '';
    data.additions.forEach(item => {
      container.innerHTML += `
        <div class="add-item">
          <label><input type="checkbox">${item.label}</label>
          <span>+₦${item.price}</span>
        </div>`;
    });

    panel.classList.add('open');
    overlay.classList.add('open');
  })
})

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


