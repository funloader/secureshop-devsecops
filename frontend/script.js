// Global State
let currentUser = null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Hacking Tools Catalog
const PRODUCTS = [
    { id: 1, name: 'Wi-Fi Pineapple Mark VII', price: 299, img: 'https://shop.hak5.org/cdn/shop/files/WiFiPineapple_MarkVII_Front_1200x.png' },
    { id: 2, name: 'HackRF One', price: 299, img: 'https://greatscottgadgets.com/wp-content/uploads/2020/10/hackrf_one_1200x.png' },
    { id: 3, name: 'Ubertooth One', price: 119, img: 'https://greatscottgadgets.com/wp-content/uploads/2020/10/ubertooth_one_1200x.png' },
    { id: 4, name: 'Yard Stick One', price: 99, img: 'https://greatscottgadgets.com/wp-content/uploads/2020/10/yard_stick_one_1200x.png' },
    { id: 5, name: 'USB Rubber Ducky', price: 59, img: 'https://shop.hak5.org/cdn/shop/files/rubber-ducky_1200x.png' },
    { id: 6, name: 'LAN Turtle', price: 99, img: 'https://shop.hak5.org/cdn/shop/files/lan-turtle_1200x.png' },
    { id: 7, name: 'Proxmark3 RDV4', price: 499, img: 'https://shop.hak5.org/cdn/shop/files/proxmark3_1200x.png' },
    { id: 8, name: 'Raspberry Pi 5', price: 79, img: 'https://www.raspberrypi.com/app/uploads/2023/09/Raspberry-Pi-5-3-1.png' },
    { id: 9, name: 'Kali NetHunter', price: 199, img: 'https://www.kali.org/wp-content/uploads/2023/08/kali-nethunter.png' }
];

// Auth System (LocalStorage + SQLi vulnerable backend ready)
function login() {
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    
    if (email && password) {
        currentUser = { email, name: email.split('@')[0], isAdmin: email === 'admin@test.com' };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showMainApp();
    }
}

function signup() {
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    
    // Store in localStorage (mimic vulnerable DB)
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push({ id: Date.now(), email, password, name: email.split('@')[0] });
    localStorage.setItem('users', JSON.stringify(users));
    
    document.getElementById('authMessage').textContent = 'Signup successful! Login now.';
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    document.getElementById('mainApp').classList.add('hidden');
    document.getElementById('authModal').classList.remove('active');
}

// Main App Functions
function showMainApp() {
    document.getElementById('authModal').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    document.getElementById('userName').textContent = currentUser.name;
    
    if (currentUser.isAdmin) {
        document.getElementById('adminBtn').classList.remove('hidden');
    }
    
    loadProducts();
    updateCartCount();
}

function showAdmin() {
    window.location.href = 'admin.html';
}

function loadProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = PRODUCTS.map(product => `
        <div class="product-card">
            <img src="${product.img}" alt="${product.name}" class="product-img">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <div class="quantity">
                <button class="quantity-btn" onclick="updateQuantity(${product.id}, -1)">-</button>
                <span id="qty-${product.id}">0</span>
                <button class="quantity-btn" onclick="updateQuantity(${product.id}, 1)">+</button>
            </div>
            <button class="add-cart" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
    `).join('');
}

function updateQuantity(id, change) {
    const qtyEl = document.getElementById(`qty-${id}`);
    let qty = parseInt(qtyEl.textContent) + change;
    if (qty < 0) qty = 0;
    qtyEl.textContent = qty;
}

function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    const qty = parseInt(document.getElementById(`qty-${productId}`).textContent);
    
    if (qty > 0) {
        cart.push({ ...product, quantity: qty });
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert(`${qty}x ${product.name} added to cart!`);
    }
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Admin Functions
function loadUsers() {
    if (!currentUser?.isAdmin) return window.location.href = 'index.html';
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    document.getElementById('userList').innerHTML = users.map(user => `
        <div class="user-card">
            <h4>${user.name}</h4>
            <p>Email: ${user.email}</p>
            <p>ID: ${user.id}</p>
            <!-- Password HIDDEN for security -->
        </div>
    `).join('');
}

// Checkout (cart.html)
function checkout() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Purchase Complete! Total: $${total.toFixed(2)}`);
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    window.location.href = 'index.html';
}

// Cart Functions (cart.html)
function loadCart() {
    const cartItems = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        return;
    }
    
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.name}" width="80">
            <div>
                <h4>${item.name}</h4>
                <p>$${item.price} x ${item.quantity}</p>
            </div>
            <button onclick="removeFromCart(${index})">Remove</button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalEl.textContent = total.toFixed(2);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

// Init
if (localStorage.getItem('currentUser')) {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    showMainApp();
}
if (window.location.pathname.includes('cart.html')) loadCart();
if (window.location.pathname.includes('admin.html')) loadUsers();
