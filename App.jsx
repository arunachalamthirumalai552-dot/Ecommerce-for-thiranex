import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api';

export default function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '' });
  const [newProduct, setNewProduct] = useState({ name: '', price: 0, stock: 0, description: '', category: '' });
  const [checkout, setCheckout] = useState({ shippingAddress: '' });

  useEffect(() => {
    fetchProducts();
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // ========== API CALLS ==========
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ id: data.userId, role: data.role, username: data.username }));
        setUser({ id: data.userId, role: data.role, username: data.username });
        setPage('home');
        setLoginForm({ email: '', password: '' });
      }
    } catch (err) {
      alert('Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm),
      });
      if (res.ok) {
        alert('Registration successful! Please login.');
        setPage('login');
        setRegisterForm({ username: '', email: '', password: '' });
      }
    } catch (err) {
      alert('Registration failed');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });
      if (res.ok) {
        fetchProducts();
        setNewProduct({ name: '', price: 0, stock: 0, description: '', category: '' });
        alert('Product added successfully!');
      }
    } catch (err) {
      alert('Error adding product');
    }
  };

  const handleDeleteProduct = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      alert('Error deleting product');
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.productId === product._id);
    if (existing) {
      setCart(cart.map(item =>
        item.productId === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product._id,
        productName: product.name,
        price: product.price,
        quantity: 1,
      }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login first');
      setPage('login');
      return;
    }
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart,
          shippingAddress: checkout.shippingAddress,
        }),
      });
      if (res.ok) {
        alert('Order placed successfully!');
        setCart([]);
        setCheckout({ shippingAddress: '' });
        setPage('home');
        fetchOrders();
      }
    } catch (err) {
      alert('Checkout failed');
    }
  };

  const fetchOrders = async () => {
    if (!user) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCart([]);
    setPage('home');
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ========== UI COMPONENTS ==========
  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-content">
          <h1>🛍️ E-Store</h1>
          <div className="nav-links">
            {user ? (
              <>
                <button onClick={() => setPage('home')}>Home</button>
                <button onClick={() => setPage('cart')}>Cart ({cart.length})</button>
                <button onClick={() => { fetchOrders(); setPage('orders'); }}>Orders</button>
                {user.role === 'admin' && <button onClick={() => setPage('admin')}>Admin</button>}
                <span className="user-info">👤 {user.username}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => setPage('login')}>Login</button>
                <button onClick={() => setPage('register')}>Register</button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="container">
        {/* HOME PAGE - PRODUCT LISTING */}
        {page === 'home' && (
          <div className="page">
            <h2>Product Catalog</h2>
            <div className="products-grid">
              {products.map(product => (
                <div key={product._id} className="product-card">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p className="price">₹{product.price}</p>
                  <p className="stock">Stock: {product.stock}</p>
                  <button onClick={() => addToCart(product)} disabled={product.stock <= 0}>
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LOGIN PAGE */}
        {page === 'login' && (
          <div className="page form-page">
            <h2>Login</h2>
            <form onSubmit={handleLogin} className="auth-form">
              <input
                type="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
              <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <button onClick={() => setPage('register')} className="link-btn">Register</button></p>
          </div>
        )}

        {/* REGISTER PAGE */}
        {page === 'register' && (
          <div className="page form-page">
            <h2>Register</h2>
            <form onSubmit={handleRegister} className="auth-form">
              <input
                type="text"
                placeholder="Username"
                value={registerForm.username}
                onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                required
              />
              <button type="submit">Register</button>
            </form>
            <p>Already have an account? <button onClick={() => setPage('login')} className="link-btn">Login</button></p>
          </div>
        )}

        {/* CART PAGE */}
        {page === 'cart' && (
          <div className="page">
            <h2>Shopping Cart</h2>
            {cart.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map(item => (
                    <div key={item.productId} className="cart-item">
                      <span>{item.productName}</span>
                      <span>₹{item.price} x {item.quantity}</span>
                      <span className="item-total">₹{item.price * item.quantity}</span>
                      <button onClick={() => removeFromCart(item.productId)} className="remove-btn">Remove</button>
                    </div>
                  ))}
                </div>
                <div className="cart-total">
                  <h3>Total: ₹{cartTotal}</h3>
                </div>
                <form onSubmit={handleCheckout} className="checkout-form">
                  <input
                    type="text"
                    placeholder="Shipping Address"
                    value={checkout.shippingAddress}
                    onChange={(e) => setCheckout({ ...checkout, shippingAddress: e.target.value })}
                    required
                  />
                  <button type="submit">Proceed to Checkout</button>
                </form>
              </>
            )}
          </div>
        )}

        {/* ORDERS PAGE */}
        {page === 'orders' && (
          <div className="page">
            <h2>My Orders</h2>
            {orders.length === 0 ? (
              <p>No orders yet</p>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order._id} className="order-card">
                    <h4>Order #{order._id.slice(-8)}</h4>
                    <p><strong>Status:</strong> <span className={`status ${order.status}`}>{order.status}</span></p>
                    <p><strong>Total:</strong> ₹{order.totalPrice}</p>
                    <p><strong>Address:</strong> {order.shippingAddress}</p>
                    <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                    <div className="order-items">
                      {order.items.map((item, idx) => (
                        <small key={idx}>{item.productName} x{item.quantity}</small>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADMIN PAGE */}
        {page === 'admin' && user?.role === 'admin' && (
          <div className="page">
            <h2>Admin Panel</h2>
            <div className="admin-section">
              <h3>Add New Product</h3>
              <form onSubmit={handleAddProduct} className="product-form">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                  required
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                  required
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                />
                <textarea
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
                <button type="submit">Add Product</button>
              </form>
            </div>

            <div className="admin-section">
              <h3>Manage Products</h3>
              <div className="products-grid">
                {products.map(product => (
                  <div key={product._id} className="admin-product-card">
                    <h4>{product.name}</h4>
                    <p>₹{product.price}</p>
                    <p>Stock: {product.stock}</p>
                    <button onClick={() => handleDeleteProduct(product._id)} className="delete-btn">Delete</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
