/*
  feedback_beacon.js
  - ใช้ FormData + await fetch
  - ถ้า fetch ล้มเหลว จะ fallback เป็น navigator.sendBeacon
  - ถ้ายังไม่ได้ จะdelay และส่งแบบฟอร์มซ่อน (สุดท้าย)
*/

(function(){
  const form = document.getElementById('feedbackForm');
  const err = document.getElementById('feedbackError');
  const stars = document.getElementById('stars');
  const starsFill = document.getElementById('starsFill');
  const score = document.getElementById('score');
  const ratingEl = document.getElementById('rating');
  const btnClean = document.getElementById('btnClean');

  let v = 0;

  function rate(x){
    if(!stars) return;
    const rect = stars.getBoundingClientRect();
    let p = x - rect.left;
    if (p < 0) p = 0;
    if (p > rect.width) p = rect.width;
    v = Math.round((p/rect.width*5)*2)/2;
    if (starsFill) starsFill.style.width = (v/5*100) + '%';
    if (score) score.textContent = v ? v : '0';
    if (ratingEl) ratingEl.value = v;
  }

  if (stars) stars.addEventListener('click', e => { rate(e.clientX); });

  if (btnClean) btnClean.addEventListener('click', () => {
    const name = document.getElementById('name');
    const msg = document.getElementById('message');
    if (name) name.value = '';
    if (msg) msg.value = '';
    if (err) err.style.display = 'none';
    rate(0);
  });

  function trySendBeacon(url, formData) {
    try {
      return navigator && typeof navigator.sendBeacon === 'function' && navigator.sendBeacon(url, formData);
    } catch (e) {
      return false;
    }
  }

  if (form) {
    form.onsubmit = async function(e) {
      e.preventDefault();
      if (err) { err.style.display = 'none'; err.textContent = ''; }

      const nameEl = document.getElementById('name');
      const msgEl = document.getElementById('message');

      const name = nameEl ? nameEl.value.trim() : '';
      const message = msgEl ? msgEl.value.trim() : '';
      const ratingVal = ratingEl ? ratingEl.value : (v || 0);

      if (!name) {
        err.textContent = '⚠️ Please enter your name.';
        err.style.display = 'block';
        return;
      }
      if (!message) {
        err.textContent = '⚠️ Please enter your message.';
        err.style.display = 'block';
        return;
      }
      if (!ratingVal || Number(ratingVal) <= 0) {
        err.textContent = '⚠️ Please give us a star rating.';
        err.style.display = 'block';
        return;
      }

      try {
        const k = 'ourFestival.reviews.v1';
        const arr = JSON.parse(localStorage.getItem(k) || '[]');
        arr.unshift({ name: name, message: message, rating: ratingVal, ts: Date.now() });
        localStorage.setItem(k, JSON.stringify(arr));
      } catch (e) {}

      const fd = new FormData();
      fd.append('name', name);
      fd.append('message', message);
      fd.append('rating', ratingVal);

      const url = 'server/submit-feedback.php';

      let controller = null;
      let fetchOk = false;
      try {
        if (window.AbortController) {
          controller = new AbortController();
          setTimeout(() => { 
            try { controller.abort(); } catch(e){} 
          }, 8000);
        }

        const resp = await fetch(url, {
          method: 'POST',
          body: fd,
          credentials: 'same-origin',
          signal: controller ? controller.signal : undefined
        });

        if (resp && resp.ok) {
          try { await resp.json(); } catch(e){}
          fetchOk = true;
        }
      } catch (fetchErr) {}

      if (fetchOk) {
        window.location.href = 'index.html#reviewsSection';
        return;
      }

      let beaconOk = false;
      if (navigator && typeof navigator.sendBeacon === 'function') {
        try {
          const params = new URLSearchParams();
          for (const pair of fd.entries()) {
            params.append(pair[0], pair[1]);
          }
          beaconOk = trySendBeacon(url, params);
        } catch (be) {
          beaconOk = false;
        }
      }

      if (beaconOk) {
        setTimeout(() => window.location.href = 'index.html#reviewsSection', 300);
        return;
      }

      if (err) { err.textContent = 'Submitting...'; err.style.display = 'block'; }
      setTimeout(() => {
        try {
          const hidden = document.createElement('form');
          hidden.method = 'POST';
          hidden.action = url;
          hidden.style.display = 'none';

          const i1 = document.createElement('input'); i1.name = 'name'; i1.value = name; hidden.appendChild(i1);
          const i2 = document.createElement('input'); i2.name = 'message'; i2.value = message; hidden.appendChild(i2);
          const i3 = document.createElement('input'); i3.name = 'rating'; i3.value = ratingVal; hidden.appendChild(i3);

          document.body.appendChild(hidden);
          hidden.submit();
        } catch (e) {
          alert('Could not submit. Try again.');
        }
      }, 600);
    };
  }
})();
