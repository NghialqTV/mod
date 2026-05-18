function openWithAd(url){

  window.open(
    "https://omg10.com/4/11023287",
    "_blank"
  );

  setTimeout(() => {
    window.location.href = url;
  }, 500);

}

/* APPS + KEYS */

function render(url, boxId){

  fetch(url + "?v=" + Date.now())

    .then(res => res.json())

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
               onclick="openWithAd('${i.link}');return false;">
               ✓
            </a>

          </div>

        `).join("");

    });

}

render("data/apps.json","apps");
render("data/keys.json","keys");

/* FILES */

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
           onclick="openWithAd('${f.link}');return false;">
           ✓
        </a>

      </div>

    `).join("");

});

/* MODS */

fetch("data/mods.json")

.then(res => res.json())

.then(mods => {

  document.getElementById("mods").innerHTML =

    mods.map(m => `

      <a href="#"
         class="mod-item"
         onclick="openWithAd('${m.link}');return false;">

        ${m.icon ? `<img src="${m.icon}">` : ""}

        <span>${m.name}</span>

      </a>

    `).join("");

});

/* DARK MODE */

if(localStorage.getItem("dark") === "true"){
  document.body.classList.add("dark");
}

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

/* MUSIC */

const enterBtn = document.getElementById("enterBtn");
const welcomeScreen = document.getElementById("welcome-screen");
const bgMusic = document.getElementById("bgMusic");

if(enterBtn){

  enterBtn.onclick = () => {

    welcomeScreen.style.display = "none";

    bgMusic.volume = 0.4;

    bgMusic.play().catch(()=>{});

  };

}
