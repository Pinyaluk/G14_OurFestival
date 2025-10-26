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

  function loadReviews() {
    try {
      reviews = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  
      if (!Array.isArray(reviews)) reviews = [];
    } catch (_) {
      reviews = [];
    }
  }

  function formatAvg(value) {
    return (Math.round(value * 10) / 10).toString().replace(/\.0$/, '');

  }

  function buildStars(score) {
    const full = Math.floor(score);
    const half = score - full >= 0.5 ? 1 : 0;

    const empty = 5 - full - half;
    return '★'.repeat(full) + (half ? '☆' : '') + '☆'.repeat(empty);
  }



});