const ITEMS=[
 {id:'s1',cat:'starters',name:'Sample roasted cauliflower',desc:'Sample starter with tahini and herbs.',price:14,img:'img/dish1.jpg'},
 {id:'s2',cat:'starters',name:'Sample crispy squid',desc:'Sample starter with chilli salt.',price:16,img:'img/dish2.jpg'},
 {id:'m1',cat:'mains',name:'Sample grilled chicken',desc:'Sample main with seasonal salad.',price:28,img:'img/dish4.jpg'},
 {id:'m2',cat:'mains',name:'Sample wood-fired pizza',desc:'Sample main — tomato, basil, mozzarella.',price:24,img:'img/dish2.jpg'},
 {id:'m3',cat:'mains',name:'Sample market fish',desc:'Sample main with lemon butter.',price:32,img:'img/dish1.jpg'},
 {id:'w1',cat:'sweets',name:'Sample citrus tart',desc:'Sample dessert.',price:12,img:'img/dish3.jpg'},
 {id:'w2',cat:'sweets',name:'Sample chocolate mousse',desc:'Sample dessert.',price:11,img:'img/dish3.jpg'},
 {id:'d1',cat:'drinks',name:'Sample house lemonade',desc:'Sample drink.',price:6,img:'img/dish1.jpg'},
 {id:'d2',cat:'drinks',name:'Sample espresso',desc:'Sample drink.',price:4.5,img:'img/dish4.jpg'},
];
const grid=document.getElementById('menu-grid');
const cart=new Map();
let cat='all', q='';

function money(n){return '$'+n.toFixed(2)}
function renderMenu(){
  const list=ITEMS.filter(i=>(cat==='all'||i.cat===cat)&&(`${i.name} ${i.desc}`.toLowerCase().includes(q)));
  grid.innerHTML=list.map(i=>`<article class="card" data-id="${i.id}">
    <img src="${i.img}" alt="Sample photo for ${i.name}" width="600" height="450" loading="lazy">
    <div class="body">
      <p class="sample">Sample</p>
      <h3>${i.name}</h3>
      <p class="meta">${i.desc}</p>
      <div class="price-row"><span class="price">${money(i.price)}</span>
      <button class="add" type="button" data-add="${i.id}" aria-label="Add ${i.name} to demo cart">Add</button></div>
    </div></article>`).join('')||'<p class="sub">No sample dishes match that search.</p>';
}
document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.tab').forEach(b=>b.setAttribute('aria-selected','false'));
  btn.setAttribute('aria-selected','true'); cat=btn.dataset.cat; renderMenu();
}));
document.getElementById('menu-search').addEventListener('input',e=>{q=e.target.value.trim().toLowerCase();renderMenu();});
grid.addEventListener('click',e=>{const id=e.target.dataset.add; if(!id)return; const item=ITEMS.find(x=>x.id===id); cart.set(id,(cart.get(id)||{...item,qty:0})); cart.get(id).qty++; syncCart();});

const fab=document.getElementById('cart-fab'), drawer=document.getElementById('cart-drawer');
function syncCart(){
  let n=0,total=0; const lines=[];
  cart.forEach(v=>{n+=v.qty; total+=v.qty*v.price; lines.push(`<div class="cart-item"><div><strong>${v.name}</strong><div class="meta">× ${v.qty}</div></div><div>${money(v.qty*v.price)}</div></div>`);});
  document.getElementById('cart-count').textContent=n;
  document.getElementById('cart-total').textContent=money(total);
  document.getElementById('cart-lines').innerHTML=lines.join('')||'<p class="meta">Cart is empty — add sample dishes from the menu.</p>';
  fab.hidden=n===0;
}
function openCart(){drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');}
function closeCart(){drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');}
fab.addEventListener('click',openCart);
document.getElementById('mobile-cart').addEventListener('click',openCart);
drawer.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',closeCart));
document.getElementById('checkout').addEventListener('click',()=>{const m=document.getElementById('checkout-msg'); m.hidden=false;});

document.getElementById('book-form').addEventListener('submit',e=>{e.preventDefault();document.getElementById('book-msg').hidden=false;});

// Open now from sample hours (local time)
(function(){
  const now=new Date(), d=now.getDay(), h=now.getHours()+now.getMinutes()/60;
  // 0 Sun 11-21, 1-4 Mon-Thu 11-21.5, 5-6 Fri-Sat 11-22.5
  let open=false, until='';
  if(d===0){open=h>=11&&h<21; until='9:00 pm';}
  else if(d>=1&&d<=4){open=h>=11&&h<21.5; until='9:30 pm';}
  else {open=h>=11&&h<22.5; until='10:30 pm';}
  const label=document.getElementById('open-label');
  const box=document.getElementById('open-now');
  if(open){label.textContent='Open now · closes '+until+' (sample hours)';}
  else {label.textContent='Closed now · see sample hours below'; box.style.background='rgba(255,90,60,.12)'; box.style.color='var(--accent)';}
})();

// light reveal on scroll
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in');}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
renderMenu();
