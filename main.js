/* ===== RENDER DATA ===== */
function escapeHtml(value){
  return String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[ch]));
}

function platformBadge(platform){
  if(!platform) return "";
  const p = String(platform).toLowerCase();
  const label = p === "android" ? "Android" : p === "ios" ? "iOS" : p;
  const icon = (p === "android" || p === "ios") ? `assets/icons/${p}.svg` : "";
  return `
    <span class="platform-badge ${escapeHtml(p)}">
      ${icon ? `<img src="${icon}" alt="${label}">` : ""}
      <span>${escapeHtml(label)}</span>
    </span>`;
}

function previewButton(item){
  const images = Array.isArray(item.preview) ? item.preview.filter(Boolean) : [];
  if(!images.length) return "";
  const encoded = encodeURIComponent(JSON.stringify(images));
  const title = encodeURIComponent(item.name || "Preview");
  return `
    <button class="preview-btn" type="button"
      data-preview="${encoded}" data-title="${title}">
      <span class="preview-icon">▧</span>
      <span>Preview</span>
      <b>${images.length}</b>
    </button>`;
}

function noteRow(item){
  if(!item.note) return "";
  const cls = item.noteType === "warning" ? "notice warning" : "notice";
  return `<div class="${cls}"><span>⚠️</span><span>${escapeHtml(item.note)}</span></div>`;
}

function render(url, boxId){
  fetch(url + "?v=" + Date.now(), { cache: "no-store" })
    .then(res => {
      if(!res.ok) throw new Error("Fetch lỗi " + url);
      return res.json();
    })
    .then(data => {
      document.getElementById(boxId).innerHTML = data.map((i, index) => `
        <article class="card app-card" style="--card-index:${index}">
          <div class="card-main">
            <img class="icon" src="${escapeHtml(i.icon || "assets/icons/app.png")}" alt="">
            <div class="info">
              <b class="app-name">${escapeHtml(i.name)}</b>
              <div class="update-line">• ${escapeHtml(i.version || "")}</div>
              <div class="meta-row">
                ${previewButton(i)}
              </div>
            </div>
            <a class="download-btn" href="${escapeHtml(i.link || "#")}" target="_blank" rel="noopener" aria-label="Tải xuống">
              <span>⇩</span>
            </a>
          </div>
          ${noteRow(i)}
        </article>
      `).join("");
      bindPreviewButtons();
    })
    .catch(err => {
      document.getElementById(boxId).innerHTML =
        `<div class="load-error">Không thể tải dữ liệu.</div>`;
      console.error(err);
    });
}

function renderFiles(){
  fetch("data/files.json?v=" + Date.now(), {cache:"no-store"})
    .then(res => res.json())
    .then(files => {
      document.getElementById("files").innerHTML = files.map((f, index) => `
        <article class="card app-card" style="--card-index:${index}">
          <div class="card-main">
            <img class="icon" src="${escapeHtml(f.icon || "assets/icons/file.png")}" alt="">
            <div class="info">
              <b class="app-name">${escapeHtml(f.name)}</b>
              <div class="update-line">• ${escapeHtml(f.version || "")}</div>
            </div>
            <a class="download-btn" href="${escapeHtml(f.link || "#")}" target="_blank" rel="noopener" aria-label="Tải xuống">
              <span>⇩</span>
            </a>
          </div>
        </article>
        ${f.banner ? `<div class="file-banner"><img src="${escapeHtml(f.banner)}" alt="" loading="lazy"></div>` : ""}
      `).join("");
    })
    .catch(console.error);
}

function bindPreviewButtons(){
  document.querySelectorAll(".preview-btn").forEach(btn => {
    btn.onclick = () => {
      try {
        const images = JSON.parse(decodeURIComponent(btn.dataset.preview));
        openPreview(images, decodeURIComponent(btn.dataset.title || "Preview"));
      } catch(e) { console.error(e); }
    };
  });
}

function openPreview(images, title){
  const modal = document.getElementById("preview-modal");
  const gallery = document.getElementById("preview-gallery");
  const heading = document.getElementById("preview-title");
  heading.textContent = title;
  gallery.innerHTML = images.map((src, i) => `
    <button class="preview-image-wrap" type="button" data-index="${i}">
      <img src="${escapeHtml(src)}" alt="Preview ${i+1}" loading="${i ? "lazy":"eager"}">
    </button>
  `).join("");
  modal.classList.add("show");
  document.body.classList.add("modal-open");

  gallery.querySelectorAll(".preview-image-wrap").forEach(el => {
    el.onclick = () => {
      const img = el.querySelector("img");
      if(img) openLightbox(img.src);
    };
  });
}

function closePreview(){
  const modal = document.getElementById("preview-modal");
  if(modal){
    modal.classList.remove("show");
    document.body.classList.remove("modal-open");
  }
}

function openLightbox(src){
  const lb=document.getElementById("image-lightbox");
  lb.querySelector("img").src=src;
  lb.classList.add("show");
}
function closeLightbox(){
  document.getElementById("image-lightbox").classList.remove("show");
}

document.addEventListener("click", e => {
  if(e.target.closest("[data-close-preview]")) closePreview();
  if(e.target.closest("[data-close-lightbox]")) closeLightbox();
});
document.addEventListener("keydown", e => {
  if(e.key === "Escape"){ closePreview(); closeLightbox(); }
});

render("data/apps.json", "apps");
render("data/keys.json", "keys");
renderFiles();

/* ===== DARK MODE ===== */
if(localStorage.getItem("dark") === "true"){
  document.body.classList.add("dark");
}

/* ===== HOA MAI RƠI ===== */
const maiFall = document.getElementById("mai-fall");
function createMai(){
  if(!maiFall) return;
  const m=document.createElement("div");
  m.className="mai";
  m.innerText="🌟";
  m.style.left=Math.random()*100+"vw";
  m.style.fontSize=(14+Math.random()*10)+"px";
  m.style.animationDuration=(5+Math.random()*4)+"s";
  m.style.opacity=Math.random()*.6+.4;
  maiFall.appendChild(m);
  setTimeout(()=>m.remove(),10000);
}
setInterval(createMai,900);

/* ===== MOD SKIN DATA ===== */
fetch("data/mods.json?v="+Date.now())
  .then(res=>res.json())
  .then(mods=>{
    const box=document.getElementById("mods");
    if(!box) return;
    box.innerHTML=mods.map(m=>`
      <a href="${escapeHtml(m.link || "#")}" class="mod-item">
        ${m.icon ? `<img src="${escapeHtml(m.icon)}" alt="">` : ""}
        <span>${escapeHtml(m.name)}</span>
      </a>
    `).join("");
  }).catch(console.error);

/* ===== TOGGLE DARK MODE ===== */
const toggle=document.getElementById("darkToggle");
if(toggle){
  toggle.onclick=()=>{
    document.body.classList.toggle("dark");
    localStorage.setItem("dark",document.body.classList.contains("dark"));
  };
}

/* ===== PROFESSIONAL PAGE LOADER ===== */
(function(){
  const loader=document.getElementById("page-loader");
  if(!loader) return;
  const startedAt=performance.now();
  const MIN_TIME=850;
  function hideLoader(){
    const elapsed=performance.now()-startedAt;
    setTimeout(()=>{
      loader.classList.add("hide");
      setTimeout(()=>loader.remove(),500);
    },Math.max(0,MIN_TIME-elapsed));
  }
  if(document.readyState==="complete") hideLoader();
  else window.addEventListener("load",hideLoader,{once:true});
})();
