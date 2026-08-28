fetch("data/resources.json?v=" + Date.now())
  .then(res => res.json())
  .then(list => {
    document.getElementById("resources").innerHTML =
      list.map(i => `
        <div class="card">
          <img class="icon" src="${i.icon}">
          <div class="info">
            <b>${i.name}</b>
            <div>${i.version || ""}</div>
          </div>
          <a href="${i.link}" data-tiktok-gate target="_blank" rel="noopener">✓</a>
        </div>

        ${i.banner ? `
          <div class="file-banner">
            <img src="${i.banner}">
          </div>
        ` : ``}
      `).join("");
  });
