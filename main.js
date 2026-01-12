/* ===== RENDER DATA ===== */
function render(url, boxId){
  fetch(url + "?v=" + Date.now(), { cache: "no-store" })
    .then(res => {
      if(!res.ok) throw new Error("Fetch lỗi " + url);
      return res.json();
    })
    .then(data => {
      document.getElementById(boxId).innerHTML =
        data.map(i => `
          <div class="card">
            <img class="icon" src="${i.icon}">
            <div class="info">
              <b>${i.name}</b>
              <div>${i.version || ""}</div>
            </div>
            <a href="${i.link}" target="_blank">✓</a>
          </div>
        `).join("");
    })
    .catch(err => {
      document.getElementById(boxId).innerHTML =
        `<div style="color:red">Lỗi load dữ liệu</div>`;
      console.error(err);
    });
}

render("data/apps.json", "apps");
render("data/keys.json", "keys");
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
  m.innerText = "🌼";

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
    "Thông Báo Từ ADMIN.Anh Em Chịu Khó Vượt Link Để ADMIN Kiếm Tiền Ăn Tết Nhé . Ahihi"
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
