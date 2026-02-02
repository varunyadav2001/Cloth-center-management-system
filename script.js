// ============================================
// DATA MANAGEMENT - LocalStorage
// ============================================

// Initialize localStorage with sample data if empty
function initializeStorage() {
    if (!localStorage.getItem('clothes')) {
        const sampleClothes = [
            {
                id: 'CLT001',
                brand: 'Nike',
                color: 'Black',
                size: 'M',
                category: 'tops',
                stock: 15,
                price: '45.99',
                description: 'Comfortable athletic wear',
                image: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 300%22%3E%3Crect fill=%22%23333333%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 font-size=%2248%22 fill=%22white%22 font-family=%22Arial%22%3ENike Black T-Shirt%3C/text%3E%3C/svg%3E'
            },
            {
                id: 'CLT002',
                brand: 'Adidas',
                color: 'Blue',
                size: 'L',
                category: 'shoes',
                stock: 8,
                price: '52.00',
                description: 'Premium blue running shoes',
                image: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 300%22%3E%3Crect fill=%22%234169E1%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 font-size=%2240%22 fill=%22white%22 font-family=%22Arial%22%3EAdidas Blue%3C/text%3E%3C/svg%3E'
            },
            {
                id: 'CLT003',
                brand: 'Puma',
                color: 'Red',
                size: 'S',
                category: 'bottoms',
                stock: 0,
                price: '35.50',
                description: 'Stylish red sports jacket',
                image: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 300%22%3E%3Crect fill=%22%23FF0000%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 font-size=%2244%22 fill=%22white%22 font-family=%22Arial%22%3EPuma Red%3C/text%3E%3C/svg%3E'
            }
        ];
        localStorage.setItem('clothes', JSON.stringify(sampleClothes));
    }

    if (!localStorage.getItem('likes')) {
        localStorage.setItem('likes', JSON.stringify([]));
    }

    if (!localStorage.getItem('comments')) {
        localStorage.setItem('comments', JSON.stringify([]));
    }

    if (!localStorage.getItem('reviews')) {
        localStorage.setItem('reviews', JSON.stringify([]));
    }

    if (!localStorage.getItem('wishlist')) {
        localStorage.setItem('wishlist', JSON.stringify([]));
    }

    if (!localStorage.getItem('sales')) {
        localStorage.setItem('sales', JSON.stringify([]));
    }
}

function getClothes() {
    return JSON.parse(localStorage.getItem('clothes')) || [];
}

function saveClothes(clothes) {
    localStorage.setItem('clothes', JSON.stringify(clothes));
}

function getLikes() {
    return JSON.parse(localStorage.getItem('likes')) || [];
}

function saveLikes(likes) {
    localStorage.setItem('likes', JSON.stringify(likes));
}

function getComments() {
    return JSON.parse(localStorage.getItem('comments')) || [];
}

function saveComments(comments) {
    localStorage.setItem('comments', JSON.stringify(comments));
}

function getReviews() {
    return JSON.parse(localStorage.getItem('reviews')) || [];
}

function saveReviews(reviews) {
    localStorage.setItem('reviews', JSON.stringify(reviews));
}

function getSales() {
    return JSON.parse(localStorage.getItem('sales')) || [];
}

function saveSales(sales) {
    localStorage.setItem('sales', JSON.stringify(sales));
}

function cleanupOldSales() {
    let sales = getSales();
    const now = new Date().getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    // Filter out sales older than 24 hours
    const activeSales = sales.filter(sale => {
        const saleTime = new Date(sale.timestamp).getTime();
        const ageInMs = now - saleTime;
        return ageInMs < twentyFourHours;
    });
    
    // If any sales were removed, update the storage
    if (activeSales.length < sales.length) {
        saveSales(activeSales);
        console.log(`Cleaned up ${sales.length - activeSales.length} old sales record(s)`);
    }
}

function getWishlist() {
    return JSON.parse(localStorage.getItem('wishlist')) || [];
}

function saveWishlist(wishlist) {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// ============================================
// STATE MANAGEMENT
// ============================================

let isOwnerLoggedIn = false;
let currentClothId = null;
let currentUserId = 'user_' + Math.random().toString(36).substr(2, 9);
let isWishlistView = false;
let currentCategory = 'all';
let currentSort = '';

// ============================================
// DOM ELEMENTS
// ============================================

const userSection = document.getElementById('userSection');
const ownerSection = document.getElementById('ownerSection');
const ownerLoginModal = document.getElementById('ownerLoginModal');
const ownerLoginForm = document.getElementById('ownerLoginForm');
const switchRoleBtn = document.getElementById('switchRoleBtn');
const logoutBtn = document.getElementById('logoutBtn');
const wishlistToggleBtn = document.getElementById('wishlistToggleBtn');
const clothesGrid = document.getElementById('clothesGrid');
const noResults = document.getElementById('noResults');
const searchBrand = document.getElementById('searchBrand');
const filterColor = document.getElementById('filterColor');
const filterSize = document.getElementById('filterSize');
const sortPrice = document.getElementById('sortPrice');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const clothDetailsModal = document.getElementById('clothDetailsModal');
const addClothModal = document.getElementById('addClothModal');
const addClothForm = document.getElementById('addClothForm');
const addClothBtn = document.getElementById('addClothBtn');
const editClothModal = document.getElementById('editClothModal');
const editClothForm = document.getElementById('editClothForm');
const allCommentsModal = document.getElementById('allCommentsModal');
const ownerDashboard = document.getElementById('ownerDashboard');
const showAllProductsBtn = document.getElementById('showAllProductsBtn');
const productTransactionModal = document.getElementById('productTransactionModal');

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeStorage();
    displayClothes();
    setupEventListeners();
    updateWishlistCount();
});

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Role switching
    switchRoleBtn.addEventListener('click', switchToOwner);
    logoutBtn.addEventListener('click', logout);

    // Wishlist toggle
    wishlistToggleBtn.addEventListener('click', toggleWishlistView);

    // Owner login
    ownerLoginForm.addEventListener('submit', handleOwnerLogin);

    // Category filter
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.dataset.category;
            filterClothes();
        });
    });

    // User search and filter
    searchBrand.addEventListener('input', filterClothes);
    filterColor.addEventListener('change', filterClothes);
    filterSize.addEventListener('change', filterClothes);
    sortPrice.addEventListener('change', filterClothes);
    clearFiltersBtn.addEventListener('click', clearFilters);

    // Add cloth form
    addClothForm.addEventListener('submit', handleAddCloth);
    addClothBtn.addEventListener('click', openAddClothModal);

    // Edit cloth form
    editClothForm.addEventListener('submit', handleEditCloth);

    // Show all products
    if (showAllProductsBtn) {
        showAllProductsBtn.addEventListener('click', displayAllProductsFullView);
    }
}

// ============================================
// USER SECTION - DISPLAY CLOTHES
// ============================================

