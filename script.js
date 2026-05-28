const DEFAULT_CONFIG = {
  hero: {
    title: 'Les meilleurs parfums, livraison rapide',
    subtitle: 'Choisissez, ajoutez au panier et commandez via WhatsApp.',
    caption: 'Authentic fragrances · Qualité garantie',
    image: 'https://source.unsplash.com/1200x800/?perfume,bottle',
  },
  whatsappNumber: '212712233293',
  products: [
    {id:1,name:'Bleu de Chanel (Eau de Parfum)',price:300,image:'https://source.unsplash.com/400x400/?perfume,bottle&sig=1'},
    {id:2,name:"Acqua Di Giò - Giorgio Armani (Pour Homme)",price:300,image:'https://source.unsplash.com/400x400/?perfume,bottle&sig=2'},
    {id:3,name:'Y - Yves Saint Laurent (Eau de Parfum)',price:300,image:'https://source.unsplash.com/400x400/?perfume,bottle&sig=3'},
    {id:4,name:'Light Blue - Dolce & Gabbana (Pour Homme)',price:300,image:'https://source.unsplash.com/400x400/?perfume,bottle&sig=4'},
    {id:5,name:'Aventus - Creed',price:300,image:'https://source.unsplash.com/400x400/?perfume,bottle&sig=5'},
    {id:6,name:'Acqua Di Giò Profondo - Giorgio Armani',price:300,image:'https://source.unsplash.com/400x400/?perfume,bottle&sig=6'},
    {id:7,name:'Arabians - Montale Paris',price:300,image:'https://source.unsplash.com/400x400/?perfume,bottle&sig=7'},
    {id:8,name:'Y - Yves Saint Laurent (Eau de Toilette / Le Parfum)',price:300,image:'https://source.unsplash.com/400x400/?perfume,bottle&sig=8'},
    {id:9,name:'Stronger With You - Emporio Armani',price:300,image:'https://source.unsplash.com/400x400/?perfume,bottle&sig=9'},
    {id:10,name:'Coffret "Le Beau" - Jean Paul Gaultier (3x40ml)',price:300,image:'https://source.unsplash.com/400x400/?perfume,gift,box&sig=10'},
    {id:11,name:'Scandal Pour Homme - Jean Paul Gaultier',price:300,image:'https://source.unsplash.com/400x400/?perfume,bottle&sig=11'},
    {id:12,name:'Le Beau Le Parfum - Jean Paul Gaultier',price:300,image:'https://source.unsplash.com/400x400/?perfume,bottle&sig=12'},
  ],
};

function loadSiteConfig(){
  const saved = JSON.parse(localStorage.getItem('siteConfig') || 'null');
  const config = saved ? {...DEFAULT_CONFIG,...saved} : DEFAULT_CONFIG;
  config.hero = {...DEFAULT_CONFIG.hero,...(saved?.hero||{})};
  config.whatsappNumber = saved?.whatsappNumber || DEFAULT_CONFIG.whatsappNumber;
  config.products = saved?.products || DEFAULT_CONFIG.products;
  return config;
}

const SITE_CONFIG = loadSiteConfig();
const PRODUCTS = SITE_CONFIG.products;
const WHATSAPP_NUMBER = SITE_CONFIG.whatsappNumber;

const $products = document.getElementById('products')
const $cartCount = document.getElementById('cartCount')
const $cartBtn = document.getElementById('cartBtn')
const $cartModal = document.getElementById('cartModal')
const $cartItems = document.getElementById('cartItems')
const $cartTotal = document.getElementById('cartTotal')
const $checkoutBtn = document.getElementById('checkoutBtn')
const $closeCart = document.getElementById('closeCart')
const $checkoutModal = document.getElementById('checkoutModal')
const $closeCheckout = document.getElementById('closeCheckout')
const $checkoutForm = document.getElementById('checkoutForm')

// Clear cart on fresh page load
localStorage.removeItem('cart');
let cart = {}

function renderProducts(){
  $products.innerHTML = ''
  PRODUCTS.forEach((p,i)=>{
    const card = document.createElement('div');card.className='card fade-in'
    // add slight stagger
    card.style.animationDelay = (i*80) + 'ms'
    card.innerHTML = `
      <div style="position:relative">
        <div class="ribbon">${i%3===0? 'Top': 'New'}</div>
        <img src="${p.image}" alt="${p.name}">
      </div>
      <h4>${p.name}</h4>
      <p class="price">${p.price} DH</p>
      <div class="actions">
        <button class="btn" data-id="${p.id}">Ajouter</button>
        <a class="btn" href="product.html?id=${p.id}">Détails</a>
        <button class="btn" onclick="window.open('https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(p.name + ' - Je veux plus d\'info')}', '_blank')">Info</button>
      </div>`
    $products.appendChild(card)
  })
}

