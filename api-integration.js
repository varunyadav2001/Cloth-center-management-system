/**
 * Optional: Backend API Integration Guide
 * This file shows how to modify your script.js to use the PHP backend APIs
 * instead of localStorage
 * 
 * Usage: Replace the corresponding functions in script.js with these versions
 */

const API_URL = 'api.php';

// ============================================
// CLOTHES API FUNCTIONS
// ============================================

/**
 * Get all clothes from database
 */
async function getClothesFromAPI() {
    try {
        const response = await fetch(`${API_URL}?action=get_clothes`);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        } else {
            console.error('Error fetching clothes:', data.message);
            return [];
        }
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
}

/**
 * Save cloth to database
 */
async function saveClothToDB(cloth) {
    try {
        const response = await fetch(`${API_URL}?action=add_cloth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cloth)
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('Cloth added with ID:', data.id);
            return data;
        } else {
            console.error('Error saving cloth:', data.message);
            return null;
        }
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

/**
 * Update cloth in database
 */
async function updateClothInDB(cloth) {
    try {
        const response = await fetch(`${API_URL}?action=update_cloth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cloth)
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('Cloth updated');
            return data;
        } else {
            console.error('Error updating cloth:', data.message);
            return null;
        }
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

/**
 * Delete cloth from database
 */
async function deleteClothFromDB(id) {
    try {
        const response = await fetch(`${API_URL}?action=delete_cloth&id=${id}`);
        const data = await response.json();
        
        if (data.success) {
            console.log('Cloth deleted');
            return data;
        } else {
            console.error('Error deleting cloth:', data.message);
            return null;
        }
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

// ============================================
// SALES API FUNCTIONS
// ============================================

/**
 * Get all sales from database
 */
async function getSalesFromAPI() {
    try {
        const response = await fetch(`${API_URL}?action=get_sales`);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        } else {
            console.error('Error fetching sales:', data.message);
            return [];
        }
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
}

/**
 * Record a sale to database
 */
async function saveSaleToDB(sale) {
    try {
        const response = await fetch(`${API_URL}?action=add_sale`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sale)
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('Sale recorded');
            return data;
        } else {
            console.error('Error saving sale:', data.message);
            return null;
        }
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

/**
 * Get sales statistics
 */
async function getSalesStatsFromAPI() {
    try {
        const response = await fetch(`${API_URL}?action=get_sales_stats`);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        } else {
            console.error('Error fetching stats:', data.message);
            return null;
        }
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

// ============================================
// REVIEWS API FUNCTIONS
// ============================================

/**
 * Get reviews from database (optional: filter by clothId)
 */
async function getReviewsFromAPI(clothId = null) {
    try {
        const url = clothId 
            ? `${API_URL}?action=get_reviews&clothId=${clothId}`
            : `${API_URL}?action=get_reviews`;
            
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        } else {
            console.error('Error fetching reviews:', data.message);
            return [];
        }
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
}

/**
 * Save review to database
 */
async function saveReviewToDB(review) {
    try {
        const response = await fetch(`${API_URL}?action=add_review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(review)
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('Review added');
            return data;
        } else {
            console.error('Error saving review:', data.message);
            return null;
        }
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

/**
 * Delete review from database
 */
async function deleteReviewFromDB(id) {
    try {
        const response = await fetch(`${API_URL}?action=delete_review&id=${id}`);
        const data = await response.json();
        
        if (data.success) {
            console.log('Review deleted');
            return data;
        } else {
            console.error('Error deleting review:', data.message);
            return null;
        }
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

// ============================================
// WISHLIST API FUNCTIONS
// ============================================

/**
 * Get wishlist from database
 */
async function getWishlistFromAPI() {
    try {
        const response = await fetch(`${API_URL}?action=get_wishlist`);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        } else {
            console.error('Error fetching wishlist:', data.message);
            return [];
        }
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
}

/**
 * Add item to wishlist
 */
async function addToWishlistAPI(clothId) {
    try {
        const response = await fetch(`${API_URL}?action=add_to_wishlist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ clothId: clothId })
        });
        
        const data = await response.json();
        
        if (data.success) {
            console.log('Added to wishlist');
            return data;
        } else {
            console.error('Error adding to wishlist:', data.message);
            return null;
        }
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

/**
 * Remove item from wishlist
 */
async function removeFromWishlistAPI(clothId) {
    try {
        const response = await fetch(`${API_URL}?action=remove_from_wishlist&clothId=${clothId}`);
        const data = await response.json();
        
        if (data.success) {
            console.log('Removed from wishlist');
            return data;
        } else {
            console.error('Error removing from wishlist:', data.message);
            return null;
        }
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

// ============================================
// EXAMPLE: How to use in your existing code
// ============================================

/**
 * EXAMPLE: Replace loadOwnerDashboard() with API version
 * 
 * async function loadOwnerDashboard() {
 *     // Clean up old sales
 *     await cleanupOldSales();
 *     
 *     // Get clothes from API
 *     const clothes = await getClothesFromAPI();
 *     
 *     // Get sales from API
 *     const sales = await getSalesFromAPI();
 *     
 *     // Update statistics
 *     updateStatistics(clothes, sales);
 *     
 *     // Display data
 *     displayOwnerClothes(clothes);
 * }
 */

/**
 * EXAMPLE: Replace displayClothes() with API version
 * 
 * async function displayClothes() {
 *     const clothes = await getClothesFromAPI();
 *     
 *     if (clothes.length === 0) {
 *         noResults.style.display = 'block';
 *         return;
 *     }
 *     
 *     noResults.style.display = 'none';
 *     clothesGrid.innerHTML = '';
 *     
 *     clothes.forEach(cloth => {
 *         const card = createClothCard(cloth);
 *         clothesGrid.appendChild(card);
 *     });
 * }
 */