function displayClothes() {
    const clothes = getClothes();
    clothesGrid.innerHTML = '';

    if (clothes.length === 0) {
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

    clothes.forEach(cloth => {
        const card = createClothCard(cloth);
        clothesGrid.appendChild(card);
    });
}

function createClothCard(cloth) {
    const card = document.createElement('div');
    card.className = 'cloth-card';

    const reviews = getReviews();
    const clothReviews = reviews.filter(r => r.clothId === cloth.id).length;
    
    const wishlist = getWishlist();
    const isInWishlist = wishlist.some(w => w === cloth.id);

    const cardHTML = `
        <div style="position: relative;">
            <img src="${cloth.image}" alt="${cloth.brand}" class="cloth-card-image">
            ${cloth.stock === 0 ? '<div class="sold-out-badge">SOLD OUT</div>' : ''}
            <button class="save-wishlist-btn ${isInWishlist ? 'saved' : ''}" data-cloth-id="${cloth.id}" title="Add to Wishlist">
                ${isInWishlist ? '💛' : '🤍'}
            </button>
        </div>
        <div class="cloth-card-body">
            <div class="cloth-card-brand">${cloth.brand}</div>
            <div class="cloth-card-details">
                <strong>Color:</strong> ${cloth.color} | <strong>Size:</strong> ${cloth.size}
            </div>
            <div class="cloth-card-id">ID: ${cloth.id}</div>
            <div class="cloth-card-footer">
                <div class="card-actions">
                    <button type="button" class="btn btn-secondary btn-small review-count-btn" title="View Reviews">
                        ⭐ ${clothReviews}
                    </button>
                    <button type="button" class="btn btn-primary btn-small see-more-btn">See More</button>
                </div>
            </div>
        </div>
    `;

    card.innerHTML = cardHTML;

    // Wishlist button
    card.querySelector('.save-wishlist-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleWishlistItem(cloth.id);
        updateWishlistCount();
    });

    card.querySelector('.see-more-btn').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        currentClothId = cloth.id;
        openClothDetails(cloth);
    });

    return card;
}

// ============================================
// CLOTH DETAILS MODAL
// ============================================

function openClothDetails(cloth) {
    document.getElementById('detailsImage').src = cloth.image;
    document.getElementById('detailsBrand').textContent = cloth.brand;
    document.getElementById('detailsId').textContent = cloth.id;
    document.getElementById('detailsColor').textContent = cloth.color;
    document.getElementById('detailsSize').textContent = cloth.size;

    // Show price if available
    if (cloth.price) {
        document.getElementById('detailsPriceContainer').style.display = 'block';
        document.getElementById('detailsPrice').textContent = '$' + parseFloat(cloth.price).toFixed(2);
    } else {
        document.getElementById('detailsPriceContainer').style.display = 'none';
    }

    // Show description if available
    if (cloth.description) {
        document.getElementById('detailsDescriptionContainer').style.display = 'block';
        document.getElementById('detailsDescription').textContent = cloth.description;
    } else {
        document.getElementById('detailsDescriptionContainer').style.display = 'none';
    }

    // Wishlist button
    const wishlistBtn = document.getElementById('wishlistBtn');
    const wishlist = getWishlist();
    const isInWishlist = wishlist.includes(cloth.id);
    
    if (isInWishlist) {
        wishlistBtn.textContent = '💛 Saved';
        wishlistBtn.classList.add('in-wishlist');
    } else {
        wishlistBtn.textContent = '🛍️ Wishlist';
        wishlistBtn.classList.remove('in-wishlist');
    }

    wishlistBtn.onclick = (e) => {
        e.preventDefault();
        toggleWishlistItem(cloth.id);
        updateWishlistCount();
        // Update button state
        const updatedWishlist = getWishlist();
        if (updatedWishlist.includes(cloth.id)) {
            wishlistBtn.textContent = '💛 Saved';
            wishlistBtn.classList.add('in-wishlist');
        } else {
            wishlistBtn.textContent = '🛍️ Wishlist';
            wishlistBtn.classList.remove('in-wishlist');
        }
    };

    // Display reviews
    displayReviews(cloth.id);

    // Review button
    const addReviewBtn = document.getElementById('addReviewBtn');
    addReviewBtn.onclick = () => addReview(cloth.id);

    // Share button
    const shareBtn = document.getElementById('shareBtn');
    shareBtn.onclick = () => shareCloth(cloth.id);

    clothDetailsModal.classList.add('show');
}

function closeClothDetails() {
    clothDetailsModal.classList.remove('show');
    currentClothId = null;
}

// Shop Information Functions
function openShopInfo() {
    const shopInfoModal = document.getElementById('shopInfoModal');
    shopInfoModal.classList.add('show');
}

function closeShopInfo() {
    const shopInfoModal = document.getElementById('shopInfoModal');
    shopInfoModal.classList.remove('show');
}

// ============================================
// REVIEWS FUNCTIONALITY
// ============================================

function displayReviews(clothId) {
    const reviews = getReviews();
    const clothReviews = reviews.filter(r => r.clothId === clothId);
    const reviewsList = document.getElementById('reviewsList');

    reviewsList.innerHTML = '';

    if (clothReviews.length === 0) {
        reviewsList.innerHTML = '<p style="text-align: center; color: #999;">No reviews yet. Be the first to review!</p>';
        return;
    }

    clothReviews.forEach(review => {
        const reviewEl = createReviewElement(review);
        reviewsList.appendChild(reviewEl);
    });
}

function createReviewElement(review) {
    const div = document.createElement('div');
    div.className = 'review';

    const isOwnReview = review.userId === currentUserId;
    const stars = '⭐'.repeat(review.rating);

    div.innerHTML = `
        <div class="review-header">
            <div>
                <div class="review-user"><strong>${review.reviewerName || 'Anonymous'}</strong></div>
                <div class="review-rating">${stars} ${review.rating} Stars</div>
                <div class="review-date">${new Date(review.timestamp).toLocaleDateString()}</div>
            </div>
        </div>
        <div class="review-text">${escapeHtml(review.text)}</div>
        ${isOwnReview ? `<div class="review-actions"><button class="btn btn-small btn-danger" onclick="deleteReview('${review.id}')">Delete</button></div>` : ''}
    `;

    return div;
}

function addReview(clothId) {
    const reviewerName = document.getElementById('reviewerName').value.trim();
    const rating = document.getElementById('reviewRating').value;
    const text = document.getElementById('reviewText').value.trim();

    if (!rating) {
        alert('Please select a rating');
        return;
    }

    if (!text) {
        alert('Please write a review');
        return;
    }

    const reviews = getReviews();
    reviews.push({
        id: 'review_' + Date.now(),
        clothId: clothId,
        userId: currentUserId,
        reviewerName: reviewerName || 'Anonymous',
        rating: parseInt(rating),
        text: text,
        timestamp: new Date().toISOString()
    });

    saveReviews(reviews);
    document.getElementById('reviewerName').value = '';
    document.getElementById('reviewRating').value = '';
    document.getElementById('reviewText').value = '';
    displayReviews(clothId);
}

function deleteReview(reviewId) {
    if (confirm('Delete this review?')) {
        let reviews = getReviews();
        reviews = reviews.filter(r => r.id !== reviewId);
        saveReviews(reviews);
        displayReviews(currentClothId);
    }
}

