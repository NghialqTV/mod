/* ===== APP + GET KEY CARDS ===== */
function getPlatform(app){
  const text = `${app.name || ''} ${app.version || ''}`.toLowerCase();
  if(text.includes('ios') || text.includes('ipa')) return 'iOS';
  return 'Android';
}

function getKeyForApp(app, keys){
  const platform = getPlatform(app);
  const keyText = keys.find(k => {
    const t = `${k.name || ''} ${k.version || ''}`.toLowerCase();
    return platform === 'iOS' ? t.includes('ios') : t.includes('android');
  });
  return keyText || null;
}

function renderApps(){
  Promise.all([
    fetch('data/apps.json?v=' + Date.now(), {cache:'no-store'}).then(r => r.json()),
    fetch('data/keys.json?v=' + Date.now(), {cache:'no-store'}).then(r => r.json())
  ])
  .then(([apps, keys]) => {
    document.getElementById('apps').innerHTML = apps.map((app, index) => {
      const key = getKeyForApp(app, keys);
      const platform = getPlatform(app);
      const version = (app.version || '').trim();
      return `
        <article class="app-card" style="--delay:${index * 0.07}s">
          <div class="app-cover">
            <img src="${app.icon}" alt="${app.name}" class="app-cover-img">
            <div class="app-cover-overlay"></div>
            <span class="platform-badge ${platform === 'iOS' ? 'ios' : 'android'}">
              ${platform === 'iOS' ? ' iOS' : '● Android'}
            </span>
          </div>

          <div class="app-content">
            <img src="${app.icon}" alt="" class="app-avatar">
            <div class="app-text">
              <h3>${app.name}</h3>
              <p>${version || 'Cập nhật mới nhất'}</p>
            </div>
          </div>

          <div class="app-actions">
            <a class="download-btn" href="${app.link}" target="_blank" rel="noopener">
              <span>Tải Xuống</span>
              <span class="download-icon">⇩</span>
            </a>
            ${key ? `
              <a class="getkey-btn" href="${key.link}" target="_blank" rel="noopener">
                <span class="key-icon">●</span>
                <span>Get Key</span>
              </a>
            ` : ''}
          </div>
        </article>
      `;
    }).join('');
  })
  .catch(err => {
    document.getElementById('apps').innerHTML = '<div class="data-error">Lỗi load dữ liệu APP</div>';
    console.error(err);
  });
}

function renderKeys(){
  fetch('data/keys.json?v=' + Date.now(), {cache:'no-store'})
    .then(res => {
      if(!res.ok) throw new Error('Fetch lỗi data/keys.json');
      return res.json();
    })
    .then(keys => {
      document.getElementById('keys').innerHTML = keys.map((key, index) => `
        <div class="key-card" style="--delay:${index * 0.08}s">
          <img class="key-card-icon" src="${key.icon}" alt="">
          <div class="key-card-info">
            <b>${key.name}</b>
            <span>${key.version || ''}</span>
          </div>
          <a class="key-open" href="${key.link}" target="_blank" rel="noopener">Get Key</a>
        </div>
      `).join('');
    })
    .catch(err => {
      document.getElementById('keys').innerHTML = '<div class="data-error">Lỗi load dữ liệu KEY</div>';
      console.error(err);
    });
}

renderApps();
renderKeys();

/* ===== FILES ===== */
function renderFiles(){
  fetch('data/files.json?v=' + Date.now(), {cache:'no-store'})
    .then(res => res.json())
    .then(files => {
      document.getElementById('files').innerHTML = files.map(f => `
        <div class="card">
          <img class="icon" src="${f.icon}">
          <div class="info">
            <b>${f.name}</b>
            <div>${f.version || ''}</div>
          </div>
          <a href="${f.link}" target="_blank" rel="noopener">✓</a>
        </div>
        ${f.banner ? `<div class="file-banner"><img src="${f.banner}"></div>` : ''}
      `).join('');
    })
    .catch(err => console.error(err));
}
renderFiles();

/* ===== DARK MODE ===== */
if(localStorage.getItem('dark') === 'true') document.body.classList.add('dark');
window.addEventListener('load', () => document.body.classList.add('loaded'));

/* ===== HOA MAI RƠI ===== */
const maiFall = document.getElementById('mai-fall');
function createMai(){
  const m = document.createElement('div');
  m.className = 'mai';
  m.innerText = '🌟';
  m.style.left = Math.random() * 100 + 'vw';
  m.style.fontSize = (14 + Math.random() * 10) + 'px';
  m.style.animationDuration = (5 + Math.random() * 4) + 's';
  m.style.opacity = Math.random() * 0.6 + 0.4;
  maiFall.appendChild(m);
  setTimeout(() => m.remove(), 10000);
}
setInterval(createMai, 500);

/* ===== MOD SKIN DATA ===== */
fetch('data/mods.json?v=' + Date.now(), {cache:'no-store'})
  .then(res => res.json())
  .then(mods => {
    document.getElementById('mods').innerHTML = mods.map(m => `
      <a href="${m.link}" class="mod-item">
        ${m.icon ? `<img src="${m.icon}">` : ''}
        <span>${m.name}</span>
      </a>
    `).join('');
  });

/* ===== PROFESSIONAL LOADER ===== */
(function(){
  const loader = document.getElementById('site-loader');
  const bar = document.getElementById('loader-progress-bar');
  const percent = document.getElementById('loader-percent');
  const status = document.getElementById('loader-status-text');
  if(!loader) return;

  const stages = [
    [18, 'Đang khởi tạo giao diện...'],
    [42, 'Đang tải dữ liệu...'],
    [68, 'Đang chuẩn bị nội dung...'],
    [86, 'Đang hoàn thiện giao diện...']
  ];
  let current = 0;
  const timer = setInterval(() => {
    if(current >= stages.length) return;
    const [value, text] = stages[current++];
    if(bar) bar.style.width = value + '%';
    if(percent) percent.textContent = value + '%';
    if(status) status.textContent = text;
  }, 260);

  const finish = () => {
    clearInterval(timer);
    if(bar) bar.style.width = '100%';
    if(percent) percent.textContent = '100%';
    if(status) status.textContent = 'Sẵn sàng';
    setTimeout(() => {
      loader.classList.add('loader-hidden');
      setTimeout(() => loader.remove(), 700);
    }, 420);
  };

  if(document.readyState === 'complete') {
    setTimeout(finish, 900);
  } else {
    window.addEventListener('load', () => setTimeout(finish, 900), {once:true});
  }
})();

/* ===== TOGGLE DARK MODE ===== */
const toggle = document.getElementById('darkToggle');
if(toggle){
  toggle.onclick = () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('dark', document.body.classList.contains('dark'));
  };
}
