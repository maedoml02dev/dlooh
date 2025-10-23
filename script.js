// script.js - unificado e atualizado (produtos + carrinho + modal pagamento + melhorias)

// ---------- Config / Dados ----------
const CART_KEY = 'cart';

const products = [
  { id: 1, name: "Nike Air Max Plus Tuned Air", price: 150, image: "img/1.png", description: "N°." },
  { id: 2, name: "Tênis NIKE Air Jordan 1 Low", price: 150, image: "img/2.png", description: "N°." },
  { id: 3, name: "Tênis Asics Casual/Running Masculino", price: 190, image: "img/3.png", description: "N°." },
  { id: 4, name: "Nike Dunk Low", price: 80, image: "img/4.png", description: "N°." },
  { id: 5, name: "Tênis NIKE", price: 80, image: "img/5.png", description: "Nº27 ao Nº33." },
  { id: 6, name: "Tênis NIKE", price: 99, image: "img/6.png", description: "N°." },
  { id: 7, name: "Tênis Vans", price: 80, image: "img/7.png", description: "N°." },
  { id: 8, name: "Tênis NIKE Air", price: 80, image: "img/8.png", description: "Nº26 ao Nº33." },
  { id: 9, name: "Chinelo Esportivo Estilo Street Comfort", price: 159, image: "img/9.png", description: "N°." },
  { id: 10, name: "Tênis NIKE", price: 80, image: "img/10.png", description: "N°." },
  { id: 11, name: "Tênis NIKE", price: 130, image: "img/11.png", description: "N°." },
  { id: 12, name: "Tênis ADIDAS", price: 80, image: "img/12.png", description: "N°." },
  { id: 13, name: "Tênis ADIDAS", price: 190, image: "img/13.png", description: "N°." },
  { id: 14, name: "Tênis NIKE", price: 80, image: "img/14.png", description: "N°." },
  { id: 15, name: "Tênis Vans", price: 80, image: "img/15.png", description: "N°." },

  { id: 16, name: "Nike Air Max Plus Tuned Air", price: 130, image: "img/16.png", description: "N°." },
  { id: 17, name: "Tênis NIKE Air Jordan 1 Low", price: 200, image: "img/17.png", description: "N°." },
  { id: 18, name: "Tênis Asics Casual/Running Masculino", price: 150, image: "img/18.png", description: "N°." },
  { id: 19, name: "Nike Dunk Low", price: 80, image: "img/19.png", description: "N°." },
  { id: 20, name: "Tênis NIKE", price: 80, image: "img/20.png", description: "Nº27 ao Nº33." },
  { id: 21, name: "Tênis NIKE", price: 80, image: "img/21.png", description: "N°." },
  { id: 22, name: "Tênis Vans", price: 80, image: "img/22.png", description: "N°." },
  { id: 23, name: "Tênis NIKE Air", price: 80, image: "img/23.png", description: "Nº26 ao Nº33." },
  { id: 24, name: "Tênis NIKE", price: 99, image: "img/24.png", description: "N°." },
  { id: 25, name: "Tênis NIKE", price: 80, image: "img/25.png", description: "N°." },
  { id: 26, name: "Tênis ALL STAR", price: 99, image: "img/26.png", description: "N°." },
  { id: 27, name: "Tênis ADIDAS", price: 190, image: "img/27.png", description: "N°." },
  { id: 28, name: "Tênis ADIDAS", price: 80, image: "img/28.png", description: "N°." },
  { id: 29, name: "Tênis NIKE", price: 80, image: "img/29.png", description: "N°." },
  { id: 30, name: "Tênis Vans", price: 160, image: "img/30.png", description: "N°." },
];

let cart = [];

