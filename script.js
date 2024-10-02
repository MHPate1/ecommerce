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

    const productsPerPage = 12; // Number of products per page
    let currentPage = 1;
    let totalPages = 1;

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

    // Function to display products with pagination
    function displayProducts(products, page) {
        const productContainer = document.querySelector('.pro-container:not(#featured-products)');
        if (productContainer) {
            productContainer.innerHTML = ''; // Clear existing content
            const start = (page - 1) * productsPerPage;
            const end = start + productsPerPage;
            const pageProducts = products.slice(start, end);

            pageProducts.forEach((product) => {
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

            updatePaginationControls(products.length);
            scrollToTop(); // Scroll to top after loading products
        }
    }

    // Function to scroll to the top of the page
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Adds a smooth scroll effect
        });
    }

    // Function to update pagination controls
    function updatePaginationControls(totalProducts) {
        totalPages = Math.ceil(totalProducts / productsPerPage);
        const paginationContainer = document.getElementById('page-numbers');
        if (!paginationContainer) return;

        paginationContainer.innerHTML = ''; // Clear existing pagination controls

        // Create Previous button
        const prevButton = document.createElement('a');
        prevButton.href = "#";
        prevButton.textContent = "Prev";
        prevButton.addEventListener('click', (event) => {
            event.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                loadProducts(); // Reload products on page change
            }
        });
        paginationContainer.appendChild(prevButton);

        // Determine which page numbers to show
        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(totalPages, currentPage + 1);

        // Adjust the start and end to always show 3 pages (or fewer if on boundaries)
        if (endPage - startPage < 2) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + 2);
            } else {
                startPage = Math.max(1, endPage - 2);
            }
        }

        // Create page number buttons
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('a');
            pageButton.href = "#";
            pageButton.textContent = i;
            pageButton.classList.add('page-number');
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', (event) => {
                event.preventDefault();
                currentPage = i;
                loadProducts(); // Reload products on page change
            });
            paginationContainer.appendChild(pageButton);
        }

        // Create Next button
        const nextButton = document.createElement('a');
        nextButton.href = "#";
        nextButton.textContent = "Next";
        nextButton.addEventListener('click', (event) => {
            event.preventDefault();
            if (currentPage < totalPages) {
                currentPage++;
                loadProducts(); // Reload products on page change
            }
        });
        paginationContainer.appendChild(nextButton);
    }

    // Function to load products on the shop page
    async function loadProducts() {
        const products = await fetchProductData();
        displayProducts(products, currentPage);
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


    // Sample product data for demonstration
    const productData = {
        name: "Product 1",
        price: "£60",
        img: "img/caroil.jpg"
    };


  