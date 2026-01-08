/* ===== SAFE FETCH ===== */
async function safeFetch(url){
  const res = await fetch(url);
  if(!res.ok) throw new Error("Không tải được: " + url);
  return res.json();
}

/* ===== RENDER CHUNG ===== */
async function render(url, boxId){
  try{
    const data = await safeFetch(url);
    document.getElementById(boxId).innerHTML =
      data.map(i => `
        <div class="card">
          <img class="icon" src="${i.icon}" loading="lazy">
          <div class="info">
            <b>${i.name}</b>
            <div>${i.version || ""}</div>
          </div>
          <a href="${i.link}" target="_blank">⬇</a>
        </div>
      `).join("");
  }catch(e){
    document.getElementById(boxId).innerHTML =
      `<p style="text-align:center;opacity:.6">Không có dữ liệu</p>`;
  }
}

render("data/apps.json","apps");
render("data/keys.json","keys");

/* ===== FILE MOD – FIX TUYỆT ĐỐI ẢNH TRẮNG ===== */
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
            <a href="${f.link}">⬇</a>
          </div>

          <div class="file-banner" ${!f.banner ? 'style="display:none"' : ''}>
            ${f.banner ? `<img src="${f.banner}" onerror="this.parentElement.remove()">` : ``}
          </div>
        `).join("");
    });
}
/* ===== HOA MAI RƠI ===== */
const maiFall = document.getElementById("mai-fall");

function createMai(){
  const m = document.createElement("div");
  m.className = "mai";
  m.textContent = "🌼";
  m.style.left = Math.random()*100+"vw";
  m.style.fontSize = 14 + Math.random()*10 + "px";
  m.style.animationDuration = 5 + Math.random()*4 + "s";
  maiFall.appendChild(m);
  setTimeout(()=>m.remove(),10000);
}

setInterval(createMai,600);
