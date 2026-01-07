function toggleMenu(){menu.classList.toggle('show');}
function toggleDark(){
 document.body.classList.toggle('dark');
 localStorage.setItem('dark',document.body.classList.contains('dark'));
}
if(localStorage.getItem('dark')==='true'){document.body.classList.add('dark');}

admin.innerHTML = `
<div style="text-align:center;margin-bottom:20px">
 <img src="${ADMIN.avatar}" class="avatar">
 <h2>${ADMIN.name}</h2>
</div>`;

apps.innerHTML = '<h2>Tải App</h2>' + APPS.map(a => `
<div class="card" style="display:flex;align-items:center;gap:12px">
  <img src="${a.icon}" style="width:48px;height:48px;border-radius:10px">
  <div style="flex:1">
    <b>${a.name}</b>
  </div>
  <a href="${a.link}" class="btn">⬇</a>
</div>
`).join('');

keys.innerHTML='<h2>Get Key</h2>'+KEYS.map(k=>`
<div class="card"><b>${k.name}</b><a href="${k.link}" class="btn">↗ Lấy Key</a></div>`).join('');

files.innerHTML = '<h2>File Mod</h2>' + FILES.map(f => `
<div class="card">
  <img src="${f.image}" style="width:100%;border-radius:12px;margin-bottom:8px">
  <b>${f.title}</b>
  <a href="${f.link}" class="btn">⬇ Tải File</a>
</div>
`).join('');

window.onload=()=>{document.getElementById('loading').style.display='none';}
