document.addEventListener('DOMContentLoaded', () => {
    const bar = document.getElementById('bar');
    const nav = document.getElementById('navbar');
    const close = document.getElementById('close');

    if (bar) {
        bar.addEventListener('click', () => {
            nav.classList.add('active');
        });
    }

    if (close) {
        close.addEventListener('click', () => {
            nav.classList.remove('active');
        });
    }

    // Function to fetch product data from JSON file
    async function fetchProductData() {
        try {
            const response = await fetch('output/s-products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Could not fetch product data:", error);
            return [];
        }
    }

    // Function to load products on the shop page
    async function loadProducts() {
        const productContainer = document.querySelector('.pro-container:not(#featured-products)');
        if (productContainer) {
            const products = await fetchProductData();
            productContainer.innerHTML = ''; // Clear existing content
            products.forEach((product) => {
                const productCard = document.createElement('div');
                productCard.classList.add('pro');
                productCard.innerHTML = `
                <a href="sproduct.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="des">
                        <span>${product.brand || 'Brand'}</span>
                        <h5>${product.name}</h5>
                        <div class="star">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <h4>£${product.price}</h4>
                    </div>
                    </a>
                    <a href="sproduct.html?id=${product.id}"><i class="fa-solid fa-cart-shopping"></i></a>
                `;
                productContainer.appendChild(productCard);
            });
        }
    }

    // Function to load single product details
    async function loadProductDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        const products = await fetchProductData();
        const product = products.find(p => p.id.toString() === productId);

        const productName = document.getElementById('product-name');
        const productPrice = document.getElementById('product-price');
        const productImg = document.getElementById('product-img');

        if (product) {
            if (productName) productName.textContent = product.name;
            if (productPrice) productPrice.textContent = `£${product.price}`;
            if (productImg) productImg.src = product.image;
        } else {
            const proDetails = document.getElementById('prodetails');
            if (proDetails) {
                proDetails.innerHTML = "<p>Product not found!</p>";
            }
        }
    }

    // Determine which page we're on and call the appropriate function
    if (document.querySelector('.pro-container:not(#featured-products)')) {
        loadProducts();
    } else if (document.getElementById('prodetails')) {
        loadProductDetails();
    }
});

// Function to load featured products on the index page
async function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    if (featuredContainer) {
        const response = await fetch('output/f-products.json');
        const featuredProducts = await response.json();
        featuredContainer.innerHTML = ''; // Clear existing content
        featuredProducts.forEach((product) => {
            const featuredCard = document.createElement('div');
            featuredCard.classList.add('pro');
            featuredCard.innerHTML = `
                <a href="sproduct.html?id=${product.id}">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="des">
                        <span>${product.brand || 'Brand'}</span>
                        <h5>${product.name}</h5>
                        <div class="star">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                        <h4>£${product.price}</h4>
                    </div>
                </a>
                <a href="sproduct.html?id=${product.id}"><i class="fa-solid fa-cart-shopping"></i></a>
            `;
            featuredContainer.appendChild(featuredCard);
        });
    }
}

// Load featured products when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedProducts();
});
