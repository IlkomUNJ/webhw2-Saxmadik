let wishlist = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing...');
    
    const deliveryDateInput = document.getElementById('deliveryDate');
    if (deliveryDateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        deliveryDateInput.min = tomorrow.toISOString().split('T')[0];
    }

    createWishlistBadge();
    
    updateWishlistUI();

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchCakes();
        });
        
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                searchCakes();
            }
        });
    }

    setupOrderForm();
    
    setupLoginForm();

    setupAdminPage();
});

function createWishlistBadge() {

    const existingBadge = document.getElementById('wishlistBadge');
    if (existingBadge) return;

    const badge = document.createElement('div');
    badge.id = 'wishlistBadge';
    badge.className = 'wishlist-badge';
    badge.onclick = openWishlist;
    badge.innerHTML = `
        <span class="wishlist-badge-icon">❤️</span>
        <span class="wishlist-count" style="display: none;">0</span>
    `;
    document.body.appendChild(badge);
    updateWishlistCount();
}

function toggleWishlist(button, cakeName) {
    event.stopPropagation(); 
    
    const index = wishlist.indexOf(cakeName);
    
    if (index > -1) {

        wishlist.splice(index, 1);
        button.querySelector('.heart-icon').textContent = '🤍';
        button.classList.remove('active');
    } else {

        wishlist.push(cakeName);
        button.querySelector('.heart-icon').textContent = '❤️';
        button.classList.add('active');
    }
    
    updateWishlistCount();
}


function updateWishlistUI() {
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        const onclickAttr = button.getAttribute('onclick');
        if (onclickAttr) {
            const match = onclickAttr.match(/'([^']+)'/);
            if (match && match[1]) {
                const cakeName = match[1];
                if (wishlist.includes(cakeName)) {
                    button.querySelector('.heart-icon').textContent = '❤️';
                    button.classList.add('active');
                } else {
                    button.querySelector('.heart-icon').textContent = '🤍';
                    button.classList.remove('active');
                }
            }
        }
    });
}

function updateWishlistCount() {
    const countElement = document.querySelector('.wishlist-count');
    if (countElement) {
        if (wishlist.length > 0) {
            countElement.textContent = wishlist.length;
            countElement.style.display = 'flex';
        } else {
            countElement.style.display = 'none';
        }
    }
}

