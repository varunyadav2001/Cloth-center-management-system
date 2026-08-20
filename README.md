# Cloth Center Management System 🧵💼

A web-based ERP and management solution engineered to streamline retail apparel operations, including inventory control, automated billing, sales processing, and supplier/customer records.

🔗 **Live Demo:** [https://clothmanagement.netlify.app](https://clothmanagement.netlify.app)

---

## 📌 Key Architectural Modules

* **Inventory & Stock Lifecycle Management:** Real-time stock level monitoring, category classification, and pricing updates.
* **Point of Sale (POS) & Billing:** Fast invoice generation and transaction logging.
* **Data Persistence & Integrity:** Normalized MySQL schema managing transactions, customers, and inventory states.
* **RESTful Backend Communication:** Modular PHP APIs for dynamic asynchronous CRUD operations via client-side Fetch/AJAX.
* **Responsive Client Interface:** Clean, component-driven UI for desktop and tablet point-of-sale environments.

---

## 🛠️ Technical Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6+ / AJAX)
* **Backend:** PHP (Object-Oriented / Procedural Endpoints)
* **Database:** MySQL
* **Deployment / Hosting:** Netlify (Frontend)

---

## 📂 Repository Architecture

```text
├── index.html            # Main dashboard interface
├── style.css             # Layout styles and custom components
├── script.js             # Client-side form handlers and UI controllers
├── api-integration.js    # API communication layer (Fetch API)
├── api.php               # Server-side endpoint routing & business logic
├── config.php            # Database PDO/MySQLi connection handler
├── database.sql          # Relational schema definition & table constraints
└── BACKEND_SETUP.md      # Server configuration instructions
