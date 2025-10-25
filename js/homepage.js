document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.getElementById('menuIcon');
  const navMobile = document.getElementById('navMobile');
  const desktopMenuIcon = document.getElementById('desktopMenuIcon');
  const desktopDropdown = document.getElementById('desktopDropdown');

  // เมนูมือถือ
  menuIcon.addEventListener('click', () => {
    navMobile.classList.toggle('active');
  });

  // เมนู feedback/summary ในคอม
  desktopMenuIcon.addEventListener('click', (event) => {
    event.stopPropagation(); // ป้องกันการปิดเมนูทันที
    desktopDropdown.classList.toggle('show');
  });

  // คลิกที่อื่นเพื่อปิด dropdown
  document.addEventListener('click', (event) => {
    if (!desktopMenuIcon.contains(event.target) && !desktopDropdown.contains(event.target)) {
      desktopDropdown.classList.remove('show');
    }
  });








    
  //--About-Festival--//

  function startSlider(slider1) {
    let counter = 1;
    setInterval(() => {
      document.querySelector(`.${slider1} #radio` + counter).checked = true;
      counter++;
      if (counter > 4) counter = 1;
    }, 5000);
  }
  startSlider("slider1");

  //--Review--//

  const reviewSlider = document.getElementById("reviewSlider");
  const reviewCards = reviewSlider.querySelectorAll(".review-card");
  const reviewNextBtn = document.getElementById("slideBtn");
  let reviewIndex = 0;

  function getReviewCardWidth() {
    const style = getComputedStyle(reviewCards[0]);
    return reviewCards[0].offsetWidth + parseInt(style.marginLeft) + parseInt(style.marginRight);
  }

  reviewNextBtn.addEventListener("click", () => {
    const cardWidth = getReviewCardWidth();
    const cardsPerPage = 4;
    const maxIndex = reviewCards.length - cardsPerPage;

    reviewIndex += cardsPerPage;
    if (reviewIndex > maxIndex) reviewIndex = 0;

    reviewSlider.style.transform = `translateX(-${reviewIndex * cardWidth}px)`;
  });
});