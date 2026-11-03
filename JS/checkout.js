document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemE1 = document.getElementById('checkoutItems');
    const reserve = document.querySelectorAll('.reserve');
    const delivery = document.querySelectorAll('.deliver');
    let reserveFee = 300;
    let deliveryFee = 400;
    let currentFee = deliveryFee;
    let currentMode = 'reservation';

    function renderCheckout(feeLabel, fee){
        if (cart.length === 0){
            itemE1.innerHTML = '<p> Your cart is empty.</p>';
            document.getElementById('checkoutTotal').textContent = '₦0';
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
        currentMode = mode;
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

    const WHATSAPP_NUMBER = '+2348037856431';   // vendor number: 08012345678 becomes 2348012345678

    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const orderError = document.getElementById('orderError');

    placeOrderBtn.addEventListener('click', () => {
        orderError.textContent = '';

        if (cart.length === 0){
            orderError.textContent = 'Your cart is empty. Add something from the menu first.';
            return;
        }

        const isDelivery = currentMode === 'delivery';
        let details;

        if (isDelivery){
            const name = document.querySelector('.name-field').value.trim();
            const phone = document.querySelector('.number-field').value.trim();
            const address = document.querySelector('.location-field').value.trim();
            const note = document.querySelector('.note-field').value.trim();

            if (!name || !phone || !address){
                orderError.textContent = 'Please fill in your name, phone number and address.';
                return;
            }
            if (!/^0\d{10}$/.test(phone)){
                orderError.textContent = 'Enter a valid 11-digit phone number.';
                return;
            }
            details = `*Method:* Delivery\n*Name:* ${name}\n*Phone:* ${phone}\n*Address:* ${address}`;
            if (note) details += `\n*Note:* ${note}`;
        } else {
            const fullName = document.querySelector('.fullname-field').value.trim()
            const time = document.querySelector('input.time').value;
            const note = document.querySelector('textarea.note').value.trim();
    
            if (!fullName){
                orderError.textContent = 'Please enter your fullname for identification.';
                return;
            }
            if (!time){
                orderError.textContent = 'Please choose your expected pick-up time.';
                return;
            }
            details = `*Method:* Reservation\n*Fullname:* ${fullName}\n*Pick-up time:* ${time}`;
            if (note) details += `\n*Note:* ${note}`;
        }

        let itemsText = '';
        let subtotal = 0;
        cart.forEach((item, i) => {
            subtotal += item.total;
            const extras = item.additions.length > 0
                ? item.additions.map(a => a.label).join(', ')
                : 'No extras';
            itemsText += `${i + 1}. ${item.name} (${item.type}) - ₦${item.total.toLocaleString()}\n   ${extras}\n`;
        });

        const orderId = 'VT' + Date.now().toString().slice(-6);
        const total = subtotal + currentFee;
    const message = [
    `*New order ${orderId}*`,
    '',
    '*Items*',
    itemsText.trimEnd(),
    '',
    `${isDelivery ? 'Delivery fee' : 'Reservation fee'}: ₦${currentFee}`,
    `*Total: ₦${total.toLocaleString()}*`,
    '',
    details,
    '',
    'I will pay by bank transfer and send my receipt here.'
    ].join('\n');

        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');

        localStorage.removeItem('cart');
        cart.length = 0;
        setMode(currentMode); // redraws the list as empty
        placeOrderBtn.disabled = true;
        
        document.getElementById('confirmOrderId').textContent = orderId;
        document.getElementById('confirmTotal').textContent = '₦' + total.toLocaleString();
        document.getElementById('confirmWhatsApp').href = url;
        document.getElementById('confirmOverlay').classList.add('show');
        document.getElementById('confirmWhatsApp').focus();
            });
            
            const confirmOverlay = document.getElementById('confirmOverlay');
confirmOverlay.addEventListener('click', (e) => {
    if (e.target === confirmOverlay) confirmOverlay.classList.remove('show');
});
    setMode('reservation');

    
});