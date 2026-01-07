teleBtn.href=SOCIAL.telegram;
ytBtn.href=SOCIAL.youtube;

apps.innerHTML=APPS.map(a=>`
<div class="card">
 <img src="${a.logo}">
 <div>
  <b>${a.name}</b>
  <div>Version: ${a.version}</div>
  <a class="btn" href="${a.link}">Tải</a>
 </div>
</div>`).join("");

const imgs=["assets/img/mai1.png","assets/img/mai2.png","assets/img/mai3.png"];
const box=document.getElementById("mai-container");
setInterval(()=>{
 const d=document.createElement("div");
 d.className="mai";
 d.style.left=Math.random()*100+"vw";
 d.style.width=d.style.height=(Math.random()*24+32)+"px";
 d.style.animationDuration=(Math.random()*6+6)+"s";
 d.style.backgroundImage=`url(${imgs[Math.floor(Math.random()*imgs.length)]})`;
 box.appendChild(d);
 setTimeout(()=>d.remove(),12000);
},500);
