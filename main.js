/* ===== RENDER APP + GET KEY ===== */
function renderApps(){
  fetch("data/apps.json?v=" + Date.now(), {cache:"no-store"})
    .then(res => {
      if(!res.ok) throw new Error("Fetch lỗi apps.json");
      return res.json();
    })
    .then(data => {
      document.getElementById("apps").innerHTML = data.map((i, index) => {
        const keyLink = i.keyLink || "";
        const hasKey = keyLink.trim() !== "";
        const bg = i.banner || i.icon || "assets/icons/app.png";
        return `
          <article class="app-card" style="--app-bg:url('${bg}')">
            <div class="app-bg"></div>
            <div class="app-overlay"></div>
            <div class="app-content">
              <div class="app-top">
                <img class="app-icon" src="${i.icon}" alt="">
                <span class="platform-badge">${i.platform || (i.name.toLowerCase().includes("ios") ? " iOS" : "Android")}</span>
              </div>
              <div class="app-info">
                <h3>${i.name}</h3>
                <p>${i.version || ""}</p>
              </div>
              <div class="app-actions">
                <a class="btn-download" href="${i.link}" target="_blank" rel="noopener">
                  <span>Tải Xuống</span><span class="btn-icon">⇩</span>
                </a>
                ${hasKey ? `
                <a class="btn-key" href="${keyLink}" target="_blank" rel="noopener">
                  <span class="key-symbol">🔑</span><span>Get Key</span>
                </a>` : `
                <span class="btn-key disabled"><span class="key-symbol">🔒</span><span>NO KEY</span></span>`}
              </div>
            </div>
          </article>`;
      }).join("");
    })
    .catch(err => {
      document.getElementById("apps").innerHTML =
        `<div style="color:red">Lỗi load dữ liệu</div>`;
      console.error(err);
    });
}

function renderKeys(){
  fetch("data/keys.json?v=" + Date.now(), {cache:"no-store"})
    .then(res => {
      if(!res.ok) throw new Error("Fetch lỗi keys.json");
      return res.json();
    })
    .then(data => {
      document.getElementById("keys").innerHTML = data.map(i => {
        const bg = i.banner || i.icon || "assets/icons/key.png";
        return `
          <article class="key-card" style="--key-bg:url('${bg}')">
            <div class="key-bg"></div>
            <div class="key-overlay"></div>
            <div class="key-content">
              <img class="key-icon" src="${i.icon}" alt="">
              <div class="key-info">
                <b>${i.name}</b>
                <span>${i.version || ""}</span>
              </div>
              <a class="btn-key only" href="${i.link}" target="_blank" rel="noopener">
                <span class="key-symbol">🔑</span><span>Get Key</span>
              </a>
            </div>
          </article>`;
      }).join("");
    })
    .catch(err => {
      document.getElementById("keys").innerHTML =
        `<div style="color:red">Lỗi load dữ liệu</div>`;
      console.error(err);
    });
}

renderApps();
renderKeys();

function renderFiles(){
  fetch("data/files.json")
    .then(res => res.json())
    .then(files => {
      document.getElementById("files").innerHTML =
        files.map(f => `
          <div class="card">
            <img class="icon" src="${f.icon}">
            <div class="info">
              <b>${f.name}</b>
              <div>${f.version}</div>
            </div>
            <a href="${f.link}">✓</a>
          </div>

          ${f.banner ? `
            <div class="file-banner">
              <img src="${f.banner}">
            </div>
          ` : ``}
        `).join("");
    });
}

renderFiles();
/* ===== DARK MODE ===== */
if(localStorage.getItem("dark") === "true"){
  document.body.classList.add("dark");
}

/* ===== PAGE LOAD ===== */
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

/* ===== HOA MAI RƠI TỰ DO ===== */
const maiFall = document.getElementById("mai-fall");

function createMai(){
  const m = document.createElement("div");
  m.className = "mai";
  m.innerText = "🌟"; // hoặc "💰"

  m.style.left = Math.random() * 100 + "vw";
  m.style.fontSize = (14 + Math.random() * 10) + "px";
  m.style.animationDuration = (5 + Math.random() * 4) + "s";
  m.style.opacity = Math.random() * 0.6 + 0.4;

  maiFall.appendChild(m);

  setTimeout(() => m.remove(), 10000);
}

setInterval(createMai, 500);

/* ===== MOD SKIN DATA ===== */
fetch("data/mods.json")
  .then(res => res.json())
  .then(mods => {
    document.getElementById("mods").innerHTML =
      mods.map(m => `
        <a href="${m.link}" class="mod-item">
          ${m.icon ? `<img src="${m.icon}">` : ""}
          <span>${m.name}</span>
        </a>
      `).join("");
  });
/* ===== VOICE + MUSIC ===== */
const enterBtn = document.getElementById("enterBtn");
const welcomeScreen = document.getElementById("welcome-screen");
const bgMusic = document.getElementById("bgMusic");

function speakWelcome(){
  const msg = new SpeechSynthesisUtterance(
    "Thông Báo Từ ADMIN , Anh Em Vào Nó Nhảy Quảng Cáo Thì Quay Trở Lại Trang Nhé !"
  );
  msg.lang = "vi-VN";
  msg.volum = 2;
  msg.rate = 1.1;
  msg.pitch = 1.3;
  speechSynthesis.speak(msg);
}

enterBtn.addEventListener("click", () => {
  // Ẩn màn hình chào
  welcomeScreen.style.display = "none";

  // Giọng nói
  speakWelcome();

  // Nhạc nền
  bgMusic.volume = 0.4;
  bgMusic.play().catch(()=>{});
});
/* ===== TOGGLE DARK MODE ===== */
const toggle = document.getElementById("darkToggle");

if(toggle){
  toggle.onclick = () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(
      "dark",
      document.body.classList.contains("dark")
    );
  };
}
