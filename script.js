document.addEventListener('DOMContentLoaded', () => {
    // Show the loader while fetching data
    const loader = document.getElementById('loader');
    loader.style.display = 'flex';  // Show loader

    // Fetch data from the API
    fetch('https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889')
        .then(response => response.json())
        .then(data => {
            const cartItemContainer = document.querySelector('.cart-details');
            const cartTotalsContainer = document.querySelector('.cart-totals');

            let totalAmount = 0; // Variable to track the total price

            // Loop through the items and generate HTML
            data.items.forEach(item => {
                const itemSubtotal = item.price * item.quantity;
                totalAmount += itemSubtotal; // Add item subtotal to the total price

                const itemHtml = `
                    <div class="cart-item" data-item-id="${item.id}">
                        <div class="product-info">
                            <img src="${item.featured_image.url}" alt="${item.product_title}" class="product-image" />
                            <span class="product-name">${item.product_title}</span>
                        </div>
                        <div class="product-price">Rs. ${item.price.toLocaleString()}</div>
                        <div class="product-quantity">
                            <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-item-id="${item.id}" />
                        </div>
                        <div class="product-subtotal">Rs. ${itemSubtotal.toLocaleString()}</div>
                        <div class="remove-item">
                            <img src="./ASSESTS/delete.svg" alt="Remove Item" class="delete-icon" data-item-id="${item.id}" />
                        </div>
                    </div>
                `;

                // Append the item HTML to the cart container
                cartItemContainer.innerHTML += itemHtml;
            });

            // Update cart totals
            cartTotalsContainer.querySelector('.totals-amount').textContent = `Rs. ${data.items_subtotal_price.toLocaleString()}`;
            cartTotalsContainer.querySelector('.total-amount').textContent = `Rs. ${totalAmount.toLocaleString()}`;

            // Handle quantity change
            document.querySelectorAll('.quantity-input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const itemId = e.target.getAttribute('data-item-id');
                    const newQuantity = e.target.value;

                    // Update subtotal for this item
                    const item = data.items.find(item => item.id == itemId);
                    const newSubtotal = item.price * newQuantity;
                    e.target.closest('.cart-item').querySelector('.product-subtotal').textContent = `Rs. ${newSubtotal.toLocaleString()}`;

                    // Recalculate total amount
                    totalAmount = data.items.reduce((total, item) => {
                        const itemQuantity = item.id == itemId ? newQuantity : item.quantity;
                        return total + (item.price * itemQuantity);
                    }, 0);

                    // Update the total amount displayed
                    cartTotalsContainer.querySelector('.total-amount').textContent = `Rs. ${totalAmount.toLocaleString()}`;
                });
            });

            // Modal and item removal functionality
            const modal = document.getElementById('removeItemModal');
            let itemToRemove = null;

            // Handle item removal (show confirmation modal)
            document.querySelectorAll('.delete-icon').forEach(icon => {
                icon.addEventListener('click', (e) => {
                    const itemId = e.target.getAttribute('data-item-id');
                    itemToRemove = data.items.find(item => item.id == itemId);
                    modal.style.display = 'flex'; // Show modal
                });
            });

            // Handle modal confirm button
            document.getElementById('confirmRemove').addEventListener('click', () => {
                // Remove the item from the DOM
                const itemElement = document.querySelector(`.cart-item[data-item-id="${itemToRemove.id}"]`);
                itemElement.remove();

                // Remove the item from the data array and update totals
                data.items = data.items.filter(item => item.id != itemToRemove.id);

                // Recalculate total amount
                totalAmount = data.items.reduce((total, item) => total + (item.price * item.quantity), 0);

                // Update the total amount displayed
                cartTotalsContainer.querySelector('.total-amount').textContent = `Rs. ${totalAmount.toLocaleString()}`;
                cartTotalsContainer.querySelector('.totals-amount').textContent = `Rs. ${totalAmount.toLocaleString()}`;

                // Close the modal
                modal.style.display = 'none';
            });

            // Handle modal cancel button
            document.getElementById('cancelRemove').addEventListener('click', () => {
                modal.style.display = 'none'; // Close the modal without removing
            });

            // Handle Checkout Button
            const checkoutBtn = cartTotalsContainer.querySelector('.checkout-btn');
            checkoutBtn.addEventListener('click', () => {
                alert('Proceeding to checkout...');
                // Here you can implement your actual checkout process
            });

            // Hide the loader once the data is loaded
            loader.style.display = 'none';  // Hide loader
        })
        .catch(error => {
            console.error('Error fetching cart data:', error);
            loader.style.display = 'none';  // Hide loader in case of error
        });
});
