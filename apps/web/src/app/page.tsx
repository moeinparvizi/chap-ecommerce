export default function Home() {
  const categories = [
    { icon: '📱', name: 'Electronics', count: 1250 },
    { icon: '👕', name: 'Fashion', count: 890 },
    { icon: '🏠', name: 'Home & Living', count: 650 },
    { icon: '🎮', name: 'Gaming', count: 420 },
    { icon: '📚', name: 'Books', count: 320 },
    { icon: '💄', name: 'Beauty', count: 540 },
    { icon: '⚽', name: 'Sports', count: 380 },
    { icon: '🧸', name: 'Toys', count: 290 },
  ];

  const products = [
    { id: 1, name: 'iPhone 15 Pro Max', brand: 'Apple', price: 1199, originalPrice: 1299, rating: 4.8, reviews: 2456, emoji: '📱' },
    { id: 2, name: 'MacBook Pro M3', brand: 'Apple', price: 1999, originalPrice: 2199, rating: 4.9, reviews: 1823, emoji: '💻' },
    { id: 3, name: 'Sony WH-1000XM5', brand: 'Sony', price: 349, originalPrice: 399, rating: 4.7, reviews: 3241, emoji: '🎧' },
    { id: 4, name: 'Samsung Galaxy S24', brand: 'Samsung', price: 899, originalPrice: 999, rating: 4.6, reviews: 1876, emoji: '📱' },
    { id: 5, name: 'Nike Air Max 90', brand: 'Nike', price: 129, originalPrice: 150, rating: 4.5, reviews: 4521, emoji: '👟' },
    { id: 6, name: 'iPad Air M2', brand: 'Apple', price: 599, originalPrice: 649, rating: 4.8, reviews: 2134, emoji: '📱' },
    { id: 7, name: 'Canon EOS R6', brand: 'Canon', price: 2499, originalPrice: 2799, rating: 4.7, reviews: 892, emoji: '📷' },
    { id: 8, name: 'Dyson V15 Detect', brand: 'Dyson', price: 749, originalPrice: 849, rating: 4.6, reviews: 1567, emoji: '🧹' },
  ];

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="header-top">
          Free shipping on orders over $50 | 30-day returns
        </div>
        <div className="header-main">
          <a href="/" className="logo">ShopHub</a>
          <nav>
            <ul className="nav-links">
              <li><a href="/products">Products</a></li>
              <li><a href="/categories">Categories</a></li>
              <li><a href="/brands">Brands</a></li>
              <li><a href="/deals">Deals</a></li>
              <li><a href="/blog">Blog</a></li>
            </ul>
          </nav>
          <div className="header-actions">
            <button title="Search">🔍</button>
            <button title="Account">👤</button>
            <button title="Cart">🛒</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>Discover Amazing Products</h1>
        <p>Shop the latest trends with exclusive deals and free shipping</p>
        <a href="/products" className="hero-btn">Shop Now</a>
      </section>

      {/* Categories */}
      <section className="section">
        <h2 className="section-title">Shop by Category</h2>
        <div className="categories-grid">
          {categories.map((cat, index) => (
            <div key={index} className="category-card">
              <div className="category-icon">{cat.icon}</div>
              <div className="category-name">{cat.name}</div>
              <div className="category-count">{cat.count} products</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="section" style={{ background: '#f8fafc' }}>
        <h2 className="section-title">Featured Products</h2>
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">{product.emoji}</div>
              <div className="product-info">
                <div className="product-brand">{product.brand}</div>
                <div className="product-name">{product.name}</div>
                <div className="product-rating">
                  <span className="stars">★★★★★</span>
                  <span className="rating-count">({product.reviews})</span>
                </div>
                <div className="product-price">
                  <span className="current-price">${product.price}</span>
                  <span className="original-price">${product.originalPrice}</span>
                  <span className="discount-badge">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <h2 className="section-title">Why Choose Us</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <div className="feature-title">Free Shipping</div>
            <div className="feature-desc">Free shipping on all orders over $50. Fast and reliable delivery.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <div className="feature-title">Secure Payment</div>
            <div className="feature-desc">100% secure payment processing. Your data is protected.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">↩️</div>
            <div className="feature-title">Easy Returns</div>
            <div className="feature-desc">30-day hassle-free return policy. No questions asked.</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <div className="feature-title">24/7 Support</div>
            <div className="feature-desc">Round the clock customer support. We are here to help.</div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <h2>Subscribe to Our Newsletter</h2>
        <p>Get the latest updates on new products and upcoming sales</p>
        <div className="newsletter-form">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="newsletter-input" 
          />
          <button className="newsletter-btn">Subscribe</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-col">
            <h3>ShopHub</h3>
            <a href="/about">About Us</a>
            <a href="/careers">Careers</a>
            <a href="/press">Press</a>
            <a href="/blog">Blog</a>
          </div>
          <div className="footer-col">
            <h3>Customer Service</h3>
            <a href="/help">Help Center</a>
            <a href="/shipping">Shipping Info</a>
            <a href="/returns">Returns & Exchanges</a>
            <a href="/contact">Contact Us</a>
          </div>
          <div className="footer-col">
            <h3>Quick Links</h3>
            <a href="/products">All Products</a>
            <a href="/categories">Categories</a>
            <a href="/brands">Brands</a>
            <a href="/deals">Today&apos;s Deals</a>
          </div>
          <div className="footer-col">
            <h3>Legal</h3>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/cookies">Cookie Policy</a>
            <a href="/accessibility">Accessibility</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 ShopHub. All rights reserved.</p>
          <div className="footer-social">
            <a href="#" title="Facebook">📘</a>
            <a href="#" title="Twitter">🐦</a>
            <a href="#" title="Instagram">📷</a>
            <a href="#" title="YouTube">▶️</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
