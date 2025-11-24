
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedbackForm');
  const err = document.getElementById('feedbackError');
  const submitBtn = form.querySelector('button[type="submit"]');

  const stars = document.getElementById('stars');
  const starsFill = document.getElementById('starsFill');
  const score = document.getElementById('score');
  const ratingInput = document.getElementById('rating');
  const btnClean = document.getElementById('btnClean');

 
  function resetBtn() {
    submitBtn.dataset.sending = '0';
    submitBtn.disabled = false;
  }

 
  function showError(msg){
    if (!err) return;
    err.className = "error";
    err.textContent = msg;
    err.style.display = 'block';
  }
  function showSuccess(msg){
    if (!err) return;
    err.className = "success";
    err.textContent = msg;
    err.style.display = 'block';
  }

 
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
    if (ratingInput) ratingInput.value = v;
  }
  if (stars) stars.addEventListener('click', e => { rate(e.clientX); });
  if (btnClean) btnClean.addEventListener('click', () => {
    const name = document.getElementById('name');
    const msg = document.getElementById('message');
    if (name) name.value = '';
    if (msg) msg.value = '';
    if (err) { err.style.display = 'none'; err.textContent = ''; }
    rate(0);
  });

  
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (submitBtn.dataset.sending === '1') return;
    submitBtn.dataset.sending = '1';
    submitBtn.disabled = true;

   
    const name = (document.getElementById("name")?.value || '').trim();
    const message = (document.getElementById("message")?.value || '').trim();
    const rating = (ratingInput?.value || v || 0);

   
    if (err) { err.textContent = ""; err.style.display = 'none'; }

    
    if (!name) { showError("⚠️ Please enter your name."); resetBtn(); return; }
    if (!message) { showError("⚠️ Please enter your message."); resetBtn(); return; }
    if (!rating || isNaN(rating) || Number(rating) <= 0) { showError("⚠️ Please give us a star rating."); resetBtn(); return; }

    
    try {
      const key = 'ourFestival.reviews.v1';
      const arr = JSON.parse(localStorage.getItem(key) || '[]');
      arr.unshift({ name: name, message: message, rating: rating, ts: Date.now() });
      localStorage.setItem(key, JSON.stringify(arr));
    } catch (errLocal) {
      console.warn('localStorage write failed', errLocal);
    }


    const payload = {
      name: name,
      message: message,
      rating: rating
    };

    
    fetch('server/submit-feedback.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(r => r.json())
    .then(j => {
      if (!j || !j.ok) {
        console.warn('Server rejected feedback', j);
        showError('⚠️ Server error — feedback not saved.');
        resetBtn();
        return;
      }
     
      showSuccess('✅ Feedback sent! Redirecting...');
      setTimeout(() => {
        
        window.location.href = 'index.html#reviewsSection';
      }, 1200);
    })
    .catch(errFetch => {
      console.warn('Could not send feedback to server', errFetch);
      
      try {
        
        const fd = new FormData();
        fd.append('name', name);
        fd.append('message', message);
        fd.append('rating', rating);
        
        if (navigator && typeof navigator.sendBeacon === 'function') {
          const params = new URLSearchParams();
          params.append('name', name);
          params.append('message', message);
          params.append('rating', rating);
          navigator.sendBeacon('server/submit-feedback.php', params);
        } else {
        
          fetch('server/submit-feedback.php', { method: 'POST', body: fd, credentials: 'same-origin' })
            .then(()=>{})
            .catch(()=>{});
        }
      } catch(e) {
        console.warn('Fallback send failed', e);
      }
      showError('⚠️ Network error — please try again or use another browser.');
      resetBtn();
    });
  });
});
