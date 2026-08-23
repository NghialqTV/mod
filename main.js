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
  const text = escapeHtml(item.note.replace(/^[\\s]*(?:⚠️|📋|📔)+[\\s]*/u, ""));

  const icon = item.noteType === "warning"
    ? `<span class="notice-icon notice-icon-warning" aria-hidden="true">
         <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
           <path d="M12 3.25 21.1 19a1.35 1.35 0 0 1-1.17 2.03H4.07A1.35 1.35 0 0 1 2.9 19L12 3.25Z" fill="currentColor"/>
           <path d="M12 8v5.2M12 16.8v.2" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
         </svg>
       </span>`
    : `<span class="notice-icon notice-icon-list" aria-hidden="true">
         <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
           <path d="M7 4.5h10a1.5 1.5 0 0 1 1.5 1.5v12A1.5 1.5 0 0 1 17 19.5H7A1.5 1.5 0 0 1 5.5 18V6A1.5 1.5 0 0 1 7 4.5Z"/>
           <path d="m8.2 9 1.2 1.2 2-2M13.5 9h3M8.2 13l1.2 1.2 2-2M13.5 13h3M8.2 17l1.2 1.2 2-2M13.5 17h3"/>
         </svg>
       </span>`;

  if(item.noteLink){
    return `<a class="${cls} notice-link" href="${escapeHtml(item.noteLink)}" target="_blank" rel="noopener">
      ${icon}<span class="notice-text">${text}</span><span class="notice-arrow" aria-hidden="true">↗</span>
    </a>`;
  }

  if(item.noteAction === "map-warning"){
    return `<button type="button" class="${cls} notice-button" data-open-map-warning>
      ${icon}<span class="notice-text">${text}</span><span class="notice-arrow" aria-hidden="true">›</span>
    </button>`;
  }

  return `<div class="${cls}">${icon}<span class="notice-text">${text}</span></div>`;
}

function render(url, boxId){
  fetch(url + "?v=" + Date.now(), { cache: "no-store" })
    .then(res => {
      if(!res.ok) throw new Error("Fetch lỗi " + url);
      return res.json();
    })
    .then(data => {
      document.getElementById(boxId).innerHTML = data.map((i, index) => `
        <article class="card app-card ${boxId === "keys" ? `key-card key-card-${escapeHtml(String(i.platform || "ios").toLowerCase())}` : ""}" style="--card-index:${index}">
          <div class="card-main">
            <img class="icon ${boxId === "keys" ? "key-icon" : ""}" src="${escapeHtml(i.icon || "assets/icons/app.png")}" alt="">
            <div class="info">
              <b class="app-name">${escapeHtml(i.name)}</b>
              <div class="update-line">• ${escapeHtml(i.version || "")}</div>
              <div class="meta-row">
                ${platformBadge(i.platform)}
                ${previewButton(i)}
              </div>
            </div>
            <a class="${boxId === "keys" ? "download-btn key-open-btn" : "download-btn"}" href="${escapeHtml(i.link || "#")}" target="_blank" rel="noopener" aria-label="${boxId === "keys" ? "Mở Get Key" : "Tải xuống"}">
              <span class="${boxId === "keys" ? "key-open-icon" : "download-icon"}" aria-hidden="true">${boxId === "keys" ? "↗" : "⇩"}</span>
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
              <span class="download-icon" aria-hidden="true">⇩</span>
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
initSiteVisitStats();


/* ===== MAP WARNING MODAL ===== */
const mapWarningModal = document.getElementById("map-warning-modal");
function openMapWarning(){
  if(!mapWarningModal) return;
  mapWarningModal.classList.add("show");
  mapWarningModal.setAttribute("aria-hidden","false");
  document.body.classList.add("modal-open");
}
function closeMapWarning(){
  if(!mapWarningModal) return;
  mapWarningModal.classList.remove("show");
  mapWarningModal.setAttribute("aria-hidden","true");
  document.body.classList.remove("modal-open");
}
document.addEventListener("click", e => {
  if(e.target.closest("[data-open-map-warning]")) openMapWarning();
  if(e.target.closest("[data-close-map-warning]")) closeMapWarning();
});
document.addEventListener("keydown", e => {
  if(e.key === "Escape") closeMapWarning();
});

/* ===== DARK MODE ===== */
if(localStorage.getItem("dark") === "true"){
  document.body.classList.add("dark");
}

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


/* ===== SITE VISIT STATISTICS =====
   CounterAPI được dùng để đồng bộ lượt truy cập giữa các thiết bị.
   Nếu API tạm thời không phản hồi, hệ thống tự dùng bộ đếm local làm dự phòng.
*/
async function initSiteVisitStats(){
  const totalEl = document.getElementById("total-visits");
  const todayEl = document.getElementById("today-visits");
  if(!totalEl || !todayEl) return;

  const namespace = "nghialqtv-web";
  const now = new Date();
  const dateKey = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
  const formatNumber = n => Number(n || 0).toLocaleString("vi-VN");

  try{
    const [totalRes, todayRes] = await Promise.all([
      fetch(`https://api.counterapi.dev/v1/${namespace}/total/up`, {cache:"no-store"}),
      fetch(`https://api.counterapi.dev/v1/${namespace}/today-${dateKey}/up`, {cache:"no-store"})
    ]);

    if(!totalRes.ok || !todayRes.ok) throw new Error("Counter API unavailable");

    const totalData = await totalRes.json();
    const todayData = await todayRes.json();
    const total = Number(totalData.count ?? totalData.up_count ?? 0);
    const today = Number(todayData.count ?? todayData.up_count ?? 0);

    totalEl.textContent = formatNumber(total);
    todayEl.textContent = `+${formatNumber(today)}`;
    return;
  }catch(error){
    console.warn("Không thể đồng bộ lượt truy cập online, dùng bộ đếm cục bộ.", error);
  }

  const localTotalKey = "nghialqtv_total_visits_local";
  const localDateKey = "nghialqtv_today_date";
  const localTodayKey = "nghialqtv_today_visits";
  const storedDate = localStorage.getItem(localDateKey);

  let total = Number(localStorage.getItem(localTotalKey) || 0) + 1;
  let today = storedDate === dateKey ? Number(localStorage.getItem(localTodayKey) || 0) + 1 : 1;

  localStorage.setItem(localTotalKey, String(total));
  localStorage.setItem(localDateKey, dateKey);
  localStorage.setItem(localTodayKey, String(today));

  totalEl.textContent = formatNumber(total);
  todayEl.textContent = `+${formatNumber(today)}`;
}
