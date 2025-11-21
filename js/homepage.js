document.addEventListener("DOMContentLoaded", async () => {

  // ------------------- เมนู -------------------
  const menuIcon = document.getElementById('menuIcon');
  const navMobile = document.getElementById('navMobile');
  const desktopMenuIcon = document.getElementById('desktopMenuIcon');
  const desktopDropdown = document.getElementById('desktopDropdown');

  menuIcon.addEventListener('click', () => navMobile.classList.toggle('active'));
  desktopMenuIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    desktopDropdown.classList.toggle('show');
  });
  document.addEventListener('click', (e) => {
    if (!desktopMenuIcon.contains(e.target) && !desktopDropdown.contains(e.target)) {
      desktopDropdown.classList.remove('show');
    }
  });

  // ------------------- ตัวแปรรีวิว -------------------
  let reviews = [];

  const avgStarEl = document.getElementById('avgStar');
  const noReviewEl = document.getElementById('noReview');
  const viewportEl = document.getElementById('reviewViewport');
  const trackEl = document.getElementById('reviewTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  // ------------------- โหลดรีวิวจาก server -------------------
  async function loadReviewsFromServer() {
    try {
      const res = await fetch("server/feedback.json", { cache: "no-store" });
      const data = await res.json();

      // feedback.json = [{ name, message, rating }]
      reviews = data.map(item => ({
        n: item.name,
        m: item.message,
        v: item.rating
      }));

    } catch (err) {
      console.error("โหลดรีวิวจาก server ไม่ได้:", err);
      reviews = [];
    }
  }

  // ------------------- ฟังก์ชันช่วย -------------------
  function buildStars(score) {
    const full = Math.floor(score);
    const half = score - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return "★".repeat(full) + (half ? "☆" : "") + "☆".repeat(empty);
  }

  function formatAvg(v) {
    return (Math.round(v * 10) / 10).toString().replace(/\.0$/, "");
  }

  // ------------------- แสดงผลรีวิว -------------------
  function render() {
    // avg
    if (reviews.length === 0) {
      avgStarEl.textContent = "0/5";
    } else {
      const sum = reviews.reduce((acc, r) => acc + Number(r.v || 0), 0);
      const avg = sum / reviews.length;
      avgStarEl.textContent = `${formatAvg(avg)}/5`;
    }

    // สร้างการ์ด
    trackEl.innerHTML = "";

    if (reviews.length === 0) {
      noReviewEl.hidden = false;
    } else {
      noReviewEl.hidden = true;

      reviews.forEach(r => {
        const card = document.createElement("div");
        card.className = "review-card";

        const starRow = document.createElement("div");
        starRow.className = "review-stars-row";

        const stars = document.createElement("span");
        stars.className = "stars";
        stars.textContent = buildStars(Number(r.v || 0));

        const score = document.createElement("span");
        score.textContent = ` ${r.v}/5`;

        const msg = document.createElement("p");
        msg.className = "review-message";
        msg.textContent = r.m;

        const name = document.createElement("div");
        name.className = "review-name";
        name.textContent = r.n;

        starRow.appendChild(stars);
        starRow.appendChild(score);

        card.appendChild(starRow);
        card.appendChild(msg);
        card.appendChild(name);

        trackEl.appendChild(card);
      });
    }

    updateArrows();
  }

  // ------------------- ปุ่มเลื่อน -------------------
 
function startSlider(sliderClass) {
  // รอ DOM ยืนยัน element ของ slider
  const sliderContainer = document.querySelector(`.${sliderClass}`);
  if (!sliderContainer) {
    console.warn('startSlider: container not found for', sliderClass);
    return;
  }
  
  const radios = sliderContainer.querySelectorAll('.slides1 input[type="radio"][id^="radio"]');
  if (!radios || radios.length === 0) {
    console.warn('startSlider: no radios found inside', sliderClass);
    return;
  }

  let idx = 0;

  radios[0].checked = true;

  setInterval(() => {
    idx = (idx + 1) % radios.length;
    const id = radios[idx].id;
    const el = document.getElementById(id);
    if (el) el.checked = true;
  }, 5000);
}


startSlider('slider1');

  // ------------------- รันจริง -------------------
  await loadReviewsFromServer();
  render();
});