// ---------- Storage helpers ----------
function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    cart = raw ? JSON.parse(raw) : [];
  } catch {
    cart = [];
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ---------- Render products ----------
function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  grid.innerHTML = products.map(p => `
    <div class="product-card bg-gray-800/50 rounded-xl overflow-hidden flex flex-col">
      <a href="${p.image}" target="_blank">
        <img src="${p.image}" alt="${p.name}" class="w-full h-48 object-contain">
      </a>
      <div class="p-6 flex flex-col justify-between flex-1">
        <div>
          <h4 class="text-xl font-semibold mb-2">${p.name}</h4>
          <p class="text-gray-400 mb-4">${p.description || ''}</p>
        </div>
        <div class="flex justify-between items-center mt-auto">
          <span class="text-2xl font-bold text-green-400">R$ ${p.price.toFixed(2).replace('.', ',')}</span>
          <button onclick="addToCart(${p.id})" class="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 py-2 rounded-lg transition-all">
            <i class="fas fa-cart-plus mr-2"></i>Adicionar
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// ---------- Cart operations ----------
function addToCart(id) {
  const item = products.find(p => p.id === id);
  if (!item) return;
  const existing = cart.find(p => p.id === id);
  if (existing) existing.quantity++;
  else cart.push({ ...item, quantity: 1 });
  saveCart();
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(p => p.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(p => p.id !== id);
  }
  saveCart();
  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter(p => p.id !== id);
  saveCart();
  updateCartUI();
}

// ---------- UI update ----------
function updateCartUI() {
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const countEls = document.querySelectorAll('#cart-count, #floating-cart-count');

  if (!itemsEl || !totalEl) return;

  const totalItems = cart.reduce((s, it) => s + (it.quantity || 0), 0);
  const totalValue = cart.reduce((s, it) => s + (it.price * (it.quantity || 0)), 0);

  countEls.forEach(el => el && (el.textContent = totalItems));

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="text-gray-400 text-center">Seu carrinho está vazio</p>';
  } else {
    itemsEl.innerHTML = cart.map(it => `
      <div class="flex justify-between bg-gray-800 rounded-lg p-3 mb-3">
        <div>
          <h5 class="font-semibold">${it.name}</h5>
          <p class="text-green-400">R$ ${it.price.toFixed(2).replace('.', ',')}</p>
        </div>
        <div class="flex items-center space-x-2">
          <button onclick="changeQty(${it.id}, -1)" class="bg-gray-700 w-8 h-8 rounded-full flex justify-center items-center">-</button>
          <span>${it.quantity}</span>
          <button onclick="changeQty(${it.id}, 1)" class="bg-gray-700 w-8 h-8 rounded-full flex justify-center items-center">+</button>
        </div>
      </div>
    `).join('');
  }

  totalEl.textContent = `R$ ${totalValue.toFixed(2).replace('.', ',')}`;
}

// ---------- Sidebar toggle ----------
function toggleCart() {
  const sidebar = document.getElementById('cart-sidebar');
  const overlay = document.getElementById('cart-overlay');
  if (!sidebar || !overlay) return;
  sidebar.classList.toggle('open');
  overlay.classList.toggle('hidden');
  updateCartUI();
}

// ---------- Payment modal ----------
function openPaymentModal() {
  if (!cart.length) {
    alert('Seu carrinho está vazio!');
    return;
  }
  const modal = document.getElementById('payment-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
}

function closePaymentModal() {
  const modal = document.getElementById('payment-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.style.display = 'none';
}

// ---------- Payment options ----------
function payWithPix() {
  const total = cart.reduce((s, it) => s + (it.price * it.quantity), 0);
  alert(`💸 Pagar via Pix\nChave: 18 99644-3734\nTotal: R$ ${total.toFixed(2).replace('.', ',')}\n\nApós o pagamento, envie o comprovante via WhatsApp.`);
  closePaymentModal();
}

function payWithCard() {
  window.open('https://www.mercadopago.com.br', '_blank');
  closePaymentModal();
}

function payOnDelivery() {
  alert('Pagamento na entrega selecionado.\nAceitamos dinheiro e cartão físico.\nFinalize seu pedido pelo WhatsApp.');
  checkoutWhatsApp('Pagamento na Entrega');
}

// ---------- WhatsApp checkout ----------
function checkoutWhatsApp(paymentMethod = 'WhatsApp') {
  if (!cart.length) {
    alert('Seu carrinho está vazio!');
    return;
  }
  const message = cart.map(p => `${p.name} (x${p.quantity}) - R$ ${(p.price * p.quantity).toFixed(2).replace('.', ',')}`).join("%0A");
  const total = cart.reduce((s, it) => s + (it.price * it.quantity), 0);
  const url = `https://wa.me/5518996443734?text=🛒 *Pedido D.Loh Variedades*%0A%0A${message}%0A%0A*Total:* R$ ${total.toFixed(2).replace('.', ',')}%0A*Forma de pagamento:* ${paymentMethod}`;
  window.open(url, '_blank');
  closePaymentModal();
}

// ---------- Voltar ao início ----------
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  renderProducts();
  updateCartUI();

  const overlay = document.getElementById('cart-overlay');
  if (overlay) overlay.addEventListener('click', () => toggleCart());

  const modal = document.getElementById('payment-modal');
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) closePaymentModal(); });
});

// ---------- Sync entre abas ----------
window.addEventListener('storage', e => {
  if (e.key === CART_KEY) {
    loadCart();
    updateCartUI();
  }
});

// ---------- Expor funções ----------
window.addToCart = addToCart;
window.changeQty = changeQty;
window.removeFromCart = removeFromCart;
window.toggleCart = toggleCart;
window.openPaymentModal = openPaymentModal;
window.closePaymentModal = closePaymentModal;
window.payWithPix = payWithPix;
window.payWithCard = payWithCard;
window.payOnDelivery = payOnDelivery;
window.checkoutWhatsApp = checkoutWhatsApp;
window.scrollToTop = scrollToTop;