// ============================================
// COMMENTS FUNCTIONALITY (DEPRECATED - Using Reviews Now)
// ============================================

function displayComments(clothId) {
    // Deprecated - use displayReviews instead
}

function deleteComment(commentId) {
    // Deprecated - use deleteReview instead
}

// ============================================
// SEARCH AND FILTER
// ============================================

function filterClothes() {
    const clothes = getClothes();
    const brand = searchBrand.value.toLowerCase();
    const color = filterColor.value;
    const size = filterSize.value;

    let filtered = clothes.filter(cloth => {
        const matchBrand = cloth.brand.toLowerCase().includes(brand);
        const matchColor = color === '' || cloth.color === color;
        const matchSize = size === '' || cloth.size === size;
        const matchCategory = currentCategory === 'all' || cloth.category === currentCategory;
        return matchBrand && matchColor && matchSize && matchCategory;
    });

    // Apply wishlist filter if in wishlist view
    if (isWishlistView) {
        const wishlist = getWishlist();
        filtered = filtered.filter(cloth => wishlist.includes(cloth.id));
    }

    // Apply price sorting
    if (currentSort === 'low-high') {
        filtered.sort((a, b) => {
            const priceA = parseFloat(a.price) || 0;
            const priceB = parseFloat(b.price) || 0;
            return priceA - priceB;
        });
    } else if (currentSort === 'high-low') {
        filtered.sort((a, b) => {
            const priceA = parseFloat(a.price) || 0;
            const priceB = parseFloat(b.price) || 0;
            return priceB - priceA;
        });
    }

    clothesGrid.innerHTML = '';

    if (filtered.length === 0) {
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

    filtered.forEach(cloth => {
        const card = createClothCard(cloth);
        clothesGrid.appendChild(card);
    });
}

function clearFilters() {
    searchBrand.value = '';
    filterColor.value = '';
    filterSize.value = '';
    sortPrice.value = '';
    currentSort = '';
    currentCategory = 'all';
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-category="all"]').classList.add('active');
    displayClothes();
}

// ============================================
// ROLE SWITCHING
// ============================================

function switchToOwner() {
    if (isOwnerLoggedIn) {
        logout();
    } else {
        ownerLoginModal.classList.add('show');
    }
}

function handleOwnerLogin(e) {
    e.preventDefault();
    const username = document.getElementById('ownerUsername').value;
    const password = document.getElementById('ownerPassword').value;

    // Hardcoded credentials
    if (username === 'admin' && password === 'admin123') {
        isOwnerLoggedIn = true;
        ownerLoginModal.classList.remove('show');
        document.getElementById('ownerUsername').value = '';
        document.getElementById('ownerPassword').value = '';

        userSection.classList.remove('active');
        ownerSection.classList.add('active');
        ownerDashboard.style.display = 'block';

        switchRoleBtn.textContent = 'Switch to User';
        logoutBtn.style.display = 'block';
        wishlistToggleBtn.style.display = 'none';

        loadOwnerDashboard();
    } else {
        alert('Invalid credentials. Demo: admin / admin123');
    }
}

function logout() {
    isOwnerLoggedIn = false;
    ownerSection.classList.remove('active');
    userSection.classList.add('active');
    ownerDashboard.style.display = 'none';
    switchRoleBtn.textContent = 'Switch to Owner';
    logoutBtn.style.display = 'none';
    wishlistToggleBtn.style.display = 'block';
    isWishlistView = false;
    displayClothes();
}

// ============================================
// OWNER DASHBOARD
// ============================================

function loadOwnerDashboard() {
    // Clean up old sales records (older than 24 hours)
    cleanupOldSales();
    
    updateStatistics();
    displayOwnerClothes();
    
    // Update professional features
    calculateAnalytics();
    displayLowStockAlert();
    displayInventorySummary();
    updateTotalRevenue();
    
    // Setup search with a small delay to ensure DOM is ready
    setTimeout(() => {
        setupAdminSearch();
    }, 100);
}

function updateStatistics() {
    const clothes = getClothes();
    const sales = getSales();
    const wishlist = getWishlist();

    // Total clothes
    document.getElementById('totalClothes').textContent = clothes.length;

    // Today's profit calculation
    const today = new Date().toLocaleDateString();
    let todayProfit = 0;
    
    sales.forEach(sale => {
        const saleDate = new Date(sale.timestamp).toLocaleDateString();
        if (saleDate === today) {
            const quantity = sale.quantity || 1;
            const price = parseFloat(sale.price) || 0;
            todayProfit += (quantity * price);
        }
    });

    document.getElementById('todayProfit').textContent = '₹ ' + todayProfit.toFixed(2);

    // Total sold count
    document.getElementById('totalSold').textContent = sales.length;

    // Display sold products
    displaySoldProducts();
}

function displayOwnerClothes() {
    const clothes = getClothes();
    const table = document.getElementById('ownerClothesTable');

    table.innerHTML = '';

    if (clothes.length === 0) {
        table.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">No products added yet</p>';
        return;
    }

    clothes.forEach(cloth => {
        const item = document.createElement('div');
        item.className = 'admin-product-item';

        item.innerHTML = `
            <div class="admin-item-info">
                <img src="${cloth.image}" alt="${cloth.brand}" class="admin-item-image">
                <div class="admin-item-details">
                    <div class="admin-item-title">${cloth.brand}</div>
                    <div class="admin-item-meta">ID: <strong>${cloth.id}</strong></div>
                    <div class="admin-item-meta">${cloth.color} | ${cloth.size} | Stock: ${cloth.stock}</div>
                </div>
            </div>
            <div class="admin-item-action">
                <button class="btn btn-primary btn-small" onclick="openProductTransaction('${cloth.id}')">👁️ Watch</button>
            </div>
        `;

        table.appendChild(item);
    });
}

// ============================================
// PRODUCT TRANSACTION (SEARCH & SELL)
// ============================================

let currentTransactionClothId = null;

function openProductTransaction(clothId) {
    const clothes = getClothes();
    const cloth = clothes.find(c => c.id === clothId);
    
    if (!cloth) return;

    currentTransactionClothId = clothId;

    // Populate modal
    document.getElementById('transProductImage').src = cloth.image;
    document.getElementById('transProductBrand').textContent = cloth.brand;
    document.getElementById('transProductId').textContent = cloth.id;
    document.getElementById('transProductColor').textContent = cloth.color;
    document.getElementById('transProductSize').textContent = cloth.size;
    document.getElementById('transProductStock').textContent = cloth.stock;
    document.getElementById('transProductPrice').textContent = '₹ ' + parseFloat(cloth.price || 0).toFixed(2);
    
    // Reset discount
    document.getElementById('discountPercent').value = 0;
    updateFinalPrice();

    // Setup discount listener
    document.getElementById('discountPercent').addEventListener('input', updateFinalPrice);

    // Setup button listeners
    document.getElementById('soldBtn').onclick = () => markProductSold(clothId);
    document.getElementById('receiveBagBtn').onclick = () => receiveBag(clothId);

    document.getElementById('productTransactionModal').classList.add('show');
}

function closeProductTransactionModal() {
    document.getElementById('productTransactionModal').classList.remove('show');
    currentTransactionClothId = null;
}

