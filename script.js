// script.js
// ==================== DATA ====================
const products = [
  { id: 1, name: "Silk Maxi Dress", price: 189, category: "women", rating: 5, img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600", featured: true },
  { id: 2, name: "Wool Tailored Suit", price: 450, category: "men", rating: 4, img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600", featured: true },
  { id: 3, name: "Leather Tote", price: 320, category: "accessories", rating: 5, img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600", featured: true },
  { id: 4, name: "Crystal Heels", price: 210, category: "women", rating: 4, img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600", featured: true },
  { id: 5, name: "Cashmere Scarf", price: 95, category: "accessories", rating: 5, img: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600" },
  { id: 6, name: "Denim Jacket", price: 175, category: "men", rating: 4, img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600" },
  { id: 7, name: "Leather Watch", price: 290, category: "accessories", rating: 5, img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600" },
  { id: 8, name: "Aviator Sunglasses", price: 130, category: "accessories", rating: 4, img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600" },
  { id: 9, name: "Linen Blazer", price: 240, category: "men", rating: 5, img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600" },
  { id: 10, name: "Silk Blouse", price: 115, category: "women", rating: 4, img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600" }
];

// ==================== GLOBAL STATE ====================
let cart = JSON.parse(localStorage.getItem('veloreCart')) || [];
let currentProduct = null; // for modal
let testimonialIndex = 0;
let theme = 'light';

// ==================== UTILS ====================
const saveCart = () => {
  localStorage.setItem('veloreCart', JSON.stringify(cart));
  updateCartUI();
};

const showToast = (msg) => {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2000);
};

// ==================== RENDERING ====================
function renderFeatured() {
  const featured = products.filter(p => p.featured).slice(0,4);
  const grid = document.getElementById('featured-grid');
  grid.innerHTML = featured.map(createProductCard).join('');
}

function createProductCard(p) {
  const stars = '★'.repeat(p.rating) + '☆'.repeat(5-p.rating);
  return `
    <div class="product-card" data-id="${p.id}">
      <div class="product-image">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <div class="product-overlay">
          <button class="quick-view" data-id="${p.id}">Quick view</button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-price">$${p.price}</div>
        <div class="rating">${stars}</div>
        <button class="add-to-cart-btn" data-id="${p.id}">Add to cart</button>
      </div>
    </div>
  `;
}

function renderShop(filteredProducts = products) {
  const grid = document.getElementById('shop-grid');
  grid.innerHTML = filteredProducts.map(createProductCard).join('');
}

function renderNewArrivals() {
  const slider = document.getElementById('new-arrivals-slider');
  // last 5 products as new arrivals
  const newItems = products.slice(-5);
  slider.innerHTML = newItems.map(createProductCard).join('');
}

function renderTestimonials() {
  const container = document.getElementById('testimonial-slider');
  const testimonials = [
    { name: "Elena R.", text: "The quality is unmatched. VELORÉ has redefined my wardrobe.", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", rating: 5 },
    { name: "James K.", text: "Luxury that feels personal. Exceptional service.", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", rating: 5 },
    { name: "Sophie L.", text: "Every piece tells a story. I'm in love.", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150", rating: 5 }
  ];
  container.innerHTML = testimonials.map(t => `
    <div class="testimonial">
      <img src="${t.img}" alt="${t.name}">
      <div class="rating">${'★'.repeat(t.rating)}</div>
      <p>"${t.text}"</p>
      <div class="name">${t.name}</div>
    </div>
  `).join('');
  startTestimonialAutoSlide();
}

function startTestimonialAutoSlide() {
  setInterval(() => {
    const container = document.getElementById('testimonial-slider');
    testimonialIndex = (testimonialIndex + 1) % 3;
    container.style.transform = `translateX(-${testimonialIndex * 100}%)`;
  }, 5000);
}

// ==================== CART FUNCTIONS ====================
function addToCart(productId, qty = 1, size = 'M') {
  const product = products.find(p => p.id == productId);
  if (!product) return;
  const existing = cart.find(item => item.id == productId && item.size === size);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty, size });
  }
  saveCart();
  showToast(`${product.name} added to cart`);
}

function removeFromCart(productId, size) {
  cart = cart.filter(item => !(item.id == productId && item.size === size));
  saveCart();
}

function updateQty(productId, size, delta) {
  const item = cart.find(i => i.id == productId && i.size === size);
  if (item) {
    item.qty = Math.max(1, item.qty + delta);
    saveCart();
  }
}

function renderCartSidebar() {
  const container = document.getElementById('cart-items');
  const emptyMsg = document.getElementById('empty-cart-msg');
  const subtotalSpan = document.getElementById('cart-subtotal');
  const taxSpan = document.getElementById('cart-tax');
  const grandSpan = document.getElementById('cart-grand');

  if (cart.length === 0) {
    container.innerHTML = '';
    emptyMsg.style.display = 'block';
    subtotalSpan.innerText = '$0';
    taxSpan.innerText = '$0';
    grandSpan.innerText = '$0';
    document.getElementById('cart-counter').innerText = '0';
    return;
  }

  emptyMsg.style.display = 'none';
  let subtotal = 0;
  let itemsHtml = '';
  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;
    itemsHtml += `
      <div class="cart-item" data-id="${item.id}" data-size="${item.size}">
        <img src="${item.img}" alt="${item.name}">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name} (${item.size})</div>
          <div class="cart-item-price">$${item.price}</div>
          <div class="cart-item-qty">
            <button class="qty-decr">−</button>
            <span>${item.qty}</span>
            <button class="qty-incr">+</button>
            <button class="remove-item">🗑️</button>
          </div>
        </div>
      </div>
    `;
  });
  container.innerHTML = itemsHtml;
  const tax = subtotal * 0.1;
  const grand = subtotal + tax;
  subtotalSpan.innerText = `$${subtotal.toFixed(2)}`;
  taxSpan.innerText = `$${tax.toFixed(2)}`;
  grandSpan.innerText = `$${grand.toFixed(2)}`;
  document.getElementById('cart-counter').innerText = cart.reduce((acc, i) => acc + i.qty, 0);
}

function updateCartUI() { renderCartSidebar(); }

// ==================== MODAL ====================
function openQuickView(productId) {
  const product = products.find(p => p.id == productId);
  if (!product) return;
  currentProduct = product;
  document.getElementById('modal-img').src = product.img;
  document.getElementById('modal-title').textContent = product.name;
  document.getElementById('modal-price').textContent = `$${product.price}`;
  const stars = '★'.repeat(product.rating) + '☆'.repeat(5-product.rating);
  document.getElementById('modal-rating').innerHTML = stars;
  document.getElementById('modal-qty').textContent = '1';
  document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector('.size-btn[data-size="M"]').classList.add('active');
  document.getElementById('modal').classList.add('show');
}

// ==================== FILTER & SORT ====================
function filterAndSortProducts() {
  const category = document.getElementById('category-filter').value;
  const priceRange = document.getElementById('price-filter').value;
  const sort = document.getElementById('sort-order').value;
  const searchTerm = document.getElementById('shop-search').value.toLowerCase();

  let filtered = products.filter(p => {
    if (category !== 'all' && p.category !== category) return false;
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      if (max && (p.price < min || p.price > max)) return false;
      if (!max && p.price < min) return false;
    }
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm)) return false;
    return true;
  });

  if (sort === 'low-high') filtered.sort((a,b) => a.price - b.price);
  if (sort === 'high-low') filtered.sort((a,b) => b.price - a.price);

  renderShop(filtered);
}

// ==================== EVENT LISTENERS ====================
document.addEventListener('DOMContentLoaded', () => {
  // initial renders
  renderFeatured();
  renderShop();
  renderNewArrivals();
  renderTestimonials();
  updateCartUI();

  // loading screen fade
  setTimeout(() => {
    document.getElementById('loading-screen').classList.add('hidden');
  }, 500);

  // back to top visibility
  window.addEventListener('scroll', () => {
    const btn = document.getElementById('back-to-top');
    if (window.scrollY > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
  });
});

// Event delegation
document.addEventListener('click', (e) => {
  // Add to cart from product card
  if (e.target.classList.contains('add-to-cart-btn')) {
    const id = e.target.dataset.id;
    addToCart(id, 1);
  }

  // Quick view
  if (e.target.classList.contains('quick-view')) {
    const id = e.target.dataset.id;
    openQuickView(id);
  }

  // Close modal
  if (e.target.classList.contains('close-modal') || e.target.classList.contains('modal')) {
    document.getElementById('modal').classList.remove('show');
  }

  // Cart toggle
  if (e.target.closest('#cart-toggle')) {
    document.getElementById('cart-sidebar').classList.toggle('open');
  }
  if (e.target.closest('#close-cart')) {
    document.getElementById('cart-sidebar').classList.remove('open');
  }

  // Cart interactions (remove, qty)
  if (e.target.classList.contains('remove-item')) {
    const cartItem = e.target.closest('.cart-item');
    const id = cartItem.dataset.id;
    const size = cartItem.dataset.size;
    removeFromCart(id, size);
  }
  if (e.target.classList.contains('qty-decr')) {
    const cartItem = e.target.closest('.cart-item');
    const id = cartItem.dataset.id;
    const size = cartItem.dataset.size;
    updateQty(id, size, -1);
  }
  if (e.target.classList.contains('qty-incr')) {
    const cartItem = e.target.closest('.cart-item');
    const id = cartItem.dataset.id;
    const size = cartItem.dataset.size;
    updateQty(id, size, 1);
  }

  // Modal size select
  if (e.target.classList.contains('size-btn')) {
    document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
  }

  // Modal add to cart
  if (e.target.id === 'modal-add-to-cart') {
    const qty = parseInt(document.getElementById('modal-qty').textContent);
    const size = document.querySelector('.size-btn.active')?.dataset.size || 'M';
    addToCart(currentProduct.id, qty, size);
    document.getElementById('modal').classList.remove('show');
  }

  // Mobile menu
  if (e.target.id === 'hamburger') {
    document.getElementById('nav-menu').classList.toggle('active');
  }

  // Search toggle
  if (e.target.closest('.search-icon')) {
    document.getElementById('search-bar').classList.toggle('hidden');
  }

  // Theme toggle
  if (e.target.closest('#theme-toggle')) {
    document.body.classList.toggle('dark');
    const btn = document.getElementById('theme-toggle');
    btn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  }

  // Checkout popup
  if (e.target.id === 'checkout-btn') {
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    document.getElementById('checkout-popup').classList.remove('hidden');
  }
  if (e.target.id === 'close-popup' || e.target.closest('.popup-content button')) {
    document.getElementById('checkout-popup').classList.add('hidden');
  }

  // Back to top
  if (e.target.closest('#back-to-top')) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// Quantity +/- in modal
document.getElementById('modal-incr')?.addEventListener('click', () => {
  const span = document.getElementById('modal-qty');
  span.textContent = parseInt(span.textContent) + 1;
});
document.getElementById('modal-decr')?.addEventListener('click', () => {
  const span = document.getElementById('modal-qty');
  const val = parseInt(span.textContent);
  if (val > 1) span.textContent = val - 1;
});

// Filter/sort events
document.getElementById('category-filter')?.addEventListener('change', filterAndSortProducts);
document.getElementById('price-filter')?.addEventListener('change', filterAndSortProducts);
document.getElementById('sort-order')?.addEventListener('change', filterAndSortProducts);
document.getElementById('shop-search')?.addEventListener('input', filterAndSortProducts);

// Newsletter validation
document.getElementById('newsletter-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('newsletter-email').value;
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (isValid) {
    document.getElementById('newsletter-success').classList.remove('hidden');
    e.target.reset();
    setTimeout(() => document.getElementById('newsletter-success').classList.add('hidden'), 3000);
  } else {
    alert('Please enter a valid email.');
  }
});

// New arrivals slider
document.getElementById('slider-prev')?.addEventListener('click', () => {
  const slider = document.getElementById('new-arrivals-slider');
  slider.scrollLeft -= 300;
});
document.getElementById('slider-next')?.addEventListener('click', () => {
  const slider = document.getElementById('new-arrivals-slider');
  slider.scrollLeft += 300;
});