function updateCartCount(){
  const count = Object.values(cart).reduce((s,n)=>s+n,0)
  $cartCount.textContent = count
}

function openCart(){ $cartModal.classList.remove('hidden'); renderCart() }
function closeCartFn(){ $cartModal.classList.add('hidden') }

function renderCart(){
  $cartItems.innerHTML = ''
  let total = 0
  for(const id in cart){
    const qty = cart[id]
    const p = PRODUCTS.find(x=>x.id==id)
    if(!p) continue
    total += p.price*qty
    const div = document.createElement('div');div.className='cart-item'
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div style="flex:1">
        <div>${p.name}</div>
        <div class="qty">
          <button class="decrease" data-id="${id}">-</button>
          <span>${qty}</span>
          <button class="increase" data-id="${id}">+</button>
        </div>
      </div>
      <div>${p.price*qty} DH</div>`
    $cartItems.appendChild(div)
  }
  $cartTotal.textContent = total
  addCartListeners()
}

function addCartListeners(){
  $cartItems.querySelectorAll('.increase').forEach(btn=>btn.addEventListener('click',e=>{
    const id = e.target.dataset.id; cart[id] = (cart[id]||0)+1; saveCart()
  }))
  $cartItems.querySelectorAll('.decrease').forEach(btn=>btn.addEventListener('click',e=>{
    const id = e.target.dataset.id; cart[id] = Math.max(0,(cart[id]||0)-1); if(cart[id]===0) delete cart[id]; saveCart()
  }))
}

function saveCart(){ localStorage.setItem('cart',JSON.stringify(cart)); updateCartCount(); renderCart() }

document.body.addEventListener('click',e=>{
  const button = e.target.closest('button[data-id]')
  if(button && button.closest('.card')){
    const id = button.dataset.id
    cart[id] = (cart[id]||0)+1
    saveCart()
  }
})

$cartBtn.addEventListener('click',()=>openCart())
$closeCart.addEventListener('click',()=>closeCartFn())
$checkoutBtn.addEventListener('click',()=>{ $cartModal.classList.add('hidden'); $checkoutModal.classList.remove('hidden') })
$closeCheckout.addEventListener('click',()=>{ $checkoutModal.classList.add('hidden') })

$checkoutForm.addEventListener('submit',e=>{
  e.preventDefault();
  const fd = new FormData($checkoutForm)
  const data = Object.fromEntries(fd.entries())
  const items = Object.keys(cart).map(id=>{
    const p = PRODUCTS.find(x=>x.id==id)
    return `${p.name} x ${cart[id]} = ${p.price*cart[id]} DH`
  }).join('%0A')
  const total = Object.keys(cart).reduce((s,id)=>s + (PRODUCTS.find(p=>p.id==id).price*cart[id]),0)
  const message = `Commande%20-%20Parfums%20de%20Khalid%0A%0A${items}%0A%0ATotal:%20${total}%20DH%0A%0ANom:%20${encodeURIComponent(data.fullname)}%0ATel:%20${encodeURIComponent(data.phone)}%0AVille:%20${encodeURIComponent(data.city)}%0AAdresse:%20${encodeURIComponent(data.address)}`
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
  window.open(url,'_blank')
})

function applyHeroConfig(){
  const title = document.getElementById('heroTitle')
  const subtitle = document.getElementById('heroSubtitle')
  const caption = document.getElementById('heroCaption')
  const heroImage = document.getElementById('heroImage')
  if(title) title.textContent = SITE_CONFIG.hero.title
  if(subtitle) subtitle.textContent = SITE_CONFIG.hero.subtitle
  if(caption) caption.textContent = SITE_CONFIG.hero.caption
  if(heroImage) heroImage.style.backgroundImage = `url('${SITE_CONFIG.hero.image}')`
}

if (window.db) {
    window.db.collection("products").onSnapshot((snapshot) => {
        const firebaseProducts = [];
        snapshot.forEach((doc) => {
            firebaseProducts.push({ id: doc.id, ...doc.data() });
        });

        if (firebaseProducts.length > 0) {
            PRODUCTS = firebaseProducts;
        }
        
        applyHeroConfig();
        renderProducts();
        updateCartCount();
    });
} else {
    applyHeroConfig();
    renderProducts();
}
