/* TikTok Ads - 1 ad per user action, then destination */
(function(){
  const ADS = Array.isArray(window.TIKTOK_AD_LINKS)
    ? window.TIKTOK_AD_LINKS.filter(u => /^https?:\/\//i.test(String(u)))
    : [];
  const WAIT_MS = 1800;
  let queue = [];
  let busy = false;

  function refillQueue(){
    queue = ADS.slice();
    for(let i = queue.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
  }

  function pick(){
    if(!queue.length) refillQueue();
    return queue.shift();
  }

  function go(destination){
    if(!destination || busy) return false;
    if(!ADS.length){
      window.location.assign(destination);
      return false;
    }

    busy = true;
    const ad = pick();

    // Open exactly ONE random TikTok link for this action.
    // Because this runs directly from a user click, the popup is normally allowed.
    let adWindow = null;
    try {
      adWindow = window.open(ad, '_blank', 'noopener,noreferrer');
    } catch(e) {}

    // If the browser blocks the new tab, do not leave the user stuck on an ad page.
    // Continue to the requested destination instead.
    setTimeout(function(){
      busy = false;
      window.location.assign(destination);
    }, adWindow ? WAIT_MS : 0);

    return true;
  }

  window.tiktokAdGate = go;

  // Covers dynamically-created download/key/resource links.
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
