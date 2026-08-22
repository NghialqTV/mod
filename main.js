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
              <div class="title-row">
                <b>${i.name}</b>
                ${i.platform ? `
                  <span class="platform-badge ${i.platform}">
                    <img src="assets/icons/${i.platform}.svg" alt="${i.platform === "android" ? "Android" : "iOS"}">
                    <span>${i.platform === "android" ? "Android" : "iOS"}</span>
                  </span>
                ` : ""}
              </div>
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


/* ===== PROFESSIONAL PAGE LOADER ===== */
(function(){
  const loader = document.getElementById("page-loader");
  if(!loader) return;

  const startedAt = performance.now();
  const MIN_TIME = 850;

  function hideLoader(){
    const elapsed = performance.now() - startedAt;
    const wait = Math.max(0, MIN_TIME - elapsed);
    setTimeout(() => {
      loader.classList.add("hide");
      setTimeout(() => loader.remove(), 500);
    }, wait);
  }

  if(document.readyState === "complete"){
    hideLoader();
  }else{
    window.addEventListener("load", hideLoader, {once:true});
  }
})();
