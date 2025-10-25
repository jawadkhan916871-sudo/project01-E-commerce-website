const API = 'https://fakestoreapi.com/products';
const CATEGORY_API = 'https://fakestoreapi.com/products/categories';

const productsEl = document.getElementById('products');
const spinner = document.getElementById('spinner');
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');
const categorySelect = document.getElementById('categorySelect');
let PRODUCTS = [];
let cart = JSON.parse(localStorage.getItem('cart') || '{}');

function updateCartCount() {
  const count = Object.values(cart).reduce((s, it) => s + it.qty, 0);
  document.getElementById('cart-count').innerText = count;
}

function showSpinner(on=true){ spinner.classList.toggle('d-none', !on); }

async function fetchProducts(){
  try{
    showSpinner(true);
    const [res, catRes] = await Promise.all([
      fetch(API),
      fetch(CATEGORY_API)
    ]);
    const data = await res.json();
    const categories = await catRes.json();
    PRODUCTS = data;

    categories.forEach(c=>{
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      categorySelect.appendChild(opt);
    });

    const maxPrice = Math.ceil(Math.max(...PRODUCTS.map(p => p.price)));
    priceRange.max = maxPrice;
    priceRange.value = maxPrice;
    priceValue.innerText = maxPrice;
    renderProducts();
  }catch(e){
    productsEl.innerHTML = '<p class="text-danger">Failed to load products.</p>';
  }finally{
    showSpinner(false);
    updateCartCount();
  }
}
function renderProducts(){
  const max = Number(priceRange.value);
  const cat = categorySelect.value;
  productsEl.innerHTML = '';
  const filtered = PRODUCTS.filter(p => p.price <= max && (cat==='all' || p.category===cat));
  if(filtered.length===0){
    productsEl.innerHTML = '<p class="text-muted">No products found.</p>';
    return;
  }
  filtered.forEach(p=>{
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-md-4 col-lg-3';
    col.innerHTML = `
      <div class="card h-100 product-card shadow-sm">
        <img src="${p.image}" class="card-img-top p-3" alt="${p.title}">
        <div class="card-body d-flex flex-column">
          <h6 class="card-title">${p.title}</h6>
          <p class="mt-auto"><strong>$${p.price.toFixed(2)}</strong></p>
          <div class="d-flex gap-2 mt-2">
            <button class="btn btn-sm btn-outline-primary view-btn" data-id="${p.id}">View</button>
            <button class="btn btn-sm btn-primary add-btn" data-id="${p.id}">Add to Cart</button>
          </div>
        </div>
      </div>`;
    productsEl.appendChild(col);
  });

  document.querySelectorAll('.add-btn').forEach(b=>{
    b.addEventListener('click', e=> addToCart(Number(e.currentTarget.dataset.id)));
  });
  document.querySelectorAll('.view-btn').forEach(b=>{
    b.addEventListener('click', e=> openModal(Number(e.currentTarget.dataset.id)));
  });
}

function addToCart(id, qty=1){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  if(!cart[id]) cart[id] = { id: p.id, title: p.title, price: p.price, image: p.image, qty: 0 };
  cart[id].qty += qty;
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert('Added to cart!');
}

function openModal(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  document.getElementById('modalTitle').innerText = p.title;
  document.getElementById('modalImage').src = p.image;
  document.getElementById('modalDesc').innerText = p.description;
  document.getElementById('modalPrice').innerText = p.price.toFixed(2);
  document.getElementById('modalAdd').onclick = ()=> { addToCart(id); bootstrap.Modal.getInstance(document.getElementById('productModal')).hide(); };
  new bootstrap.Modal(document.getElementById('productModal')).show();
}

priceRange.addEventListener('input', ()=> {
  priceValue.innerText = priceRange.value;
  renderProducts();
});
categorySelect.addEventListener('change', renderProducts);

fetchProducts();
updateCartCount();
