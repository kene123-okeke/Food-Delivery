const cart = JSON.parse(localStorage.getItem('cart')) || [];
const itemE1 = document.getElementById('checkoutItems');

if (cart.length === 0){
    itemE1.innerHTML = '<p> Your cart is empty.<p>';
} else{
    let grandTotal = 0;

    cart.forEach(item => {
        grandTotal += item.total;

        const extras = item.additions.length >0
            ? item.additions.map(a => a.label).join(',')
            : 'No extras';
        itemE1.innerHTML += `
        <div class="cart-item">
            <div class="cart-item-info">
                <strong>${item.name} (${item.type})</strong>
                <span class="cart-item-additins">${extras}</span>
            </div>
            <div class="cart-item-price">N${item.total.toLocaleString()}</div>
        </div>`;
    });
    document.getElementById('checkoutTotal').textContent = 'N' + grandTotal.toLocaleString();
}