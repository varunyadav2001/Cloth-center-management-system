# ClothHub Backend Setup Guide

## 📋 Overview
This backend connects your ClothHub cloth management system to a MySQL database via phpMyAdmin. The system uses PHP APIs to handle all CRUD operations for clothes, sales, reviews, and wishlist.

---

## 🚀 Installation Steps

### Step 1: Create Database in phpMyAdmin
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Click on "SQL" tab
3. Copy and paste the content from `database.sql` file
4. Click "Go" to execute

Alternatively:
1. Create a new database named `clothhub`
2. Select the database
3. Import the `database.sql` file using "Import" tab

### Step 2: Verify Database Connection
- Update `config.php` if needed:
  - `DB_HOST`: localhost (default)
  - `DB_USER`: root (default)
  - `DB_PASS`: (usually empty for local development)
  - `DB_NAME`: clothhub

### Step 3: Test the APIs
Open your browser and test:
```
http://localhost/Rohit%20project/cloth%20projet/api.php?action=get_clothes
```

---

## 📡 API Endpoints

### Clothes Management

#### Get All Clothes
```
GET: api.php?action=get_clothes
```

#### Add New Cloth
```
POST: api.php?action=add_cloth
Body (JSON):
{
    "brand": "Nike",
    "color": "Red",
    "size": "M",
    "category": "tops",
    "stock": 50,
    "price": 49.99,
    "description": "Premium t-shirt",
    "image": "base64_encoded_image_or_url"
}
```

#### Update Cloth
```
POST: api.php?action=update_cloth
Body (JSON):
{
    "id": 1,
    "brand": "Nike",
    "color": "Blue",
    "size": "L",
    "category": "tops",
    "stock": 45,
    "price": 54.99,
    "description": "Updated description"
}
```

#### Delete Cloth
```
GET: api.php?action=delete_cloth&id=1
```

---

### Sales Management

#### Get All Sales
```
GET: api.php?action=get_sales
```

#### Record a Sale
```
POST: api.php?action=add_sale
Body (JSON):
{
    "clothId": "CLT001",
    "quantity": 5,
    "unitPrice": 49.99,
    "discountAmount": 5.00,
    "finalPrice": 44.99,
    "totalAmount": 224.95,
    "notes": "Customer order #123"
}
```

#### Get Sales Statistics
```
GET: api.php?action=get_sales_stats
```

---

### Reviews Management

#### Get All Reviews
```
GET: api.php?action=get_reviews
```

#### Get Reviews for Specific Cloth
```
GET: api.php?action=get_reviews&clothId=CLT001
```

#### Add Review
```
POST: api.php?action=add_review
Body (JSON):
{
    "clothId": "CLT001",
    "rating": 5,
    "comment": "Excellent quality!",
    "userName": "JohnDoe"
}
```

#### Delete Review
```
GET: api.php?action=delete_review&id=1
```

---

### Wishlist Management

#### Get Wishlist
```
GET: api.php?action=get_wishlist
```

#### Add to Wishlist
```
POST: api.php?action=add_to_wishlist
Body (JSON):
{
    "clothId": "CLT001"
}
```

#### Remove from Wishlist
```
GET: api.php?action=remove_from_wishlist&clothId=CLT001
```

---

## 🔧 Database Tables

### clothes
- `id`: Auto-increment primary key
- `brand`: Cloth brand name
- `color`: Cloth color
- `size`: Size (XS, S, M, L, XL, XXL)
- `category`: Category (tops, bottoms, shoes, accessories)
- `stock`: Available quantity
- `price`: Unit price
- `description`: Product description
- `image`: Image data (BLOB)
- `sold`: Number of units sold
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### sales
- `id`: Auto-increment primary key
- `cloth_id`: Reference to cloth
- `quantity`: Units sold
- `unit_price`: Price per unit
- `discount_amount`: Discount given
- `final_price`: Price after discount
- `total_amount`: Final total
- `notes`: Sale notes
- `timestamp`: Sale date/time

### reviews
- `id`: Auto-increment primary key
- `cloth_id`: Reference to cloth
- `rating`: 1-5 star rating
- `comment`: Review text
- `user_name`: Reviewer name
- `created_at`: Review date/time

### wishlist
- `id`: Auto-increment primary key
- `cloth_id`: Reference to cloth
- `created_at`: Added date/time

### users
- `id`: Auto-increment primary key
- `username`: Login username
- `password`: Hashed password
- `email`: User email
- `role`: customer or owner
- `created_at`: Account creation date

---

## 🔐 Security Notes

1. **Password Storage**: Currently using placeholder hashes. For production:
   ```php
   $password = password_hash($password, PASSWORD_BCRYPT);
   ```

2. **Input Validation**: Add proper validation in production

3. **Authentication**: Implement JWT tokens or session management

4. **HTTPS**: Use HTTPS in production

5. **Database**: Change default root password

---

## 🐛 Troubleshooting

### Database Connection Error
- Check if MySQL is running
- Verify credentials in `config.php`
- Ensure database `clothhub` exists

### CORS Issues
- The `api.php` includes CORS headers
- Works with the frontend JavaScript code

### Large Image Storage
- Base64 encoded images can be very large
- Consider storing image paths instead of full image data
- Use cloud storage (AWS S3, etc.) for production

---

## 📝 Next Steps

1. **Modify JavaScript** to use API endpoints instead of localStorage:
   ```javascript
   // Instead of getClothes() from localStorage
   // Use fetch() to call api.php
   
   fetch('api.php?action=get_clothes')
       .then(response => response.json())
       .then(data => {
           if(data.success) {
               displayClothes(data.data);
           }
       });
   ```

2. **Implement Authentication** with login system

3. **Add Validation** on both frontend and backend

4. **Optimize Images** storage strategy

5. **Set up Backups** for database

---

## 📞 Support

For issues or questions, check:
- phpMyAdmin logs
- PHP error logs in `php.ini`
- Browser console for frontend errors

---

**Happy Coding! 🎉**