function updateFinalPrice() {
    const clothes = getClothes();
    const cloth = clothes.find(c => c.id === currentTransactionClothId);
    
    if (!cloth) return;

    const originalPrice = parseFloat(cloth.price || 0);
    const discountPercent = parseFloat(document.getElementById('discountPercent').value) || 0;
    const discountAmount = (originalPrice * discountPercent) / 100;
    const finalPrice = originalPrice - discountAmount;

    document.getElementById('finalPrice').textContent = `Final: ₹ ${finalPrice.toFixed(2)} (${discountPercent}% off)`;
}

function markProductSold(clothId) {
    const clothes = getClothes();
    const cloth = clothes.find(c => c.id === clothId);
    
    if (!cloth) return;

    const discountPercent = parseFloat(document.getElementById('discountPercent').value) || 0;
    const originalPrice = parseFloat(cloth.price || 0);
    const discountAmount = (originalPrice * discountPercent) / 100;
    const finalPrice = originalPrice - discountAmount;

    // Reduce stock
    if (cloth.stock > 0) {
        cloth.stock -= 1;
    }

    // Record sale
    const sales = getSales();
    sales.push({
        id: 'sale_' + Date.now(),
        clothId: clothId,
        quantity: 1,
        originalPrice: originalPrice,
        discountPercent: discountPercent,
        finalPrice: finalPrice,
        price: finalPrice, // For profit calculation
        timestamp: new Date().toISOString()
    });

    saveClothes(clothes);
    saveSales(sales);

    alert(`✓ Product sold! Profit: ₹${finalPrice.toFixed(2)}`);
    closeProductTransactionModal();
    loadOwnerDashboard();
}

function receiveBag(clothId) {
    const clothes = getClothes();
    const cloth = clothes.find(c => c.id === clothId);
    
    if (!cloth) return;

    // Increase stock (when receiving new bag/stock)
    cloth.stock += 1;
    saveClothes(clothes);

    alert(`✓ 1 unit received! New stock: ${cloth.stock}`);
    closeProductTransactionModal();
    loadOwnerDashboard();
}

// ============================================
// ADMIN SEARCH FUNCTIONALITY
// ============================================

function setupAdminSearch() {
    console.log('Setting up admin search...');
    
    const searchInput = document.getElementById('adminSearchId');
    const searchBtn = document.getElementById('adminSearchBtn');
    const clearBtn = document.getElementById('clearSearchBtn');
    const hideAllBtn = document.getElementById('hideAllProductsBtn');

    console.log('Search elements found:', {
        searchInput: !!searchInput,
        searchBtn: !!searchBtn,
        clearBtn: !!clearBtn,
        hideAllBtn: !!hideAllBtn
    });

    if (searchBtn) {
        searchBtn.onclick = function() {
            console.log('Search button clicked');
            performAdminSearch();
        };
    }
    if (searchInput) {
        searchInput.onkeypress = (e) => {
            if (e.key === 'Enter') {
                console.log('Enter key pressed in search');
                performAdminSearch();
            }
        };
    }
    if (clearBtn) {
        clearBtn.onclick = () => {
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
            }
            clearSearchResults();
        };
    }
    if (hideAllBtn) {
        hideAllBtn.onclick = hideAllProductsView;
    }
}

function performAdminSearch() {
    console.log('Performing search...');
    
    const searchInput = document.getElementById('adminSearchId');
    if (!searchInput) {
        console.log('Search input not found');
        return;
    }
    
    const searchId = searchInput.value.trim().toUpperCase();
    console.log('Search ID:', searchId);
    
    if (!searchId) {
        alert('Please enter a Cloth ID to search');
        return;
    }

    const clothes = getClothes();
    console.log('Total clothes:', clothes.length);
    console.log('Clothes IDs:', clothes.map(c => c.id));
    
    const cloth = clothes.find(c => c.id === searchId);
    console.log('Found cloth:', cloth);

    if (!cloth) {
        alert('❌ Product ID "' + searchId + '" not found. Please check and try again.');
        return;
    }

    displaySearchResult(cloth);
    searchInput.value = '';
}

function displaySearchResult(cloth) {
    console.log('Displaying search result for:', cloth.brand);
    
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const searchResultProduct = document.getElementById('searchResultProduct');
    const allProductsContainer = document.getElementById('allProductsContainer');

    console.log('Container elements:', {
        searchResultsContainer: !!searchResultsContainer,
        searchResultProduct: !!searchResultProduct,
        allProductsContainer: !!allProductsContainer
    });

    if (!searchResultsContainer || !searchResultProduct) {
        console.error('Search result containers not found in DOM');
        return;
    }

    // Hide all products container if open
    if (allProductsContainer) {
        allProductsContainer.style.display = 'none';
    }

    // Show search results
    searchResultsContainer.style.display = 'block';

    const unitPrice = parseFloat(cloth.price || 0);

    searchResultProduct.innerHTML = `
        <div class="search-result-card">
            <img src="${cloth.image}" alt="${cloth.brand}" class="search-result-image">
            <div class="search-result-info">
                <h2>${cloth.brand}</h2>
                
                <!-- Product Details Section -->
                <div class="result-meta">
                    <div class="meta-row">
                        <span class="label">ID:</span>
                        <span class="value">${cloth.id}</span>
                    </div>
                    <div class="meta-row">
                        <span class="label">Color:</span>
                        <span class="value">${cloth.color}</span>
                    </div>
                    <div class="meta-row">
                        <span class="label">Size:</span>
                        <span class="value">${cloth.size}</span>
                    </div>
                    <div class="meta-row">
                        <span class="label">Category:</span>
                        <span class="value">${cloth.category}</span>
                    </div>
                    <div class="meta-row">
                        <span class="label">Available Stock:</span>
                        <span class="value">${cloth.stock} units</span>
                    </div>
                </div>

                <!-- Sales Details Form -->
                <div class="sales-form-section">
                    <h3>📝 Sale Details</h3>
                    
                    <!-- Quantity -->
                    <div class="form-group">
                        <label for="sellQuantity">Quantity to Sell:</label>
                        <div class="quantity-controls">
                            <button type="button" class="qty-btn qty-minus" onclick="decreaseQuantity()">−</button>
                            <input type="number" id="sellQuantity" min="1" max="${cloth.stock}" value="1" class="quantity-input" onchange="updateSaleCalculation('${cloth.id}')" oninput="updateSaleCalculation('${cloth.id}')">
                            <button type="button" class="qty-btn qty-plus" onclick="increaseQuantity('${cloth.stock}')">+</button>
                        </div>
                    </div>

                    <!-- Unit Price (Editable) -->
                    <div class="form-group">
                        <label for="saleUnitPrice">Unit Price (₹):</label>
                        <input type="number" id="saleUnitPrice" step="0.01" value="${unitPrice.toFixed(2)}" class="form-input" onchange="updateSaleCalculation('${cloth.id}')" oninput="updateSaleCalculation('${cloth.id}')">
                    </div>

                    <!-- Discount Percentage -->
                    <div class="form-group">
                        <label for="saleDiscount">Discount (%):</label>
                        <input type="number" id="saleDiscount" min="0" max="100" step="0.5" value="0" class="form-input" onchange="updateSaleCalculation('${cloth.id}')" oninput="updateSaleCalculation('${cloth.id}')">
                    </div>

                    <!-- Final Price Display -->
                    <div class="price-calculation">
                        <div class="price-row">
                            <span class="price-label">Subtotal:</span>
                            <span class="price-value" id="subtotalDisplay">₹ ${unitPrice.toFixed(2)}</span>
                        </div>
                        <div class="price-row">
                            <span class="price-label">Discount Amount:</span>
                            <span class="price-value" id="discountAmountDisplay">₹ 0.00</span>
                        </div>
                        <div class="price-row final">
                            <span class="price-label">Final Price Per Unit:</span>
                            <span class="price-value" id="finalUnitPriceDisplay">₹ ${unitPrice.toFixed(2)}</span>
                        </div>
                        <div class="price-row total">
                            <span class="price-label">Total Amount:</span>
                            <span class="price-value" id="totalAmountDisplay">₹ ${unitPrice.toFixed(2)}</span>
                        </div>
                    </div>

                    <!-- Notes (Optional) -->
                    <div class="form-group">
                        <label for="saleNotes">Notes (Optional):</label>
                        <textarea id="saleNotes" class="form-textarea" placeholder="Any additional notes..." rows="2"></textarea>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="result-actions">
                    <button class="btn btn-success btn-large" onclick="handleSearchResultSold('${cloth.id}')">✓ Complete Sale</button>
                    <button class="btn btn-warning btn-large" onclick="handleSearchResultReceive('${cloth.id}')">🛍️ Receive Stock</button>
                    <button class="btn btn-secondary btn-large" onclick="clearSearchResults()">✕ Cancel</button>
                </div>
            </div>
        </div>
    `;
}

