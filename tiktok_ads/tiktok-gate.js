(function(){
  const ADS = Array.isArray(window.TIKTOK_AD_LINKS) ? window.TIKTOK_AD_LINKS.filter(Boolean) : [];
  const WAIT_MS = 1800;
  function pick(){ return ADS[Math.floor(Math.random() * ADS.length)]; }
  function go(destination){
    if(!destination) return;
    if(!ADS.length){ window.location.href = destination; return; }
    const ad = pick();
    try { sessionStorage.setItem('tiktok_return_url', destination); } catch(e) {}
    const popup = window.open(ad, '_blank', 'noopener,noreferrer');
    if(popup){
      setTimeout(function(){ window.location.href = destination; }, WAIT_MS);
    } else {
      window.location.href = ad;
    }
  }
  window.tiktokAdGate = go;
  document.addEventListener('click', function(e){
    const el = e.target.closest('a[data-tiktok-gate],button[data-tiktok-destination]');
    if(!el) return;
    const dest = el.getAttribute('data-tiktok-destination') || el.getAttribute('href');
    if(!dest || dest.startsWith('#') || dest.startsWith('javascript:')) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    go(dest);
  }, true);
})();
