document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemE1 = document.getElementById('checkoutItems');
    const reserve = document.querySelectorAll('.reserve');
    const delivery = document.querySelectorAll('.deliver');
    let reserveFee = 300;
    let deliveryFee = 400;
    let currentFee = deliveryFee;

    function renderCheckout(feeLabel, fee){
        if (cart.length === 0){
            itemE1.innerHTML = '<p> Your cart is empty.<p>';
            document.getElementById('checkoutTotal').textContent = 'N0';
            return
        } 
        
        let html = ' ';
        let grandTotal = 0;

        cart.forEach(item => {
            grandTotal += item.total;

            const extras = item.additions.length >0
                ? item.additions.map(a => a.label).join(',')
                : 'No extras';
            html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <strong>${item.name} (${item.type})</strong>
                    <span class="cart-item-additins">${extras}</span>
                </div>
                <div class="cart-item-price">₦${item.total.toLocaleString()}</div>
            </div>`;
        });
        html += `
        <div class="cart-item"><strong>${feeLabel}</strong><span>₦ ${fee}</span></div>`

        itemE1.innerHTML = html;
        grandTotal += currentFee
        document.getElementById('checkoutTotal').textContent = '₦' + grandTotal.toLocaleString();
    }
    
    function setMode(mode){
        const isDelivery = mode === 'delivery';
        currentFee = isDelivery ? deliveryFee : reserveFee;

        delivery.forEach(b => b.classList.toggle('current', isDelivery));
        reserve.forEach(b => b.classList.toggle('current', !isDelivery));
        document.getElementById('reserve').style.display = isDelivery ? 'none' : 'block';
        document.getElementById('reserved').classList.toggle('current', !isDelivery)
        document.getElementById('deliver').style.display = isDelivery ? 'block' : 'none';
        document.getElementById('delivered').classList.toggle('current', isDelivery)

        renderCheckout(isDelivery ? 'Delivery Fee' : 'Reservation Fee', currentFee)

        
    }

    delivery.forEach(btn => btn.addEventListener('click', (b) => setMode('delivery')));
    reserve.forEach(btn => btn.addEventListener('click', () => setMode('reservation')));

    setMode('reservation');

    
});