function clearSearchResults() {
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    searchResultsContainer.style.display = 'none';
}

function clearAdminSearch() {
    const searchInput = document.getElementById('adminSearchId');
    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
    }
    clearSearchResults();
}

// Quantity control functions
function increaseQuantity(maxStock) {
    const quantityInput = document.getElementById('sellQuantity');
    if (quantityInput) {
        let currentQty = parseInt(quantityInput.value) || 1;
        if (currentQty < maxStock) {
            quantityInput.value = currentQty + 1;
            calculateTotalPrice();
        }
    }
}

function decreaseQuantity() {
    const quantityInput = document.getElementById('sellQuantity');
    if (quantityInput) {
        let currentQty = parseInt(quantityInput.value) || 1;
        if (currentQty > 1) {
            quantityInput.value = currentQty - 1;
            calculateTotalPrice();
        }
    }
}

function calculateTotalPrice(clothId) {
    const quantityInput = document.getElementById('sellQuantity');
    const totalPriceDisplay = document.getElementById('totalPriceDisplay');
    
    if (!quantityInput || !totalPriceDisplay) return;
    
    const quantity = parseInt(quantityInput.value) || 1;
    const clothes = getClothes();
    const cloth = clothes.find(c => c.id === clothId);
    
    if (!cloth) return;
    
    const unitPrice = parseFloat(cloth.price || 0);
    const totalPrice = quantity * unitPrice;
    
    totalPriceDisplay.textContent = `₹ ${totalPrice.toFixed(2)}`;
}

function updateSaleCalculation(clothId) {
    const quantityInput = document.getElementById('sellQuantity');
    const unitPriceInput = document.getElementById('saleUnitPrice');
    const discountInput = document.getElementById('saleDiscount');
    
    if (!quantityInput || !unitPriceInput || !discountInput) return;
    
    const quantity = parseInt(quantityInput.value) || 1;
    const unitPrice = parseFloat(unitPriceInput.value) || 0;
    const discountPercent = parseFloat(discountInput.value) || 0;
    
    // Calculations
    const subtotal = quantity * unitPrice;
    const discountAmount = (subtotal * discountPercent) / 100;
    const finalUnitPrice = unitPrice - (unitPrice * discountPercent / 100);
    const totalAmount = quantity * finalUnitPrice;
    
    // Update displays
    document.getElementById('subtotalDisplay').textContent = `₹ ${subtotal.toFixed(2)}`;
    document.getElementById('discountAmountDisplay').textContent = `₹ ${discountAmount.toFixed(2)}`;
    document.getElementById('finalUnitPriceDisplay').textContent = `₹ ${finalUnitPrice.toFixed(2)}`;
    document.getElementById('totalAmountDisplay').textContent = `₹ ${totalAmount.toFixed(2)}`;
}

function handleSearchResultSold(clothId) {
    const cloth = getClothes().find(c => c.id === clothId);
    if (!cloth) return;

    const quantityInput = document.getElementById('sellQuantity');
    const unitPriceInput = document.getElementById('saleUnitPrice');
    const discountInput = document.getElementById('saleDiscount');
    const notesInput = document.getElementById('saleNotes');
    
    const quantity = parseInt(quantityInput?.value) || 1;
    const unitPrice = parseFloat(unitPriceInput?.value) || parseFloat(cloth.price || 0);
    const discountPercent = parseFloat(discountInput?.value) || 0;
    const notes = notesInput?.value.trim() || '';
    
    if (quantity > cloth.stock) {
        alert(`❌ Cannot sell ${quantity} units. Only ${cloth.stock} units in stock.`);
        return;
    }
    
    if (quantity <= 0) {
        alert('❌ Please enter a valid quantity');
        return;
    }

    if (unitPrice < 0) {
        alert('❌ Price cannot be negative');
        return;
    }

    if (discountPercent < 0 || discountPercent > 100) {
        alert('❌ Discount must be between 0-100%');
        return;
    }

    // Calculate final price
    const discountAmount = (unitPrice * discountPercent) / 100;
    const finalUnitPrice = unitPrice - discountAmount;
    const totalAmount = quantity * finalUnitPrice;

    // Record sale
    const sales = getSales();
    
    sales.push({
        id: 'sale_' + Date.now(),
        clothId: clothId,
        quantity: quantity,
        originalPrice: unitPrice,
        discountPercent: discountPercent,
        finalPrice: finalUnitPrice,
        price: finalUnitPrice,
        totalAmount: totalAmount,
        notes: notes,
        timestamp: new Date().toISOString()
    });

    // Update stock
    const clothes = getClothes();
    const clothIndex = clothes.findIndex(c => c.id === clothId);
    if (clothIndex !== -1) {
        clothes[clothIndex].stock -= quantity;
        saveClothes(clothes);
    }

    saveSales(sales);

    // Show success message
    alert(`✓ Sale Completed!\n\nProduct: ${cloth.brand}\nQuantity: ${quantity} units\nUnit Price: ₹${unitPrice.toFixed(2)}\nDiscount: ${discountPercent}%\nTotal Amount: ₹${totalAmount.toFixed(2)}\n\nRemaining Stock: ${clothes[clothIndex].stock} units`);
    
    clearSearchResults();
    loadOwnerDashboard();
}

