<?php
require_once 'config.php';

// Get request method
$request_method = $_SERVER['REQUEST_METHOD'];
$request_uri = isset($_GET['action']) ? $_GET['action'] : '';

// Handle different endpoints
switch($request_uri) {
    // CLOTHES ENDPOINTS
    case 'get_clothes':
        getClothes();
        break;
    case 'add_cloth':
        addCloth();
        break;
    case 'update_cloth':
        updateCloth();
        break;
    case 'delete_cloth':
        deleteCloth();
        break;
    
    // SALES ENDPOINTS
    case 'get_sales':
        getSales();
        break;
    case 'add_sale':
        addSale();
        break;
    case 'get_sales_stats':
        getSalesStats();
        break;
    
    // REVIEWS ENDPOINTS
    case 'get_reviews':
        getReviews();
        break;
    case 'add_review':
        addReview();
        break;
    case 'delete_review':
        deleteReview();
        break;
    
    // WISHLIST ENDPOINTS
    case 'get_wishlist':
        getWishlist();
        break;
    case 'add_to_wishlist':
        addToWishlist();
        break;
    case 'remove_from_wishlist':
        removeFromWishlist();
        break;
    
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid endpoint']);
}

// ============ CLOTHES FUNCTIONS ============

function getClothes() {
    global $conn;
    $result = $conn->query("SELECT * FROM clothes ORDER BY created_at DESC");
    $clothes = [];
    while($row = $result->fetch_assoc()) {
        $clothes[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $clothes]);
}

function addCloth() {
    global $conn;
    $data = json_decode(file_get_contents("php://input"), true);
    
    $brand = $conn->real_escape_string($data['brand']);
    $color = $conn->real_escape_string($data['color']);
    $size = $conn->real_escape_string($data['size']);
    $category = $conn->real_escape_string($data['category']);
    $stock = intval($data['stock']);
    $price = floatval($data['price']);
    $description = $conn->real_escape_string($data['description']);
    $image = $data['image']; // Base64 or URL
    
    $sql = "INSERT INTO clothes (brand, color, size, category, stock, price, description, image, created_at) 
            VALUES ('$brand', '$color', '$size', '$category', $stock, $price, '$description', '$image', NOW())";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'id' => $conn->insert_id, 'message' => 'Cloth added successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
    }
}

function updateCloth() {
    global $conn;
    $data = json_decode(file_get_contents("php://input"), true);
    
    $id = intval($data['id']);
    $brand = $conn->real_escape_string($data['brand']);
    $color = $conn->real_escape_string($data['color']);
    $size = $conn->real_escape_string($data['size']);
    $category = $conn->real_escape_string($data['category']);
    $stock = intval($data['stock']);
    $price = floatval($data['price']);
    $description = $conn->real_escape_string($data['description']);
    
    $sql = "UPDATE clothes SET brand='$brand', color='$color', size='$size', category='$category', 
            stock=$stock, price=$price, description='$description' WHERE id=$id";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Cloth updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
    }
}

function deleteCloth() {
    global $conn;
    $id = intval($_GET['id']);
    
    $sql = "DELETE FROM clothes WHERE id=$id";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Cloth deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
    }
}

// ============ SALES FUNCTIONS ============

function getSales() {
    global $conn;
    $result = $conn->query("SELECT * FROM sales ORDER BY timestamp DESC");
    $sales = [];
    while($row = $result->fetch_assoc()) {
        $sales[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $sales]);
}

function addSale() {
    global $conn;
    $data = json_decode(file_get_contents("php://input"), true);
    
    $clothId = $conn->real_escape_string($data['clothId']);
    $quantity = intval($data['quantity']);
    $unitPrice = floatval($data['unitPrice']);
    $discountAmount = floatval($data['discountAmount']);
    $finalPrice = floatval($data['finalPrice']);
    $totalAmount = floatval($data['totalAmount']);
    $notes = $conn->real_escape_string($data['notes']);
    
    $sql = "INSERT INTO sales (cloth_id, quantity, unit_price, discount_amount, final_price, total_amount, notes, timestamp) 
            VALUES ('$clothId', $quantity, $unitPrice, $discountAmount, $finalPrice, $totalAmount, '$notes', NOW())";
    
    if ($conn->query($sql) === TRUE) {
        // Update cloth stock
        $conn->query("UPDATE clothes SET stock = stock - $quantity WHERE id='$clothId'");
        
        echo json_encode(['success' => true, 'id' => $conn->insert_id, 'message' => 'Sale recorded successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
    }
}

function getSalesStats() {
    global $conn;
    $result = $conn->query("SELECT 
        COUNT(*) as total_sales,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_sale,
        MAX(total_amount) as highest_sale,
        MIN(total_amount) as lowest_sale
    FROM sales");
    
    $stats = $result->fetch_assoc();
    echo json_encode(['success' => true, 'data' => $stats]);
}

// ============ REVIEWS FUNCTIONS ============

function getReviews() {
    global $conn;
    $clothId = isset($_GET['clothId']) ? $_GET['clothId'] : '';
    
    if ($clothId) {
        $clothId = $conn->real_escape_string($clothId);
        $sql = "SELECT * FROM reviews WHERE cloth_id='$clothId' ORDER BY created_at DESC";
    } else {
        $sql = "SELECT * FROM reviews ORDER BY created_at DESC";
    }
    
    $result = $conn->query($sql);
    $reviews = [];
    while($row = $result->fetch_assoc()) {
        $reviews[] = $row;
    }
    echo json_encode(['success' => true, 'data' => $reviews]);
}

function addReview() {
    global $conn;
    $data = json_decode(file_get_contents("php://input"), true);
    
    $clothId = $conn->real_escape_string($data['clothId']);
    $rating = intval($data['rating']);
    $comment = $conn->real_escape_string($data['comment']);
    $userName = $conn->real_escape_string($data['userName']);
    
    $sql = "INSERT INTO reviews (cloth_id, rating, comment, user_name, created_at) 
            VALUES ('$clothId', $rating, '$comment', '$userName', NOW())";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'id' => $conn->insert_id, 'message' => 'Review added successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
    }
}

function deleteReview() {
    global $conn;
    $id = intval($_GET['id']);
    
    $sql = "DELETE FROM reviews WHERE id=$id";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Review deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
    }
}

// ============ WISHLIST FUNCTIONS ============

function getWishlist() {
    global $conn;
    $result = $conn->query("SELECT * FROM wishlist ORDER BY created_at DESC");
    $wishlist = [];
    while($row = $result->fetch_assoc()) {
        $wishlist[] = $row['cloth_id'];
    }
    echo json_encode(['success' => true, 'data' => $wishlist]);
}

function addToWishlist() {
    global $conn;
    $data = json_decode(file_get_contents("php://input"), true);
    
    $clothId = $conn->real_escape_string($data['clothId']);
    
    // Check if already in wishlist
    $check = $conn->query("SELECT id FROM wishlist WHERE cloth_id='$clothId'");
    if ($check->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Already in wishlist']);
        return;
    }
    
    $sql = "INSERT INTO wishlist (cloth_id, created_at) VALUES ('$clothId', NOW())";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Added to wishlist']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
    }
}

function removeFromWishlist() {
    global $conn;
    $clothId = $conn->real_escape_string($_GET['clothId']);
    
    $sql = "DELETE FROM wishlist WHERE cloth_id='$clothId'";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Removed from wishlist']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
    }
}
?>
