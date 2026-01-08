function showTab(id){
 document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
 document.getElementById(id).classList.add('active');
}
showTab('apps');

function render(url, target, bigImg=false){
 fetch(url).then(r=>r.json()).then(data=>{
  document.getElementById(target).innerHTML = data.map(i=>`
   <div class="card">
     <img src="${i.icon}">
     <div>
       <b>${i.name}</b>
       <div>${i.version}</div>
     </div>
     <a href="${i.link}" target="_blank">⬇</a>
   </div>
   ${bigImg && i.banner ? `<div class="file-banner"><img src="${i.banner}"></div>` : ``}
  `).join('');
 });
}

render('data/apps.json','apps');
render('data/keys.json','keys');
render('data/files.json','files', true);

window.addEventListener("load",()=>{document.body.classList.add("loaded");});

function toggleDark(){
 document.body.classList.toggle("dark");
 localStorage.setItem("dark",document.body.classList.contains("dark"));
}
if(localStorage.getItem("dark")==="true"){document.body.classList.add("dark");}

const petals=document.getElementById("petals");
setInterval(()=>{
 const p=document.createElement("div");
 p.className="petal";
 p.innerText="🌼";
 p.style.left=Math.random()*100+"vw";
 p.style.animationDuration=5+Math.random()*5+"s";
 petals.appendChild(p);
 setTimeout(()=>p.remove(),10000);
},500);
