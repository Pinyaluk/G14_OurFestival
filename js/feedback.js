// feedback.js — ส่งเป็น JSON แบบเดียวกับ Registration.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedbackForm');
  const err = document.getElementById('feedbackError');
  const submitBtn = form.querySelector('button[type="submit"]');

  // star UI elements (ถ้ามี)
  const stars = document.getElementById('stars');
  const starsFill = document.getElementById('starsFill');
  const score = document.getElementById('score');
  const ratingInput = document.getElementById('rating');
  const btnClean = document.getElementById('btnClean');

  // ป้องกัน double-submit
  function resetBtn() {
    submitBtn.dataset.sending = '0';
    submitBtn.disabled = false;
  }

  // ฟังก์ชันแสดง error/success (reuse pattern)
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

  // star rating handler (ถ้ามี UI แบบคลิ๊กแล้วคำนวณ)
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

  // main submit handler — ส่ง JSON แบบ Registration.js
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // ป้องกัน double-submit
    if (submitBtn.dataset.sending === '1') return;
    submitBtn.dataset.sending = '1';
    submitBtn.disabled = true;

    // ดึงค่า input
    const name = (document.getElementById("name")?.value || '').trim();
    const message = (document.getElementById("message")?.value || '').trim();
    const rating = (ratingInput?.value || v || 0);

    // reset message
    if (err) { err.textContent = ""; err.style.display = 'none'; }

    // validation — รักษาฟังก์ชันการตรวจสอบไว้ครบ
    if (!name) { showError("⚠️ Please enter your name."); resetBtn(); return; }
    if (!message) { showError("⚠️ Please enter your message."); resetBtn(); return; }
    if (!rating || isNaN(rating) || Number(rating) <= 0) { showError("⚠️ Please give us a star rating."); resetBtn(); return; }

    // เก็บใน localStorage เหมือนเดิม
    try {
      const key = 'ourFestival.reviews.v1';
      const arr = JSON.parse(localStorage.getItem(key) || '[]');
      arr.unshift({ name: name, message: message, rating: rating, ts: Date.now() });
      localStorage.setItem(key, JSON.stringify(arr));
    } catch (errLocal) {
      console.warn('localStorage write failed', errLocal);
    }

    // เตรียม payload แบบ JSON (เหมือน Registration.js)
    const payload = {
      name: name,
      message: message,
      rating: rating
    };

    // ส่งเป็น JSON ไปที่ submit-feedback.php
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
      // success — แสดงและ redirect (delay แบบ Registration: 1200ms)
      showSuccess('✅ Feedback sent! Redirecting...');
      setTimeout(() => {
        // เลือกหน้า summary ของรีวิว — ปรับให้ตรงกับหน้าในโปรเจคของคุณ
        window.location.href = 'index.html#reviewsSection';
      }, 1200);
    })
    .catch(errFetch => {
      console.warn('Could not send feedback to server', errFetch);
      // ถ้า fetch ล้ม ให้ fallback เป็น FormData/sendBeacon เพื่อความทนทาน (คำสั่งนี้ยังคงรักษา validation)
      try {
        // fallback: send as FormData (attempt)
        const fd = new FormData();
        fd.append('name', name);
        fd.append('message', message);
        fd.append('rating', rating);
        // try navigator.sendBeacon first (good for navigation)
        if (navigator && typeof navigator.sendBeacon === 'function') {
          const params = new URLSearchParams();
          params.append('name', name);
          params.append('message', message);
          params.append('rating', rating);
          navigator.sendBeacon('server/submit-feedback.php', params);
        } else {
          // last attempt: simple fetch without JSON header
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
