let cart = JSON.parse(localStorage.getItem('cart') || '{}');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');

function renderCart(){
  cartItems.innerHTML = '';
  const ids = Object.keys(cart);
  if(ids.length===0){
    cartItems.innerHTML = '<p class="text-muted">Your cart is empty.</p>';
    cartTotal.innerText = '0.00';
    return;
  }
  let total = 0;
  ids.forEach(id=>{
    const it = cart[id];
    total += it.qty * it.price;
    const item = document.createElement('div');
    item.className = 'list-group-item d-flex align-items-center';
    item.innerHTML = `
      <img src="${it.image}" alt="${it.title}" class="me-3" />
      <div class="flex-grow-1">
        <h6>${it.title}</h6>
        <p class="mb-1">$${it.price.toFixed(2)}</p>
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-sm btn-outline-secondary dec-btn" data-id="${id}">-</button>
          <span class="px-2 qty-text">${it.qty}</span>
          <button class="btn btn-sm btn-outline-secondary inc-btn" data-id="${id}">+</button>
          <button class="btn btn-sm btn-danger ms-3 del-btn" data-id="${id}">Delete</button>
        </div>
      </div>`;
    cartItems.appendChild(item);
  });
  cartTotal.innerText = total.toFixed(2);
  attachListeners();
}
function attachListeners(){
  document.querySelectorAll('.inc-btn').forEach(b=>{
    b.addEventListener('click', e=>{
      const id = e.currentTarget.dataset.id;
      cart[id].qty += 1;
      saveAndRender();
    });
  });
  document.querySelectorAll('.dec-btn').forEach(b=>{
    b.addEventListener('click', e=>{
      const id = e.currentTarget.dataset.id;
      cart[id].qty = Math.max(1, cart[id].qty - 1);
      saveAndRender();
    });
  });
  document.querySelectorAll('.del-btn').forEach(b=>{
    b.addEventListener('click', e=>{
      const id = e.currentTarget.dataset.id;
      delete cart[id];
      saveAndRender();
    });
  });
}
function saveAndRender(){
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}
document.getElementById('clearCartBtn').addEventListener('click', ()=>{
  if(confirm('Clear cart?')){ cart = {}; localStorage.setItem('cart', JSON.stringify(cart)); renderCart(); }
});

renderCart();
