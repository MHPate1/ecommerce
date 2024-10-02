let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += product.quantity;
    } else {
        cart.push(product);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    updateCartCount();
}

function updateQuantity(productId, newQuantity) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity = parseInt(newQuantity);
        if (product.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
            updateCartCount();
        }
    }
}

function updateCartCount() {
    const totalCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalCount;
    document.getElementById('mobile-cart-count').textContent = totalCount;

}

function updateCartDisplay() {
    const cartContainer = document.getElementById('cart-items');
    if (cartContainer) {
        cartContainer.innerHTML = '';
        cart.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><a href="#" onclick="removeFromCart(${item.id}); return false;"><i class="fa-sharp fa-solid fa-xmark"></i></a></td>
                <td><img src="${item.image}" alt="${item.name}"></td>
                <td>${item.name}</td>
                <td>£${item.price.toFixed(2)}</td>
                <td><input type="number" value="${item.quantity}" onchange="updateQuantity(${item.id}, this.value)" min="1"></td>
                <td>£${(item.price * item.quantity).toFixed(2)}</td>
            `;
            cartContainer.appendChild(row);
        });
    }
    updateCartTotal();
}

function updateCartTotal() {
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalElements = document.querySelectorAll('#cart-total');
    totalElements.forEach(element => {
        element.textContent = `£${subtotal.toFixed(2)}`;
    });
}

// Add event listener to "Add to Cart" button on product page
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButton = document.getElementById('add-to-cart');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', () => {
            const product = {
                id: Date.now(), // Use a more robust ID in a real application
                name: document.getElementById('product-name').textContent,
                price: parseFloat(document.getElementById('product-price').textContent.replace('£', '')),
                quantity: parseInt(document.getElementById('quantity').value),
                image: document.getElementById('product-img').src
            };
            if (product.quantity > 0) { // Ensure valid quantity
                addToCart(product);
                alert('Product added to cart!');
            } else {
                alert('Please select a valid quantity.'); // Notify if quantity is invalid
            }
        });
    }
    updateCartDisplay();
    updateCartCount(); // Initialize the cart count on page load
});
