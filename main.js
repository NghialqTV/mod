/* ===== MONETAG ADS ===== */

function openWithAd(url){

  // chống spam
  if(window.adLoading) return;

  window.adLoading = true;

  // mở quảng cáo trực tiếp
  const ad = window.open(
    "https://omg10.com/4/11023287",
    "_blank"
  );

  // nếu bị chặn popup thì mở cùng tab
  if(!ad || ad.closed || typeof ad.closed == "undefined"){
    window.location.href = "https://omg10.com/4/11023287";
    return;
  }

  // mở link chính sau ads
  setTimeout(() => {
    window.location.href = url;
  }, 1200);

  // reset
  setTimeout(() => {
    window.adLoading = false;
  }, 3000);
}

/* ===== RENDER DATA ===== */

function render(url, boxId){

  fetch(url + "?v=" + Date.now(), {
    cache: "no-store"
  })

  .then(res => {

    if(!res.ok)
      throw new Error("Fetch lỗi " + url);

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

          <a href="#"
             onclick="openWithAd('${i.link}'); return false;">
             ✓
          </a>

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

/* ===== FILES ===== */

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

            <a href="#"
               onclick="openWithAd('${f.link}'); return false;">
               ✓
            </a>

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

/* ===== HOA MAI RƠI ===== */

const maiFall = document.getElementById("mai-fall");

function createMai(){

  const m = document.createElement("div");

  m.className = "mai";

  m.innerText = "💸";

  m.style.left = Math.random() * 100 + "vw";
  m.style.fontSize = (14 + Math.random() * 10) + "px";
  m.style.animationDuration = (5 + Math.random() * 4) + "s";
  m.style.opacity = Math.random() * 0.6 + 0.4;

  maiFall.appendChild(m);

  setTimeout(() => m.remove(), 10000);

}

setInterval(createMai, 500);

/* ===== MOD SKIN ===== */

fetch("data/mods.json")

  .then(res => res.json())

  .then(mods => {

    document.getElementById("mods").innerHTML =

      mods.map(m => `

        <a href="#"
           class="mod-item"
           onclick="openWithAd('${m.link}'); return false;">

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
    "Thông Báo Từ ADMIN. Anh Em Chịu Khó Vượt Link Để ADMIN Kiếm Tiền Cưới Vợ Nhé."
  );

  msg.lang = "vi-VN";
  msg.volume = 1;
  msg.rate = 1.1;
  msg.pitch = 1.3;

  speechSynthesis.speak(msg);

}

enterBtn.addEventListener("click", () => {

  welcomeScreen.style.display = "none";

  speakWelcome();

  bgMusic