function handleSearchResultReceive(clothId) {
    const clothes = getClothes();
    const cloth = clothes.find(c => c.id === clothId);
    
    if (!cloth) return;

    cloth.stock += 1;
    saveClothes(clothes);

    alert(`✓ 1 unit received! New stock: ${cloth.stock}`);
    loadOwnerDashboard();
}

function displayAllProductsFullView() {
    const allProductsContainer = document.getElementById('allProductsContainer');
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    
    // Hide search results
    searchResultsContainer.style.display = 'none';
    
    // Show all products
    allProductsContainer.style.display = 'block';
    displayOwnerClothes();
}

function hideAllProductsView() {
    const allProductsContainer = document.getElementById('allProductsContainer');
    allProductsContainer.style.display = 'none';
}

// ============================================
// ADD CLOTH FUNCTIONALITY
// ============================================

function openAddClothModal() {
    addClothForm.reset();
    document.getElementById('clothImage').value = '';
    addClothModal.classList.add('show');
}

function closeAddClothModal() {
    addClothModal.classList.remove('show');
}

function handleAddCloth(e) {
    e.preventDefault();

    const imageInput = document.getElementById('clothImage');
    const brand = document.getElementById('clothBrand').value.trim();
    const color = document.getElementById('clothColor').value;
    const size = document.getElementById('clothSize').value;
    const category = document.getElementById('clothCategory').value;
    const stock = parseInt(document.getElementById('clothStock').value) || 0;
    const price = document.getElementById('clothPrice').value || '';
    const description = document.getElementById('clothDescription').value.trim() || '';

    if (!imageInput.files[0]) {
        alert('Please select an image');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const clothes = getClothes();
        const newCloth = {
            id: 'CLT' + String(clothes.length + 1).padStart(3, '0'),
            brand: brand,
            color: color,
            size: size,
            category: category,
            stock: stock,
            price: price,
            description: description,
            image: e.target.result
        };

        clothes.push(newCloth);
        saveClothes(clothes);

        addClothForm.reset();
        closeAddClothModal();
        loadOwnerDashboard();
        alert('Cloth added successfully!');
    };

    reader.readAsDataURL(imageInput.files[0]);
}

// ============================================
// EDIT CLOTH FUNCTIONALITY
// ============================================

function openEditClothModal(clothId) {
    const clothes = getClothes();
    const cloth = clothes.find(c => c.id === clothId);

    if (!cloth) return;

    document.getElementById('editClothId').value = cloth.id;
    document.getElementById('editClothBrand').value = cloth.brand;
    document.getElementById('editClothColor').value = cloth.color;
    document.getElementById('editClothSize').value = cloth.size;
    document.getElementById('editClothCategory').value = cloth.category || '';
    document.getElementById('editClothStock').value = cloth.stock || 0;
    document.getElementById('editClothPrice').value = cloth.price || '';
    document.getElementById('editClothDescription').value = cloth.description || '';

    // Show current image
    const preview = document.getElementById('currentImagePreview');
    preview.innerHTML = `<img src="${cloth.image}" alt="Current">`;

    editClothModal.classList.add('show');
}

function closeEditClothModal() {
    editClothModal.classList.remove('show');
}

function handleEditCloth(e) {
    e.preventDefault();

    const clothId = document.getElementById('editClothId').value;
    const imageInput = document.getElementById('editClothImage');
    const brand = document.getElementById('editClothBrand').value.trim();
    const color = document.getElementById('editClothColor').value;
    const size = document.getElementById('editClothSize').value;
    const category = document.getElementById('editClothCategory').value;
    const stock = parseInt(document.getElementById('editClothStock').value) || 0;
    const price = document.getElementById('editClothPrice').value || '';
    const description = document.getElementById('editClothDescription').value.trim() || '';

    let clothes = getClothes();
    let cloth = clothes.find(c => c.id === clothId);

    if (!cloth) return;

    cloth.brand = brand;
    cloth.color = color;
    cloth.size = size;
    cloth.category = category;
    cloth.stock = stock;
    cloth.price = price;
    cloth.description = description;

    // Update image if provided
    if (imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            cloth.image = e.target.result;
            saveClothes(clothes);
            closeEditClothModal();
            loadOwnerDashboard();
            displayClothes();
            alert('Cloth updated successfully!');
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        saveClothes(clothes);
        closeEditClothModal();
        loadOwnerDashboard();
        displayClothes();
        alert('Cloth updated successfully!');
    }
}

// ============================================
// DELETE CLOTH FUNCTIONALITY
// ============================================

function deleteCloth(clothId) {
    if (confirm('Are you sure you want to delete this cloth?')) {
        let clothes = getClothes();
        clothes = clothes.filter(c => c.id !== clothId);
        saveClothes(clothes);

        // Remove associated likes and comments
        let likes = getLikes();
        likes = likes.filter(l => l.clothId !== clothId);
        saveLikes(likes);

        let comments = getComments();
        comments = comments.filter(c => c.clothId !== clothId);
        saveComments(comments);

        loadOwnerDashboard();
        alert('Cloth deleted successfully!');
    }
}

// ============================================
// COMMENTS MANAGEMENT (OWNER)
// ============================================

function viewClothComments(clothId) {
    const comments = getComments();
    const clothComments = comments.filter(c => c.clothId === clothId);
    const commentsList = document.getElementById('allCommentsList');

    commentsList.innerHTML = '';

    if (clothComments.length === 0) {
        commentsList.innerHTML = '<p style="text-align: center; color: #999;">No comments for this cloth</p>';
    } else {
        clothComments.forEach(comment => {
            const div = document.createElement('div');
            div.className = 'comment';

            div.innerHTML = `
                <div class="comment-header">
                    <div>
                        <div class="comment-user">${comment.userName}</div>
                        <div class="comment-date">${new Date(comment.timestamp).toLocaleDateString()}</div>
                    </div>
                </div>
                <div class="comment-text">${escapeHtml(comment.text)}</div>
                <div class="comment-actions">
                    <button class="btn btn-small btn-delete-comment" onclick="deleteCommentOwner('${comment.id}')">Delete</button>
                </div>
            `;

            commentsList.appendChild(div);
        });
    }

    allCommentsModal.classList.add('show');
}

function deleteCommentOwner(commentId) {
    if (confirm('Delete this comment?')) {
        let comments = getComments();
        comments = comments.filter(c => c.id !== commentId);
        saveComments(comments);

        // Refresh the comments list
        const commentsList = document.getElementById('allCommentsList');
        const comments_updated = getComments();
        commentsList.innerHTML = '';

        if (comments_updated.length === 0) {
            commentsList.innerHTML = '<p style="text-align: center; color: #999;">No comments</p>';
        } else {
            comments_updated.forEach(comment => {
                const div = document.createElement('div');
                div.className = 'comment';
                div.innerHTML = `
                    <div class="comment-header">
                        <div>
                            <div class="comment-user">${comment.userName}</div>
                            <div class="comment-date">${new Date(comment.timestamp).toLocaleDateString()}</div>
                        </div>
                    </div>
                    <div class="comment-text">${escapeHtml(comment.text)}</div>
                    <div class="comment-actions">
                        <button class="btn btn-small btn-delete-comment" onclick="deleteCommentOwner('${comment.id}')">Delete</button>
                    </div>
                `;
                commentsList.appendChild(div);
            });
        }

        loadOwnerDashboard();
    }
}

