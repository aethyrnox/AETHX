
/* AETHX-HUB core JS (auth, search, rendering) */

// Hard-coded credentials (client-side).
// ✨ Pro tip: edit / add username:password here.
const CREDENTIALS = Object.freeze({
  "admin": "darkd3mand91",
  "guest": "guest123",
  "rahmatt": "turtle25",
  "user": "user123"
});

const KEY_AUTH = "aethx_logged_in";
const KEY_USER = "aethx_user";

function byId(id){ return document.getElementById(id); }

function initLogin(){
  const form = byId('loginForm');
  const registerBtn = byId('registerBtn');
  const errorBox = byId('errorBox');

  // If already logged in, jump to dashboard
  if(localStorage.getItem(KEY_AUTH) === '1'){
    location.href = 'p1.html';
    return;
  }

  if(form){
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = (byId('username').value || '').trim();
      const p = byId('password').value || '';

      if(CREDENTIALS[u] && CREDENTIALS[u] === p){
        localStorage.setItem(KEY_AUTH,'1');
        localStorage.setItem(KEY_USER,u);
        location.href = 'p1.html';
      }else{
        errorBox.textContent = 'Username atau password salah.';
        form.classList.remove('shake'); // restart animation
        // trigger reflow
        void form.offsetWidth;
        form.classList.add('shake');
      }
    });
  }

  if(registerBtn){
    registerBtn.addEventListener('click', () => {
      alert("🍂Silahkan Join Discord terlebih dahulu untuk meregister akun!");
      window.open('https://discord.gg/MdGyBnQHZs', '_blank', 'noopener,noreferrer');
    });
  }
}

function ensureAuth(){
  if(localStorage.getItem(KEY_AUTH) !== '1'){
    location.href = 'index.html';
  }
}

function logout(){
  localStorage.removeItem(KEY_AUTH);
  localStorage.removeItem(KEY_USER);
  location.href = 'index.html';
}

// --------- STATIC GRID (no links.js) ----------
// See links.js for PAGE_LINKS
function renderLinks(page){
  const root = byId('grid');
  root.innerHTML = '';
  const data = (PAGE_LINKS[String(page)] || []);

  data.forEach((item, idx) => {
    const a = document.createElement('a');
    a.href = item.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.className = 'card';
    a.dataset.title = item.title.toLowerCase();

    a.innerHTML = `
      <div class="inner">
        <div class="title">${item.title}</div>
      </div>
      <div class="badge">#${String(idx+1).padStart(2,'0')}</div>
    `;
    root.appendChild(a);
  });
}

function renderNav(currentPage){
  const nav = byId('pager');
  if(!nav) return;
  nav.innerHTML = '';
  for(let i=1; i<=10; i++){
    const a = document.createElement('a');
    a.className = 'navbtn' + (i===currentPage ? ' active' : '');
    a.textContent = i;
    a.href = `p${i}.html`;
    if(i===currentPage){
      a.setAttribute('aria-current', 'page');
    }
    nav.appendChild(a);
  }
}

function attachSearch(){
  const input = byId('searchInput');
  if(!input) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    for(const el of document.querySelectorAll('.item')){
      const match = (el.dataset.label || '').toLowerCase().includes(q);
      el.style.display = match ? '' : 'none';
    }
  });
}

function attachHeaderActions(){
  const logoutBtn = byId('logoutBtn');
  if(logoutBtn) logoutBtn.addEventListener('click', logout);
}

function initPage(pageNumber){
  ensureAuth();
  renderNav(pageNumber);
  attachSearch();
  attachHeaderActions();
}
