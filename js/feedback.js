(function(){

let s = document.getElementById('stars'),
    f = document.getElementById('starsFill'),
    sc = document.getElementById('score'),
    r = document.getElementById('rating'),
    err = document.getElementById('feedbackError');

let v = 0;

// ให้ผู้ใช้กดดาว
function rate(x){
  const rect = s.getBoundingClientRect();
  let p = x - rect.left;
  if (p < 0) p = 0;
  if (p > rect.width) p = rect.width;

  v = Math.round((p / rect.width * 5) * 2) / 2;

  f.style.width = (v / 5 * 100) + '%';
  sc.textContent = v ? v : '0';
  r.value = v;
}

s.addEventListener('click', e => { rate(e.clientX); });

// ปุ่มเคลียร์
document.getElementById('btnClean').onclick = () => {
  document.getElementById('name').value = '';
  document.getElementById('message').value = '';
  err.style.display = 'none';
  rate(0);
};

// ส่งฟอร์ม
document.getElementById('feedbackForm').onsubmit = async function(e){
  e.preventDefault();

  let n = document.getElementById('name').value.trim();
  let m = document.getElementById('message').value.trim();
  let ratingValue = r.value;

  // Validation
  err.style.display = 'none';

  if (!n){
    err.textContent = '⚠️ Please enter your name.';
    err.style.display = 'block';
    return;
  }

  if (!m){
    err.textContent = '⚠️ Please enter your message.';
    err.style.display = 'block';
    return;
  }

  if (!ratingValue || Number(ratingValue) <= 0){
    err.textContent = '⚠️ Please give us a star rating.';
    err.style.display = 'block';
    return;
  }

  // เก็บใน localStorage ด้วย (เหมือนของเดิม)
  let k = 'ourFestival.reviews.v1';
  let a = JSON.parse(localStorage.getItem(k) || '[]');
  a.unshift({ name: n, message: m, rating: ratingValue, ts: Date.now() });
  localStorage.setItem(k, JSON.stringify(a));

  // กำหนด FormData (รองรับ iPhone)
  let fd = new FormData();
  fd.append('name', n);
  fd.append('message', m);
  fd.append('rating', ratingValue);

  try {
    // ส่งข้อมูลไป PHP
    const res = await fetch('server/submit-feedback.php', {
      method: 'POST',
      body: fd,
      credentials: 'same-origin'
    });

    const txt = await res.text();
    console.log("server response:", txt);

    // รอ fetch เสร็จแล้วค่อย redirect (สำคัญมากสำหรับ iPhone)
    window.location.href = 'index.html#reviewsSection';
  } 
  catch (error){
    console.error("Fetch error:", error);
    err.textContent = "⚠️ Network error. Try again.";
    err.style.display = "block";
  }
};

})();
