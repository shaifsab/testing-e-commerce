# E-Commerce Platform

A modern e-commerce platform built with **Node.js**, **Express**, **MongoDB**, and **Cloudinary** for image storage. This platform features a user-friendly interface, smooth product management, and secure user authentication.

## 🛠️ Technologies Used

- **Node.js** & **Express.js** for server-side logic
- **MongoDB** for data storage
- **Cloudinary** for image upload and management
- **Multer** for file handling
- **JWT** for authentication

## 🚀 Features

- **User Authentication**: Secure login and registration with email verification.
- **Product Management**: Add, update, and delete products. Upload product images.
- **Order Processing**: Handle orders, track status, and manage inventory.
- **Category Management**: Organize products into categories for better filtering.

## 🔧 Getting Started

### Prerequisites

- Node.js and npm installed.
- MongoDB instance (local or remote).

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/shaifsab/testing-e-commerce.git
    cd testing-e-commerce
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and configure your environment variables:
    ```env
    DB_URL=mongodb://localhost:27017/ecommerce
    JWT_SECRET=your-secret-key
    CLOUDINARY_URL=your-cloudinary-url
    ```

4. Run the app:
    ```bash
    npm start
    ```

5. The application will run on `http://localhost:8000`.

## 💡 Contributing

We welcome contributions! If you find any bugs or want to add new features, feel free to fork the repository, make changes, and submit a pull request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Made with ❤️ by Ebrahim Ahmed Shaif Miah
