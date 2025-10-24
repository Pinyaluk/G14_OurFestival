document.addEventListener("DOMContentLoaded", () => {



































































































    
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