function closeAllComments() {
    allCommentsModal.classList.remove('show');
}

// ============================================
// WISHLIST FUNCTIONALITY
// ============================================

function toggleWishlistView() {
    isWishlistView = !isWishlistView;
    if (isWishlistView) {
        wishlistToggleBtn.textContent = '👗 All Clothes';
        wishlistToggleBtn.style.backgroundColor = '#F5AFAF';
    } else {
        wishlistToggleBtn.textContent = '🛍️ My Wishlist ';
        wishlistToggleBtn.style.backgroundColor = '';
    }
    filterClothes();
}

function updateWishlistCount() {
    const wishlist = getWishlist();
    const countElement = document.getElementById('wishlistCount');
    if (countElement) {
        countElement.textContent = wishlist.length;
        // Show badge only if wishlist has items
        if (wishlist.length > 0) {
            countElement.style.display = 'inline-block';
        } else {
            countElement.style.display = 'none';
        }
    }
}

function toggleWishlistItem(clothId) {
    let wishlist = getWishlist();
    const index = wishlist.indexOf(clothId);

    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(clothId);
    }

    saveWishlist(wishlist);
    updateWishlistCount();
    
    // Auto-show wishlist view when item is saved
    if (!isWishlistView && index === -1) {
        isWishlistView = true;
        wishlistToggleBtn.textContent = '👗 All Clothes';
        wishlistToggleBtn.style.backgroundColor = '#F5AFAF';
        filterClothes();
    } else {
        displayClothes();
    }
}

// ============================================
// SOCIAL SHARE FUNCTIONALITY
// ============================================

function shareCloth(clothId) {
    const baseUrl = window.location.href.split('?')[0];
    const shareUrl = baseUrl + '?cloth=' + clothId;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
        const shareMessage = document.getElementById('shareMessage');
        shareMessage.style.display = 'inline';
        setTimeout(() => {
            shareMessage.style.display = 'none';
        }, 3000);
    }).catch(() => {
        alert('Could not copy link to clipboard');
    });
}

// ============================================
// DATA BACKUP FUNCTIONALITY
// ============================================

function backupData() {
    const clothes = getClothes();
    const likes = getLikes();
    const comments = getComments();

    const backupData = {
        clothes: clothes,
        likes: likes,
        comments: comments,
        backupDate: new Date().toLocaleString()
    };

    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cloth-management-backup-' + new Date().getTime() + '.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert('Data backed up successfully!');
}

// ============================================
// TOP PERFORMERS
// ============================================

function getTopPerformers() {
    const clothes = getClothes();
    const likes = getLikes();

    const clothWithLikes = clothes.map(cloth => ({
        ...cloth,
        likeCount: likes.filter(l => l.clothId === cloth.id).length
    }));

    return clothWithLikes.sort((a, b) => b.likeCount - a.likeCount).slice(0, 3);
}

// ============================================
// SOLD PRODUCTS FUNCTIONALITY
// ============================================

function displaySoldProducts() {
    const sales = getSales();
    const clothes = getClothes();
    const soldProductsSection = document.getElementById('soldProductsList');

    if (!soldProductsSection) return;

    soldProductsSection.innerHTML = '';

    if (sales.length === 0) {
        soldProductsSection.innerHTML = '<p style="text-align: center; color: #999; padding: 1rem;">No sales yet</p>';
        return;
    }

    // Sort sales by date (newest first)
    const sortedSales = [...sales].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    sortedSales.forEach((sale) => {
        const cloth = clothes.find(c => c.id === sale.clothId);
        if (!cloth) return;

        const saleDate = new Date(sale.timestamp);
        const formattedDate = saleDate.toLocaleDateString();
        const formattedTime = saleDate.toLocaleTimeString();
        const totalAmount = (sale.quantity || 1) * (parseFloat(sale.price) || 0);

        const saleItem = document.createElement('div');
        saleItem.className = 'sold-product-item';
        saleItem.innerHTML = `
            <div class="sold-product-info">
                <div class="sold-product-name"><strong>${cloth.brand}</strong> (ID: ${cloth.id})</div>
                <div class="sold-product-details">
                    <span>${cloth.color} | ${cloth.size}</span>
                    <span style="margin-left: 1rem;">Qty: ${sale.quantity || 1}</span>
                </div>
                <div class="sold-product-date">${formattedDate} at ${formattedTime}</div>
            </div>
            <div class="sold-product-amount">₹ ${totalAmount.toFixed(2)}</div>
        `;

        soldProductsSection.appendChild(saleItem);
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === ownerLoginModal) {
        ownerLoginModal.classList.remove('show');
    }
    if (e.target === clothDetailsModal) {
        closeClothDetails();
    }
    if (e.target === addClothModal) {
        closeAddClothModal();
    }
    if (e.target === editClothModal) {
        closeEditClothModal();
    }
    if (e.target === allCommentsModal) {
        closeAllComments();
    }
    const shopInfoModal = document.getElementById('shopInfoModal');
    if (e.target === shopInfoModal) {
        closeShopInfo();
    }
});

// ==================== PROFESSIONAL FEATURES ====================

// OWNER DASHBOARD TABS
function switchDashboardTab(tabName) {
    const tabs = document.querySelectorAll('.dashboard-tab-content');
    const buttons = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => tab.style.display = 'none');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName + 'Tab').style.display = 'block';
    event.target.classList.add('active');
}

// CUSTOMER TABS
function switchUserTab(tabName) {
    const tabs = document.querySelectorAll('.user-tab-content');
    const buttons = document.querySelectorAll('.user-tab-btn');
    
    tabs.forEach(tab => tab.style.display = 'none');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName + 'Tab').style.display = 'block';
    event.target.classList.add('active');
}

// Analytics: Calculate and display sales analytics
function calculateAnalytics() {
    const sales = getSales();
    
    if (sales.length === 0) {
        document.getElementById('avgSalePrice').textContent = '₹ 0';
        document.getElementById('totalTransactions').textContent = '0';
        document.getElementById('highestSale').textContent = '₹ 0';
        document.getElementById('lowestSale').textContent = '₹ 0';
        return;
    }
    
    const totalAmount = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const avgPrice = (totalAmount / sales.length).toFixed(2);
    const pricesSold = sales.map(s => s.totalAmount).sort((a, b) => a - b);
    
    document.getElementById('avgSalePrice').textContent = '₹ ' + avgPrice;
    document.getElementById('totalTransactions').textContent = sales.length;
    document.getElementById('highestSale').textContent = '₹ ' + pricesSold[pricesSold.length - 1].toFixed(2);
    document.getElementById('lowestSale').textContent = '₹ ' + pricesSold[0].toFixed(2);
}

