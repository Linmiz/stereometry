const state = {
  context: 'root', 
  page: 'root-home'
};
 
// ── NAV CONFIG ──
const navConfigs = {
  root: [
    { id: 'root-home', label: 'Головна', cls: 'home-btn' },
    { sep: true },
    { id: 'poly-home', label: 'Многогранники' },
    { id: 'rot-home', label: 'Тіла обертання' }
  ],
  poly: [
    { id: 'root-home', label: '← Назад',   cls: 'back-btn', backTo: 'root' },
    { sep: true },
    { id: 'poly-home', label: '<img src="home.png" alt="Домик" style="width:18px;height:18px;vertical-align:middle;">', cls: 'home-btn' },
    { id: 'prism', label: 'Призма' },
    { id: 'pyramid', label: 'Піраміда' }
  ],
  rot: [
    { id: 'root-home', label: '← Назад', cls: 'back-btn', backTo: 'root' },
    { sep: true },
    { id: 'rot-home', label: '<img src="home.png" alt="Домик" style="width:18px;height:18px;vertical-align:middle;">', cls: 'home-btn' },
    { id: 'cylinder', label: 'Циліндр' },
    { id: 'cone',label: 'Конус' },
    { id: 'sphere', label: 'Куля і сфера' }
  ]
};
 
const sectionLabels = {
  root: 'Стереометрія',
  poly: 'Многогранники',
  rot:  'Тіла обертання'
};
 
const pageContext = {
  'root-home': 'root',
  'poly-home': 'poly',
  'prism':     'poly',
  'pyramid':   'poly',
  'rot-home':  'rot',
  'cylinder':  'rot',
  'cone':      'rot',
  'sphere':    'rot'
};
 
// ── NAV BUILD ──
function buildNav(context) {
  const nav = document.getElementById('nav-bar');
  nav.innerHTML = '';
 
  navConfigs[context].forEach(item => {
    if (item.sep) {
      const d = document.createElement('div');
      d.className = 'nav-divider';
      nav.appendChild(d);
      return;
    }
 
    const btn = document.createElement('button');
    btn.className = 'nav-btn ' + (item.cls || '');
    btn.innerHTML = item.label;
    btn.dataset.pageId = item.id;
 
    btn.addEventListener('click', () => {
      // "Назад" завжди повертає в root
      goTo(item.id, item.backTo || null);
    });
 
    nav.appendChild(btn);
  });
 
  updateActiveNav();
}
 
function updateActiveNav() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.pageId === state.page);
  });
}
 
// ── NAVIGATION ──
function goTo(pageId, forceContext) {
  const context = forceContext || pageContext[pageId];
 
  // Сховати всі сторінки
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
 
  // Показати потрібну
  const target = document.getElementById('page-' + pageId);
  if (target) target.classList.add('active');
 
  // Оновити стан
  const prevContext = state.context;
  state.page    = pageId;
  state.context = context;
 
  // Перебудувати навігацію якщо змінився контекст
  if (prevContext !== context) {
    buildNav(context);
  } else {
    updateActiveNav();
  }
 
  // Анімований підпис у хедері
  animateLabel(sectionLabels[context]);
 
  // Скрол наверх
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
 
function animateLabel(text) {
  const label = document.getElementById('section-label');
  label.style.transition = 'none';
  label.style.opacity    = '0';
  label.style.transform  = 'translateY(-4px)';
 
  setTimeout(() => {
    label.textContent     = text;
    label.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    label.style.opacity    = '1';
    label.style.transform  = 'translateY(0)';
  }, 180);
}
 
// ── NAV HOVER ──
const navBar   = document.getElementById('nav-bar');
const hoverZone = document.getElementById('hover-zone');
let hideTimer  = null;
 
function showNav() {
  clearTimeout(hideTimer);
  navBar.classList.add('visible');
}
 
function hideNav() {
  hideTimer = setTimeout(() => {
    navBar.classList.remove('visible');
  }, 320);
}
 
hoverZone.addEventListener('mouseenter', showNav);
hoverZone.addEventListener('mouseleave', hideNav);
navBar.addEventListener('mouseenter', showNav);
navBar.addEventListener('mouseleave', hideNav);
 
// ── INIT ──
buildNav('root');