function openWishlist() {
    const modal = document.getElementById('wishlistModal');
    const wishlistItems = document.getElementById('wishlistItems');

    if (!modal || !wishlistItems) {
        console.error('Wishlist modal not found on this page');
        return;
    }

    if (wishlist.length === 0) {
        wishlistItems.innerHTML = `
            <div class="wishlist-empty">
                <div class="empty-icon">❤️</div>
                <p class="empty-title">Your wishlist is empty</p>
                <p class="empty-subtitle">Add cakes you love to your wishlist</p>
            </div>
        `;
    } else {
        wishlistItems.innerHTML = wishlist.map(cake => `
            <div class="wishlist-item">
                <div class="wishlist-item-content">
                    <span class="wishlist-item-icon">🍰</span>
                    <span class="wishlist-item-name">${cake}</span>
                </div>
                <div class="wishlist-item-actions">
                    <a href="/contact" class="btn-wishlist-order">Order</a>
                    <button class="wishlist-item-remove" onclick="removeFromWishlist('${cake}')">Remove</button>
                </div>
            </div>
        `).join('');
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeWishlist() {
    const modal = document.getElementById('wishlistModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; 
    }
}

function removeFromWishlist(cakeName) {
    const index = wishlist.indexOf(cakeName);
    if (index > -1) {
        wishlist.splice(index, 1);
        updateWishlistCount();
        updateWishlistUI();
        openWishlist(); 
    }
}

window.onclick = function(event) {
    const modal = document.getElementById('wishlistModal');
    if (event.target === modal) {
        closeWishlist();
    }
}

function searchCakes() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    const menuItems = document.querySelectorAll('.menu-item');
    const clearBtn = document.getElementById('clearSearchBtn');


    if (clearBtn) {
        clearBtn.style.display = searchTerm ? 'flex' : 'none';
    }

    const existingNoResults = document.getElementById('noResults');
    if (existingNoResults) {
        existingNoResults.remove();
    }

    if (searchTerm === '') {
        menuItems.forEach(item => {
            item.style.display = 'block';
        });
        return;
    }

    let foundCount = 0;
    menuItems.forEach(item => {
        const cakeName = item.getAttribute('data-cake');
        const cakeText = item.textContent.toLowerCase();

        if ((cakeName && cakeName.toLowerCase().includes(searchTerm)) || cakeText.includes(searchTerm)) {
            item.style.display = 'block';
            foundCount++;
        } else {
            item.style.display = 'none';
        }
    });

    if (foundCount === 0) {
        const grid = document.getElementById('cakesGrid');
        if (grid) {
            const noResults = document.createElement('div');
            noResults.id = 'noResults';
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <div class="no-results-icon">🔍</div>
                <p class="no-results-title">No cakes found</p>
                <p class="no-results-subtitle">Try searching with different keywords</p>
                <button class="btn btn-primary" onclick="clearSearch()">Clear Search</button>
            `;
            grid.appendChild(noResults);
        }
    }
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        searchCakes();
        searchInput.focus();
    }
}

function setupOrderForm() {
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const cakeType = document.getElementById('cakeType').value;
            const size = document.getElementById('size').value;
            const deliveryDate = document.getElementById('deliveryDate').value;
            const message = document.getElementById('message').value || 'Tidak ada';

            const whatsappMessage = `Halo! Saya ingin memesan kue:

Nama: ${name}
No. HP: ${phone}
Jenis Kue: ${cakeType}
Ukuran: ${size}
Tanggal Pengambilan: ${deliveryDate}
Pesan Tambahan: ${message}`;

            const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
        });
    }
}

function openWhatsApp() {
    const message = "Halo! Saya tertarik dengan kue-kue Anda. Bisakah Anda memberikan informasi lebih lanjut?";
    const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('errorMessage');
            
            if (username === 'id' && password === '123') {
 
                errorMessage.style.display = 'none';
                

                const successDiv = document.createElement('div');
                successDiv.className = 'success-message';
                successDiv.textContent = '✅ Login successful! Redirecting...';
                errorMessage.parentNode.insertBefore(successDiv, errorMessage);
                
                window.isLoggedIn = true;
                
                setTimeout(() => {
                    window.location.href = '/admin';
                }, 800);
            } else {

                errorMessage.style.display = 'block';
                
                document.getElementById('password').value = '';
                
                loginForm.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    loginForm.style.animation = '';
                }, 500);
            }
        });
    }
}

function checkAuth() {
    return window.isLoggedIn || false;
}

function logout() {
    window.isLoggedIn = false;
    window.location.href = '/login';
}

function setupAdminPage() {

    const adminContent = document.getElementById('adminContent');
    
    if (!adminContent) {

        return;
    }

    initializeApp();
}

let products = [
    {
        id: 1,
        name: 'Brownies Panggang',
        price: 165000,
        size: '20x20 cm',
        image: '/images/brownies-panggang.jpeg',
        description: 'Rich, fudgy baked brownies with perfect texture'
    },
    {
        id: 2,
        name: 'Marmer Cake',
        price: 225000,
        size: 'Diameter 24cm',
        image: '/images/marmer-cake.png',
        description: 'Classic marble cake with butter richness'
    },
    {
        id: 3,
        name: 'Bolu Jadul Keju',
        price: 115000,
        size: 'Diameter 24cm',
        image: '/images/bolu-jadul.png',
        description: 'Classic old-style cheese sponge cake'
    }
];


const productForm = document.getElementById('productForm');
const productTableBody = document.getElementById('productTableBody');
const formTitle = document.getElementById('formTitle');
const productIdInput = document.getElementById('productId');
const cancelEditBtn = document.getElementById('cancelEditBtn');


function initializeApp() {
    if (!productForm) return; 

    renderProductTable();

    productForm.addEventListener('submit', handleFormSubmit);

    productTableBody.addEventListener('click', handleTableActions);

    cancelEditBtn.addEventListener('click', resetForm);
}

function renderProductTable() {
    productTableBody.innerHTML = ''; 

    if (products.length === 0) {
        productTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No products found. Add one above!</td></tr>';
        return;
    }

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${product.image}" alt="${product.name}"></td>
            <td>${product.name}</td>
            <td>Rp ${product.price.toLocaleString('id-ID')}</td>
            <td class="actions-cell">
                <button type="button" class="btn-edit" data-id="${product.id}">Edit</button>
                <button type="button" class="btn-delete" data-id="${product.id}">Delete</button>
            </td>
        `;
        productTableBody.appendChild(row);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();

    const id = productIdInput.value;
    const productData = {
        name: document.getElementById('productName').value,
        price: parseInt(document.getElementById('productPrice').value),
        size: document.getElementById('productSize').value,
        image: document.getElementById('productImage').value,
        description: document.getElementById('productDescription').value
    };

    if (id) {

        const index = products.findIndex(p => p.id == id);
        if (index > -1) {
            products[index] = { ...products[index], ...productData };
        }
    } else {

        const newProduct = {
            id: Date.now(), 
            ...productData
        };
        products.push(newProduct);
    }

    renderProductTable();
    resetForm();
}


function handleTableActions(e) {
    const target = e.target;
    const id = target.dataset.id;

    if (!id) return; 

    if (target.classList.contains('btn-edit')) {

        const product = products.find(p => p.id == id);
        if (!product) return;

        formTitle.textContent = 'Edit Cake';
        productIdInput.value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productSize').value = product.size;
        document.getElementById('productImage').value = product.image;
        document.getElementById('productDescription').value = product.description;
        
        cancelEditBtn.style.display = 'inline-block';

        productForm.scrollIntoView({ behavior: 'smooth' });

    } else if (target.classList.contains('btn-delete')) {

        if (confirm('Are you sure you want to delete this cake?')) {

            products = products.filter(p => p.id != id);

            renderProductTable();
        }
    }
}

function resetForm() {
    formTitle.textContent = 'Add New Cake';
    productForm.reset(); 
    productIdInput.value = ''; 
    cancelEditBtn.style.display = 'none';
}