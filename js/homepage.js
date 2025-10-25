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

  
  const LS_KEY = 'ourFestival.reviews.v1';

  const avgStarEl = document.getElementById('avgStar');
  const noReviewEl = document.getElementById('noReview');

  const viewportEl = document.getElementById('reviewViewport');
  const trackEl = document.getElementById('reviewTrack');
  const prevBtn = document.getElementById('prevBtn');

  const nextBtn = document.getElementById('nextBtn');

  let reviews = [];



});