// Low Stock Alert
function displayLowStockAlert() {
    const clothes = getClothes();
    const lowStockItems = clothes.filter(c => c.stock < 5);
    const container = document.getElementById('lowStockList');
    
    if (lowStockItems.length === 0) {
        container.innerHTML = '<p style="color: green;">✓ All products have sufficient stock</p>';
        return;
    }
    
    container.innerHTML = lowStockItems.map(item => `
        <div class="low-stock-item">
            <span>${item.brand} (${item.color}, ${item.size})</span>
            <span class="stock-badge" style="color: #f5a5a5;">Stock: ${item.stock}</span>
        </div>
    `).join('');
}

// Inventory Summary
function displayInventorySummary() {
    const clothes = getClothes();
    const summary = document.getElementById('inventorySummary');
    
    const totalItems = clothes.reduce((sum, c) => sum + c.stock, 0);
    const categories = {};
    clothes.forEach(c => {
        categories[c.category] = (categories[c.category] || 0) + c.stock;
    });
    
    summary.innerHTML = `
        <table class="summary-table">
            <tr><td>Total Items in Stock:</td><td><strong>${totalItems}</strong></td></tr>
            ${Object.entries(categories).map(([cat, qty]) => 
                `<tr><td>${cat.charAt(0).toUpperCase() + cat.slice(1)}:</td><td><strong>${qty}</strong></td></tr>`
            ).join('')}
        </table>
    `;
}

// Generate Sales Report
function generateSalesReport() {
    const sales = getSales();
    const reportContent = document.getElementById('reportContent');
    
    if (sales.length === 0) {
        reportContent.innerHTML = '<p>No sales data available</p>';
        return;
    }
    
    const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    
    reportContent.innerHTML = `
        <div class="report">
            <h3>📊 Sales Report</h3>
            <p><strong>Report Generated:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Total Sales:</strong> ${sales.length}</p>
            <p><strong>Total Revenue:</strong> ₹ ${totalRevenue.toFixed(2)}</p>
            <h4>Sales Details:</h4>
            <table class="report-table">
                <tr><th>Cloth ID</th><th>Quantity</th><th>Unit Price</th><th>Total</th><th>Date</th></tr>
                ${sales.map(s => `
                    <tr>
                        <td>${s.clothId}</td>
                        <td>${s.quantity}</td>
                        <td>₹ ${s.unitPrice.toFixed(2)}</td>
                        <td>₹ ${s.totalAmount.toFixed(2)}</td>
                        <td>${new Date(s.timestamp).toLocaleDateString()}</td>
                    </tr>
                `).join('')}
            </table>
        </div>
    `;
}

// Generate Inventory Report
function generateInventoryReport() {
    const clothes = getClothes();
    const reportContent = document.getElementById('reportContent');
    
    reportContent.innerHTML = `
        <div class="report">
            <h3>📦 Inventory Report</h3>
            <p><strong>Report Generated:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Total Products:</strong> ${clothes.length}</p>
            <h4>Inventory Details:</h4>
            <table class="report-table">
                <tr><th>ID</th><th>Brand</th><th>Category</th><th>Stock</th><th>Price</th></tr>
                ${clothes.map(c => `
                    <tr>
                        <td>${c.id}</td>
                        <td>${c.brand}</td>
                        <td>${c.category}</td>
                        <td>${c.stock}</td>
                        <td>₹ ${c.price ? c.price.toFixed(2) : 'N/A'}</td>
                    </tr>
                `).join('')}
            </table>
        </div>
    `;
}

// Generate Income Report
function generateIncomeReport() {
    const sales = getSales();
    const reportContent = document.getElementById('reportContent');
    
    const totalIncome = sales.reduce((sum, s) => sum + (s.finalPrice || s.totalAmount), 0);
    const totalDiscount = sales.reduce((sum, s) => sum + (s.discountAmount || 0), 0);
    
    reportContent.innerHTML = `
        <div class="report">
            <h3>💰 Income Report</h3>
            <p><strong>Report Generated:</strong> ${new Date().toLocaleString()}</p>
            <table class="income-table">
                <tr><td>Gross Revenue:</td><td><strong>₹ ${(totalIncome + totalDiscount).toFixed(2)}</strong></td></tr>
                <tr><td>Total Discount Given:</td><td><strong>-₹ ${totalDiscount.toFixed(2)}</strong></td></tr>
                <tr><td><strong>Net Income:</strong></td><td><strong style="color: green;">₹ ${totalIncome.toFixed(2)}</strong></td></tr>
                <tr><td>Total Transactions:</td><td><strong>${sales.length}</strong></td></tr>
            </table>
        </div>
    `;
}

// Export to CSV
function exportToCSV() {
    const clothes = getClothes();
    const sales = getSales();
    
    let csv = 'INVENTORY EXPORT\n';
    csv += 'ID,Brand,Category,Color,Size,Stock,Price\n';
    csv += clothes.map(c => 
        `${c.id},${c.brand},${c.category},${c.color},${c.size},${c.stock},${c.price || 'N/A'}`
    ).join('\n');
    
    csv += '\n\nSALES EXPORT\n';
    csv += 'Cloth ID,Quantity,Unit Price,Total Amount,Discount,Final Price,Date\n';
    csv += sales.map(s => 
        `${s.clothId},${s.quantity},${s.unitPrice},${s.totalAmount},${s.discountAmount || 0},${s.finalPrice || s.totalAmount},${new Date(s.timestamp).toLocaleDateString()}`
    ).join('\n');
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `ClothHub_Export_${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    alert('✓ Data exported successfully!');
}

// Download Analytics Report as PDF-like text
function downloadAnalyticsReport() {
    const sales = getSales();
    const clothes = getClothes();
    const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    
    const report = `
╔════════════════════════════════════════╗
║      CLOTHHUB - ANALYTICS REPORT       ║
╚════════════════════════════════════════╝

Generated: ${new Date().toLocaleString()}

SALES SUMMARY
─────────────────────────────────────────
Total Products Sold: ${sales.length}
Total Revenue: ₹ ${totalRevenue.toFixed(2)}
Average Sale: ₹ ${(totalRevenue / sales.length || 0).toFixed(2)}
Total Unique Customers: ${new Set(sales.map(s => s.customerId)).size}

INVENTORY STATUS
─────────────────────────────────────────
Total Products in System: ${clothes.length}
Total Stock Available: ${clothes.reduce((sum, c) => sum + c.stock, 0)}
Low Stock Items (<5): ${clothes.filter(c => c.stock < 5).length}

TOP SELLERS
─────────────────────────────────────────
${clothes
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, 5)
    .map((c, i) => `${i + 1}. ${c.brand} (${c.color}, ${c.size}) - ${c.sold || 0} sold`)
    .join('\n')}

════════════════════════════════════════
Report End - ${new Date().getFullYear()}
════════════════════════════════════════
    `;
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(report));
    element.setAttribute('download', `Analytics_Report_${new Date().toISOString().split('T')[0]}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    alert('✓ Analytics report downloaded!');
}

// Update Total Revenue in Dashboard
function updateTotalRevenue() {
    const sales = getSales();
    const totalRevenue = sales.reduce((sum, s) => sum + (s.finalPrice || s.totalAmount), 0);
    document.getElementById('totalRevenue').textContent = '₹ ' + totalRevenue.toFixed(2);
}

