let cart = JSON.parse(localStorage.getItem('cart') || '{}');
const selectedProducts = document.getElementById('selectedProducts');
const checkoutTotal = document.getElementById('checkoutTotal');

function renderSelected(){
  selectedProducts.innerHTML = '';
  const ids = Object.keys(cart);
  if(ids.length===0){
    selectedProducts.innerHTML = '<p class="text-muted">No items selected. <a href="index.html">Shop now</a></p>';
    checkoutTotal.innerText = '0.00';
    return;
  }
  let total = 0;
  const list = document.createElement('ul');
  list.className = 'list-group mb-3';
  ids.forEach(id=>{
    const it = cart[id];
    total += it.qty * it.price;
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.innerHTML = `<div><strong>${it.title}</strong><br /><small>${it.qty} x $${it.price.toFixed(2)}</small></div><div>$${(it.qty*it.price).toFixed(2)}</div>`;
    list.appendChild(li);
  });
  selectedProducts.appendChild(list);
  checkoutTotal.innerText = total.toFixed(2);
}

document.getElementById('checkoutForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  if(Object.keys(cart).length===0){ alert('Cart is empty'); return; }
  localStorage.removeItem('cart');
  new bootstrap.Modal(document.getElementById('successModal')).show();
});

renderSelected();
