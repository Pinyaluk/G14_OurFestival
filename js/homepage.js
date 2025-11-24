document.addEventListener("DOMContentLoaded", async () => {

  // ------------------------ ตัวแปร DOM หลัก ------------------------
const trackEl = document.getElementById("reviewTrack");
const viewportEl = document.getElementById("reviewViewport");
const avgStarEl = document.getElementById("avgStar");
const noReviewEl = document.getElementById("noReview");
const btnLeft = document.getElementById("prevBtn");
const btnRight = document.getElementById("nextBtn");


// ------------------------ Carousel ควบคุม ------------------------
let currentIndex = 0;

function updateArrows() {
  const cardCount = trackEl.children.length;
  const cardWidth = trackEl.children[0]?.offsetWidth || 0;
  const viewportWidth = viewportEl.offsetWidth;

  // จำนวนการ์ดที่เห็นได้ใน viewport
  const visibleCount = Math.floor(viewportWidth / cardWidth);

  // ปุ่มซ้าย
  btnLeft.disabled = currentIndex === 0;

  // ปุ่มขวา
  btnRight.disabled = currentIndex >= cardCount - visibleCount;
}

function moveLeft() {
  if (currentIndex > 0) {
    currentIndex--;
    const cardWidth = trackEl.children[0]?.offsetWidth || 0;
    trackEl.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
    updateArrows();
  }
}

function moveRight() {
  const cardCount = trackEl.children.length;
  const cardWidth = trackEl.children[0]?.offsetWidth || 0;
  const viewportWidth = viewportEl.offsetWidth;

  const visibleCount = Math.floor(viewportWidth / cardWidth);

  if (currentIndex < cardCount - visibleCount) {
    currentIndex++;
    trackEl.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
    updateArrows();
  }
}

function attachCarouselControls() {
  btnLeft.addEventListener("click", moveLeft);
  btnRight.addEventListener("click", moveRight);
  window.addEventListener("resize", () => {
    // reset position
    currentIndex = 0;
    trackEl.style.transform = "translateX(0)";
    updateArrows();
  });
}

// ------------------------ โหลดรีวิวจาก Server ------------------------
async function loadReviewsFromServer() {
  try {
    const res = await fetch("server/review.php", { cache: "no-store" });
    if (!res.ok) throw new Error("server error");

    const html = await res.text();

    // สร้าง div ชั่วคราวเพื่อแยก fragment
    const temp = document.createElement("div");
    temp.innerHTML = html.trim();

    const frag = temp.querySelector("#serverReviewFragment");
    if (!frag) {
      trackEl.innerHTML = "";
      avgStarEl.textContent = "0/5";
      noReviewEl.hidden = false;
      return;
    }

    // ใช้เฉพาะเนื้อด้านในของ fragment
    trackEl.innerHTML = frag.innerHTML;

    // อ่านค่า avg / count จาก attribute
    const avg = parseFloat(frag.getAttribute("data-avg") || "0");
    const count = parseInt(frag.getAttribute("data-count") || "0", 10);

    if (count === 0) {
      avgStarEl.textContent = "0/5";
      noReviewEl.hidden = false;
    } else {
      avgStarEl.textContent = `${avg}/5`;
      noReviewEl.hidden = true;
    }

    // reset position / arrows
    currentIndex = 0;
    trackEl.style.transform = "translateX(0)";
    updateArrows();

  } catch (err) {
    console.error("โหลดรีวิวจาก server ไม่ได้:", err);
    trackEl.innerHTML = "";
    avgStarEl.textContent = "0/5";
    noReviewEl.hidden = false;
  }
}

function startSlider(sliderClass) {
   
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

// ------------------------ เรียกใช้งาน ------------------------
(async function init() {
  await loadReviewsFromServer();
  attachCarouselControls();
})();

});
