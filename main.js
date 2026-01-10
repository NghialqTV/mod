/* ===== SKELETON ===== */
["apps","keys","files"].forEach(id=>{
  document.getElementById(id).innerHTML =
    Array(3).fill(`<div class="skeleton"></div>`).join("");
});

/* ===== RENDER ===== */
function renderData(data, boxId){
  document.getElementById(boxId).innerHTML =
    data.map(i=>`
      <div class="card reveal">
        <img class="icon" src="${i.icon}" loading="lazy" decoding="async">
        <div class="info">
          <b>${i.name}</b>
          <div>${i.version}</div>
        </div>
        <a href="${i.link}">✓</a>
      </div>
    `).join("");
}

function renderFilesData(files){
  document.getElementById("files").innerHTML =
    files.map(f=>`
      <div class="card reveal">
        <img class="icon" src="${f.icon}" loading="lazy">
        <div class="info">
          <b>${f.name}</b>
          <div>${f.version}</div>
        </div>
        <a href="${f.link}">✓</a>
      </div>
      ${f.banner?`
      <div class="big-banner reveal">
        <img src="${f.banner}" loading="lazy">
      </div>`:""}
    `).join("");
}

function renderMods(mods){
  document.getElementById("mods").innerHTML =
    mods.map(m=>`
      <a href="${m.link}" class="mod-item reveal">
        ${m.icon?`<img src="${m.icon}" width="24">`:""}
        ${m.name}
      </a>
    `).join("");
}

/* ===== LOAD SONG SONG ===== */
Promise.all([
  fetch("data/apps.json",{cache:"force-cache"}),
  fetch("data/keys.json",{cache:"force-cache"}),
  fetch("data/files.json",{cache:"force-cache"}),
  fetch("data/mods.json",{cache:"force-cache"})
]).then(async([a,k,f,m])=>{
  renderData(await a.json(),"apps");
  renderData(await k.json(),"keys");
  renderFilesData(await f.json());
  renderMods(await m.json());
  initReveal();
});

/* ===== SCROLL REVEAL ===== */
function initReveal(){
  const ob = new IntersectionObserver(es=>{
    es.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add("show");
    });
  },{threshold:.15});

  document.querySelectorAll(".reveal").forEach(el=>ob.observe(el));
}

/* YEAR */
document.getElementById("year").textContent =
  new Date().getFullYear();
