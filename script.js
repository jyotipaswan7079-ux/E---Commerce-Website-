// ShopEase E-Commerce Website

// Product Data
const products = [
    {
        id: 1,
        name: "Classic T-Shirt",
        category: "Fashion",
        price: 499,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Stylish Handbag",
        category: "Accessories",
        price: 899,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Casual Sneakers",
        category: "Footwear",
        price: 1299,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Classic Watch",
        category: "Accessories",
        price: 1499,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Denim Jacket",
        category: "Fashion",
        price: 1599,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Running Shoes",
        category: "Footwear",
        price: 1799,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "Sunglasses",
        category: "Accessories",
        price: 599,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        name: "Casual Shirt",
        category: "Fashion",
        price: 799,
        image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=600&q=80"
    }
];

// HTML Elements
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const filterButtons = document.querySelectorAll(".filter-btn");
const emptyMessage = document.getElementById("emptyMessage");

const cartButton = document.getElementById("cartButton");
const closeCartButton = document.getElementById("closeCart");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");

const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");

// Application State
let selectedCategory = "All";
let searchText = "";
let cart = [];

// Format prices in Indian Rupees
function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(price);
}

// Render Products
function renderProducts() {
    const filteredProducts = products.filter(product => {
        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText);

        return matchesCategory && matchesSearch;
    });

    productGrid.innerHTML = "";

    emptyMessage.hidden = filteredProducts.length !== 0;

    filteredProducts.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";

        image.onerror = function () {
            this.onerror = null;
            this.src = "https://placehold.co/600x400/f8eee8/292524?text=Product";
        };

        const info = document.createElement("div");
        info.className = "product-info";

        const category = document.createElement("p");
        category.className = "product-category";
        category.textContent = product.category;

        const name = document.createElement("h3");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.className = "product-price";
        price.textContent = formatPrice(product.price);

        const button = document.createElement("button");
        button.className = "add-to-cart";
        button.textContent = "Add to Cart";

        button.addEventListener("click", () => {
            addToCart(product.id);
        });

        info.append(category, name, price, button);
        card.append(image, info);

        productGrid.appendChild(card);
    });
}

// Search Products
function performSearch() {
    searchText = searchInput.value.trim().toLowerCase();
    renderProducts();
}

searchButton.addEventListener("click", performSearch);

searchInput.addEventListener("input", performSearch);

// Category Filter
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;

        filterButtons.forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");

        renderProducts();
    });
});

// Add Product to Cart
function addToCart(productId) {
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const product = products.find(item => item.id === productId);

        if (!product) return;

        cart.push({
            ...product,
            quantity: 1
        });
    }

    renderCart();
}

// Increase or decrease quantity
function changeQuantity(productId, change) {
    const item = cart.find(product => product.id === productId);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    renderCart();
}

// Remove Product from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
}

// Render Cart
function renderCart() {
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        const message = document.createElement("p");
        message.className = "cart-empty";
        message.textContent = "Your cart is empty. Start shopping!";

        cartItemsContainer.appendChild(message);
    }

    cart.forEach(item => {
        const row = document.createElement("div");
        row.className = "cart-item";

        const image = document.createElement("img");
        image.src = item.image;
        image.alt = item.name;

        image.onerror = function () {
            this.onerror = null;
            this.src = "https://placehold.co/100x100/f8eee8/292524?text=Item";
        };

        const details = document.createElement("div");

        const name = document.createElement("h4");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent = formatPrice(item.price * item.quantity);

        const controls = document.createElement("div");
        controls.className = "quantity-controls";

        const decreaseButton = document.createElement("button");
        decreaseButton.textContent = "−";
        decreaseButton.setAttribute("aria-label", "Decrease quantity");

        decreaseButton.addEventListener("click", () => {
            changeQuantity(item.id, -1);
        });

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const increaseButton = document.createElement("button");
        increaseButton.textContent = "+";
        increaseButton.setAttribute("aria-label", "Increase quantity");

        increaseButton.addEventListener("click", () => {
            changeQuantity(item.id, 1);
        });

        controls.append(
            decreaseButton,
            quantity,
            increaseButton
        );

        const removeButton = document.createElement("button");
        removeButton.className = "remove-item";
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", () => {
            removeFromCart(item.id);
        });

        details.append(name, price, controls, removeButton);
        row.append(image, details);

        cartItemsContainer.appendChild(row);
    });

    // Total quantity
    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    // Total price
    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = formatPrice(totalPrice);

    checkoutButton.disabled = cart.length === 0;
}

// Open Cart
function openCart() {
    cartPanel.classList.add("open");
    cartOverlay.classList.add("open");

    cartPanel.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    closeCartButton.focus();
}

// Close Cart
function closeCart() {
    cartPanel.classList.remove("open");
    cartOverlay.classList.remove("open");

    cartPanel.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    cartButton.focus();
}

cartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

// Escape key closes cart
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && cartPanel.classList.contains("open")) {
        closeCart();
    }
});

// Demo Checkout
checkoutButton.addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    alert(
        "Thank you for shopping with ShopEase!\n\n" +
        "This is a demo website. Online payment and order " +
        "processing are not connected."
    );
});

// Footer Year
document.getElementById("year").textContent =
    new Date().getFullYear();

// Initialize Website
renderProducts();
renderCart();
